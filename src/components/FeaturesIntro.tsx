import { Smartphone, Headphones, BarChart, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { imageConfig } from '../config/images';

interface FeaturesIntroProps {
  images?: typeof imageConfig;
}

export function FeaturesIntro({ images = imageConfig }: FeaturesIntroProps) {
  const features = [
    {
      icon: Smartphone,
      title: '裝置連接',
      description: '透過藍牙快速連接您的EmoEase裝置，隨時隨地開始療癒',
    },
    {
      icon: Headphones,
      title: '沉浸體驗',
      description: '高品質音樂搭配精準的穴道刺激，帶來極致的放鬆體驗',
    },
    {
      icon: BarChart,
      title: '數據追蹤',
      description: '記錄每次療程的壓力數據，了解您的身心狀態變化',
    },
    {
      icon: Clock,
      title: '彈性時長',
      description: '自由調整療程時間，從5分鐘到60分鐘任您選擇',
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">功能介紹</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            完整的功能設計，讓您輕鬆享受專業級的音樂療癒體驗
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={images.features.showcase}
                alt="功能展示"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-2xl mb-2">在音樂裡放鬆</p>
                <p className="text-lg text-white/80">在節奏中互動</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-white mb-4">準備好開始您的療癒之旅了嗎？</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            立即連接您的EmoEase裝置，體驗音樂與穴道療法的完美結合
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg">
              開始體驗
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all">
              了解更多
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
