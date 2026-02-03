import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  name: string;
  role: string;
  initials: string;
  gradient: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    name: "Sarah Mitchell",
    role: "Business Owner",
    initials: "SM",
    gradient: "from-blue-500 to-cyan-500",
    text: "The team made the entire trademark process so easy to understand. They were responsive, professional, and genuinely cared about protecting my brand. I couldn't be happier with the service.",
    rating: 5
  },
  {
    name: "James Chen",
    role: "Tech Entrepreneur",
    initials: "JC",
    gradient: "from-emerald-500 to-teal-500",
    text: "Working with MARQ was a game changer. The attorneys kept me informed every step of the way, and their expertise gave me complete confidence in the process.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Creative Director",
    initials: "ER",
    gradient: "from-amber-500 to-orange-500",
    text: "I appreciated the transparent pricing and personal attention. The team answered all my questions promptly and made sure I understood every stage of the trademark registration.",
    rating: 5
  },
  {
    name: "David Thompson",
    role: "Restaurant Owner",
    initials: "DT",
    gradient: "from-purple-500 to-pink-500",
    text: "Protecting my restaurant's brand was critical, and the MARQ team made it happen seamlessly. Their knowledge of trademark law is exceptional, and they explained everything in terms I could understand.",
    rating: 5
  },
  {
    name: "Lisa Anderson",
    role: "Boutique Owner",
    initials: "LA",
    gradient: "from-rose-500 to-red-500",
    text: "I was nervous about the trademark process, but Mary and her team guided me through with patience and expertise. My brand is now fully protected, and I can focus on growing my business.",
    rating: 5
  },
  {
    name: "Michael Park",
    role: "Software Developer",
    initials: "MP",
    gradient: "from-indigo-500 to-blue-500",
    text: "Professional, efficient, and knowledgeable. The attorneys helped trademark my app name without any complications. The whole experience was smooth and stress-free.",
    rating: 5
  },
  {
    name: "Rachel Green",
    role: "Marketing Consultant",
    initials: "RG",
    gradient: "from-teal-500 to-cyan-500",
    text: "The team's attention to detail and thorough approach to trademark searches saved me from potential conflicts. I highly recommend their services to anyone serious about brand protection.",
    rating: 5
  },
  {
    name: "Thomas Wright",
    role: "E-commerce Founder",
    initials: "TW",
    gradient: "from-orange-500 to-amber-500",
    text: "Fast, professional, and affordable. The team delivered exactly what they promised. My trademark is registered, and I have peace of mind knowing my brand is protected.",
    rating: 5
  },
  {
    name: "Jennifer Martinez",
    role: "Fitness Studio Owner",
    initials: "JM",
    gradient: "from-green-500 to-emerald-500",
    text: "Mary and her team went above and beyond to ensure my trademark application was perfect. Their communication was excellent, and they made the entire process straightforward.",
    rating: 5
  },
  {
    name: "Robert Kim",
    role: "Product Designer",
    initials: "RK",
    gradient: "from-slate-500 to-gray-500",
    text: "I've worked with other trademark attorneys before, but the MARQ team stands out for their personalized service and genuine commitment to their clients. Highly recommended!",
    rating: 5
  }
];

export default function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const reviewsPerPage = 3;
  const maxIndex = Math.max(0, reviews.length - reviewsPerPage);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleReviews.map((review, index) => (
          <div key={currentIndex + index} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 animate-fadeIn">
            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="text-amber-400 fill-amber-400" size={20} />
              ))}
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed min-h-[120px]">
              "{review.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                {review.initials}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{review.name}</div>
                <div className="text-sm text-slate-600">{review.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-slate-800 text-white p-3 rounded-full hover:bg-slate-700 transition-all shadow-lg hover:scale-110"
          aria-label="Previous reviews"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-slate-800'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to review set ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-slate-800 text-white p-3 rounded-full hover:bg-slate-700 transition-all shadow-lg hover:scale-110"
          aria-label="Next reviews"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-slate-500">
          Showing {currentIndex + 1}-{Math.min(currentIndex + reviewsPerPage, reviews.length)} of {reviews.length} reviews
        </p>
      </div>
    </div>
  );
}
