from typing import Optional
from pydantic import BaseModel
from litellm import completion

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a legal assistant helping users draft a Mutual Non-Disclosure Agreement (MNDA).

Your job is to have a friendly conversation to gather the required fields for the MNDA, then return those fields in structured output.

The required fields are:
- purpose: How confidential information may be used (e.g. "Evaluating a business partnership")
- effectiveDate: The date the agreement takes effect (ISO format YYYY-MM-DD)
- mndaTermType: "expires" (fixed years) or "ongoing" (until terminated)
- mndaTermYears: Number of years (only if mndaTermType is "expires")
- confidentialityTermType: "fixed" (fixed years) or "perpetuity" (forever)
- confidentialityTermYears: Number of years (only if confidentialityTermType is "fixed")
- governingLaw: The US state whose laws govern the agreement (e.g. "Delaware")
- jurisdiction: City/county and state where disputes are resolved (e.g. "Wilmington, Delaware")
- party1Name, party1Title, party1Company, party1NoticeAddress: First party signatory details
- party2Name, party2Title, party2Company, party2NoticeAddress: Second party signatory details

Guidelines:
- Start by greeting the user and asking about the purpose of the NDA
- Ask for missing fields naturally in conversation, grouping related questions
- When you learn a field value from the user, extract it and include it in your fields response
- Only include fields you've newly learned or confirmed in this response
- When all fields are complete, congratulate the user and say the document is ready to preview
- Be concise and friendly, not overly formal

Always respond in the structured format requested."""


class PartialMNDAFields(BaseModel):
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[str] = None
    mndaTermYears: Optional[str] = None
    confidentialityTermType: Optional[str] = None
    confidentialityTermYears: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    party1Name: Optional[str] = None
    party1Title: Optional[str] = None
    party1Company: Optional[str] = None
    party1NoticeAddress: Optional[str] = None
    party2Name: Optional[str] = None
    party2Title: Optional[str] = None
    party2Company: Optional[str] = None
    party2NoticeAddress: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    fields: PartialMNDAFields


def chat_completion(messages: list[dict], current_fields: dict) -> ChatResponse:
    """Call LLM with conversation history and return reply + extracted fields."""
    filled = {k: v for k, v in current_fields.items() if v}
    system_with_state = SYSTEM_PROMPT
    if filled:
        system_with_state += f"\n\nFields already collected: {filled}"

    llm_messages = [{"role": "system", "content": system_with_state}] + messages

    response = completion(
        model=MODEL,
        messages=llm_messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )
    result = response.choices[0].message.content
    return ChatResponse.model_validate_json(result)
