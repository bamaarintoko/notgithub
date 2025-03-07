import SearchButton from "@/components/SearchButton";
import { render, screen, fireEvent } from "@testing-library/react";

describe("SearchButton Component", () => {
    test("renders SearchButton with text 'Search'", () => {
        render(<SearchButton disabled={false} onClick={() => {}} isLoading={false} />);
        expect(screen.getByText("Search")).toBeInTheDocument();
    });

    test("disables button when disabled prop is true", () => {
        render(<SearchButton disabled={true} onClick={() => {}} isLoading={false} />);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    test("calls onClick function when clicked", () => {
        const handleClick = jest.fn();
        render(<SearchButton disabled={false} onClick={handleClick} isLoading={false} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("shows loading spinner when isLoading is true", () => {
        render(<SearchButton disabled={false} onClick={() => {}} isLoading={true} />);
        expect(screen.queryByTestId("loading-spinner")).toBeInTheDocument();
    });

    test("does not show loading spinner when isLoading is false", () => {
        render(<SearchButton disabled={false} onClick={() => {}} isLoading={false} />);
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
});