import React, { Component } from "react";
import "../../templates/style_password.scss";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import Icones from '../../constants/Icon';
import i18n from '../../tradutor/tradutor';

export default class Password extends Component {
  constructor() {
    super();
    this.state = {
      passwords: ['','','','','',''],
      numeros: [],
      showPass: [false, false, false, false, false, false],
      blocos: ['', '', '', '', '', ''],
    };
  }

  componentDidMount() {
    this.random_number();
  }

  random_number = () => {
    var numeroArray = [];
    for (var i = 0; i < 100; i++) {
      let numero_aleatorio = Math.floor(Math.random() * 10);
      let tem = 0;

      for (var j = 0; j < (Object.keys(numeroArray)).length; j++) {
        if (numeroArray[j] == numero_aleatorio) tem = 1;
      }
      if (tem == 0) numeroArray.push(numero_aleatorio);
    };

    this.setState({ numeros: numeroArray });
  };

  inserir_chave = (id) => {
    let { passwords, showPass, blocos, numeros } = this.state;
    const emptyField = passwords.findIndex((e) => e == '');

    passwords[emptyField] = id;
    showPass[emptyField] = true;

    switch (id) {
      case 1: blocos[emptyField] = [numeros[0], numeros[1]]; break;
      case 2: blocos[emptyField] = [numeros[2], numeros[3]]; break;
      case 3: blocos[emptyField] = [numeros[4], numeros[5]]; break;
      case 4: blocos[emptyField] = [numeros[6], numeros[7]]; break;
      case 5: blocos[emptyField] = [numeros[8], numeros[9]]; break;
      default: blocos[emptyField] = '';
    }

    this.setState({ passwords: passwords, showPass: showPass, blocos: blocos });
    this.props.passProp(blocos);
  };

  deletar_chave = () => {
    let { passwords, showPass, blocos } = this.state;
    const notEmpty = passwords.findLastIndex((e) => e !== '');

    passwords[notEmpty] = '';
    showPass[notEmpty] = false;
    blocos[notEmpty] = '';
   
    this.setState({ passwords: passwords, blocos: blocos, showPass: showPass });
    this.props.passProp(blocos);
  };

  render() {
    const digitosHelper = [[0,1], [2,3], [4,5], [6,7], [8,9]];
    return (
      <div className="password">
        <Col>
          <Row className="caixa_senha mb-3 d-flex flex-row justify-content-between" >
            {
              this.state.showPass.map((show, index) => (
                <div className="senha" key={index}>
                  {show ? (<div className="numSenha d-block mx-auto my-1"></div>) : null}
                </div>
              ))
            }
          </Row>

          <Row className="caixa_digitos mt-3 text-nowrap" >
            <ButtonGroup className="w-100 d-flex flex-row justify-content-between">
              {
                digitosHelper.map((num, index) =>(
                  <Button 
                    key={index}
                    className='button_digitos btn-primary mr-2'
                    onClick={() => this.inserir_chave(index + 1)}
                  >
                    {this.state.numeros[num[0]] + i18n.t('login.ou') + this.state.numeros[num[1]]}
                  </Button>
                ))
              }
              <Button
                key={99}
                className='button_digitos btn-primary backspace'
                onClick={() => this.deletar_chave()}
              >
                {Icones.apagar}
              </Button>
            </ButtonGroup>
          </Row>
        </Col>
      </div>
    )
  }
    
}
