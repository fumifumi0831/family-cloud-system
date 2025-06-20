import { User, FileItem, FolderItem, StorageUsage } from '@/types';

// モックユーザーデータ
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'father@family.com',
    username: 'お父さん',
    role: 'admin',
    avatar_url: '/avatars/father.png',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'mother@family.com',
    username: 'お母さん',
    role: 'user',
    avatar_url: '/avatars/mother.png',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'child1@family.com',
    username: '長男',
    role: 'user',
    avatar_url: '/avatars/child1.png',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'child2@family.com',
    username: '長女',
    role: 'user',
    avatar_url: '/avatars/child2.png',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// モックフォルダデータ
export const mockFolders: FolderItem[] = [
  {
    id: 'folder-1',
    name: '家族写真',
    parent_id: null,
    user_id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    file_count: 15,
  },
  {
    id: 'folder-2',
    name: '動画',
    parent_id: null,
    user_id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    file_count: 8,
  },
  {
    id: 'folder-3',
    name: '書類',
    parent_id: null,
    user_id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    file_count: 12,
  },
  {
    id: 'folder-4',
    name: '2024年旅行',
    parent_id: 'folder-1',
    user_id: '2',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    file_count: 25,
  },
  {
    id: 'folder-5',
    name: '子供の作品',
    parent_id: 'folder-1',
    user_id: '3',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    file_count: 8,
  },
];

// モックファイルデータ
export const mockFiles: FileItem[] = [
  {
    id: 'file-1',
    filename: 'family_photo_001.jpg',
    original_name: '家族写真_001.jpg',
    file_size: 2048576, // 2MB
    mime_type: 'image/jpeg',
    folder_id: 'folder-1',
    user_id: '1',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    storage_path: '/files/2024/01/family_photo_001.jpg',
    thumbnail_url: '/thumbnails/family_photo_001_thumb.jpg',
  },
  {
    id: 'file-2',
    filename: 'vacation_video_001.mp4',
    original_name: '旅行動画_001.mp4',
    file_size: 52428800, // 50MB
    mime_type: 'video/mp4',
    folder_id: 'folder-2',
    user_id: '2',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    storage_path: '/files/2024/02/vacation_video_001.mp4',
    thumbnail_url: '/thumbnails/vacation_video_001_thumb.jpg',
  },
  {
    id: 'file-3',
    filename: 'important_document.pdf',
    original_name: '重要書類.pdf',
    file_size: 1048576, // 1MB
    mime_type: 'application/pdf',
    folder_id: 'folder-3',
    user_id: '1',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    storage_path: '/files/2024/01/important_document.pdf',
  },
  {
    id: 'file-4',
    filename: 'beach_sunset.jpg',
    original_name: '海の夕日.jpg',
    file_size: 3145728, // 3MB
    mime_type: 'image/jpeg',
    folder_id: 'folder-4',
    user_id: '2',
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    storage_path: '/files/2024/03/beach_sunset.jpg',
    thumbnail_url: '/thumbnails/beach_sunset_thumb.jpg',
  },
  {
    id: 'file-5',
    filename: 'drawing_001.png',
    original_name: '絵画作品_001.png',
    file_size: 512000, // 500KB
    mime_type: 'image/png',
    folder_id: 'folder-5',
    user_id: '3',
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z',
    storage_path: '/files/2024/02/drawing_001.png',
    thumbnail_url: '/thumbnails/drawing_001_thumb.jpg',
  },
  {
    id: 'file-6',
    filename: 'school_presentation.pptx',
    original_name: '学校発表資料.pptx',
    file_size: 4194304, // 4MB
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    folder_id: null, // ルートフォルダ
    user_id: '4',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    storage_path: '/files/2024/03/school_presentation.pptx',
  },
];

// モックストレージ使用量データ
export const mockStorageUsage: StorageUsage = {
  user_id: '1',
  total_size: 67108864, // 64MB
  file_count: 45,
  quota: 214748364800, // 200GB
  updated_at: '2024-03-20T00:00:00Z',
};

// ファイルサイズを人間が読みやすい形式に変換するユーティリティ
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 日付を相対的な表示に変換するユーティリティ
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
  
  return `${Math.floor(diffDays / 365)}年前`;
};

// ファイルタイプからアイコン名を取得するユーティリティ
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'music';
  if (mimeType.includes('pdf')) return 'file-text';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'file-spreadsheet';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'archive';
  
  return 'file';
}; 