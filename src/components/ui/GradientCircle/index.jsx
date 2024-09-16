import React from 'react';
import './style.scss';

// Function to generate random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const GradientCircle = ({ width, height }) => {
  // Generate two random colors
  const color1 = getRandomColor();
  const color2 = getRandomColor();

  return (
    <div
      className="gradient-circle"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `linear-gradient(to bottom left, ${color1}, ${color2})`,
      }}
    ></div>
  );
};

export default GradientCircle;
