import React from "react"
import { RecoilRoot, useRecoilState } from "recoil";
import MouseState from "./state/MouseState";


const Layout = props => {
    const [mouseState, setMouseState] = useRecoilState(MouseState);

    const w = props.width - (props.margin.left + props.margin.right),
        h = props.height - (props.margin.top + props.margin.bottom);

    const updatedChildren = React.Children.map(
        props.children,
        (child) => {
            return React.cloneElement(child, {
                w: w,
                h: h,
            })
        }
    )

    const transform = 'translate(' + props.margin.left + ',' + props.margin.top + ')';

    const onMouseMove = (offsetX) => {
        setMouseState(offsetX);
    }

    console.log("Render Layout");
    //onMouseMove={(e) => onMouseMove(e.nativeEvent.offsetX)}
    return (
        <svg id={props.chartId} width={props.width} height={props.height}  onMouseOut={() => onMouseMove(null)}>
            <g transform={transform}>

                {updatedChildren}
                {props.legend}
            </g>
        </svg>
    )
};

const RecoilLayout = props => {
    return (
        <RecoilRoot>
            <Layout {...props}/>
        </RecoilRoot>
    )
}

const MemoLayout = React.memo(RecoilLayout);

export default MemoLayout;