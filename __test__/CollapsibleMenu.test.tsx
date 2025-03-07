import CollapsibleMenu from "@/components/CollapsibleMenu";
import { render, screen, fireEvent } from "@testing-library/react";

describe("CollapsibleMenu Component", () => {
    const mockOnClick = jest.fn();

    it("renders the title correctly", () => {
        render(
            <CollapsibleMenu id="menu1" title="Test Menu" isOpen={false} onClick={mockOnClick}>
                <p>Test Content</p>
            </CollapsibleMenu>
        );

        expect(screen.getByText("Test Menu")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
        render(
            <CollapsibleMenu id="menu1" title="Test Menu" isOpen={false} onClick={mockOnClick}>
                <p>Test Content</p>
            </CollapsibleMenu>
        );

        const header = screen.getByText("Test Menu");
        fireEvent.click(header);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith("menu1");
    });

    it("shows children when isOpen is true", () => {
        render(
            <CollapsibleMenu id="menu1" title="Test Menu" isOpen={true} onClick={mockOnClick}>
                <p>Visible Content</p>
            </CollapsibleMenu>
        );

        expect(screen.getByText("Visible Content")).toBeInTheDocument();
    });

    it("hides children when isOpen is false", () => {
        render(
            <CollapsibleMenu id="menu1" title="Test Menu" isOpen={false} onClick={mockOnClick}>
                <p>Hidden Content</p>
            </CollapsibleMenu>
        );
        const contentWrapper = screen.getByText("Hidden Content").parentElement!;

        expect(contentWrapper.classList.contains("max-h-0")).toBe(true);
    });
});
