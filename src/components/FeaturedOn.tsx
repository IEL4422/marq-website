import { useEffect, useState } from 'react';

export default function FeaturedOn() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const publications = [
    {
      name: 'Bloomberg',
      logo: (
        <img
          src="https://i.imgur.com/TTpICyq.png"
          alt="Bloomberg"
          className="h-8 md:h-10 w-auto object-contain"
        />
      ),
      color: 'text-slate-900'
    },
    {
      name: 'Forbes',
      logo: (
        <img
          src="https://logodownload.org/wp-content/uploads/2017/04/forbes-logo-0.png"
          alt="Forbes"
          className="h-24 md:h-32 w-auto object-contain"
        />
      ),
      color: 'text-slate-900'
    },
    {
      name: 'Entrepreneur',
      logo: (
        <img
          src="https://help.entrepreneur.com/hubfs/Knowledge%20Base%20Import/assets.entrepreneur.comstatic1413842518-entrepreneur-logo.jpg"
          alt="Entrepreneur"
          className="h-8 md:h-10 w-auto object-contain"
        />
      ),
      color: 'text-slate-900'
    },
    {
      name: 'Fortune',
      logo: (
        <svg className="h-8 md:h-10" viewBox="0 0 200 50" fill="none">
          <text x="0" y="35" className="font-bold" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '36px', fill: '#000000', fontWeight: '700', letterSpacing: '-0.02em', fontStretch: 'condensed' }}>
            FORTUNE
          </text>
        </svg>
      ),
      color: 'text-slate-900'
    },
    {
      name: 'Business Insider',
      logo: (
        <img
          src="https://www.vistaprint.com/news/wp-content/uploads/sites/14/2020/04/Business-Insider-Logo-for-slider.png"
          alt="Business Insider"
          className="h-16 md:h-20 w-auto object-contain"
        />
      ),
      color: 'text-slate-900'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % publications.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, publications.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 to-white border-y border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
          As Featured In
        </p>

        <div className="hidden md:grid md:grid-cols-5 gap-8 items-center justify-items-center">
          {publications.map((pub, index) => (
            <div
              key={index}
              className={`${pub.color} opacity-60 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-default`}
            >
              {pub.logo}
            </div>
          ))}
        </div>

        <div className="md:hidden">
          <div className="relative h-24 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              {publications.map((pub, index) => (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ${
                    index === currentIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                  } ${pub.color}`}
                >
                  {pub.logo}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {publications.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-slate-700 w-8'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
