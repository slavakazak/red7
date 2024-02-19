import Card from "./Card"

export default function Palette({ player }) {
  return (
    <div className="palette">
      <div className="profile">{player.name}</div>
      <div className="cards">
        {player.palette.map((card, i) => <Card key={i} {...card} />)}
      </div>
      <div className={'score' + (player.win ? ' win' : '')}>
        <span>{player.numOfWinCards}</span>
        {player.maxWinCard ? <span style={{ color: player.maxWinCard.color.hue }}>{player.maxWinCard.value}</span> : null}
      </div>
    </div>
  )
}