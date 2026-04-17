import './globals.css';

export const metadata = {
  title: 'Macro Intel',
  description: 'Personal macro intelligence briefing tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
