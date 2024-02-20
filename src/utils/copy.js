export function copyCard(card) {
	return { ...card, color: { ...card.color } }
}
export function copyCards(cards) {
	return cards.map(card => copyCard(card))
}
export function copyPlayers(players) {
	return players.map(player => ({ ...player, hand: copyCards(player.hand), palette: copyCards(player.palette) }))
}