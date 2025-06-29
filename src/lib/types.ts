export interface UserInfo {
  gender: 'male' | 'female' | '';
  age: number | '';
}

export interface PalmAnalysisResult {
  fortune: string;
  success: boolean;
  error?: string;
}

export interface AppState {
  step: 'input' | 'loading' | 'result';
  userInfo: UserInfo;
  palmImage: File | null;
  imagePreview: string | null;
  analysisResult: PalmAnalysisResult | null;
  uploading: boolean;
}

export interface CameraState {
  isOpen: boolean;
  stream: MediaStream | null;
  error: string | null;
}