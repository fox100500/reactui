import React from "react";
import "./Order.css";
//import { addCurrency, checkCurrencyName } from "./Portfolio";

function changeState(e) {
  let market = document.getElementById("market");
  let limit = document.getElementById("limit");
  let isMarketOn = market.className === "orderSelector stateOn";

  if (isMarketOn) {
    state111 = false;
    market.classList.remove("stateOn");
    market.classList.add("stateOff");
    limit.classList.remove("stateOff");
    limit.classList.add("stateOn");
  } else {
    state111 = true;
    limit.classList.remove("stateOn");
    limit.classList.add("stateOff");
    market.classList.remove("stateOff");
    market.classList.add("stateOn");
  }
}

function printMarketForm(props) {
  var marketLots = document.getElementById("marketLots");
  return (
    <>
      <div>
        <div className="p-0 m-0" colSpan="3">
          <input
            style={{ width: "180pt", fontSize: "10pt" }}
            type="input"
            id="marketLots"
            placeholder="Введите лоты"
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-success"
          style={{ width: "90pt", fontSize: "12pt", height: "24pt" }}
          id="btnBuy"
          onClick={() =>
            props.updateData("marketOrder", "Buy", marketLots.value, "")
          }
        >
          Покупка
        </button>
        <button
          type="button"
          className="btn btn-danger"
          style={{ width: "90pt", fontSize: "12pt", height: "24pt" }}
          id="btnSell"
          onClick={() =>
            props.updateData("marketOrder", "Sell", marketLots.value, "")
          }
        >
          Продажа
        </button>
      </div>
    </>
  );
}

let state111 = true;

function printLimitForm(props) {
  var limitLots = document.getElementById("limitLots");
  var limitPrice = document.getElementById("limitPrice");
  return (
    <>
      <div>
        <div className="p-0 m-0" colSpan="3">
          <div>
            <div>
              <input
                style={{ width: "90pt", fontSize: "10pt" }}
                type="input"
                id="limitLots"
                placeholder="Введите лоты"
              />
            </div>
            <div>
              <input
                style={{ width: "90pt", fontSize: "10pt" }}
                type="input"
                id="limitPrice"
                placeholder="Введите цену"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-success"
          style={{ width: "90pt", fontSize: "12pt", height: "24pt" }}
          id="btnBuy"
          onClick={() =>
            props.updateData(
              "limitOrder",
              "Buy",
              limitLots.value,
              limitPrice.value
            )
          }
        >
          Покупка
        </button>
        <button
          type="button"
          className="btn btn-danger"
          style={{ width: "90pt", fontSize: "12pt", height: "24pt" }}
          id="btnSell"
          onClick={() =>
            props.updateData(
              "limitOrder",
              "Sell",
              limitLots.value,
              limitPrice.value
            )
          }
        >
          Продажа
        </button>
      </div>
    </>
  );
}

function OrdersList(props) {
  return (
      <div
        className="tableOrderbook container-fluid m-1"
        style={{ width: "180pt", height: "300pt" }}
      >
        <div>
          <div>
            <div className="p-0 m-0" colSpan="3">
              <input
                style={{ width: "180pt", fontSize: "12pt" }}
                type="input"
                
                placeholder="Введите тикер"
              />
            </div>
          </div>
          <div>
            <div className="p-0 m-0" colSpan="3">
              <div>
                <div
                  className="orderSelector stateOn"
                  id="market"
                  onClick={(e, value) => changeState(e, value)}
                >
                  Рыночная
                </div>
                <div
                  className="orderSelector stateOff"
                  id="limit"
                  onClick={(e, value) => changeState(e, value)}
                >
                  Лимитная
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "48pt" }}>
          <div>{state111 ? printMarketForm(props) : printLimitForm(props)}</div>
        </div>
      </div>
  );
}

export default OrdersList;
