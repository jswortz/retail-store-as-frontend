# Retail Store Frontend

A modern, branded web application that provides a chat interface to interact with Google Agent Space API for retail store operations.

<img src=front-end-example.png width=600px />


## Overview

This application allows users to interact with various Google services through a unified interface, including:
- **Natural Language Queries**: Ask questions and get answers from your Agent Space data
- **Google Drive Search**: Query files stored in Google Drive
- **Email Actions**: Detect and simulate email sending actions
- **Calendar Actions**: Detect and simulate calendar invite creation
- **Citation Support**: View source documents with clickable links
- **Related Questions**: See suggested follow-up questions
- **Greeting Support**: Friendly responses to informal greetings
- **Dynamic Branding**: Switch between Google, Microsoft, Amazon, Ulta, or custom brands
- **Modern UI**: Clean, responsive design with smooth animations

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (for `gcloud` authentication)
- Agent Space API endpoint

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:

   - **AS_API_ENDPOINT**: Your Agent Space API endpoint URL
     - Format: `https://discoveryengine.googleapis.com/v1alpha/projects/YOUR_PROJECT_NUMBER/locations/global/collections/default_collection/engines/YOUR_ENGINE_NAME`
     - Replace `YOUR_PROJECT_NUMBER` with your Google Cloud project number
     - Replace `YOUR_ENGINE_NAME` with your Agent Space engine name

   - **GMAIL_DATA_STORE_ID**: The ID of your Gmail data store in Agent Space
   
   - **GCALENDAR_DATA_STORE_ID**: The ID of your Google Calendar data store in Agent Space
   
   - **GMAIL_ACTION_ID**: The action ID for Gmail operations
   
   - **GCALENDAR_ACTION_ID**: The action ID for Google Calendar operations
   
   - **LOCATION**: The Google Cloud region (typically `global`)
   
   - **PROJECT_NUMBER**: Your Google Cloud project number

## Running the Application

1.  **Authenticate with Google Cloud:**
    Make sure you are authenticated with the `gcloud` CLI. If you are not, run:
    ```bash
    gcloud auth login
    gcloud auth application-default login
    ```

2.  **Start the server:**
    ```bash
    node server.js
    ```

3.  **Access the UI:**
    Open your web browser and navigate to `http://localhost:3000`.

## Project Documentation

- **[CLAUDE.md](./CLAUDE.md)**: Detailed technical plan and implementation guide for the Node.js frontend, including:
  - Technology stack details
  - Project structure
  - Core functionality specifications
  - API documentation references
  - Setup and execution instructions

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
├── .env.example       # Example environment variables
├── package.json       # Node dependencies
└── CLAUDE.md          # API documentation references
```

## API Integration

The application integrates with Google Agent Space API, which provides:
- Search functionality across data stores
- Answer queries with comprehensive responses
- Action execution for Gmail and Calendar operations

For detailed API documentation, refer to:
- [Agent Space API Reference](https://cloud.google.com/agentspace/docs/reference/rest)
- [Answer Query Response](https://cloud.google.com/agentspace/docs/reference/rest/v1beta/AnswerQueryResponse)

## Note on Actions

Email and calendar actions are currently simulated for demonstration purposes. In a production environment, these would use the Agent Space buildActionInvocation API with properly configured data connectors for Gmail and Google Calendar.

## Additional Documentation

- `BRAND_CUSTOMIZATION.md` - How to customize branding
- `GREETING_FEATURE.md` - Details on greeting handling
- `ULTA_STYLING.md` - Ulta Beauty specific styling
- `UI_FEATURES.md` - Overview of UI capabilities
- `TESTING_SUMMARY.md` - Test results and status
