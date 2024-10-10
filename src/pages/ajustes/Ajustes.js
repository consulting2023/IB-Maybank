import React, { Component } from 'react';
import '../../templates/style_ajustes_.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Objetos from '../../constants/Objetos';
import { isIOS, isAndroid, deviceType } from "react-device-detect";
import i18n from '../../tradutor/tradutor';

export default class Ajustes extends Component {

    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        if (deviceType == 'browser') {
            return (
                /* Barra Superior com Logo */
                < section className="ajustes" >
                    <section className="barra_superior">
                        <Container>
                            <Row className="">
                                <Col className="col-12 ">
                                    <span className="logoLogin">{Objetos.logo_banco_login}</span>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                    <br /><br />
                    <section>
                        {/* Campos de Login */}
                        <Container>
                            <Row>
                                <Col className="col-md-12 login-usuario">

                                    {/* <h3>Ola, Seja Bem Vindo ao {process.env.NOME_BANCO}</h3> */}
                                    <h3>{i18n.t('ajustes.ola', {nome_banco: process.env.NOME_BANCO})}</h3>

                                    <hr className="divisoria" />
                                    <br />
                                    {/* <h4>O Internet Banking do {process.env.NOME_BANCO} esta em manutenção no momento!</h4> */}
                                    <h4>{i18n.t('ajustes.manutencao', {nome_banco: process.env.NOME_BANCO})}</h4>

                                    <br />
                                    {/* <h5>Em Breve Retornaremos funcionando normalmente.</h5> */}
                                    <h5>{i18n.t('ajustes.retornaremos')}</h5>
                                    {/* <h6>Para mais informações entre em contado com a nossa central de ajuda: <b style={{fontSize: 16}}>{process.env.EMAIL_BANCO}</b></h6> */}
                                    <h6>{i18n.t('ajustes.info')}<b style={{fontSize: 16}}>{process.env.EMAIL_BANCO}</b></h6>

                                    <br />

                                </Col>
                            </Row>
                        </Container>
                    </section>
                </section >
            );
        } else {
            if (isAndroid) {
                return window.location.href = process.env.LOJA_GOOGLE
            } else if (isIOS) {
                return window.location.href = process.env.LOJA_APPLE
            }
        }
    }

}
