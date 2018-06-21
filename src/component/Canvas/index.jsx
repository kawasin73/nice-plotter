import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
position: relative;
`;

const CanvasInner = styled.canvas`
position: absolute;
z-index: 0;
border: black 1px solid;
`;

const CanvasOver = styled.canvas`
position: absolute;
z-index: 10;
border: black 1px solid;
`;

export default function Canvas(props) {
  const { height, width } = props;
  return (
    <Container style={{ height, width }}>
      <CanvasInner
        innerRef={(canvas) => {
          console.log("canvas set");
          props.updateCanvas(canvas);
        }}
        height={height}
        width={width}
      />
      <CanvasOver
        innerRef={(canvas) => {
          console.log("overlay set");
          props.updateOverlay(canvas);
        }}
        height={height}
        width={width}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onMouseMove={props.onMouseMove}
      />
    </Container>
  )
}
