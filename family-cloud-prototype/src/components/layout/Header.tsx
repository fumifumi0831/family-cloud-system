'use client';

import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFileStore } from '@/stores/useFileStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatFileSize } from '@/lib/mockData';
import { LogOut, Cloud, Menu, X } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const { storageUsage } = useFileStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUsagePercentage = () => {
    if (!storageUsage) return 0;
    return (storageUsage.total_size / storageUsage.quota) * 100;
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage < 50) return 'bg-secondary-green';
    if (percentage < 80) return 'bg-secondary-orange';
    return 'bg-secondary-red';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* 左側: ロゴとハンバーガーメニュー */}
      <div className="flex items-center space-x-4">
        {/* モバイル用ハンバーガーメニュー */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* ロゴとタイトル */}
        <div className="flex items-center space-x-2">
          <Cloud className="h-8 w-8 text-primary-500" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              家族のクラウドストレージ
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              みんなで使う大切な思い出の保管庫
            </p>
          </div>
        </div>
      </div>

      {/* 中央: ストレージ使用量（デスクトップのみ） */}
      {storageUsage && (
        <div className="hidden lg:flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
          <div className="text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-gray-600">使用量</span>
              <Badge variant="outline" className="text-xs">
                {storageUsage.file_count}個のファイル
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Progress 
                value={getUsagePercentage()} 
                className="w-32 h-2"
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatFileSize(storageUsage.total_size)} / {formatFileSize(storageUsage.quota)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 右側: ユーザー情報とログアウト */}
      <div className="flex items-center space-x-3">
        {/* ユーザー情報 */}
        {user && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                {user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.role === 'admin' ? '管理者' : 'ユーザー'}</p>
            </div>
          </div>
        )}

        {/* ログアウトボタン */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-1"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">ログアウト</span>
        </Button>
      </div>
    </header>
  );
}; 