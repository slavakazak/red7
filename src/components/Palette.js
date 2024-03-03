import Card from "./Card"
import { useState } from "react"

export default function Palette({ player }) {
	const [active, setActive] = useState(false)

	function clickHandler() {
		setActive(prev => !prev)
	}

	return (
		<div className="palette">
			<div className={"profile" + (active ? ' active' : '')} onClick={clickHandler}>{active ? player.name : player.name.substring(0, 2)}</div>
			{player.loss ?
				<div className="text">Пас</div>
				:
				<>
					<div className="cards">
						{player.palette.map((card, i) => <Card key={i} {...card} />)}
					</div>
					<div className={'score' + (player.win ? ' win' : '')}>
						<span>{player.numOfWinCards}</span>
						{player.maxWinCard ? <span style={{ color: player.maxWinCard.color.hue }}>{player.maxWinCard.value}</span> : null}
					</div>
				</>
			}

		</div>
	)
}