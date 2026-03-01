export interface DocTypeConfig {
  key: string;
  name: string;
  description: string;
}

export type DocFields = Record<string, string>;

export const DOC_TYPES: DocTypeConfig[] = [
  {
    key: "mnda",
    name: "Mutual NDA",
    description:
      "Standard mutual non-disclosure agreement for two parties sharing confidential information.",
  },
  {
    key: "csa",
    name: "Cloud Service Agreement",
    description:
      "Comprehensive agreement for selling and buying cloud software and SaaS products.",
  },
  {
    key: "sla",
    name: "Service Level Agreement",
    description:
      "Defines uptime and response time commitments for cloud services, including remedies.",
  },
  {
    key: "design_partner",
    name: "Design Partner Agreement",
    description:
      "Gives a partner early product access in exchange for structured feedback.",
  },
  {
    key: "psa",
    name: "Professional Services Agreement",
    description:
      "Governs professional services engagements via statements of work.",
  },
  {
    key: "dpa",
    name: "Data Processing Agreement",
    description:
      "GDPR-compliant agreement governing how personal data is processed.",
  },
  {
    key: "partnership",
    name: "Partnership Agreement",
    description:
      "Formalizes co-marketing and business partnership arrangements.",
  },
  {
    key: "software_license",
    name: "Software License Agreement",
    description:
      "Licenses on-premise or installed software to a customer.",
  },
  {
    key: "pilot",
    name: "Pilot Agreement",
    description:
      "Short-term product evaluation agreement before a full commercial deal.",
  },
  {
    key: "baa",
    name: "Business Associate Agreement",
    description:
      "HIPAA-compliant agreement governing handling of protected health information.",
  },
  {
    key: "ai_addendum",
    name: "AI Addendum",
    description:
      "Addendum for agreements involving AI/ML services, covering data use and IP.",
  },
];
