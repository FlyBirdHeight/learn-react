import React from "react"
class Index extends React.Component{ //子组件
    state={
        stateNumA:0,
        stateNumB:0
    }
    shouldComponentUpdate(newProp,newState,newContext){
        if(newProp.propsNumA !== this.props.propsNumA || newState.stateNumA !== this.state.stateNumA ){
            return true /* 只有当 props 中 propsNumA 和 state 中 stateNumA 变化时，更新组件  */
        }
        return false 
    }
    render(){
        console.log('组件渲染')
        const { stateNumA ,stateNumB } = this.state
        return <div>
            <button onClick={ ()=> this.setState({ stateNumA: stateNumA + 1 }) } >改变state中numA</button>
            <button onClick={ ()=> this.setState({ stateNumB: stateNumB + 1 }) } >改变stata中numB</button>
            <div>hello,let us learn React!</div>
        </div>
    }
}
export default function ShouldUpdateHome(){ // 父组件
    const [ numberA , setNumberA ] = React.useState(0)
    const [ numberB , setNumberB ] = React.useState(0)
    return <div>
        <button onClick={ ()=> setNumberA(numberA + 1) } >改变props中numA</button>
        <button onClick={ ()=> setNumberB(numberB + 1) } >改变props中numB</button>
        <Index propsNumA={numberA}  propsNumB={numberB}   />
    </div>
}