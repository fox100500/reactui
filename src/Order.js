import React from "react";
import "./Order.css"; 

class Order extends React.Component {
  
  calcRisk(){
    let chMarket=document.getElementById("chMarketOrder")
    let chLimit=document.getElementById("chLimitOrder")
    let chTakeProfit = document.getElementById("chTakeProfit")
    let chStopLoss = document.getElementById("chStopLoss")
    let chIfLimit = document.getElementById("chIfLimit")
    let risk = document.getElementById("risk")

    if (chMarket.checked||chLimit.checked||chIfLimit.checked){
      if (!chTakeProfit.checked) {
        risk.innerText = "Нет данных TakeProfit";
        return
      }
      if (!chStopLoss.checked) {
        risk.innerText = "Нет данных StopLoss";
        return
      }

      let profit = document.getElementById("inputTakeProfitPrice").value
      let loss = document.getElementById("inputStopLossPrice").value
      let price = document.getElementById("inputMainPrice").value

      let profitVal = profit-price
      let lossVal = price-loss
      
      if (lossVal!==0){
        risk.innerText = "Прибыль("+(profitVal/price*100).toFixed(1)+")/убыток("+(lossVal/price*100).toFixed(1)+") = "+(profitVal/lossVal).toFixed(1);
      }else{
        risk.innerText = "Некорректные данные";
      }
    }else{
      risk.innerText = "Нет данных PriceOrder"
    }
  }

  handleInputChange(e){
    console.log("onChange")

    if ((e.target.id==="inputTakeProfitPrice")||(e.target.id==="inputStopLossPrice")){
      this.calcRisk();
    }
  }

