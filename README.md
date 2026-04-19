# RBI Compliance Bot - Professional Edition

This is a modern, responsive web application for assisting with RBI (Reserve Bank of India) circular compliance. It uses FastAPI for the backend and React (Vite) for the frontend.

## Features

- **Circular Q&A:** Upload multiple RBI circulars (PDF) and ask specific compliance questions.
- **Actionable Tasks:** Automatically generate department-wise tasks (Compliance, IT, Legal, etc.) based on circular content.
- **Modern Dashboard:** Professional UI with subtle animations and full mobile support.
- **AI Powered:** Leverages Google Gemini (1.5 Flash) for high-speed, accurate regulatory analysis.

## Project Structure

- `/backend`: FastAPI server and LangChain logic.
- `/frontend`: React + TypeScript + Vite application.
- `rbi-compliance-bot-master`: Legacy Streamlit implementation and Docker assets.

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### 2. Backend Setup
1. Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run the server:
   ```bash
   python backend/main.py
   ```
   The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file in the `frontend` directory for production:
   ```env
   VITE_API_BASE=https://your-backend-url.com
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Deployment

### Frontend (Static Hosting)
1. Build the project:
   ```bash
   cd frontend
   ```
2. Build:
   ```bash
   npm run build
   ```
3. Deploy the `frontend/dist` folder to Netlify, Vercel, or GitHub Pages.

### Backend
1. Deploy the `backend` folder to a service like Render, Railway, or AWS.
2. Ensure the `GOOGLE_API_KEY` environment variable is set in your hosting provider's dashboard.

## Tech Stack

- **Backend:** FastAPI, LangChain, FAISS (Local), Sentence-Transformers (Local).
- **Frontend:** React, TypeScript, Vite, Framer Motion, Lucide React.
- **AI:** Google Generative AI (Gemini 1.5 Flash).

## License

MIT License - see [LICENSE](LICENSE) file for details.
