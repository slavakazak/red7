import copyPlayers from "./copyPlayers"

export default function checkRule(players, ruleCard) {
  const newPlayers = copyPlayers(players)
  //очистка
  newPlayers.forEach(player => {
    player.win = false
    player.numOfWinCards = 0
    player.maxWinCard = null
    player.hand.forEach(card => {
      card.accToRule = false
      card.active = false
    })
    player.palette.forEach(card => {
      card.accToRule = false
      card.active = false
    })
  })
  //проверка правила для каждого игрока
  newPlayers.forEach(player => {
    if (player.palette.length) {
      player.palette.sort((a, b) => (a.value > b.value || (a.value === b.value && a.color.value > b.color.value)) ? -1 : 1)
      if (ruleCard.color.value === 1) { //Больше всего карт номиналом меньше 4
        player.palette = player.palette.map(a => ({ ...a, accToRule: a.value < 4 }))
      } else if (ruleCard.color.value === 2) { //Больше всего карт, идущих по порядку
        let order = [player.palette[0]]
        let maxOrder = [player.palette[0]]
        for (let i = 1; i < player.palette.length; i++) {
          if (order[order.length - 1].value - player.palette[i].value === 1) order.push(player.palette[i])
          if (order.length > maxOrder.length) maxOrder = order
          if (order[order.length - 1].value - player.palette[i].value > 1) order = [player.palette[i]]
        }
        maxOrder.forEach(card => card.accToRule = true)
      } else if (ruleCard.color.value === 3) { //Больше всего карт разных цветов
        const diffСolors = [player.palette[0]]
        for (let i = 1; i < player.palette.length; i++) {
          if (!diffСolors.find(a => a.color.value === player.palette[i].color.value)) diffСolors.push(player.palette[i])
        }
        diffСolors.forEach(card => card.accToRule = true)
      } else if (ruleCard.color.value === 4) { //Больше всего чётных карт
        player.palette = player.palette.map(a => ({ ...a, accToRule: a.value % 2 === 0 }))
      } else if (ruleCard.color.value === 5) { //Больше всего карт одного цвета
        let maxSameColors = []
        for (let i = 0; i < player.palette.length; i++) {
          let sameColors = [player.palette[i]]
          for (let j = i + 1; j < player.palette.length; j++) {
            if (sameColors[0].color.value === player.palette[j].color.value) sameColors.push(player.palette[j])
          }
          if (sameColors.length > maxSameColors.length) maxSameColors = sameColors
        }
        maxSameColors.forEach(card => card.accToRule = true)
      } else if (ruleCard.color.value === 6) { //Больше всего карт одного номинала
        let maxSame = []
        for (let i = 0; i < player.palette.length; i++) {
          let same = [player.palette[i]]
          for (let j = i + 1; j < player.palette.length; j++) {
            if (same[0].value === player.palette[j].value) same.push(player.palette[j])
          }
          if (same.length > maxSame.length) maxSame = same
        }
        maxSame.forEach(card => card.accToRule = true)
      } else { //Старшая карта
        player.palette[0].accToRule = true
      }
    }
  })
  //подсчёт победных карт
  newPlayers.forEach(player => {
    player.numOfWinCards = 0
    player.maxWinCard = null
    player.palette.forEach(card => {
      if (card.accToRule) player.numOfWinCards++
      if (card.accToRule && !player.maxWinCard) player.maxWinCard = card
    })
  })
  //поиск победителя
  let winner = 0
  newPlayers.forEach((player, i) => {
    if (player.numOfWinCards > newPlayers[winner].numOfWinCards) {
      winner = i
    } else if (player.numOfWinCards === newPlayers[winner].numOfWinCards) {
      const playerMaxWinCardValue = player.maxWinCard ? player.maxWinCard.value : 0
      const winnerMaxWinCardValue = newPlayers[winner].maxWinCard ? newPlayers[winner].maxWinCard.value : 0
      const playerMaxWinCardColorValue = player.maxWinCard ? player.maxWinCard.color.value : 0
      const winnerMaxWinCardColorValue = newPlayers[winner].maxWinCard ? newPlayers[winner].maxWinCard.color.value : 0
      if (playerMaxWinCardValue > winnerMaxWinCardValue) {
        winner = i
      } else if (playerMaxWinCardValue == winnerMaxWinCardValue && playerMaxWinCardColorValue > winnerMaxWinCardColorValue) {
        winner = i
      }
    }
  })
  newPlayers[winner].win = true
  return { newPlayers, winner }
}