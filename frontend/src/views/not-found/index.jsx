import React from "react";
import "./style.scss";
import { HiExclamation } from "react-icons/hi";

export default function NotFound() {
	return <main className="not-found-container">
        <HiExclamation className="icon" />
        <h1>404 Not Found</h1>
    </main>;
}
