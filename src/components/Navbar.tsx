import { Menu, Home, Play, Music, BookOpen, Layers, Image, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenImageManager: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  currentUser: FirebaseUser | null;
}

export function Navbar({ 
  currentPage, 
  setCurrentPage, 
  onOpenImageManager, 
  onOpenLogin, 
  onLogout, 
  currentUser 
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: '首頁', icon: Home },
    { id: 'play', label: '開始遊玩', icon: Play },
    { id: 'categories', label: '音樂系列', icon: Music },
    { id: 'library', label: '音樂庫', icon: Layers },
    { id: 'manual', label: '使用手冊', icon: BookOpen },
  ];

  // 處理顯示名稱的邏輯
  const getDisplayName = () => {
    if (!currentUser) return '';
    // 如果有設定姓名 (displayName)，就顯示姓名
    if (currentUser.displayName) {
      return `哈囉，${currentUser.displayName}`;
    }
    // 如果沒有姓名，顯示 Email 的前綴
    return `哈囉，${currentUser.email?.split('@')[0]}`;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold">EE</span>
            </div>
            <span className="text-gray-900 font-bold text-xl tracking-tight">EmoEase</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={onOpenImageManager}
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-purple-600 hover:bg-purple-50 transition-colors font-medium ml-2"
            >
              <Image size={18} />
              <span>圖片管理</span>
            </button>

            {/* 分隔線 */}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* 登入狀態切換區塊 */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right block">
                  <p className="text-xs font-bold text-gray-900 leading-none">
                    {getDisplayName()}
                  </p>
                  <p className="text-[10px] text-green-500 leading-none mt-1">● 已登入</p>
                </div>
                
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1" 
                  title="登出"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              /* 未登入顯示按鈕 */
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 bg-white text-gray-900 border border-gray-200 px-5 py-2 rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow-md font-bold ml-2"
              >
                <LogIn size={18} />
                <span>登入</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}