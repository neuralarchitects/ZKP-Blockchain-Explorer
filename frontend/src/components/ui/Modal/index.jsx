import React from "react";
import "./style.scss";
import { Modal } from "@mui/material";

export default function EModal({ isOpen, onClose, children }) {
	return (
		<Modal open={isOpen} onClose={onClose}>
			{children}
		</Modal>
	);
}
