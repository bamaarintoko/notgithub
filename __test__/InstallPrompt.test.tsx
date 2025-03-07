import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import InstallPrompt from "@/components/InstallPrompt";

describe("InstallPrompt", () => {
    beforeAll(() => {
        // Mock window.matchMedia (for checking PWA install state)
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false, // Not installed initially
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });

    it("does not render anything when installPrompt is null", () => {
        render(<InstallPrompt />);
        expect(screen.queryByText(/install this app/i)).not.toBeInTheDocument();
    });

    it("shows install popup when beforeinstallprompt event fires", async () => {
        render(<InstallPrompt />);

        // Create a mock event
        const mockPromptEvent = {
            preventDefault: jest.fn(),
            prompt: jest.fn(),
            userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
        };

        // Fire beforeinstallprompt event
        act(() => {
            window.dispatchEvent(new Event("beforeinstallprompt"));
        });

        // Expect the popup to be visible
        expect(await screen.findByText(/install this app/i)).toBeInTheDocument();
    });

    it("calls prompt() when install button is clicked", async () => {
        render(<InstallPrompt />);

        // Create a mock event with a real function for prompt()
        const mockPromptEvent = {
            preventDefault: jest.fn(),
            prompt: jest.fn(), // Mock function
            userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
        };

        // Dispatch beforeinstallprompt event correctly
        act(() => {
            window.dispatchEvent(
                Object.assign(new Event("beforeinstallprompt"), mockPromptEvent)
            );
        });

        // Ensure the Install button appears
        const installButton = await screen.findByRole("button", { name: /install/i });

        // Click the install button
        fireEvent.click(installButton);

        // Check if the mock prompt function was called
        expect(mockPromptEvent.prompt).toHaveBeenCalled();
    });

    it("hides popup when app is installed", () => {
        render(<InstallPrompt />);

        act(() => {
            window.dispatchEvent(new Event("appinstalled"));
        });

        expect(screen.queryByText(/install this app/i)).not.toBeInTheDocument();
    });
});
