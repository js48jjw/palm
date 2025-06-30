import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { cn, isValidImageFile, createImagePreview, fileToBase64 } from '@/lib/utils';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';

interface PhotoCaptureProps {
  onImageSelect: (file: File) => void;
  uploading: boolean;
  imagePreview: string | null;
  className?: string;
}

// 이미지 리사이즈 및 압축 함수 추가
function resizeImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = width * scale;
        height = height * scale;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('이미지 변환 실패'));
        },
        'image/jpeg',
        quality
      );
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 반복적으로 리사이즈/압축하여 3.9MB 이하로 만드는 함수
async function resizeImageToMaxSize(file: File, maxSize = 3.9 * 1024 * 1024) {
  let quality = 0.8;
  let maxWidth = 1600;
  let maxHeight = 1600;
  let blob = await resizeImage(file, maxWidth, maxHeight, quality);
  let tryCount = 0;
  while (blob.size > maxSize && tryCount < 5) {
    quality -= 0.2;
    if (quality < 0.3) {
      quality = 0.3;
      maxWidth = Math.floor(maxWidth * 0.8);
      maxHeight = Math.floor(maxHeight * 0.8);
    }
    blob = await resizeImage(file, maxWidth, maxHeight, quality);
    tryCount++;
  }
  return blob;
}

// base64 인코딩 후 크기가 4MB 이하가 될 때까지 반복적으로 리사이즈/압축
async function resizeImageToBase64Max(file: File, maxBase64Size = 4 * 1024 * 1024) {
  let quality = 0.8;
  let maxWidth = 1600;
  let maxHeight = 1600;
  let blob = await resizeImage(file, maxWidth, maxHeight, quality);
  let tryCount = 0;
  let base64 = await fileToBase64(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
  // base64의 실제 바이트 크기 계산: base64.length * 3 / 4
  while ((base64.length * 3 / 4) > maxBase64Size && tryCount < 20) {
    quality -= 0.1;
    if (quality < 0.1) quality = 0.1;
    if (maxWidth > 200 && maxHeight > 200) {
      maxWidth = Math.max(200, Math.floor(maxWidth * 0.8));
      maxHeight = Math.max(200, Math.floor(maxHeight * 0.8));
    }
    blob = await resizeImage(file, maxWidth, maxHeight, quality);
    base64 = await fileToBase64(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
    tryCount++;
  }
  return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onImageSelect,
  uploading,
  imagePreview,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // 후면 카메라 우선
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('카메라에 접근할 수 없습니다. 파일 업로드를 이용해주세요.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) {
        let file = new File([blob], 'palm-photo.jpg', { type: 'image/jpeg' });
        // 3.9MB 초과 시 반복적으로 리사이즈 및 압축
        if (file.size > 3.9 * 1024 * 1024) {
          const resizedBlob = await resizeImageToMaxSize(file, 3.9 * 1024 * 1024);
          file = new File([resizedBlob], 'palm-photo.jpg', { type: 'image/jpeg' });
        }
        // base64 인코딩 후 크기 체크 및 반복 리사이즈
        let base64 = await fileToBase64(file);
        if ((base64.length * 3 / 4) > 4 * 1024 * 1024) {
          file = await resizeImageToBase64Max(file, 4 * 1024 * 1024);
          base64 = await fileToBase64(file);
          if ((base64.length * 3 / 4) > 4 * 1024 * 1024) {
            setError('이미지 인코딩 후 크기가 4MB를 초과합니다. 더 작은 이미지를 업로드해 주세요.');
            return;
          }
        }
        onImageSelect(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (!isValidImageFile(file)) {
      setError('JPG, PNG, WebP 파일만 업로드 가능합니다 (최대 10MB)');
      return;
    }

    // 3.9MB 초과 시 반복적으로 리사이즈 및 압축
    let processedFile = file;
    if (file.size > 3.9 * 1024 * 1024) {
      try {
        const blob = await resizeImageToMaxSize(file, 3.9 * 1024 * 1024);
        processedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
        console.log('최종 파일 크기:', processedFile.size);
        if (processedFile.size > 3.9 * 1024 * 1024) {
          setError('이미지 크기를 3.9MB 이하로 줄일 수 없습니다. 더 작은 이미지를 업로드해 주세요.');
          return;
        }
      } catch (err) {
        setError('이미지 크기 축소에 실패했습니다.');
        return;
      }
    }
    // base64 인코딩 후 크기 체크 및 반복 리사이즈
    let base64 = await fileToBase64(processedFile);
    if ((base64.length * 3 / 4) > 4 * 1024 * 1024) {
      try {
        processedFile = await resizeImageToBase64Max(processedFile, 4 * 1024 * 1024);
        base64 = await fileToBase64(processedFile);
        if ((base64.length * 3 / 4) > 4 * 1024 * 1024) {
          setError('이미지 인코딩 후 크기가 4MB를 초과합니다. 더 작은 이미지를 업로드해 주세요.');
          return;
        }
      } catch (err) {
        setError('이미지 인코딩 후 크기 축소에 실패했습니다.');
        return;
      }
    }
    onImageSelect(processedFile);
  };

  const resetImage = () => {
    onImageSelect(null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        손금 사진을 업로드해주세요
      </label>

      {!imagePreview && !cameraActive && (
        <div className="space-y-4">
          {/* 카메라 촬영 버튼 */}
          <Button
            variant="secondary"
            size="lg"
            onClick={startCamera}
            className="w-full min-w-[110px]"
            disabled={uploading}
          >
            <Camera className="w-5 h-5 mr-2" />
            카메라로 촬영하기
          </Button>

          {/* 파일 업로드 버튼 */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[110px]"
              disabled={uploading}
            >
              <Upload className="w-5 h-5 mr-2" />
              파일에서 선택하기
            </Button>
          </div>

          {/* 안내 메시지 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">📸 촬영 팁</p>
                <ul className="text-xs space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• 손바닥을 펼쳐서 촬영해주세요</li>
                  <li>• 충분한 조명 아래에서 촬영하세요</li>
                  <li>• 손금이 선명하게 보이도록 해주세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 카메라 화면 */}
      {cameraActive && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover"
              playsInline
              muted
            />
            <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                손바닥을 화면에 맞춰주세요
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="primary"
              size="lg"
              onClick={capturePhoto}
              className="flex-1"
            >
              <Camera className="w-5 h-5 mr-2" />
              촬영하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={stopCamera}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* 업로드 중 상태 */}
      {uploading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
            <svg className="animate-spin w-5 h-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-blue-700 dark:text-blue-300 font-medium">업로드 중...</span>
          </div>
        </div>
      )}

      {/* 이미지 미리보기 */}
      {imagePreview && !uploading && (
        <div className="space-y-4">
          <div className="relative group">
            <Image
              src={imagePreview}
              alt="Palm preview"
              width={640}
              height={256}
              className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200 dark:border-gray-700"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl" />
            <Button
              variant="ghost"
              size="sm"
              onClick={resetImage}
              className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={resetImage}
              className="text-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 선택하기
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};