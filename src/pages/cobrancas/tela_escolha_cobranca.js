import React, { Component } from 'react';
import '../../templates/style_cobrar.scss';
import { Link } from 'react-router-dom';
import { Container, Col } from 'react-bootstrap';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import * as Icon from 'react-bootstrap-icons';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes';
import i18n from '../../tradutor/tradutor';

export default class Tela_escolha_cobranca extends Component {
    constructor() {
        super();
        this.state = {
            pagadores: [],
            mostrar_escolha: true,
            mostrar_boleto: false,
            mostrar_multiplos: false,
            mostrar_pagador: false,
            boletosAprovados: false,
            pessoa: [],
        };
    }

    componentDidMount() {
        const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: Funcoes.pessoa })

        const data = {
            url: 'sacado/lista',
            data: { 'conta_id': Funcoes.pessoa.conta_id },
            method: 'POST',
        };

        Funcoes.Geral_API(data, true).then((res) => {
            var arr = [];
            Object.keys(res).forEach(function (key) {
                arr.push(res[key]);
            });
            this.setState({ pagadores: arr });
        });
    };

    acessarGerarBoleto = () => {
        if (this.state.pagadores.length > 0) {
            window.location.href = '/cobrancas_boleto'
        } else {
            // alert('Voce não possui nenhum Favorecido cadastrado, para gerar seu boleto cadastre um favorecido antes')
            alert(i18n.t('cobranca.nenhumFavorecido'))
        }
    }

    render() {
            return (
                <>
                    <BannerTitle title={i18n.t('cobranca.cobranca')} img={Objetos.cobrarImg}/>
    
                    {this.state.mostrar_escolha ? (
                        <Container className="mt-4 col-12">
                            <Col sm={12} className="text-center">
                                <button
                                    onClick={() => this.setState({
                                        mostrar_escolha: false,
                                        mostrar_boleto: true,
                                        mostrar_multiplos: false,
                                        mostrar_pagador: false
                                    })}
                                    className="btn btn-primary cobrarEscolha"
                                    style={{}} >
                                    <Icon.FilePlusFill className="iconCobrar"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('cobranca.btnBoletoCobranca')}
                                    </p>
                                </button>
    
                                <button
                                    onClick={() => this.setState({
                                        mostrar_escolha: false,
                                        mostrar_boleto: false,
                                        mostrar_multiplos: true,
                                        mostrar_pagador: false
                                    })}
                                    className="btn btn-primary cobrarEscolha"
                                    style={{}} >
                                    <Icon.FilePlusFill className="iconCobrar"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('cobranca.btnLoteCobranca')}
                                    </p>
                                </button>
    
                                <button
                                    onClick={() => this.setState({
                                        mostrar_escolha: false,
                                        mostrar_boleto: false,
                                        mostrar_multiplos: false,
                                        mostrar_pagador: true
                                    })}
                                    className="btn btn-primary cobrarEscolha"
                                    style={{}} >
                                    <Icon.FilePlusFill className="iconCobrar"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('cobranca.btnPagadorCobranca')}
                                    </p>
                                </button>
                            </Col>
                        </Container>
                    ) : null}
    
                    {this.state.mostrar_boleto ? (
                        <>
                            <Container className="mt-4 col-md-10">
                               {/*  <Breadcrumb>
                                    <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                                    <Breadcrumb.Item href="/cobrancas">Cobranças</Breadcrumb.Item>
                                    <Breadcrumb.Item active>Boleto de Cobrança</Breadcrumb.Item>
                                </Breadcrumb> */}
                            </Container>
                            <Container className="mt-4 col-12">
                                <Col sm={12} className="text-center">
                                    <button
                                        onClick={() => this.acessarGerarBoleto()}
                                        className="btn btn-primary cobrarEscolha"
                                        style={{}} >
                                        <Icon.FilePlusFill className="iconCobrar"
                                            style={{}} />
                                        <p className="tituloBotoes">
                                            <br></br>
                                            {i18n.t('cobranca.btnGerarBoletoCobranca')}
                                        </p>
                                    </button>
    
                                    <Link
                                        to="/Gerenciar_Boletos"
                                        className="btn btn-primary cobrarEscolha"
                                        style={{}} >
                                        <Icon.JournalText style={{}} className="iconCobrar" />
                                        <p className="tituloBotoes">
                                            <br></br>
                                            {i18n.t('cobranca.btnGerenciarBoletoCobranca')}
                                        </p>
                                    </Link>
                                </Col>
                            </Container>
                        </>
                    ) : null}
    
                    {this.state.mostrar_multiplos ? (
                        <>
                            <Container className="mt-4 col-md-10">
                                {/* <Breadcrumb>
                                    <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                                    <Breadcrumb.Item href="/cobrancas">Cobranças</Breadcrumb.Item>
                                    <Breadcrumb.Item active>Gerar Múltiplos Boletos</Breadcrumb.Item>
                                </Breadcrumb> */}
                            </Container>
                            <Container className="mt-4 col-12">
                                <Col sm={12} className="text-center">
                                    <Link
                                        to="/multiplos_boletos"
    
                                        className="btn btn-primary cobrarEscolha"
                                        style={{}} >
                                        <Icon.Files style={{}} className="iconCobrar" />
                                        <p className="tituloBotoes">
                                            <br></br>
                                            {i18n.t('cobranca.btnGerarLoteCobranca')}
                                        </p>
                                    </Link>
    
                                    <Link
                                        to="/GerenciarLotesBoletos"
                                        className="btn btn-primary cobrarEscolha"
                                        style={{}} >
                                        <Icon.Layers style={{}} className="iconCobrar" />
                                        <p className="tituloBotoes">
                                            <br></br>
                                            {i18n.t('cobranca.btnGerenciarLoteCobranca')}
                                        </p>
                                    </Link>
                                </Col>
                            </Container>
                        </>
                    ) : null}
    
                    {this.state.mostrar_pagador ? (
                        <>
                            <Container className="mt-4 col-md-10">
                                {/* <Breadcrumb>
                                    <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                                    <Breadcrumb.Item href="/cobrancas">Cobranças</Breadcrumb.Item>
                                    <Breadcrumb.Item active>{i18n.t('cobranca.btnPagadorCobranca')}</Breadcrumb.Item>
                                </Breadcrumb> */}
                            </Container>
                            <Container className="mt-4 col-12">
                                <Col sm={12} className="text-center">
                                    <Link
                                        to="/Cadastro_Sacado"
                                        className="btn btn-primary cobrarEscolha"
                                        style={{}} >
                                        <Icon.PersonPlusFill style={{}} className="iconCobrar" />
                                        <p className="tituloBotoes">
                                            <br></br>
                                            {i18n.t('cobranca.btnCadastrarPagadorCobranca')}
                                        </p>
                                    </Link>
    
                                    <Link
                                        to="/Editar_Sacado"
                                        className="btn btn-primary cobrarEscolha"
                                        style={{}} >
                                        <Icon.PeopleFill style={{}} className="iconCobrar" />
                                        <p className="tituloBotoes">
                                            <br></br>
                                           {i18n.t('cobranca.btnGerenciarPagadorCobranca')}
                                        </p>
                                    </Link>
                                </Col>
                            </Container>
                        </>
                    ) : null}
                </>
            );
    }
}
