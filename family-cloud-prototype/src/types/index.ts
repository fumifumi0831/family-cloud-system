// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// ファイル関連の型定義
export interface FileItem {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  folder_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  storage_path: string;
  thumbnail_url?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parent_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  children?: FolderItem[];
  file_count?: number;
}

// アップロード関連の型定義
export interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// ストレージ使用量の型定義
export interface StorageUsage {
  user_id: string;
  total_size: number;
  file_count: number;
  quota: number;
  updated_at: string;
}

// APIレスポンスの型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// 認証ストアの型定義
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ファイルストアの型定義
export interface FileState {
  files: FileItem[];
  folders: FolderItem[];
  currentFolder: string | null;
  selectedFiles: string[];
  uploadFiles: UploadFile[];
  storageUsage: StorageUsage | null;
  isLoading: boolean;
  
  // アクション
  fetchFiles: (folderId?: string) => Promise<void>;
  fetchFolders: () => Promise<void>;
  uploadFile: (file: File, folderId?: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  setCurrentFolder: (folderId: string | null) => void;
  toggleFileSelection: (fileId: string) => void;
  clearSelection: () => void;
  fetchStorageUsage: () => Promise<void>;
} 