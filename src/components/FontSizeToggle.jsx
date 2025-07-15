
import React from 'react';
import { fontSizes, fontSizeMap } from '../constants/fontSizes';

// const fontSizes = ['small', 'medium', 'large', 'xlarge'];
// const fontSizeMap = {
//   small: '1rem',
//   medium: '1.25rem',
//   large: '1.5rem',
//   xlarge: '1.75rem',
// };

const FontSizeToggle = ({ currentSize, onChange }) => {
  const handleClick = () => {
    const currentIndex = fontSizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % fontSizes.length;
    const nextSize = fontSizes[nextIndex];
    onChange(nextSize);
  };

  return (
    <button className="font-size-button" onClick={handleClick}>
     글자 크기: {currentSize}
    </button>
  );
};

export default FontSizeToggle;
