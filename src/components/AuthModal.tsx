import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, Loader2, User } from 'lucide-react'; // 新增 User icon
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'; // 新增 updateProfile

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // 新增：姓名狀態
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        // 登入模式
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 註冊模式
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 註冊成功後，立即更新使用者的「顯示名稱 (displayName)」
        if (name.trim()) {
          await updateProfile(userCredential.user, {
            displayName: name
          });
        }
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = "發生錯誤，請稍後再試。";
      if (err.code === 'auth/invalid-email') msg = "電子郵件格式不正確。";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = "帳號或密碼錯誤。";
      if (err.code === 'auth/email-already-in-use') msg = "此 Email 已被註冊。";
      if (err.code === 'auth/weak-password') msg = "密碼太弱，請至少輸入 6 位數。";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <X size={20} />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{isLoginMode ? '歡迎回來' : '建立帳戶'}</h2>
            <p className="text-gray-500 text-sm">
              {isLoginMode ? '請輸入您的帳號密碼以繼續' : '請填寫以下資訊完成註冊'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 新增：姓名輸入框 (只有在註冊模式顯示) */}
            {!isLoginMode && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-bold text-gray-700 mb-1">您的姓名</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLoginMode} // 註冊時必填
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="如何稱呼您？"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">密碼</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border-2 border-purple-600"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isLoginMode ? '登入' : '註冊'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <span>{isLoginMode ? '還沒有帳號嗎？' : '已經有帳號了嗎？'}</span>
            <button
              type="button"
              onClick={() => { 
                setIsLoginMode(!isLoginMode); 
                setError(null); 
                setName(''); // 切換模式時清空姓名
              }}
              className="text-purple-600 font-bold hover:underline ml-1"
            >
              {isLoginMode ? '立即註冊' : '立即登入'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}