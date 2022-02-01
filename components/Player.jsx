import { signOut, useSession } from "next-auth/react"
import React, { useCallback, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo"
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from "@heroicons/react/outline"
import { debounce } from "lodash"

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volumen, setVolumen] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentIdTrack(data.body?.item?.id)
      })
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing)
      })
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolumen(50)
    }
    console.log(songInfo)
  }, [currentTrackId, spotifyApi, session, songInfo])

  useEffect(() => {
    if (volumen > 0 && volumen <= 100) {
      debouncedAdjustVolume(volumen)
    }
  }, [volumen])

  const debouncedAdjustVolume = useCallback(
    debounce((volumen) => {
      spotifyApi.setVolume(volumen).catch((error) => {})
    }, 200),
    []
  )

  return (
    <div
      className="grid h-24 grid-cols-3 bg-gradient-to-b
    from-black to-gray-900 px-2 text-sm text-white md:px-8 md:text-base"
    >
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        ></img>
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="s flex items-center justify-evenly">
        {isPlaying ? (
          <PauseIcon className="button h-10 w-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button h-10 w-10" onClick={handlePlayPause} />
        )}
      </div>

      <div className="flex items-center justify-end space-x-3 md:space-x-4">
        {volumen > 0 ? (
          <VolumeUpIcon className="h-5 w-5" />
        ) : (
          <VolumeOffIcon className="h-5 w-5" />
        )}
        <input
          className="w-14 md:w-28"
          type="range"
          value={volumen}
          onChange={(e) => setVolumen(Number(e.target.value))}
          min={0}
          max={100}
        />
      </div>
    </div>
  )
}

export default Player
