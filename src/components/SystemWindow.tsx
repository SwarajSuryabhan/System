import React, { ReactNode } from 'react';

interface SystemWindowProps {
  title?: string;
  subtitle?: string;
  variant?: 'blue' | 'crimson' | 'gold';
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SystemWindow: React.FC<SystemWindowProps> = ({
  title,
  subtitle,
  variant = 'blue',
  badge,
  children,
  className = '',
}) => {
  const borderColors = {
    blue: 'border-cyan-500/40 hover:border-cyan-400/60 box-glow-blue',
    crimson: 'border-rose-500/50 hover:border-rose-400/70 box-glow-red',
    gold: 'border-amber-500/50 hover:border-amber-400/70 box-glow-gold',
  };

  const headerColors = {
    blue: 'text-cyan-400 border-cyan-500/30',
    crimson: 'text-rose-400 border-rose-500/40',
    gold: 'text-amber-400 border-amber-500/40',
  };

  const cornerColors = {
    blue: '#00f0ff',
    crimson: '#ff0055',
    gold: '#fbbf24',
  };

  return (
    <div
      className={`relative rounded-sm bg-system-panel backdrop-blur-md border ${borderColors[variant]} p-4 sm:p-5 transition-all duration-300 ${className}`}
    >
      {/* Precision Tech Corner Brackets */}
      <span
        className="absolute -top-[2px] -left-[2px] w-3 h-3 pointer-events-none"
        style={{ borderTop: `2px solid ${cornerColors[variant]}`, borderLeft: `2px solid ${cornerColors[variant]}` }}
      />
      <span
        className="absolute -top-[2px] -right-[2px] w-3 h-3 pointer-events-none"
        style={{ borderTop: `2px solid ${cornerColors[variant]}`, borderRight: `2px solid ${cornerColors[variant]}` }}
      />
      <span
        className="absolute -bottom-[2px] -left-[2px] w-3 h-3 pointer-events-none"
        style={{ borderBottom: `2px solid ${cornerColors[variant]}`, borderLeft: `2px solid ${cornerColors[variant]}` }}
      />
      <span
        className="absolute -bottom-[2px] -right-[2px] w-3 h-3 pointer-events-none"
        style={{ borderBottom: `2px solid ${cornerColors[variant]}`, borderRight: `2px solid ${cornerColors[variant]}` }}
      />

      {/* Header Bar */}
      {(title || badge) && (
        <div className={`flex items-center justify-between pb-3 mb-4 border-b ${headerColors[variant]}`}>
          <div>
            {title && (
              <h3 className="font-heading text-sm sm:text-base font-bold tracking-wider flex items-center gap-2">
                <span className="text-xs opacity-75">[SYSTEM]</span>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">{subtitle}</p>
            )}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
