# Claude Plan: Node.js Frontend for Agent Space

This document outlines the plan for creating a Node.js-based web application that serves as a frontend to interact with the Agent Space API.

## 1. Project Goal

The primary goal is to build a simple web interface that allows a user to enter a query, which is then sent to the Agent Space search API. The application will handle the necessary authentication and request formatting, and display the results returned by the API.

## 2. Technology Stack

*   **Backend:** Node.js with the Express.js framework to create a simple web server.
*   **Frontend:** HTML, CSS, and vanilla JavaScript for the user interface.
*   **API Communication:** A library like `axios` will be used to make HTTP requests from the Node.js server to the Agent Space API.
*   **Environment Variables:** The `dotenv` package will be used to manage environment variables from the `.env` file.

## 3. Project Structure

```
/
|-- .env
|-- CLAUDE.md
|-- package.json
|-- server.js
|-- public/
|   |-- index.html
|   |-- styles.css
|   `-- script.js
```

## 4. Core Functionality

### 4.1. Backend (server.js)

1.  **Server Setup:**
    *   Initialize an Express application.
    *   Use `dotenv` to load the `AS_API_ENDPOINT` from the `.env` file.
    *   Serve static files (HTML, CSS, JS) from the `public` directory.

2.  **API Endpoint (`/search`):**
    *   Create a `POST /search` endpoint that will be called by the frontend.
    *   This endpoint will receive the user's query in the request body.

3.  **Authentication:**
    *   The server will execute the `gcloud auth print-access-token` command using Node.js's `child_process.exec` to get a fresh bearer token for each request.

4.  **API Request to Agent Space:**
    *   Construct the request body (the JSON payload) for the Agent Space API, inserting the user's query.
    *   Construct the request headers, including `Content-Type: application/json` and the `Authorization` header with the bearer token.
    *   Make a `POST` request to the `AS_API_ENDPOINT` with the constructed headers and body.
    *   The endpoint for the search request will be `${process.env.AS_API_ENDPOINT}/servingConfigs/default_search:search`.

5.  **Response Handling:**
    *   Forward the response from the Agent Space API back to the frontend.
    *   Include error handling for both the `gcloud` command and the API request.

### 4.2. Frontend (`public/`)

1.  **`index.html`:**
    *   A simple HTML page with an input field for the user to type their query and a "Search" button.
    *   A container element to display the search results.

2.  **`script.js`:**
    *   An event listener on the "Search" button.
    *   When clicked, it will take the query from the input field.
    *   It will make a `POST` request to the `/search` endpoint on our Node.js server.
    *   It will then process the JSON response and dynamically render the results in the results container.

3.  **`styles.css`:**
    *   Basic styling for the page to make it presentable.

## 5. API Documentation

The Agent Space API is documented at the following locations:

### Primary Documentation
*   **Agent Space API Reference:** [https://cloud.google.com/agentspace/docs/reference/rest](https://cloud.google.com/agentspace/docs/reference/rest)

### Key API Resources for Frontend Development

1.  **Answer Query Response:**
    *   Documentation: [https://cloud.google.com/agentspace/docs/reference/rest/v1beta/AnswerQueryResponse](https://cloud.google.com/agentspace/docs/reference/rest/v1beta/AnswerQueryResponse)
    *   This resource defines the structure of responses from answer queries, useful for parsing and displaying results.

2.  **Answer API:**
    *   Documentation: [https://cloud.google.com/agentspace/docs/reference/rest/v1beta/projects.locations.collections.dataStores.servingConfigs/answer](https://cloud.google.com/agentspace/docs/reference/rest/v1beta/projects.locations.collections.dataStores.servingConfigs/answer)
    *   This endpoint is used for sending answer queries to the Agent Space API and is an alternative to the search endpoint.

### API Usage Notes

*   The `/answer` endpoint provides more comprehensive responses compared to `/search`
*   When building frontend experiences, consider the response structure from `AnswerQueryResponse` to properly handle and display:
    *   Answer text
    *   Citations and references
    *   Related questions
    *   Step-by-step reasoning (if available)

## 6. Setup and Execution Plan

1.  **Initialize Project:** Run `npm init -y` to create a `package.json`.
2.  **Install Dependencies:** Run `npm install express axios dotenv`.
3.  **Create Files:** Create the `server.js` file and the files in the `public` directory as described above.
4.  **Implement Backend:** Write the Node.js/Express code in `server.js`.
5.  **Implement Frontend:** Write the HTML, CSS, and JavaScript for the user interface.
6.  **Run Application:** Start the server with `node server.js`.
7.  **Access:** Open a web browser and navigate to the appropriate address (e.g., `http://localhost:3000`).