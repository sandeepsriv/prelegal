import os
import sqlite3
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
DB_PATH = os.path.join(os.path.dirname(__file__), "prelegal.db")


def init_db():
    """Create fresh SQLite database with initial schema."""
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, "
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    )
    conn.commit()
    conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if os.path.exists(STATIC_DIR):
    next_static = os.path.join(STATIC_DIR, "_next")
    if os.path.exists(next_static):
        app.mount("/_next", StaticFiles(directory=next_static), name="next-assets")


@app.get("/{path:path}")
async def serve_frontend(path: str):
    """Serve Next.js static export, falling back to index.html."""
    if not os.path.exists(STATIC_DIR):
        return {"error": "Frontend not built"}

    if not path or path == "/":
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))

    exact = os.path.join(STATIC_DIR, path)
    if os.path.isfile(exact):
        return FileResponse(exact)

    dir_index = os.path.join(STATIC_DIR, path, "index.html")
    if os.path.isfile(dir_index):
        return FileResponse(dir_index)

    html_file = exact + ".html"
    if os.path.isfile(html_file):
        return FileResponse(html_file)

    return FileResponse(os.path.join(STATIC_DIR, "index.html"))
