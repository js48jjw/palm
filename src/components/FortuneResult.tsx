import React from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { RotateCcw, Share2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FortuneResultProps {
  fortune: string;
  userInfo: {
    gender: 'male' | 'female';
    age: number;
  };
  onReset: () => void;
  className?: string;
}

export const FortuneResult: React.FC<FortuneResultProps> = ({
  fortune,
  userInfo,
  onReset,
  className
}) => {
  const formatFortune = (text: string) => {
    return text.split('\n').map((line, index) => {
      // 이모지가 포함된 제목 라인 체크
      if (line.includes('🌟') || line.includes('💖') || line.includes('💰') || 
          line.includes('🏢') || line.includes('🏥') || line.includes('🍀')) {
        return (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              {line}
            </h3>
          </div>
        );
      }
      
      // 구분선 처리
      if (line.includes('---')) {
        return <hr key={index} className="my-6 border-gray-200 dark:border-gray-700" />;
      }
      
      // 빈 줄 건너뛰기
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // 일반 텍스트
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '오늘의 손금 분석 결과',
          text: `${userInfo.gender === 'male' ? '남성' : '여성'} ${userInfo.age}세의 오늘의 운세입니다!\n\n${fortune}`,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // 클립보드에 복사
      try {
        await navigator.clipboard.writeText(fortune);
        alert('결과가 클립보드에 복사되었습니다!');
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  const handleDownload = () => {
    const text = `오늘의 손금 분석 결과\n\n${userInfo.gender === 'male' ? '남성' : '여성'} ${userInfo.age}세\n\n${fortune}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `손금분석_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3" />
          <span className="text-purple-700 dark:text-purple-300 font-medium">
            분석 완료
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔮 분석 결과
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          {userInfo.gender === 'male' ? '남성' : '여성'} {userInfo.age}세님의 오늘의 운세입니다
        </p>
      </div>

      {/* 결과 카드 */}
      <Card variant="gradient" className="mb-8">
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {formatFortune(fortune)}
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={onReset}
          className="flex-1 sm:flex-none"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          다시 분석하기
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleShare}
          className="flex-1 sm:flex-none"
        >
          <Share2 className="w-5 h-5 mr-2" />
          공유하기
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          onClick={handleDownload}
          className="flex-1 sm:flex-none"
        >
          <Download className="w-5 h-5 mr-2" />
          저장하기
        </Button>
      </div>

      {/* 하단 메시지 */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-full">
          <span className="text-yellow-600 dark:text-yellow-400 text-sm">
            ✨ 오늘 하루 좋은 일이 가득하시길 바랍니다!
          </span>
        </div>
      </div>
    </div>
  );
};