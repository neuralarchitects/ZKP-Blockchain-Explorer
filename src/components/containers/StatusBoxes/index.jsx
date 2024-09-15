import React from "react";
import "./style.scss";
import Block from "../../ui/Block";
import StatusBox from "../../ui/StatusBox";
import WalletIcon from "../../../icons/wallet";
import BoxIcon from "../../../icons/box";
import TimerIcon from "../../../icons/timer";
import TransactionIcon from "../../../icons/transaction";

export default function StatusBoxes() {
	return (
		<section className="status-container">
			<header className="header-container">
				<h2 className="title">Latest blocks</h2>
				<p className="desc">
					Network Utilization: <span className="percent">0.00%</span>
				</p>
			</header>
			<div className="data-container">
				<div className="latest-blocks">
					<Block blockId={"2109884"} time={"in 2s"} />
					<Block blockId={"2109883"} time={"2s ago"} />
				</div>
				<div className="status-boxes">
					<StatusBox
						Icon={BoxIcon}
						title={"Total Blocks"}
						value={"2,109,461"}
					/>
					<StatusBox
						Icon={TimerIcon}
						title={"Average Block Time"}
						value={"4.0s"}
					/>
					<StatusBox
						Icon={TransactionIcon}
						title={"Total Transactions"}
						value={"10,821"}
					/>
					<StatusBox
						Icon={WalletIcon}
						title={"Wallet Addresses"}
						value={"1,936"}
					/>
				</div>
			</div>
		</section>
	);
}
