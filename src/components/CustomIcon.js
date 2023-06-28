import React, { Component } from "react";
import {
  MdScreenSearchDesktop,
  MdPhoneInTalk,
  MdMonetizationOn,
  MdLocalTaxi,
} from "react-icons/md";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

class CustomIcon extends Component {
  components = {
    first: MdScreenSearchDesktop,
    second: MdPhoneInTalk,
    third: MdMonetizationOn,
    fourth: MdLocalTaxi,
    back: BsChevronCompactLeft,
    next: BsChevronCompactRight,
  };
  render() {
    const TagName = this.components[this.props.tag];
    return <TagName />;
  }
}
export default CustomIcon;
