from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent_core import run_scraping_task

# 1. Initialize the FastAPI application
app = FastAPI(title="AI Autonomous Browser Scraper API")

# 2. Enable CORS so your React/Next.js frontend can communicate with this API safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins during local development
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

# 3. Define what the incoming request payload from the frontend looks like
class ScrapeRequest(BaseModel):
    prompt: str

# 4. Create the POST endpoint that triggers our Gemini agent
@app.post("/api/run-agent")
async def execute_agent(payload: ScrapeRequest):
    try:
        if not payload.prompt:
            raise HTTPException(status_code=400, detail="Prompt instructions cannot be empty.")
        
        print(f"\n📡 API Received Request! Triggering agent with prompt: '{payload.prompt}'")
        
        # Call your working async function from agent_core.py
        result_data = await run_scraping_task(payload.prompt)
        
        return {
            "status": "success",
            "data": result_data
        }
        
    except Exception as e:
        print(f"❌ API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# 5. Run the Uvicorn server automatically if executed directly
if __name__ == "__main__":
    import uvicorn
    print("⚡ Starting FastAPI server on http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)