"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Login from '@/components/Login';
import UploadFestivalButton from '@/components/UploadFestivalButton';

const AuthenticatedAction: React.FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return <Login />;
  }

  return <UploadFestivalButton />;
};

export default AuthenticatedAction;