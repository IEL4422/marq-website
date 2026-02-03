import { useRef, useState, useEffect } from 'react';
import { Pencil, Type, Trash2 } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (signature: string, type: 'drawn' | 'typed') => void;
}

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSignature(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    onSignatureChange(signatureData, 'drawn');
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setTypedSignature('');
    onSignatureChange('', 'drawn');
  };

  const handleTypedSignatureChange = (value: string) => {
    setTypedSignature(value);
    setHasSignature(value.length > 0);
    onSignatureChange(value, 'typed');
  };

  const switchMode = (mode: 'draw' | 'type') => {
    clearSignature();
    setSignatureMode(mode);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchMode('draw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            signatureMode === 'draw'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Pencil size={18} />
          Draw Signature
        </button>
        <button
          type="button"
          onClick={() => switchMode('type')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            signatureMode === 'type'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Type size={18} />
          Type Signature
        </button>
      </div>

      {signatureMode === 'draw' ? (
        <div className="space-y-2">
          <div className="relative border-2 border-slate-300 rounded-lg bg-white overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="w-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="absolute bottom-2 left-4 text-sm text-slate-400 pointer-events-none">
              Sign here
            </div>
          </div>
          {hasSignature && (
            <button
              type="button"
              onClick={clearSignature}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Clear Signature
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={typedSignature}
            onChange={(e) => handleTypedSignatureChange(e.target.value)}
            placeholder="Type your full name"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-2xl font-serif italic"
            style={{ fontFamily: 'Brush Script MT, cursive' }}
          />
          {hasSignature && (
            <button
              type="button"
              onClick={clearSignature}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Clear Signature
            </button>
          )}
        </div>
      )}
    </div>
  );
}
