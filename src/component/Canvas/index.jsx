import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
position: relative;
margin: 100px auto;
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

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    // avoid refs argument passed with null
    // URL: https://github.com/facebook/react/issues/8359#issuecomment-261907121
    this.updateCanvas = this.updateCanvas.bind(this);
    this.updateOverlay = this.updateOverlay.bind(this);
  }

  updateCanvas(canvas) {
    console.log("canvas set", canvas);
    this.props.updateCanvas(canvas);
  }

  updateOverlay(canvas) {
    console.log("overlay set", canvas);
    this.props.updateOverlay(canvas);
  }

  render() {
    const { height, width } = this.props;
    return (
      <Container style={{ height, width }}>
        <CanvasInner
          innerRef={this.updateCanvas}
          height={height}
          width={width}
        />
        <CanvasOver
          innerRef={this.updateOverlay}
          height={height}
          width={width}
          onMouseDown={this.props.onMouseDown}
          onTouchStart={this.props.onMouseDown}
          onMouseUp={this.props.onMouseUp}
          onTouchEnd={this.props.onMouseUp}
          onMouseMove={this.props.onMouseMove}
          onTouchMove={this.props.onMouseMove}
        />
      </Container>
    )
  }
}
