"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";

export interface ToolItem {
  label: string;
  href: string;
}

const DEFAULT_TOOLS: ToolItem[] = [
  { label: "ROI Calculator", href: "/roi-calculator" },
  { label: "Breakeven", href: "/breakeven-calculator" },
  { label: "Sharpe Ratio", href: "/sharpe-ratio" },
  { label: "Sortino Ratio", href: "/sortino-ratio" },
  { label: "Greeks", href: "/greeks-calculator" },
  { label: "Margin Calculator", href: "/margin-calculator" },
  { label: "Daily Theta", href: "/daily-theta-calculator" },
  { label: "IV Calculator", href: "/implied-volatility" },
  { label: "Max Pain", href: "/max-pain-calculator" },
  { label: "After-Tax Return", href: "/after-tax-calculator" },
];

const STORAGE_KEY = "tradetoolshub_nav_order";

export default function ToolNavBar() {
  const pathname = usePathname();
  const [toolList, setToolList] = useState<ToolItem[]>(DEFAULT_TOOLS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hasCustomOrder, setHasCustomOrder] = useState<boolean>(false);
  const dragItemIndexRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Load saved order from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const order: string[] = JSON.parse(saved);
        if (Array.isArray(order) && order.length > 0) {
          const map = new Map(DEFAULT_TOOLS.map((t) => [t.href, t]));
          const reordered: ToolItem[] = [];

          for (const href of order) {
            const item = map.get(href);
            if (item) {
              reordered.push(item);
              map.delete(href);
            }
          }
          // Append any newly added tools not present in saved order
          map.forEach((item) => reordered.push(item));

          setToolList(reordered);
          setHasCustomOrder(true);
        }
      }
    } catch (e) {
      console.error("Failed to load nav order:", e);
    }
  }, []);

  const saveOrder = (newList: ToolItem[]) => {
    setHasCustomOrder(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList.map((t) => t.href)));
    } catch (e) {
      console.error("Failed to save nav order:", e);
    }
  };

  const handleResetOrder = () => {
    setToolList(DEFAULT_TOOLS);
    setHasCustomOrder(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to reset nav order:", e);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    isDraggingRef.current = true;
    dragItemIndexRef.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  // Reorganizes in real time as the mouse drags across other buttons
  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const currentIndex = dragItemIndexRef.current;
    if (currentIndex === null || currentIndex === targetIndex) return;

    setToolList((prevList) => {
      const updated = [...prevList];
      const [movedItem] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, movedItem);
      saveOrder(updated);
      return updated;
    });

    dragItemIndexRef.current = targetIndex;
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragItemIndexRef.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mb-8">
      <nav
        aria-label="Options tools navigation"
        className="flex flex-wrap justify-center gap-3 md:gap-4 py-2 w-full select-none"
      >
        {toolList.map(({ label, href }, index) => {
          const isActive = pathname === href;
          const isBeingDragged = draggedIndex === index;

          return (
            <div
              key={href}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`transition-all duration-300 ease-out cursor-grab active:cursor-grabbing rounded-lg ${
                isBeingDragged
                  ? "opacity-40 scale-95 ring-2 ring-teal-400 ring-dashed"
                  : "hover:scale-[1.03]"
              }`}
            >
              <Link
                href={href}
                onClick={handleClick}
                draggable={false}
                className={`py-2 px-5 md:px-6 rounded-lg font-semibold inline-block transition-colors duration-200 ${
                  draggedIndex !== null ? "pointer-events-none" : ""
                } ${
                  isActive
                    ? "bg-teal-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                }`}
                title="Click to open or drag to reorganize"
              >
                {label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Subtle indicator & Reset option */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
        <span className="text-[11px] text-gray-500">
          Tip: Click and hold any button to drag and reorganize
        </span>
        {hasCustomOrder && (
          <button
            type="button"
            onClick={handleResetOrder}
            className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 hover:underline transition"
            title="Reset buttons to default order"
          >
            <RotateCcw size={11} />
            <span>Reset order</span>
          </button>
        )}
      </div>
    </div>
  );
}
