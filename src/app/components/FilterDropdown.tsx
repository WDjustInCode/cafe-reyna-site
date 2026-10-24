'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export interface FilterOption {
  value: string;
  label?: string;
}

/** Display-only: capitalize the first letter of each word. */
function titleCase(s: string) {
  return s.replace(/(^|[\s\-/(])(\p{L})/gu, (_, pre: string, ch: string) => pre + ch.toUpperCase());
}

/**
 * Site-styled, accessible replacement for a native <select>.
 * Trigger matches the filter bar buttons; the menu is a listbox popover.
 */
export function FilterDropdown({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  value: string;
  options: (string | FilterOption)[];
  onChange: (v: string) => void;
}) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [alignRight, setAlignRight] = useState(false);

  // Placeholder ("All …") is always the first option, with value ''.
  const items: { value: string; label: string }[] = [
    { value: '', label: placeholder },
    ...options.map((o) => {
      const opt = typeof o === 'string' ? { value: o } : o;
      return { value: opt.value, label: titleCase(opt.label ?? opt.value) };
    }),
  ];
  const selectedIndex = Math.max(
    0,
    items.findIndex((i) => i.value.toLowerCase() === value.toLowerCase()),
  );
  const isActive = value !== '';
  const triggerLabel = items[selectedIndex]?.label ?? placeholder;

  function openMenu(index = selectedIndex) {
    const rect = triggerRef.current?.getBoundingClientRect();
    // Flip to right-aligned when the menu would run off the right edge (mobile).
    setAlignRight(!!rect && rect.left + 224 > window.innerWidth - 8);
    setActiveIndex(index);
    setOpen(true);
  }

  function closeMenu(refocus = true) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function select(index: number) {
    const item = items[index];
    if (item && item.value !== value) onChange(item.value);
    closeMenu();
  }

  // Focus the listbox when opened; keep the active option in view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  // Close on outside click / tap.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  function onTriggerKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      if (open) closeMenu();
      else openMenu(e.key === 'ArrowUp' ? items.length - 1 : selectedIndex);
    }
  }

  function onListKeyDown(e: ReactKeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(items.length - 1, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        select(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        // Typeahead: jump to the first option starting with the typed letter.
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const k = e.key.toLowerCase();
          const start = activeIndex + 1;
          const order = [...items.slice(start), ...items.slice(0, start)];
          const hit = order.find((i) => i.label.toLowerCase().startsWith(k));
          if (hit) setActiveIndex(items.indexOf(hit));
        }
    }
  }

  const listId = `${id}-list`;

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={[
          'flex items-center gap-1.5 whitespace-nowrap rounded-md border bg-transparent px-2.5 py-1.5 text-sm transition-colors',
          'hover:border-[#6b3e26] focus:outline-none focus-visible:border-[#6b3e26] focus-visible:ring-1 focus-visible:ring-[#6b3e26]/30',
          isActive || open
            ? 'border-[#6b3e26] text-[#6b3e26]'
            : 'border-[#e3d7c5] text-[#4a4037]',
        ].join(' ')}
      >
        <span>{triggerLabel}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={placeholder}
          aria-activedescendant={`${id}-opt-${activeIndex}`}
          onKeyDown={onListKeyDown}
          className={[
            'absolute top-full z-40 mt-1.5 max-h-72 min-w-full w-max max-w-[calc(100vw-2rem)] overflow-auto',
            'rounded-lg border border-[#e3d7c5] bg-[#f8f2e8] py-1 shadow-[0_8px_24px_rgba(42,42,42,0.12)] focus:outline-none',
            alignRight ? 'right-0' : 'left-0',
          ].join(' ')}
        >
          {items.map((item, i) => {
            const selected = i === selectedIndex;
            const active = i === activeIndex;
            return (
              <li
                key={item.value || '__all'}
                id={`${id}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActiveIndex(i)}
                onClick={() => select(i)}
                className={[
                  'flex cursor-pointer items-center gap-2 whitespace-nowrap py-1.5 pl-3 pr-4 text-sm',
                  active ? 'bg-[#efe4d4]' : '',
                  selected ? 'font-medium text-[#6b3e26]' : 'text-[#4a4037]',
                  i === 0 ? 'border-b border-[#e3d7c5]/70' : '',
                ].join(' ')}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                  className={`shrink-0 ${selected ? 'opacity-100' : 'opacity-0'}`}
                >
                  <path d="M2.5 6.5l2.25 2.25L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
