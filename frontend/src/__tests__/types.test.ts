import { defaultFormData } from "@/lib/types";

describe("defaultFormData", () => {
  it("has expected default values", () => {
    expect(defaultFormData.mndaTermType).toBe("expires");
    expect(defaultFormData.mndaTermYears).toBe("1");
    expect(defaultFormData.confidentialityTermType).toBe("fixed");
    expect(defaultFormData.confidentialityTermYears).toBe("1");
  });

  it("has empty effectiveDate so components set it lazily", () => {
    expect(defaultFormData.effectiveDate).toBe("");
  });

  it("has empty party fields", () => {
    expect(defaultFormData.party1.name).toBe("");
    expect(defaultFormData.party1.company).toBe("");
    expect(defaultFormData.party2.name).toBe("");
    expect(defaultFormData.party2.company).toBe("");
  });

  it("has a non-empty default purpose", () => {
    expect(defaultFormData.purpose.length).toBeGreaterThan(0);
  });
});
