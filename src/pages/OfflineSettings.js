import Header from "../components/Header"
import { colors } from "../utils/const"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { PlayersContext } from "../contexts/PlayersContext"
import checkRule from "../utils/checkRule"
import { copyPlayers } from "../utils/copy"

export default function OfflineSettings() {
	const players = useContext(PlayersContext)

	function startGame() {
		const newPlayers = checkRule(players.get, { color: colors[6] })
		players.set(newPlayers)
		players.setPrev(copyPlayers(newPlayers))

		const winner = newPlayers.findIndex(player => player.win)
		const next = (winner + 1) % newPlayers.length
		players.setCurrent(next)
	}

	return (
		<>
			<Header />
			<div className="players">
				{players.get.map(player => (
					<div className="player">
						<input type="text" placeholder="Имя игрока" value={player.name} />
						<div className="delete" />
					</div>
				))}
			</div>
			<div className="offline-settings-buttons">
				<Link className="button" to="/" style={{ backgroundColor: colors[0].hue }}>Назад</Link>
				<Link className="button" to="/offlineGame" style={{ backgroundColor: colors[1].hue }} onClick={startGame}>Начать</Link>
			</div>
		</>
	)
}