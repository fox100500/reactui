import React from "react";

const style = {
balance: {
    margin: "1px",
    paddingLeft: "25pt",
    paddingTop: "8pt",
    backgroundColor: "white",
    fontSize: "20pt",
    fontWeight: "bold",
  },
fontSize10:{
  textAlign: "right",
  fontSize: "10pt",
  },
};

function Balance(props) {
  const summa = props.data.summa.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
  });
  const rub = props.data.rub.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
  });
  const eur = props.data.eur.toLocaleString("eu-EU", {
    style: "currency",
    currency: "EUR",
  });
  const usd = props.data.usd.toLocaleString("en-EN", {
    style: "currency",
    currency: "USD",
  });

  return (
      <div className="row">
        <div className="col-sm-7" style={style.balance}>
          {summa}
        </div>
        <div className="col-sm-auto" style={style.fontSize10}>
          <div className="row">{rub}</div>
          <div className="row">{usd}</div>
          <div className="row">{eur}</div>
        </div>
      </div>
  );
}

export default Balance;