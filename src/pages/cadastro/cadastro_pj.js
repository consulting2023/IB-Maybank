import React, { Component } from "react";
import "../../templates/style_cadastro.scss";
import {
  Modal,
  Container,
  Row,
  Col,
  Carousel,
  Button,
  ButtonGroup,
  FormControl,
  FormGroup,
} from "react-bootstrap";
import Icones from "../../constants/Icon";
import OtpInput from "react-otp-input";
import Objetos from "../../constants/Objetos";
import * as Funcoes from "../../constants/Funcoes";
import ReactLoading from "react-loading";
import {
  isIOS,
  isAndroid,
  isMobile,
  isBrowser,
  deviceType,
} from "react-device-detect";
import Produtos from "../../constants/Produtos";
import i18n from "../../tradutor/tradutor";
import LangButton from "../../components/langButton/LangButton";

export default class CadastroPj extends Component {
  constructor() {
    super();
    this.state = {
      cadastroPt1: true,
      cadastroPt2: false,
    };
  }

  render() {
    if (deviceType == "browser") {
      return (
        <div className="login">
          <Container className="navbar navbar-fixed-top barra_superior">
            <div className="navbar-header">
              <div>{Objetos.logo_banco_login}</div>
            </div>
            <ul className="nav navbar-nav">
              {Produtos.mostrar_tradutor ? (
                <li className="loginLangWrapper">
                  <LangButton langProp={this.traduzir} />
                </li>
              ) : null}
            </ul>
          </Container>

          <div className="h-80 d-flex flex-row align-items-center justify-content-center">
            {/* Campos de Login */}
            <div className="cadastropj select-none d-flex align-items-center">
              <div className="w-100">
                <div>
                  {this.state.cadastroPt1 ? (
                    <div>
                      <h1 className="mb-2">
                        Iremos começar o cadastro da sua conta PJ
                      </h1>

                      <hr className="divisoria" />

                      <h2 className="m-0">
                        {i18n.t("login.info_credenciais", {
                          banco: process.env.NOME_BANCO,
                        })}
                      </h2>
                    </div>
                  ) : null}
                </div>

                <br />
              </div>
            </div>
          </div>

          {/* Campo Slide */}
        </div>
      );
    } else {
      if (isAndroid) {
        return (window.location.href = process.env.LOJA_GOOGLE);
      } else if (isIOS) {
        return (window.location.href = process.env.LOJA_APPLE);
      }
    }
  }
}
