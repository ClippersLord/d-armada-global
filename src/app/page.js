import Link from 'next/link';
import { Button, Stat } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[.03]" style={{
        backgroundImage: 'linear-gradient(#20B2AA 1px,transparent 1px),linear-gradient(90deg,#20B2AA 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full" style={{
        background: 'radial-gradient(circle,rgba(32,178,170,0.05) 0%,transparent 55%)',
      }} />

      <div className="text-center relative z-10 max-w-3xl px-6">
        <h1 className="font-sora text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-bright leading-tight mb-5">
          Navigating Markets<br /><span className="text-brand">With Precision</span>
        </h1>
        <p className="text-text-secondary text-base font-light leading-relaxed max-w-md mx-auto mb-10">
          Institutional-grade research. Battle-tested algorithms. Education that transforms retail traders into systematic operators.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/research">
            <Button primary>Explore Research</Button>
          </Link>
          <Link href="/shop">
            <Button>View EAs</Button>
          </Link>
        </div>

        <div className="flex justify-center gap-12 md:gap-16 mt-16 flex-wrap">
          <Stat value="52+" label="Weekly Briefs" />
          <Stat value="3" label="Production EAs" />
          <Stat value="500+" label="Trades Logged" />
          <Stat value="24/7" label="Algo Coverage" />
        </div>
      </div>
    </div>
  );
}
