import { colors, values } from "./const";

export default class Deck {
	constructor() {
		this.cards = []
		for (let value of values) {
			for (let color of colors) {
				this.cards.push({ value, color, active: false })
			}
		}
	}
	shuffle() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
		}
	}
	deal(numberOfCards) {
		if (this.cards.length < numberOfCards) console.log('Недостаточно карт в колоде')
		return this.cards.splice(0, numberOfCards)
	}
}