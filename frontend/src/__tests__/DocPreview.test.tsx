import { render, screen, waitFor } from "@testing-library/react";
import DocPreview from "@/components/DocPreview";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.useFakeTimers();
  mockFetch.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("DocPreview", () => {
  it("shows loading skeleton initially", () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ html: "<h1>Test</h1>" }),
    });
    const { container } = render(<DocPreview docType="pilot" fields={{}} />);
    const skeletonLines = container.querySelectorAll(".animate-pulse div");
    expect(skeletonLines.length).toBeGreaterThan(0);
  });

  it("renders HTML returned from /api/preview", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        html: "<h1>Pilot Agreement</h1><p>Provider: <strong>Acme Corp</strong></p>",
      }),
    });
    render(<DocPreview docType="pilot" fields={{ providerName: "Acme Corp" }} />);
    jest.runAllTimers();
    await waitFor(() => screen.getByText("Pilot Agreement"));
    expect(screen.getByText("Acme Corp")).toBeTruthy();
  });

  it("calls /api/preview with correct doc_type and fields", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ html: "<p>ok</p>" }),
    });
    render(<DocPreview docType="csa" fields={{ providerName: "WidgetCo" }} />);
    jest.runAllTimers();
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("/api/preview");
    const body = JSON.parse(opts.body);
    expect(body.doc_type).toBe("csa");
    expect(body.fields.providerName).toBe("WidgetCo");
  });

  it("shows error message when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("network error"));
    render(<DocPreview docType="pilot" fields={{}} />);
    jest.runAllTimers();
    await waitFor(() =>
      screen.getByText(/Preview unavailable/)
    );
  });
});
