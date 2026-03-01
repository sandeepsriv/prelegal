"""Renders document cover page templates with field substitution."""
import re
from pathlib import Path

import markdown

COVER_PAGES_DIR = Path(__file__).parent.parent / "templates" / "cover-pages"


def render_template(doc_type: str, fields: dict) -> str:
    """Substitute fields into cover page template and return HTML.

    Unknown fields render as italicized [fieldName] placeholders.
    """
    template_path = COVER_PAGES_DIR / f"{doc_type}.md"
    if not template_path.exists():
        return f"<p><em>Template not available for document type: {doc_type}</em></p>"

    source = template_path.read_text()

    def replace(m: re.Match) -> str:
        key = m.group(1)
        value = fields.get(key, "")
        return value if value else f"<em>[{key}]</em>"

    substituted = re.sub(r"\{\{(\w+)\}\}", replace, source)
    return markdown.markdown(substituted, extensions=["tables"])
