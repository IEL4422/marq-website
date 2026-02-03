import { useState } from 'react';
import { Wand2, RefreshCw, Search, Lightbulb, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SchemaMarkup from '../components/SchemaMarkup';

interface GeneratedName {
  name: string;
  category: string;
}

export default function BusinessNameGeneratorPage() {
  const [keywords, setKeywords] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('modern');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Food & Beverage',
    'Fashion',
    'Beauty',
    'Consulting',
    'Real Estate',
    'Education',
    'Entertainment',
    'Legal Services',
    'Other'
  ];

  const styles = [
    { value: 'modern', label: 'Modern', description: 'Clean, contemporary names' },
    { value: 'classic', label: 'Classic', description: 'Timeless, traditional names' },
    { value: 'creative', label: 'Creative', description: 'Unique, inventive names' },
    { value: 'professional', label: 'Professional', description: 'Corporate, formal names' },
    { value: 'fun', label: 'Fun', description: 'Playful, energetic names' }
  ];

  const industryPatterns: Record<string, { suffixes: string[], prefixes: string[], words: string[] }> = {
    'Technology': {
      suffixes: ['Tech', 'Labs', 'Soft', 'Cloud', 'Logic', 'Systems', 'Digital', 'Byte', 'Code', 'Net'],
      prefixes: ['Cyber', 'Data', 'Smart', 'Digital', 'Tech', 'Cloud', 'Quantum', 'Neural', 'Pixel', 'Vector'],
      words: ['Innovate', 'Binary', 'Circuit', 'Matrix', 'Nexus', 'Pulse', 'Core', 'Forge', 'Stream']
    },
    'Healthcare': {
      suffixes: ['Care', 'Health', 'Med', 'Clinic', 'Wellness', 'Life', 'Vital', 'Pulse', 'Remedy', 'Heal'],
      prefixes: ['Vital', 'Life', 'Health', 'Care', 'Med', 'Bio', 'Wellness', 'Prime', 'Pure', 'True'],
      words: ['Thrive', 'Balance', 'Harmony', 'Nurture', 'Restore', 'Revive', 'Renew', 'Flourish']
    },
    'Finance': {
      suffixes: ['Capital', 'Ventures', 'Financial', 'Wealth', 'Assets', 'Fund', 'Invest', 'Trust', 'Equity', 'Reserve'],
      prefixes: ['Prime', 'Capital', 'Apex', 'Summit', 'Crown', 'Sterling', 'Quantum', 'Strategic', 'Elite', 'Pinnacle'],
      words: ['Prosperity', 'Fortune', 'Legacy', 'Horizon', 'Pathway', 'Growth', 'Vision', 'Ascend']
    },
    'Retail': {
      suffixes: ['Market', 'Shop', 'Store', 'Boutique', 'Mart', 'Plaza', 'Emporium', 'Exchange', 'Outlet', 'Hub'],
      prefixes: ['Urban', 'Metro', 'Fresh', 'Pure', 'Select', 'Prime', 'Elite', 'Grand', 'Royal', 'Supreme'],
      words: ['Treasure', 'Choice', 'Collection', 'Selection', 'Gallery', 'Haven', 'Discover', 'Find']
    },
    'Food & Beverage': {
      suffixes: ['Kitchen', 'Bistro', 'Cafe', 'Eatery', 'Table', 'Plate', 'Brew', 'Bites', 'Crave', 'Taste'],
      prefixes: ['Fresh', 'Golden', 'Savory', 'Sweet', 'Spice', 'Urban', 'Green', 'Royal', 'Noble', 'Pure'],
      words: ['Harvest', 'Flavor', 'Essence', 'Garden', 'Grove', 'Delight', 'Feast', 'Savor']
    },
    'Fashion': {
      suffixes: ['Style', 'Boutique', 'Closet', 'Studio', 'Atelier', 'Collective', 'Label', 'House', 'Mode', 'Chic'],
      prefixes: ['Urban', 'Modern', 'Chic', 'Elite', 'Luxe', 'Avant', 'Style', 'Mode', 'Vogue', 'Grace'],
      words: ['Elegance', 'Allure', 'Luxe', 'Refined', 'Couture', 'Essence', 'Silk', 'Velvet']
    },
    'Beauty': {
      suffixes: ['Beauty', 'Glow', 'Luxe', 'Spa', 'Studio', 'Salon', 'Essence', 'Radiance', 'Bliss', 'Aura'],
      prefixes: ['Pure', 'Glow', 'Radiant', 'Luxe', 'Divine', 'Serene', 'Velvet', 'Silk', 'Pearl', 'Rose'],
      words: ['Bloom', 'Radiance', 'Serenity', 'Harmony', 'Grace', 'Purity', 'Blossom', 'Shine']
    },
    'Consulting': {
      suffixes: ['Consulting', 'Advisory', 'Partners', 'Group', 'Associates', 'Solutions', 'Advisors', 'Strategies', 'Insights', 'Counsel'],
      prefixes: ['Strategic', 'Prime', 'Apex', 'Elite', 'Summit', 'Pinnacle', 'Vanguard', 'North', 'Optimal', 'Peak'],
      words: ['Wisdom', 'Vision', 'Insight', 'Strategy', 'Pathway', 'Bridge', 'Compass', 'Guide']
    },
    'Real Estate': {
      suffixes: ['Properties', 'Realty', 'Homes', 'Estate', 'Living', 'Residences', 'Dwellings', 'Development', 'Land', 'Housing'],
      prefixes: ['Prime', 'Crown', 'Elite', 'Grand', 'Royal', 'Prestige', 'Legacy', 'Heritage', 'Summit', 'Peak'],
      words: ['Haven', 'Oasis', 'Sanctuary', 'Estate', 'Manor', 'Residence', 'Domain', 'Landmark']
    },
    'Education': {
      suffixes: ['Academy', 'Institute', 'Learning', 'School', 'Education', 'College', 'University', 'Center', 'Hub', 'Lab'],
      prefixes: ['Bright', 'Smart', 'Wise', 'Elite', 'Prime', 'Apex', 'Future', 'Next', 'Global', 'Summit'],
      words: ['Knowledge', 'Wisdom', 'Insight', 'Quest', 'Journey', 'Path', 'Bridge', 'Horizon']
    },
    'Entertainment': {
      suffixes: ['Studios', 'Entertainment', 'Media', 'Productions', 'Creative', 'Arts', 'Shows', 'Live', 'Stage', 'Screen'],
      prefixes: ['Epic', 'Grand', 'Star', 'Show', 'Prime', 'Live', 'Stage', 'Screen', 'Silver', 'Golden'],
      words: ['Spotlight', 'Stage', 'Scene', 'Spectacle', 'Vision', 'Dream', 'Magic', 'Wonder']
    },
    'Legal Services': {
      suffixes: ['Legal', 'Law', 'Associates', 'Attorneys', 'Counsel', 'Advocates', 'Justice', 'Partners', 'Group', 'Firm'],
      prefixes: ['Justice', 'Liberty', 'Crown', 'Summit', 'Premier', 'Sterling', 'Elite', 'Prime', 'Apex', 'Shield'],
      words: ['Justice', 'Liberty', 'Shield', 'Trust', 'Integrity', 'Honor', 'Counsel', 'Defense']
    },
    'Other': {
      suffixes: ['Co', 'Group', 'Solutions', 'Hub', 'Works', 'Studio', 'Labs', 'Collective', 'Partners', 'House'],
      prefixes: ['Pro', 'Prime', 'Elite', 'Smart', 'Swift', 'Bright', 'Pure', 'Next', 'Nova', 'Apex'],
      words: ['Innovate', 'Create', 'Build', 'Grow', 'Connect', 'Thrive', 'Rise', 'Launch', 'Forge']
    }
  };

  const styleModifiers: Record<string, { approach: string[], modifiers: string[] }> = {
    'modern': {
      approach: ['minimal', 'tech', 'sleek'],
      modifiers: ['io', 'ly', 'ify', 'zy', 'ix', 'ex']
    },
    'classic': {
      approach: ['traditional', 'formal', 'established'],
      modifiers: ['& Co', 'Group', 'Associates', 'Partners', 'House of']
    },
    'creative': {
      approach: ['unique', 'playful', 'inventive'],
      modifiers: ['lab', 'studio', 'collective', 'works', 'forge']
    },
    'professional': {
      approach: ['corporate', 'formal', 'authoritative'],
      modifiers: ['Consulting', 'Solutions', 'Enterprises', 'Corporation', 'International']
    },
    'fun': {
      approach: ['playful', 'energetic', 'vibrant'],
      modifiers: ['Box', 'Pop', 'Buzz', 'Zest', 'Spark']
    }
  };

  const generateCreativeBlend = (word1: string, word2: string): string => {
    const len1 = word1.length;
    const len2 = word2.length;
    const split1 = Math.floor(len1 * (0.4 + Math.random() * 0.3));
    const split2 = Math.floor(len2 * (0.3 + Math.random() * 0.3));
    return word1.slice(0, split1) + word2.slice(split2);
  };

  const generateNames = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const names: GeneratedName[] = [];
      const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);

      if (keywordList.length === 0) {
        keywordList.push(industry.toLowerCase() || 'business');
      }

      const patterns = industryPatterns[industry] || industryPatterns['Technology'];
      const styleConfig = styleModifiers[style] || styleModifiers['modern'];

      keywordList.forEach((keyword, keywordIndex) => {
        const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);

        if (style === 'modern') {
          patterns.suffixes.slice(0, 4).forEach(suffix => {
            const blend = generateCreativeBlend(keyword, suffix.toLowerCase());
            names.push({
              name: blend.charAt(0).toUpperCase() + blend.slice(1),
              category: 'Modern Blend'
            });
          });
        }

        if (style === 'creative') {
          patterns.words.slice(0, 3).forEach(word => {
            const portmanteau = generateCreativeBlend(keyword, word.toLowerCase());
            names.push({
              name: portmanteau.charAt(0).toUpperCase() + portmanteau.slice(1),
              category: 'Creative'
            });
          });
        }

        patterns.suffixes.slice(0, 3).forEach((suffix, i) => {
          if (style === 'professional' && i === 0) {
            names.push({
              name: `${capitalizedKeyword} ${suffix}`,
              category: 'Professional'
            });
          } else if (style === 'classic') {
            names.push({
              name: `${capitalizedKeyword} ${suffix}`,
              category: 'Classic'
            });
          } else {
            names.push({
              name: `${capitalizedKeyword}${suffix}`,
              category: 'Industry'
            });
          }
        });

        patterns.prefixes.slice(0, 3).forEach(prefix => {
          if (Math.random() > 0.5) {
            names.push({
              name: `${prefix}${capitalizedKeyword}`,
              category: 'Prefix'
            });
          } else {
            names.push({
              name: `${prefix} ${capitalizedKeyword}`,
              category: 'Compound'
            });
          }
        });

        if (keywordList.length > 1 && keywordIndex === 0) {
          const secondKeyword = keywordList[1].charAt(0).toUpperCase() + keywordList[1].slice(1);

          const blended = generateCreativeBlend(keyword, keywordList[1]);
          names.push({
            name: blended.charAt(0).toUpperCase() + blended.slice(1),
            category: 'Portmanteau'
          });

          names.push({
            name: `${capitalizedKeyword}${secondKeyword}`,
            category: 'Fusion'
          });

          if (style === 'classic' || style === 'professional') {
            names.push({
              name: `${capitalizedKeyword} & ${secondKeyword}`,
              category: 'Partnership'
            });
          }
        }

        patterns.words.slice(0, 2).forEach(word => {
          names.push({
            name: `${capitalizedKeyword} ${word}`,
            category: 'Descriptive'
          });
        });

        if (style === 'modern') {
          const vowels = ['a', 'e', 'i', 'o', 'u'];
          const lastChar = keyword.slice(-1).toLowerCase();
          const modifier = vowels.includes(lastChar) ? 'fy' : 'ify';
          names.push({
            name: capitalizedKeyword + modifier,
            category: 'Modern'
          });
        }

        if (keyword.length > 5) {
          const abbreviated = keyword.slice(0, 3).toUpperCase() + patterns.suffixes[0];
          names.push({
            name: abbreviated,
            category: 'Abbreviated'
          });
        }
      });

      const uniqueNames = Array.from(new Set(names.map(n => n.name)))
        .map(name => names.find(n => n.name === name)!)
        .filter(n => n.name.length >= 3 && n.name.length <= 30);

      const shuffled = uniqueNames.sort(() => Math.random() - 0.5);
      setGeneratedNames(shuffled.slice(0, 18));
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SchemaMarkup type="WebPage" data={{
        name: 'Business Name Generator - Marq',
        description: 'Generate unique business names and check trademark availability. Free business name generator tool for entrepreneurs and startups.'
      }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Wand2 size={16} />
            Free Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Business Name Generator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Generate unique, memorable business names instantly. Find the perfect name for your brand and check trademark availability.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-12">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Keywords
                <span className="text-slate-500 font-normal ml-2">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., tech, smart, solutions"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <option value="">Select an industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {styles.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      style === s.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 mb-1">{s.label}</div>
                    <div className="text-sm text-slate-600">{s.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateNames}
              disabled={isGenerating}
              className="w-full bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Names
                </>
              )}
            </button>
          </div>
        </div>

        {generatedNames.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Generated Names</h2>
              <button
                onClick={generateNames}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <RefreshCw size={18} />
                Regenerate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedNames.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-lg p-6 hover:border-amber-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors break-words">
                        {item.name}
                      </h3>
                      <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.name)}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      {copiedName === item.name ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                  <Link
                    to="/trademark-search-request"
                    className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium mt-3 group-hover:underline"
                  >
                    <Search size={14} />
                    Check Availability
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-lg">
              <Lightbulb size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Important: Check Trademark Availability
              </h3>
              <p className="text-slate-700 mb-4">
                Before using any generated name, it's crucial to verify that it's available for trademark registration. A name might sound perfect, but if it's already trademarked in your industry, you could face legal issues down the road.
              </p>
              <Link
                to="/trademark-search-request"
                className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                <Search size={18} />
                Search Trademarks Now
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Tips for Choosing a Name</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <div className="bg-amber-100 p-1 rounded mt-0.5">
                  <Check size={14} className="text-amber-600" />
                </div>
                <span>Keep it short and memorable</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-amber-100 p-1 rounded mt-0.5">
                  <Check size={14} className="text-amber-600" />
                </div>
                <span>Make sure it's easy to spell and pronounce</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-amber-100 p-1 rounded mt-0.5">
                  <Check size={14} className="text-amber-600" />
                </div>
                <span>Check domain name availability</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-amber-100 p-1 rounded mt-0.5">
                  <Check size={14} className="text-amber-600" />
                </div>
                <span>Avoid names that are too similar to competitors</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-amber-100 p-1 rounded mt-0.5">
                  <Check size={14} className="text-amber-600" />
                </div>
                <span>Consider future growth and expansion</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Next Steps</h3>
            <div className="space-y-4">
              <Link
                to="/trademark-search-request"
                className="block p-4 border-2 border-slate-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Search size={20} className="text-amber-600" />
                  <span className="font-semibold text-slate-900 group-hover:text-amber-600">
                    Trademark Search
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Verify your name is available for registration
                </p>
              </Link>

              <Link
                to="/trademark-registration"
                className="block p-4 border-2 border-slate-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wand2 size={20} className="text-amber-600" />
                  <span className="font-semibold text-slate-900 group-hover:text-amber-600">
                    Register Your Trademark
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Protect your brand with official registration
                </p>
              </Link>

              <Link
                to="/pricing"
                className="block p-4 border-2 border-slate-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb size={20} className="text-amber-600" />
                  <span className="font-semibold text-slate-900 group-hover:text-amber-600">
                    View Pricing
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Explore our trademark services and pricing
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
