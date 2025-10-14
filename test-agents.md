# Testing Deep Research and Idea Generator Agents

## How to Test the Agents

1. **Open the Application**
   - Navigate to http://localhost:3000 in your browser
   - The application should load with the agent selector visible at the top

2. **View Available Agents**
   - Click the info button (ℹ️) next to the refresh button to see descriptions of available agent types
   - The dropdown should list all available assistants from your Agent Space configuration

3. **Test Deep Research Agent**
   - Select an agent with "deep research" in its name from the dropdown
   - Try these example queries:
     - "What are the most effective customer retention strategies for retail beauty stores?"
     - "Analyze the impact of social media on beauty product purchasing decisions"
     - "Research the latest trends in sustainable beauty packaging"
   - The agent should provide comprehensive, well-researched responses with multiple perspectives

4. **Test Idea Generator Agent**
   - Select an agent with "idea generator" in its name from the dropdown
   - Try these example queries:
     - "Generate creative ideas for a summer beauty campaign"
     - "Brainstorm innovative loyalty program concepts for our store"
     - "Suggest unique ways to engage customers during the holiday season"
   - The agent should provide creative, diverse ideas and innovative solutions

5. **Test General Assistant**
   - Select the general/default assistant from the dropdown
   - Try these example queries:
     - "What files are in my Google Drive?"
     - "Send an email to jwortz@google.com about quarterly results"
     - "What is the store policy on returns?"
   - The agent should handle general queries and action requests

## Expected Behavior

### Deep Research Agent
- Provides detailed, analytical responses
- Includes multiple perspectives and considerations
- Cites sources when available
- Focuses on comprehensive understanding

### Idea Generator Agent
- Offers creative and innovative suggestions
- Provides multiple alternatives
- Thinks outside conventional approaches
- Focuses on brainstorming and creativity

### General Assistant
- Handles everyday queries efficiently
- Can search documents and execute actions
- Provides concise, practical responses
- Manages email and calendar requests

## Troubleshooting

If agents are not appearing in the dropdown:
1. Check the browser console for errors
2. Click the refresh button to reload agents
3. Verify your Agent Space configuration has the appropriate assistants created

If agent responses don't match their specialization:
1. Check that the assistant names contain the expected keywords (deep-research, idea-generator)
2. Review the server console logs to see which endpoint is being used
3. Verify the preamble is being applied correctly in the API request