  handleCheckboxChange(e){
    //чекбоксы
    let chMarket=document.getElementById("chMarketOrder")
    let chLimit=document.getElementById("chLimitOrder")
    let chTakeProfit = document.getElementById("chTakeProfit")
    let chStopLoss = document.getElementById("chStopLoss")
    let chIfLimit = document.getElementById("chIfLimit")
    let chTrailingStop = document.getElementById("chTrailingStop")
    //поля ввода
    let inpMainPrice=document.getElementById("inputMainPrice")
    let inpMainLots=document.getElementById("inputMainLots")
    let inpTakeProfitPrice=document.getElementById("inputTakeProfitPrice")
    let inpTakeProfitLots=document.getElementById("inputTakeProfitLots")
    let inpStopLossPrice=document.getElementById("inputStopLossPrice")
    let inpStopLossLots=document.getElementById("inputStopLossLots")
    let inpTrailingSize=document.getElementById("inputTrailingSize")
    //кнопки
    let btnBuy = document.getElementById("btnBuy")
    let btnSell = document.getElementById("btnSell")
    let btnAddTakeStopOrders=document.getElementById("btnAddTakeStopOrders")
    let btnAddTrailingStop=document.getElementById("btnAddTrailingStop")
    //info

    switch(e.target.id){
      case "chMarketOrder":
        if (chMarket.checked){
          chLimit.checked = false;
          chIfLimit.checked = false;

          inpMainPrice.disabled = true;
          inpMainPrice.value = this.props.item.close;
          
          inpMainLots.disabled = false;
          inpMainLots.value = this.props.item.balance;

          btnBuy.disabled = false;
          btnSell.disabled = false;
          btnAddTakeStopOrders.disabled = true;
        }else{
          inpMainPrice.disabled = true;
          inpMainLots.disabled = true;
          inpMainPrice.value = "не доступно";
          inpMainLots.value = "не доступно";
          if ((!chLimit.checked)&&(!chIfLimit.checked)){
            btnBuy.disabled = true;
            btnSell.disabled = true;
            if (chTakeProfit.checked||chStopLoss.checked){
              btnAddTakeStopOrders.disabled = false;
            }
          }
        }

        this.calcRisk();
        break;
      case "chLimitOrder":
        if (chLimit.checked){
          chMarket.checked = false;
          chIfLimit.checked = false;

          inpMainPrice.disabled = false;
          inpMainPrice.value = this.props.item.close;
          
          inpMainLots.disabled = false;
          inpMainLots.value = this.props.item.balance;

          btnBuy.disabled = false;
          btnSell.disabled = false;
          btnAddTakeStopOrders.disabled = true;
        }else{
          inpMainPrice.disabled = true;
          inpMainLots.disabled = true;
          inpMainPrice.value = "не доступно";
          inpMainLots.value = "не доступно";
          

          if ((!chMarket.checked)&&(!chIfLimit.checked)){
            btnBuy.disabled = true;
            btnSell.disabled = true;
            if (chTakeProfit.checked||chStopLoss.checked){
              btnAddTakeStopOrders.disabled = false;
            }
          }
        }

        this.calcRisk();
        break;
      case "chIfLimit":
        if (chIfLimit.checked){
          chMarket.checked = false;
          chLimit.checked = false;

          inpMainPrice.disabled = false;
          
          if (this.props.item.balance>0){
            inpMainPrice.value = this.props.item.close;
          }else{
            inpMainPrice.value = this.props.item.close;
          }
              
          inpMainLots.disabled = false;
          inpMainLots.value = this.props.item.balance;
    
          btnBuy.disabled = false;
          btnSell.disabled = false;
          btnAddTakeStopOrders.disabled = true;
        }else{
          inpMainPrice.disabled = true;
          inpMainPrice.value = "не доступно";
              
          inpMainLots.disabled = true;
          inpMainLots.value = "не доступно";
    
          if ((!chMarket.checked)&&(!chLimit.checked)){
            btnBuy.disabled = true;
            btnSell.disabled = true;
            if (chTakeProfit.checked||chStopLoss.checked){
              btnAddTakeStopOrders.disabled = false;
            }
          } 
          
        }
        this.calcRisk();
        break;
      case "chTakeProfit":
        if (chTakeProfit.checked){
          inpTakeProfitPrice.disabled = false;
          if (this.props.item.balance>0){
            inpTakeProfitPrice.value = this.props.item.close*1.05;
          }else{
            inpTakeProfitPrice.value = this.props.item.close*0.95;
          }
            
          inpTakeProfitLots.disabled = false;
          inpTakeProfitLots.value = this.props.item.balance;
  
          if (!(chLimit.checked||chMarket.checked||chIfLimit.checked)){
            btnAddTakeStopOrders.disabled = false;
          }
        }else{
          inpTakeProfitPrice.disabled = true;
          inpTakeProfitPrice.value = "не доступно";
            
          inpTakeProfitLots.disabled = true;
          inpTakeProfitLots.value = "не доступно";
  
          if (!chStopLoss.checked) btnAddTakeStopOrders.disabled = true;
        }
        this.calcRisk();
        break;
      case "chStopLoss":
          if (chStopLoss.checked){
            inpStopLossPrice.disabled = false;
            if (this.props.item.balance>0){
              inpStopLossPrice.value = this.props.item.close*0.99
            }else{
              inpStopLossPrice.value = this.props.item.close*1.01
            }
              
            inpStopLossLots.disabled = false;
            inpStopLossLots.value = this.props.item.balance;
    
            if (!(chLimit.checked||chMarket.checked||chIfLimit.checked)){
              btnAddTakeStopOrders.disabled = false;
            }
          }else{
            inpStopLossPrice.disabled = true;
            inpStopLossPrice.value = "не доступно";
              
            inpStopLossLots.disabled = true;
            inpStopLossLots.value = "не доступно";
    
            if (!chTakeProfit.checked) btnAddTakeStopOrders.disabled = true;
          }
          this.calcRisk();
          break;
      case "chTrailingStop":
          if (chTrailingStop.checked){
            inpTrailingSize.disabled=false;
            inpTrailingSize.value =this.calcTrailingStop()
            btnAddTrailingStop.disabled=false;
          }else{
            inpTrailingSize.disabled=true;
            inpTrailingSize.value ="не доступно";
            btnAddTrailingStop.disabled=true;
          }
          break;
      default: 
        console.log("handleChBox unknown change "+e.target.id);
    }
  }

