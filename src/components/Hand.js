import Card from "./Card"

export default function Hand({ cards, clickHandler }) {
  return (
    <div className="hand">
      {cards.map((card, i) => <Card key={i} {...card} onClick={clickHandler(i)} />)}
    </div>
  )
}