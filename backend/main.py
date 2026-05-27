from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent_core import run_scraping_task

app = FastAPI(title="AI Autonomous Browser Scraper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    prompt: str

@app.post("/api/run-agent")
async def execute_agent(payload: ScrapeRequest):
    try:
        if not payload.prompt:
            raise HTTPException(status_code=400, detail="Prompt instructions cannot be empty.")
        
        print(f"\n API Received Request! Triggering agent with prompt: '{payload.prompt}'")
        
        result_data = await run_scraping_task(payload.prompt)
        
        return {
            "status": "success",
            "data": result_data
        }
        
    except Exception as e:
        print(f"❌ API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("⚡ Starting FastAPI server on http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
