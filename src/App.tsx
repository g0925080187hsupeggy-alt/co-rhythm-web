import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MusicCategories } from './components/MusicCategories';
import { MusicPlayer } from './components/MusicPlayer';
import { PressureDisplay } from './components/PressureDisplay';
import { AcupointMap } from './components/AcupointMap';
import { ProductIntro } from './components/ProductIntro';
import { FeaturesIntro } from './components/FeaturesIntro';
import { MusicLibrary } from './components/MusicLibrary';
import { ImageManager } from './components/ImageManager';
// 1. 改成引用新的控制器
import { HardwareController } from './components/HardwareController';
import { AuthModal } from './components/AuthModal';
import { imageConfig } from './config/images';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('放鬆音樂');
  const [showImageManager, setShowImageManager] = useState(false);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [images, setImages] = useState(imageConfig);
  const [realSensorData, setRealSensorData] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('登出失敗', error);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero 
              onStart={() => setCurrentPage('play')} 
              onConnectDevice={() => setShowBluetoothModal(true)}
              images={images} 
            />
            <ProductIntro />
            <FeaturesIntro images={images} />
          </>
        );
      case 'play':
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">互動療癒儀表板</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <MusicPlayer 
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentTrack={currentTrack}
              />
              <PressureDisplay 
                isPlaying={isPlaying} 
                realSensorData={realSensorData}
              />
            </div>
            {/* 2. 這裡原本是 BluetoothConnection，現在換成 HardwareController */}
            <div className="mb-12">
              <HardwareController 
                onDataReceived={(value) => setRealSensorData(value)}
              />
            </div>
            <AcupointMap />
          </div>
        );
      case 'categories':
        return <MusicCategories setCurrentPage={setCurrentPage} images={images} />;
      case 'library':
        return <MusicLibrary setCurrentTrack={setCurrentTrack} setCurrentPage={setCurrentPage} />;
      case 'manual':
        return (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="mb-8 font-bold text-3xl">使用手冊</h1>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">快速入門</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-bold">1. 裝置連接</h3>
                  <p className="text-gray-600">將 EmoEase 裝置通過藍牙連接至您的設備。</p>
                </div>
                <div>
                  <h3 className="mb-2 font-bold">2. 選擇音樂</h3>
                  <p className="text-gray-600">從系列中選擇您喜歡的音樂類型。</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Hero onStart={() => setCurrentPage('play')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onOpenImageManager={() => setShowImageManager(true)}
        onOpenLogin={() => setShowAuthModal(true)} 
        onLogout={handleLogout}                    
        currentUser={currentUser}                  
      />
      
      {renderContent()}

      {showImageManager && (
        <ImageManager
          onClose={() => setShowImageManager(false)}
          onUpdate={(newConfig) => setImages(newConfig)}
        />
      )}
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* 3. 這裡的彈窗也換成 HardwareController */}
      {showBluetoothModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
                onClick={() => setShowBluetoothModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">連接裝置</h2>
            <HardwareController 
              onDataReceived={(value) => setRealSensorData(value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}