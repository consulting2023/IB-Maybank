import React, { Component } from 'react';
import '../../templates/style_cobrar.scss';
import { Container, Col, Row } from 'react-bootstrap';
import InputMask from "react-input-mask";
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import { registerLocale } from "react-datepicker";
import br from 'date-fns/locale/pt-BR';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes';
import i18n from '../../tradutor/tradutor';

registerLocale('pt-BR', br)
export default class Editar_Sacado extends Component {
    constructor() {
        super();
        this.state = {
            pessoa: [],
            pagadores: [],
            sacadoId: '',
            nome: '',
            documento: '',
            endereco_rua: '',
            endereco_numero: '',
            endereco_complemento: '',
            endereco_bairro: '',
            endereco_cep: '',
            endereco_municipio: '',
            endereco_uf: '',
            mask: "99999-999",
            maskDoc: "999.999.999-99",
            disabled: false
        };
    }

    componentDidMount() {

        const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: pessoa });


        const dados = {
            url: 'sacado/lista',
            data: { 'conta_id': Funcoes.pessoa.conta_id },
            method: 'POST',
        };

        Funcoes.Geral_API(dados, true).then((res) => {
            var arr = [];
            Object.keys(res).forEach(function (key) {
                arr.push(res[key]);
            });
            this.setState({ pagadores: arr });
        });

    };

    consultar = () => {

        const dados = {
            url: 'utilitarios/cep',
            data: { cep: this.state.endereco_cep },
            method: 'POST',
        };

        Funcoes.Geral_API(dados, true).then((res) => {

            if (typeof res.uf !== 'undefined') {
                this.setState({ endereco_rua: res.logradouro });
                this.setState({ endereco_bairro: res.bairro });
                this.setState({ endereco_municipio: res.localidade });
                this.setState({ endereco_uf: res.uf });
                this.setState({ disabled: true });
            } else {
                // alert('CEP inválido');
                alert(i18n.t('cobranca.falhaCEP'));
            }
        });
    };

    cadastrar = () => {

        var id = this.state.sacadoId;
        var nome = this.state.nome;
        var documento = this.state.documento;
        var endereco_rua = this.state.endereco_rua;
        var endereco_numero = this.state.endereco_numero;
        var endereco_complemento = this.state.endereco_complemento;
        var endereco_bairro = this.state.endereco_bairro;
        var endereco_cep = this.state.endereco_cep;
        var endereco_municipio = this.state.endereco_municipio;
        var endereco_uf = this.state.endereco_uf;

        if (nome === '') {
            // alert('Digite o nome');
            alert(i18n.t('cobranca.digiteNome'));
        } else if (documento === 'documento') {
            // alert('Digite o documento');
            alert(i18n.t('cobranca.digiteDoc'));
        } else if (endereco_rua === '') {
            // alert('Digite o logradouro');
            alert(i18n.t('cobranca.digiteLog'));
        } else if (endereco_numero === '') {
            // alert('Digite o numero');
            alert(i18n.t('cobranca.digiteNumero'));
        } else if (endereco_bairro === '') {
            // alert('Digite o bairro');
            alert(i18n.t('cobranca.digiteBairro'));
        } else if (endereco_cep === '') {
            // alert('Digite o CEP');
            alert(i18n.t('cobranca.digiteCEP'));
        } else if (endereco_municipio === '') {
            // alert('Digite o municipio');
            alert(i18n.t('cobranca.digiteMunicipio'));
        } else if (endereco_uf === '') {
            // alert('Digite o estado');
            alert(i18n.t('cobranca.digiteEstado'));
        } else {

            const dados = {
                url: 'sacado/update',
                data: {
                    'conta_id': this.state.pessoa.conta_id,
                    "id": id,
                    "nome": nome,
                    "documento": documento.replace(/[^0-9]/g, ''),
                    "endereco_rua": endereco_rua,
                    "endereco_numero": endereco_numero,
                    "endereco_complemento": endereco_complemento,
                    "endereco_bairro": endereco_bairro,
                    "endereco_cep": endereco_cep,
                    "endereco_municipio": endereco_municipio,
                    "endereco_uf": endereco_uf,
                },
                method: 'POST',
            };

            Funcoes.Geral_API(dados, true).then((res) => {
                if (res === 0) {
                    alert(i18n.t('cobranca.falhaAtualizacao'));
                } else {
                    alert(i18n.t('cobranca.pagadorAtualizado'));
                    window.location.href = '/cobrancas';
                }
            });
        }
    };

    carregar_pagador = (id) => {

        this.state.pagadores.map(pagador => {
            if (pagador.id == id) {
                this.setState({
                    documento: pagador.documento,
                    email: pagador.email,
                    endereco_bairro: pagador.endereco_bairro,
                    endereco_cep: pagador.endereco_cep,
                    endereco_complemento: pagador.endereco_complemento,
                    endereco_municipio: pagador.endereco_municipio,
                    endereco_numero: pagador.endereco_numero,
                    endereco_rua: pagador.endereco_rua,
                    endereco_uf: pagador.endereco_uf,
                    nome: pagador.nome
                })
            }
        })
    }

    maskaraInput = (value) => {

        value = value.replace(/[^\d]+/g, '');
        if (value.length <= 11) {
            this.setState({ maskDoc: "999.999.999-99*" });
        } else {
            this.setState({ maskDoc: "99.999.999/9999-99" });
        }
        this.setState({ documento: value })
    };

    render() {
        return (
            <>
        
                <BannerTitle title={i18n.t('cobranca.cobranca')} img={Objetos.cobrarImg}/>
        
                <Container className="mt-4 col-md-10">
                   {/*  <Breadcrumb>
                        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/cobrancas">Cobrança</Breadcrumb.Item>
                        <Breadcrumb.Item active>Gerenciar Pagadores</Breadcrumb.Item>
                    </Breadcrumb> */}
                </Container>
        
                <Container className="mt-1 col-md-12 text-center">
                    <p className="text-center" style={{ fontSize: '1.85em' }}>{i18n.t('cobranca.textEditarSacado')}</p>
                </Container>
                <Container className="mt-4 campoGerarBoleto col-md-10 margin-auto" style={{}} >
                    <Col >
                        <div className="margin-auto">
                            <Row>
                                <div className="form-group col-12">
                                    <label>{i18n.t('cobranca.pagadorSacado')}</label>
                                    <select required className="form-control" onChange={event => {
                                        this.setState({ sacadoId: event.target.value });
                                        this.carregar_pagador(event.target.value);
                                    }}>
                                        <option></option>
                                        {this.state.pagadores.map(pagador => (
                                            <option key={pagador.id} value={pagador.id}>{pagador.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </Row>
                            <Row>
                                <div className="form-group col-lg-8">
                                    <label>{i18n.t('cobranca.nomeSacado')}</label>
                                    <input
                                        className="form-control"
                                        value={this.state.nome}
                                        onChange={event => this.setState({ nome: event.target.value })}
                                    />
                                </div>
                                <div className="form-group col-lg-4">
                                    <label>CPF/CNPJ</label>
                                    <InputMask
                                        className="form-control"
                                        id="cpfBusca"
                                        required
                                        value={this.state.documento}
                                        onChange={event => this.maskaraInput(event.target.value)}
                                        //onChange={(e) => this.setState({ buscarCpf: e.target.value })}
                                        mask={this.state.maskDoc}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="form-group col-lg-3">
                                    <label>{i18n.t('cobranca.cepSacado')}</label>
                                    <InputMask
                                        className="form-control"
                                        value={this.state.endereco_cep}
                                        onChange={event => this.setState({ endereco_cep: event.target.value })}
                                        mask={this.state.mask}
                                    />
                                </div>
                                <div className="form-group col-lg-3" style={{ marginTop: 'auto' }}>
                                    <button type="button" className="btn btnCEPCobrar btn-sm btn-success" onClick={() => this.consultar()}>{i18n.t('cobranca.pesquisarCepSacado')}</button>
                                </div>
        
                            </Row>
                            <Row>
                                <div className="form-group col-lg-12">
                                    <label>{i18n.t('cobranca.enderecoSacado')}</label>
                                    <input
                                        className="form-control"
                                        value={this.state.endereco_rua}
                                        onChange={event => this.setState({ endereco_rua: event.target.value })}
                                        disabled={this.state.disabled}
                                    />
                                </div>
                                <div className="form-group col-lg-3">
                                    <label>{i18n.t('cobranca.numeroSacado')}</label>
                                    <input
                                        className="form-control"
                                        value={this.state.endereco_numero}
                                        onChange={event => this.setState({ endereco_numero: event.target.value })}
                                    />
                                </div>
                                <div className="form-group col-lg-9">
                                    <label>{i18n.t('cobranca.complementoSacado')}</label>
                                    <input
                                        className="form-control"
                                        value={this.state.endereco_complemento}
                                        onChange={event => this.setState({ endereco_complemento: event.target.value })}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="form-group col-lg-3">
                                    <label>{i18n.t('cobranca.ufSacado')}</label>
                                    <input
                                        className="form-control"
                                        value={this.state.endereco_uf}
                                        onChange={event => this.setState({ endereco_uf: event.target.value })}
                                        maxLength="2"
                                        disabled={this.state.disabled}
                                    />
                                </div>
                                <div className="form-group col-lg-3">
                                    <label>{i18n.t('cobranca.municipioSacado')}</label>
                                    <input
                                        className="form-control"
                                        value={this.state.endereco_municipio}
                                        onChange={event => this.setState({ endereco_municipio: event.target.value })}
                                        disabled={this.state.disabled}
                                    />
                                </div>
                                <div className="form-group col-lg-3">
                                    <label>{i18n.t('cobranca.bairroSacado')}</label>
                                    <input
                                        className="form-control"
                                        value={this.state.endereco_bairro}
                                        onChange={event => this.setState({ endereco_bairro: event.target.value })}
                                        disabled={this.state.disabled}
                                    />
                                </div>
                            </Row>
                            <button type="button" className="btn btnCadastrarCobrar btn-sm btn-success" onClick={() => this.cadastrar()}>{i18n.t('cobranca.btnSacado')}</button>
                        </div>
                    </Col>
                </Container>
            </>
        );
    }
}
