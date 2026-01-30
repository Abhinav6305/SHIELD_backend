from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from data_loader import load_transactions, get_ip_to_accounts
from graph_builder import build_transaction_graph, get_fraud_nodes
from risk_engine import compute_risk_scores, get_account_risk, get_all_nodes, get_all_edges
from schemas import Node, Edge, AccountDetail

app = FastAPI(title="Chakravyuh AI Fraud Detection API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for in-memory storage
df = None
G = None
fraud_nodes = None
risk_info = None

@app.on_event("startup")
async def startup_event():
    """Load data and compute risk scores on startup."""
    global df, G, fraud_nodes, risk_info

    # Load data
    df = load_transactions("data/sample_transactions.csv")

    # Build graph
    ip_accounts = get_ip_to_accounts(df)
    G = build_transaction_graph(df, ip_accounts)

    # Get fraud nodes
    fraud_nodes = get_fraud_nodes(df)

    # Compute risk scores
    risk_info = compute_risk_scores(G, fraud_nodes)

@app.get("/graph/nodes", response_model=List[Node])
async def get_nodes():
    """Get all nodes with risk information."""
    return get_all_nodes(risk_info)

@app.get("/graph/edges", response_model=List[Edge])
async def get_edges():
    """Get all edges."""
    return get_all_edges(G)

@app.get("/account/{account_id}", response_model=AccountDetail)
async def get_account(account_id: str):
    """Get detailed risk information for a specific account."""
    return get_account_risk(account_id, risk_info)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
