import React from 'react';
import styled from 'styled-components'
import Canvas from '../Canvas';
import Panel from '../Panel';
import { MODE_WRITE, MODE_ERASER, MODE_REDUCER } from '../../logics';


const Container = styled.div`
display: flex;
flex-direction: row;
`;

const dummyState = {};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.manager = props.manager;
    this.updateOverlay = this.manager.updateOverlay.bind(this.manager);
    this.updateCanvas = this.manager.updateCanvas.bind(this.manager);
    this.onDownload = this.manager.download.bind(this.manager);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onPlotMode = this.onPlotMode.bind(this);
    this.onEracerMode = this.onEracerMode.bind(this);
    this.onReducerMode = this.onReducerMode.bind(this);
    this.onAutoFit = this.onAutoFit.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onUpdatePointer = this.onUpdatePointer.bind(this);
  }

  onMouseDown(e) {
    this.manager.onMouseDown(e);
    this.setState(dummyState);
    return false;
  }

  onMouseUp(e) {
    this.manager.onMouseUp(e);
    this.setState(dummyState);
    return false;
  }

  onMouseMove(e) {
    this.manager.onMouseMove(e);
    this.setState(dummyState);
    return false;
  }

  onPlotMode() {
    this.manager.changeMode(MODE_WRITE);
    this.setState(dummyState);
  }

  onEracerMode() {
    this.manager.changeMode(MODE_ERASER);
    this.setState(dummyState);
  }

  onReducerMode() {
    this.manager.changeMode(MODE_REDUCER);
    this.setState(dummyState);
  }

  onAutoFit() {
    this.manager.autoFit();
    this.setState(dummyState);
  }

  onNext() {
    this.manager.goNext();
    this.setState(dummyState);
  }

  onPrev() {
    this.manager.goPrev();
    this.setState(dummyState);
  }

  onUpdatePointer(count) {
    this.manager.updatePointCount(count);
    this.setState(dummyState);
  }

  render() {
    return (
      <Container>
        <Canvas
          height={this.props.height}
          width={this.props.width}
          updateOverlay={this.updateOverlay}
          updateCanvas={this.updateCanvas}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
        />
        <Panel
          count={this.manager.count}
          maxCount={this.manager.maxCount}
          pointCount={this.manager.pointCount}
          canPrev={this.manager.canPrev}
          canNext={this.manager.canNext}
          onPlotMode={this.onPlotMode}
          onEracerMode={this.onEracerMode}
          onReducerMode={this.onReducerMode}
          onAutoFit={this.onAutoFit}
          onNext={this.onNext}
          onPrev={this.onPrev}
          onUpdatePointer={this.onUpdatePointer}
          onDownload={this.onDownload}
        />
      </Container>
    )
  }
}
