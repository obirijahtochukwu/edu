import { createContext, ReactNode, useContext, useState } from "react";

interface Props {
  email: string;
  password: string;
}

interface AuthContextType {
  loginDetails: Props | null;
  login: (userData: Props | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const userData: Props = JSON.parse(localStorage.getItem("userData") || "{}");

  const [loginDetails, setLoginDetails] = useState<Props | null>(userData ? userData : null);

  const login = (userData: Props | null) => {
    setLoginDetails(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = () => {
    setLoginDetails(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  const authContextValue: AuthContextType = {
    loginDetails,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};
