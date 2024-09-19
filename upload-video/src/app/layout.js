import './globals.css';

export const metadata = {
  title: 'Wetube',
  description: 'Upload and watch videos easily!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
