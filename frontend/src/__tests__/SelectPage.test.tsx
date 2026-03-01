import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SelectPage from "@/app/select/page";
import { DOC_TYPES } from "@/lib/docTypes";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SelectPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders all document type cards", () => {
    render(<SelectPage />);
    for (const docType of DOC_TYPES) {
      expect(screen.getByText(docType.name)).toBeTruthy();
    }
  });

  it("navigates to dashboard with correct doc param on card click", () => {
    render(<SelectPage />);
    const draftButtons = screen.getAllByText("Draft this");
    fireEvent.click(draftButtons[0]);
    expect(mockPush).toHaveBeenCalledWith(`/dashboard?doc=${DOC_TYPES[0].key}`);
  });

  it("renders the Not sure card and navigates to unknown", () => {
    render(<SelectPage />);
    const helpButton = screen.getByText("Get AI help");
    fireEvent.click(helpButton);
    expect(mockPush).toHaveBeenCalledWith("/dashboard?doc=unknown");
  });
});
