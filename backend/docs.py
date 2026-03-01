"""Document type registry mapping doc types to field models and prompts."""
from dataclasses import dataclass
from typing import Type
from pydantic import BaseModel

from fields import (
    PartialMNDAFields,
    PartialCSAFields,
    PartialSLAFields,
    PartialDesignPartnerFields,
    PartialPSAFields,
    PartialDPAFields,
    PartialPartnershipFields,
    PartialSoftwareLicenseFields,
    PartialPilotFields,
    PartialBAAFields,
    PartialAIAddendumFields,
    UnknownDocFields,
)
from prompts import PROMPTS


@dataclass
class DocConfig:
    name: str
    fields_class: Type[BaseModel]
    prompt: str


DOC_REGISTRY: dict[str, DocConfig] = {
    "mnda": DocConfig(
        name="Mutual Non-Disclosure Agreement",
        fields_class=PartialMNDAFields,
        prompt=PROMPTS["mnda"],
    ),
    "csa": DocConfig(
        name="Cloud Service Agreement",
        fields_class=PartialCSAFields,
        prompt=PROMPTS["csa"],
    ),
    "sla": DocConfig(
        name="Service Level Agreement",
        fields_class=PartialSLAFields,
        prompt=PROMPTS["sla"],
    ),
    "design_partner": DocConfig(
        name="Design Partner Agreement",
        fields_class=PartialDesignPartnerFields,
        prompt=PROMPTS["design_partner"],
    ),
    "psa": DocConfig(
        name="Professional Services Agreement",
        fields_class=PartialPSAFields,
        prompt=PROMPTS["psa"],
    ),
    "dpa": DocConfig(
        name="Data Processing Agreement",
        fields_class=PartialDPAFields,
        prompt=PROMPTS["dpa"],
    ),
    "partnership": DocConfig(
        name="Partnership Agreement",
        fields_class=PartialPartnershipFields,
        prompt=PROMPTS["partnership"],
    ),
    "software_license": DocConfig(
        name="Software License Agreement",
        fields_class=PartialSoftwareLicenseFields,
        prompt=PROMPTS["software_license"],
    ),
    "pilot": DocConfig(
        name="Pilot Agreement",
        fields_class=PartialPilotFields,
        prompt=PROMPTS["pilot"],
    ),
    "baa": DocConfig(
        name="Business Associate Agreement",
        fields_class=PartialBAAFields,
        prompt=PROMPTS["baa"],
    ),
    "ai_addendum": DocConfig(
        name="AI Addendum",
        fields_class=PartialAIAddendumFields,
        prompt=PROMPTS["ai_addendum"],
    ),
    "unknown": DocConfig(
        name="Unknown",
        fields_class=UnknownDocFields,
        prompt=PROMPTS["unknown"],
    ),
}
