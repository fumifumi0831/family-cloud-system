import { create } from 'zustand';
import { FileState, FileItem, FolderItem, UploadFile } from '@/types';
import { mockFiles, mockFolders, mockStorageUsage } from '@/lib/mockData';

// モックファイルAPI
const mockFileAPI = {
  fetchFiles: async (folderId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (folderId) {
      return mockFiles.filter(file => file.folder_id === folderId);
    }
    
    return mockFiles.filter(file => file.folder_id === null);
  },
  
  fetchFolders: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockFolders];
  },
  
  uploadFile: async (file: File, folderId?: string) => {
    // アップロード進捗をシミュレート
    const uploadId = Date.now().toString();
    
    return new Promise<FileItem>((resolve) => {
      const newFile: FileItem = {
        id: uploadId,
        filename: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
        original_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        folder_id: folderId || null,
        user_id: '1', // 現在のユーザーID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        storage_path: `/files/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${file.name}`,
      };
      
      // アップロード完了をシミュレート
      setTimeout(() => {
        mockFiles.push(newFile);
        resolve(newFile);
      }, 2000);
    });
  },
  
  deleteFile: async (fileId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockFiles.findIndex(file => file.id === fileId);
    if (index !== -1) {
      mockFiles.splice(index, 1);
    }
  },
  
  createFolder: async (name: string, parentId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      parent_id: parentId || null,
      user_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      file_count: 0,
    };
    
    mockFolders.push(newFolder);
    return newFolder;
  },
  
  deleteFolder: async (folderId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // フォルダ内のファイルも削除
    const folderFiles = mockFiles.filter(file => file.folder_id === folderId);
    folderFiles.forEach(file => {
      const index = mockFiles.findIndex(f => f.id === file.id);
      if (index !== -1) {
        mockFiles.splice(index, 1);
      }
    });
    
    // フォルダを削除
    const index = mockFolders.findIndex(folder => folder.id === folderId);
    if (index !== -1) {
      mockFolders.splice(index, 1);
    }
  },
  
  fetchStorageUsage: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 動的に使用量を計算
    const totalSize = mockFiles.reduce((total, file) => total + file.file_size, 0);
    const fileCount = mockFiles.length;
    
    return {
      ...mockStorageUsage,
      total_size: totalSize,
      file_count: fileCount,
      updated_at: new Date().toISOString(),
    };
  },
};

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  folders: [],
  currentFolder: null,
  selectedFiles: [],
  uploadFiles: [],
  storageUsage: null,
  isLoading: false,
  
  fetchFiles: async (folderId?: string) => {
    set({ isLoading: true });
    
    try {
      const files = await mockFileAPI.fetchFiles(folderId);
      set({ files, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch files:', error);
    }
  },
  
  fetchFolders: async () => {
    try {
      const folders = await mockFileAPI.fetchFolders();
      set({ folders });
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  },
  
  uploadFile: async (file: File, folderId?: string) => {
    const uploadId = Date.now().toString();
    
    // アップロード中のファイルを追加
    const uploadFile: UploadFile = {
      file,
      id: uploadId,
      progress: 0,
      status: 'uploading',
    };
    
    set(state => ({
      uploadFiles: [...state.uploadFiles, uploadFile]
    }));
    
    try {
      // 進捗更新をシミュレート
      const progressInterval = setInterval(() => {
        set(state => ({
          uploadFiles: state.uploadFiles.map(uf => 
            uf.id === uploadId 
              ? { ...uf, progress: Math.min(uf.progress + 10, 90) }
              : uf
          )
        }));
      }, 200);
      
      const newFile = await mockFileAPI.uploadFile(file, folderId);
      
      clearInterval(progressInterval);
      
      // アップロード完了
      set(state => ({
        files: [...state.files, newFile],
        uploadFiles: state.uploadFiles.map(uf => 
          uf.id === uploadId 
            ? { ...uf, progress: 100, status: 'completed' }
            : uf
        )
      }));
      
      // 完了したアップロードファイルを削除
      setTimeout(() => {
        set(state => ({
          uploadFiles: state.uploadFiles.filter(uf => uf.id !== uploadId)
        }));
      }, 2000);
      
      // ストレージ使用量を更新
      get().fetchStorageUsage();
      
    } catch (error) {
      set(state => ({
        uploadFiles: state.uploadFiles.map(uf => 
          uf.id === uploadId 
            ? { ...uf, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
            : uf
        )
      }));
    }
  },
  
  deleteFile: async (fileId: string) => {
    try {
      await mockFileAPI.deleteFile(fileId);
      
      set(state => ({
        files: state.files.filter(file => file.id !== fileId),
        selectedFiles: state.selectedFiles.filter(id => id !== fileId)
      }));
      
      get().fetchStorageUsage();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  },
  
  createFolder: async (name: string, parentId?: string) => {
    try {
      const newFolder = await mockFileAPI.createFolder(name, parentId);
      
      set(state => ({
        folders: [...state.folders, newFolder]
      }));
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  },
  
  deleteFolder: async (folderId: string) => {
    try {
      await mockFileAPI.deleteFolder(folderId);
      
      set(state => ({
        folders: state.folders.filter(folder => folder.id !== folderId),
        files: state.files.filter(file => file.folder_id !== folderId)
      }));
      
      get().fetchStorageUsage();
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  },
  
  setCurrentFolder: (folderId: string | null) => {
    set({ currentFolder: folderId });
    get().fetchFiles(folderId || undefined);
  },
  
  toggleFileSelection: (fileId: string) => {
    set(state => ({
      selectedFiles: state.selectedFiles.includes(fileId)
        ? state.selectedFiles.filter(id => id !== fileId)
        : [...state.selectedFiles, fileId]
    }));
  },
  
  clearSelection: () => {
    set({ selectedFiles: [] });
  },
  
  fetchStorageUsage: async () => {
    try {
      const storageUsage = await mockFileAPI.fetchStorageUsage();
      set({ storageUsage });
    } catch (error) {
      console.error('Failed to fetch storage usage:', error);
    }
  },
})); 