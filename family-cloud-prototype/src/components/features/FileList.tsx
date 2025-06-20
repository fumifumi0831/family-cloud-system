'use client';

import React, { useState } from 'react';
import { useFileStore } from '@/stores/useFileStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatFileSize, formatRelativeDate, getFileIcon } from '@/lib/mockData';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Grid3X3,
  List,
  CheckSquare,
  Square
} from 'lucide-react';
import { FileItem } from '@/types';

interface FileListProps {
  viewMode?: 'grid' | 'list';
}

export const FileList: React.FC<FileListProps> = ({ viewMode = 'grid' }) => {
  const { 
    files, 
    selectedFiles, 
    toggleFileSelection, 
    clearSelection, 
    deleteFile,
    isLoading 
  } = useFileStore();
  
  const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>(viewMode);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const getFileIconComponent = (mimeType: string) => {
    const iconName = getFileIcon(mimeType);
    const iconProps = { className: "h-6 w-6 text-gray-600" };
    
    switch (iconName) {
      case 'image': return <Image {...iconProps} className="h-6 w-6 text-green-600" />;
      case 'video': return <Video {...iconProps} className="h-6 w-6 text-red-600" />;
      case 'music': return <Music {...iconProps} className="h-6 w-6 text-purple-600" />;
      case 'archive': return <Archive {...iconProps} className="h-6 w-6 text-orange-600" />;
      default: return <FileText {...iconProps} />;
    }
  };

  const handleFileSelect = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleFileSelection(fileId);
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    
    if (confirm(`選択した${selectedFiles.length}個のファイルを削除しますか？`)) {
      for (const fileId of selectedFiles) {
        await deleteFile(fileId);
      }
      clearSelection();
    }
  };

  const handleFilePreview = (file: FileItem) => {
    setPreviewFile(file);
  };

  const handleDownload = (file: FileItem) => {
    // 実際の実装では、ファイルのダウンロードURLを取得してダウンロードを開始
    console.log('Downloading file:', file.original_name);
    alert(`${file.original_name} のダウンロードを開始しました（デモ版では実際のダウンロードは行われません）`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">ファイルを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {files.length}個のファイル
          </span>
          {selectedFiles.length > 0 && (
            <>
              <Badge variant="secondary">
                {selectedFiles.length}個選択中
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>削除</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                選択解除
              </Button>
            </>
          )}
        </div>

        {/* 表示切り替え */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={localViewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLocalViewMode('grid')}
            className="px-3"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={localViewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLocalViewMode('list')}
            className="px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ファイル一覧 */}
      {files.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ファイルがありません
          </h3>
          <p className="text-gray-600 mb-4">
            サイドバーからファイルをアップロードしてください
          </p>
        </div>
      ) : (
        <div className={
          localViewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
            : 'space-y-2'
        }>
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              viewMode={localViewMode}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={(event) => handleFileSelect(file.id, event)}
              onPreview={() => handleFilePreview(file)}
              onDownload={() => handleDownload(file)}
              onDelete={() => deleteFile(file.id)}
              getFileIconComponent={getFileIconComponent}
            />
          ))}
        </div>
      )}

      {/* ファイルプレビューダイアログ */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.original_name}</DialogTitle>
          </DialogHeader>
          {previewFile && (
            <div className="space-y-4">
              {/* プレビューエリア */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                {previewFile.mime_type.startsWith('image/') ? (
                  <div className="space-y-2">
                    <Image className="h-16 w-16 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">画像プレビュー</p>
                    <p className="text-xs text-gray-500">
                      実際の実装では画像が表示されます
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getFileIconComponent(previewFile.mime_type)}
                    <p className="text-sm text-gray-600">
                      {previewFile.original_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      プレビューは対応していないファイル形式です
                    </p>
                  </div>
                )}
              </div>

              {/* ファイル情報 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ファイルサイズ:</span>
                  <span className="ml-2 font-medium">
                    {formatFileSize(previewFile.file_size)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">更新日:</span>
                  <span className="ml-2 font-medium">
                    {formatRelativeDate(previewFile.updated_at)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">ファイル形式:</span>
                  <span className="ml-2 font-medium">
                    {previewFile.mime_type}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">アップロード者:</span>
                  <span className="ml-2 font-medium">
                    ユーザー#{previewFile.user_id}
                  </span>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex space-x-2">
                <Button onClick={() => handleDownload(previewFile)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteFile(previewFile.id);
                    setPreviewFile(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ファイルカードコンポーネント
interface FileCardProps {
  file: FileItem;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (event: React.MouseEvent) => void;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
  getFileIconComponent: (mimeType: string) => React.ReactNode;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  viewMode,
  isSelected,
  onSelect,
  onPreview,
  onDownload,
  onDelete,
  getFileIconComponent,
}) => {
  if (viewMode === 'list') {
    return (
      <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* 選択チェックボックス */}
            <button onClick={onSelect} className="flex-shrink-0">
              {isSelected ? (
                <CheckSquare className="h-5 w-5 text-primary-500" />
              ) : (
                <Square className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* ファイルアイコン */}
            <div className="flex-shrink-0">
              {getFileIconComponent(file.mime_type)}
            </div>

            {/* ファイル情報 */}
            <div className="flex-1 min-w-0" onClick={onPreview}>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {file.original_name}
              </h3>
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                <span>{formatFileSize(file.file_size)}</span>
                <span>{formatRelativeDate(file.updated_at)}</span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 選択チェックボックス */}
          <div className="flex justify-between items-start">
            <button onClick={onSelect}>
              {isSelected ? (
                <CheckSquare className="h-4 w-4 text-primary-500" />
              ) : (
                <Square className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* ファイルアイコン */}
          <div className="flex justify-center" onClick={onPreview}>
            <div className="p-4 bg-gray-50 rounded-lg">
              {getFileIconComponent(file.mime_type)}
            </div>
          </div>

          {/* ファイル名 */}
          <div onClick={onPreview}>
            <h3 className="text-sm font-medium text-gray-900 truncate text-center">
              {file.original_name}
            </h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              {formatFileSize(file.file_size)}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 