"""Pydantic partial-field models for each supported document type."""
from typing import Optional
from pydantic import BaseModel


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


class PartialCSAFields(BaseModel):
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    effectiveDate: Optional[str] = None
    governingLaw: Optional[str] = None
    chosenCourts: Optional[str] = None
    subscriptionPeriod: Optional[str] = None
    paymentProcess: Optional[str] = None
    generalCapAmount: Optional[str] = None


class PartialSLAFields(BaseModel):
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    targetUptime: Optional[str] = None
    targetResponseTime: Optional[str] = None
    supportChannel: Optional[str] = None
    uptimeCredit: Optional[str] = None
    responseTimeCredit: Optional[str] = None
    scheduledDowntime: Optional[str] = None


class PartialDesignPartnerFields(BaseModel):
    providerName: Optional[str] = None
    partnerName: Optional[str] = None
    effectiveDate: Optional[str] = None
    term: Optional[str] = None
    program: Optional[str] = None
    governingLaw: Optional[str] = None
    chosenCourts: Optional[str] = None


class PartialPSAFields(BaseModel):
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    effectiveDate: Optional[str] = None
    governingLaw: Optional[str] = None
    chosenCourts: Optional[str] = None
    generalCapAmount: Optional[str] = None


class PartialDPAFields(BaseModel):
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    categoriesOfPersonalData: Optional[str] = None
    categoriesOfDataSubjects: Optional[str] = None
    governingMemberState: Optional[str] = None
    securityPolicy: Optional[str] = None


class PartialPartnershipFields(BaseModel):
    companyName: Optional[str] = None
    partnerName: Optional[str] = None
    effectiveDate: Optional[str] = None
    endDate: Optional[str] = None
    obligations: Optional[str] = None
    territory: Optional[str] = None
    governingLaw: Optional[str] = None
    chosenCourts: Optional[str] = None


class PartialSoftwareLicenseFields(BaseModel):
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    effectiveDate: Optional[str] = None
    subscriptionPeriod: Optional[str] = None
    permittedUses: Optional[str] = None
    governingLaw: Optional[str] = None
    chosenCourts: Optional[str] = None


class PartialPilotFields(BaseModel):
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    effectiveDate: Optional[str] = None
    pilotPeriod: Optional[str] = None
    governingLaw: Optional[str] = None
    chosenCourts: Optional[str] = None


class PartialBAAFields(BaseModel):
    providerName: Optional[str] = None
    companyName: Optional[str] = None
    baaEffectiveDate: Optional[str] = None
    breachNotificationPeriod: Optional[str] = None
    limitations: Optional[str] = None


class PartialAIAddendumFields(BaseModel):
    providerName: Optional[str] = None
    customerName: Optional[str] = None
    trainingData: Optional[str] = None
    trainingPurposes: Optional[str] = None
    trainingRestrictions: Optional[str] = None


class UnknownDocFields(BaseModel):
    detectedDocType: Optional[str] = None
