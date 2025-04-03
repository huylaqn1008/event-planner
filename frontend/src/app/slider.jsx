'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Clear from '../assets/images/Clear.png'
import Diana from '../assets/images/Diana.png'
import Carlsberg from '../assets/images/Carlsberg.png'
import Uniben from '../assets/images/Uniben.png'
import Dove from '../assets/images/Dove.png'
import PS from '../assets/images/PS.png'
import Nestle from '../assets/images/Nestle.png'

const CircleSlider = () => {
  const [continuousOffset, setContinuousOffset] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const animationRef = useRef()
  const animationSpeed = 50
  const itemSpacing = 220
  const visibleItems = 5

  const originalItems = useMemo(() => [
    { id: 1, imageUrl: Clear.src, altText: 'Clear' },
    { id: 2, imageUrl: Diana.src, altText: 'Diana' },
    { id: 3, imageUrl: Carlsberg.src, altText: 'Carlsberg' },
    { id: 4, imageUrl: Uniben.src, altText: 'Uniben' },
    { id: 5, imageUrl: Dove.src, altText: 'Dove' },
    { id: 6, imageUrl: PS.src, altText: 'PS' },
    { id: 7, imageUrl: Nestle.src, altText: 'Nestle' },
  ], [])

  // Tạo buffer items với kỹ thuật wrap-around
  const items = useMemo(() => {
    return [...originalItems, ...originalItems, ...originalItems]
  }, [originalItems])

  const animate = (time) => {
    if (!animationRef.current.lastTime) {
      animationRef.current.lastTime = time
    }

    const deltaTime = time - animationRef.current.lastTime
    const distance = (deltaTime / 1000) * animationSpeed

    if (isAutoPlaying) {
      setContinuousOffset(prev => {
        const newOffset = prev + distance
        // Reset khi đạt đến giới hạn mà không gây giật
        if (newOffset >= itemSpacing * originalItems.length) {
          return newOffset - itemSpacing * originalItems.length
        }
        return newOffset
      })
    }

    animationRef.current.lastTime = time
    animationRef.current.id = requestAnimationFrame(animate)
  }

  useEffect(() => {
    animationRef.current = { id: null, lastTime: null }
    animationRef.current.id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current.id)
  }, [isAutoPlaying])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const getVisibleItems = useMemo(() => {
    const startIndex = Math.floor(continuousOffset / itemSpacing)
    const fractional = (continuousOffset % itemSpacing) / itemSpacing

    return Array.from({ length: visibleItems + 2 }).map((_, i) => {
      const itemIndex = startIndex + i
      const position = i - fractional
      const centerDistance = Math.abs(position - 2)

      const opacity = 1 - (centerDistance * 0.2)
      const scale = 1 - (centerDistance * 0.1)

      return {
        ...items[itemIndex % items.length],
        style: {
          transform: `translateX(${(position - 2) * itemSpacing}px) scale(${scale})`,
          opacity: Math.max(0.3, opacity),
          zIndex: 10 - Math.round(centerDistance * 2),
          transition: 'transform 0.01s linear' // Giảm thời gian transition
        }
      }
    })
  }, [continuousOffset, items, itemSpacing])

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative overflow-hidden">
          <h2 className="text-2xl font-bold text-center mb-8">My Image Gallery</h2>

          <div
            className="relative h-96"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
              {getVisibleItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}-${Math.floor(continuousOffset / itemSpacing)}`}
                  className="absolute will-change-transform"
                  style={item.style}
                >
                  <div className="rounded-full overflow-hidden w-52 h-52 border-4 border-white shadow-lg relative flex items-center justify-center bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.altText}
                      className="w-full h-full object-contain"
                      style={{ borderRadius: '30%', padding: '5%' }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircleSlider