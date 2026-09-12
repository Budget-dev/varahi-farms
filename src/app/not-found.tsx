import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-5xl mb-4">🍃</div>
      <h2 className="font-headline text-3xl font-extrabold text-primary mb-2">Page Not Found</h2>
      <p className="text-[#7A6848] text-sm mb-6 max-w-md">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-md"
      >
        Return Home
      </Link>
    </div>
  );
}
