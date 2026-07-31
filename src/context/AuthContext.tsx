import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { toast } from 'sonner';
import { INITIAL_USERS } from '../mock/data';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  loginStep1: (email: string, pass: string, method?: 'authenticator' | 'email') => Promise<boolean>;
  verify2FACode: (code: string) => Promise<boolean>;
  resend2FACode: () => void;
  resetToCredentials: () => void;
  quickDemoLogin: (userIndex?: number) => void;
  logout: () => void;
  generatedCode: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('pharmacy_crm_user');
    return savedUser ? JSON.parse(savedUser) : INITIAL_USERS[0]; // Default logged in for smooth viewing, or initial state
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('pharmacy_crm_auth');
    return saved === 'true';
  });

  const [step, setStep] = useState<'credentials' | '2fa' | 'authenticated'>(() => {
    const saved = localStorage.getItem('pharmacy_crm_auth');
    return saved === 'true' ? 'authenticated' : 'credentials';
  });

  const [pendingEmail, setPendingEmail] = useState<string>('sarah.jenkins@pharmacycrm.com');
  const [pendingMethod, setPendingMethod] = useState<'authenticator' | 'email'>('authenticator');
  const [generatedCode, setGeneratedCode] = useState<string>('123456');
  const [twoFactorCodeSent, setTwoFactorCodeSent] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('pharmacy_crm_auth', 'true');
      localStorage.setItem('pharmacy_crm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pharmacy_crm_auth');
      localStorage.removeItem('pharmacy_crm_user');
    }
  }, [isAuthenticated, user]);

  const loginStep1 = async (email: string, pass: string, method: 'authenticator' | 'email' = 'authenticator'): Promise<boolean> => {
    // Find matching user or fallback to Sarah Jenkins
    const foundUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || INITIAL_USERS[0];
    
    setPendingEmail(email);
    setPendingMethod(method);
    setUser(foundUser);
    
    // Generate 6-digit mock code
    const mockCode = '123456';
    setGeneratedCode(mockCode);
    setTwoFactorCodeSent(true);
    setStep('2fa');
    
    return true;
  };

  const verify2FACode = async (code: string): Promise<boolean> => {
    // Accept exact match or standard demo code '123456' or '654321'
    if (code === generatedCode || code === '123456' || code === '654321') {
      setIsAuthenticated(true);
      setStep('authenticated');
      toast.success(`Welcome back, ${user?.name || 'User'}!`);
      return true;
    }
    toast.error('Invalid 2FA verification code');
    return false;
  };

  const resend2FACode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setTwoFactorCodeSent(true);
    toast.info('New 2FA code sent');
  };

  const resetToCredentials = () => {
    setStep('credentials');
    setIsAuthenticated(false);
  };

  const quickDemoLogin = (userIndex: number = 0) => {
    const selected = INITIAL_USERS[userIndex] || INITIAL_USERS[0];
    setUser(selected);
    setIsAuthenticated(true);
    setStep('authenticated');
    toast.success(`Logged in as ${selected.name}`);
  };

  const logout = () => {
    const name = user?.name;
    setIsAuthenticated(false);
    setUser(null);
    setStep('credentials');
    localStorage.removeItem('pharmacy_crm_auth');
    localStorage.removeItem('pharmacy_crm_user');
    toast.info(name ? `Logged out (${name})` : 'Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        step,
        pendingEmail,
        pendingMethod,
        twoFactorCodeSent,
        generatedCode,
        loginStep1,
        verify2FACode,
        resend2FACode,
        resetToCredentials,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
