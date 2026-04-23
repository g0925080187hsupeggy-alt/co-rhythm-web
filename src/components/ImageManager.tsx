import { useState } from 'react';
import { Image as ImageIcon, RefreshCw, Upload } from 'lucide-react';
import { imageConfig, imageSearchTerms } from '../config/images';

interface ImageManagerProps {
  onClose: () => void;
  onUpdate: (newConfig: typeof imageConfig) => void;
}

export function ImageManager({ onClose, onUpdate }: ImageManagerProps) {
  const [config, setConfig] = useState(imageConfig);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const handleUpdateUrl = (category: string, key: string, url: string) => {
    const newConfig = { ...config };
    if (category === 'hero') {
      newConfig.hero.main = url;
    } else if (category === 'categories') {
      newConfig.categories[key as keyof typeof config.categories] = url;
    } else if (category === 'features') {
      newConfig.features.showcase = url;
    }
    setConfig(newConfig);
  };

  const handleSave = () => {
    onUpdate(config);
    onClose();
  };

  const ImagePreview = ({ url, label, category, imageKey }: { url: string; label: string; category: string; imageKey: string }) => {
    const isEditing = editingKey === `${category}-${imageKey}`;
    
    return (
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
          <img src={url} alt={label} className="w-full h-full object-cover" />
        </div>
        <p className="text-sm mb-2">{label}</p>
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="输入图片URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleUpdateUrl(category, imageKey, urlInput);
                  setEditingKey(null);
                  setUrlInput('');
                }}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                确认
              </button>
              <button
                onClick={() => {
                  setEditingKey(null);
                  setUrlInput('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditingKey(`${category}-${imageKey}`);
              setUrlInput(url);
            }}
            className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-100"
          >
            <Upload size={14} />
            <span>更换图片</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="text-white" size={20} />
              </div>
              <div>
                <h2>图片管理器</h2>
                <p className="text-sm text-gray-600">更换应用中的所有图片</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Hero Section */}
            <div>
              <h3 className="mb-4">首页主图</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ImagePreview
                  url={config.hero.main}
                  label="主要展示图片"
                  category="hero"
                  imageKey="main"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-4">音乐系列图片</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ImagePreview
                  url={config.categories.percussion}
                  label="打击系列"
                  category="categories"
                  imageKey="percussion"
                />
                <ImagePreview
                  url={config.categories.strings}
                  label="弦乐系列"
                  category="categories"
                  imageKey="strings"
                />
                <ImagePreview
                  url={config.categories.wind}
                  label="管乐系列"
                  category="categories"
                  imageKey="wind"
                />
                <ImagePreview
                  url={config.categories.keyboard}
                  label="键盘系列"
                  category="categories"
                  imageKey="keyboard"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="mb-4">功能展示图片</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ImagePreview
                  url={config.features.showcase}
                  label="功能展示"
                  category="features"
                  imageKey="showcase"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="mb-3">使用说明</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• 点击"更换图片"按钮，输入新的图片URL</p>
                <p>• 支持任何可访问的图片链接（如 Unsplash、自己的服务器等）</p>
                <p>• 建议图片比例：首页主图 16:9，音乐系列 1:1，功能展示 3:4</p>
                <p>• 完成更换后，点击"保存更改"按钮应用新图片</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
          >
            保存更改
          </button>
        </div>
      </div>
    </div>
  );
}
