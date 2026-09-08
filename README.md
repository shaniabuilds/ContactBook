# Contact Book

A simple single-user contact management application built with React, Node.js, Express.js, and MongoDB.

## Live Demo

- **Frontend:** https://contact-book-weld-ten.vercel.app/
- **Backend:** https://contactbook-mols.onrender.com

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
- Tailwind CSS

### Backend

- Node.js
- Express.js
- REST API

### Database

- MongoDB

## Project Structure

```text
ContactBook/
├── client/
├── server/
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts |
| POST | `/api/contacts` | Add a contact |
| PUT | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact |

## Note

This project is intentionally designed as a single-user contact book without authentication. Therefore, all contacts are shared and visible to anyone accessing the application.

For a production application, authentication and user-based data isolation should be added.
