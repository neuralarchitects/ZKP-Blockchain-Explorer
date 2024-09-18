import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const CountUpNumber = ({ targetNumber, duration }) => {
	const [displayNumber, setDisplayNumber] = useState(0);
	const controls = useAnimation();

	useEffect(() => {
		controls.start({
			count: targetNumber,
			transition: { duration: duration ? duration : 3, ease: "easeInOut" },
		});
	}, [controls, targetNumber]);

	return (
		<motion.div
			initial={{ count: 0 }}
			animate={controls}
			onUpdate={(latest) => {
				setDisplayNumber(Math.floor(latest.count));
			}}
		>
			{new Intl.NumberFormat().format(displayNumber)}
		</motion.div>
	);
};

export default CountUpNumber;
