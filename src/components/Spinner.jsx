import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const SpinnerElement = styled.div`
  margin: 1rem auto;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #ccc;
  border-top: 3px solid #007acc;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

export default function Spinner() {
  return <SpinnerElement />
}
