
import React from 'react';
import { fontSizes, fontSizeMap } from '../constants/fontSizes';
import { useFontSize } from '../contexts/FontSizeContext';
import styled from 'styled-components'
// const fontSizes = ['small', 'medium', 'large', 'xlarge'];
// const fontSizeMap = {
//   small: '1rem',
//   medium: '1.25rem',
//   large: '1.5rem',
//   xlarge: '1.75rem',
// };
const Button = styled.button`
position: fixed; 
bottom: 10rem; 
right: 1rem;
  background-color: #007acc;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8em 1.5em;
  font-size: 1em;
  cursor: pointer;
  width: 85%;
  max-width: 300px;
  transition: background-color 0.2s ease-in-out;
    z-index: 10000; 

  &:hover {
    background-color: #005999;
  }

  &:focus {
    outline: 3px solid #ffffff;
    outline-offset: 2px;
  }
`

const FontSizeToggle = ({}) => {

  const {fontSizeLevel, setFontSizeLevel} = useFontSize();

  const handleClick = (e) => {
    e.stopPropagation();
    const currentIndex = fontSizes.indexOf(fontSizeLevel);
    const nextIndex = (currentIndex + 1) % fontSizes.length;
    const nextSize = fontSizes[nextIndex];
    setFontSizeLevel(nextSize);
  };

  return (
    <Button onClick={handleClick}>
     글자 크기: {fontSizeLevel}
    </Button>
  );
};

export default FontSizeToggle;
