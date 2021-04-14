import React from "react";
import { Button } from "react-bootstrap";

const style = {
  button: {
    width: "300pt",
    height: "120pt",
    margin: "1px",
    paddingRight: "10px",
    paddingTop: "1px",
    border: "1px solid blue",
    backgroundColor: "grey",
    textAlign: "left",
    fontSize: "16pt",
    fontWeight: "bold",
  },
  in_button: {
    marginLeft: "10pt",
    paddingTop: "0px",
    textAlign: "left",
    fontSize: "10pt",
    //backgroundColor: "blue",
    //fontWeight: "bold",
  },
  ticker: {
    marginLeft: "2pt",
    paddingTop: "5pt",
    textAlign: "left",
    fontSize: "16pt",
    fontWeight: "bold",
    //backgroundColor: "blue",
    //fontWeight: "bold",
  },
};

function checkCurrencyName(ticker) {
  if (ticker === "USD000UTSTOM") return "USD";
  if (ticker === "EUR_RUB__TOM") return "EUR";
  return ticker;
}

function addCurrency(value, currency) {
  if (currency === "RUB")
    return value.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
    });
  if (currency === "USD")
    return value.toLocaleString("en-EN", {
      style: "currency",
      currency: "USD",
    });
  if (currency === "EUR")
    return value.toLocaleString("eu-EU", {
      style: "currency",
      currency: "EUR",
    });
  return currency;
}

class SingleStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      time: "",
      payload: {
        figi: "",
        trade_status: "",
        min_price_increment: 0,
        lot: 0,
        accrued_interest: 0,
        limit_up: 0,
        limit_down: 0,
      },
      messages: [],
      cmdRegister: {
        command: "register",
        eventype: "eventinfo",
        figi: this.props.figi,
      },
      instrument_info: {
        figi: "",
        currentTime: "",
        trade_status: false,
        lot: 0,
        min_price_increment: 0,
      },
      candle: {
        figi: "",
        interval: "",
        currentTime: "",
        time: "",
        close: 0,
        open: 0,
        high: 0,
        low: 0,
        volume: 0,
      },
    };
  }

  componentDidMount() {
    console.log("SingleComponent DidMount");

    this.connection = new WebSocket("ws://localhost:8002/ws");

    this.connection.onmessage = (evt) => {
      // add the new message to state
      this.setState({
        messages: this.state.messages.concat([evt.data]),
      });
      console.log(this.state.messages);

      for (let i = 0; i < this.state.messages.length; i++) {
        try {
          let data = JSON.parse(this.state.messages[i]);
          console.log("Parsed data=" + i);
          //console.log(data);

          switch (data.event) {
            case "instrument_info":
              this.setState({
                instrument_info: {
                  figi: data.payload.figi,
                  currentTime: data.time,
                  trade_status:
                    data.payload.trade_status == "not_available_for_trading"
                      ? false
                      : true,
                  lot: data.payload.lot,
                  min_price_increment: data.payload.min_price_increment,
                },
              });
              break;
            case "candle":
              this.setState({
                candle: {
                  figi: data.payload.figi,
                  interval: data.payload.interval,
                  currentTime: data.time,
                  time: data.payload.time,
                  close: data.payload.c,
                  open: data.payload.o,
                  high: data.payload.h,
                  low: data.payload.l,
                  volume: data.payload.v,
                },
              });
              break;
          }
        } catch (err) {
          console.log("i=" + i);
          console.log(err);
        }
      }
    };

    this.connection.onopen = (evt) => {
      this.setState({
        cmdRegister: {
          command: "register",
          eventype: "instrument_info",
          figi: this.props.figi,
        },
      });
      console.log(this.state.cmdRegister);
      let sendData = JSON.stringify(this.state.cmdRegister);
      console.log("info+" + sendData);
      this.connection.send(sendData);

      this.setState({
        cmdRegister: {
          command: "register",
          eventype: "candle",
          figi: this.props.figi,
        },
      });
      console.log(this.state.cmdRegister);
      sendData = JSON.stringify(this.state.cmdRegister);
      console.log("candle+" + sendData);
      this.connection.send(sendData);
    };
  }

  render() {
    var ticker = checkCurrencyName(this.props.ticker);
    var figi = this.props.figi;
    var currencyType = this.props.currency;
    var summa = addCurrency(this.props.summa, currencyType);
    var avgprice = addCurrency(this.props.avgprice, currencyType);
    var count = this.props.count;
    var abschange = addCurrency(this.props.abschange, currencyType);

    var {trade_status,lot,min_price_increment} = this.state.instrument_info;
    var {interval, currentTime, time, close, open, high, low, volume} = this.state.candle;

    return (
      <div>
        <div>
          <Button
            onClick={() => this.props.updateData(item)}
            className="border rounded"
            style={style.button}
          >
            <div className="row">
              <div className="col-sm-2" style={style.ticker}>
                {ticker}
              </div>
              <div className="col-sm-4" style={style.in_button}>
                <div className="row">Цена {avgprice}</div>
                <div className="row">Кол-во {count}</div>
                <div className="row">Open {open}</div>
                <div className="row">Close {close}</div>
                <div className="row">High {high}</div>
                <div className="row">Low {low}</div>
                <div className="row">Volume {volume}</div>
              </div>
              <div className="col-sm-auto" style={style.in_button}>
                <div className="row">Всего {summa}</div>
                <div className="row">Измен. {abschange}</div>
                <div className="row">Status {""+trade_status}</div>
                <div className="row">Min_pr_inc {min_price_increment}</div>
                <div className="row">interval {interval}</div>
                <div className="row">Lot {lot}</div>
                <div className="row">Time </div>                
              </div>
            </div>
          </Button>
        </div>
      </div>
    );
  }
}

export default SingleStock;

/*
(e)=>clickedStock(e,ticker)
function clickedStock(e, ticker){
  alert("ticker " + ticker);
}

<div>
          <ul>
            {this.state.messages.slice(-5).map((msg, idx) => (
              <li key={"msg-" + idx}>{msg}</li>
            ))}
          </ul>
          ;
        </div>
*/
