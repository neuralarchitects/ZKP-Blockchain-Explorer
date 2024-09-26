import "./App.scss";
import SideBar from "./components/containers/SideBar";
import { usePageStore } from "./store/store";
import NotFound from "./views/not-found";

function App() {
	const { currentPage, pages } = usePageStore();

	const renderPage = () => {
		const current = pages.find((page) => page.key === currentPage);
		return current ? current.component : <NotFound />;
	};

	return (
		<main className="main-container">
			<SideBar />
			<div className="content-container">{renderPage()}</div>
		</main>
	);
}

export default App;
