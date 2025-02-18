import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmailContextProps {
  email: string;
  setsEmail: (email: string) => void;
}

const EmailContext = createContext<EmailContextProps | undefined>(undefined);

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};

export const EmailProvider = ({ children }: { children: ReactNode }) => {
  const [email, setsEmail] = useState<string>('');
  return (
    <EmailContext.Provider value={{ email, setsEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
