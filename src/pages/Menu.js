import { colors } from "../utils/const"
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function Menu() {
  return (
    <>
      <Header />
      <div className="menu">
        <Link className="button" to="/onlineLobby" style={{ backgroundColor: colors[4].hue }}>Онлайн</Link>
        <Link className="button" to="/offlineSettings" style={{ backgroundColor: colors[3].hue }}>Офлайн</Link>
        <Link className="button" to="/rules" style={{ backgroundColor: colors[1].hue }}>Правила</Link>
      </div>
    </>
  )
}