'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import Clear from '../assets/images/Clear.png'
import Diana from '../assets/images/Diana.png'
import Carlsberg from '../assets/images/Carlsberg.png'
import Uniben from '../assets/images/Uniben.png'
import Dove from '../assets/images/Dove.png'
import PS from '../assets/images/PS.png'
import Nestle from '../assets/images/Nestle.png'
import Colgate from '../assets/images/Colgate.png'
import Mercedes from '../assets/images/Mercedes.png'
import Samsung from '../assets/images/Samsung.png'
import Toyota from '../assets/images/Toyota.png'
import TPBank from '../assets/images/TPBank.png'
import Unilever from '../assets/images/Unilever.png'
import Viettel from '../assets/images/Viettel.png'
import Vinfast from '../assets/images/Vinfast.png'

const images = [
  { src: Clear.src, alt: 'Clear' },
  { src: Diana.src, alt: 'Diana' },
  { src: Carlsberg.src, alt: 'Carlsberg' },
  { src: Uniben.src, alt: 'Uniben' },
  { src: Dove.src, alt: 'Dove' },
  { src: PS.src, alt: 'PS' },
  { src: Nestle.src, alt: 'Nestle' },
  { src: Colgate.src, alt: 'Colgate' },
  { src: Mercedes.src, alt: 'Mercedes' },
  { src: Samsung.src, alt: 'Samsung' },
  { src: Toyota.src, alt: 'Toyota' },
  { src: TPBank.src, alt: 'TPBank' },
  { src: Unilever.src, alt: 'Unilever' },
  { src: Viettel.src, alt: 'Viettel' },
  { src: Vinfast.src, alt: 'Vinfast' },
]

const CircleSlider = () => {
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const speed = 0.5 // Điều chỉnh tốc độ mượt ở đây

  useEffect(() => {
    const container = containerRef.current
    let offset = 0

    const animate = () => {
      offset -= speed
      container.style.transform = `translateX(${offset}px)`

      if (Math.abs(offset) >= container.scrollWidth / 3) {
        offset = 0
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  const repeatedImages = [...images, ...images, ...images] // tạo 3 lần để lặp vô tận

  return (
    <div className="w-full overflow-hidden bg-black py-10">
      <div className="relative h-60">
        <div
          ref={containerRef}
          className="absolute top-1/2 left-0 flex -translate-y-1/2 gap-10"
        >
          {repeatedImages.map((img, index) => (
            <div
              key={index}
              className="w-52 h-52 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CircleSlider
