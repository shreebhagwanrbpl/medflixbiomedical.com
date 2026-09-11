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
    <div
      className="
        group relative flex flex-col justify-between
        rounded-3xl
        border border-[#cdeae5]
        bg-white
        p-8
        shadow-md
        transition-all duration-300 ease-out
        hover:-translate-y-2
        hover:border-[#0b6e69]/50
        hover:shadow-2xl
        hover:shadow-[#0b6e69]/15
      "
    >
      <div>
        {/* =========================
            TOP BAR - ICON + BADGE
        ========================== */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Icon */}
          <div
            className="
              flex h-14 w-14 shrink-0
              items-center justify-center
              rounded-2xl
              bg-gradient-to-br from-[#e6f4f2] to-[#edf7f6]
              text-[#0b6e69]
              shadow-sm

              /* IMPORTANT:
                 Remove gradient on hover */
              transition-all duration-300 ease-out
              group-hover:bg-none
              group-hover:bg-[#0b6e69]
              group-hover:text-white
              group-hover:scale-105
              group-hover:shadow-md
            "
          >
            {icon}
          </div>

          {/* Badge */}
          {badge && (
            <span
              className="
                rounded-full
                border border-[#0b6e69]/20
                bg-[#e6f4f2]
                px-3 py-1
                text-xs font-bold
                text-[#0b6e69]
                transition-all duration-300
                group-hover:border-[#0b6e69]/30
                group-hover:bg-[#e6f4f2]
              "
            >
              {badge}
            </span>
          )}
        </div>

        {/* =========================
            TITLE
        ========================== */}
        <h3
          className="
            mb-3
            text-2xl font-bold
            text-[#133835]
            transition-colors duration-300
            group-hover:text-[#0b6e69]
          "
        >
          {title}
        </h3>

        {/* =========================
            DESCRIPTION
        ========================== */}
        <p
          className="
            text-sm sm:text-base
            leading-relaxed
            text-[#496a66]
          "
        >
          {description}
        </p>

        {/* =========================
            HIGHLIGHTS
        ========================== */}
        {highlights && highlights.length > 0 && (
          <ul
            className="
              mt-6
              space-y-2.5
              border-t border-[#cdeae5]/60
              pt-5
              text-sm
              text-[#496a66]
            "
          >
            {highlights.map((item, idx) => (
              <li
                key={idx}
                className="
                  flex items-center gap-2
                  transition-colors duration-300
                  group-hover:text-[#355f5b]
                "
              >
                <CheckCircle2
                  size={16}
                  strokeWidth={2}
                  className="
                    shrink-0
                    text-[#0b6e69]
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />

                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* =========================
          FOOTER
      ========================== */}
      <div
        className="
          mt-8
          flex items-center justify-between
          border-t border-[#cdeae5]/40
          pt-4
        "
      >
        {/* SLA */}
        {turnaround ? (
          <span className="text-xs font-semibold text-[#496a66]">
            SLA:{" "}
            <strong className="text-[#0b6e69]">
              {turnaround}
            </strong>
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#496a66]">
            Certified Quality
          </span>
        )}

        {/* Book Service */}
        <Link
          href={makeLink("/contact")}
          className="
            inline-flex items-center gap-1.5
            text-sm font-bold
            text-[#0b6e69]
            transition-all duration-300
            group-hover:translate-x-1
            group-hover:text-[#074e49]
          "
        >
          <span>Book Service</span>

          <ArrowRight
            size={16}
            className="transition-transform duration-300"
          />
        </Link>
      </div>
    </div>
  );
}