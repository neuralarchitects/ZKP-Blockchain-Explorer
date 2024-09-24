// store.js
import { create } from "zustand";
import WebIcon from "../icons/web";
import Dashboard from "../views/dashboard";
import { HiOutlineDeviceMobile, HiOutlineDocumentText } from "react-icons/hi";
import Services from "../views/services";
import Devices from "../views/devices";

export const usePageStore = create((set) => ({
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
	],
	setPage: (page) => set({ currentPage: page }),
}));
