import React from "react";
import { Rnd } from "react-rnd";
import Cookies from "universal-cookie";
import "./Box.css";

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      location: {
        x: 0,
        y: 0,
        width: "180pt",
        height: "300pt",
      },
    };
  }

  saveItemPosition(name, x, y, width, height) {
    const cookies = new Cookies();
    let d = new Date();
    const minutes = 100000;
    d.setTime(d.getTime() + minutes * 60 * 1000);
    cookies.set(name + ".x", x, { path: "/", expires: d, sameSite:"Lax" });
    cookies.set(name + ".y", y, { path: "/", expires: d, sameSite:"Lax" });
    cookies.set(name + ".width", width, { path: "/", expires: d, sameSite:"Lax" });
    cookies.set(name + ".height", height, { path: "/", expires: d, sameSite:"Lax" });
  }

  loadItemPosition(name) {
    const cookies = new Cookies();
    let value = {
      x: Number.parseInt(cookies.get(name + ".x")),
      y: Number.parseInt(cookies.get(name + ".y")),
      width: Number.parseInt(cookies.get(name + ".width")),
      height: Number.parseInt(cookies.get(name + ".height")),
    };
    if (
      isNaN(value.x) ||
      isNaN(value.y) ||
      isNaN(value.width) ||
      isNaN(value.height)
    ) {
      return false;
    }
    return value;
  }

  initItemPosition(name, ref) {
    let value = this.loadItemPosition(name);
    if (value === false) {
      this.saveItemPosition(name, 0, 0, 180, 200);
    } else {
      let value = this.loadItemPosition(name);
      this.setState({ location: value });
      ref.updatePosition({
        x: value.x,
        y: value.y,
      });
    }
  }

  componentDidMount() {
    this.initItemPosition(this.props.name, this.rnd);
  }

  render() {
    return (
      <Rnd
        ref={(c) => {
          this.rnd = c;
        }}
        onDragStop={(e, d) => {
          let val = this.state.location;
          val.x = d.x;
          val.y = d.y;
          this.setState({ location: val });
          this.saveItemPosition(
            this.props.name,
            val.x,
            val.y,
            val.width,
            val.height
          );
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.setState({
            width: ref.style.width,
            height: ref.style.height,
            ...position,
          });
        }}
        enableResizing={false}
        cursor={"normal"}
        bounds="window"
      >

        {this.props.todo}
       
      </Rnd>
    );
  }
}

export default Box;

/*
 <div class="alert alert-dismissible fade show" role="alert">
          {this.props.todo}

          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
*/