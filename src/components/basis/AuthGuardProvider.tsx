import { PropsWithChildren, createContext, useContext, useState } from "react";

import { User } from "firebase/auth";

type AuthGuardProviderContext = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthGuardContext = createContext<AuthGuardProviderContext>({
  currentUser: null,
  setCurrentUser: () => {},
});

export const useAuthGuard = () => {
  const { currentUser, setCurrentUser } = useContext(AuthGuardContext);

  return {
    currentUser,
    setCurrentUser,
  };
};

export default function AuthGuardProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <AuthGuardContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthGuardContext.Provider>
  );
}
