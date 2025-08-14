# Greeting Feature Documentation

The application now supports friendly, conversational responses to informal greetings.

## Supported Greetings

### Hello/Hi Greetings
- "Hello", "Hi", "Hey", "Howdy", "Greetings"
- "Good morning", "Good afternoon", "Good evening"

**Responses**: Welcomes users and offers assistance with store policies, documents, emails, and calendar management.

### Thank You
- "Thank you", "Thanks", "Appreciate it", "Thank you so much"

**Responses**: Acknowledges gratitude and offers continued assistance.

### Goodbye
- "Goodbye", "Bye", "See you", "Take care"

**Responses**: Friendly farewell messages.

### How Are You
- "How are you", "How's it going", "How do you do"

**Responses**: Positive, engaging responses that redirect to offering help.

## Implementation Details

### Client-Side Handling
- Immediate response (500ms delay for natural feel)
- Randomized responses for variety
- No API call needed for simple greetings
- Preserves server resources

### Server-Side Support
- Enhanced preamble for greeting context
- Adjusted search parameters for informal queries
- Fallback to Agent Space API for complex interactions

## Examples

**User**: "Hello"
**Assistant**: "Hello! Welcome to Ulta Beauty Assistant. How can I help you today?"

**User**: "Thank you"
**Assistant**: "You're welcome! Is there anything else I can help you with?"

**User**: "How are you?"
**Assistant**: "I'm doing great, thank you for asking! I'm here and ready to help. What can I assist you with today?"

## Benefits

1. **Natural Conversation**: Makes the assistant feel more personable
2. **Quick Response**: No API delay for common greetings
3. **Resource Efficient**: Saves API calls for actual queries
4. **Brand Aligned**: Responses match the active brand's tone

## Customization

To modify greeting responses:
1. Edit `public/script.js`
2. Find the `greetingResponses` object
3. Update or add response arrays
4. Responses are randomly selected for variety