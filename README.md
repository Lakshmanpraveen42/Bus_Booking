# Bus Booking Application

A comprehensive bus booking system featuring a React-based frontend and a Python-based backend.

## Project Structure

- **`client/`**: React application built with Vite and Tailwind CSS.
- **`server/`**: FastAPI/Python-based backend server.

## Features

- User Authentication
- Bus Search and Filtering
- Seat Selection and Booking
- Booking Management
- Admin Dashboard

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- `uv` (for Python package management)

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Run the server:
   ```bash
   uv run uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## License

MIT
