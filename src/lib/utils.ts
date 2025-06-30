export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidAge(age: number): boolean {
  return age >= 1 && age <= 120;
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        // Remove data URL prefix (data:image/jpeg;base64,)
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}

/**
 * 카카오 애드핏 광고 DOM 복구 함수 (상단/하단)
 */
export function restoreAdfit() {
  // 상단 광고
  if (!document.querySelector('.kakao_ad_area[data-ad-unit="DAN-Xz4xE25ZdJKQpK76"]')) {
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('style', 'display:block;width:100%;min-height:50px');
    ins.setAttribute('data-ad-unit', 'DAN-Xz4xE25ZdJKQpK76');
    ins.setAttribute('data-ad-width', '320');
    ins.setAttribute('data-ad-height', '50');
    ins.setAttribute('data-ad-onfail', 'adfitTopOnFail');
    document.body.prepend(ins);
    (window as any).kakao && (window as any).kakao.adfit && (window as any).kakao.adfit.load();
  }
  // 하단 광고
  if (!document.querySelector('.kakao_ad_area[data-ad-unit="DAN-lYOfiVolJOlJuE3a"]')) {
    const ins2 = document.createElement('ins');
    ins2.className = 'kakao_ad_area';
    ins2.setAttribute('style', 'display:block;width:100%;min-height:50px');
    ins2.setAttribute('data-ad-unit', 'DAN-lYOfiVolJOlJuE3a');
    ins2.setAttribute('data-ad-width', '320');
    ins2.setAttribute('data-ad-height', '50');
    ins2.setAttribute('data-ad-onfail', 'adfitBottomOnFail');
    document.body.appendChild(ins2);
    (window as any).kakao && (window as any).kakao.adfit && (window as any).kakao.adfit.load();
  }
}

/**
 * 광고 DOM 존재 여부 확인
 */
export function isAdfitPresent() {
  return !!document.querySelector('.kakao_ad_area[data-ad-unit="DAN-Xz4xE25ZdJKQpK76"]') &&
         !!document.querySelector('.kakao_ad_area[data-ad-unit="DAN-lYOfiVolJOlJuE3a"]');
}