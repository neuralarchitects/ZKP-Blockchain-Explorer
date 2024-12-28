import './App.scss';

import Footer from './components/containers/Footer';
import SideBar from './components/containers/SideBar';
import { usePageStore } from './store/store';
import NotFound from './views/not-found';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
	const { pages } = usePageStore();

	return (
		<Router>
			<main className="main-container">
				<SideBar />
				<div className="content-container">
					<div className="real-container">
						<Routes>
							{pages.map((thePage, index) => (
								<Route
									key={index}
									path={thePage.route}
									element={thePage.component}
								/>
							))}

							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
					<Footer />
				</div>
			</main>
		</Router>
	);
}

export default App;
