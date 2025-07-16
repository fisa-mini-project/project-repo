
import React from 'react';
import { fontSizes, fontSizeMap } from '../constants/fontSizes';
import { useFontSize } from '../contexts/FontSizeContext';

// const fontSizes = ['small', 'medium', 'large', 'xlarge'];
// const fontSizeMap = {
//   small: '1rem',
//   medium: '1.25rem',
//   large: '1.5rem',
//   xlarge: '1.75rem',
// };

const FontSizeToggle = ({}) => {

  const {fontSizeLevel, setFontSizeLevel} = useFontSize();

  const handleClick = () => {
    const currentIndex = fontSizes.indexOf(fontSizeLevel);
    const nextIndex = (currentIndex + 1) % fontSizes.length;
    const nextSize = fontSizes[nextIndex];
    setFontSizeLevel(nextSize);
  };

  return (
    <button className="font-size-button" onClick={handleClick}>
     글자 크기: {fontSizeLevel}
    </button>
  );
};

export default FontSizeToggle;
