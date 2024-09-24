import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAppContext } from "./AppContext"; // Zakładam, że kontekst jest zdefiniowany w AppContext.tsx
import LoginPage from "./LoginPage";
import UserPanel from "./UserPanel";
import ItemsSearch from "./ItemsSearch";

jest.mock("./AppContext");

const mockSetCurrentUser = jest.fn();
const mockSetOpenScanner = jest.fn();
const mockSetOpenItemsSearch = jest.fn();
const mockSetOpenInventoryResults = jest.fn();

describe("Integration test for LoginPage, UserPanel, and ItemsSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppContext as jest.Mock).mockReturnValue({
      currentUser: null,
      setCurrentUser: mockSetCurrentUser,
    });
  });

  it("should log in and navigate to user panel, then search for an item", async () => {
    const loginResponse = { login: "admin", role: "admin" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(loginResponse),
    });

    const { getByText, getByPlaceholderText, queryByText } = render(
      <LoginPage />
    );

    // Simulate login
    fireEvent.changeText(getByPlaceholderText("Username"), "admin");
    fireEvent.changeText(getByPlaceholderText("Password"), "password");
    fireEvent.press(getByText("Login"));

    await waitFor(() =>
      expect(mockSetCurrentUser).toHaveBeenCalledWith(loginResponse)
    );

    // Mock useAppContext for logged-in user
    (useAppContext as jest.Mock).mockReturnValue({
      currentUser: loginResponse,
      isInventoryInProgress: "no",
      setIsInventoryInProgress: jest.fn(),
      setNotificationMessage: jest.fn(),
      setCurrentUser: mockSetCurrentUser,
    });

    // Render UserPanel after login
    const { getByText: getByTextInUserPanel } = render(
      <UserPanel
        setOpenScanner={mockSetOpenScanner}
        setOpenItemsSearch={mockSetOpenItemsSearch}
        setOpenInventoryResults={mockSetOpenInventoryResults}
      />
    );

    expect(getByTextInUserPanel("Admin Panel")).toBeTruthy();

    fireEvent.press(getByTextInUserPanel("Search for item"));

    await waitFor(() =>
      expect(mockSetOpenItemsSearch).toHaveBeenCalledWith(true)
    );

    // Mock useAppContext and render ItemsSearch component
    const itemsSearchMockResponse = [{ id: 1, name: "item1", quantity: 10 }];
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(itemsSearchMockResponse),
    });

    const {
      getByPlaceholderText: getSearchPlaceholder,
      getByText: getTextInItemsSearch,
    } = render(<ItemsSearch setOpenItemsSearch={mockSetOpenItemsSearch} />);

    fireEvent.changeText(getSearchPlaceholder("Search"), "item1");

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("item1")
      )
    );

    expect(getTextInItemsSearch("Total items found: 10")).toBeTruthy();
  });

  it("should handle no items found scenario", async () => {
    (useAppContext as jest.Mock).mockReturnValue({
      currentUser: { login: "admin", role: "admin" },
      setCurrentUser: mockSetCurrentUser,
    });

    const noItemsFoundResponse = [];
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(noItemsFoundResponse),
    });

    const { getByPlaceholderText, getByText } = render(
      <ItemsSearch setOpenItemsSearch={mockSetOpenItemsSearch} />
    );

    fireEvent.changeText(getByPlaceholderText("Search"), "nonexistentItem");

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("nonexistentItem")
      )
    );

    expect(getByText("No items found with the given name")).toBeTruthy();
  });
});
