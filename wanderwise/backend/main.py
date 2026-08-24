"""WanderWise mock API.

This backend intentionally uses in-memory data so the React demo can be
connected to a real database, auth provider, payment processor, and LLM later.
Run with: uvicorn main:app --reload --port 8000
"""
from datetime import date
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="WanderWise Mock API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DESTINATIONS = [
    {"id": "d1", "name": "Hampi", "state": "Karnataka", "country": "India", "isOffbeat": True, "startingPriceINR": 4200, "avgRating": 4.9},
    {"id": "d2", "name": "Alappuzha", "state": "Kerala", "country": "India", "isOffbeat": True, "startingPriceINR": 5100, "avgRating": 4.8},
    {"id": "d3", "name": "Tirthan Valley", "state": "Himachal Pradesh", "country": "India", "isOffbeat": True, "startingPriceINR": 3800, "avgRating": 4.7},
    {"id": "d4", "name": "Pondicherry", "state": "Tamil Nadu", "country": "India", "isOffbeat": False, "startingPriceINR": 3300, "avgRating": 4.6},
]

HOTELS = [
    {"id": "h1", "name": "Mango Tree Homestay", "location": "Hampi, Karnataka", "starRating": 3, "reviewScore": 4.9, "reviewCount": 128, "pricePerNightINR": 4200, "amenities": ["Breakfast", "Garden", "Wi-Fi"], "isOffbeat": True},
    {"id": "h2", "name": "Kadalundi River Retreat", "location": "Alappuzha, Kerala", "starRating": 4, "reviewScore": 4.8, "reviewCount": 94, "pricePerNightINR": 5700, "amenities": ["River view", "Kayaks", "Dinner"], "isOffbeat": True},
    {"id": "h3", "name": "The Pine & Pebble", "location": "Tirthan Valley, Himachal", "starRating": 4, "reviewScore": 4.7, "reviewCount": 73, "pricePerNightINR": 4900, "amenities": ["Fireplace", "Trails", "Bonfire"], "isOffbeat": False},
]

EXPERIENCES = [
    {"id": "e1", "title": "Heritage breakfast with a local family", "hostId": "g1", "hostName": "Asha", "category": "Food", "durationHours": 2.5, "priceINR": 950, "rating": 4.9, "groupSizeMax": 6},
    {"id": "e2", "title": "Pottery, chai, and a village studio", "hostId": "g2", "hostName": "Meera", "category": "Workshops", "durationHours": 3, "priceINR": 1200, "rating": 4.8, "groupSizeMax": 8},
    {"id": "e3", "title": "Sunrise coracle ride on the Tungabhadra", "hostId": "g3", "hostName": "Ravi", "category": "Adventure", "durationHours": 2, "priceINR": 1600, "rating": 4.7, "groupSizeMax": 5},
]

BOOKINGS = []


class PlannerInput(BaseModel):
    destination: str = Field(min_length=2)
    startDate: date
    endDate: date
    budgetINR: int = Field(gt=0)
    travelers: int = Field(default=2, ge=1, le=20)
    interests: list[str] = []
    pace: Literal["relaxed", "balanced", "packed"] = "balanced"


class BookingRequest(BaseModel):
    userId: str = "demo-user"
    type: Literal["hotel", "experience"]
    itemId: str
    checkIn: date | None = None
    checkOut: date | None = None
    guests: int = Field(default=2, ge=1, le=20)
    totalPriceINR: int = Field(gt=0)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "wanderwise-mock-api"}


@app.get("/api/destinations")
def list_destinations(offbeat: bool | None = None):
    if offbeat is None:
        return DESTINATIONS
    return [item for item in DESTINATIONS if item["isOffbeat"] is offbeat]


@app.get("/api/hotels")
def list_hotels(
    destination: str | None = None,
    offbeat: bool | None = None,
    max_price: int | None = Query(default=None, gt=0),
):
    results = HOTELS
    if destination:
        destination_lower = destination.lower()
        results = [item for item in results if destination_lower in item["location"].lower()]
    if offbeat is not None:
        results = [item for item in results if item["isOffbeat"] is offbeat]
    if max_price:
        results = [item for item in results if item["pricePerNightINR"] <= max_price]
    return results


@app.get("/api/experiences")
def list_experiences(category: str | None = None, max_price: int | None = Query(default=None, gt=0)):
    results = EXPERIENCES
    if category and category.lower() != "all experiences":
        results = [item for item in results if item["category"].lower() == category.lower()]
    if max_price:
        results = [item for item in results if item["priceINR"] <= max_price]
    return results


@app.post("/api/planner/generate")
def generate_itinerary(payload: PlannerInput):
    """Return a deterministic mock itinerary; replace with an LLM call later."""
    day_count = max((payload.endDate - payload.startDate).days, 1)
    ideas = {
        "morning": "A slow local breakfast and a short neighborhood walk",
        "afternoon": "A small-group cultural visit with a local host",
        "evening": "Golden-hour viewpoint followed by a regional dinner",
    }
    days = []
    for index in range(min(day_count, 7)):
        current = payload.startDate.fromordinal(payload.startDate.toordinal() + index)
        days.append({
            "date": current.isoformat(),
            "morning": [ideas["morning"]],
            "afternoon": [ideas["afternoon"]],
            "evening": [ideas["evening"]],
        })
    return {
        "id": f"trip-{uuid4().hex[:8]}",
        "tripName": f"The slower side of {payload.destination}",
        "destination": payload.destination,
        "pace": payload.pace,
        "days": days,
        "note": "Mock result. Connect your LLM provider here when ready.",
    }


@app.post("/api/bookings", status_code=201)
def create_booking(payload: BookingRequest):
    item_exists = any(item["id"] == payload.itemId for item in HOTELS + EXPERIENCES)
    if not item_exists:
        raise HTTPException(status_code=404, detail="The selected stay or experience was not found")
    booking = {
        "id": f"booking-{uuid4().hex[:8]}",
        **payload.model_dump(mode="json"),
        "status": "confirmed",
        "paymentStatus": "mock_pending",
    }
    BOOKINGS.append(booking)
    return booking


@app.get("/api/bookings")
def list_bookings(user_id: str = "demo-user"):
    return [booking for booking in BOOKINGS if booking["userId"] == user_id]


@app.get("/api/rewards/{user_id}")
def rewards(user_id: str):
    return {
        "userId": user_id,
        "wanderPoints": 2840,
        "impactINR": 18650,
        "badges": [
            {"id": "b1", "name": "Pathfinder", "criteria": "3 offbeat trips", "unlocked": True},
            {"id": "b2", "name": "Good guest", "criteria": "5 reviews shared", "unlocked": True},
            {"id": "b3", "name": "Local legend", "criteria": "10 experiences", "unlocked": False},
        ],
    }
