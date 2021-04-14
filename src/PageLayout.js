import React from "react";
import axios from "axios";
import OrderBook from "./OrderBook";
import Portfolio from "./Portfolio";
import Order from "./Order";
//import "./styles.css";
import Box from "./Box";

class PageLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myurl:"http://www.smlsat.ru:8001",
      isItemSelect: false,
      //orderbook
      pressedItem: {
        ticker: "",
        figi: "",
        currency: "",
        balance: 0,
        name: "",
      },

      order: {
        ticker: "",
        figi: "",
        price: 0,
        count: 0,
        type: "market",
      },
    };

    this.updatePortfolioClick = this.updatePortfolioClick.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
  }

  updatePortfolioClick(value){
    this.setState({ pressedItem: value, isItemSelect: true });
  };

  componentDidMount() {
    this.getOrdersList();
    this.timerID2 = setInterval(() => this.tick10s(), 10000);
  }

  tick10s() {
    this.getOrdersList();
  }

  componentWillUnmount() {
    clearInterval(this.timerID2);
  }

  getOrdersList() {
    const apiUrl = this.state.myurl+"/?type=getorders";
    axios
      .get(apiUrl)
      .then((res) => {
        /*
        this.setState({
          portfolio: res.data,
          connectErrorCounter: 0,
        });
        */
        console.log(JSON.stringify(res.data));
      })
      .catch((e) => {
        this.setState({
          connectErrorCounter: this.state.connectErrorCounter + 1,
        });
        console.log("ConnectError=" + this.state.connectErrorCounter);
        console.log(e);
      });
  }

  setMarketOrder(ticker, lots, operation) {
    const apiUrl =
      "http://www.smlsat.ru:8001/?type=marketorder&ticker=" +
      ticker +
      "&lots=" +
      lots +
      "&operation=" +
      operation;
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(res);
        //alert(res.data);
      })
      .catch((e) => {
        this.setState({
          connectErrorCounter: this.state.connectErrorCounter + 1,
        });
        console.log("ConnectError=" + this.state.connectErrorCounter);
        console.log(e);
      });
  }

  setLimitOrder(ticker, lots, price, operation) {
    const apiUrl =
      "http://www.smlsat.ru:8001/?type=limitorder&ticker=" +
      ticker +
      "&lots=" +
      lots +
      "&price=" +
      price +
      "&operation=" +
      operation;
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(res);
        //alert(res.data);
      })
      .catch((e) => {
        this.setState({
          connectErrorCounter: this.state.connectErrorCounter + 1,
        });
        console.log("ConnectError=" + this.state.connectErrorCounter);
        console.log(e);
      });
  }

  sendOrder(order) {
    console.log(order)
 
    //const apiUrl = "http://localhost:8001/?type=extorder";
    const apiUrl = this.state.myurl+"/?type=extorder";
    axios.post(
      apiUrl,
      order,
    ).then((res) => {
        console.log(res);
        //alert(res.data);
    }).catch((e) => {
      this.setState({
        connectErrorCounter: this.state.connectErrorCounter + 1,
      });
      console.log("ConnectError=" + this.state.connectErrorCounter);
      console.log(e);
    });
  }

  createMyComponent() {
    let div = document.createElement("div");
    div.className = "alert";
    div.innerHTML =
      "<strong>Всем привет!</strong> Вы прочитали важное сообщение.";
    document.body.append(div);

    let idx111 = document.getElementById("idx111");
    let idx222 = document.getElementById("idx222");

    idx222.after(idx111);

    /*
<div id="container"></div>

  <script>
    let data = {
      "Рыбы": {
        "форель": {},
        "лосось": {}
      },

      "Деревья": {
        "Огромные": {
          "секвойя": {},
          "дуб": {}
        },
        "Цветковые": {
          "яблоня": {},
          "магнолия": {}
        }
      }
    };

    function createTree(container, obj) {
      container.append(createTreeDom(obj));
    }

    function createTreeDom(obj) {
      // если нет дочерних элементов, то вызов возвращает undefined
      // и элемент <ul> не будет создан
      if (!Object.keys(obj).length) return;

      let ul = document.createElement('ul');

      for (let key in obj) {
        let li = document.createElement('li');
        li.innerHTML = key;

        let childrenUl = createTreeDom(obj[key]);
        if (childrenUl) {
          li.append(childrenUl);
        }

        ul.append(li);
      }

      return ul;
    }

    let container = document.getElementById('container');
    createTree(container, data);
*/
  }

  MyAlarmButton() {
    return (
      <div id="tryclose">
        <button type="button" onClick={() => this.closeComponent()}>
          Подтвердить
        </button>
        <button type="button" onClick={() => this.closeComponent()}>
          Отменить
        </button>

        <button
          type="button"
          className="close"
          onClick={() => this.closeComponent()}
          style={{ width: "10%" }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  closeComponent() {
    let wrn = document.getElementById("tryclose");
    console.log("close");
    wrn.remove();
  }

  closeAlarm() {
    let wrn = document.getElementById("btnCloseAlarm");
    console.log("close");
    wrn.remove();
  }

  // React component render function:
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <div id="idx111">
          <Box
            name="Portfolio"
            todo={<Portfolio myurl={this.state.myurl} updateData={this.updatePortfolioClick} />}
          />
        </div>

        <div id="idx222">
          <Box
            name="OrderBook"
            todo={<OrderBook item={this.state.pressedItem} />}
            
          />
        </div>

        {this.state.isItemSelect && (
          <Box
            name="Order"
            id="idx333"
            todo={<Order item={this.state.pressedItem} updateData={this.sendOrder} />}
          />
        )}
      </div>
    );
  }
}
export default PageLayout;

/*
{this.MyAlarmButton()}

<div
  className="alert alert-primary"
  role="alert"
  style={{ width: "250pt" }}
>
  <h4 className="alert-heading">Заголовок сообщения</h4>
  <hr></hr>

  <div>
    <button type="button" className="btn btn-success" style={{ width: "100pt", fontSize: "12pt", height: "24pt" }} 
      id="btnBuy" onClick={() => this.props.updateData("All","marketOrder","Sell",0,0)} >Подтвердить</button>
    <button type="button" className="btn btn-danger" style={{ width: "100pt", fontSize: "12pt", height: "24pt" }}
      id="btnCloseAlarm" onClick={() => this.closeAlarm()}>Отменить</button>
  </div>

</div>
*/