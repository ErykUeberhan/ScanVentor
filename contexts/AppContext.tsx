import { databaseServerIp } from "@/global-consts";
import { createContext, useContext, useEffect, useState } from "react";

export type CurrentUser = {
  id: number;
  login: string;
  password: string;
  role: string;
};

type AppContext = {
  isInventoryInProgress: boolean;
  setIsInventoryInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
};

const AppContext = createContext({} as AppContext);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const testUser = {
    id: 2,
    login: "storekeeper1",
    password: "",
    role: "worker",
  };
  const [isInventoryInProgress, setIsInventoryInProgress] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(testUser);

  useEffect(() => {
    fetch(`http://${databaseServerIp}:3000/api/inventory-in-progress`)
      .then((response) => response.text())
      .then((text) => {
        setIsInventoryInProgress(text === "true");
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isInventoryInProgress,
        currentUser,
        setIsInventoryInProgress,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
