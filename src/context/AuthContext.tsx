import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  token: string;
  username: string;
  name: string;
  // Add any other properties you need from the user
}

interface AuthContextProps {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a logged-in user on component mount
    const loggedUserJSON = window.localStorage.getItem("loggedFinanceappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []); // Run once on component mount

  const signIn = (userData: User) => {
    setUser(userData);
    window.localStorage.setItem(
      "loggedFinanceappUser",
      JSON.stringify(userData)
    );
  };

  const signOut = () => {
    window.localStorage.removeItem("loggedFinanceappUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
