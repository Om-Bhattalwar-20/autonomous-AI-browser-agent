import asyncio
import os
import json
import re
from dotenv import load_dotenv
from browser_use import Agent, ChatGoogle

load_dotenv()

async def run_scraping_task(prompt: str):
    """
    Runs the autonomous browser loop and injects system instructions
    to enforce a strict JSON array output wrapper.
    """
    llm = ChatGoogle(model='gemini-2.5-flash') 
    
    structured_system_prompt = (
        f"{prompt} \n\n"
        "CRITICAL INSTRUCTION: You must extract the requested information as a valid JSON array. "
        "Each object in the array must contain exactly these keys: 'name', 'link_or_email', and 'description'. "
        "Do not include any conversational text, markdown text wrappers like ```json, or introductions. "
        "Return ONLY the raw JSON string array."
    )
    
    agent = Agent(
        task=structured_system_prompt,
        llm=llm,
    )
    
    print(f" Running structured extraction task...")
    history = await agent.run()
    raw_output = history.final_result()
    
    clean_json_string = re.sub(r'```json\s*|```', '', raw_output).strip()
    
    try:
        parsed_json = json.loads(clean_json_string)
        return parsed_json
    except Exception:
        return [{"name": "Scraped Record", "link_or_email": "See description", "description": raw_output}]
