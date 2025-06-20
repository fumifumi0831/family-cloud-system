'use client';

import React, { useState } from 'react';
import { useFileStore } from '@/stores/useFileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Home, 
  Upload, 
  FolderPlus, 
  Folder, 
  Search,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    folders, 
    currentFolder, 
    setCurrentFolder, 
    createFolder,
    fetchFolders 
  } = useFileStore();
  
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  React.useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      await createFolder(newFolderName.trim(), currentFolder || undefined);
      setNewFolderName('');
      setIsCreateFolderOpen(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleFolderClick = (folderId: string | null) => {
    setCurrentFolder(folderId);
    // モバイルでサイドバーを閉じる
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderFolderTree = (parentId: string | null = null, level: number = 0) => {
    const childFolders = folders.filter(folder => folder.parent_id === parentId);
    
    return childFolders.map(folder => {
      const hasChildren = folders.some(f => f.parent_id === folder.id);
      const isExpanded = expandedFolders.includes(folder.id);
      const isSelected = currentFolder === folder.id;
      
      return (
        <div key={folder.id}>
          <div
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors",
              isSelected && "bg-primary-100 text-primary-700",
              level > 0 && "ml-4"
            )}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolderExpansion(folder.id);
                }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            
            <div
              className="flex items-center space-x-2 flex-1"
              onClick={() => handleFolderClick(folder.id)}
            >
              <Folder className="h-4 w-4" />
              <span className="text-sm truncate">{folder.name}</span>
              {folder.file_count !== undefined && (
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {folder.file_count}
                </span>
              )}
            </div>
          </div>
          
          {hasChildren && isExpanded && renderFolderTree(folder.id, level + 1)}
        </div>
      );
    });
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* ナビゲーションメニュー */}
      <div className="p-4 border-b border-gray-200">
        <nav className="space-y-2">
          {/* ホーム */}
          <button
            onClick={() => handleFolderClick(null)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors",
              currentFolder === null && "bg-primary-100 text-primary-700"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">ホーム</span>
          </button>

          {/* アップロード */}
          <label className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors cursor-pointer">
            <Upload className="h-5 w-5" />
            <span className="font-medium">ファイルアップロード</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => {
                  useFileStore.getState().uploadFile(file, currentFolder || undefined);
                });
                e.target.value = ''; // リセット
              }}
            />
          </label>

          {/* 新しいフォルダ */}
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors">
                <FolderPlus className="h-5 w-5" />
                <span className="font-medium">新しいフォルダ</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しいフォルダを作成</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="フォルダ名を入力してください"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder();
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleCreateFolder} className="flex-1">
                    作成
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateFolderOpen(false)}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </nav>
      </div>

      {/* フォルダツリー */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-700 mb-2">フォルダ</h3>
          {folders.length > 0 ? (
            renderFolderTree()
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">
              フォルダがありません
            </p>
          )}
        </div>
      </div>

      {/* 検索エリア（将来的な機能） */}
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ファイルを検索..."
            className="pl-10"
            disabled
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">検索機能は準備中です</p>
      </div>
    </div>
  );

  // デスクトップ版
  if (!isOpen && window.innerWidth >= 768) {
    return (
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
        {sidebarContent}
      </aside>
    );
  }

  // モバイル版（オーバーレイ）
  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* サイドバー */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out",
          "md:relative md:translate-x-0 md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}; 