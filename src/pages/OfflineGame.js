import { useEffect, useState } from "react"
import Palette from "../components/Palette"
import Hand from "../components/Hand"
import Card from "../components/Card"
import Memo from "../components/Memo"
import checkRule from "../utils/checkRule"
import { copyPlayers, copyCard } from "../utils/copy"
import { colors } from "../utils/const"
import Deck from "../utils/Deck"
import { Link } from "react-router-dom"
import { getDatabase } from "firebase/database"

export default function OfflineGame({ playersName }) {
	const defaultRuleCard = { color: colors[6] }
	const [ruleCard, setRuleCard] = useState(defaultRuleCard)
	const [prevRuleCard, setPrevRuleCard] = useState(defaultRuleCard)

	function genPlayers() {
		const deck = new Deck()
		deck.shuffle()
		const genPlayer = name => ({ name, hand: deck.deal(7), palette: deck.deal(1), win: false, loss: false, numOfWinCards: 0, maxWinCard: null })
		return checkRule(playersName.map(name => genPlayer(name)), defaultRuleCard)
	}

	const [players, setPlayers] = useState(genPlayers())
	const [prevPlayers, setPrevPlayers] = useState(copyPlayers(players))

	function getCurrent(players) {
		const winner = players.findIndex(player => player.win)
		return (winner + 1) % players.length
	}

	const [current, setCurrent] = useState(getCurrent(players))

	const [startTurn, setStartTurn] = useState(false)
	const [added, setAdded] = useState(false)
	const [changed, setChanged] = useState(false)

	//---------выбор карты---------------
	function handClickHandler(i) {
		return () => {
			if (changed) return
			const newPlayers = copyPlayers(players)
			const isActive = newPlayers[current].hand[i].active
			newPlayers[current].hand.forEach(card => card.active = false)
			newPlayers[current].hand[i].active = !isActive
			setPlayers(newPlayers)
		}
	}
	//---------кнопка паса---------------
	function passClickHandler() {
		const newPlayers = copyPlayers(prevPlayers)
		newPlayers[current].loss = true
		endTurn(newPlayers, prevRuleCard)
	}
	//---------извлечь выбранную карту-----------
	function removeActiveCard() {
		const newPlayers = copyPlayers(players)
		const activeCard = newPlayers[current].hand.find(card => card.active)
		newPlayers[current].hand = newPlayers[current].hand.filter(card => !card.active)
		activeCard.active = false
		return { newPlayers, activeCard }
	}
	//---------кнопка добавления в палитру---------------
	function addClickHandler() {
		const { newPlayers: newPlayersToCheck, activeCard } = removeActiveCard()
		newPlayersToCheck[current].palette.push(activeCard)
		const newPlayers = checkRule(newPlayersToCheck, ruleCard)
		setPlayers(newPlayers)
		setAdded(true)
	}
	//---------кнопка смены правила---------------
	function changeClickHandler() {
		const { newPlayers: newPlayersToCheck, activeCard } = removeActiveCard()
		setRuleCard(activeCard)
		const newPlayers = checkRule(newPlayersToCheck, activeCard)
		setPlayers(newPlayers)
		setChanged(true)
	}
	//---------кнопка конца хода---------------
	function endClickHandler() {
		endTurn(players, ruleCard)
	}
	//---------кнопка назад---------------
	function backClickHandler() {
		players.set(copyPlayers(prevPlayers))
		setRuleCard(copyCard(prevRuleCard))
		setAdded(false)
		setChanged(false)
	}
	//---------конец хода---------------
	function endTurn(inputPlayers, inputRuleCard) {
		if (inputPlayers.filter(player => !player.loss).length === 0) return

		let next = current
		while (true) {
			next = (next + 1) % inputPlayers.length
			if (!inputPlayers[next].loss) break
		}
		setCurrent(next)

		setAdded(false)
		setChanged(false)
		setStartTurn(false)

		const newPlayers = checkRule(inputPlayers, inputRuleCard)
		setPlayers(newPlayers)
		setPrevPlayers(copyPlayers(newPlayers))
		setRuleCard(copyCard(inputRuleCard))
		setPrevRuleCard(copyCard(inputRuleCard))
	}
	//---------кнопка начать ход---------------
	function startClickHandler() {
		setStartTurn(true)
	}
	//---------начало игры---------------
	function newGame() {
		setRuleCard(defaultRuleCard)
		setPrevRuleCard(defaultRuleCard)

		const newPlayers = genPlayers()
		setPlayers(newPlayers)
		setPrevPlayers(copyPlayers(newPlayers))

		setCurrent(getCurrent(newPlayers))
	}
	//
	useEffect(() => {
		const db = getDatabase()
		console.log(db)
	}, [])
	return (
		<>
			{players.map((player, i) => i > current ? <Palette key={i} player={player} /> : null)}
			{players.map((player, i) => i < current ? <Palette key={i} player={player} /> : null)}
			<div className="board">
				<Memo />
				<div className="main_rule">
					<Card {...ruleCard} />
				</div>
			</div>
			<Palette player={players[current]} />
			{players.filter(player => !player.loss).length === 1 ?
				<>
					<div className="info">Победа</div>
					<div className="buttons">
						<Link className="button" to="/" style={{ backgroundColor: colors[0].hue }}>Меню</Link>
						<div className="button" onClick={newGame} style={{ backgroundColor: colors[1].hue }}>Новая игра</div>
					</div>
				</>
				: startTurn ?
					<>
						{players[current].hand.length > 0 && !changed && !players[current].hand.find(card => card.active) ? <div className="info">Выберите карту</div> : null}
						<Hand cards={players[current].hand} clickHandler={handClickHandler} />
						<div className="buttons">
							<div className="button" style={{ backgroundColor: colors[6].hue }} onClick={passClickHandler}>Пас</div>
							{players[current].hand.find(card => card.active) && !changed && !added ? <div className="button" style={{ backgroundColor: colors[1].hue }} onClick={addClickHandler}>Добавить в палитру</div> : null}
							{players[current].hand.find(card => card.active) && !changed ? <div className="button" onClick={changeClickHandler} style={{ backgroundColor: colors[2].hue }}>Сменить правило</div> : null}
							{players[current].win ? <div className="button" onClick={endClickHandler} style={{ backgroundColor: colors[3].hue }}>Завершить ход</div> : null}
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