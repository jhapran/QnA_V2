export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'educator' | 'student';
  organizationId: string;
  subscription?: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    validUntil: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  maxUsers: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
}