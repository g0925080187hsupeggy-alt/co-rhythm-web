import { Heart, Music, Zap, Shield } from 'lucide-react';

export function ProductIntro() {
  const features = [
    {
      icon: Heart,
      title: '身心平衡',
      description: '結合音樂療法與穴道按摩，達到身心和諧',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Music,
      title: '多元音樂',
      description: '打擊、弦樂、管樂、鍵盤四大系列供您選擇',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: '即時回饋',
      description: '壓力感測器提供即時數據，掌握療癒進度',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: '專業設計',
      description: '基於傳統穴位療法，結合現代科技',
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="mb-4">產品介紹</h2>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          EmoEase 是一款創新的音樂療癒裝置，讓您在優美的音樂中享受穴道按摩的舒適體驗
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={28} />
              </div>
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
