import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterData } from '@/types';
import { mockUsers } from '@/lib/mockData';

// モック認証API
const mockAuthAPI = {
  login: async (credentials: LoginCredentials) => {
    // 実際のAPIコールをシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    
    // パスワードチェック（実際の実装では適切な検証が必要）
    if (credentials.password !== 'password123') {
      throw new Error('パスワードが正しくありません');
    }
    
    return user;
  },
  
  register: async (data: RegisterData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 既存ユーザーチェック
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に使用されています');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      username: data.username,
      role: 'user' as const,
      created_at: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    return newUser;
  },
  
  checkAuth: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ローカルストレージから認証情報を確認（簡易実装）
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    return null;
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    
    try {
      const user = await mockAuthAPI.login(credentials);
      
      // ローカルストレージに保存（実際の実装ではより安全な方法を使用）
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (data: RegisterData) => {
    set({ isLoading: true });
    
    try {
      const user = await mockAuthAPI.register(data);
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    
    // ログアウト処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.removeItem('currentUser');
    
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      const user = await mockAuthAPI.checkAuth();
      
      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
})); 