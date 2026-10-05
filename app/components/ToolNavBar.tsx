"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

interface FloatingDragState {
  label: string;
  href: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isActive: boolean;
}

export default function ToolNavBar() {
  const pathname = usePathname();
  const [toolList, setToolList] = useState<ToolItem[]>(DEFAULT_TOOLS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [floatingDrag, setFloatingDrag] = useState<FloatingDragState | null>(null);
  const [hasCustomOrder, setHasCustomOrder] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const latestToolListRef = useRef<ToolItem[]>(toolList);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    latestToolListRef.current = toolList;
  }, [toolList]);

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
          latestToolListRef.current = reordered;
          setHasCustomOrder(true);
        }
      }
    } catch (e) {
      console.error("Failed to load nav order:", e);
    }
  }, []);

  // FLIP animation for real-time smooth sliding
  useEffect(() => {
    if (prevRectsRef.current.size === 0) return;

    itemRefs.current.forEach((el, key) => {
      if (!el) return;
      const prev = prevRectsRef.current.get(key);
      if (!prev) return;

      const current = el.getBoundingClientRect();
      const dx = prev.left - current.left;
      const dy = prev.top - current.top;

      if (dx !== 0 || dy !== 0) {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = "none";
        // Force reflow to commit initial inverted state
        void el.offsetHeight;
        el.style.transition = "transform 220ms cubic-bezier(0.2, 0, 0, 1)";
        el.style.transform = "";
      }
    });

    prevRectsRef.current.clear();
  }, [toolList]);

  const recordRects = () => {
    const rects = new Map<string, DOMRect>();
    itemRefs.current.forEach((el, key) => {
      if (el) {
        rects.set(key, el.getBoundingClientRect());
      }
    });
    prevRectsRef.current = rects;
  };

  const saveOrder = (newList: ToolItem[]) => {
    setHasCustomOrder(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList.map((t) => t.href)));
    } catch (e) {
      console.error("Failed to save nav order:", e);
    }
  };

  const handleResetOrder = () => {
    recordRects();
    setToolList(DEFAULT_TOOLS);
    latestToolListRef.current = DEFAULT_TOOLS;
    setHasCustomOrder(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to reset nav order:", e);
    }
  };

  // Find which button slot the cursor is hovering over
  const findTargetIndex = (clientX: number, clientY: number): number | null => {
    const currentList = latestToolListRef.current;
    let candidateIndex: number | null = null;
    let minDistance = Infinity;

    for (let i = 0; i < currentList.length; i++) {
      const item = currentList[i];
      const el = itemRefs.current.get(item.href);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      // Expand hit area by 10px to bridge the flex gap
      const hitPadding = 10;
      const isDirectHit =
        clientX >= rect.left - hitPadding &&
        clientX <= rect.right + hitPadding &&
        clientY >= rect.top - hitPadding &&
        clientY <= rect.bottom + hitPadding;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);

      if (isDirectHit) {
        if (dist < minDistance) {
          minDistance = dist;
          candidateIndex = i;
        }
      }
    }

    if (candidateIndex !== null) return candidateIndex;

    // Fallback: closest button if within 80px (e.g. dragging across rows)
    let closestIdx: number | null = null;
    let closestDist = Infinity;
    for (let i = 0; i < currentList.length; i++) {
      const item = currentList[i];
      const el = itemRefs.current.get(item.href);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    if (closestIdx !== null && closestDist < 80) {
      return closestIdx;
    }

    return null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, index: number) => {
    // Only primary mouse button (or touch)
    if (e.button !== 0) return;

    const currentTool = latestToolListRef.current[index];
    if (!currentTool) return;

    const targetEl = itemRefs.current.get(currentTool.href);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;
    const width = rect.width;
    const height = rect.height;

    let isDragging = false;
    let currentIndex = index;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);

      if (!isDragging) {
        if (dist > 5) {
          isDragging = true;
          wasDraggedRef.current = true;
          document.body.style.userSelect = "none";
          document.body.style.cursor = "grabbing";
          setDraggedIndex(currentIndex);
          setFloatingDrag({
            label: currentTool.label,
            href: currentTool.href,
            width,
            height,
            x: moveEvent.clientX - offsetX,
            y: moveEvent.clientY - offsetY,
            isActive: pathname === currentTool.href,
          });
        } else {
          return;
        }
      }

      // Update floating button position
      setFloatingDrag({
        label: currentTool.label,
        href: currentTool.href,
        width,
        height,
        x: moveEvent.clientX - offsetX,
        y: moveEvent.clientY - offsetY,
        isActive: pathname === currentTool.href,
      });

      // Real-time reorder detection
      const targetIndex = findTargetIndex(moveEvent.clientX, moveEvent.clientY);
      if (targetIndex !== null && targetIndex !== currentIndex) {
        recordRects();

        setToolList((prevList) => {
          const updated = [...prevList];
          const [moved] = updated.splice(currentIndex, 1);
          updated.splice(targetIndex, 0, moved);
          latestToolListRef.current = updated;
          return updated;
        });

        currentIndex = targetIndex;
        setDraggedIndex(targetIndex);
      }
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      if (isDragging) {
        saveOrder(latestToolListRef.current);
        // Suppress any follow-up click event
        setTimeout(() => {
          wasDraggedRef.current = false;
        }, 150);
      } else {
        wasDraggedRef.current = false;
      }

      setFloatingDrag(null);
      setDraggedIndex(null);
    };

    const handlePointerUp = () => {
      cleanup();
    };

    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        cleanup();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("keydown", handleKeyDown);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (wasDraggedRef.current) {
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
              ref={(el) => {
                if (el) {
                  itemRefs.current.set(href, el);
                } else {
                  itemRefs.current.delete(href);
                }
              }}
              onPointerDown={(e) => handlePointerDown(e, index)}
              className={`rounded-lg touch-none select-none ${
                isBeingDragged
                  ? "opacity-25 border-2 border-dashed border-teal-400 bg-teal-500/10 scale-95"
                  : "cursor-grab active:cursor-grabbing hover:scale-[1.03] transition-transform duration-150"
              }`}
            >
              <Link
                href={href}
                onClick={handleClick}
                draggable={false}
                className={`py-2 px-5 md:px-6 rounded-lg font-semibold inline-block transition-colors duration-200 ${
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

      {/* Floating Drag Overlay (Portal to document.body) */}
      {mounted &&
        floatingDrag &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: `${floatingDrag.x}px`,
              top: `${floatingDrag.y}px`,
              width: `${floatingDrag.width}px`,
              height: `${floatingDrag.height}px`,
              pointerEvents: "none",
              zIndex: 99999,
            }}
            className="select-none will-change-transform"
          >
            <div
              className={`py-2 px-5 md:px-6 rounded-lg font-semibold text-center shadow-2xl scale-105 ring-2 ring-teal-400 shadow-teal-500/30 ${
                floatingDrag.isActive
                  ? "bg-teal-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {floatingDrag.label}
            </div>
          </div>,
          document.body
        )}

      {/* Indicator & Reset Option */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
        <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Click and drag any button to reorganize the navigation bar
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

