
const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/chat', (req, res) => {
    console.log('Request Body:', req.body);
    if (!req.body || !req.body.query) {
        return res.status(400).send('Bad Request: query is missing');
    }
    const queryText = req.body.query;

    exec('gcloud auth print-access-token', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error getting access token');
        }
        const accessToken = stdout.trim();
        
        // Use the base endpoint from environment variable
        const baseEndpoint = process.env.AS_API_ENDPOINT;
        const servingConfig = "default_search";
        
        // Check for informal greetings
        const greetingPatterns = [
            /^(hi|hello|hey|howdy|greetings|good morning|good afternoon|good evening|what's up|sup)\b/i,
            /^(how are you|how's it going|how do you do)\b/i,
            /^(thank you|thanks|appreciate it|thank you so much)\b/i,
            /^(goodbye|bye|see you|take care|have a good day)\b/i
        ];
        
        const isGreeting = greetingPatterns.some(pattern => pattern.test(queryText));
        
        // Check if this is a Google Drive files query
        const isGoogleDriveQuery = queryText.toLowerCase().includes('google drive') || 
                                  queryText.toLowerCase().includes('my drive') ||
                                  queryText.toLowerCase().includes('files in drive');
        
        let endpoint;
        let requestBody;
        
        if (isGoogleDriveQuery) {
            // Use search endpoint for Google Drive queries
            endpoint = `${baseEndpoint}/servingConfigs/${servingConfig}:search`;
            requestBody = {
                query: queryText,
                pageSize: 20,
                offset: 0
            };
        } else {
            // Use answer endpoint for other queries
            endpoint = `${baseEndpoint}/servingConfigs/${servingConfig}:answer`;
            
            // Extract session from base endpoint for proper session management
            const endpointParts = baseEndpoint.split('/');
            const projectIndex = endpointParts.indexOf('projects');
            const session = endpointParts.slice(projectIndex, projectIndex + 8).join('/') + '/sessions/-';
            
            requestBody = {
                query: {
                    text: queryText
                },
                session: session,
                relatedQuestionsSpec: {
                    enable: true
                },
                answerGenerationSpec: {
                    modelSpec: {
                        modelVersion: "preview"
                    },
                    promptSpec: {
                        preamble: isGreeting 
                            ? "You are a friendly and professional assistant for a retail beauty store. Respond warmly to greetings and be conversational. You can help with questions about store policies, documents, emails, and calendar management. Keep responses brief but personable."
                            : "You are a helpful assistant that can answer questions about documents, send emails, and create calendar invites. When asked to perform actions, acknowledge the request and explain what action would be taken."
                    },
                    includeCitations: true,
                    ignoreAdversarialQuery: false,
                    ignoreNonAnswerSeekingQuery: false,
                    ignoreLowRelevantContent: isGreeting ? true : false
                },
                searchSpec: {
                    searchParams: {
                        maxReturnResults: isGreeting ? 3 : 10,
                        filter: ""
                    }
                }
            };
        }

        axios.post(endpoint, requestBody, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            let data = response.data;
            console.log('Full API Response:', JSON.stringify(data, null, 2));

            // Enhanced response processing
            const processedResponse = {
                answer: data.answer,
                session: data.session,
                relatedQuestions: data.relatedQuestions,
                answerQueryToken: data.answerQueryToken,
                results: data.results,  // Include search results
                totalSize: data.totalSize
            };

            // Process references and citations for proper document links
            if (data.answer && data.answer.references) {
                // Create a map of references for easy lookup
                const referenceMap = new Map();
                data.answer.references.forEach((ref, index) => {
                    referenceMap.set(index.toString(), ref);
                });

                // Enhance citations with proper document links
                if (data.answer.citations) {
                    console.log('Processing citations with', data.answer.references.length, 'references');
                    data.answer.citations.forEach(citation => {
                        citation.sources.forEach(source => {
                            const refId = source.referenceId;
                            if (refId !== undefined && referenceMap.has(refId)) {
                                const reference = referenceMap.get(refId);
                                
                                // Handle different reference types
                                if (reference.unstructuredDocumentInfo) {
                                    source.uri = reference.unstructuredDocumentInfo.uri;
                                    source.title = reference.unstructuredDocumentInfo.title;
                                    source.documentId = reference.unstructuredDocumentInfo.document;
                                } else if (reference.structuredDocumentInfo) {
                                    const structInfo = reference.structuredDocumentInfo;
                                    source.documentId = structInfo.document;
                                    source.title = structInfo.title || 'Document';
                                    source.uri = structInfo.uri || '#';
                                    
                                    // Check structData for additional info if main fields are missing
                                    if (!source.uri || source.uri === '#') {
                                        if (structInfo.structData) {
                                            source.uri = structInfo.structData.link || structInfo.structData.url || '#';
                                        }
                                    }
                                } else if (reference.chunkInfo) {
                                    source.documentId = reference.chunkInfo.document;
                                    source.title = reference.chunkInfo.documentMetadata?.title || 'Document';
                                    source.uri = reference.chunkInfo.documentMetadata?.uri || '#';
                                }
                            }
                        });
                    });
                }
            }

            // Handle action requests (email, calendar)
            if (data.answer && data.answer.steps) {
                data.answer.steps.forEach(step => {
                    if (step.actions) {
                        step.actions.forEach(action => {
                            // Log action details for debugging
                            console.log('Action detected:', action);
                            
                            // Add action metadata to response
                            if (!processedResponse.detectedActions) {
                                processedResponse.detectedActions = [];
                            }
                            
                            if (action.searchAction) {
                                processedResponse.detectedActions.push({
                                    type: 'search',
                                    query: action.searchAction.query
                                });
                            }
                            // Additional action types can be handled here
                        });
                    }
                });
            }
            
            // Detect action intent from answer text
            if (data.answer && data.answer.answerText) {
                const answerText = data.answer.answerText.toLowerCase();
                const queryLower = queryText.toLowerCase();
                
                // Detect email action
                if ((queryLower.includes('send') && queryLower.includes('email')) || 
                    (queryLower.includes('send') && queryLower.includes('mail'))) {
                    if (!processedResponse.detectedActions) {
                        processedResponse.detectedActions = [];
                    }
                    
                    // Extract email details from query
                    const emailMatch = queryText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                    const recipient = emailMatch ? emailMatch[1] : 'unknown';
                    
                    processedResponse.detectedActions.push({
                        type: 'email',
                        recipient: recipient,
                        subject: 'Extracted from query',
                        requiresConfirmation: true
                    });
                }
                
                // Detect calendar action
                if ((queryLower.includes('schedule') || queryLower.includes('create') || queryLower.includes('send')) && 
                    (queryLower.includes('meeting') || queryLower.includes('invite') || queryLower.includes('calendar'))) {
                    if (!processedResponse.detectedActions) {
                        processedResponse.detectedActions = [];
                    }
                    
                    // Extract recipient from query
                    const emailMatch = queryText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                    const attendee = emailMatch ? emailMatch[1] : 'unknown';
                    
                    // Extract topic if mentioned
                    const topicMatch = queryText.match(/(?:on|about|regarding)\s+(\w+)/i);
                    const topic = topicMatch ? topicMatch[1] : 'Meeting';
                    
                    processedResponse.detectedActions.push({
                        type: 'calendar',
                        attendee: attendee,
                        subject: topic,
                        requiresConfirmation: true
                    });
                }
            }

            res.json(processedResponse);
        })
        .catch(err => {
            console.error('API Error:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
            res.status(500).json({ 
                error: 'Error from Agent Space API',
                details: err.response ? err.response.data : err.message
            });
        });
    });
});

