import { render, screen } from "@testing-library/react";
import MNDAPreview from "@/components/MNDAPreview";
import { MNDAFormData } from "@/lib/types";

const baseData: MNDAFormData = {
  purpose: "Evaluating a potential partnership",
  effectiveDate: "2025-01-15",
  mndaTermType: "expires",
  mndaTermYears: "2",
  confidentialityTermType: "fixed",
  confidentialityTermYears: "3",
  governingLaw: "Delaware",
  jurisdiction: "Wilmington, Delaware",
  party1: { name: "Alice Smith", title: "CEO", company: "Alpha Inc", noticeAddress: "1 Alpha St" },
  party2: { name: "Bob Jones", title: "CTO", company: "Beta LLC", noticeAddress: "2 Beta Ave" },
};

describe("MNDAPreview", () => {
  it("renders the MNDA title", () => {
    render(<MNDAPreview data={baseData} />);
    expect(screen.getByRole("heading", { name: /mutual non-disclosure agreement/i })).toBeInTheDocument();
  });

  it("renders the purpose in the cover page and standard terms", () => {
    render(<MNDAPreview data={baseData} />);
    const instances = screen.getAllByText(/Evaluating a potential partnership/);
    // Appears in cover page section and at least once in Standard Terms
    expect(instances.length).toBeGreaterThanOrEqual(2);
  });

  it("renders formatted effective date", () => {
    render(<MNDAPreview data={baseData} />);
    expect(screen.getAllByText(/January 15, 2025/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders expires term text when mndaTermType is 'expires'", () => {
    render(<MNDAPreview data={baseData} />);
    expect(screen.getByText(/Expires 2 years from Effective Date/)).toBeInTheDocument();
  });

  it("renders ongoing term text when mndaTermType is 'ongoing'", () => {
    render(<MNDAPreview data={{ ...baseData, mndaTermType: "ongoing" }} />);
    expect(
      screen.getByText(/Continues until terminated in accordance with the terms of the MNDA/)
    ).toBeInTheDocument();
  });

  it("renders singular 'year' for mndaTermYears = 1", () => {
    render(<MNDAPreview data={{ ...baseData, mndaTermYears: "1" }} />);
    expect(screen.getByText(/Expires 1 year from Effective Date/)).toBeInTheDocument();
    expect(screen.queryByText(/Expires 1 years/)).not.toBeInTheDocument();
  });

  it("renders fixed confidentiality text with year count", () => {
    render(<MNDAPreview data={baseData} />);
    expect(screen.getByText(/3 years from Effective Date/)).toBeInTheDocument();
  });

  it("renders perpetuity confidentiality text", () => {
    render(
      <MNDAPreview data={{ ...baseData, confidentialityTermType: "perpetuity" }} />
    );
    expect(screen.getByText(/In perpetuity\./)).toBeInTheDocument();
  });

  it("renders governing law and jurisdiction", () => {
    render(<MNDAPreview data={baseData} />);
    expect(screen.getAllByText(/Delaware/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Wilmington, Delaware/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders both party names and companies in signature block", () => {
    render(<MNDAPreview data={baseData} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Alpha Inc")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("Beta LLC")).toBeInTheDocument();
  });

  it("renders blank signature date lines instead of pre-filled dates", () => {
    render(<MNDAPreview data={baseData} />);
    const dateLines = screen.getAllByText("_______________");
    // Should have blanks for: name, title, company, notice address (x2 parties) + date fields
    expect(dateLines.length).toBeGreaterThanOrEqual(2);
  });

  it("renders fallback placeholders when fields are empty", () => {
    const emptyData: MNDAFormData = {
      ...baseData,
      purpose: "",
      governingLaw: "",
      jurisdiction: "",
    };
    render(<MNDAPreview data={emptyData} />);
    expect(screen.getAllByText("[Purpose]").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/\[State\]/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/\[Jurisdiction\]/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders standard terms section heading", () => {
    render(<MNDAPreview data={baseData} />);
    expect(screen.getByRole("heading", { name: /standard terms/i })).toBeInTheDocument();
  });

  it("renders all 11 standard term clauses", () => {
    const { container } = render(<MNDAPreview data={baseData} />);
    const listItems = container.querySelectorAll("ol > li");
    expect(listItems).toHaveLength(11);
  });
});
