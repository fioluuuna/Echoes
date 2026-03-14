import { create } from 'zustand';
import type { User } from '../types';

// 默认用户（移除登录后使用）
const DEFAULT_USER: User = {
  id: 1,
  username: 'default',
  email: 'default@example.com',
  nickname: '观测者',
  avatar: null,
  createdAt: new Date().toISOString(),
};

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: DEFAULT_USER,
  isAuthenticated: true,
  logout: () => {
    // 不做任何操作，保持登录状态
  },
  setAuth: (user: User, token: string) => {
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true });
  },
}));
