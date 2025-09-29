# Scalable Web App with Authentication & Dashboard

This project is a full-stack web application built for the Frontend Developer Intern assignment. It includes a React frontend, a Node.js/Express backend, and uses MongoDB for the database.

## Project Structure

- **/backend**: Contains the Node.js/Express server, models, and API routes.
- **/frontend**: Contains the React application, components, pages, and services.

## Features

- User signup and login with JWT-based authentication.
- Password hashing using bcrypt.
- Protected routes for the dashboard.
- Full CRUD (Create, Read, Update, Delete) functionality for notes.
- Search and filter functionality for notes.
- User profile display and update.
- Responsive design with TailwindCSS.
- Client-side and server-side form validation.

## Prerequisites

- Node.js and npm (or yarn) installed.
- A MongoDB Atlas account and a connection string.

## Getting Started

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add your environment variables. You can rename the provided `.env.example` file.
    -   `MONGO_URI`: Your MongoDB Atlas connection string.
    -   `JWT_SECRET`: A secret key for signing JWTs.

4.  **Replace the placeholder in `server.js`**:
    -   Open `backend/server.js` and replace `'YOUR_MONGODB_ATLAS_CONNECTION_STRING'` with your actual MongoDB connection string.
    -   Replace `'your_jwt_secret'` with a strong, unique secret phrase. It's best practice to use environment variables for this.

5.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:5000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The React app will open in your browser at `http://localhost:3000`.

## API Documentation

See the `API_DOCS.md` file for details on the available API endpoints.