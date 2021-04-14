import React from "react";
import _ from "lodash";
import "./OrderBook.css";
import { addCurrency, checkCurrencyName } from "./Portfolio";

const isOdd = (key) => key % 2;

function getLineColor(key) {
  if (isOdd(key)) {
    return "mycol sizeborder dark";
  } else {
    return "mycol sizeborder light";
  }
}

function AddLine(key, cel1, cel2, cel3, rowstyle) {
  return (
    <tr key={key}>
      <td className={getLineColor(rowstyle) + " left"}>{cel1}</td>
      <td className={getLineColor(rowstyle) + " center"}>{cel2}</td>
      <td className={getLineColor(rowstyle) + " right"}>{cel3}</td>
    </tr>
  );
}

function printOrders(asks, bids, currency) {
  return (
    <>
      {asks.map((item, key) => AddLine(key, "", item.price, item.quantity, 0))}
      <tr>
        <td className="mycol fullborder dark" colSpan="3">
          {getSpred(asks, bids, currency)}
        </td>
      </tr>
      {bids.map((item, key) => AddLine(key, item.quantity, item.price, "", 1))}
    </>
  );
}

function printTradeDisable() {
  return (
    <tr>
      <td
        className="mycol fullborder dark"
        colSpan="3"
        style={{ height: "300pt", color: "red" }}
      >
        Торговля прекращена
      </td>
    </tr>
  );
}

function getSpred(asks, bids, currency) {
  if (asks.length > 0) {
    return addCurrency(asks[asks.length - 1].price - bids[0].price, currency);
  } else {
    return "нет информации";
  }
}

class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFigi: "",
      currentDepth: 5,
      newDepth: 5,

      response: {
        figi: "",
        depth: "",
        payload: {
          bids: [
            {
              price: 0,
              quantity: 0,
            },
          ],
          asks: [
            {
              price: 0,
              quantity: 0,
            },
          ],
        },
      },
    };

    this.updateOrderbookClick = this.updateOrderbookClick.bind(this);
  }

  componentDidMount() {

    console.log("Mount order book")
    this.connection = new WebSocket("ws://www.smlsat.ru:8002/ws");
    this.connection.onmessage = (evt) => {
      let messages = [];
      messages = messages.concat([evt.data]);
      messages.map((item) => {
        let data = JSON.parse(item, function (key, value) {
          let lowArray = [];
          if (key === "bids" || key === "asks") {
            lowArray = value.map((item1, key) => ({
              price: item1[(key, 0)],
              quantity: item1[(key, 1)],
            }));
            return lowArray;
          }
          return value;
        });
        this.setState({ response: data });
        //console.log(data);
        return data;
      });
    };

    this.connection.onopen = (evt) => {
      console.log("Orderbook onopen event");
      if (this.props.item.figi !== "") {
        let cmd = {
          command: "register",
          eventype: "orderbook",
          figi: this.props.item.figi,
          depth: this.state.currentDepth,
        };
        let sendData = JSON.stringify(cmd);
        this.connection.send(sendData);
        //console.log("Orderbook sendData " + sendData);
      } else {
        //console.log("Orderbook: figi empty");
      }
    };

    this.connection.onclose = (evt) => {
        console.log("Orderbook onclose event");
    };
  }

  componentWillUnmount() {
    this.connection.close();
    console.log("Unmount websoc");
  }

  componentDidUpdate() {
    if (
      this.state.currentFigi !== this.props.item.figi ||
      this.state.currentDepth !== this.state.newDepth
    ) {
      if (this.state.currentFigi !== "") {
        this.Unregister();
      }
      this.setState({ currentFigi: this.props.item.figi });
      this.setState({ currentDepth: this.state.newDepth });
      this.Register();
      return true;
    }
    return false;
  }

  Register() {
    if (this.props.item.figi !== "") {
      let cmd = {
        command: "register",
        eventype: "orderbook",
        figi: this.props.item.figi,
        depth: ""+this.state.newDepth,
      };
      let sendData = JSON.stringify(cmd);

      this.connection.send(sendData);
      console.log("Register sendData " + sendData);
      this.setState({ currentDepth: this.state.newDepth });
    } else {
      console.log("Orderbook reg: figi empty");
    }
  }

  Unregister() {
    if (this.props.item.figi !== "") {
      let cmd = {
        command: "unregister",
        eventype: "orderbook",
        figi: this.state.currentFigi,
        depth: ""+this.state.currentDepth,
      };

      let sendData = JSON.stringify(cmd);
      this.connection.send(sendData);
      console.log("Unregister sendData " + sendData);
    } else {
      console.log("Orderbook unreg: figi empty");
    }
  }

  updateOrderbookClick(e) {
    console.log("clicked " + e.target.id);
    this.setState({ newDepth: e.target.id });
    this.componentDidUpdate();
  };


  render() {
    const { bids, asks } = this.state.response.payload;

    var orderedBids = _.orderBy(bids, "price", "desc");
    var orderedAsks = _.orderBy(asks, "price", "desc");

    return (
      <table className="container-fluid m-1 selectdisable" style={{ width: "180pt" }}>
        <thead>
          <tr className="mycol" style={{ textAlign: "right" }}>
            <th>{checkCurrencyName(this.props.item.ticker)}</th>
            <th colSpan="2">
              <div className="btn-group btn-group-sm right" role="group" onClick={(e) => this.updateOrderbookClick(e)}>
                <button type="button" className="btn my-btn rounded-circle orderbookcontrol" id="5" >5</button>
                <button type="button" className="btn my-btn rounded-circle orderbookcontrol" id="10">10</button>
                <button type="button" className="btn my-btn rounded-circle orderbookcontrol" id="20">20</button>
              </div>
            </th>
          </tr>
          <tr>
            <th className="mycol fullborder">Покупка</th>
            <th className="mycol fullborder">Цена</th>
            <th className="mycol fullborder">Продажа</th>
          </tr>
        </thead>
        <tbody>
          {this.props.item.tradingstatus
            ? printOrders(orderedAsks, orderedBids, this.props.item.currency)
            : printTradeDisable()}
        </tbody>
      </table>
      
    );
  }
}

export default OrderBook;
/*
<div>
          <ul>
            {this.state.messages.slice(-5).map((msg, idx) => (
              <li key={"msg-" + idx}>{msg}</li>
            ))}
          </ul>
          ;
        </div>
*/
