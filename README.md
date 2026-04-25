# Bahari-Connect: AI Financial Agent for the Blue Economy ⛵

**Built for: Build with AI Pwani 2026 Buildathon**

🚀 **Live Demo**: [https://bahari-connect-711398702196.us-central1.run.app](https://bahari-connect-711398702196.us-central1.run.app)

## 🌊 The Challenge
Coastal fishing communities in Mombasa (Likoni, Bamburi, Liwatoni) contribute significantly to the Blue Economy but remain financially invisible. Fishermen often lack formal records, making it impossible to access credit from banks or Chamas. Additionally, they are vulnerable to market price fluctuations due to a lack of real-time negotiation data.

## 🚀 Our Solution: Bahari-Connect
Bahari-Connect is an **AI-powered Financial Secretary** that turns daily fishing reports into a verified digital ledger. 

### Key Features:
- **🗣️ Sheng/English Voice Intelligence**: A Voice-to-Text agent that understands localized code-switching, allowing fishermen to report catches in their natural language.
- **💎 Automated Digital Ledger**: The Gemini-powered agent extracts species, weight, and location, creating a structured financial record from raw voice/text.
- **📈 Real-Time Market Grounding**: Using dynamic market intelligence (April 2026), the AI provides strategic negotiation advice (e.g., "Oversupply at Likoni—move stock to Nyali for 15% better margins").
- **💳 Trust Score (Creditworthiness)**: Generates a simulated "Trust Score" for each record, providing the alternative data needed for micro-finance and Chamas.

## 🛠️ Technical Stack
- **AI Model**: Google Gemini 2.5 Flash (via Google AI Studio).
- **Backend**: FastAPI (Python) deployed on **Google Cloud Run**.
- **Frontend**: Angular 21 (Modern Signals-based architecture).
- **Database**: Google Firebase (Firestore) for real-time persistence.
- **Deployment**: Fully containerized with Docker.

## 🏆 Judging Pillars
- **Originality**: First-of-its-kind "Financial Secretary" specifically for coastal small-scale fisheries.
- **Execution**: Integrated Google Generative AI with real-time web grounding and a high-performance Angular/FastAPI stack.
- **Real-World Impact**: Empowers the 10,000+ fishermen in Pwani to build a credit history and negotiate better prices.
- **Google Cloud/AI**: Deep integration of Gemini API, Firebase, and Cloud Run.

## 📦 How to Run Locally
1. Clone the repo.
2. Add your `GOOGLE_API_KEY` to `backend/.env`.
3. Run `docker-compose up` or start the FastAPI/Angular servers individually.

---
**Build with AI Pwani 2026 • Sote Hub • Google Developer Groups**
