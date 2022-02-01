import { atom } from "recoil"

const playlistIdState = atom({
  key: "playlistIdState",
  default: "48sHE0nZIXRuvre0zhypbD",
})

export const playlistState = atom({
  key: "playlistState",
  default: null,
})

export default playlistIdState
