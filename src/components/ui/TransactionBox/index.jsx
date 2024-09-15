import React from "react";
import "./style.scss";
import Badge from "../Badge";
import { HiCheckCircle, HiInformationCircle } from "react-icons/hi";
import TransactionIcon from "../../../icons/transaction";

export default function TransactionBox() {
	return (
		<div className="transaction-box-container">
			<div className="left-data">
				<div className="badge">
					<Badge
						Icon={HiInformationCircle}
						color={"#2A4364"}
						text={"Contact Call"}
					/>
					<Badge
						Icon={HiCheckCircle}
						color={"#23543E"}
						text={"Success"}
					/>
				</div>
				<div className="transaction-hash">
					<TransactionIcon />
					<p>0awdklnjqoiw0912i9ka</p>
				</div>
			</div>
            <p className="transaction-time">2h ago</p>
		</div>
	);
}
