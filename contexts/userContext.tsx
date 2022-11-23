import { createContext, useState } from "react";
import { UserAccount } from "../types/types";

interface UserContextProps {
  user: UserAccount | null;
  setUser: (u: UserAccount) => void;
}

const initialValues = {
  user: { id: "", username: "", email: "" },
  setUser: () => {},
};

export const UserContext = createContext<UserContextProps>(initialValues);

type UserProviderProps = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserAccount | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
