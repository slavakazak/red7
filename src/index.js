import "./styles/styles.scss"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./components/App"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyD3i4bX-NLL-s9ynYZYJrN4B7_-Kt3fW3g",
	authDomain: "red7-89257.firebaseapp.com",
	databaseURL: "https://red7-89257-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "red7-89257",
	storageBucket: "red7-89257.appspot.com",
	messagingSenderId: "258043137459",
	appId: "1:258043137459:web:02dac0ff6f16b59507cfc6"
}
const app = initializeApp(firebaseConfig)


const root = createRoot(document.getElementById("root"))

root.render(
	<StrictMode>
		<App />
	</StrictMode>
)