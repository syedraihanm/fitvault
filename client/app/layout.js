import { AuthProvider } from '@/lib/auth';
import './globals.css';

export const metadata = {
  title: 'FitVault',
  description: 'Premium Gym & Fitness Tracking Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
