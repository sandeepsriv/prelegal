"""Tests for the /api/chat and /api/preview endpoints with mocked AI."""
import json
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from ai import ChatResult
from main import app

client = TestClient(app)


def make_ai_response(reply: str, **field_kwargs) -> ChatResult:
    return ChatResult(reply=reply, fields={k: v for k, v in field_kwargs.items() if v is not None})


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_chat_streams_text_and_fields():
    mock_result = make_ai_response(
        "Hello! What is the purpose of this NDA?",
        party1Company="Acme Corp",
        party2Company="Beta Inc",
    )
    with patch("main.chat_completion", return_value=mock_result):
        r = client.post(
            "/api/chat",
            json={
                "messages": [{"role": "user", "content": "Hi"}],
                "fields": {},
                "doc_type": "mnda",
            },
        )
    assert r.status_code == 200
    assert "text/event-stream" in r.headers["content-type"]

    events = [
        json.loads(line[6:])
        for line in r.text.splitlines()
        if line.startswith("data: ")
    ]
    types = [e["type"] for e in events]
    assert "text" in types
    assert "fields" in types
    assert "done" in types

    full_text = "".join(e["delta"] for e in events if e["type"] == "text")
    assert full_text == "Hello! What is the purpose of this NDA?"

    fields_event = next(e for e in events if e["type"] == "fields")
    assert fields_event["data"]["party1Company"] == "Acme Corp"
    assert fields_event["data"]["party2Company"] == "Beta Inc"


def test_chat_no_fields_extracted():
    mock_result = make_ai_response("Sure, let's get started!")
    with patch("main.chat_completion", return_value=mock_result):
        r = client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "hi"}], "fields": {}, "doc_type": "mnda"},
        )
    assert r.status_code == 200
    events = [
        json.loads(line[6:])
        for line in r.text.splitlines()
        if line.startswith("data: ")
    ]
    fields_event = next(e for e in events if e["type"] == "fields")
    assert fields_event["data"] == {}


def test_chat_passes_messages_fields_and_doc_type_to_ai():
    mock_result = make_ai_response("Got it.")
    with patch("main.chat_completion") as mock_fn:
        mock_fn.return_value = mock_result
        client.post(
            "/api/chat",
            json={
                "messages": [{"role": "user", "content": "Hello"}],
                "fields": {"purpose": "partnership eval"},
                "doc_type": "mnda",
            },
        )
    mock_fn.assert_called_once()
    call_args = mock_fn.call_args[0]
    assert call_args[0] == [{"role": "user", "content": "Hello"}]
    assert call_args[1]["purpose"] == "partnership eval"
    assert call_args[2] == "mnda"


def test_unknown_doc_type_emits_doc_type_event():
    mock_result = make_ai_response(
        "It sounds like you need a Cloud Service Agreement.",
        detectedDocType="csa",
    )
    with patch("main.chat_completion", return_value=mock_result):
        r = client.post(
            "/api/chat",
            json={
                "messages": [{"role": "user", "content": "I need a SaaS contract"}],
                "fields": {},
                "doc_type": "unknown",
            },
        )
    assert r.status_code == 200
    events = [
        json.loads(line[6:])
        for line in r.text.splitlines()
        if line.startswith("data: ")
    ]
    doc_type_events = [e for e in events if e["type"] == "doc_type"]
    assert len(doc_type_events) == 1
    assert doc_type_events[0]["data"] == "csa"


def test_preview_returns_html():
    r = client.post(
        "/api/preview",
        json={"doc_type": "pilot", "fields": {"providerName": "Acme Corp", "customerName": "Beta Inc"}},
    )
    assert r.status_code == 200
    data = r.json()
    assert "html" in data
    assert "Acme Corp" in data["html"]
    assert "Beta Inc" in data["html"]


def test_preview_shows_placeholders_for_missing_fields():
    r = client.post(
        "/api/preview",
        json={"doc_type": "pilot", "fields": {}},
    )
    assert r.status_code == 200
    data = r.json()
    assert "<em>[providerName]</em>" in data["html"]
