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
import DeviceDataZkp from "../views/device-data-zkp";
import CommitmentData from "../views/commitment";

export const usePageStore = create((set) => ({
  searchString: "",
  pages: [
    {
      route: "/",
      title: "Transactions",
      key: "transactions",
      component: <Dashboard />,
      Icon: DashboardIcon,
    },
    /* {
			route: "/tx",
			title: "Transactions",
			key: "transactions",
			component: <AllTransactionsPage />,
			Icon: HiOutlineCash,
		}, */
    {
      route: "/shared-devices",
      title: "Shared Devices",
      key: "devices",
      component: <Devices />,
      Icon: HiOutlineDeviceMobile,
    },
    {
      route: "/published-services",
      title: "Published Services",
      key: "services",
      component: <Services />,
      Icon: HiOutlineDocumentText,
    },
    {
      route: "/device-commitments",
      title: "Device Commitments",
      key: "device commitments",
      component: <CommitmentData />,
      Icon: HiOutlineDeviceMobile,
    },
    {
      route: "/device-data-zkp",
      title: "Device Data+ZKP",
      key: "device commitments",
      component: <DeviceDataZkp />,
      Icon: HiOutlineDeviceMobile,
    },
    {
      route: "/search",
      key: "search",
      component: <SearchPage />,
      hidden: true,
    },
    {
      route: "/tx/:id",
      key: "transaction-detail",
      component: <TransactionDetail />,
      hidden: true,
    },
  ],
  setSearch: (string) => set({ searchString: String(string) }),
}));
