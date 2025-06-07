import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat with Product Showcase Assistant',
  description: 'Get help and information about our product showcase platform through our AI assistant',
  keywords: ['chat', 'AI assistant', 'product showcase', 'help', 'support'],
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 