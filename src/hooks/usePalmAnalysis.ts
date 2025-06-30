import { useState } from "react";
import { useLocalStorage } from './useLocalStorage';
import { PalmAnalysisResult } from "../lib/types";

export function usePalmAnalysis() {
  const [gender, setGenderState] = useLocalStorage<'male' | 'female' | ''>('gender', '');
  const [age, setAgeState] = useLocalStorage<number | ''>('age', '');
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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