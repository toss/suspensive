/** @jsxImportSource @emotion/react */
'use client'

import styled from '@emotion/styled'
import type { PropsWithChildren } from 'react'

export const Button = styled.button`
  box-sizing: border-box;
  background-color: white;
  color: black;
  border: 0;
  transition: all 200ms;
  font-size: 14px;
  width: 20px;
  height: 20px;
  font-weight: 900;
  border-radius: 60px;
  cursor: pointer;

  :hover {
    opacity: 0.9;
  }
`

const BaseDescription = styled.div``
export const Description = {
  Error: styled(BaseDescription)``,
  Success: styled(BaseDescription)``,
}

export const DescriptionText = styled.div`
  align-self: center;
  font-size: 8px;
  font-weight: 900;
`

export const Spinner = styled.div`
  height: 15px;
  width: 15px;
  border: 1px solid white;
  border-radius: 50%;
  border-top: none;
  border-right: none;
  margin: 8px auto;
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
  padding: 8px 16px;
  border-radius: 8px;
  border: 0;
  gap: 8px;
  color: black;
  transition: all 200ms;
  animation: fadein 200ms;
  font-size: 12px;

  :hover {
    opacity: 0.8;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
export const Box = {
  Success: styled(BaseBox)`
    background-color: yellowgreen;
  `,
  Error: styled(BaseBox)`
    background-color: tomato;
  `,
  Default: styled(BaseBox)`
    background-color: white;
  `,
}

export const Area = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <AreaStyled.Wrapper>
    <AreaStyled.Title>{title}</AreaStyled.Title>
    <AreaStyled.Content>{children}</AreaStyled.Content>
  </AreaStyled.Wrapper>
)

const AreaStyled = {
  Wrapper: styled.div`
    flex: 1;
    max-width: 600px;
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    border: 2px solid white;
    border-radius: 16px;
    padding: 6px;
    gap: 8px;
  `,

  Title: styled.h2`
    margin: 0;
    margin-left: 10px;
    margin-bottom: 2px;
    font-size: 14px;
  `,
}

export const Flex = styled.div`
  display: flex;
`
