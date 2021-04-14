import React from "react";
import _ from "lodash";
//import { Scrollbar } from "react-scrollbars-custom";
import axios from "axios";
import "./Portfolio.css";
import { Menu, MenuItem } from "@material-ui/core";

const initialState = {
  mouseX: null,
  mouseY: null,
};

var state = {
  mouseX: null,
  mouseY: null,
};

const handleClick = (event) => {
  event.preventDefault();
  state = {
    mouseX: event.clientX - 2,
    mouseY: event.clientY - 4,
  };
};

const handleClose = (event) => {
  state = initialState;
  console.log(event.target);
};

export function checkCurrencyName(ticker) {
  if (ticker === "USD000UTSTOM") return "USD";
  if (ticker === "EUR_RUB__TOM") return "EUR";
  return ticker;
}

export function addCurrency(value, currency) {
  if (currency === "RUB")
    return value.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      useGrouping: false,
    });
  if (currency === "USD")
    return value.toLocaleString("en-EN", {
      style: "currency",
      currency: "USD",
      useGrouping: false,
    });
  if (currency === "EUR")
    return value.toLocaleString("eu-EU", {
      style: "currency",
      currency: "EUR",
      useGrouping: false,
    });
  return currency;
}

const style = {
  scrollbar: {
    width: "625pt",
    height: "400pt",
  },
  tableRowsLight: {
    backgroundColor: "#354755" /*"#293742",*/,
    textAlign: "right",
    fontWeight: "normal",
  },
  tableRowsDark: {
    backgroundColor: "#25313c",
    textAlign: "right",
    fontWeight: "normal",
  },
  tableRowsUnactive: {
    backgroundColor: "grey",
    textAlign: "right",
    fontWeight: "normal",
  },
};

function getTradingStatus(key, status) {
  if (status === true) {
    if (key % 2) {
      return style.tableRowsDark;
    } else {
      return style.tableRowsLight;
    }
  } else {
    return style.tableRowsUnactive;
  }
}

