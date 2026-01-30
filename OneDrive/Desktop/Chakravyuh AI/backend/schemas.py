from pydantic import BaseModel
from typing import Optional, List

class Node(BaseModel):
    id: str
    risk_score: float
    risk_level: str

class Edge(BaseModel):
    source: str
    target: str
    type: str
    amount: Optional[float] = None
    timestamp: Optional[str] = None
    ip: Optional[str] = None

class AccountDetail(BaseModel):
    id: str
    risk_score: float
    risk_level: str
    explanation: List[str]
