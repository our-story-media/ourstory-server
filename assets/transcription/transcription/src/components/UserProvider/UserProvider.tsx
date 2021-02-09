import { createContext, } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { name_key } from "../../utils/localStorageKeys";
import { StateSetter } from "../../utils/types";

type UserContextType = {
  userName: string | undefined,
  setName: StateSetter<string | undefined>,
  clearName: () => void
}

const initialValue: UserContextType = {
  userName: undefined,
  setName: () => null,
  clearName: () => null,
}

export const UserContext = createContext<UserContextType>(initialValue);

const UserProvider: React.FC<{}> = ({ children }) => {
  const [name, setName, clearName] = useLocalStorage(name_key);

  const value = {
    userName: name,
    setName: setName,
    clearName: clearName,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
