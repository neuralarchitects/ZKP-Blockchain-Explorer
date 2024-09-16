import React from "react";
import "./style.scss";
import StatusBox from "../../ui/StatusBox";
import BoxIcon from "../../../icons/box";
import TransactionIcon from "../../../icons/transaction";
import { HiCheck } from "react-icons/hi";

export default function StatusBoxes() {
	return (
		<section className="status-container">
			<StatusBox
				Icon={TransactionIcon}
				title={"Total Transactions in Smart Contracts"}
				value={"541,019"}
			/>
			<StatusBox Icon={BoxIcon} title={"Total ZKPs"} value={"1,241"} />
			<StatusBox Icon={HiCheck} title={"Verified ZKPs"} value={"751"} />
		</section>
	);
}
