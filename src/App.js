import "./App.css";
import SideBar from "./components/SideBar";
import Dashboard from "./View/dashboard";

function App() {
	return (
		<main className="main-container">
			<SideBar />
      <Dashboard />
		</main>
	);
}

export default App;
