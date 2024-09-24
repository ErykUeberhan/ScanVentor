import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserPanel from './UserPanel';
import { useAppContext } from './AppContext'; // zakładam, że kontekst jest zdefiniowany w AppContext.tsx

jest.mock('./AppContext');

describe('UserPanel', () => {
  const setOpenScanner = jest.fn();
  const setOpenItemsSearch = jest.fn();
  const setOpenInventoryResults = jest.fn();
  const setIsInventoryInProgress = jest.fn();
  const setCurrentUser = jest.fn();
  const setNotificationMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders UserPanel with correct username and buttons for non-admin user', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      currentUser: { login: 'john_doe', role: 'user' },
      isInventoryInProgress: 'no',
      setIsInventoryInProgress,
      setCurrentUser,
      setNotificationMessage,
    });

    const { getByText } = render(
      <UserPanel
        setOpenScanner={setOpenScanner}
        setOpenItemsSearch={setOpenItemsSearch}
        setOpenInventoryResults={setOpenInventoryResults}
      />
    );

    expect(getByText('John_doe Panel')).toBeTruthy();
    expect(getByText('Move items')).toBeTruthy();
    expect(getByText('Search for item')).toBeTruthy();
    expect(getByText('Log out')).toBeTruthy();
  });

  it('renders admin-specific buttons and handles inventory actions', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      currentUser: { login: 'admin', role: 'admin' },
      isInventoryInProgress: 'no',
      setIsInventoryInProgress,
      setCurrentUser,
      setNotificationMessage,
    });

    const { getByText } = render(
      <UserPanel
        setOpenScanner={setOpenScanner}
        setOpenItemsSearch={setOpenItemsSearch}
        setOpenInventoryResults={setOpenInventoryResults}
      />
    );

    const startInventoryButton = getByText('Start inventory');
    fireEvent.press(startInventoryButton);
    expect(setIsInventoryInProgress).toHaveBeenCalledWith('yes');
    expect(setNotificationMessage).toHaveBeenCalledWith('Inventory process started!');

    const logOutButton = getByText('Log out');
    fireEvent.press(logOutButton);
    expect(setCurrentUser).toHaveBeenCalledWith(null);
  });

  it('handles cancel inventory action correctly', () => {
    (useAppContext as jest.Mock).mockReturnValue({
      currentUser: { login: 'admin', role: 'admin' },
      isInventoryInProgress: 'yes',
      setIsInventoryInProgress,
      setCurrentUser,
      setNotificationMessage,
    });

    const { getByText } = render(
      <UserPanel
        setOpenScanner={setOpenScanner}
        setOpenItemsSearch={setOpenItemsSearch}
        setOpenInventoryResults={setOpenInventoryResults}
      />
    );

    const cancelInventoryButton = getByText('Cancel inventory');
    fireEvent.press(cancelInventoryButton);
    expect(setIsInventoryInProgress).toHaveBeenCalledWith('no');
    expect(setNotificationMessage).toHaveBeenCalledWith('Inventory process canceled!');
  });
});
