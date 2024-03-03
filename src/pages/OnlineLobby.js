import { useEffect, useState } from "react"
import Header from "../components/Header"
import { colors } from "../utils/const"
import { Link, useNavigate } from "react-router-dom"
import { getDatabase, ref, set, get, onValue } from "firebase/database"

export default function OnlineLobby({ you, setYou }) {
	const navigate = useNavigate();
	const [playersName, setPlayersName] = useState(['', '', '', ''])
	const [youName, setYouName] = useState('')

	function changeHandler(e) {
		setYouName(e.target.value)
	}

	function addClickHandler() {
		const db = getDatabase()
		get(ref(db, 'names')).then(snapshot => {
			if (snapshot.exists()) {
				const data = snapshot.val()
				for (let key in data) {
					if (data[key].trim() === '') {
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
		setYouName('')
	}

	function deleteClickHandler(i) {
		return () => {
			const newPlayersName = [...playersName]
			newPlayersName[i] = ''
			setPlayersName(newPlayersName)
			const db = getDatabase()
			set(ref(db, 'names/player' + i), '')
			if (you === 'player' + i) setYou('')
		}
	}

	function startClickHandler() {
		const db = getDatabase()
		set(ref(db, 'gameStatus'), 'on')
		navigate('/onlineGame')
	}

	useEffect(() => {
		const db = getDatabase()
		set(ref(db, 'gameStatus'), 'off')
		onValue(ref(db, 'names'), snapshot => {
			const data = snapshot.val()
			const newPlayersName = []
			for (let key in data) {
				newPlayersName.push(data[key])
			}
			setPlayersName(newPlayersName)
			if (you && data[you].trim() === '') setYou('')
		})
		onValue(ref(db, 'gameStatus'), snapshot => {
			const data = snapshot.val()
			if (data === 'on') navigate('/onlineGame')
		})
	}, [])

	return (
		<>
			<Header />
			<div className="players">
				{playersName.map((name, i) => {
					if (name.trim() !== '') {
						return (
							<div className={"player" + (you === 'player' + i ? ' you' : '')} key={i}>
								<div className="name">{name}</div>
								<div className="delete" onClick={deleteClickHandler(i)} />
							</div>
						)
					}
					return null
				})}
				{you ? null :
					playersName.filter(player => player.trim() !== '').length > 3 ?
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
				{playersName.length > 1 && you ? <div className="button" onClick={startClickHandler} style={{ backgroundColor: colors[1].hue }}>Начать</div> : null}
			</div>
		</>
	)
}