import styled from '@emotion/styled'

export const Button = styled.button`
  box-sizing: border-box;
  background-color: white;
  color: black;
  border: 0;
  transition: all 200ms;
  font-size: 24px;
  width: 32px;
  height: 32px;
  font-weight: 900;
  border-radius: 60px;
  cursor: pointer;

  :hover {
    opacity: 0.9;
  }
`

export const ErrorDescription = styled.div``
export const DescriptionText = styled.div`
  align-self: center;
  font-size: 40px;
  font-weight: 900;
`

export const Spacer = styled.div`
  height: 90px;
`

export const Spinner = styled.div`
  height: 30px;
  width: 30px;
  border: 1px solid white;
  border-radius: 50%;
  border-top: none;
  border-right: none;
  margin: 16px auto;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`

export const BaseBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 8px;
  border: 0;
  gap: 8px;
  height: 60px;
  color: black;
`

export const Box = {
  Success: styled(BaseBox)`
    background-color: yellowgreen;
  `,
  Error: styled(BaseBox)`
    background-color: tomato;
  `,
}

export const Boundary = {
  Area: styled.div`
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    align-items: stretch;
    border: 4px solid white;
    border-radius: 16px;
    padding: 16px;
    flex: 1;
    min-height: 100px;
    max-width: 800px;
  `,

  Title: styled.h3`
    position: absolute;
    margin: 0;
    left: 16px;
    top: -36px;
  `,
}
