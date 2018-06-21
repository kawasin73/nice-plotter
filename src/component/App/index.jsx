import React from 'react';
import Canvas from '../Canvas';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.manager = props.manager;
    this.updateOverlay = this.manager.updateOverlay.bind(this.manager);
    this.updateCanvas = this.manager.updateCanvas.bind(this.manager);
    this.onMouseDown = this.manager.onMouseDown.bind(this.manager);
    this.onMouseUp = this.manager.onMouseUp.bind(this.manager);
    this.onMouseMove = this.manager.onMouseMove.bind(this.manager);
  }

  render() {
    return (
      <div>
        <Canvas
          height={this.props.height}
          width={this.props.width}
          updateOverlay={this.updateOverlay}
          updateCanvas={this.updateCanvas}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
        />
      </div>
    )
  }
}
