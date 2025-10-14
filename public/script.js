document.addEventListener('DOMContentLoaded', () => {
    // Apply brand configuration
    const brand = applyBrand();

    // Set logo
    const logoElement = document.getElementById('brand-logo');
    if (logoElement && brand.logo) {
        logoElement.src = brand.logo.url;
        logoElement.style.width = brand.logo.width;
        logoElement.style.height = brand.logo.height;

        // Apply invert filter if needed (for white logos on light backgrounds)
        if (brand.logo.invertFilter) {
            logoElement.style.filter = 'invert(1)';
        } else {
            logoElement.style.filter = 'none';
        }
    }

    // Update page title with brand name
    document.title = `${brand.name} - Agent Space Assistant`;

    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const assistantSelector = document.getElementById('assistant-selector');
    const refreshAssistantsBtn = document.getElementById('refresh-assistants-btn');
    const agentInfoBtn = document.getElementById('agent-info-btn');
    const agentInfoPanel = document.getElementById('agent-info-panel');
    const agentGalleryBtn = document.getElementById('agent-gallery-btn');
    const agentGalleryPanel = document.getElementById('agent-gallery-panel');
    const streamModeToggle = document.getElementById('stream-mode-toggle');

    // Store the current selected assistant and all agents
    let selectedAssistant = null;
    let allAgents = [];

    // Predefined agent types based on the image
    const predefinedAgents = [
        {
            name: 'deep-research',
            displayName: 'Deep Research',
            icon: '🔍',
            description: 'Get in-depth answers grounded in web research.',
            capabilities: 'Web search • Citation analysis • Comprehensive research',
            available: false
        },
        {
            name: 'idea-generator',
            displayName: 'Idea Generation',
            icon: '💡',
            description: 'Generate and refine innovative solutions through a competitive, multi-agent tournament.',
            capabilities: 'Creative brainstorming • Solution refinement • Multi-perspective analysis',
            available: false,
            badge: 'Preview'
        },
        {
            name: 'notebooklm',
            displayName: 'NotebookLM',
            icon: '📓',
            description: 'Quickly summarize and take notes for research with AI.',
            capabilities: 'Document summarization • Note-taking • Research assistance',
            available: false
        },
        {
            name: 'nl2sql',
            displayName: 'Customer Intelligence NL2SQL Agent',
            icon: '🗄️',
            description: 'This agent takes natural language queries and executes SQL against a BQ Dataset containing transaction and customer data.',
            capabilities: 'Natural language to SQL • Data analysis • Transaction insights',
            available: false
        }
    ];

    // Function to load assistants
    const loadAssistants = async () => {
        assistantSelector.innerHTML = '<option value="">Loading assistants...</option>';
        refreshAssistantsBtn.querySelector('.material-icons').classList.add('rotating');

        try {
            const response = await fetch('/list-agents');
            const data = await response.json();

            if (data.success && data.agents) {
                allAgents = data.agents;
                assistantSelector.innerHTML = '';

                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select an assistant...';
                assistantSelector.appendChild(defaultOption);

                // Add each assistant
                data.agents.forEach(agent => {
                    const option = document.createElement('option');
                    option.value = agent.name;

                    // Extract display name and determine agent type
                    const displayName = agent.displayName || agent.name.split('/').pop();
                    let agentType = '';
                    let typeIcon = '';

                    if (displayName.toLowerCase().includes('deep') && displayName.toLowerCase().includes('research')) {
                        agentType = 'Deep Research';
                        typeIcon = '🔍';
                    } else if (displayName.toLowerCase().includes('idea') || displayName.toLowerCase().includes('generator')) {
                        agentType = 'Idea Generator';
                        typeIcon = '💡';
                    } else if (displayName.toLowerCase().includes('general') || displayName.toLowerCase().includes('default')) {
                        agentType = 'General Assistant';
                        typeIcon = '🤖';
                    }

                    // Build option text
                    let optionText = displayName;
                    if (typeIcon) {
                        optionText = `${typeIcon} ${displayName}`;
                    }
                    if (agentType && !displayName.includes(agentType)) {
                        optionText += ` - ${agentType}`;
                    }

                    // Add description of enabled actions if available
                    const actions = [];
                    if (agent.enabledActions) {
                        Object.values(agent.enabledActions).forEach(connector => {
                            if (connector.actionInfo) {
                                connector.actionInfo.forEach(action => {
                                    actions.push(action.actionDisplayName);
                                });
                            }
                        });
                    }

                    if (actions.length > 0) {
                        optionText += ` (${actions.join(', ')})`;
                    }

                    option.textContent = optionText;

                    // Store agent metadata as data attributes
                    option.setAttribute('data-agent-type', agentType);
                    option.setAttribute('data-agent-icon', typeIcon);

                    assistantSelector.appendChild(option);
                });

                // Select first assistant by default if only one exists
                if (data.agents.length === 1) {
                    assistantSelector.selectedIndex = 1;
                    selectedAssistant = data.agents[0].name;
                }

                // Update agent gallery
                updateAgentGallery();
            }
        } catch (error) {
            console.error('Error loading assistants:', error);
            assistantSelector.innerHTML = '<option value="">Error loading assistants</option>';
        } finally {
            refreshAssistantsBtn.querySelector('.material-icons').classList.remove('rotating');
        }
    };

    // Function to update agent gallery
    const updateAgentGallery = () => {
        const galleryGrid = agentGalleryPanel.querySelector('.agent-gallery-grid');
        galleryGrid.innerHTML = '';

        // Add predefined agents
        predefinedAgents.forEach(agent => {
            const card = document.createElement('div');
            card.className = 'agent-gallery-card';
            if (agent.name === selectedAssistant) {
                card.classList.add('selected');
            }

            let cardHtml = `
                <h4>
                    <span class="agent-icon">${agent.icon}</span>
                    ${agent.displayName}
                    ${agent.badge ? `<span class="preview-badge">${agent.badge}</span>` : ''}
                </h4>
                <p>${agent.description}</p>
                <div class="agent-capabilities">${agent.capabilities}</div>
            `;

            card.innerHTML = cardHtml;

            if (agent.available) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => selectAgentFromGallery(agent.name));
            } else {
                card.style.opacity = '0.6';
                card.style.cursor = 'not-allowed';
            }

            galleryGrid.appendChild(card);
        });

        // Add actual agents from the API
        allAgents.forEach(agent => {
            const displayName = agent.displayName || agent.name.split('/').pop();

            // Check if this is the default assistant
            if (displayName.toLowerCase().includes('default')) {
                const card = document.createElement('div');
                card.className = 'agent-gallery-card';
                if (agent.name === selectedAssistant) {
                    card.classList.add('selected');
                }

                const actions = [];
                if (agent.enabledActions) {
                    Object.values(agent.enabledActions).forEach(connector => {
                        if (connector.actionInfo) {
                            connector.actionInfo.forEach(action => {
                                actions.push(action.actionDisplayName);
                            });
                        }
                    });
                }

                let cardHtml = `
                    <h4>
                        <span class="agent-icon">🤖</span>
                        ${displayName}
                    </h4>
                    <p>General assistant for document searches and action requests.</p>
                    <div class="agent-capabilities">${actions.length > 0 ? actions.join(' • ') : 'Document search • Email • Calendar'}</div>
                `;

                card.innerHTML = cardHtml;
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => selectAgentFromGallery(agent.name));

                galleryGrid.appendChild(card);
            }
        });
    };

    // Function to select agent from gallery
    const selectAgentFromGallery = (agentName) => {
        selectedAssistant = agentName;

        // Update selector
        const options = assistantSelector.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === agentName) {
                assistantSelector.selectedIndex = i;
                break;
            }
        }

        // Update gallery display
        updateAgentGallery();

        // Close gallery
        agentGalleryPanel.style.display = 'none';

        // Show selection message
        const selectedAgent = allAgents.find(a => a.name === agentName) ||
                            predefinedAgents.find(a => a.name === agentName);
        if (selectedAgent) {
            addMessage(`Selected: ${selectedAgent.displayName || agentName}`, 'bot');
        }
    };

    // Load assistants on page load
    loadAssistants();

    // Handle assistant selection
    assistantSelector.addEventListener('change', (e) => {
        selectedAssistant = e.target.value;
        if (selectedAssistant) {
            const selectedOption = assistantSelector.options[assistantSelector.selectedIndex];
            const agentType = selectedOption.getAttribute('data-agent-type');
            const agentIcon = selectedOption.getAttribute('data-agent-icon');

            let message = `Switched to assistant: ${selectedOption.text}`;

            // Add specific guidance based on agent type
            if (agentType === 'Deep Research') {
                message += '\n\nThis assistant specializes in:\n• Thorough analysis and comprehensive research\n• Providing multiple perspectives\n• In-depth exploration of topics\n• Evidence-based answers with citations';
            } else if (agentType === 'Idea Generator') {
                message += '\n\nThis assistant specializes in:\n• Creative brainstorming\n• Innovative solution generation\n• Out-of-the-box thinking\n• Multiple creative alternatives';
            } else if (agentType === 'General Assistant') {
                message += '\n\nThis assistant can help with:\n• General questions\n• Document searches\n• Email and calendar management\n• Store policy inquiries';
            }

            addMessage(message, 'bot');
        }
    });

    // Handle refresh button
    refreshAssistantsBtn.addEventListener('click', loadAssistants);

    // Handle agent info button
    agentInfoBtn.addEventListener('click', () => {
        if (agentInfoPanel.style.display === 'none') {
            agentInfoPanel.style.display = 'block';
            agentGalleryPanel.style.display = 'none';
            agentInfoBtn.querySelector('.material-icons').textContent = 'info';
            agentInfoBtn.style.backgroundColor = 'var(--color-primary)';
            agentInfoBtn.style.color = 'white';
        } else {
            agentInfoPanel.style.display = 'none';
            agentInfoBtn.querySelector('.material-icons').textContent = 'info';
            agentInfoBtn.style.backgroundColor = '';
            agentInfoBtn.style.color = '';
        }
    });

    // Handle agent gallery button
    agentGalleryBtn.addEventListener('click', () => {
        if (agentGalleryPanel.style.display === 'none') {
            agentGalleryPanel.style.display = 'block';
            agentInfoPanel.style.display = 'none';
            agentGalleryBtn.style.backgroundColor = 'var(--color-primary)';
            agentGalleryBtn.style.color = 'white';
            updateAgentGallery();
        } else {
            agentGalleryPanel.style.display = 'none';
            agentGalleryBtn.style.backgroundColor = '';
            agentGalleryBtn.style.color = '';
        }
    });

    const addMessage = (content, sender, isHtml = false) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        if (isHtml) {
            messageElement.innerHTML = content;
        } else {
            messageElement.textContent = content;
        }
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const displayDriveResults = (results) => {
        let tableHtml = '<div class="drive-results"><h3>Google Drive Files:</h3><table>';
        tableHtml += '<tr><th>File Name</th><th>Type</th><th>Owner</th><th>Link</th></tr>';
        results.forEach(result => {
            const doc = result.document;
            if (doc && doc.derivedStructData) {
                const data = doc.derivedStructData;
                const title = data.title || 'Untitled';
                const mimeType = data.mime_type || 'Unknown';
                const owner = data.owner || 'Unknown';
                const link = data.link || '#';

                tableHtml += `
                    <tr>
                        <td>${title}</td>
                        <td>${mimeType.split('/').pop().toUpperCase()}</td>
                        <td>${owner}</td>
                        <td>
                            <a href="${link}" target="_blank">
                                <i class="material-icons">open_in_new</i> Open
                            </a>
                        </td>
                    </tr>
                `;
            }
        });
        tableHtml += '</table></div>';
        addMessage(tableHtml, 'bot', true);
    };

    // Greeting responses
    const greetingResponses = {
        hello: [
            "Hello! Welcome to Ulta Beauty Assistant. How can I help you today?",
            "Hi there! I'm here to help with store policies, finding documents, or managing emails and calendar events. What can I do for you?",
            "Hello! Great to see you. I can assist with questions about our store or help you search through documents. What would you like to know?"
        ],
        thanks: [
            "You're welcome! Is there anything else I can help you with?",
            "My pleasure! Feel free to ask if you need anything else.",
            "Happy to help! Let me know if you have any other questions."
        ],
        bye: [
            "Goodbye! Have a wonderful day!",
            "Take care! Feel free to come back anytime you need assistance.",
            "Bye! Thanks for using Ulta Beauty Assistant. Have a great day!"
        ],
        how: [
            "I'm doing great, thank you for asking! I'm here and ready to help. What can I assist you with today?",
            "I'm wonderful, thanks! How can I make your day better?",
            "I'm here and happy to help! What brings you here today?"
        ]
    };

    const handleGreeting = (query) => {
        const lowerQuery = query.toLowerCase();
        
        if (/^(hi|hello|hey|howdy|greetings|good morning|good afternoon|good evening)\b/i.test(lowerQuery)) {
            return greetingResponses.hello[Math.floor(Math.random() * greetingResponses.hello.length)];
        }
        if (/^(thank you|thanks|appreciate it|thank you so much)\b/i.test(lowerQuery)) {
            return greetingResponses.thanks[Math.floor(Math.random() * greetingResponses.thanks.length)];
        }
        if (/^(goodbye|bye|see you|take care)\b/i.test(lowerQuery)) {
            return greetingResponses.bye[Math.floor(Math.random() * greetingResponses.bye.length)];
        }
        if (/^(how are you|how's it going|how do you do)\b/i.test(lowerQuery)) {
            return greetingResponses.how[Math.floor(Math.random() * greetingResponses.how.length)];
        }
        
        return null;
    };

    const handleSend = async () => {
        const query = userInput.value.trim();
        if (!query) return;

        addMessage(query, 'user');
        userInput.value = '';

        // Check for greetings first
        const greetingResponse = handleGreeting(query);
        if (greetingResponse) {
            // Add a small delay to make it feel more natural
            setTimeout(() => {
                addMessage(greetingResponse, 'bot');
            }, 500);
            return;
        }

        // Check if stream mode is enabled
        if (streamModeToggle.checked && selectedAssistant) {
            handleStreamingRequest(query);
            return;
        }

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    assistant: selectedAssistant
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.error) {
                addMessage(`Error: ${data.error}`, 'bot');
                return;
            }

            if (data.answer && data.answer.answerText) {
                // Parse markdown content using marked library
                const parsedContent = marked.parse(data.answer.answerText);
                let botResponse = `<div class="answer-content">${parsedContent}</div>`;
                
                // Display citations if available
                if (data.answer.citations && data.answer.citations.length > 0) {
                    let citationsHtml = '<div class="citations"><p><b>Sources:</b></p><ul>';
                    const addedSources = new Set(); // To avoid duplicates
                    
                    data.answer.citations.forEach(citation => {
                        citation.sources.forEach(source => {
                            const link = source.uri || '#';
                            const title = source.title || source.documentId || 'Source Document';
                            const sourceKey = `${title}-${link}`;
                            
                            if (!addedSources.has(sourceKey)) {
                                addedSources.add(sourceKey);
                                citationsHtml += `<li><a href="${link}" target="_blank">${title}</a></li>`;
                            }
                        });
                    });
                    citationsHtml += '</ul></div>';
                    botResponse += citationsHtml;
                }
                
                // Display related questions if available
                if (data.relatedQuestions && data.relatedQuestions.length > 0) {
                    let relatedHtml = '<div class="related-questions"><p><b>Related questions:</b></p><ul>';
                    data.relatedQuestions.forEach(question => {
                        relatedHtml += `<li>${question}</li>`;
                    });
                    relatedHtml += '</ul></div>';
                    botResponse += relatedHtml;
                }
                
                // Display detected actions with confirmation UI
                if (data.detectedActions && data.detectedActions.length > 0) {
                    let actionsHtml = '<div class="detected-actions">';
                    
                    data.detectedActions.forEach((action, index) => {
                        if (action.type === 'email' && action.requiresConfirmation) {
                            actionsHtml += `
                                <div class="action-card email-action" id="action-card-${index}">
                                    <h4><i class="material-icons">email</i> Email Action Detected</h4>
                                    <p><b>Recipient:</b> ${action.recipient}</p>
                                    <p><b>Subject:</b> ${action.subject}</p>
                                    <div class="action-form">
                                        <input type="text" id="email-subject-${index}" placeholder="Email subject" value="${action.subject !== 'Extracted from query' ? action.subject : ''}" />
                                        <textarea id="email-body-${index}" placeholder="Email body" rows="3"></textarea>
                                        <button class="action-btn confirm-btn" onclick="executeAction('email', ${index}, '${action.recipient}')">
                                            <i class="material-icons">send</i> Send Email
                                        </button>
                                        <button class="action-btn cancel-btn" onclick="cancelAction(${index})">
                                            <i class="material-icons">cancel</i> Cancel
                                        </button>
                                    </div>
                                </div>
                            `;
                        } else if (action.type === 'calendar' && action.requiresConfirmation) {
                            actionsHtml += `
                                <div class="action-card calendar-action" id="action-card-${index}">
                                    <h4><i class="material-icons">event</i> Calendar Invite Detected</h4>
                                    <p><b>Attendee:</b> ${action.attendee}</p>
                                    <p><b>Topic:</b> ${action.subject}</p>
                                    <div class="action-form">
                                        <input type="text" id="meeting-title-${index}" placeholder="Meeting title" value="${action.subject}" />
                                        <input type="datetime-local" id="meeting-time-${index}" />
                                        <textarea id="meeting-desc-${index}" placeholder="Meeting description" rows="3"></textarea>
                                        <button class="action-btn confirm-btn" onclick="executeAction('calendar', ${index}, '${action.attendee}')">
                                            <i class="material-icons">event_available</i> Create Meeting
                                        </button>
                                        <button class="action-btn cancel-btn" onclick="cancelAction(${index})">
                                            <i class="material-icons">cancel</i> Cancel
                                        </button>
                                    </div>
                                </div>
                            `;
                        } else if (action.type === 'search') {
                            actionsHtml += `<p class="action-info"><i class="material-icons">search</i> Search performed: ${action.query}</p>`;
                        }
                    });
                    
                    actionsHtml += '</div>';
                    botResponse += actionsHtml;
                }
                
                addMessage(botResponse, 'bot', true);
            } else if (data.results) {
                // Handle search results (for backward compatibility)
                displayDriveResults(data.results);
            } else {
                addMessage("Sorry, I couldn't generate an answer. Please try rephrasing your question.", 'bot');
            }

        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong.', 'bot');
        }
    };

    // Function to handle streaming requests
    const handleStreamingRequest = async (query) => {
        // Create a message container for the streaming response
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', 'bot-message');

        // Add streaming indicator
        const streamingIndicator = document.createElement('div');
        streamingIndicator.className = 'streaming-indicator';
        streamingIndicator.innerHTML = '<i class="material-icons">psychology</i> Thinking...';
        messageContainer.appendChild(streamingIndicator);

        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;

        const thoughtsContainer = document.createElement('div');
        const answerContainer = document.createElement('div');
        answerContainer.className = 'answer-content';

        messageContainer.appendChild(thoughtsContainer);
        messageContainer.appendChild(answerContainer);

        try {
            const response = await fetch('/stream-assist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    assistant: selectedAssistant
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let currentThought = '';
            let currentAnswer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep the last incomplete line in the buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            // Handle different types of streaming data
                            if (data.thought) {
                                // Add thought bubble
                                const thoughtBubble = document.createElement('div');
                                thoughtBubble.className = 'thought-bubble';
                                thoughtBubble.textContent = data.thought;
                                thoughtsContainer.appendChild(thoughtBubble);
                                chatBox.scrollTop = chatBox.scrollHeight;
                            } else if (data.answer) {
                                // Update answer content
                                currentAnswer += data.answer;
                                answerContainer.innerHTML = marked.parse(currentAnswer);
                                streamingIndicator.style.display = 'none';
                                chatBox.scrollTop = chatBox.scrollHeight;
                            } else if (data.error) {
                                streamingIndicator.style.display = 'none';
                                answerContainer.textContent = `Error: ${data.error}`;
                            }
                        } catch (e) {
                            console.error('Error parsing streaming data:', e);
                        }
                    }
                }
            }

            // Process any remaining buffer
            if (buffer.trim()) {
                try {
                    if (buffer.startsWith('data: ')) {
                        const data = JSON.parse(buffer.slice(6));
                        if (data.answer) {
                            currentAnswer += data.answer;
                            answerContainer.innerHTML = marked.parse(currentAnswer);
                        }
                    }
                } catch (e) {
                    console.error('Error parsing final buffer:', e);
                }
            }

            streamingIndicator.style.display = 'none';

            // If no answer was received, show a default message
            if (!currentAnswer && thoughtsContainer.children.length === 0) {
                answerContainer.textContent = 'No response received from the assistant.';
            }

        } catch (error) {
            console.error('Streaming error:', error);
            streamingIndicator.style.display = 'none';
            answerContainer.textContent = 'Sorry, something went wrong with the streaming request.';
        }
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});

