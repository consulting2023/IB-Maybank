import React, { Component } from 'react';
import '../../templates/style_extrato.scss';
import { Container, Col, Row, Button, ButtonGroup, Modal, Alert } from 'react-bootstrap';
import Objetos from '../../constants/Objetos';
import Produtos from '../../constants/Produtos';
import Icones from '../../constants/Icon';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import * as Funcoes from '../../constants/Funcoes';
import * as Iconio5 from "react-icons/io5";
import { Link } from 'react-router-dom';
import i18n from '../../tradutor/tradutor';

export default class Extrato extends Component {

  render() {
    return (
      <div className="extrato">
        <BannerTitle title={i18n.t('extrato.extrato')} img={Objetos.extratoImg}/>
         
        <Container className="p-3 d-flex justify-content-center">
          <Col md={8} className="baseWindow px-5 py-4">
            <Row>
              <p className="mb-2 w-100 text-center" style={{ fontSize: "1.30em" }}><strong>Escolha o extrato que deseja sacar:</strong></p>
            </Row>
            <Row className="text-center px-3">
              <Col className="p-3">
                <Link
                  to='/extrato_conta'
                >
                  <Button variant="outline-primary" className="baseButtonPrimary">
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.extratoDigital}
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">{i18n.t('extrato.btnExtratoDigital')}</p>
                      </Col>
                    </Row>
                  </Button>
                </Link>
              </Col>
              {
                Produtos.extratoCartao ? (
                  <Col className="p-3">
                    <Link
                      to='/extrato_cartao'
                    >
                      <Button variant="outline-primary" className="baseButtonPrimary">
                        <Row className="w-80 m-auto">
                          <Col xs={5} className="m-auto px-0">
                            {Icones.extratoCartao}
                          </Col>
                          <Col xs={7} className="px-0 my-auto">
                            <p className="buttonTitle m-auto">{i18n.t('extrato.btnExtratoCartao')}</p>
                          </Col>
                        </Row>
                      </Button>
                    </Link>
                  </Col>

                ) : null
              }
              {
                Produtos.extratoConvenio ? (
                  <Link
                    to='/extrato_convenio'
                    className="extratoEscolha"
                  >
                    <Button>
                      <Iconio5.IoLogoUsd className="iconExtrato" />
                      <p className="tituloBotoes">
                        <br></br>
                        {i18n.t('extrato.btnExtratoConvenio')}
                      </p>
                    </Button>
                  </Link>
                ) : null
              }
              {
                Produtos.extratoInvestimento ? (
                  <Link
                    to='/extrato_investimento'
                    className="extratoEscolha"
                  >
                    <Button>
                      <Iconio5.IoBarChart className="iconExtrato" />
                      <p className="tituloBotoes">
                        <br></br>
                        {i18n.t('extrato.btnExtratoInvestimento')}
                      </p>
                    </Button>
                  </Link>
                ) : null
              }
              {
                Produtos.extratoParcelado ? (
                  <Link
                    to='/extrato_parcelado'
                    className="extratoEscolha"
                  >
                    <Button>
                      <Iconio5.IoBarcodeSharp className="iconExtrato" />
                      <p className="tituloBotoes">
                        <br></br>
                        {i18n.t('extrato.btnExtratoParcelado')}
                      </p>
                    </Button>
                  </Link>
                ) : null
              }
              {
                Produtos.extratoFinanceira ? (
                  <Link
                    to='/extrato_financeira'
                    className="extratoEscolha"
                  >
                    <Button>
                      <Iconio5.IoNewspaperOutline className="iconExtrato" />
                      <p className="tituloBotoes">
                        <br></br>
                        {i18n.t('extrato.btnExtratoAgenda')}
                      </p>
                    </Button>
                  </Link>
                ) : null
              }
            </Row>
          </Col>
        </Container>
      </div>
    )
  }

}