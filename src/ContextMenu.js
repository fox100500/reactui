import React from "react";
import "./ContextMenu.css";

class ContextMenu extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hiden:true,
    };
  }

  componentDidMount() {
    console.log("CreateMenu")
  }

  Show(e,ticker){
    let menu = document.getElementById("mymenu");
    let menuItem=document.getElementById("cm_1");

    menuItem.innerText=ticker;
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    menu.classList.remove("hide");
  }

  componentWillUnmount() {

  }

  CreateOrder(){
    //props.updateData(item);
    console.log("CreateOrder")
    console.log(this.props)
  }
  
  CreateOrderBook(){
    //props.updateData(item);
    console.log("CreateOrderbook")
    console.log(this.props)
  }

  render() {
    return (
      <div className="b-popup hide" id="mymenu">
        <div className="b-popup-content">
          <div className="b-content underline" id="cm_1"></div>
          <div className="b-content" id="cm_2" onClick={() => this.CreateOrder()}> Заявка </div>
          <div className="b-content" id="cm_3" onClick={() => this.CreateOrderBook()}> Стакан </div>
        </div>
      </div>
    );
  }
}

export default ContextMenu;
