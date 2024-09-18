import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const AnimatedWidth = ({ children, duration, ...props }) => {
	const controls = useAnimation();

	useEffect(() => {
		controls.start({ width: "100%", overflow: "initial" });
	}, [controls]);

	return (
		<motion.div
			initial={{ width: 0 }}
			style={{ overflow: "hidden" }}
			animate={controls}
			transition={{
				duration: duration ? duration : 1,
				ease: "easeInOut",
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
};

export default AnimatedWidth;
