export default function Card({ value, color, active, onClick }) {
	return (
		<div
			className={'card' + (active ? ' active' : '')}
			style={{ backgroundColor: color ? color.hue : '#616161' }}
			onClick={onClick}
		>
			{value ? <div className="value">{value}</div> : null}
			{color ? <div className="rule">{color.rule}</div> : null}
		</div>
	)
}