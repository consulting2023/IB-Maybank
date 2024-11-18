import React, { Component } from "react";
import "../../templates/style_extrato.scss";
import {
  Container,
  Col,
  Row,
  Button,
  ButtonGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import Objetos from "../../constants/Objetos";
import Produtos from "../../constants/Produtos";
import Icones from "../../constants/Icon";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import * as Funcoes from "../../constants/Funcoes";
import * as Iconio5 from "react-icons/io5";
import { Link } from "react-router-dom";
import i18n from "../../tradutor/tradutor";

export default class Relatorio extends Component {
  render() {
    return (
      <div className="extrato">
        <BannerTitle title={"Relatorio"} img={Objetos.extratoImg} />

        <Container className="p-3 d-flex justify-content-center">
          <Col md={8} className="baseWindow px-5 py-4">
            <Row>
              {/*   <p
                className="mb-2 w-100 text-center"
                style={{ fontSize: "1.30em" }}
              >
                <strong>Escolha o extrato que deseja sacar:</strong>
              </p> */}
            </Row>
            <Row className="text-center px-3">
              <Col className="p-3">
                <Link to="/relatorio_saida">
                  <Button
                    variant="outline-primary"
                    className="baseButtonPrimary"
                  >
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.extratoDigital}
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">
                          Relatorio Saida Pix
                        </p>
                      </Col>
                    </Row>
                  </Button>
                </Link>
              </Col>

              <Col className="p-3">
                <Link to="/relatorio_entrada">
                  <Button
                    variant="outline-primary"
                    className="baseButtonPrimary"
                  >
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.extratoDigital}
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">
                          Relatorio Entrada Pix
                        </p>
                      </Col>
                    </Row>
                  </Button>
                </Link>
              </Col>

              {Produtos.nivelPerfil == 400 ? null : (
                <Col className="p-3">
                  <Link to="/relatorio_crypo">
                    <Button
                      variant="outline-primary"
                      className="baseButtonPrimary"
                    >
                      <Row className="w-80 m-auto">
                        <Col xs={5} className="m-auto px-0">
                          {Icones.cambio}
                        </Col>
                        <Col xs={7} className="px-0 my-auto">
                          <p className="buttonTitle m-auto">Relatorio Crypto</p>
                        </Col>
                      </Row>
                    </Button>
                  </Link>
                </Col>
              )}
            </Row>
          </Col>
        </Container>
      </div>
    );
  }
}
