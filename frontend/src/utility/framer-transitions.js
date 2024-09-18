export function iphoneAnimation(duration) {
	return {
		initial: { opacity: 0, scale: 0.8 },
		animate: {
			opacity: 1,
			scale: 1,
			transition: { duration: duration ? duration : 0.5 },
		},
		transition: {
			type: "spring",
			stiffness: 200,
			damping: 20,
			beforeChildren: true,
		},
	};
}

export function fadeInUp(duration, distance) {
	return {
		initial: { opacity: 0, y: distance ? Number(distance) * -1 : -100 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: duration ? duration : 0.5 },
		},
	};
}

export function fadeInDown(duration, distance) {
	return {
		initial: { opacity: 0, y: distance ? distance : 100 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: duration ? duration : 0.5 },
		},
	};
}

export function fadeInRight(duration, distance) {
	return {
		initial: { opacity: 0, x: distance ? distance : 100 },
		animate: {
			opacity: 1,
			x: 0,
			transition: { duration: duration ? duration : 0.5 },
		},
	};
}

export function fadeInLeft(duration, distance) {
	return {
		initial: { opacity: 0, x: distance ? Number(distance) * -1 : -60 },
		animate: {
			opacity: 1,
			x: 0,
			transition: { duration: duration ? duration : 0.5 },
		},
	};
}