function setProfitColor(value) {
  if (value >= 0) return "lightgreen";
  if (value < 0) return "#e74242";
}

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectErrorCounter: 0,

      portfolio: {
        summa: 0,
        rub: 0,
        usd: 0,
        eur: 0,
        stocks: [
          {
            ticker: "",
            figi: "",
            tradingstatus: false,
            instrumentType: "",
            name: "",
            infotime: "",
            min_price_increment: 0,
            lot: 0,
            lots: 0,
            accrued_interest: 0,
            limit_up: 0,
            limit_down: 0,
            balance: 0,
            blocked: 0,
            currency: "",
            eyvalue: 0,
            avgpricevalue: 0,
            avgpricevaluenonkd: 0,
            candletime: "",
            interval: "",
            open: 0,
            close: 0,
            high: 0,
            low: 0,
            volume: 0,
          },
        ],
      },
    };
  }

  componentDidMount() {
    this.getPortfolio();
    this.timerID = setInterval(() => this.tick(), 3000);
  }

  tick() {
    this.getPortfolio();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPortfolio() {
    console.log(this.props.myurl)
    const apiUrl = this.props.myurl+"/?type=getportfolio";
    axios
      .get(apiUrl)
      .then((res) => {
        this.setState({
          portfolio: res.data,
          connectErrorCounter: 0,
        });
        //console.log(JSON.stringify(this.state.portfolio));
      })
      .catch((e) => {
        this.setState({
          connectErrorCounter: this.state.connectErrorCounter + 1,
        });
        console.log("ConnectError=" + this.state.connectErrorCounter);
        console.log(e);
      });
  }

  render() {
    var StocksWithoutCurrencies = this.state.portfolio.stocks.filter(function (item) {
      return item.ticker !== "USD000UTSTOM" && item.ticker !== "EUR_RUB__TOM";
    });

    var Currencies = this.state.portfolio.stocks.filter(function (item) {
      return item.ticker === "USD000UTSTOM" || item.ticker === "EUR_RUB__TOM";
    });

    const sortedStocks = _.orderBy(StocksWithoutCurrencies, "ticker", "asc");
    const sortedCurrencies = _.orderBy(Currencies, "ticker", "asc");
    return (
      <div onContextMenu={handleClick} style={{ cursor: "context-menu" }}>
        <div>
          <table className="tablePortfolio">
            <tbody>
              <tr>
                <td width="900pt">
                  <font color="lightgreen">
                    БАЛАНС {addCurrency(this.state.portfolio.summa, "RUB")}
                  </font>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className="tablePortfolio">
            <thead>
              <tr>
                <th colSpan="12">ВАЛЮТА</th>
              </tr>
              <tr align="center">
                <th width="25pt">№</th>
                <th width="60pt">Тикер</th>
                <th width="80pt">Средняя цена</th>
                <th width="75pt">Шт.</th>
                <th width="100pt">Стоимость</th>
                <th width="80pt">Доход</th>
                <th width="80pt">Доход %</th>
                <th width="80pt">Максимум</th>
                <th width="80pt">Минимум</th>
                <th width="80pt">Открытие</th>
                <th width="80pt">Закрытие</th>
                <th width="80pt">Объём</th>
              </tr>
            </thead>
          </table>
          <table className="tablePortfolio table-hover">
            <tbody>
              {sortedCurrencies.map((item, key) => (
                <tr
                  key={item.ticker}
                  onClick={() => this.props.updateData(item)}
                  style={getTradingStatus(key, item.tradingstatus)}
                >
                  <td width="25pt" align="center">
                    {key + 1}
                  </td>
                  <td
                    width="60pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    {checkCurrencyName(item.ticker)}
                  </td>
                  <td width="80pt">{item.avgpricevalue}</td>
                  <td width="74pt">{item.balance}</td>
                  <td width="100pt">
                    {addCurrency(
                      item.balance * item.avgpricevalue + item.eyvalue,
                      item.currency
                    )}
                  </td>
                  <td
                    width="80pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    <font weight="bold" color={setProfitColor(item.eyvalue)}>
                      {addCurrency(item.eyvalue, item.currency)}
                    </font>
                  </td>
                  <td width="80pt">
                    <font weight="bold" color={setProfitColor(item.eyvalue)}>
                      {(
                        (item.eyvalue / (item.balance * item.avgpricevalue)) *
                        100
                      ).toFixed(1)}
                      %
                    </font>
                  </td>
                  <td
                    width="80pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    {item.high}
                  </td>
                  <td width="80pt">{item.low}</td>
                  <td width="80pt">{item.open}</td>
                  <td width="80pt">{item.close}</td>
                  <td
                    width="80pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    {item.volume}
                  </td>
                </tr>
              ))}
              <tr key="RUB" style={getTradingStatus(0, true)}>
                <td width="25pt"></td>
                <td
                  width="60pt"
                  style={{
                    borderLeftWidth: "1px",
                    borderLeftStyle: "solid",
                    borderLeftColor: "lightgray",
                  }}
                >
                  {checkCurrencyName("RUB")}
                </td>
                <td width="80pt">-</td>
                <td width="74pt">-</td>
                <td width="100pt">
                  {addCurrency(this.state.portfolio.rub, "RUB")}
                </td>
                <td
                  width="80pt"
                  style={{
                    borderLeftWidth: "1px",
                    borderLeftStyle: "solid",
                    borderLeftColor: "lightgray",
                  }}
                >
                  -
                </td>
                <td width="80pt">-</td>
                <td
                  width="80pt"
                  style={{
                    borderLeftWidth: "1px",
                    borderLeftStyle: "solid",
                    borderLeftColor: "lightgray",
                  }}
                >
                  -
                </td>
                <td width="80pt">-</td>
                <td width="80pt">-</td>
                <td width="80pt">-</td>
                <td
                  width="80pt"
                  style={{
                    borderLeftWidth: "1px",
                    borderLeftStyle: "solid",
                    borderLeftColor: "lightgray",
                  }}
                >
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className="tablePortfolio">
            <thead>
              <tr>
                <th colSpan="12">АКЦИИ</th>
              </tr>
              <tr align="center">
                <th width="25pt">№</th>
                <th width="60pt">Тикер</th>
                <th width="80pt">Средняя цена</th>
                <th width="75pt">Шт.</th>
                <th width="100pt">Стоимость</th>
                <th width="80pt">Доход</th>
                <th width="80pt">Доход %</th>
                <th width="80pt">Максимум</th>
                <th width="80pt">Минимум</th>
                <th width="80pt">Открытие</th>
                <th width="80pt">Закрытие</th>
                <th width="80pt">Объём</th>
              </tr>
            </thead>
          </table>
          <table className="tablePortfolio table-hover">
            <tbody>
              {sortedStocks.map((item, key) => (
                <tr
                  key={item.ticker}
                  onClick={() => this.props.updateData(item)}
                  //style={getTradingStatus(key, item.tradingstatus)}
                >
                  <td width="25pt" align="center">
                    {key + 1}
                  </td>
                  <td
                    width="60pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    {checkCurrencyName(item.ticker)}
                  </td>
                  <td width="80pt">{item.avgpricevalue}</td>
                  <td width="74pt">{item.balance}</td>
                  <td width="100pt">
                    {addCurrency(
                      item.balance * item.avgpricevalue + item.eyvalue,
                      item.currency
                    )}
                  </td>
                  <td
                    width="80pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    <font weight="bold" color={setProfitColor(item.eyvalue)}>
                      {addCurrency(item.eyvalue, item.currency)}
                    </font>
                  </td>
                  <td width="80pt">
                    <font weight="bold" color={setProfitColor(item.eyvalue)}>
                      {(
                        (item.eyvalue / (item.balance * item.avgpricevalue)) *
                        100
                      ).toFixed(1)}
                      %
                    </font>
                  </td>
                  <td
                    width="80pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    {item.high}
                  </td>
                  <td width="80pt">{item.low}</td>
                  <td width="80pt">{item.open}</td>
                  <td width="80pt">{item.close}</td>
                  <td
                    width="80pt"
                    style={{
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "lightgray",
                    }}
                  >
                    {item.volume}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <table className="tablePortfolio">
            <tbody>
              <tr>
                <td width="900pt">
                  <font color="lightgreen"></font>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <Menu
            keepMounted
            open={state.mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              state.mouseY !== null && state.mouseX !== null
                ? { top: state.mouseY, left: state.mouseX }
                : undefined
            }
          >
            <MenuItem ref={this.id1} onClick={handleClose}>
              Стакан
            </MenuItem>
            <MenuItem ref={this.id2} onClick={handleClose}>
              Заявка
            </MenuItem>
            <MenuItem ref={this.id3} onClick={handleClose}>
              Текущие заявки
            </MenuItem>
            <MenuItem ref={this.id4} onClick={handleClose}>
              График
            </MenuItem>
            <MenuItem ref={this.id5} onClick={handleClose}>
              Перечень операций
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}

export default Portfolio;
