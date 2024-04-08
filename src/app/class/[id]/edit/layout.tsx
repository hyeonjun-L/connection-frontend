import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connection | 클래스 수정',
  description: 'Connection 클래스 수정',
};

export default async function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
