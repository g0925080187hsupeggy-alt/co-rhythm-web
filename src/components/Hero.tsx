import { Play, Bluetooth } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { imageConfig } from '../config/images';

interface HeroProps {
  onStart: () => void;
  onConnectDevice?: () => void;
  images?: typeof imageConfig;
}

export function Hero({ onStart, onConnectDevice, images = imageConfig }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-white">音樂裡放鬆，節奏中互動</h1>
            <p className="text-xl text-blue-100">
              EmoEase 結合音樂療法與穴道按摩，讓您在優美旋律中找到身心平衡
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onStart}
                className="flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                <Play size={20} fill="currentColor" />
                <span>開始體驗</span>
              </button>
              <button 
                onClick={onConnectDevice}
                className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all"
              >
                <Bluetooth size={20} />
                <span>連接裝置</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <ImageWithFallback
                src={images.hero.main}
                alt="音樂療法"
                className="rounded-3xl shadow-2xl object-cover w-full h-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Play size={24} className="text-white" fill="white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">正在播放</p>
                    <p className="text-gray-900">舒緩旋律</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
