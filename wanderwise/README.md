# WanderWise — React + JSX + Python starter

WanderWise is a frontend-first tourism and hospitality demo based on the supplied product requirements. This package is intentionally **not deployed**. It contains a Vite React UI with JSX, local mock data, and an optional FastAPI mock backend whose endpoints are ready to replace with real integrations later.

## Included files

| Path | Purpose |
|---|---|
| `index.html` | Vite HTML entry point and font setup |
| `src/main.jsx` | React entry point |
| `src/App.jsx` | Main application UI, client-side demo navigation, and interactions |
| `src/data.js` | Mock destinations, stays, experiences, and itinerary data |
| `src/styles.css` | Responsive visual system and layouts |
| `backend/main.py` | FastAPI mock API for destinations, hotels, experiences, planner, bookings, and rewards |
| `backend/requirements.txt` | Python dependencies |

## Run the React frontend locally

From the project folder:

```bash
pnpm install
pnpm dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The frontend is functional using local mock data and does not require the Python API to be running. Use the role selector in the top-right corner to preview the Traveler, Vendor, and Guide views.

## Run the Python mock API locally

In a second terminal:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API documentation will be available at `http://localhost:8000/docs`.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/destinations` | Destination feed with optional `offbeat` filter |
| `GET` | `/api/hotels` | Hotel search with destination, price, and offbeat filters |
| `GET` | `/api/experiences` | Experience search with category and price filters |
| `POST` | `/api/planner/generate` | Deterministic mock itinerary generation |
| `POST` | `/api/bookings` | Creates a mock confirmed booking with placeholder payment status |
| `GET` | `/api/bookings` | Lists demo bookings by user ID |
| `GET` | `/api/rewards/{user_id}` | Returns mock WanderPoints, impact, and badges |

## Planner request example

```bash
curl -X POST http://localhost:8000/api/planner/generate \
  -H 'Content-Type: application/json' \
  -d '{
    "destination": "Hampi",
    "startDate": "2026-10-12",
    "endDate": "2026-10-14",
    "budgetINR": 25000,
    "travelers": 2,
    "interests": ["food", "culture", "nature"],
    "pace": "balanced"
  }'
```

## Next integration points

The current UI keeps the frontend self-contained so it can be reviewed immediately. When you connect a real service, replace the mock data and notification handlers in `src/App.jsx` with `fetch` calls to the FastAPI endpoints. The Python module is deliberately in-memory: add authentication, persistence, an actual LLM provider, payment processing, maps, availability, and production CORS rules before using it beyond a local demo.