  calcTrailingStop(){
    if (document.getElementById("inputMainPrice")==null){
      return null
    }
    
    let price = document.getElementById("inputMainPrice").value
      return (price*0.01)
  }

  initControls(){
    let inputs = document.querySelectorAll(".inputwindow");
    inputs.forEach(function(item){
      item.disabled=true;
      item.value = "не доступно";
    });

    let btns = document.querySelectorAll(".orderbtn");
    btns.forEach(function(item){
      if (item.id!=="btnClosePortfolio"){
        item.disabled=true;
      }else{
        item.disabled=false;
      }
    });

    if (this.props.item.ticker !== "") {
      document.getElementById("inputTicker").value = this.props.item.ticker;
      document.getElementById("inputName").value = this.props.item.name;
    }
  }

  componentDidMount() {
    this.initControls();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item.ticker !== prevProps.item.ticker) {
      this.initControls();
      return true;
    }
  }

  sendOrder(event){
    //чекбоксы
    let chMarket=document.getElementById("chMarketOrder")
    let chLimit=document.getElementById("chLimitOrder")
    let chTakeProfit = document.getElementById("chTakeProfit")
    let chStopLoss = document.getElementById("chStopLoss")
    let chIfLimit = document.getElementById("chIfLimit")
    let chTrailingStop = document.getElementById("chTrailingStop")
    //поля ввода
    let inpTicker=document.getElementById("inputTicker")
    let inpMainPrice=document.getElementById("inputMainPrice")
    let inpMainLots=document.getElementById("inputMainLots")
    let inpTakeProfitPrice=document.getElementById("inputTakeProfitPrice")
    let inpTakeProfitLots=document.getElementById("inputTakeProfitLots")
    let inpStopLossPrice=document.getElementById("inputStopLossPrice")
    let inpStopLossLots=document.getElementById("inputStopLossLots")
    let inpTrailingSize=document.getElementById("inputTrailingSize")

    let order={
      ticker:inpTicker.value,
      figi:this.props.item.figi,
      typed: chMarket.checked?"market":(chLimit.checked?"limit":(chIfLimit.checked?"iflimit":"")),
      operation:"", //buy, sell, closeall
      price:Number(inpMainPrice.value),
      lots:Number(inpMainLots.value),
      takeprofit:{
        enabled: chTakeProfit.checked,
        price: chTakeProfit.checked?Number(inpTakeProfitPrice.value):0,
        lots: chTakeProfit.checked?Number(inpTakeProfitLots.value):0,
      },
      stoploss:{
        enabled: chStopLoss.checked,
        price: chStopLoss.checked?Number(inpStopLossPrice.value):0,
        lots: chStopLoss.checked?Number(inpStopLossLots.value):0,
      },
      trailingstop:{
        enabled:chTrailingStop.checked,
        size: chTrailingStop.checked?Number(inpTrailingSize.value):0,
      },
    }

    switch(event.target.id){
      case "btnBuy":
        order.operation = "Buy"
        break;
      case "btnSell":
        order.operation = "Sell"
        break;
      case "btnClosePortfolio":
        order.operation = "Closeall"
        break;
      case "btnAddTakeStopOrders":
        order.operation = "Takestop"
        break;
        case "btnAddTrailingStop":
          order.operation = "Trailingstop"
          break;        
      default: 
        console.log("check button id")
        console.log(event.target.id)
        return
    }

    this.props.updateData(order)
  }

  render() {
    let {min_price_increment} = this.props.item.min_price_increment
    return (
      <div className="mainWindow" style={{ cursor: "default!important" }}>

        <div className="header clearfix">
          <input type="input" className="header float-left" style={{ width: "75%" }} id="inputTicker" placeholder="Введите тикер" />
          <button type="button" className="btn close btn-sm orderbtn" onClick={(e) => console.log(e)} aria-label="Close" style={{ paddingTop: "2pt" }} id="btnClose">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div style={{ display: "flex", textAlign: "left", paddingTop: "5pt" }}>
          <div style={{ width: "50%", paddingLeft: "10pt" }}>
            <input type="checkbox" id="chMarketOrder" onChange={(e)=>this.handleCheckboxChange(e)}/>
            <label htmlFor="chMarketOrder" style={{paddingLeft: "5pt", fontFamily: "Times New Roman", fontSize: "12pt" }}>
              Market
            </label>
          </div>
          <div style={{ width: "50%", paddingLeft: "5pt" }}>
            <div style={{ width: "50%" }}>
              <input type="number" step={min_price_increment} className="orderSelector inputwindow" autoComplete="Off" id="inputMainPrice" placeholder="Введите цену"
                onChange={(e)=>this.handleInputChange(e)}/>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", textAlign: "left"}}>
          <div style={{ width: "50%", paddingLeft: "10pt"}}>
            <input type="checkbox" id="chLimitOrder" onChange={(e)=>this.handleCheckboxChange(e)}/>
            <label htmlFor="chLimitOrder" style={{paddingLeft: "5pt",fontFamily: "Times New Roman",fontSize: "12pt" }}>
              Limit
            </label>
          </div>
          <div style={{ width: "50%", paddingLeft: "5pt" }}>
            <div style={{ width: "50%" }}>
              <input type="number" step={min_price_increment} className="orderSelector inputwindow" autoComplete="Off" id="inputMainLots" placeholder="Введите лоты"
                onChange={(e)=>this.handleInputChange(e)}/>
            </div>
          </div>
        </div>


        <div style={{ display: "flex", textAlign: "left", paddingTop: "0pt" }}>
          <div style={{ width: "50%", paddingLeft: "10pt"}}>
            <input type="checkbox" id="chIfLimit" onChange={(e)=>this.handleCheckboxChange(e)}/>
            <label htmlFor="chIfLimit" style={{ paddingLeft: "5pt", fontFamily: "Times New Roman", fontSize: "12pt" }}>
              If-Limit
            </label>
          </div>
        </div>

        <div style={{ display:"flex", padding:"5pt" }}>
          <button type="button" className="btn btn-success orderbtn" style={{ width: "48%", fontSize: "12pt", height: "48pt" }} id="btnBuy"
            onClick={(e)=>this.sendOrder(e)}>
              Покупка
          </button>
          <div style={{ width: "4%"}}></div>
          <button type="button" className="btn btn-danger orderbtn" style={{ width: "48%", fontSize: "12pt", height: "48pt" }} id="btnSell"
            onClick={(e) => this.sendOrder(e)}>
              Продажа
          </button>
        </div>

        <div style={{ borderBottom: "2pt solid #354755", paddingTop:"5pt" }}></div>

        <div style={{ display: "flex", textAlign: "left", paddingTop: "5pt" }}>
          <div style={{ width: "50%", paddingLeft: "10pt"}}>
            <input type="checkbox" id="chTakeProfit" onChange={(e)=>this.handleCheckboxChange(e)}/>
            <label htmlFor="chTakeProfit" style={{ paddingLeft: "5pt", fontFamily: "Times New Roman", fontSize: "12pt" }}>
              Take-profit
            </label>
          </div>
          <div style={{ width: "50%", paddingLeft: "5pt" }}>
            <div style={{ width: "50%" }}>
              <input type="number" step={min_price_increment} className="orderSelector inputwindow" autoComplete="Off" id="inputTakeProfitPrice" placeholder="Введите цену"
                onChange={(e)=>this.handleInputChange(e)}/>
            </div>

          </div>
        </div>

        <div style={{ display: "flex", textAlign: "left" }}>
          <div style={{ width: "50%", paddingLeft: "10pt"}}>
          </div>
          <div style={{ width: "50%", paddingLeft: "5pt" }}>
            <div style={{ width: "50%" }}>
              <input type="number" step={min_price_increment} className="orderSelector inputwindow" autoComplete="Off" id="inputTakeProfitLots" placeholder="Введите лоты"
                onChange={(e)=>this.handleInputChange(e)}/>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", textAlign: "left", paddingTop: "5pt" }}>
          <div style={{ width: "50%", paddingLeft: "10pt"}}>
            <input type="checkbox" id="chStopLoss" onChange={(e)=>this.handleCheckboxChange(e)}/>
            <label htmlFor="chStopLoss" style={{ paddingLeft: "5pt", fontFamily: "Times New Roman", fontSize: "12pt" }}>
              Stop-loss
            </label>
          </div>
          <div style={{ width: "50%", paddingLeft: "5pt" }}>
            <div style={{ width: "50%" }}>
              <input type="number" step={min_price_increment} className="orderSelector inputwindow" autoComplete="Off" id="inputStopLossPrice" placeholder="Введите цену"
                onChange={(e)=>this.handleInputChange(e)}/>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", textAlign: "left" }}>
          <div style={{ width: "50%", paddingLeft: "10pt"}}>
          </div>
          <div style={{ width: "50%", paddingLeft: "5pt" }}>
            <div style={{ width: "50%" }}>
              <input type="number" step={min_price_increment} className="orderSelector inputwindow" autoComplete="Off" id="inputStopLossLots" placeholder="Введите лоты"
                onChange={(e)=>this.handleInputChange(e)}/>
            </div>
          </div>
        </div>

        <label style={{paddingTop:"5pt"}} id="risk">
          Не установлено
        </label>

        <div style={{paddingTop:"5pt"}}>
          <button type="button" className="btn btn-warning orderbtn" style={{ width: "95%", fontSize: "12pt", height: "24pt"}} id="btnAddTakeStopOrders"
            onClick={(e) => this.sendOrder(e)}>
            Отправить
          </button>
        </div>

        <div style={{ borderBottom: "2pt solid #354755", paddingTop:"5pt"}}></div>

        <div style={{ display: "flex", textAlign: "left", paddingTop: "5pt" }}>
          <div style={{ width: "50%", paddingLeft: "10pt"}}>
            <input type="checkbox" id="chTrailingStop" onChange={(e)=>this.handleCheckboxChange(e)}/>
            <label htmlFor="chTrailingStop" style={{ paddingLeft: "5pt", fontFamily: "Times New Roman", fontSize: "12pt" }}>
             Trailing-stop
            </label>
          </div>
          <div style={{ width: "50%", paddingLeft: "5pt" }}>
            <div style={{ width: "50%" }}>
              <input type="number" step={min_price_increment} className="orderSelector inputwindow" autoComplete="Off" id="inputTrailingSize" placeholder="Дистанция $"
                onChange={(e)=>this.handleInputChange(e)}/>
            </div>
          </div>
        </div>

        <div style={{paddingTop:"5pt"}}>
          <button type="button" className="btn btn-warning orderbtn" style={{ width: "95%", fontSize: "12pt", height: "24pt"}} id="btnAddTrailingStop"
            onClick={(e) => this.sendOrder(e)}>
            Отправить
          </button>
        </div>

        <div style={{ borderBottom: "2pt solid #354755", paddingTop:"5pt"}}></div>

        <div>Срок действия</div>

        <div>
          <button type="button" className="btn btn-warning orderbtn" style={{ width: "95%", fontSize: "12pt", height: "24pt"}} id="btnClosePortfolio"
            onClick={(e) => this.sendOrder(e)}>
            Закрыть портфель
          </button>
        </div>

        <div className="footer" id="inputName">
            {this.props.item.name}
        </div>

      </div>
    );
  }
}

export default Order;