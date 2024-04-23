import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import Router from './router';
import { AuthProvider } from './context';
import { useEffect } from 'react';
import { setMomentLocale } from './utils';

function App() {

  const toastStyles = {
    padding: 12,
    color: '#3F3F46',
  }

  useEffect(() => {
    setMomentLocale();
  }, []);

  return (
    <NextUIProvider>
      <AuthProvider>
        <Router />
        <Toaster position="bottom-center" toastOptions={{ style: toastStyles }} />
      </AuthProvider>
    </NextUIProvider>
  );
}

export default App;
