import React from 'react';
import styled from 'styled-components'
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'rc-slider/assets/index.css';
import { MODE_WRITE, MODE_ERASER, MODE_REDUCER } from '../../logics';

const Handle = Slider.Handle;

const Container = styled.div`
margin: 80px auto;
display: flex;
flex-direction: row;
`;

const SliderWrap = styled.div`
padding: 30px;
`;

const Counter = styled.p`
color: #333;
text-align: right;
margin: 8px 16px;
font-size: 32px;
`;

const ButtonWrap = styled.div`
margin: 32px 0;
`;

const Button = styled.p`
cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
padding: 8px 16px;
margin: 16px;
color: #333;
border: solid;
border-width: 1px;
border-color: #ccc;
border-radius: 4px;
background-color: ${p => p.disabled ? '#eeeeee' : '#fff'};
opacity: ${p => p.disabled ? '0.65' : '1'};
&:hover {
  border-color: #adadad;
  background-color: #e6e6e6;
}
`;

const NiceButton = styled.p`
cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
padding: 8px 16px;
margin: 16px;
color: #333;
border: solid;
border-width: 1px;
border-color: #ccc;
border-radius: 4px;
background-color: ${p => p.disabled ? '#bdd6e0' : '#bdebff'};
opacity: ${p => p.disabled ? '0.65' : '1'};
&:hover {
  border-color: #adadad;
  background-color: #bdd6e0;
}
`;

const IconWrap = styled.span`
margin: 4px 8px;
`;

const Flex = styled.div`
display: flex;
flex-direction: row;
margin-top: -16px;
`;

const Icon = ({ icon }) => {
  return (
    <IconWrap>
      <FontAwesomeIcon icon={icon}/>
    </IconWrap>
  )
};

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
        <Counter>{props.count}/{props.maxCount}</Counter>
        <ButtonWrap>
          <NiceButton onClick={props.onAutoFit} disabled={props.count === 0 || props.count === props.maxCount}>
            <span>いい感じに {props.maxCount}個 にする</span>
          </NiceButton>
        </ButtonWrap>
        <ButtonWrap>
          <Button onClick={props.onPlotMode} disabled={props.mode === MODE_WRITE}>
            <Icon icon="paint-brush"/>
            書き込み
          </Button>
          <Button onClick={props.onEracerMode} disabled={props.mode === MODE_ERASER}>
            <Icon icon="trash-alt"/>
            消去
          </Button>
          <Button onClick={props.onReducerMode} disabled={props.mode === MODE_REDUCER}>
            <Icon icon="eraser"/>
            間引く
          </Button>
        </ButtonWrap>
        <Flex>
          <Button onClick={props.onPrev} disabled={!props.canPrev}>
            <Icon icon="undo"/>
            戻る
          </Button>
          <Button onClick={props.onNext} disabled={!props.canNext}>
            <Icon icon="redo"/>
            進む
          </Button>
        </Flex>
        <Button onClick={props.onDownload}>
          <Icon icon="download"/>
          ダウンロード
        </Button>
      </div>
    </Container>
  )
}
