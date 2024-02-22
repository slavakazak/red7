import { createContext } from 'react'

export const PlayersContext = createContext({
	get: null,
	set: null,
	prev: null,
	setPrev: null,
	genPlayer: null,
	current: null,
	setCurrent: null
})