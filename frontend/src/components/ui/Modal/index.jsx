import React from "react";
import "./style.scss";
import { Modal } from "@mui/material";
import { HiX } from "react-icons/hi";

export default function EModal({
	isOpen,
	onClose,
	title = "",
	closable = false,
	className = "",
	children,
}) {
	return (
		<Modal className={`emodal-container`} open={isOpen} onClose={onClose}>
			<section className={`content-holder ${className}`}>
				<header className="header">
					<h1>{title}</h1>
					<HiX onClick={onClose} className="icon" />
				</header>
				{children}
			</section>
		</Modal>
	);
}
