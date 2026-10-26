import styled from 'styled-components'

const StyledButton = styled.button`
  background: dodgerblue;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover {
    background: lightblue;
  }
`

export default StyledButton