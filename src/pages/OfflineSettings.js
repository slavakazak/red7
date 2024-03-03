import Header from "../components/Header"
import { colors } from "../utils/const"
import { Link } from "react-router-dom"

export default function OfflineSettings({ playersName, setPlayersName }) {

	function changeHandler(i) {
		return e => setPlayersName(playersName.map((name, key) => key === i ? e.target.value : name))
	}

	function addClickHandler() {
		setPlayersName([...playersName, ''])
	}

	function deleteClickHandler(i) {
		return () => {
			setPlayersName(playersName.filter((_, key) => key !== i))
		}
	}

	return (
		<>
			<Header />
			<div className="players">
				{playersName.map((name, i) => (
					<div className="player" key={i}>
						<input type="text" className="name" placeholder="Имя игрока" value={name} onChange={changeHandler(i)} />
						{playersName.length > 2 ? <div className="delete" onClick={deleteClickHandler(i)} /> : null}
					</div>
				))}
				{playersName.length < 4 ? <div className="button add-player" style={{ backgroundColor: colors[3].hue }} onClick={addClickHandler}>Добавить игрока</div> : null}
			</div>
			<div className="offline-settings-buttons">
				<Link className="button" to="/" style={{ backgroundColor: colors[0].hue }}>Назад</Link>
				<Link className="button" to="/offlineGame" style={{ backgroundColor: colors[1].hue }}>Начать</Link>
			</div>
		</>
	)
}