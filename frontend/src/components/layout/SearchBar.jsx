// components/layout/SearchBar.jsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { productService } from '@/services/productService';
import { ROUTES } from '@/constants/routes';
import {
  Search,
  Image,
  ChevronRight,
  Loader,
  SearchX,
  Info,
  SearchAlert,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 300;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip diacritics and lowercase for accent-insensitive matching */
function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HighlightMatch({ text, query }) {
  if (!query) return <>{text}</>;

  const normalizedText = normalize(text);
  const normalizedQuery = normalize(query);
  const startIndex = normalizedText.indexOf(normalizedQuery);

  if (startIndex === -1) return <>{text}</>;

  // Use normalizedQuery.length so multi-byte/diacritic chars are sliced correctly
  const endIndex = startIndex + normalizedQuery.length;

  return (
    <>
      {text.slice(0, startIndex)}
      <mark className="text-primary bg-transparent font-semibold">
        {text.slice(startIndex, endIndex)}
      </mark>
      {text.slice(endIndex)}
    </>
  );
}

function SearchResultItem({ item, index, isActive, query, onSelect, onHover }) {
  return (
    <li
      id={`result-${index}`}
      className={[
        'group flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-100',
        isActive ? 'bg-[var(--cb-50)]' : 'hover:bg-[var(--cb-50)]',
      ].join(' ')}
      onClick={() => onSelect(item.product_id)}
      onMouseEnter={() => onHover(index)}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--cb-100)]">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.product_name}
            width={44}
            height={44}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--cb-300)]">
            <Image />
          </div>
        )}
      </div>

      <span className="text-foreground flex-1 truncate text-[13.5px] font-normal">
        <HighlightMatch text={item.product_name} query={query} />
      </span>

      <ChevronRight />
    </li>
  );
}

