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

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
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
            title: title,
            time: time,
            description: description
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
                        <p><b>Title:</b> ${result.details.title}</p>
                        <p><b>Time:</b> ${result.details.time}</p>
                        <p><b>Description:</b> ${result.details.description}</p>
                    `;
                }
                successHtml += '</div>';
            }
            
            if (result.simulation || result.note) {
                successHtml += `<div class="simulation-note"><i class="material-icons">info</i> ${result.note || 'This is a simulated action for demonstration purposes.'}</div>`;
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
