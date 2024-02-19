import { useEffect, useState } from "react"
import Palette from "./Palette"
import Hand from "./Hand"
import Card from "./Card"
import Deck from "../utils/Deck"
import Memo from "./Memo"
import checkRule from "../utils/checkRule"
import copyPlayers from "../utils/copyPlayers"

import { colors } from "../utils/const"

export default function App() {
	const deck = new Deck()
	deck.shuffle()
	const [players, setPlayers] = useState([
		{ name: 'A', hand: deck.deal(7), palette: deck.deal(1), win: false, numOfWinCards: 0, maxWinCard: null },
		{ name: 'B', hand: deck.deal(7), palette: deck.deal(1), win: false, numOfWinCards: 0, maxWinCard: null },
		{ name: 'C', hand: deck.deal(7), palette: deck.deal(1), win: false, numOfWinCards: 0, maxWinCard: null },
		{ name: 'D', hand: deck.deal(7), palette: deck.deal(1), win: false, numOfWinCards: 0, maxWinCard: null }
	])
	const [current, setCurrent] = useState(0)
	const [ruleCard, setRuleCard] = useState({ color: colors[6] })

	const [added, setAdded] = useState(false)
	const [changed, setChanged] = useState(false)
	const [addToPalette, setAddToPalette] = useState(false)
	const [changeRule, setChangeRule] = useState(false)
	const [endTurn, setEndTurn] = useState(false)
	const [selectCard, setSelectCard] = useState(true)

	function handClickHandler(i) {
		return () => {
			const newPlayers = copyPlayers(players)
			const isActive = newPlayers[current].hand[i].active
			newPlayers[current].hand.forEach(card => card.active = false)
			if (changed) {
				setPlayers(newPlayers)
				return
			}
			newPlayers[current].hand[i].active = isActive ? false : true
			setPlayers(newPlayers)

			if (isActive) {
				setAddToPalette(false)
				setChangeRule(false)
				setSelectCard(!added || !changed)
			} else {
				setAddToPalette(!added)
				setChangeRule(!changed)
				setSelectCard(false)
			}
		}
	}

	function addClickHandler() {
		const newPlayersToCheck = copyPlayers(players)
		const activeCard = newPlayersToCheck[current].hand.find(card => card.active)
		newPlayersToCheck[current].hand = newPlayersToCheck[current].hand.filter(card => !card.active)
		newPlayersToCheck[current].palette.push(activeCard)

		const { newPlayers } = checkRule(newPlayersToCheck, ruleCard)

		setAdded(true)
		setAddToPalette(false)
		setChangeRule(false)
		setSelectCard(!added || !changed)
		setEndTurn(newPlayers[current].win)

		setPlayers(newPlayers)
	}

	function changeClickHandler() {
		const newPlayersToCheck = copyPlayers(players)
		const activeCard = newPlayersToCheck[current].hand.find(card => card.active)
		newPlayersToCheck[current].hand = newPlayersToCheck[current].hand.filter(card => !card.active)
		setRuleCard(activeCard)

		const { newPlayers } = checkRule(newPlayersToCheck, activeCard)

		setAdded(true)
		setChanged(true)
		setAddToPalette(false)
		setChangeRule(false)
		setSelectCard(false)
		setEndTurn(newPlayers[current].win)

		setPlayers(newPlayers)
	}

	function endClickHandler() {
		setCurrent(prev => prev < players.length - 1 ? prev + 1 : 0)
		setAdded(false)
		setChanged(false)
		setAddToPalette(false)
		setChangeRule(false)
		setSelectCard(true)
		setEndTurn(false)
	}

	useEffect(() => {
		const { newPlayers, winner } = checkRule(players, ruleCard)
		const next = winner < players.length - 1 ? winner + 1 : 0
		setPlayers(newPlayers)
		setCurrent(next)
	}, [])

	return (
		<div className="App">
			{players.map((player, i) => i > current ? <Palette key={i} player={player} /> : null)}
			{players.map((player, i) => i < current ? <Palette key={i} player={player} /> : null)}
			<div className="board">
				<Memo />
				<div className="main_rule">
					<Card {...ruleCard} />
				</div>
			</div>
			<Palette player={players[current]} />
			<Hand cards={players[current].hand} clickHandler={handClickHandler} />
			<div className="buttons">
				<div className="button" style={{ backgroundColor: '#d50000' }}>Пас</div>
				{addToPalette ? <div className="button" onClick={addClickHandler}>Добавить в палитру</div> : null}
				{changeRule ? <div className="button" onClick={changeClickHandler}>Сменить правило</div> : null}
				{selectCard ? <div className="text">Выберите карту</div> : null}
				{endTurn ? <div className="button" onClick={endClickHandler}>Завершить ход</div> : null}
			</div>
		</div>
	)
}