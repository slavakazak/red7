import { useEffect, useState } from "react"
import Palette from "./Palette"
import Hand from "./Hand"
import Card from "./Card"
import Deck from "../utils/Deck"
import Memo from "./Memo"
import checkRule from "../utils/checkRule"
import copyPlayers from "../utils/copyPlayers"

import { colors, red } from "../utils/const"

export default function App() {
  const deck = new Deck()
  deck.shuffle()
  const [players, setPlayers] = useState([
    { name: 'A', hand: deck.deal(7), palette: deck.deal(1), win: false, loss: false, numOfWinCards: 0, maxWinCard: null },
    { name: 'B', hand: deck.deal(7), palette: deck.deal(1), win: false, loss: false, numOfWinCards: 0, maxWinCard: null },
    { name: 'C', hand: deck.deal(7), palette: deck.deal(1), win: false, loss: false, numOfWinCards: 0, maxWinCard: null },
    { name: 'D', hand: deck.deal(7), palette: deck.deal(1), win: false, loss: false, numOfWinCards: 0, maxWinCard: null }
  ])
  const [current, setCurrent] = useState(0)
  const [ruleCard, setRuleCard] = useState({ color: colors[6] })

  const [added, setAdded] = useState(false)
  const [changed, setChanged] = useState(false)
  const [addToPaletteBtn, setAddToPaletteBtn] = useState(false)
  const [changeRuleBtn, setChangeRuleBtn] = useState(false)
  const [endTurnBtn, setEndTurnBtn] = useState(false)
  const [selectCard, setSelectCard] = useState(true)

  const [gameEnd, setGameEnd] = useState(false)

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
        setAddToPaletteBtn(false)
        setChangeRuleBtn(false)
        setSelectCard(!added || !changed)
      } else {
        setAddToPaletteBtn(!added)
        setChangeRuleBtn(!changed)
        setSelectCard(false)
      }
    }
  }

  function passClickHandler() {
    const newPlayers = copyPlayers(players)
    newPlayers[current].loss = true
    endTurn(newPlayers)
  }

  function addClickHandler() {
    const newPlayersToCheck = copyPlayers(players)
    const activeCard = newPlayersToCheck[current].hand.find(card => card.active)
    newPlayersToCheck[current].hand = newPlayersToCheck[current].hand.filter(card => !card.active)
    newPlayersToCheck[current].palette.push(activeCard)

    const { newPlayers } = checkRule(newPlayersToCheck, ruleCard)

    setAdded(true)
    setAddToPaletteBtn(false)
    setChangeRuleBtn(false)
    setSelectCard(!changed && newPlayers[current].hand.length > 0)
    setEndTurnBtn(newPlayers[current].win)

    setPlayers(newPlayers)
  }

  function changeClickHandler() {
    const newPlayersToCheck = copyPlayers(players)
    const activeCard = newPlayersToCheck[current].hand.find(card => card.active)
    newPlayersToCheck[current].hand = newPlayersToCheck[current].hand.filter(card => !card.active)
    setRuleCard(activeCard)

    const { newPlayers } = checkRule(newPlayersToCheck, activeCard)

    setChanged(true)
    setAddToPaletteBtn(false)
    setChangeRuleBtn(false)
    setSelectCard(false)
    setEndTurnBtn(newPlayers[current].win)

    setPlayers(newPlayers)
  }

  function endClickHandler() {
    endTurn(players)
  }

  function endTurn(inputPlayers) {
    const notLossPlayers = inputPlayers.filter(player => !player.loss)
    if (notLossPlayers.length === 0) return
    if (notLossPlayers.length === 1) {
      setGameEnd(true)
    }
    let next = current
    while (true) {
      next = (next + 1) % inputPlayers.length
      if (!inputPlayers[next].loss) break
    }
    setCurrent(next)
    setAdded(false)
    setChanged(false)
    setAddToPaletteBtn(false)
    setChangeRuleBtn(false)
    setSelectCard(inputPlayers[next].hand.length > 0)
    setEndTurnBtn(false)

    const { newPlayers } = checkRule(inputPlayers, ruleCard)
    setPlayers(newPlayers)
  }

  useEffect(() => {
    const { newPlayers, winner } = checkRule(players, ruleCard)
    const next = (winner + 1) % players.length
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
      {gameEnd ?
        <div className="game_end">Победа</div>
        :
        <>
          <Hand cards={players[current].hand} clickHandler={handClickHandler} />
          <div className="buttons">
            <div className="button" style={{ backgroundColor: red }} onClick={passClickHandler}>Пас</div>
            {addToPaletteBtn ? <div className="button" onClick={addClickHandler}>Добавить в палитру</div> : null}
            {changeRuleBtn ? <div className="button" onClick={changeClickHandler}>Сменить правило</div> : null}
            {selectCard ? <div className="text">Выберите карту</div> : null}
            {endTurnBtn ? <div className="button" onClick={endClickHandler}>Завершить ход</div> : null}
          </div>
        </>
      }

    </div>
  )
}