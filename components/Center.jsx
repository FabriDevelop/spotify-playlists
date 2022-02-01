import {
  ChevronDownIcon,
  ChevronRightIcon,
  LogoutIcon,
} from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { shuffle } from "lodash"
import { useRecoilState, useRecoilValue } from "recoil"
import playlistIdState, { playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"

import Songs from "./Songs"

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
]

function Center() {
  const { data: session } = useSession()
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const spotifyApi = useSpotify()

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((error) => console.log(error))
  }, [spotifyApi, playlistId])
  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black 
        p-1 pr-2  opacity-90 hover:opacity-80"
          onClick={signOut}
        >
          <img
            src={session?.user.image}
            alt=""
            className="w-190 h-10 rounded-full"
          />
          <h2 className="text-white">{session?.user.name}</h2>
          <LogoutIcon className="h-5 w-5 text-white" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b p-8 ${color}
        to-black text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
        ></img>
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
