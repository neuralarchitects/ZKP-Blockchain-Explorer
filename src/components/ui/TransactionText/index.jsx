import { useState, useEffect } from "react";

const TransactionText = () => {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length < 3 ? prev + "." : ""));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return <p>Scanning New Transactions{dots}</p>;
};

export default TransactionText;
