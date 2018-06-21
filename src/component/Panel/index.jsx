import React from 'react';
import styled from 'styled-components'


const Container = styled.div`
`;

export default function Panel(props) {
  return (
    <Container>
      <p>{props.count}/{props.maxCount}</p>
      <p onClick={props.onPlotMode}>書き込み</p>
      <p onClick={props.onEracerMode}>消去</p>
      <p onClick={props.onAutoFit}>いい感じ</p>
    </Container>
  )
}
