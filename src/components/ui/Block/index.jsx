import React from "react";
import "./style.scss";
import BoxIcon from "../../../icons/box";

export default function Block({ blockId, time }) {
	return (
		<div className="block-container">
			<div className="block-header">
				<BoxIcon className={"icon"} />
				<h3>{blockId}</h3>
				<p>{time}</p>
			</div>

			<section className="content">
				<div className="titles">
					<p>Txn</p>
					<p>Reward</p>
					<p>Miner</p>
				</div>
				<div className="info">
					<p>0</p>
					<p>0</p>
					<p className="miner">0x00...0000</p>
				</div>
			</section>
		</div>
	);
}
