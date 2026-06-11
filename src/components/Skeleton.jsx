import React from 'react'

/**
 * SkeletonLoader Component
 * Menampilkan placeholder animasi saat data sedang dimuat
 * Mengurangi Cumulative Layout Shift dengan reserve space
 */

export function SkeletonCard() {
  return (
    <div className="card w-100 shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div
        style={{
          width: '100%',
          height: 200,
          backgroundColor: '#e9ecef',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
      <div className="card-body d-flex flex-column p-4">
        <div
          style={{
            height: 20,
            backgroundColor: '#e9ecef',
            borderRadius: 4,
            marginBottom: 12,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <div
          style={{
            height: 60,
            backgroundColor: '#e9ecef',
            borderRadius: 4,
            marginBottom: 16,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <div
          style={{
            height: 40,
            backgroundColor: '#27ae60',
            borderRadius: 4,
            marginTop: 'auto',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}

export function SkeletonImage({ width = '100%', height = 200 }) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        animation: 'pulse 1.5s ease-in-out infinite'
      }}
    />
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 16,
            backgroundColor: '#e9ecef',
            borderRadius: 4,
            marginBottom: 8,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      ))}
    </div>
  )
}

// Global CSS untuk animasi pulse
export const skeletonStyles = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`
