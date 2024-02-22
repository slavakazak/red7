import { useEffect, useRef, useState } from "react"
import Palette from "./Palette"
import Hand from "./Hand"
import Card from "./Card"
import Deck from "../utils/Deck"
import Memo from "./Memo"
import checkRule from "../utils/checkRule"
import { copyPlayers, copyCard } from "../utils/copy"
import { colors, red } from "../utils/const"
import { getDatabase } from "firebase/database";

export default function App() {
  const deck = new Deck()
  deck.shuffle()
  const genPlayer = name => ({ name, hand: deck.deal(7), palette: deck.deal(1), win: false, loss: false, numOfWinCards: 0, maxWinCard: null })

  const defaultPlayers = useRef([genPlayer('A'), genPlayer('B'), genPlayer('C'), genPlayer('D')])
  const defaultRuleCard = useRef({ color: colors[6] })

  const [players, setPlayers] = useState(defaultPlayers.current)
  const [prevPlayers, setPrevPlayers] = useState(defaultPlayers.current)

  const [current, setCurrent] = useState(0)

  const [ruleCard, setRuleCard] = useState(defaultRuleCard.current)
  const [prevRuleCard, setPrevRuleCard] = useState(defaultRuleCard.current)

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
    setPlayers(copyPlayers(prevPlayers))
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
  useEffect(() => {
    const newPlayers = checkRule(defaultPlayers.current, defaultRuleCard.current)
    setPlayers(newPlayers)
    setPrevPlayers(copyPlayers(newPlayers))

    const winner = newPlayers.findIndex(player => player.win)
    const next = (winner + 1) % newPlayers.length
    setCurrent(next)

    const db = getDatabase()
    console.log(db)
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
      {players.filter(player => !player.loss).length === 1 ?
        <>
          <div className="info">Победа</div>
          <div className="buttons"></div>
        </>
        : startTurn ?
          <>
            {players[current].hand.length > 0 && !changed && !players[current].hand.find(card => card.active) ? <div className="info">Выберите карту</div> : null}
            <Hand cards={players[current].hand} clickHandler={handClickHandler} />
            <div className="buttons">
              <div className="button" style={{ backgroundColor: red }} onClick={passClickHandler}>Пас</div>
              {players[current].hand.find(card => card.active) && !changed && !added ? <div className="button" onClick={addClickHandler}>Добавить в палитру</div> : null}
              {players[current].hand.find(card => card.active) && !changed ? <div className="button" onClick={changeClickHandler}>Сменить правило</div> : null}
              {players[current].win ? <div className="button" onClick={endClickHandler}>Завершить ход</div> : null}
              {changed || added ? <div className="button" onClick={backClickHandler}>Назад</div> : null}
            </div>
          </>
          :
          <div className="buttons">
            <div className="button" onClick={startClickHandler}>Начать ход</div>
          </div>
      }
    </div>
  )
}