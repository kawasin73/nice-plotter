import React from 'react';
import styled from 'styled-components'
import Canvas from '../Canvas';
import Panel from '../Panel';
import { MODE_WRITE, MODE_ERASER, MODE_REDUCER } from '../../logics';


const Container = styled.div`
display: flex;
flex-direction: row;
width: 1100px;
margin: 0 auto;
`;

const CanvasWrap = styled.div`
flex-basis: 700px;
`;

const PanelWrap = styled.div`
flex-basis: 400px;
`;

const dummyState = {};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const m = this.manager = props.manager;
    this.updateOverlay = this.bindManagerFunc(m.updateOverlay, m);
    this.updateCanvas = this.bindManagerFunc(m.updateCanvas, m);
    this.onUpdatePointer = this.bindManagerFunc(m.updatePointCount, m);
    this.onDownload = this.bindManagerEventFunc(m.download, m);
    this.onMouseDown = this.bindManagerEventFunc(m.onMouseDown, m);
    this.onMouseUp = this.bindManagerEventFunc(m.onMouseUp, m);
    this.onMouseMove = this.bindManagerEventFunc(m.onMouseMove, m);
    this.onPlotMode = this.bindManagerEventFunc(m.changeMode, m, MODE_WRITE);
    this.onEracerMode = this.bindManagerEventFunc(m.changeMode, m, MODE_ERASER);
    this.onReducerMode = this.bindManagerEventFunc(m.changeMode, m, MODE_REDUCER);
    this.onAutoFit = this.bindManagerEventFunc(m.autoFit, m);
    this.onNext = this.bindManagerEventFunc(m.goNext, m);
    this.onPrev = this.bindManagerEventFunc(m.goPrev, m);
  }

  bindManagerFunc(fn, manager, ...args1) {
    const f = fn.bind(manager, ...args1);
    return (...args2) => {
      f(...args2);
      this.setState(dummyState);
      return false;
    }
  }

  bindManagerEventFunc(fn, manager, ...args1) {
    const f = fn.bind(manager, ...args1);
    return (...args2) => {
      f(...args2);
      const event = args2[args2.length - 1];
      event.preventDefault();
      this.setState(dummyState);
      return false;
    }
  }

  render() {
    return (
      <Container>
        <CanvasWrap>
          <Canvas
            height={this.props.height}
            width={this.props.width}
            updateOverlay={this.updateOverlay}
            updateCanvas={this.updateCanvas}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseMove={this.onMouseMove}
          />
        </CanvasWrap>
        <PanelWrap>
          <Panel
            count={this.manager.count}
            maxCount={this.manager.maxCount}
            pointCount={this.manager.pointCount}
            mode={this.manager.mode}
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
        </PanelWrap>
      </Container>
    )
  }
}
