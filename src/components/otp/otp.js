import React, { Component } from "react";
// import "../../templates/style_otp.scss";
import { InputGroup, Form } from "react-bootstrap";

export default class Otp extends Component {
  constructor() {
    super();
    this.state = {
      codes: ['','','','','',''],
      next: null,
      prev: null,
      refs: [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()],
    };
  }

  getDigit = (index) => {
    let nextDigit = 5;
    let prevDigit = 0;
    if (index < 5) nextDigit = index + 1;
    if (index > 0) prevDigit = index - 1;
    this.setState({ next: nextDigit, prev: prevDigit });
  }

  sendNumbers = async () => {
    const codesString = (this.state.codes).join('');
    this.props.otpProp(codesString);
  }

  render() {
    return (
      <InputGroup className="d-flex flex-row justify-content-between">
        {
          this.state.codes.map((num, index) => {
            return (
              <Form.Control
                key={index}
                onChange={(text) => {
                  let newCodes = this.state.codes;
                  const re = /^[0-9\b]+$/;
                  if (re.test(text.target.value)) {
                    newCodes[index] = text.target.value;
                    this.setState({ codes: newCodes });
                    this.state.refs[this.state.next].current.focus();
                    this.sendNumbers();
                  }
                }}
                onFocus={ () => {
                  this.getDigit(index);
                  if (this.state.codes[index] != '') this.state.refs[index].current.select();
                }}
                onKeyDown={ e => {
                  if (e.key === 'Backspace') {
                    let newCodes = this.state.codes;
                    if (this.state.codes[index] === '') {
                      newCodes[this.state.prev] = '';
                      this.state.refs[this.state.prev].current.focus();
                    } else {
                      newCodes[index] = '';
                    }
                    this.setState({ codes: newCodes });
                    this.sendNumbers();
                  }
                }}
                ref={this.state.refs[index]}
                value={num}
                className={'text-center ' + ((index < 5) ? 'mr-2' : null)}
                maxLength="1"
                style={{ backgroundColor: 'transparent', maxWidth: '55px', height: '60px', fontFamily: 'Gantari', fontSize: '14pt' }}
              />
            )
          })
        }
      </InputGroup>
    )
  }
    
}
