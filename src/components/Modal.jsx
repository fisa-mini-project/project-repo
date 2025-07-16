import styled from 'styled-components'

// const Box = styled.div`
//   background-color: #f9f9f9;
//   position: fixed;
//   padding: 1rem;
//   border-radius: 10px;
//   margin-top: 1.5rem;
//   text-align: left;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//   max-width: 90%;
//   margin-inline: auto;
//   white-space: pre-wrap;
// `
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

// 중앙 박스 (기존 Box 디자인 응용)
const Box = styled.div`
position: fixed;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  text-align: left;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  margin-inline: auto;
  white-space: pre-wrap;
`
const Title = styled.h4`
  color: #007acc;
  margin-bottom: 0.5rem;
`

const Body = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
`

// const ModalBackdrop = styled.div`
//   position: fixed;
//   top: 0; left: 0;
//   width: 100vw;
//   height: 100vh;
//   z-index: 1;
//   backdrop-filter: blur(8px);
// `;


export const Modal = ({ children, title, summary, onClose }) => {
    return (
        <>
            {/* <div onClick={onClose} data-cy="modal-backdrop" className='fixed top-0 left-0 w-full h-full backdrop-blur-md z-1'></div> */}
            {/* <ModalBackdrop onClick={onClose} data-cy="modal-backdrop" /> */}

            <Overlay onClick={onClose}>
                <Box>
                    <Title>{title}</Title>
                    <Body>{summary}</Body>
                    {children}
                </Box>
            </Overlay>
        </>

    )
}