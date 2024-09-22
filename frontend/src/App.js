import "./App.css";
import SideBar from "./components/containers/SideBar";
import Dashboard from "./views/dashboard";

function App() {
	return (
		<main className="main-container">
			<SideBar />
			<Dashboard />
		</main>
	);
}

export default App;
