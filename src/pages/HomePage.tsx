import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import heroImg from '../assets/logo.svg';
import { Zap, ShieldCheck, Package } from 'lucide-react';

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section id="center" className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
        <div className="hero relative mb-12">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <img src={heroImg} className="relative base w-48 h-auto drop-shadow-2xl" alt="" />
          <img src={reactLogo} className="framework absolute -top-6 -right-6 w-14 h-14 animate-spin-slow" alt="React logo" />
          <img src={viteLogo} className="vite absolute -bottom-6 -left-6 w-14 h-14" alt="Vite logo" />
        </div>

        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-6xl font-heading mb-6 tracking-tighter leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Get started Onpkg <br /> Vite+React
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">
            The ultimate developer setup with
            <span className="text-primary font-semibold"> Tailwind v4, Zustand, Zod, </span> and
            <span className="text-primary font-semibold"> React Query</span>.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            className="group relative bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            onClick={() => setCount((c) => c + 1)}
          >
            Count is {count}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all" />
          </button>
          <p className="text-sm text-muted-foreground">
            Edit <code className="bg-muted px-1.5 py-0.5 rounded font-mono">src/pages/HomePage.tsx</code> to test HMR
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />

      <section id="features" className="p-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <FeatureCard
          title="Fast Refresh"
          desc="Lightning fast HMR provided by Vite 8 for an ultra-smooth dev experience."
          icon={<Zap className="w-8 h-8 text-yellow-500" />}
        />
        <FeatureCard
          title="Type Safe"
          desc="Zod and TypeScript integration ensures your data is always valid."
          icon={<ShieldCheck className="w-8 h-8 text-blue-500" />}
        />
        <FeatureCard
          title="State Master"
          desc="Global state management simplified with Zustand stores."
          icon={<Package className="w-8 h-8 text-purple-500" />}
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="p-8 rounded-3xl border bg-card/50 backdrop-blur-sm text-card-foreground hover:border-primary/50 transition-colors group cursor-default">
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

