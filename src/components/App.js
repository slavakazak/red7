import { useState, useRef } from "react"
import { Routes, Route } from "react-router-dom"
import Game from "../pages/Game"
import Menu from "../pages/Menu"
import OfflineSettings from "../pages/OfflineSettings"
import { PlayersContext } from "../contexts/PlayersContext"
import Deck from "../utils/Deck"

export default function App() {
	const deck = new Deck()
	deck.shuffle()
	const genPlayer = name => ({ name, hand: deck.deal(7), palette: deck.deal(1), win: false, loss: false, numOfWinCards: 0, maxWinCard: null })
	const defaultPlayers = useRef([genPlayer('A'), genPlayer('B')])

	const [players, setPlayers] = useState(defaultPlayers.current)
	const [prevPlayers, setPrevPlayers] = useState(defaultPlayers.current)
	const [current, setCurrent] = useState(0)

	return (
		<PlayersContext.Provider value={{
			get: players,
			set: setPlayers,
			prev: prevPlayers,
			setPrev: setPrevPlayers,
			genPlayer,
			current,
			setCurrent
		}}>
			<div className="App">
				<Routes>
					<Route path="/" element={<Menu />} />
					<Route path="/offlineSettings" element={<OfflineSettings />} />
					<Route path="/offlineGame" element={<Game />} />
				</Routes>
			</div>
		</PlayersContext.Provider>
	)
}