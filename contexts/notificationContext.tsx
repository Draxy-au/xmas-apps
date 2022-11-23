import { createContext, useState } from "react";
import { Notification } from "../types/types";

interface INotificationContextProps {
  notification: Notification | null;
  display: boolean;
  showNotification: (
    status: string,
    title: string,
    text: string,
    timeout: number
  ) => void;
}

const initialValues = {
  notification: { title: "", status: "", text: "" },
  display: false,
  showNotification: () => {},
};

export const NotificationContext =
  createContext<INotificationContextProps>(initialValues);

type NotificationProviderProps = {
  children: React.ReactNode;
};

export function NotificationContextProvider({
  children,
}: NotificationProviderProps) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [display, setDisplay] = useState(false);

  function showNotification(
    status: string,
    title: string,
    text: string,
    timeout: number = 3000
  ) {
    if (display) {
      return;
    }
    setNotification({
      status: status,
      title: title,
      text: text,
    });
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, timeout);
  }

  return (
    <NotificationContext.Provider
      value={{ notification, display, showNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
