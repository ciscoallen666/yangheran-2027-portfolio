import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '杨赫然｜文化内容与 AIGC 视觉设计作品集',
  description: '杨赫然 2027 届秋招作品集，方向为文旅文创、AIGC 视觉与交互体验。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
