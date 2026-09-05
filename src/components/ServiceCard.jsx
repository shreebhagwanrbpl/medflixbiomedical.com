import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServiceCard({
  icon,
  title,
  description,
  badge,
  turnaround,
  highlights = [],
  loading = false,
  makeLink = (p) => p,
}) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-[#cdeae5] bg-white p-8 shadow-md">
        <div className="mb-6 h-14 w-14 rounded-2xl bg-[#e6f4f2]" />
        <div className="mb-4 h-7 w-3/4 rounded bg-[#d5ece8]" />
        <div className="space-y-3">
          <div className="h-4 rounded bg-[#e6f4f2]" />
          <div className="h-4 w-11/12 rounded bg-[#e6f4f2]" />
          <div className="h-4 w-8/12 rounded bg-[#e6f4f2]" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-[#cdeae5] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#0b6e69]/50 hover:shadow-2xl hover:shadow-[#0b6e69]/15">
      <div>
        {/* Top bar with Icon & Badge */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e6f4f2] to-[#edf7f6] text-[#0b6e69] transition-all duration-300 group-hover:bg-[#0b6e69] group-hover:text-white group-hover:scale-105 shadow-sm">
            {icon}
          </div>

          {badge && (
            <span className="rounded-full border border-[#0b6e69]/20 bg-[#e6f4f2] px-3 py-1 text-xs font-bold text-[#0b6e69]">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 text-2xl font-bold text-[#133835] transition-colors duration-300 group-hover:text-[#0b6e69]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base leading-relaxed text-[#496a66]">
          {description}
        </p>

        {/* Highlights List if present */}
        {highlights && highlights.length > 0 && (
          <ul className="mt-6 space-y-2.5 border-t border-[#cdeae5]/60 pt-5 text-sm text-[#496a66]">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0b6e69] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-8 flex items-center justify-between border-t border-[#cdeae5]/40 pt-4">
        {turnaround ? (
          <span className="text-xs font-semibold text-[#496a66]">
            SLA: <strong className="text-[#0b6e69]">{turnaround}</strong>
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#496a66]">Certified Quality</span>
        )}

        <Link
          href={makeLink("/contact")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b6e69] transition-all group-hover:translate-x-1 group-hover:text-[#074e49]"
        >
          <span>Book Service</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}