// Endpoint to execute actions (email, calendar) through Agent Space
app.post('/execute-action', async (req, res) => {
    console.log('Execute Action Request:', req.body);
    const { actionType, actionData } = req.body;
    
    exec('gcloud auth print-access-token', async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error getting access token');
        }
        const accessToken = stdout.trim();
        
        try {
            // Use the answer API to execute actions
            const baseEndpoint = process.env.AS_API_ENDPOINT;
            const servingConfig = "default_search";
            const endpoint = `${baseEndpoint}/servingConfigs/${servingConfig}:answer`;
            
            // Extract session from base endpoint
            const endpointParts = baseEndpoint.split('/');
            const projectIndex = endpointParts.indexOf('projects');
            const session = endpointParts.slice(projectIndex, projectIndex + 8).join('/') + '/sessions/-';
            
            // Build a query that triggers the action
            let queryText;
            if (actionType === 'email') {
                queryText = `Send an email to ${actionData.recipient} with subject "${actionData.subject}" and body "${actionData.body}"`;
                console.log('Executing email action via query:', queryText);
            } else if (actionType === 'calendar') {
                queryText = `Create a calendar meeting invite for ${actionData.attendee} with title "${actionData.subject}" and description "${actionData.description || 'Meeting'}"`;
                console.log('Executing calendar action via query:', queryText);
            } else {
                return res.status(400).json({ error: 'Invalid action type' });
            }
            
            const requestBody = {
                query: {
                    text: queryText
                },
                session: session,
                answerGenerationSpec: {
                    modelSpec: {
                        modelVersion: "preview"
                    },
                    promptSpec: {
                        preamble: "You are an AI assistant that can execute actions. When asked to send an email or create a calendar invite, always respond with: 'I will [action description].' For example: 'I will send an email to X with subject Y' or 'I will create a calendar invite for X with title Y'. Always acknowledge the specific action requested."
                    },
                    includeCitations: false
                }
            };
            
            console.log('Calling answer API for action execution');
            
            // Make the API request
            const response = await axios.post(endpoint, requestBody, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Action execution response:', JSON.stringify(response.data, null, 2));
            
            // Process the response
            const result = {
                success: true,
                actionType: actionType,
                message: `${actionType === 'email' ? 'Email' : 'Calendar invite'} action executed successfully!`,
                actionResponse: response.data,
                details: actionData,
                executedQuery: queryText
            };
            
            res.json(result);
            
        } catch (apiError) {
            console.error('API Error:', apiError.response ? JSON.stringify(apiError.response.data, null, 2) : apiError.message);
            res.status(500).json({ 
                error: 'Error from Agent Space API',
                details: apiError.response ? apiError.response.data : apiError.message
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