// Global functions for action handling
window.executeAction = async (type, index, recipient) => {
    const actionCard = document.getElementById(`action-card-${index}`);
    
    if (!actionCard) {
        console.error('Action card not found for index:', index);
        return;
    }
    
    let actionData = {};
    
    if (type === 'email') {
        const subject = document.getElementById(`email-subject-${index}`).value;
        const body = document.getElementById(`email-body-${index}`).value;
        
        if (!subject || !body) {
            alert('Please fill in all fields');
            return;
        }
        
        actionData = {
            recipient: recipient,
            subject: subject,
            body: body
        };
    } else if (type === 'calendar') {
        const title = document.getElementById(`meeting-title-${index}`).value;
        const time = document.getElementById(`meeting-time-${index}`).value;
        const description = document.getElementById(`meeting-desc-${index}`).value;
        
        if (!title || !time) {
            alert('Please fill in meeting title and time');
            return;
        }
        
        actionData = {
            attendee: recipient,
            subject: title,  // Changed from 'title' to 'subject' to match backend
            duration: "30",   // Default 30 minutes
            description: description || `Meeting about ${title}`
        };
    }
    
    // Show loading state
    actionCard.innerHTML = '<p><i class="material-icons rotating">sync</i> Executing action...</p>';
    
    try {
        const response = await fetch('/execute-action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                actionType: type,
                actionData: actionData
            }),
        });
        
        const result = await response.json();
        
        if (result.success) {
            let successHtml = `
                <div class="action-success">
                    <i class="material-icons">check_circle</i>
                    <p><strong>${result.message}</strong></p>
            `;
            
            // Show AI response if available
            if (result.actionResponse && result.actionResponse.answer && result.actionResponse.answer.answerText) {
                const aiResponse = result.actionResponse.answer.answerText;
                if (aiResponse.toLowerCase().includes('i will') || aiResponse.toLowerCase().includes('acknowledged')) {
                    successHtml += `<p class="ai-response"><i class="material-icons">smart_toy</i> ${aiResponse}</p>`;
                }
            }
            
            if (result.details) {
                successHtml += '<div class="action-details">';
                if (type === 'email') {
                    successHtml += `
                        <p><b>To:</b> ${result.details.recipient}</p>
                        <p><b>Subject:</b> ${result.details.subject}</p>
                        <p><b>Body:</b> ${result.details.body}</p>
                    `;
                } else if (type === 'calendar') {
                    successHtml += `
                        <p><b>Attendee:</b> ${result.details.attendee}</p>
                        <p><b>Title:</b> ${result.details.subject}</p>
                        <p><b>Duration:</b> ${result.details.duration} minutes</p>
                        <p><b>Description:</b> ${result.details.description}</p>
                    `;
                }
                successHtml += '</div>';
            }
            
            if (result.note) {
                successHtml += `<div class="info-note"><i class="material-icons">info</i> Action processed through Agent Space</div>`;
            }
            
            successHtml += '</div>';
            actionCard.innerHTML = successHtml;
        } else {
            actionCard.innerHTML = `
                <div class="action-error">
                    <i class="material-icons">error</i>
                    <p>Action failed: ${result.error || 'Unknown error'}</p>
                </div>
            `;
        }
    } catch (error) {
        actionCard.innerHTML = `
            <div class="action-error">
                <i class="material-icons">error</i>
                <p>Error executing action: ${error.message}</p>
            </div>
        `;
    }
};

window.cancelAction = (index) => {
    const actionCard = document.getElementById(`action-card-${index}`);
    if (actionCard) {
        actionCard.style.display = 'none';
    }
};
