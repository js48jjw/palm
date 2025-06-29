'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Sparkles, RotateCcw, User, Calendar, Loader2 } from 'lucide-react';
import { GenderSelector } from "../components/GenderSelector";
import { AgeInput } from "../components/AgeInput";
import { PhotoCapture } from "../components/PhotoCapture";
import { FortuneResult } from "../components/FortuneResult";
import ProgressSteps from "../components/ProgressSteps";
import { Loading } from "../components/ui/Loading";
import { analyzePalm } from "../lib/gemini";

interface AnalysisResult {
  content: string;
}

export default function Home() {
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'loading' | 'result'>('input');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setTimeout(() => setIsUploading(false), 1000); // 업로드 효과
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedImage || !gender || !age) return;

    setIsAnalyzing(true);
    setCurrentStep('loading');

    try {
      // Base64로 이미지 변환
      const base64Image = await convertToBase64(selectedImage);
      
      const response = await fetch('/api/analyze-palm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          gender,
          age: parseInt(age),
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setAnalysisResult(result);
        setCurrentStep('result');
      } else {
        throw new Error(result.error || '분석 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      setCurrentStep('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Remove data:image/...;base64, prefix
      };
      reader.onerror = reject;
    });
  };

  const resetApp = () => {
    setGender('');
    setAge('');
    setSelectedImage(null);
    setImagePreview('');
    setAnalysisResult(null);
    setCurrentStep('input');
    setIsUploading(false);
    setIsAnalyzing(false);
  };

  const isFormValid = gender && age && selectedImage && !isUploading;

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-900 dark:via-pink-900 dark:to-yellow-900 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-12 h-12 text-white animate-spin" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-purple-300 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              손금을 분석하고 있어요
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              잠시만 기다려주세요...
            </p>
            <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mx-auto">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'result' && analysisResult) {
    return (
      <div className="min-h-screen h-screen flex flex-col justify-between items-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-900 dark:via-pink-900 dark:to-yellow-900 p-0">
        <div className="max-w-3xl w-full flex-1 flex flex-col justify-center px-2 sm:px-4 md:px-6 mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl lg:whitespace-nowrap font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              오늘의 손금 분석
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">분석 완료!</span>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  🔮 운세 결과
                </h2>
              </div>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {analysisResult.content}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 mb-4">
            <button
              onClick={resetApp}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              다시 하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex flex-col justify-between items-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-900 dark:via-pink-900 dark:to-yellow-900 p-0">
      <div className="w-full max-w-lg flex flex-col justify-center h-full px-2 sm:px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-4 pt-6 md:mb-8 md:pt-8">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl lg:whitespace-nowrap font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            오늘의 손금 분석
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-base">
            손바닥 사진으로 운세를 확인해보세요 ✨
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-2 md:p-4 shadow-lg border border-gray-200 dark:border-gray-700 space-y-3 md:space-y-5 flex-1 flex flex-col justify-center overflow-y-auto max-h-[90vh] md:max-h-[700px]">
          {/* Gender Selection */}
          <div className="space-y-3 md:space-y-4">
            <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
              <User className="w-5 h-5 md:w-6 md:h-6" />
              성별 선택
            </label>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 md:py-4 px-4 md:px-5 rounded-xl font-medium transition-all duration-200 ${
                  gender === 'male'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                남성
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 md:py-4 px-4 md:px-5 rounded-xl font-medium transition-all duration-200 ${
                  gender === 'female'
                    ? 'bg-pink-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                여성
              </button>
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-3 md:space-y-4">
            <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5 md:w-6 md:h-6" />
              나이 입력
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="나이를 입력하세요"
              min="1"
              max="120"
              className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-base md:text-lg"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3 md:space-y-4">
            <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
              <Camera className="w-5 h-5 md:w-6 md:h-6" />
              손바닥 사진 업로드
            </label>
            {imagePreview ? (
              <div className="relative flex justify-center">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 h-48 md:h-64 flex items-center justify-center">
                  <Image
                    src={imagePreview}
                    alt="선택된 손바닥 사진"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>업로드 중...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-5 md:p-8 text-center">
                  <Camera className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-3 md:mb-4">
                    손바닥 사진을 업로드해주세요
                  </p>
                  <div className="flex gap-3 md:gap-4 justify-center">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 md:px-5 py-3 md:py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 min-w-[110px] whitespace-nowrap text-base md:text-lg"
                    >
                      <Camera className="w-5 h-5 md:w-6 md:h-6" />
                      카메라
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 md:px-5 py-3 md:py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 min-w-[110px] whitespace-nowrap text-base md:text-lg"
                    >
                      <Upload className="w-5 h-5 md:w-6 md:h-6" />
                      파일 선택
                    </button>
                  </div>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Analysis Button */}
          <button
            onClick={handleAnalysis}
            disabled={!isFormValid || isAnalyzing}
            className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold text-white transition-all duration-200 text-lg md:text-xl ${
              isFormValid && !isAnalyzing
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                분석 중...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                손금 분석하기
              </div>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 md:mt-8 text-xs md:text-sm text-gray-500 dark:text-gray-400">
          <p>✨ AI가 분석하는 재미있는 손금 운세 ✨</p>
        </div>
      </div>
    </div>
  );
}