# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation provides an AI-powered chat interface for drafting all 12 supported legal document types. Users select a document type from a card grid, then chat with the AI to fill in fields — the preview updates live on the right.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database uses SQLite and is created from scratch each time the Docker container is brought up.
The frontend is statically built (Next.js `output: "export"`) and served directly by FastAPI.
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### Completed (PL-2)
- CommonPaper legal document templates in `templates/`
- `catalog.json` listing all 12 document types

### Completed (PL-3)
- Next.js frontend prototype
- Mutual NDA form with fields, live preview, and PDF download (print)

### Completed (PL-4)
- Docker multi-stage build (Node frontend build + Python FastAPI runtime)
- FastAPI backend (`backend/`) as a uv Python project
- SQLite DB created fresh on each container start (`users` table)
- Next.js configured for static export; served by FastAPI at `localhost:8000`
- Fake login screen at `/` (no real auth); NDA form at `/dashboard`
- Start/stop scripts for Mac, Linux, Windows in `scripts/`

### Completed (PL-5)
- Split-pane dashboard: AI chat (left) + live NDA preview (right)
- `backend/ai.py`: LiteLLM/Cerebras (`gpt-oss-120b`) with Pydantic structured outputs
- `POST /api/chat` SSE endpoint: streams reply word-by-word, emits fields event at end
- LLM call runs in `asyncio.to_thread` to avoid blocking the event loop
- `frontend/src/components/ChatPanel.tsx`: SSE reader, error handling, welcome screen
- Dashboard rewritten; "Preview & Download PDF" navigates to existing preview page

### Completed (PL-6)
- Document type selection screen (`/select`): 12 card grid + "Not sure? Get AI help" option
- `backend/fields.py`: 12 per-doc Pydantic partial-field models
- `backend/prompts.py`: 12 system prompts (one per doc type + classifier)
- `backend/docs.py`: `DOC_REGISTRY` mapping doc types to configs
- `backend/template_renderer.py`: markdown cover page templates with `{{field}}` substitution
- `templates/cover-pages/`: 11 markdown cover page templates
- `POST /api/preview`: renders template with fields → HTML
- `frontend/src/lib/docTypes.ts`: client-side doc type config
- `frontend/src/components/DocPreview.tsx`: generic template-based document preview
- `frontend/src/components/DocTypeCard.tsx`: doc selection card component
- `ChatPanel` generalized: sends `doc_type` to backend; handles `doc_type` SSE event for unknown→detected transitions
- "Not sure" flow: `doc_type: "unknown"` triggers classifier; AI emits `doc_type` SSE event to transition

### Planned (PL-7)
- Real user authentication (JWT, bcrypt)
- Document persistence (save/load/delete per user)

### Current API Endpoints
- `GET /api/health` - Health check
- `POST /api/chat` - AI chat: `{messages, fields, doc_type}` → SSE stream of text deltas + extracted fields
- `POST /api/preview` - Render template: `{doc_type, fields}` → `{html}`