"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

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
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, userProfile, loading, signOut, isAuthenticated, updateProfile } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [nutrientStatus, setNutrientStatus] = useState<NutrientStatus[]>([]);

  // Supabase 프로필을 UserInfo 형태로 변환
  useEffect(() => {
    if (userProfile) {
      setUserInfo({
        name: userProfile.name,
        gender: userProfile.gender || "",
        age: userProfile.age?.toString() || "",
        height: userProfile.height?.toString() || "",
        weight: userProfile.weight?.toString() || "",
        activityLevel: userProfile.activity_level || "",
        mealPattern: "", // 기존 필드 유지
        healthCheckup: userProfile.health_checkup || "",
        recentMeals: [], // 추후 meal_records에서 가져올 예정
      });
    } else {
      setUserInfo(null);
    }
  }, [userProfile]);

  // UserInfo가 변경될 때 Supabase에 저장
  const handleSetUserInfo = async (info: UserInfo) => {
    setUserInfo(info);
    
    if (user && userProfile && updateProfile) {
      await updateProfile({
        name: info.name,
        gender: info.gender || null,
        age: parseInt(info.age) || null,
        height: parseInt(info.height) || null,
        weight: parseInt(info.weight) || null,
        activity_level: info.activityLevel || null,
        health_checkup: info.healthCheckup || null,
      });
    }
  };

  return (
    <UserContext.Provider value={{
      userInfo,
      nutrientStatus,
      setUserInfo: handleSetUserInfo,
      setNutrientStatus,
      isAuthenticated,
      loading,
      signOut,
    }}>
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