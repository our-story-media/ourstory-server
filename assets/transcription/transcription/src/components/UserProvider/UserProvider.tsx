import { createContext, } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { name_key } from "../../utils/localStorageKeys";

type UserContextType = {
  userName: string | null,
  setName: (state: string) => void,
  clearName: () => void
}

const initialValue: UserContextType = {
  userName: null,
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
