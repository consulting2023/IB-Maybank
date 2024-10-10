import React, { Component } from 'react';
import '../../templates/style_servicos.scss';
import * as Funcoes from '../../constants/Funcoes';
import { Container, Col, Row, Modal, Alert, Breadcrumb, Image, Accordion, Card, Button, InputGroup, Link } from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import { addDays, subDays } from 'date-fns';
import CurrencyInput from 'react-currency-input';
import * as Formatar from '../../constants/Formatar';
import Produtos from '../../constants/Produtos';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Objetos from '../../constants/Objetos';
import Icones from '../../constants/Icon';
import * as Iconfa from "react-icons/fa";
import * as Icon from 'react-bootstrap-icons';
import ReactLoading from 'react-loading';
import OtpInput from 'react-otp-input';
import i18n from '../../tradutor/tradutor';

export default class Servicos extends Component {
    constructor() {
        super();
        this.state = {
            recarga: false,
            entretenimento: false,
            games: false,
            aplicativos: false
        }
    }



    render() {

        return (
            <>
                <section>

                    <BannerTitle title={i18n.t("Serviços")} img={Objetos.servicoImg}/>

                    <Container fluid className="mt-4">
                        {/* <p className="text-center" style={{ fontSize: '1.65em' }}>Escolha o metodo de Servicos</p> */}
                        <Col className="text-center">
                            {/* Recarga de Telefone */}
                            <Button
                                onClick={() => window.location.href = "/recarga"}
                                className="btn btn-primary botoesServicos"
                                style={{}} >
                                <Iconfa.FaMobileAlt className="iconServicos"
                                    style={{}} />
                                <p className="tituloBotoes">
                                    <br></br>
                                    {/* Recarga de Telefone */}
                                    {i18n.t('servicos.tituloTel')}
                                </p>
                            </Button>
                            {/* Entretenimento */}
                            <Button
                                onClick={() => window.location.href = '/entretenimento'}
                                className="btn btn-primary botoesServicos"
                                style={{}} >

                                <Icon.Display className="iconServicos"
                                    style={{}} />
                                <p className="tituloBotoes">
                                    <br></br>
                                    {/* Entretenimento */}
                                    {i18n.t('servicos.tituloEntr')}
                                </p>
                            </Button>
                            {/* Games */}
                            <Button
                                onClick={() => window.location.href = '/games'}
                                className="btn btn-primary botoesServicos"
                                style={{}} >
                                <Icon.Controller className="iconServicos"
                                    style={{}} />
                                <p className="tituloBotoes">
                                    <br></br>
                                    {/* Games */}
                                    {i18n.t('servicos.tituloGames')}
                                </p>
                            </Button>
                            {/* Aplicativos */}
                            <Button
                                onClick={() => window.location.href = "/aplicativos"}
                                className="btn btn-primary botoesServicos"
                                style={{}} >
                                <Iconfa.FaCar className="iconServicos"
                                    style={{}} />
                                <p className="tituloBotoes">
                                    <br></br>
                                    {/* Aplicativos  */}
                                    {i18n.t('servicos.tituloApps')}
                                </p>
                            </Button>
                        </Col>
                    </Container>
                </section>
            </>
        );
    }
}