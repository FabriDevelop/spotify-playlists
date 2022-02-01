import React, { useEffect, useState } from "react"
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  RssIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline"
import useSpotify from "../hooks/useSpotify"
import { signOut, useSession } from "next-auth/react"
import { useRecoilState } from "recoil"
import playlistIdState from "../atoms/playlistAtom"

function Sidebar() {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState([])
  const spotifyApi = useSpotify()

  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items)
      })
    }
  }, [session, spotifyApi])

  return (
    <div
      className="hidden h-screen overflow-y-scroll border-r  
              border-gray-900 p-5 pb-36 text-xs text-gray-500 scrollbar-hide sm:max-w-[12rem]
              md:inline-flex lg:max-w-[15rem] lg:text-sm"
    >
      <div className="space-y-4">
        <h3 className="font-semibold">
          Made by <span className="text-green-600">Carlos Arcia</span>
        </h3>

        <hr className="border-t-[0.1px] border-gray-900" />
        <h4 className="text-center  font-semibold text-white">
          Your Playlists
        </h4>
        {playlists.map((playlist) => (
          <p
            className="max-w-xs cursor-pointer hover:text-white"
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
