'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFileStore } from '@/stores/useFileStore';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { FileList } from '@/components/features/FileList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatFileSize } from '@/lib/mockData';
import { 
  Upload as UploadIcon, 
  FolderOpen, 
  HardDrive,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { 
    files, 
    folders, 
    currentFolder, 
    uploadFiles, 
    storageUsage, 
    fetchFiles, 
    fetchFolders, 
    fetchStorageUsage 
  } = useFileStore();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // 初期データの読み込み
    fetchFiles();
    fetchFolders();
    fetchStorageUsage();
  }, [fetchFiles, fetchFolders, fetchStorageUsage]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getCurrentFolderName = () => {
    if (!currentFolder) return 'ホーム';
    const folder = folders.find(f => f.id === currentFolder);
    return folder?.name || 'フォルダ';
  };

  const getUsagePercentage = () => {
    if (!storageUsage) return 0;
    return (storageUsage.total_size / storageUsage.quota) * 100;
  };

  const getRecentFiles = () => {
    return files
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* メインエリア */}
        <main className="flex-1 p-6 overflow-auto">
          {/* ウェルカムセクション */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              こんにちは、{user?.username}さん！
            </h1>
            <p className="text-gray-600">
              現在のフォルダ: <span className="font-medium">{getCurrentFolderName()}</span>
            </p>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* ストレージ使用量 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ストレージ使用量</CardTitle>
                <HardDrive className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {storageUsage ? formatFileSize(storageUsage.total_size) : '---'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {storageUsage ? formatFileSize(storageUsage.quota) : '---'} 中
                  </div>
                  <Progress value={getUsagePercentage()} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {getUsagePercentage().toFixed(1)}% 使用中
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ファイル数 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総ファイル数</CardTitle>
                <FolderOpen className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{files.length}</div>
                <p className="text-xs text-gray-600">
                  {folders.length}個のフォルダ
                </p>
              </CardContent>
            </Card>

            {/* アップロード中 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">アップロード中</CardTitle>
                <UploadIcon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uploadFiles.length}</div>
                <p className="text-xs text-gray-600">
                  {uploadFiles.filter(f => f.status === 'uploading').length}個処理中
                </p>
              </CardContent>
            </Card>

            {/* 家族メンバー */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">家族メンバー</CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-gray-600">
                  アクティブなユーザー
                </p>
              </CardContent>
            </Card>
          </div>

          {/* アップロード進行状況 */}
          {uploadFiles.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <UploadIcon className="h-5 w-5" />
                  <span>アップロード進行状況</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              uploadFile.status === 'completed' ? 'default' :
                              uploadFile.status === 'error' ? 'destructive' : 'secondary'
                            }
                          >
                            {uploadFile.status === 'uploading' && `${uploadFile.progress}%`}
                            {uploadFile.status === 'completed' && '完了'}
                            {uploadFile.status === 'error' && 'エラー'}
                          </Badge>
                        </div>
                      </div>
                      {uploadFile.status === 'uploading' && (
                        <Progress value={uploadFile.progress} className="h-2" />
                      )}
                      {uploadFile.status === 'error' && uploadFile.error && (
                        <p className="text-xs text-red-600">{uploadFile.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 最近のファイル */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>最近のファイル</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getRecentFiles().length > 0 ? (
                  <div className="space-y-3">
                    {getRecentFiles().map((file) => (
                      <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <FolderOpen className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.original_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.file_size)} • {new Date(file.updated_at).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>最近のファイルはありません</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* クイックアクション */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">クイックアクション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary-400 transition-colors">
                    <UploadIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">ファイルをアップロード</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          useFileStore.getState().uploadFile(file, currentFolder || undefined);
                        });
                        e.target.value = '';
                      }}
                    />
                  </label>
                  
                  <div className="text-xs text-gray-500 text-center">
                    または、ファイルをここにドラッグ&ドロップ
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ファイル一覧 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {getCurrentFolderName()}のファイル
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileList />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
} 