"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tools = [
  { label: "ROI Calculator", href: "/roi-calculator" },
  { label: "Breakeven", href: "/breakeven-calculator" },
  { label: "Sharpe Ratio", href: "/sharpe-ratio" },
  { label: "Sortino Ratio", href: "/sortino-ratio" },
  { label: "Greeks", href: "/greeks-calculator" },
  { label: "Margin Calculator", href: "/margin-calculator" },
  { label: "IV Calculator", href: "/implied-volatility" },
  { label: "Max Pain", href: "/max-pain-calculator" },
];

export default function ToolNavBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Options tools navigation" className="flex flex-wrap justify-center gap-4 py-4 mb-8 w-full max-w-4xl">
      {tools.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
            pathname === href
              ? "bg-teal-500 text-white shadow-lg scale-105"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
