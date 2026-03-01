"""Tests for the /api/chat endpoint with mocked AI."""
import json
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from ai import ChatResponse, PartialMNDAFields
from main import app

client = TestClient(app)


def make_ai_response(reply: str, **field_kwargs) -> ChatResponse:
    return ChatResponse(reply=reply, fields=PartialMNDAFields(**field_kwargs))


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
            json={"messages": [{"role": "user", "content": "hi"}], "fields": {}},
        )
    assert r.status_code == 200
    events = [
        json.loads(line[6:])
        for line in r.text.splitlines()
        if line.startswith("data: ")
    ]
    fields_event = next(e for e in events if e["type"] == "fields")
    assert fields_event["data"] == {}


def test_chat_passes_messages_and_fields_to_ai():
    mock_result = make_ai_response("Got it.")
    with patch("main.chat_completion") as mock_fn:
        mock_fn.return_value = mock_result
        client.post(
            "/api/chat",
            json={
                "messages": [{"role": "user", "content": "Hello"}],
                "fields": {"purpose": "partnership eval"},
            },
        )
    mock_fn.assert_called_once()
    call_args = mock_fn.call_args
    assert call_args[0][0] == [{"role": "user", "content": "Hello"}]
    assert call_args[0][1]["purpose"] == "partnership eval"
