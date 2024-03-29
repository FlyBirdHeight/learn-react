import React from "react"

function TextMemo(props){ //子组件
    console.log('子组件渲染')
    return <div>hello,world</div> 
}
const controlIsRender = (pre,next)=>{
   return ( pre.number === next.number ) ||  (pre.number !== next.number && next.number > 5) // number不改变或number 改变但值大于5->不渲染组件 | 否则渲染组件
}
const NewTexMemo = React.memo(TextMemo,controlIsRender)
export default class ReactMemoHome extends React.Component{
    constructor(props){
        super(props)
        this.state={
            number:1,
            num:1
        }
    }
    render(){
        const { num , number }  = this.state
        return <div>
            <div>
                改变num：当前值 { num }  
                <button onClick={ ()=>this.setState({ num:num + 1 }) } >num++</button>
                <button onClick={ ()=>this.setState({ num:num - 1 }) } >num--</button>  
            </div>
            <div>
                改变number： 当前值 { number } 
                <button onClick={ ()=>this.setState({ number:number + 1 }) } > number ++</button>
                <button onClick={ ()=>this.setState({ number:number - 1 }) } > number -- </button>  
            </div>
            <NewTexMemo num={ num } number={number}  />
        </div>
    }
}