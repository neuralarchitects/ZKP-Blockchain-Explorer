import React from "react";
import "./style.scss";
import StatusBox from "../../ui/StatusBox";
import BoxIcon from "../../../icons/box";
import TransactionIcon from "../../../icons/transaction";
import { HiCheck } from "react-icons/hi";

export default function StatusBoxes({ serviceDeviceCount, zkpCount }) {
	return (
		<section className="status-container">
			<StatusBox
				loading={!serviceDeviceCount ? true : false}
				Icon={TransactionIcon}
				title={"Protocol Operations"}
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
				iconClass={"check-icon"}
				title={"Device Commitments"}
				value={15}
			/>
		</section>
	);
}
