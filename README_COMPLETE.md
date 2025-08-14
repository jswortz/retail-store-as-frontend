# Agent Space Frontend Application

A modern, branded web application that provides a chat interface to interact with Google's Agent Space API.

## Features

- **Natural Language Queries**: Ask questions and get answers from your Agent Space data
- **Google Drive Search**: Query files stored in Google Drive
- **Email Actions**: Detect and simulate email sending actions
- **Calendar Actions**: Detect and simulate calendar invite creation
- **Citation Support**: View source documents with clickable links
- **Related Questions**: See suggested follow-up questions
- **Greeting Support**: Friendly responses to informal greetings like "Hello"
- **Dynamic Branding**: Switch between Google, Microsoft, Amazon, Ulta, or custom brands
- **Modern UI**: Clean, responsive design with smooth animations

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) for authentication
- Agent Space API endpoint

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
Create a `.env` file with your Agent Space API endpoint:
```
AS_API_ENDPOINT=https://discoveryengine.googleapis.com/v1alpha/projects/.../engines/...
```

3. **Authenticate with Google Cloud**:
```bash
gcloud auth login
gcloud auth application-default login
```

4. **Run the server**:
```bash
node server.js
```

5. **Open your browser** to `http://localhost:3000`

## Usage Examples

### Queries
- "What files are in my google drive?"
- "What is the store policy on cleaning up?"
- "What is my last email?"
- "When was my last meeting?"

### Actions
- "Send an email to jwortz@google.com about quarterly results"
- "Schedule a meeting with jwortz@google.com about sustainability"

### Greetings
- "Hello" → Friendly welcome message
- "Thank you" → Acknowledgment and offer for more help
- "How are you?" → Engaging response
- "Goodbye" → Friendly farewell

## Branding

The application supports multiple brand themes:

1. **Google** - Material Design colors
2. **Microsoft** - Fluent Design colors
3. **Amazon** - Amazon brand colors
4. **Ulta** - Ulta Beauty's signature pink (currently active)
5. **Custom** - Your own brand

To change brands:
1. Edit `public/brand-config.js`
2. Change `ACTIVE_BRAND = 'ulta'` to another brand
3. Refresh the page

## Technical Details

- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Authentication**: Google Cloud auth via gcloud CLI
- **API**: Agent Space Discovery Engine v1alpha
- **Styling**: CSS variables for easy theming

## Project Structure

```
/
├── server.js           # Express server handling API requests
├── public/
│   ├── index.html     # Main HTML page with header
│   ├── script.js      # Frontend JavaScript with greeting logic
│   ├── styles.css     # CSS with brand-specific styles
│   ├── brand-config.js # Brand configuration
│   ├── ulta-logo.svg  # Ulta logo
│   └── default-logo.svg # Default logo
├── .env               # Environment variables
├── package.json       # Node dependencies
└── CLAUDE.md          # API documentation references
```

## Note on Actions

Email and calendar actions are currently simulated for demonstration purposes. In a production environment, these would use the Agent Space buildActionInvocation API with properly configured data connectors for Gmail and Google Calendar.

## Documentation

- `BRAND_CUSTOMIZATION.md` - How to customize branding
- `GREETING_FEATURE.md` - Details on greeting handling
- `ULTA_STYLING.md` - Ulta Beauty specific styling
- `UI_FEATURES.md` - Overview of UI capabilities
- `TESTING_SUMMARY.md` - Test results and status