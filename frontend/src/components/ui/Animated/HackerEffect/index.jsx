import React, { useEffect, useState } from 'react';
import './style.scss';

const LetterAnimation = ({ text, isFinished }) => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
	const [animatedText, setAnimatedText] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		// Animation effect for random letters
		const interval = setInterval(() => {
			setAnimatedText(() =>
				text
					.split('')
					.map((_, index) =>
						index < currentIndex
							? text[index]
							: alphabet[
									Math.floor(Math.random() * alphabet.length)
							  ]
					)
			);
		}, 75);

		return () => clearInterval(interval);
	}, [isFinished, currentIndex, text]);

	useEffect(() => {
		if (isFinished) {
			// Reveal letters one by one
			const revealInterval = setInterval(() => {
				setAnimatedText((prev) => {
					const newText = [...prev];
					newText[currentIndex] = text[currentIndex];
					return newText;
				});

				setCurrentIndex((prevIndex) => {
					if (prevIndex + 1 >= text.length) {
						clearInterval(revealInterval);
					}
					return prevIndex + 1;
				});
			}, 200);

			return () => clearInterval(revealInterval);
		} else {
			// Reset animation state
			setCurrentIndex(0);
			setAnimatedText(new Array(text.length).fill(''));
		}
	}, [isFinished, text]);

	useEffect(() => {
		// Reset state when the input text changes
		if (!isFinished) {
			setAnimatedText(new Array(text.length).fill(''));
			setCurrentIndex(0);
		}
	}, [text]);

	return (
		<div className="hacker-container">
			{animatedText.map((char, index) => (
				<span
					key={index}
					className={isFinished && index < currentIndex ? 'glow' : ''}
				>
					{char}
				</span>
			))}
		</div>
	);
};

export default LetterAnimation;
