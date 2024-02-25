import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import OfflineGame from "../pages/OfflineGame"
import Menu from "../pages/Menu"
import OfflineSettings from "../pages/OfflineSettings"

export default function App() {
	const [playersName, setPlayersName] = useState(['A', 'B'])

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Menu />} />
				<Route path="/offlineSettings" element={<OfflineSettings playersName={playersName} setPlayersName={setPlayersName} />} />
				<Route path="/offlineGame" element={<OfflineGame playersName={playersName} />} />
			</Routes>
		</div>
	)
}