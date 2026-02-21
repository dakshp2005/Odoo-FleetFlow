'use client'

import { useState, useEffect } from 'react'

export function PixelCanvas() {
  return (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
      <canvas id="pixelCanvas" className="w-full h-full" />
    </div>
  )
}

export function TextShimmer({ text }: { text: string }) {
  return (
    <span className="inline-block animate-shimmer bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 bg-[length:200%_100%] bg-clip-text text-transparent">
      {text}
    </span>
  )
}
