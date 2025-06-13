import { useRef, useState } from "react"
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

export default function Player({ src, title }: { src?: string, title?: string}) {

  if (!src) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center rounded-lg">
        <p className="text-xl font-bold text-white">NO VIDEO SOURCE</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full flex items-center justify-center rounded-lg">
        <MediaPlayer streamType="on-demand" src={src} autoPlay={true} title={title}>
          <MediaProvider />
          <DefaultVideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" icons={defaultLayoutIcons} />
        </MediaPlayer>
      </div>
    </>
  )

}