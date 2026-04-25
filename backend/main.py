import os
import json
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
if not os.getenv("GEMINI_API_KEY"):
    load_dotenv("../.env")

app = FastAPI(title="Bahari-Connect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
You are 'Bahari-Connect', a specialized financial secretary for fishing cooperatives in Mombasa. 
Your job is to listen to fishing reports (often in Sheng or Swahili) and turn them into structured data.

### CURRENT MARKET INTELLIGENCE (April 2026):
- Tuna: High demand at Liwatoni due to export spikes. Prices are up 15%.
- Snapper: Oversupply at Likoni landing site; advice sellers to move stock to Bamburi/Nyali for better margins.
- Kingfish: Rare this season; premium prices at Old Town market.
- Cold Storage: Liwatoni is currently at 80% capacity; priority given to catches > 50kg.

When a user provides a report, extract:
- species: The type of fish (standardized to English)
- weight_kg: The weight in kilograms (number only)
- location: Where it was caught or landed
- market_advice: Provide a strategic recommendation based on the CURRENT MARKET INTELLIGENCE above. Be specific about where to sell or if they should use cold storage.

Format your response strictly as JSON.
"""

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-lite",
        system_instruction=SYSTEM_PROMPT
    )
else:
    print("CRITICAL: GEMINI_API_KEY not found")
    model = None

# Mock DB for Trust Scores
# In a real app, this would be a database like PostgreSQL or Firestore
user_profiles = {
    "default_user": {"trust_score": 0, "name": "Mvuvi 001"}
}


class CatchRequest(BaseModel):
    raw_text: str
    user_id: str = "default_user"

class CatchResponse(BaseModel):
    species: str
    weight_kg: float
    location: str
    market_advice: Optional[str] = None
    trust_score: int

@app.post("/process-catch", response_model=CatchResponse)
async def process_catch(request: CatchRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini model not configured. Check API Key.")
    
    try:
        # Using the standard SDK syntax
        response = model.generate_content(
            request.raw_text,
            generation_config={"response_mime_type": "application/json"}
        )
        
        print(f"DEBUG: Gemini response text: {response.text}")
        
        # Clean up response text in case Gemini wraps it in markdown blocks
        clean_text = response.text.strip()
        if clean_text.startswith("```"):
            clean_text = clean_text.split("```")[1]
            if clean_text.startswith("json"):
                clean_text = clean_text[4:]
        
        extracted_data = json.loads(clean_text)
        
        # Handle cases where Gemini might return a list
        if isinstance(extracted_data, list) and len(extracted_data) > 0:
            extracted_data = extracted_data[0]
        elif not isinstance(extracted_data, dict):
            extracted_data = {}
        
        # 1. Update Trust Score
        if request.user_id not in user_profiles:
            user_profiles[request.user_id] = {"trust_score": 0, "name": "New Mvuvi"}
        
        user_profiles[request.user_id]["trust_score"] += 1
        
        # 2. Market Advice (Now dynamic from AI)
        advice = extracted_data.get("market_advice")
        if not advice:
            weight = extracted_data.get("weight_kg", 0)
            advice = "Local market recommended."
            if weight > 10:
                advice = "Liwatoni Cold Storage (Recommended for bulk catches)"
        
        return {
            "species": str(extracted_data.get("species") or "unknown"),
            "weight_kg": float(extracted_data.get("weight_kg") or 0.0),
            "location": str(extracted_data.get("location") or "unknown"),
            "market_advice": advice,
            "trust_score": user_profiles[request.user_id]["trust_score"]
        }
    except Exception as e:
        import traceback
        print(f"Error processing catch: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

@app.get("/profile/{user_id}")
async def get_profile(user_id: str):
    if user_id not in user_profiles:
        raise HTTPException(status_code=404, detail="User not found")
    return user_profiles[user_id]

@app.get("/health")
def health():
    return {
        "status": "active", 
        "model": "gemini-1.5-flash",
        "sdk": "google-genai"
    }

# Serve static files from the 'static' directory
# This directory will contain the built Angular app
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # If the path looks like a file (has an extension), don't serve index.html
        if "." in full_path.split("/")[-1]:
            # Try to serve from static
            file_path = os.path.join("static", full_path)
            if os.path.exists(file_path):
                return FileResponse(file_path)
            return HTTPException(status_code=404)
        
        # Otherwise, serve index.html for Angular routing
        return FileResponse("static/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)