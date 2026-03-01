import asyncio
import json
import os
import sqlite3
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()  # loads .env from cwd or parent dirs; Docker injects vars via env_file

from ai import chat_completion  # noqa: E402 (must be after load_dotenv)
from template_renderer import render_template  # noqa: E402

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


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    fields: dict
    doc_type: str = "mnda"


class PreviewRequest(BaseModel):
    doc_type: str
    fields: dict


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Stream AI chat response with extracted document fields."""
    messages = [m.model_dump() for m in request.messages]
    result = await asyncio.to_thread(
        chat_completion, messages, request.fields, request.doc_type
    )

    async def generate():
        words = result.reply.split(" ")
        for i, word in enumerate(words):
            chunk = word if i == len(words) - 1 else word + " "
            yield f"data: {json.dumps({'type': 'text', 'delta': chunk})}\n\n"

        # Emit doc_type event for the "unknown" classifier flow
        if request.doc_type == "unknown":
            detected = result.fields.get("detectedDocType")
            if detected:
                yield f"data: {json.dumps({'type': 'doc_type', 'data': detected})}\n\n"

        yield f"data: {json.dumps({'type': 'fields', 'data': result.fields})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.post("/api/preview")
async def preview(request: PreviewRequest):
    """Render document template with substituted fields, returning HTML."""
    html = render_template(request.doc_type, request.fields)
    return {"html": html}


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
