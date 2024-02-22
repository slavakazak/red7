import { useEffect, useRef, useState, useContext } from "react"
import Palette from "../components/Palette"
import Hand from "../components/Hand"
import Card from "../components/Card"
import Memo from "../components/Memo"
import checkRule from "../utils/checkRule"
import { copyPlayers, copyCard } from "../utils/copy"
import { colors } from "../utils/const"
import { getDatabase } from "firebase/database";
import { PlayersContext } from "../contexts/PlayersContext"

export default function Game() {
	const players = useContext(PlayersContext)

	const defaultRuleCard = useRef({ color: colors[6] })
	const [ruleCard, setRuleCard] = useState(defaultRuleCard.current)
	const [prevRuleCard, setPrevRuleCard] = useState(defaultRuleCard.current)

	const [startTurn, setStartTurn] = useState(false)
	const [added, setAdded] = useState(false)
	const [changed, setChanged] = useState(false)
	//---------выбор карты---------------
	function handClickHandler(i) {
		return () => {
			if (changed) return
			const newPlayers = copyPlayers(players.get)
			const isActive = newPlayers[players.current].hand[i].active
			newPlayers[players.current].hand.forEach(card => card.active = false)
			newPlayers[players.current].hand[i].active = !isActive
			players.set(newPlayers)
		}
	}
	//---------кнопка паса---------------
	function passClickHandler() {
		const newPlayers = copyPlayers(players.prev)
		newPlayers[players.current].loss = true
		endTurn(newPlayers, prevRuleCard)
	}
	//---------извлечь выбранную карту-----------
	function removeActiveCard() {
		const newPlayers = copyPlayers(players.get)
		const activeCard = newPlayers[players.current].hand.find(card => card.active)
		newPlayers[players.current].hand = newPlayers[players.current].hand.filter(card => !card.active)
		activeCard.active = false
		return { newPlayers, activeCard }
	}
	//---------кнопка добавления в палитру---------------
	function addClickHandler() {
		const { newPlayers: newPlayersToCheck, activeCard } = removeActiveCard()
		newPlayersToCheck[players.current].palette.push(activeCard)
		const newPlayers = checkRule(newPlayersToCheck, ruleCard)
		players.set(newPlayers)
		setAdded(true)
	}
	//---------кнопка смены правила---------------
	function changeClickHandler() {
		const { newPlayers: newPlayersToCheck, activeCard } = removeActiveCard()
		setRuleCard(activeCard)
		const newPlayers = checkRule(newPlayersToCheck, activeCard)
		players.set(newPlayers)
		setChanged(true)
	}
	//---------кнопка конца хода---------------
	function endClickHandler() {
		endTurn(players.get, ruleCard)
	}
	//---------кнопка назад---------------
	function backClickHandler() {
		players.set(copyPlayers(players.prev))
		setRuleCard(copyCard(prevRuleCard))
		setAdded(false)
		setChanged(false)
	}
	//---------конец хода---------------
	function endTurn(inputPlayers, inputRuleCard) {
		if (inputPlayers.filter(player => !player.loss).length === 0) return

		let next = players.current
		while (true) {
			next = (next + 1) % inputPlayers.length
			if (!inputPlayers[next].loss) break
		}
		players.setCurrent(next)

		setAdded(false)
		setChanged(false)
		setStartTurn(false)

		const newPlayers = checkRule(inputPlayers, inputRuleCard)
		players.set(newPlayers)
		players.setPrev(copyPlayers(newPlayers))
		setRuleCard(copyCard(inputRuleCard))
		setPrevRuleCard(copyCard(inputRuleCard))
	}
	//---------кнопка начать ход---------------
	function startClickHandler() {
		setStartTurn(true)
	}
	//---------начало игры---------------
	useEffect(() => {
		const db = getDatabase()
		console.log(db)
	}, [])
	return (
		<>
			{players.get.map((player, i) => i > players.current ? <Palette key={i} player={player} /> : null)}
			{players.get.map((player, i) => i < players.current ? <Palette key={i} player={player} /> : null)}
			<div className="board">
				<Memo />
				<div className="main_rule">
					<Card {...ruleCard} />
				</div>
			</div>
			<Palette player={players.get[players.current]} />
			{players.get.filter(player => !player.loss).length === 1 ?
				<>
					<div className="info">Победа</div>
					<div className="buttons"></div>
				</>
				: startTurn ?
					<>
						{players.get[players.current].hand.length > 0 && !changed && !players.get[players.current].hand.find(card => card.active) ? <div className="info">Выберите карту</div> : null}
						<Hand cards={players.get[players.current].hand} clickHandler={handClickHandler} />
						<div className="buttons">
							<div className="button" style={{ backgroundColor: colors[6].hue }} onClick={passClickHandler}>Пас</div>
							{players.get[players.current].hand.find(card => card.active) && !changed && !added ? <div className="button" style={{ backgroundColor: colors[1].hue }} onClick={addClickHandler}>Добавить в палитру</div> : null}
							{players.get[players.current].hand.find(card => card.active) && !changed ? <div className="button" onClick={changeClickHandler} style={{ backgroundColor: colors[2].hue }}>Сменить правило</div> : null}
							{players.get[players.current].win ? <div className="button" onClick={endClickHandler} style={{ backgroundColor: colors[3].hue }}>Завершить ход</div> : null}
							{changed || added ? <div className="button" onClick={backClickHandler} style={{ backgroundColor: colors[4].hue }}>Назад</div> : null}
						</div>
					</>
					:
					<div className="buttons">
						<div className="button" onClick={startClickHandler} style={{ backgroundColor: colors[0].hue }}>Начать ход</div>
					</div>
			}
		</>
	)
}