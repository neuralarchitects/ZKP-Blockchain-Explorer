import React, { useEffect, useState } from 'react';
import './style.scss';
import Spinner from '../../Spinner';

const LetterAnimation = ({ text, isFinished }) => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
	const [animatedText, setAnimatedText] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
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
			setCurrentIndex(0);
			setAnimatedText(new Array(text.length).fill(''));
		}
	}, [isFinished, text]);

	return (
		<div className="hacker-container">
			<div className="low-res">
				{(isFinished == false && <Spinner type="double" />) || (
					<p className="glow">{text}</p>
				)}
			</div>
			<div className="word-container">
				{animatedText.map((char, index) => (
					<span
						key={index}
						className={`${
							isFinished && index < currentIndex ? 'glow' : ''
						} ${char == ' ' && 'space-only'}`}
					>
						{char}
					</span>
				))}
			</div>
		</div>
	);
};

export default LetterAnimation;
