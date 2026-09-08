# Contact Book

A simple single-user contact management application built with React, Node.js, Express.js, and MongoDB.

## Features

- Add new contacts
- View all contacts
- Edit existing contacts
- Delete contacts
- Form validation
- Responsive table-based UI

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```text
ContactBook/
├── client/      
├── server/  
├── .gitignore
└── README.md

## Environment Variables

### Client

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=https://contactbook-mols.onrender.com
```

### Server

Create a `.env` file inside the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts |
| POST | `/api/contacts` | Add a contact |
| PUT | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact |

## Note

This project is intentionally designed as a single-user contact book without authentication, as required by the assignment. Therefore, all contacts are shared and visible to anyone accessing the application.

For a production application, authentication and user-based data isolation should be added.

## Live Demo

- Frontend: [Add your Vercel URL here](https://contact-book-weld-ten.vercel.app/)
- Backend: https://contactbook-mols.onrender.com
