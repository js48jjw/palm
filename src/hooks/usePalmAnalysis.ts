import { useState, useEffect } from "react";
import { PalmAnalysisResult } from "../lib/types";

function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

export function usePalmAnalysis() {
  const [gender, setGenderState] = useState<'male' | 'female' | ''>(() => getLocalStorage('gender', ''));
  const [age, setAgeState] = useState<number | ''>(() => getLocalStorage('age', ''));
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // gender, age 변경 시 localStorage에 저장
  useEffect(() => {
    if (gender) window.localStorage.setItem('gender', JSON.stringify(gender));
  }, [gender]);
  useEffect(() => {
    if (age !== '') window.localStorage.setItem('age', JSON.stringify(age));
  }, [age]);

  // setter 래핑
  const setGender = (g: 'male' | 'female' | '') => setGenderState(g);
  const setAge = (a: number | '') => setAgeState(a);

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setLoading(false);
    setError(null);
    // localStorage.removeItem('gender');
    // localStorage.removeItem('age');
  };

  return {
    gender,
    setGender,
    age,
    setAge,
    photo,
    setPhoto,
    result,
    setResult,
    loading,
    setLoading,
    error,
    setError,
    reset,
  };
} 