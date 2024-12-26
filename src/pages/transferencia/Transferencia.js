import React, { Component } from 'react';
import '../../templates/style_transferencia.scss';
import { Container, Col, Row, Button, ButtonGroup, Modal, Alert } from 'react-bootstrap';
import Icones from '../../constants/Icon';
import { Link } from 'react-router-dom';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Objetos from '../../constants/Objetos';
import i18n from '../../tradutor/tradutor';

export default class Transferencia extends Component {
  render() {
    return (
      <div>
        <BannerTitle title={i18n.t('transferencia.transferencia')} img={Objetos.transferenciaImg}/>

        <Container className="p-3 d-flex justify-content-center">
          <Col md={8} className="baseWindow px-5 py-4">
            <Row>
              <p className="mb-2 w-100 text-center" style={{ fontSize: "1.30em" }}><strong>Escolha o método de transferência:</strong></p>
            </Row>
            <Row className="text-center px-3">
              <Col className="p-3">
                <Link
                  to="/transferencia_interna"
                >
                  <Button variant="outline-primary" className="baseButtonPrimary">
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.transferenciaInterna}
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">
                          {i18n.t('transferencia.btnEntraContas', {nome_banco: process.env.NOME_BANCO})}
                        </p>
                      </Col>
                    </Row>
                  </Button>
                </Link>
              </Col>
              {/* <Col className="p-3">
                <Link
                  to="/transferencia_outros"
                >
                  <Button variant="outline-primary" className="baseButtonPrimary">
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.transferenciaOutros}
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">
                          {i18n.t('transferencia.btnParaOutros')}
                        </p>
                      </Col>
                    </Row>
                  </Button>
                </Link>
              </Col> */}
              <Col className="p-3">
                <Link
                  to="/transferencia_lote"
                >
                  <Button variant="outline-primary" className="baseButtonPrimary">
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.transferenciaLote}
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">
                          {i18n.t('transferencia.btnLote', {nome_banco: process.env.NOME_BANCO})}
                        </p>
                      </Col>
                    </Row>
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Container>
      </div>
    )
  }
}