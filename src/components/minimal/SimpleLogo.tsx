'use client';

import Link from 'next/link';
import React from 'react';

export default function SimpleLogo({ 
  className = '', 
  linkWrapper = true
}) {
  const logoContent = (
    <div className={`relative ${className}`}>
      <svg 
        width="160" 
        height="48" 
        viewBox="0 0 160 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* R */}
        <path
          d="M20 8H40C42.2 8 44 9.8 44 12V16C44 18.2 42.2 20 40 20H36L44 40H36L28 20H28V40H20V8Z"
          fill="#CB5CE8"
        />
        {/* I */}
        <path
          d="M52 8H60V40H52V8Z"
          fill="#CB5CE8"
        />
        {/* X */}
        <path
          d="M68 8H76L84 20L92 8H100L88 24L100 40H92L84 28L76 40H68L80 24L68 8Z"
          fill="#FF3A5F"
        />
      </svg>
    </div>
  );

  if (linkWrapper) {
    return (
      <Link href='/dashboard' className="block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
} 