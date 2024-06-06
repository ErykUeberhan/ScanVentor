import { databaseServerIp } from "@/global-consts";
import { createContext, useContext, useEffect, useState } from "react";

export type CurrentUser = {
  id: number;
  login: string;
  password: string;
  role: string;
};

type AppContext = {
  isInventoryInProgress: "yes" | "no" | "done";
  setIsInventoryInProgress: React.Dispatch<
    React.SetStateAction<"yes" | "no" | "done">
  >;
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  notificationMessage: string;
  setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
};

const AppContext = createContext({} as AppContext);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const testUser = {
    id: 1,
    login: "admin",
    password: "",
    role: "admin",
  };
  const [isInventoryInProgress, setIsInventoryInProgress] = useState<
    "yes" | "no" | "done"
  >("no");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(testUser);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  //bug w którym admin bo udanej inwentaryzacji nie widzi przycisku "show invenotry results".
  //Do sprawdzenia czy serwer zwraca "done" jeżeli inwentaryzacja jest zakończona
  useEffect(() => {
    fetch(
      `http://${databaseServerIp}:3000/api/inventory-in-progress/${currentUser?.id}/${currentUser?.role}`
    )
      .then((response) => response.text())
      .then((text) => {
        setIsInventoryInProgress(text as "yes" | "no" | "done");
      })
      .catch((error) => console.error(error));
  }, [currentUser?.id]);

  return (
    <AppContext.Provider
      value={{
        isInventoryInProgress,
        currentUser,
        notificationMessage,
        setIsInventoryInProgress,
        setCurrentUser,
        setNotificationMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
