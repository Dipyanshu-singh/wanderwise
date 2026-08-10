# RUHI — Rural Upliftment for Health in India

RUHI is an AI-powered, multilingual healthcare companion web application 
built for rural and semi-urban India.

Millions in rural India struggle to identify government health schemes they 
qualify for, describe symptoms in their own language, interpret prescriptions 
written in English, or find the nearest health centre — often compounded by 
patchy internet access. RUHI bridges this gap by letting users simply speak 
or type in Hindi or a regional language to get:

- 🗣️ **Voice-based multilingual symptom checker** – natural-language triage guidance (not a diagnostic tool)
- 🏛️ **Government health scheme finder** – eligibility checks and how-to-apply guidance for schemes like Ayushman Bharat (PM-JAY) and Janani Suraksha Yojana
- 📄 **Prescription photo translator** – converts English/medical prescriptions into the user's local language
- 📍 **Nearest PHC/CHC locator** – directions to the closest health centre

## Current Status
RUHI is currently live as a **web application**. 

### 🚧 Roadmap
- 📶 **Offline-first mode** — usable in low-connectivity rural areas with sync-on-reconnect
- 📱 **Native mobile apps** (Android/iOS) for wider, easier access
- 💬 **WhatsApp/voice-call integration** for users without smartphones or app access

## Tech Stack
- **Frontend:** React + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB (Atlas)
- **AI/ML:** Google Gemini AI, Whisper/Google Speech API (speech-to-text), IndicTrans2/Google Translate API, Tesseract OCR
- **Auth:** Firebase Authentication
- **Maps:** Google Maps / OpenStreetMap

## Why RUHI?
Most solutions in this space stop at a chatbot. RUHI pairs symptom triage 
with an entitlement engine, prescription literacy tools, and (soon) offline 
resilience — tackling awareness, accessibility, and continuity of care 
together, in one voice-first product.

Built by **Team Nebula** for **Decode SIH 2026**.
