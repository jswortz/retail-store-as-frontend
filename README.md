# Agent Space Frontend

This project is a simple web interface for interacting with the Agent Space API. It allows users to enter a query, which is then sent to the Agent Space search or answer API, and the results are displayed on the page.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/)
*   [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (for `gcloud` authentication)

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

This application requires you to set up your Agent Space API endpoint in a `.env` file.

1.  Create a file named `.env` in the root of the project.
2.  Add the following line to the `.env` file, replacing the placeholder with your actual API endpoint. This can be obtained from the API tab in the Integrations section of the Agent Space console:
    ```
    AS_API_ENDPOINT=https://discoveryengine.googleapis.com/v1alpha/projects/...
    ```

## Running the Application

1.  **Authenticate with Google Cloud:**
    Make sure you are authenticated with the `gcloud` CLI. If you are not, run:
    ```bash
    gcloud auth application-default login
    ```

2.  **Start the server:**
    ```bash
    node server.js
    ```

3.  **Access the UI:**
    Open your web browser and navigate to `http://localhost:3000`.
