export default function copyPlayers(players) {
  return players.map(player => ({ ...player }))
}