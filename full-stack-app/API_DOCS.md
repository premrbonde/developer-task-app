# API Documentation

This document outlines the API endpoints for the application.

**Base URL**: `http://localhost:5000/api`

## Authentication

### `POST /auth/signup`

Registers a new user.

-   **Body**:
    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "password123"
    }
    ```
-   **Response**: `201 Created` with a success message.

### `POST /auth/login`

Logs in an existing user.

-   **Body**:
    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```
-   **Response**: `200 OK` with a JWT token and user object.

## Profile

### `GET /profile`

Fetches the profile of the currently authenticated user.

-   **Headers**: `Authorization: Bearer <token>`
-   **Response**: `200 OK` with the user object (password excluded).

### `PUT /profile`

Updates the profile of the currently authenticated user.

-   **Headers**: `Authorization: Bearer <token>`
-   **Body**:
    ```json
    {
      "username": "newusername",
      "email": "newemail@example.com"
    }
    ```
-   **Response**: `200 OK` with a success message and the updated user object.

## Notes (CRUD)

All notes endpoints require authentication.

### `POST /notes`

Creates a new note.

-   **Headers**: `Authorization: Bearer <token>`
-   **Body**:
    ```json
    {
      "title": "My First Note",
      "content": "This is the content of my first note."
    }
    ```
-   **Response**: `201 Created` with the newly created note object.

### `GET /notes`

Retrieves all notes for the authenticated user.

-   **Headers**: `Authorization: Bearer <token>`
-   **Query Parameters**:
    -   `search` (optional): A string to search for in note titles and content.
-   **Response**: `200 OK` with an array of note objects.

### `GET /notes/:id`

Retrieves a single note by its ID.

-   **Headers**: `Authorization: Bearer <token>`
-   **Response**: `200 OK` with the note object.

### `PUT /notes/:id`

Updates an existing note.

-   **Headers**: `Authorization: Bearer <token>`
-   **Body**:
    ```json
    {
      "title": "Updated Title",
      "content": "Updated content."
    }
    ```
-   **Response**: `200 OK` with the updated note object.

### `DELETE /notes/:id`

Deletes a note by its ID.

-   **Headers**: `Authorization: Bearer <token>`
-   **Response**: `200 OK` with a success message.