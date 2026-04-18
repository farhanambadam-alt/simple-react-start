import { Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const APP_NAME = 'Keshzo';
const COUNTRY = 'India';

const links = [
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/refund-policy', label: 'Refund' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Global branded footer mounted once in App.tsx for customer routes.
 * Auto-hides on checkout routes (which carry their own inline compliance notice).
 */
const LegalFooter = () => {
  const { pathname } = useLocation();

  // Hide on checkout flows
  if (pathname.startsWith('/booking/') || pathname.startsWith('/at-home-booking/')) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer with legal links"
      className="relative w-full max-w-3xl mx-auto px-5 pt-6 pb-5 mt-6"
      style={{ marginBottom: 'calc(var(--bottom-nav-clearance, 0px) + 8px)' }}
    >
      {/* Hairline gradient divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, hsl(var(--border)), transparent)',
        }}
      />

      {/* Brand mark */}
      <div className="flex flex-col items-center text-center gap-1.5 mb-4">
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"
          >
            <Sparkles size={14} className="text-primary" />
          </div>
          <span className="font-heading font-semibold text-[15px] text-foreground tracking-tight">
            {APP_NAME}
          </span>
        </div>
        <p className="italic font-body text-[11.5px] text-muted-foreground">
          Grooming, reimagined.
        </p>
      </div>

      {/* Pill links */}
      <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full bg-muted/40 border border-border/50 text-foreground/80 text-[12px] font-body font-medium hover:bg-muted/60 active:scale-[0.97] transition-[background-color,transform]"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Tagline */}
      <p className="text-center text-[11px] font-body text-muted-foreground">
        Crafted with <span aria-hidden="true">❤</span> in {COUNTRY} · © {year} {APP_NAME}
      </p>
    </footer>
  );
};

export default LegalFooter;
