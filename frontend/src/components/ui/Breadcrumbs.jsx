'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Reusable Breadcrumbs component with premium responsive styling.
 * 
 * @param {{
 *   items: Array<{ label: string, href?: string }>,
 *   className?: string
 * }} props
 */
export function Breadcrumbs({ items = [], className = '', root = { label: 'Trang chủ', href: '/' } }) {
  return (
    <nav className={`flex py-2 text-gray-500 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        {/* Root Item */}
        <li className="inline-flex items-center">
          <Link
            href={root.href}
            className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors duration-150"
          >
            <Home className="mr-2 h-3.5 w-3.5" />
            {root.label}
          </Link>
        </li>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-gray-800 capitalize select-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-150 capitalize"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
