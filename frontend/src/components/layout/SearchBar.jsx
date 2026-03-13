// components/layout/SearchBar.jsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/utils/currency';
import { ROUTES } from '@/constants/routes';

// ─── Constants ────────────────────────────────────────────────────────────────
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 300;

// ─── SearchBar Component ───────────────────────────────────────────────────────
export default function SearchBar({ className = '' }) {
  const router = useRouter();

  // ── State ──
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState(null);

  // ── Refs ──
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  // ── Fetch autocomplete results ──
  const fetchResults = useCallback(async (q) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!q || q.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      // GET /products/search?q=...
      console.log('OKO ');
      const data = await productService.searchProducts(q, {
        signal: abortControllerRef.current.signal,
      });

      console.log('ok', q);
      console.log(data);
      setResults(data || []);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (err) {
      if (err.name === 'AbortError') return; // Request was cancelled
      setError('Không thể tải kết quả. Vui lòng thử lại.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Effect: trigger fetch when debounced query changes ──
  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  // ── Effect: close dropdown on outside click ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Handlers ──
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          navigateToProduct(results[activeIndex].product_id);
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

  const navigateToProduct = (productId) => {
    setIsOpen(false);
    setQuery('');
    router.push(`${ROUTES.PRODUCTS}/${productId}`);
  };

  const handleFullSearch = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    console.log('handlefullsearch');
    router.push(
      `${ROUTES.PRODUCTS}?search=${encodeURIComponent(query.trim())}`,
    );
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showDropdown = isOpen && (isLoading || results.length > 0 || error);

  return (
    <div className={`search-bar ${className}`} role="search">
      {/* ── Input wrapper ── */}
      <div className="search-input-wrapper">
        {/* Search icon */}
        <span className="search-icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
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
          <span className="search-spinner" aria-label="Đang tải">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
        ) : query ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Xóa tìm kiếm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="search-dropdown"
          className="search-dropdown"
          role="listbox"
          aria-label="Kết quả tìm kiếm"
        >
          {/* Error state */}
          {error && (
            <div className="search-message search-message--error">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && !error && (
            <div className="search-skeletons">
              {[1, 2, 3].map((i) => (
                <div key={i} className="search-skeleton-item">
                  <div className="search-skeleton-img" />
                  <div className="search-skeleton-text">
                    <div className="search-skeleton-line search-skeleton-line--long" />
                    <div className="search-skeleton-line search-skeleton-line--short" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && results.length > 0 && (
            <>
              <ul className="search-results-list" role="presentation">
                {results.map((item, index) => (
                  <li
                    key={item.product_id}
                    id={`result-${index}`}
                    className={`search-result-item ${index === activeIndex ? 'search-result-item--active' : ''}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    // onClick={() => navigateToProduct(item.product_id)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {/* Thumbnail */}
                    <div className="search-result-img">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.product_name}
                          width={44}
                          height={44}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="search-result-img-placeholder">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <span className="search-result-name">
                      <HighlightMatch text={item.product_name} query={query} />
                    </span>

                    {/* Arrow */}
                    <svg
                      className="search-result-arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </li>
                ))}
              </ul>

              {/* View all link */}
              <button
                type="button"
                className="search-view-all"
                onClick={handleFullSearch}
              >
                Xem tất cả kết quả cho &ldquo;{query}&rdquo;
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Empty state */}
          {!isLoading &&
            !error &&
            results.length === 0 &&
            query.length >= MIN_QUERY_LENGTH && (
              <div className="search-message search-message--empty">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <path d="M8 11h6m-3-3v6" />
                </svg>
                <p>
                  Không tìm thấy &ldquo;<strong>{query}</strong>&rdquo;
                </p>
              </div>
            )}
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
}

// ─── HighlightMatch: bold matching text ────────────────────────────────────────
function HighlightMatch({ text, query }) {
  if (!query) return <>{text}</>;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="search-highlight">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&display=swap');

  .search-bar {
    position: relative;
    width: 100%;
    max-width: 480px;
    font-family: 'Be Vietnam Pro', sans-serif;
  }

  /* Input wrapper */
  .search-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f5f4f0;
    border: 1.5px solid transparent;
    border-radius: 12px;
    padding: 0 12px;
    height: 44px;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .search-input-wrapper:focus-within {
    background: #fff;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26,26,26,0.08);
  }

  .search-icon {
    color: #888;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .search-input-wrapper:focus-within .search-icon {
    color: #1a1a1a;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    font-family: inherit;
    color: #1a1a1a;
    min-width: 0;
  }

  .search-input::placeholder {
    color: #aaa;
  }

  /* Chrome: hide default search clear */
  .search-input::-webkit-search-cancel-button { display: none; }

  /* Spinner */
  .search-spinner svg {
    animation: spin 0.75s linear infinite;
    color: #888;
    display: block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Clear button */
  .search-clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0ddd8;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #555;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
    padding: 0;
  }

  .search-clear-btn:hover {
    background: #ccc;
    color: #111;
  }

  /* Dropdown */
  .search-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1.5px solid #e8e6e1;
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
    overflow: hidden;
    z-index: 1000;
    animation: dropdownIn 0.18s ease;
  }

  @keyframes dropdownIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Skeleton */
  .search-skeletons {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .search-skeleton-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 8px;
  }

  .search-skeleton-img {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0ede8 25%, #e4e0d9 50%, #f0ede8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    flex-shrink: 0;
  }

  .search-skeleton-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .search-skeleton-line {
    height: 10px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0ede8 25%, #e4e0d9 50%, #f0ede8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
  }

  .search-skeleton-line--long  { width: 75%; }
  .search-skeleton-line--short { width: 40%; }

  @keyframes shimmer {
    to { background-position: -200% 0; }
  }

  /* Results list */
  .search-results-list {
    list-style: none;
    margin: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.12s;
  }

  .search-result-item:hover,
  .search-result-item--active {
    background: #f5f3ef;
  }

  .search-result-img {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: #edeae4;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-result-img-placeholder {
    color: #bbb;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .search-result-name {
    flex: 1;
    font-size: 13.5px;
    color: #1a1a1a;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search-highlight {
    background: none;
    color: #1a1a1a;
    font-weight: 600;
  }

  .search-result-arrow {
    color: #bbb;
    flex-shrink: 0;
    transition: color 0.12s, transform 0.12s;
  }

  .search-result-item:hover .search-result-arrow,
  .search-result-item--active .search-result-arrow {
    color: #555;
    transform: translateX(2px);
  }

  /* View all */
  .search-view-all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 10px 16px;
    border: none;
    border-top: 1px solid #f0ede8;
    background: transparent;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    text-align: center;
  }

  .search-view-all:hover {
    background: #faf9f6;
    color: #1a1a1a;
  }

  /* Messages */
  .search-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 16px;
    text-align: center;
    font-size: 13.5px;
    color: #888;
  }

  .search-message--error {
    flex-direction: row;
    justify-content: center;
    color: #c0392b;
    padding: 14px 16px;
  }

  .search-message--empty p {
    margin: 0;
    line-height: 1.5;
  }

  .search-message--empty strong {
    color: #1a1a1a;
  }
`;
