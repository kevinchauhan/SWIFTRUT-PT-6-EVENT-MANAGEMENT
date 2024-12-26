# Event Management App

This is a full-stack Event Management Application that allows users to view, create, RSVP to, and manage events. Users can also filter events by date, location, and event type. The app features user authentication for creating and managing events, and notifications are sent when events are updated or approaching.

## Features

- **View Events**: List of all upcoming events with details like title, description, date, location, and the number of attendees.
- **Create Event**: Authenticated users can create new events, including details like title, description, date, location, and max attendees.
- **RSVP**: Authenticated users can RSVP for events, with a limit on the number of attendees.
- **Edit Event**: Authenticated users can update their own events.
- **Delete Event**: Authenticated users can delete their own events.
- **Filter Events**: Users can filter events by date, location.
- **User Authentication**: Login and signup functionality for user accounts.

## Tech Stack

- **Frontend**:

  - React.js
  - TailwindCSS
  - Zustand (State Management)
  - Axios (HTTP Requests)
  - React Toastify (Notifications)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JSON Web Tokens (JWT) for authentication
- **Deployment**:
  - Frontend: [https://swiftrut-pt-6-event-management.vercel.app](https://swiftrut-pt-6-event-management.vercel.app)
  - Backend: [https://swiftrut-pt-6-event-management.onrender.com](https://swiftrut-pt-6-event-management.onrender.com)
