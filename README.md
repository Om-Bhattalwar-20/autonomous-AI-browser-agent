# Enterprise Lead Gen & Web Scraping AI Engine

An autonomous, full-stack web automation engine powered by Google Gemini 2.5 Flash and Playwright. The application takes natural language objectives, instantiates a vision-driven browser agent loop to interact with web elements dynamically, parses unstructured data into clean JSON, and exports results as verified business lead spreadsheets.

##  System Architecture & Tech Stack

- **Frontend Interface:** Next.js (TypeScript, React, Tailwind CSS, Lucide Icons)
- **Backend Core:** FastAPI (Python, Uvicorn, Pydantic, Asyncio)
- **AI Agent Framework:** Browser-Use Architecture orchestrated via Google Gemini 2.5 Flash
- **Browser Automation Layer:** Playwright Core Binaries

##  Key Engineering Implementations

- **Vision-Driven Context Control Loop:** Uses vision-capable models to calculate UI elements coordinates dynamically, completely bypassing rigid DOM tree structure dependencies and layout updates.
- **Strict Data Pipeline Normalization:** Implements structural post-processing filters to force raw conversational agent responses into perfectly deterministic, validated JSON rows.
- **Client-Side Asset Compilation:** Shifts resource-heavy spreadsheet serialization tasks entirely to browser-side data blob compilation, drastically lowering backend compute overhead.

##  Local Installation Guide

### 1. Clone & Set Up Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install browser-use python-dotenv fastapi uvicorn langchain-openai pydantic playwright
python -m playwright install
