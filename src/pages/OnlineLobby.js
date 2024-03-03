import { useEffect, useState } from "react"
import Header from "../components/Header"
import { colors } from "../utils/const"
import { Link } from "react-router-dom"
import { getDatabase, ref, set, get, onValue } from "firebase/database"

export default function OnlineLobby({ you, setYou }) {
	const [playersName, setPlayersName] = useState([])
	const [youName, setYouName] = useState('')

	const db = getDatabase()
	const names = ref(db, 'names')

	function changeHandler(e) {
		setYouName(e.target.value)
	}

	function addClickHandler() {
		get(names).then(snapshot => {
			if (snapshot.exists()) {
				const data = snapshot.val()
				for (let key in data) {
					if (data[key] === '') {
						setYou(key)
						set(ref(db, 'names/' + key), youName)
						break
					}
				}
			} else {
				console.log("No data available")
			}
		}).catch(error => {
			console.error(error)
		})
	}

	useEffect(() => {
		onValue(names, snapshot => {
			const data = snapshot.val()
			const newPlayersName = []
			for (let key in data) {
				if (data[key] !== '') newPlayersName.push(data[key])
			}
			setPlayersName(newPlayersName)
		})

		return () => {
			if (you) {
				set(ref(db, 'names/' + you), '')
				setYou(null)
			}
		}
	}, [])

	return (
		<>
			<Header />
			<div className="players">
				{playersName.map((name, i) => (
					<div className="player" key={i}>
						<div className="name">{name}</div>
					</div>
				))}
				{you ? null :
					playersName.length > 3 ?
						<div className="text">Мест нет</div>
						:
						<>
							<div className="player">
								<input type="text" className="name" placeholder="Введите имя" value={youName} onChange={changeHandler} />
							</div>
							{youName.trim() !== '' ? <div className="button add-player" style={{ backgroundColor: colors[3].hue }} onClick={addClickHandler}>Присоединиться</div> : null}
						</>
				}

			</div>
			<div className="offline-settings-buttons">
				<Link className="button" to="/" style={{ backgroundColor: colors[0].hue }}>Назад</Link>
				{playersName.length > 1 && you ? <Link className="button" to="/offlineGame" style={{ backgroundColor: colors[1].hue }}>Начать</Link> : null}
			</div>
		</>
	)
}