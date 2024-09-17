import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedComponent = ({ animation, children, ...props }) => {
	const [ref, inView] = useInView({
		triggerOnce: true,
	});

	return (
		<motion.div
			ref={ref}
			initial="initial"
			animate={inView ? "animate" : "initial"}
			variants={animation}
			{...props}
		>
			{children}
		</motion.div>
	);
};

export default AnimatedComponent;
