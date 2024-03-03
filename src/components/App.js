import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import OfflineGame from "../pages/OfflineGame"
import Menu from "../pages/Menu"
import OfflineSettings from "../pages/OfflineSettings"
import OnlineLobby from "../pages/OnlineLobby"

export default function App() {
	const [playersName, setPlayersName] = useState(['A', 'B'])
	const [you, setYou] = useState(null)

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Menu />} />
				<Route path="/offlineSettings" element={<OfflineSettings playersName={playersName} setPlayersName={setPlayersName} />} />
				<Route path="/offlineGame" element={<OfflineGame playersName={playersName} />} />
				<Route path="/onlineLobby" element={<OnlineLobby you={you} setYou={setYou} />} />
			</Routes>
		</div>
	)
}