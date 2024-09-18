import React from "react";
import "./style.scss";
import StatusBox from "../../ui/StatusBox";
import BoxIcon from "../../../icons/box";
import TransactionIcon from "../../../icons/transaction";
import { HiCheck } from "react-icons/hi";
import { useSocketConnection } from "../../../services/socket.io";

export default function StatusBoxes() {
	const { serviceDeviceCount, zkpCount } = useSocketConnection();

	return (
		<section className="status-container">
			<StatusBox
				loading={!serviceDeviceCount ? true : false}
				Icon={TransactionIcon}
				title={"Transactions in Smart Contracts"}
				value={serviceDeviceCount + zkpCount}
			/>
			<StatusBox
				loading={!serviceDeviceCount ? true : false}
				Icon={BoxIcon}
				title={"ZKPs"}
				value={zkpCount}
			/>
			<StatusBox
				loading={!serviceDeviceCount ? true : false}
				Icon={HiCheck}
				title={"Commitments"}
				value={15}
			/>
		</section>
	);
}
