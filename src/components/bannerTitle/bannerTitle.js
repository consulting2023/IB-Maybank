import React, { Component } from "react";
import "../../templates/style_bannerTitle.scss";
import { Image } from 'react-bootstrap';

export default class BannerTitle extends Component {
  render() {
    return (
      <div className="bannerTitle">
        <Image draggable="false" onDragStart={ () => {return false} } className="banner d-block select-none" src={this.props.img} fluid/>
        {
          (this.props.title != "") ? <p className="titulo text-right pr-5 position-relative">{this.props.title}</p> : null
        }
      </div>
    )
  }
    
}
