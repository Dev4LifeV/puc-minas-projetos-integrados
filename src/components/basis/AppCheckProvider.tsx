import { PropsWithChildren, createContext, useContext, useState } from "react";

import { AppCheck } from "firebase/app-check";

type AppCheckContextType = {
  appCheck?: AppCheck;
  setAppCheck: (appCheck: AppCheck | undefined) => void;
};

const AppCheckContext = createContext<AppCheckContextType>({
  setAppCheck: () => {},
});

const useAppCheck = () => {
  const { appCheck, setAppCheck } = useContext(AppCheckContext);

  return { appCheck, setAppCheck };
};

const AppCheckProvider = ({ children }: PropsWithChildren) => {
  const [appCheck, setAppCheck] = useState<AppCheck | undefined>();

  return (
    <AppCheckContext.Provider value={{ appCheck, setAppCheck }}>
      {children}
    </AppCheckContext.Provider>
  );
};

export { AppCheckProvider, useAppCheck };
