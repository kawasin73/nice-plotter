import React from 'react';
import styled from 'styled-components'
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

const Handle = Slider.Handle;

const Container = styled.div`
display: flex;
flex-direction: row;
`;

const SliderWrap = styled.div`
padding: 30px;
`;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={true}
      placement="right"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

export default function Panel(props) {
  return (
    <Container>
      <SliderWrap>
        <Slider
          vertical={true}
          value={props.pointCount}
          onChange={props.onUpdatePointer}
          min={1}
          max={10}
          dots={true}
          marks={{ 1: "1", 10: "10" }}
          handle={handle}
        />
      </SliderWrap>
      <div>
        <p>{props.count}/{props.maxCount}</p>
        <p onClick={props.onPlotMode}>書き込み</p>
        <p onClick={props.onEracerMode}>消去</p>
        <p onClick={props.onReducerMode}>間引く</p>
        <p onClick={props.onAutoFit}>いい感じ</p>
        <p onClick={props.onPrev}>戻る{props.canPrev ? "ok" : "false"}</p>
        <p onClick={props.onNext}>進む{props.canNext ? "ok" : "false"}</p>
      </div>
    </Container>
  )
}
