// store.js
import { create } from "zustand";
import WebIcon from "../icons/web";
import Dashboard from "../views/dashboard";
import {
	HiOutlineCash,
	HiOutlineDeviceMobile,
	HiOutlineDocumentText,
} from "react-icons/hi";
import Services from "../views/services";
import Devices from "../views/devices";
import SearchPage from "../views/search";
import AllTransactionsPage from "../views/all-transactions";
import TransactionDetail from "../views/transaction-detail";
import DashboardIcon from "../components/ui/icons/Dashboard";

export const usePageStore = create((set) => ({
	searchString: "",
	pages: [
		{
			route: "/",
			title: "Dashboard",
			key: "dashboard",
			component: <Dashboard />,
			Icon: DashboardIcon,
		},
		{
			route: "/transactions",
			title: "All Operations",
			key: "transactions",
			component: <AllTransactionsPage />,
			Icon: HiOutlineCash,
		},
		{
			route: "/published-services",
			title: "Services",
			key: "services",
			component: <Services />,
			Icon: HiOutlineDocumentText,
		},
		{
			route: "/shared-devices",
			title: "Devices",
			key: "devices",
			component: <Devices />,
			Icon: HiOutlineDeviceMobile,
		},
		{
			route: "/search",
			key: "search",
			component: <SearchPage />,
			hidden: true,
		},
		{
			route: "/transactions/:id",
			key: "transaction-detail",
			component: <TransactionDetail />,
			hidden: true,
		},
	],
	setSearch: (string) => set({ searchString: String(string) }),
}));
