"use client"

import React, { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "./firebaseConfig"

type Props = {
  children: React.ReactNode;
}

const AuthContext = createContext<User | undefined | null>(undefined);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const removeListener = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return removeListener;
  }, []);
  
  return (
    <AuthContext value={ user }> 
      { !loading && children }
    </AuthContext>
  );
}