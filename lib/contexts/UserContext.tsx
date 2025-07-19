"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserInfo {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
  mealPattern: string;
  healthCheckup: string;
  bloodPressure?: string;
  bloodSugar?: string;
  cholesterol?: string;
  recentMeals?: string[];
}

export interface NutrientStatus {
  nutrientId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  status: "deficient" | "low" | "normal" | "high" | "excess";
}

interface UserContextType {
  userInfo: UserInfo | null;
  nutrientStatus: NutrientStatus[];
  setUserInfo: (info: UserInfo) => void;
  setNutrientStatus: (status: NutrientStatus[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [nutrientStatus, setNutrientStatus] = useState<NutrientStatus[]>([]);

  return (
    <UserContext.Provider value={{ userInfo, nutrientStatus, setUserInfo, setNutrientStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}