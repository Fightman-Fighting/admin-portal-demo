import React from 'react';
import { PlatformProvider, usePlatform } from '@/contexts/PlatformContext';
import AuthScreen from '@/components/auth/AuthScreen';
import Portal from '@/components/Portal';

const Gate: React.FC = () => {
  const { currentUser } = usePlatform();
  return currentUser ? <Portal /> : <AuthScreen />;
};

const AppLayout: React.FC = () => {
  return (
    <PlatformProvider>
      <Gate />
    </PlatformProvider>
  );
};

export default AppLayout;
