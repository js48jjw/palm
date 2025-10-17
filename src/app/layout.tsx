import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { restoreAdfit } from '../lib/utils';
import React from 'react';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Palm Reading",
  description: "Palm Reading - 손금 분석 AI 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode & { resultView?: boolean };
}>) {
  // children에 resultView prop이 있으면 결과화면임
  const isResultView = typeof children === 'object' && children && 'props' in children && (children as { props: any }).props.resultView;

  // 광고 DOM 복구 (CSR에서만)
  React.useEffect(() => {
    if (!isResultView) {
      restoreAdfit();
    }
  }, [isResultView]);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#a78bfa" />
        <style>{`.kakao_ad_area { display: block !important; }`}</style>
        <style>{`
          .promo-banner, .promo-banner-right {
            display: none;
            transition: transform 0.3s ease;
          }
          .promo-banner:hover, .promo-banner-right:hover {
            transform: translateY(-5px);
          }
          @media (min-width: 1100px) {
            .promo-banner, .promo-banner-right { display: block; }
          }
        `}</style>
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {/* 좌측 홍보 배너 (폭 1100px 이상에서만 노출) */}
        <a
          href="https://pmioham9d3.sens.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="promo-banner"
          style={{
            position: 'fixed',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '160px',
            zIndex: 99998,
          }}
        >
          <img
            src="/dbsense-banner.png"
            alt="디비센스 홍보 배너"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </a>
        {/* 좌측 추가 홍보 배너 (폭 1100px 이상에서만 노출) */}
        <a
          href="https://ydztsbiml3.sens.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="promo-banner"
          style={{
            position: 'fixed',
            left: 0,
            top: 'calc(50% + 180px)',
            transform: 'translateY(-50%)',
            width: '160px',
            zIndex: 99998,
          }}
        >
          <img
            src="/chimhyang.png"
            alt="침향 홍보 배너"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </a>
        {/* 우측 홍보 배너 (폭 1100px 이상에서만 노출) */}
        <a
          href="https://ig8rt9xz3i.sens.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="promo-banner-right"
          style={{
            position: 'fixed',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '160px',
            zIndex: 99998,
          }}
        >
          <img
            src="/dbsense-banner-right.png"
            alt="디비센스 홍보 배너"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </a>
        {/* 우측 추가 홍보 배너 (폭 1100px 이상에서만 노출) */}
        <a
          href="https://ui7gwmf8ww.sens.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="promo-banner-right"
          style={{
            position: 'fixed',
            right: 0,
            top: 'calc(50% + 180px)',
            transform: 'translateY(-50%)',
            width: '160px',
            zIndex: 99998,
          }}
        >
          <img
            src="/magabogam.png"
            alt="마가보감 홍보 배너"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </a>
        {/* 카카오 애드핏 광고 상단 (결과화면이 아닐 때만) */}
        {!isResultView && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '320px',
            maxWidth: '100%',
            zIndex: 99999,
          }}>
            <ins
              className="kakao_ad_area"
              style={{ display: 'block', width: '100%' }}
              data-ad-unit="DAN-Xz4xE25ZdJKQpK76"
              data-ad-width="320"
              data-ad-height="50"
              data-ad-onfail="adfitTopOnFail"
            ></ins>
          </div>
        )}
        {/* 광고 DOM 복구 스크립트 (결과화면이 아닐 때만) */}
        {!isResultView && (
          <Script id="adfit-noad-callbacks" strategy="afterInteractive">
            {`
              window.adfitTopOnFail = function(ins) {
                console.log('상단 광고 노출 실패', ins);
              };
              window.adfitBottomOnFail = function(ins) {
                console.log('하단 광고 노출 실패', ins);
              };
              setInterval(function() {
                document.querySelectorAll('.kakao_ad_area').forEach(function(el) {
                  el.style.display = 'block';
                });
              }, 1000);
              setInterval(function() {
                if (!document.querySelector('.kakao_ad_area[data-ad-unit="DAN-Xz4xE25ZdJKQpK76"]')) {
                  var topDiv = document.createElement('div');
                  topDiv.style.display = 'flex';
                  topDiv.style.justifyContent = 'center';
                  topDiv.style.position = 'fixed';
                  topDiv.style.top = '0';
                  topDiv.style.left = '50%';
                  topDiv.style.transform = 'translateX(-50%)';
                  topDiv.style.width = '320px';
                  topDiv.style.maxWidth = '100%';
                  topDiv.style.zIndex = '99999';
                  var ins = document.createElement('ins');
                  ins.className = 'kakao_ad_area';
                  ins.style.display = 'block';
                  ins.style.width = '100%';
                  ins.setAttribute('data-ad-unit', 'DAN-Xz4xE25ZdJKQpK76');
                  ins.setAttribute('data-ad-width', '320');
                  ins.setAttribute('data-ad-height', '50');
                  ins.setAttribute('data-ad-onfail', 'adfitTopOnFail');
                  topDiv.appendChild(ins);
                  document.body.appendChild(topDiv);
                }
                if (!document.querySelector('.kakao_ad_area[data-ad-unit="DAN-lYOfiVolJOlJuE3a"]')) {
                  var bottomDiv = document.createElement('div');
                  bottomDiv.style.display = 'flex';
                  bottomDiv.style.justifyContent = 'center';
                  bottomDiv.style.position = 'fixed';
                  bottomDiv.style.left = '50%';
                  bottomDiv.style.bottom = '0';
                  bottomDiv.style.transform = 'translateX(-50%)';
                  bottomDiv.style.width = '320px';
                  bottomDiv.style.maxWidth = '100%';
                  bottomDiv.style.zIndex = '99999';
                  var ins2 = document.createElement('ins');
                  ins2.className = 'kakao_ad_area';
                  ins2.style.display = 'block';
                  ins2.style.width = '100%';
                  ins2.setAttribute('data-ad-unit', 'DAN-lYOfiVolJOlJuE3a');
                  ins2.setAttribute('data-ad-width', '320');
                  ins2.setAttribute('data-ad-height', '50');
                  ins2.setAttribute('data-ad-onfail', 'adfitBottomOnFail');
                  bottomDiv.appendChild(ins2);
                  document.body.appendChild(bottomDiv);
                }
              }, 2000);
            `}
          </Script>
        )}
        {/* 광고 스크립트는 항상 필요 */}
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
        />
        {children}
        {/* 카카오 애드핏 하단 배너 (결과화면이 아닐 때만) */}
        {!isResultView && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'fixed',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: '320px',
            maxWidth: '100%',
            zIndex: 99999,
          }}>
            <ins
              className="kakao_ad_area"
              style={{ display: 'block', width: '100%' }}
              data-ad-unit="DAN-lYOfiVolJOlJuE3a"
              data-ad-width="320"
              data-ad-height="50"
              data-ad-onfail="adfitBottomOnFail"
            ></ins>
          </div>
        )}
      </body>
    </html>
  );
}