function SkeletonList() {
  const shimmerClass = [
    'bg-gradient-to-r from-[var(--cb-100)] via-[var(--cb-200)] to-[var(--cb-100)]',
    'bg-[length:200%_100%]',
    'animate-[shimmer_1.2s_infinite]',
  ].join(' ');

  return (
    <div className="flex flex-col gap-1 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-lg p-2">
          <div className={`h-11 w-11 shrink-0 rounded-lg ${shimmerClass}`} />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className={`h-2.5 w-3/4 rounded ${shimmerClass}`} />
            <div className={`h-2.5 w-2/5 rounded ${shimmerClass}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchBar({ className = '' }) {
  const router = useRouter();

  // ── State ──
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]); // always an array
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState(null);

  // ── Refs ──
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  // ── Data fetching ──
  const fetchResults = useCallback(async (q) => {
    abortControllerRef.current?.abort();

    if (!q || q.length < MIN_QUERY_LENGTH) {
      setItems([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const data = await productService.searchProducts(q, {
        signal: abortControllerRef.current.signal,
      });

      // Normalise: API may return { data: [...] } or a plain array
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setItems(list);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Không thể tải kết quả. Vui lòng thử lại.');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  // ── Close on outside click ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current?.contains(e.target) ||
        inputRef.current?.contains(e.target)
      )
        return;
      setIsOpen(false);
      setActiveIndex(-1);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Navigation helpers ──
  const navigateToProduct = useCallback(
    (productId) => {
      setIsOpen(false);
      setQuery('');
      router.push(`${ROUTES.PRODUCTS}/${productId}`);
    },
    [router],
  );

  const handleFullSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(trimmed)}`);
  }, [query, router]);

  // ── Input handlers ──
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      setItems([]);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          navigateToProduct(items[activeIndex].product_id);
        } else {
          handleFullSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setItems([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // ── Derived state ──
  // const showDropdown = isOpen && (isLoading || items.length > 0 || !!error);
  const showDropdown = isOpen;
  const showEmpty =
    !isLoading &&
    !error &&
    items.length == 0 &&
    query.length >= MIN_QUERY_LENGTH;

  return (
    <div className={`relative w-full max-w-[480px] ${className}`} role="search">
      {/* ── Input wrapper ── */}
      <div
        className={[
          'flex h-11 items-center gap-2 rounded-lg border-[1.5px] px-3 transition-[border-color,background,box-shadow] duration-200',
          // 'border-transparent bg-[var(--cb-50)]',
          'bg-background',
          'focus-within:bg-surface focus-within:border-transparent focus-within:shadow-[0_0_0_3px_var(--cb-200)]',
        ].join(' ')}
      >
        {/* Search icon — color shifts on focus-within via parent class */}
        <span
          className="[.search-wrapper:focus-within_&]:text-foreground flex shrink-0 items-center text-[var(--icon-muted)] transition-colors duration-200"
          aria-hidden="true"
        >
          <Search />
        </span>

        <input
          ref={inputRef}
          type="search"
          className={[
            'min-w-0 flex-1 border-none bg-transparent outline-none',
            'text-foreground text-base placeholder:text-[var(--placeholder)]',
            '[&::-webkit-search-cancel-button]:hidden',
          ].join(' ')}
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (items.length > 0) setIsOpen(true);
          }}
          aria-label="Tìm kiếm sản phẩm"
          aria-autocomplete="list"
          aria-controls="search-dropdown"
          aria-expanded={showDropdown}
          aria-activedescendant={
            activeIndex >= 0 ? `result-${activeIndex}` : undefined
          }
          autoComplete="off"
        />

        {/* Loading spinner / Clear button */}
        {isLoading ? (
          <span
            className="flex animate-spin items-center text-[var(--icon-muted)]"
            aria-label="Đang tải"
          >
            <Loader />
          </span>
        ) : query ? (
          <button
            type="button"
            className={[
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0',
              'cursor-pointer border-none bg-[var(--cb-200)] text-[var(--text-muted)]',
              'transition-[background,color] duration-150',
              'hover:text-foreground hover:bg-[var(--cb-300)]',
            ].join(' ')}
            onClick={handleClear}
            aria-label="Xóa tìm kiếm"
          >
            <SearchX />
          </button>
        ) : null}
      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="search-dropdown"
          className={[
            'absolute top-[calc(100%+6px)] right-0 left-0 z-[1000]',

            'overflow-hidden rounded-[14px] border-[1.5px] border-[var(--card-border)] bg-[var(--surface)]',

            'shadow-[var(--elevated-shadow)]',

            'animate-[dropdownIn_0.18s_ease]',
          ].join(' ')}
          role="listbox"
          aria-label="Kết quả tìm kiếm"
        >
          {/* Error */}

          {error && (
            <div className="flex flex-row items-center justify-center gap-2 px-4 py-3.5 text-[13.5px] text-[var(--error)]">
              <Info />

              {error}
            </div>
          )}

          {/* Loading skeleton */}

          {isLoading && !error && <SkeletonList />}

          {/* Results */}

          {!isLoading && !error && items.length > 0 && (
            <>
              <ul
                className="m-0 flex list-none flex-col gap-0.5 p-2"
                role="presentation"
              >
                {items.map((item, index) => (
                  <SearchResultItem
                    key={item.product_id}
                    item={item}
                    index={index}
                    isActive={index === activeIndex}
                    query={query}
                    onSelect={navigateToProduct}
                    onHover={setActiveIndex}
                  />
                ))}
              </ul>

              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  'flex w-full items-center justify-center py-6',

                  'text-text-muted text-base font-medium',
                )}
                onClick={handleFullSearch}
              >
                Xem tất cả kết quả cho &ldquo;{query}&rdquo;
                <Search />
              </Button>
            </>
          )}

          {/* Empty state */}

          {showEmpty && (
            <div className="text-text-muted flex flex-col items-center gap-2 px-4 py-5 text-center text-base font-medium">
              <SearchAlert />

              <p className="m-0 leading-relaxed">
                Không tìm thấy kết quả cho &ldquo;
                <strong className="text-text-muted">{query}</strong>&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/*
        Two keyframes that Tailwind v4 cannot express as inline utilities.
        These are the only remaining <style> lines — everything visual is in className above.
      */}
      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          to { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
