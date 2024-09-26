// store.js
import { create } from "zustand";
import WebIcon from "../icons/web";
import Dashboard from "../views/dashboard";
import { HiOutlineDeviceMobile, HiOutlineDocumentText } from "react-icons/hi";
import Services from "../views/services";
import Devices from "../views/devices";
import SearchPage from "../views/search";

export const usePageStore = create((set) => ({
	searchString: "",
	currentPage: "dashboard",
	pages: [
		{
			title: "Dashboard",
			key: "dashboard",
			component: <Dashboard />,
			Icon: WebIcon,
		},
		{
			title: "Services",
			key: "services",
			component: <Services />,
			Icon: HiOutlineDocumentText,
		},
		{
			title: "Devices",
			key: "devices",
			component: <Devices />,
			Icon: HiOutlineDeviceMobile,
		},
		{
			key: "search",
			component: <SearchPage />,
			hidden: true,
		},
	],
	setPage: (page) => set({ currentPage: page }),
	setSearch: (string) => set({ searchString: String(string) }),
}));
