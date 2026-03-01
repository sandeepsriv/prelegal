"""AI chat completion with per-document structured outputs."""
from dataclasses import dataclass
from typing import Type
from pydantic import BaseModel, create_model
from litellm import completion

from docs import DOC_REGISTRY

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}


@dataclass
class ChatResult:
    reply: str
    fields: dict


def _make_response_model(fields_class: Type[BaseModel]) -> Type[BaseModel]:
    """Create a ChatResponse Pydantic model with the given fields class."""
    return create_model(
        "ChatResponse",
        reply=(str, ...),
        fields=(fields_class, fields_class()),
    )


def chat_completion(messages: list[dict], current_fields: dict, doc_type: str) -> ChatResult:
    """Call LLM with conversation history and return reply + extracted fields."""
    config = DOC_REGISTRY.get(doc_type)
    if config is None:
        config = DOC_REGISTRY["unknown"]

    filled = {k: v for k, v in current_fields.items() if v}
    system_prompt = config.prompt
    if filled:
        system_prompt += f"\n\nFields already collected: {filled}"

    llm_messages = [{"role": "system", "content": system_prompt}] + messages
    ResponseModel = _make_response_model(config.fields_class)

    response = completion(
        model=MODEL,
        messages=llm_messages,
        response_format=ResponseModel,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )
    result = ResponseModel.model_validate_json(response.choices[0].message.content)
    return ChatResult(reply=result.reply, fields=result.fields.model_dump(exclude_none=True))
