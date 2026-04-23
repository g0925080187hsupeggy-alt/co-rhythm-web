import { Music2, Guitar, Wind, Piano } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { imageConfig } from '../config/images';

interface MusicCategoriesProps {
  setCurrentPage: (page: string) => void;
  images?: typeof imageConfig;
}

export function MusicCategories({ setCurrentPage, images = imageConfig }: MusicCategoriesProps) {
  const categories = [
    {
      id: 'percussion',
      name: '打擊系列',
      icon: Music2,
      description: '節奏感強烈，活力充沛',
      image: images.categories.percussion,
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'strings',
      name: '弦樂系列',
      icon: Guitar,
      description: '柔和悠揚，舒緩心靈',
      image: images.categories.strings,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'wind',
      name: '管樂系列',
      icon: Wind,
      description: '輕盈飄逸，自由舒暢',
      image: images.categories.wind,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'keyboard',
      name: '鍵盤系列',
      icon: Piano,
      description: '旋律優美，層次豐富',
      image: images.categories.keyboard,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="mb-4">音樂系列</h1>
        <p className="text-gray-600 text-xl">選擇您喜歡的樂器類型，開啟療癒之旅</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="group cursor-pointer"
              onClick={() => setCurrentPage('library')}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover"
                />
                
                {/* 👇 修改重點：
                   我把原本這裡負責「蓋上一層顏色」的 <div> 移除了。
                   現在圖片會直接顯示原色。
                   為了讓白字更清楚，我加了一個非常淡的黑色陰影在底部 (from-black/50)，如果不想要也可以拿掉。
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-40 transition-opacity"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    <Icon size={32} />
                    <h3 className="text-white">{category.name}</h3>
                    <p className="text-sm text-white/90">{category.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="mb-6 text-center">音樂庫選項</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <Music2 size={24} />
            </div>
            <div>
              <h3>線上音樂</h3>
              <p className="text-gray-600">即時串流，無限選擇</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
              <Music2 size={24} />
            </div>
            <div>
              <h3>下載音樂</h3>
              <p className="text-gray-600">離線播放，隨時享受</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}