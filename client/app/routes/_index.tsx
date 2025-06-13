import Player from "~/ui/player"
import type { Route } from "../+types/root"
import { useState } from "react"
import PlayList from "~/ui/playlist"
import { Map } from "~/ui/map"
import type { PlayListItem } from "~/api/types"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "DashCam Browser" },
  ]
}

export default function Home() {

  const [videoSrc, setVideoSrc] = useState<PlayListItem | undefined>()

  const handleVideoSelection = (item: PlayListItem) => {
    setVideoSrc(item)
  }

  return (
    <>
    <div className="flex flex-col h-screen bg-gray-100 p-4 font-inter">

      <div className="flex-grow flex flex-col md:flex-row gap-4 mb-4 md:mb-0 h-[75%]">
        {/* Player Component Container */}
        {/* On small screens (default), this will be full width and stack vertically. */}
        {/* On medium screens (md: prefix), it will take 2/3 width and align horizontally. */}
        <div className="w-full md:w-2/3 flex items-center justify-center p-4 h-full">
          <Player src={videoSrc?.video} title={videoSrc?.title} />
        </div>
        {/* Map Component Container */}
        {/* On small screens (default), this will be full width and stack vertically. */}
        {/* On medium screens (md: prefix), it will take 1/3 width and align horizontally. */}
        <div className="hidden md:flex w-full md:w-1/3 items-center justify-center bg-white rounded-lg shadow-lg p-4 h-full">
          <Map source={videoSrc?.mapSource} />
        </div>
      </div>
      {/* Bottom Section: Playlist */}
      {/* This section will always take the full width and occupy the remaining height. */}
      <div className="w-full p-4 flex flex-col h-[25%]">
        <PlayList onChange={handleVideoSelection} />
      </div>
    </div>

    </>
  )
}

/*


      <div className="md:flex md:gap-4 h-screen bg-gray-100 p-4 font-inter">
        <div className="w-full md:w-2/3 flex flex-col gap-2 mb-4 md:mb-0">
          <div className="h-3/4 flex items-center justify-center">
            <Player />
          </div>
          <div className="h-1/4 flex flex-col justify-end shadow-inner">
            <PlayList />
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col">
          <div className="h-full p-6 flex items-center justify-center">
            <div>
              <Map />
            </div>
          </div>
        </div>
      </div>
*/