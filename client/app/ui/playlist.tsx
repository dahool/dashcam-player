import { useCallback, useEffect, useRef, useState } from 'react'
import "./playlist.css"
import type { PlayListItem } from '~/api/types'
import { useGetTracksQuery } from '~/api/slice'

export default function PlayList({ onChange }: { onChange: (item: PlayListItem) => void }) {

  const imageListContainerRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftState, setScrollLeftState] = useState(0)

  const scrollAmount = 300 // Adjust based on image item width + space-x

  const {
      data: itemList,
      isLoading,     // True on initial load and when refetching without existing data
      isFetching,    // True whenever a request is in flight (initial, refetch, background)
      isSuccess,     // True if the query was successful and data is available
      isError,       // True if the query resulted in an error
  } = useGetTracksQuery();

  const scrollLeft = () => {
    if (imageListContainerRef.current) {
      imageListContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (imageListContainerRef.current) {
      imageListContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleMouseDown = useCallback((e: any) => {
    setIsDragging(true)
    setStartX(e.pageX - imageListContainerRef.current!.offsetLeft)
    setScrollLeftState(imageListContainerRef.current!.scrollLeft)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [])

  const handleMouseMove = useCallback((e: any) => {
    if (!isDragging) return
    e.preventDefault() // Prevent text selection and default drag behavior
    const x = e.pageX - imageListContainerRef.current!.offsetLeft
    const walk = (x - startX) * 1.5 // Multiplier for faster/slower scroll
    imageListContainerRef.current!.scrollLeft = scrollLeftState - walk
  }, [isDragging, startX, scrollLeftState])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    // Remove global event listeners
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, handleMouseDown]) // Depend on memoized handlers

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  if (isLoading || isFetching) {
    return LoadingSkeleton()
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Image List Container */}
      <div className="relative w-full">
        {/* Navigation Arrows */}
        <button
          id="scrollLeft"
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden md:block"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button
          id="scrollRight"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md z-10 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden md:block"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        {/* Scrollable Content */}
        <div
          ref={imageListContainerRef}
          id="imageListContainer"
          onMouseDown={handleMouseDown}
          className="flex flex-nowrap overflow-x-scroll overflow-y-hidden space-x-4 p-2 rounded-lg shadow-inner-sm scrollbar-hide md:overflow-x-auto overflow-x-scroll-smooth"
        >
          {itemList!.map((item, index) => (
            <div key={index} className="relative flex-shrink-0 w-32 h-24 md:w-36 md:h-28 rounded-lg overflow-hidden shadow-md" onClick={() => onChange(item) }>
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-3 text-sm md:text-base rounded-b-lg">
                <span className="font-medium">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

const LoadingSkeleton = () => {

  return (
      <div className="relative w-full h-full flex flex-col items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 bg-opacity-75 p-2 rounded-full shadow-md z-10 hidden sm:block pointer-events-none"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 bg-opacity-75 p-2 rounded-full shadow-md z-10 hidden sm:block pointer-events-none"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <div className="flex flex-nowrap overflow-x-hidden overflow-y-hidden space-x-4 p-2 rounded-lg scrollbar-hide w-full">

          {[...Array(10)].map((_, index) => (
            <div key={index} className="relative flex-shrink-0 w-32 h-24 md:w-36 md:h-28 rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse">
              {/* Image placeholder */}
              <div className="w-full h-full bg-gray-300"></div>
              {/* Title placeholder */}
              <div className="absolute bottom-0 left-0 right-0 bg-gray-400 h-8 p-3 rounded-b-lg flex items-center justify-center">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
  )
}