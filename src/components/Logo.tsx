export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <img
      src="https://i.imgur.com/vbbU1oG.png"
      alt="Marq Legal Logo"
      className={`${sizes[size]} w-auto`}
    />
  );
}
