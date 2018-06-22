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
      <p onClick={props.onReducerMode}>間引く</p>
      <p onClick={props.onAutoFit}>いい感じ</p>
      <p onClick={props.onPrev}>戻る{props.canPrev ? "ok" : "false"}</p>
      <p onClick={props.onNext}>進む{props.canNext ? "ok" : "false"}</p>
    </Container>
  )
}
