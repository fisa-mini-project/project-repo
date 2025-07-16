import styled from 'styled-components'

const Box = styled.div`
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1.5rem;
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

export const SummaryBox = ({ title, summary }) => {
  return (
    <Box>
      <Title>{title}</Title>
      <Body>{summary}</Body>
    </Box>
  )
}
