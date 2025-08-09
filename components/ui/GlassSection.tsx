import { ReactNode } from 'react';

export default function GlassSection({
  title,
  subtitle,
  right,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="relative rounded-2xl border border-violet-700/40 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <div className="flex items-center justify-between px-5 sm:px-6 pt-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cyan-300">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-300">{subtitle}</p>
          ) : null}
        </div>
        {right}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}