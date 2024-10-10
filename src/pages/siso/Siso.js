import React, { Component } from "react";
import "../../templates/style_siso.scss";
import { Modal, Container, Row, Image, Col, Carousel, Button } from "react-bootstrap";
import * as Iconio5 from "react-icons/io5";
import OtpInput from "react-otp-input";
import api from "../../services/api";
import Objetos from "../../constants/Objetos";
import Icones from "../../constants/Icon";
import * as Funcoes from "../../constants/Funcoes";
import * as Formatar from "../../constants/Formatar";
import ReactLoading from "react-loading";
import {
    BrowserView,
    MobileView,
    isIOS,
    isAndroid,
    deviceType,
} from "react-device-detect";
import Produtos from "../../constants/Produtos";
import * as Iconbs from "react-icons/bs";
import * as Iconmd from "react-icons/md";
import InputMask from "react-input-mask";
import $ from 'jquery';
import CurrencyInput from 'react-currency-input';
import i18n from '../../tradutor/tradutor';

export default class Siso extends Component {
    constructor() {
        super();
        this.state = {
            tipoConta: true,
            cpfProdutos: false,
            cnpjProdutos: false,
            mask: "999.999.999-99",
            buscarCpf: "",
            buscarCnpj: "",
            produtosCPF: false,
            produtosCNPJ: false,
            listaProdutos: [],
            campoSimulacao: false,
            campoSimulacaoValores: false,

            telefone: "",
            nome: '',
            email: '',
            originadora: '',
            valor: '',
            valorSimulacao: '',
            valorMedio: '',
            qtd_md_titulo: '',
            qtd_media_sacados: '',
            prazo: '',

            retornoSimulado: false,
            documentos: '',
            data: '',
            valorLiberado: 0,
            taxaJuros: 0,
            iof: 0,
            cet: 0,
            produto_escolhido: {},
            res_simulador: [],

            playStore: false,
            appleStore: false,

            modalError: false,
            erroMsg: '',

            historioModal: false,
            historicoSimula: [],

            modalAprovar: false,
        }
    }

    componentDidMount = () => {

    }

    maskaraInputCPF = (value) => {
        value = value.replace(/[^\d]+/g, "");
        if (value.length <= 11) {
            this.setState({ mask: "999.999.999-99" });
        }
        this.setState({ buscarCpf: value });
    };

    maskaraInputCnpj = (value) => {
        value = value.replace(/[^\d]+/g, "");
        if (value.length <= 11) {
            this.setState({ mask: "99.999.999/9999-99" });
        }
        this.setState({ buscarCnpj: value });
    };

    validarDocumentos = (id) => {
        if (id == 1) {
            if (this.state.buscarCpf == '') {
                alert("Número de CPF obrigatorio para prosseguir!")
            } else {
                this.setState({
                    cpfProdutos: false,
                    cnpjProdutos: false,
                    produtosCPF: true
                })
            }
        } else if (id == 2) {
            if (this.state.buscarCnpj == '') {
                alert("Número de CNPJ obrigatorio para prosseguir!")
            } else {
                var testeCNPJ = Formatar.TestaCNPJ(this.state.buscarCnpj);

                if (testeCNPJ == false) {
                    alert("CNPJ Invalido! Tente outro");
                } else {

                    this.setState({
                        cpfProdutos: false,
                        cnpjProdutos: false,
                        produtosCNPJ: true
                    })
                }
            }
        }


        this.listaProdutosSiso();
    }

    listaProdutosSiso = () => {

        const dados = {
            url: 'simulacao/lista-produto',
            data: '',
            method: 'POST',
        };
        Funcoes.Geral_API(dados, false).then((res) => {
            this.setState({ listaProdutos: res })
        })
    }

    validarProdutos = (value) => {

        this.setState({ produto_escolhido: value });
        //console.log(produto)
        setTimeout(() => {
            if (value.codigo == '00007') {
                this.camposProdutos();

            } else {
                alert('Produto não disponivel!')
            }
            console.log(this.state.produto_escolhido)
        }, 300);


    }

    maskaraInput = (value) => {

        value = value.replace(/[^\d]+/g, '');
        if (value.length <= 11) {
            this.setState({ mask: "999.999.999-99*" });
        } else {
            this.setState({ mask: "99.999.999/9999-99" });
        }
        this.setState({ documento: value })
    };

    camposProdutos = () => {

        var documento = '';

        var produto = this.state.produto_escolhido;

        console.log(this.state.buscarCpf)
        console.log(this.state.buscarCnpj)
        if (this.state.buscarCpf != '') {
            documento = Formatar.cpf_mask(this.state.buscarCpf)
            console.log(documento)
        } else if (this.state.buscarCnpj != '') {
            documento = Formatar.cnpj_mask(this.state.buscarCnpj)
            console.log(documento)
        }

        const dados = {
            url: 'simulacao/historico',
            data: {
                "documento": documento,
                "produto_codigo": produto.codigo,
                "produto_sub_codigo": produto.sub_codigo
            },
            method: 'POST',
        };

        Funcoes.Geral_API(dados, false).then((res) => {
            let num1 = 0
            let num2 = 3
            this.setState({ historicoSimula: res.slice(num1, num2) })
            if (res.length === 0) {
                this.setState({ campoSimulacao: true, produtosCNPJ: false, produtosCPF: false });
            } else {
                this.setState({ historioModal: true });
            }
        })
    }

    validaCampo = (id) => {
        if (id == 1) {
            if (this.state.nome == "") {
                alert("Digite o Nome da Empresa para Conitnuar");
            } else if (this.state.email == "") {
                alert("Digiteo E-Mail da Empresa para Continuar");
            } else if (this.state.telefone == "") {
                alert("Digite o Telefone Celular para Coninuar");
            } else {
                this.setState({ campoSimulacaoValores: true, campoSimulacao: false })
            }
        } else if (id == 2) {
            if (this.state.valorSimulacao == "") {
                alert("Por Favor digite o Valor Desejado para Continuar");
            } else if (this.state.valorMedio == "") {
                alert("Por Favor digite o Valor Medio dos Títulos para Continuar");
            } else if (this.state.qtd_md_titulo == "") {
                alert("Por favor digite a Quantidade Média de Títulos para Continuar")
            } else if (this.state.qtd_media_sacados == "") {
                alert("Por favor digte a Quantidade Média de Sacados para continuar")
            } else if (this.state.prazo == "") {
                alert("Por favor digite o Prazo para continuar")
            } else {
                this.respostaSimulado();
            }
        }
    }


    respostaSimulado = () => {

        if (this.state.buscarCpf !== "") {
            this.setState({ documentos: Formatar.cpf_mask(this.state.buscarCpf) })
            var documentos = Formatar.cpf_mask(this.state.buscarCpf);
        } else if (this.state.buscarCnpj != "") {
            this.setState({ documentos: Formatar.cnpj_mask(this.state.buscarCnpj) })
            var documentos = Formatar.cnpj_mask(this.state.buscarCnpj);
        }

        const data = new Date();
        const mes = data.getMonth() + 1;
        const dataSimulado = data.getDate() + "/" + mes + "/" + data.getFullYear();
        this.setState({ data: dataSimulado });


        var valorSimulacao = 0;
        var valorSimulacao = this.state.valorSimulacao;

        valorSimulacao = valorSimulacao.replace('R$', '');
        valorSimulacao = valorSimulacao.replace('.', '');
        valorSimulacao = valorSimulacao.replace('.', '');
        valorSimulacao = valorSimulacao.replace('.', '');
        valorSimulacao = valorSimulacao.replace('.', '');
        valorSimulacao = valorSimulacao.replace(',', '.');

        var valorMedio = 0;
        var valorMedio = this.state.valorMedio;

        valorMedio = valorMedio.replace('R$', '');
        valorMedio = valorMedio.replace('.', '');
        valorMedio = valorMedio.replace('.', '');
        valorMedio = valorMedio.replace('.', '');
        valorMedio = valorMedio.replace('.', '');
        valorMedio = valorMedio.replace(',', '.');






        const dados = {
            url: 'simulacao/simular',
            data: JSON.stringify({
                produto: {
                    codigo: this.state.produto_escolhido.codigo,
                    sub_codigo: this.state.produto_escolhido.sub_codigo,
                },
                prospect: {
                    nome: this.state.nome,
                    documento: documentos,
                    telefone: this.state.telefone,
                    email: this.state.email,
                    contato: this.state.nome
                },
                simulacao: {
                    valor: parseFloat(valorSimulacao),
                    quantidade_media_titulos: this.state.qtd_md_titulo,
                    prazo: this.state.prazo,
                    quantidade_media_sacados: this.state.qtd_media_sacados,
                    valor_medio_titulos: parseFloat(valorMedio),

                }
            }),
            method: 'POST',
        };
        Funcoes.Geral_API(dados, false).then((res) => {
            if (res.msg != null) {
                this.setState({ modalError: true, erroMsg: res.msg })
            } else {
                setTimeout(() => {
                    this.setState({ res_simulador: res })
                    this.setState({ retornoSimulado: true, campoSimulacaoValores: false, })

                }, 300);
            }
            console.log(res);
        })
    }

    aprovarSimulacao = () => {



        const dados = {
            url: 'simulacao/aprovacao',
            data: {
                "id": this.state.res_simulador.id
            },
            method: 'POST',
        };
        Funcoes.Geral_API(dados, false).then((res) => {
            if (res == 1) {
                this.setState({ modalAprovar: true })
            } else {
                alert("Erro em Aprovar")
            }
        })
    }

    pdfSimulacao = () => {
        const dados = {
            url: 'simulacao/pdf',
            data: {
                "id": this.state.res_simulador.id
            },
            method: 'PDF',
        };
        Funcoes.Geral_API(dados, false).then((res) => {
            console.log(res);

            const file = new Blob([res], { type: 'application/pdf' });
            var anchor = document.createElement('a');
            anchor.download = "Simulação.pdf";
            anchor.href = (window.webkitURL || window.URL).createObjectURL(file);
            anchor.dataset.downloadurl = ['application/pdf', anchor.download, anchor.href].join(':');
            anchor.click();
        })
    }

    refazerSimulacao = (id) => {
        var histo = this.state.historicoSimula;

        histo.map((histo) => {
            this.setState({ nome: histo.prospect.nome, email: histo.prospect.email, telefone: histo.prospect.telefone })
            if (id == 1) {
                histo.parametros.map((param) => {
                    if (param.chave === "valor") {
                        this.setState({ valorSimulacao: param.valor })
                    }
                    if (param.chave === "quantidade_media_titulos") {
                        this.setState({ qtd_md_titulo: param.valor })
                    }
                    if (param.chave === "prazo") {
                        this.setState({ prazo: param.valor })
                    }
                    if (param.chave === "quantidade_media_sacados") {
                        this.setState({ qtd_media_sacados: param.valor })
                    }
                    if (param.chave === "valor_medio_titulos") {
                        this.setState({ valorMedio: param.valor })
                    }
                })
                this.setState({ campoSimulacao: true, produtosCNPJ: false, produtosCPF: false, historioModal: false })
            } else if (id == 2) {
                this.setState({ campoSimulacao: true, produtosCNPJ: false, produtosCPF: false, historioModal: false })
            }

        })





    }



    render() {

        return (
            <section className="siso" >
                <section className="header">
                    <Container >
                        <Row>
                            <Col className="col-12">
                                <span className="logoSiso">{Objetos.logo_banco_siso}</span>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section>
                    <br /><br />
                    {/* Campos de Login */}
                    <Container>
                        <Row>
                            <Col className="col-md-12 login-usuario">
                                <Row>
                                    <Col className="col-md-6">
                                        {/* <h3>Nossos Produtos</h3> */}
                                        <h3>{i18n.t('siso.produtos')}</h3>
                                    </Col>
                                    <Col className="col-md-6">
                                        <Button className="btnInicio" onClick={() => window.location.href = '/'}>Voltar ao Inicio </Button>
                                    </Col>
                                </Row>
                                <hr className="divisoria" />

                                {/* <h5>Quer realizar um projeto ou um sonho? Viajar, casar, estudar, reformar a casa ou até investir no seu negócio? Nós podemos te ajudar a realizar esse sonho!</h5> */}
                                <h5>{i18n.t('siso.realizar')}</h5>
                                <br />

                                <Container>
                                    {this.state.tipoConta ? (
                                        <Row className="justify-content-center">
                                            <button type="button" className="btn btn-primary col-5 mt-12 text-center sisoButton"
                                                style={{ height: 70, justifyContent: 'center' }}
                                                onClick={() => this.setState({
                                                    cpfProdutos: true,
                                                    tipoConta: false
                                                })}>
                                                <span><Iconbs.BsPerson

                                                    style={{ fontSize: "30px", float: 'left', margin: 'auto -50px auto 30px' }}
                                                    className="icon_new"
                                                // /><h5>Pessoa Física</h5></span>
                                                /><h5>{i18n.t('siso.pf')}</h5></span>
                                            </button>

                                            <button type="button" className="btn btn-primary col-5 mt-12 text-center sisoButton"
                                                style={{ height: 70, justifyContent: 'center' }}
                                                onClick={() => this.setState({
                                                    cnpjProdutos: true,
                                                    tipoConta: false
                                                })}>
                                                <span><Iconmd.MdCardTravel

                                                    style={{ fontSize: "30px", float: 'left', margin: 'auto -50px auto 30px' }}
                                                    className="icon_new"
                                                // /><h5>Pessoa Jurídica</h5></span>
                                                /><h5>{i18n.t('siso.pj')}</h5></span>
                                            </button>
                                        </Row>

                                    ) : null}

                                    {this.state.cpfProdutos ? (
                                        <Row className="justify-content-center">
                                            {/* <h6>Para prosseguirmos vamos precisar que você preencha seu CPF</h6> */}
                                            <h6>{i18n.t('siso.cpf')}</h6>
                                            <InputMask
                                                className="form-control"
                                                id="cpfBusca"
                                                required
                                                value={this.state.buscarCpf}
                                                onChange={(event) => this.maskaraInputCPF(event.target.value)}
                                                //onChange={(e) => this.setState({ buscarCpf: e.target.value })}
                                                mask={this.state.mask}
                                            />
                                            <button type="button" className="btn btn-primary col-5 mt-12 text-center sisoButtonCpf"
                                                style={{ height: 50, justifyContent: 'center' }}
                                                onClick={() => this.validarDocumentos(1)} >
                                                {/* <h5>Continuar</h5> */}
                                                <h5>{i18n.t('siso.continuar')}</h5>
                                            </button>

                                        </Row>
                                    ) : null}

                                    {this.state.cnpjProdutos ? (
                                        <Row className="justify-content-center">
                                            {/* <h6>Para prosseguirmos vamos precisar que você preencha o CNPJ de sua empresa</h6> */}
                                            <h6>{i18n.t('siso.cnpj')}</h6>
                                            <InputMask
                                                className="form-control"
                                                id="cpfBusca"
                                                required
                                                value={this.state.buscarCnpj}
                                                onChange={(event) => this.maskaraInputCnpj(event.target.value)}
                                                //onChange={(e) => this.setState({ buscarCpf: e.target.value })}
                                                mask={this.state.mask}
                                            />
                                            <button type="button" className="btn btn-primary col-5 mt-12 text-center sisoButtonCpf"
                                                style={{ height: 50, justifyContent: 'center' }}
                                                onClick={() => this.validarDocumentos(2)} >
                                                {/* <h5>Continuar</h5> */}
                                                <h5>{i18n.t('siso.continuar')}</h5>
                                            </button>
                                            {/* <h5 className="esqSenha_new" style={{ cursor: 'pointer', fontSize: "12px", marginTop: '8px' }} onClick={() => this.setState({ tipoProdutos: true, cnpjProdutos: false })} >Voltar</h5> */}
                                        </Row>
                                    ) : null}

                                    {this.state.produtosCPF ? (
                                        <Row className="justify-content-center">
                                            <ul>
                                                {this.state.listaProdutos.map((siso, index) => {
                                                    if (siso.segmento == 1) {
                                                        return (
                                                            <Button className="sisoBtnProdutos" key={index} onClick={() => this.validarProdutos(siso)}>
                                                                <label value={siso.id}>{siso.nome_produto}</label>
                                                            </Button>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                        </Row>
                                    ) : null}

                                    {this.state.produtosCNPJ ? (
                                        <Row className="justify-content-center">
                                            <ul className="listasBancosOutros">
                                                {this.state.listaProdutos.map((siso, index) => {
                                                    if (siso.segmento == 2) {
                                                        return (
                                                            <Button className="sisoBtnProdutos" key={index} onClick={() => this.validarProdutos(siso)}>
                                                                <label className="titlebancos" value={siso.id}>{siso.nome_produto}</label>
                                                            </Button>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                        </Row>
                                    ) : null}

                                    {this.state.campoSimulacao ? (
                                        <Row className="justify-content-center">
                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>*Nome Empresa:</p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.nomeEmpresa')}</p>
                                                <input
                                                    className="form-control"
                                                    required
                                                    id="nome_empresa"
                                                    // placeholder="Digite o Nome da Empresa"
                                                    placeholder={i18n.t('siso.digiteNomeEmpresa')}
                                                    value={this.state.nome}

                                                    onChange={(e) => this.setState({ nome: e.target.value })}
                                                    style={{ width: '50%' }}
                                                />
                                                <br />
                                            </div>

                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>E-Mail da Empresa:</p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.emailEmpresa')}</p>
                                                <input
                                                    className="form-control"
                                                    required
                                                    id="email"
                                                    // placeholder="Digite o E-Mail da Empresa"
                                                    placeholder={i18n.t('siso.digiteEmailEmpresa')}
                                                    value={this.state.email}
                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                    style={{ width: '50%' }}
                                                />
                                                <br />
                                            </div>
                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>Telefone Celular:</p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.cel')}</p>
                                                <InputMask
                                                    onChange={(e) =>
                                                        this.setState({ telefone: e.target.value })
                                                    }
                                                    className="form-control"
                                                    required
                                                    mask="(99)99999-9999"
                                                    style={{ width: '50%' }}
                                                    value={this.state.telefone}
                                                />
                                                <br />
                                            </div>



                                            <button type="button" className="btn btn-primary col-5 mt-12 text-center sisoButtonCpf"
                                                style={{ height: 50, justifyContent: 'center' }}
                                                onClick={() => this.validaCampo(1)} >
                                                {/* <h5>Continuar</h5> */}
                                                <h5>{i18n.t('siso.continuar')}</h5>
                                            </button>

                                        </Row>
                                    ) : null}

                                    {this.state.campoSimulacaoValores ? (
                                        <Row className="justify-content-center">
                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>*Valor Desejado:</p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.valorDesejado')}</p>
                                                <CurrencyInput
                                                    className="form-control"
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    value={this.state.valorSimulacao}
                                                    onChange={(valor) =>
                                                        this.setState({ valorSimulacao: valor })
                                                    }
                                                    style={{ width: '50%' }}
                                                />
                                                <br />
                                            </div>

                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>*Valor Médio dos Títulos:</p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.valorMedio')}</p>
                                                <CurrencyInput
                                                    className="form-control"
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    value={this.state.valorMedio}
                                                    onChange={(valor) =>
                                                        this.setState({ valorMedio: valor })
                                                    }
                                                    style={{ width: '50%' }}
                                                />
                                                <br />
                                            </div>
                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>*Quantidade Média de Títulos</p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.quantidadeTil')}</p>
                                                <input
                                                    type="number"
                                                    value={this.state.qtd_md_titulo}
                                                    onChange={(e) => this.setState({ qtd_md_titulo: e.target.value })}
                                                    className="form-control"
                                                    style={{ width: '50%' }} />
                                                <br />
                                            </div>

                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>*Quantidade Média de Sacados</p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.quantidadeSacados')}</p>
                                                <input
                                                    type="number"
                                                    value={this.state.qtd_media_sacados}
                                                    onChange={(e) => this.setState({ qtd_media_sacados: e.target.value })}
                                                    className="form-control"
                                                    style={{ width: '50%' }} />
                                                <br />
                                            </div>

                                            <div className="col-12">
                                                {/* <p style={{ margin: '5px 10px' }}>*Prazo (Dias): </p> */}
                                                <p style={{ margin: '5px 10px' }}>{i18n.t('siso.prazo')}</p>
                                                <input
                                                    type="number"
                                                    value={this.state.prazo}
                                                    onChange={(e) => this.setState({ prazo: e.target.value })}
                                                    className="form-control"
                                                    style={{ width: '50%' }} />
                                                <br />
                                            </div>


                                            <button type="button" className="btn btn-primary col-5 mt-12 text-center sisoButtonCpf"
                                                style={{ height: 50, justifyContent: 'center' }}
                                                onClick={() => this.validaCampo(2)} >
                                                {/* <h5>Simular</h5> */}
                                                <h5>{i18n.t('siso.simular')}</h5>
                                            </button>

                                        </Row>
                                    ) : null}


                                    <Modal
                                        size="lg"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={this.state.modalError}
                                        onHide={() => this.setState({ modalError: false })}>
                                        <Modal.Body /* style={{ heigth: '88%' }} */>
                                            <h2>{this.state.erroMsg}</h2>
                                        </Modal.Body>
                                    </Modal>


                                    {this.state.retornoSimulado ? (
                                        <Row className="justify-content-center returnSimulacao">
                                            <Col className="col-12">
                                                <h1 style={{ color: '#fff' }}>{this.state.produto_escolhido.nome_produto}</h1>
                                            </Col>
                                            <br /><br /><br /><br />
                                            <hr style={{ borderColor: '#fff' }} />
                                            <Col className="col-12">
                                                {/* <p>Nome de Empresa</p> */}
                                                <p>{i18n.t('siso.nomeDeEmpresa')}</p>
                                            </Col>
                                            <Col className="col-12">
                                                <h2>{this.state.nome}</h2>
                                            </Col>
                                            <br /><br />
                                            <Col className="col-12">
                                                {/* <p>CNPJ</p> */}
                                                <p>{i18n.t('siso.cnpjLabel')}</p>
                                            </Col>
                                            <Col className="col-12">
                                                <h2>{this.state.documentos}</h2>
                                            </Col>
                                            <br /><br />
                                            <Col className="col-6">
                                                {/* <p>Data da Simualação</p> */}
                                                <p>{i18n.t('siso.dataSimulacao')}</p>
                                                <h2>{Formatar.formatarDate(this.state.res_simulador.criado_em)}</h2>
                                            </Col>
                                            <Col className="col-6">
                                                {/* <p>Valor Solicitado R$</p> */}
                                                <p>{i18n.t('siso.valorSolicitado')}</p>
                                                <h2>R$ {Formatar.formatReal(this.state.res_simulador.simulacao.valor_solicitado)}</h2>
                                            </Col>
                                            <br /><br /><br /><br />
                                            <Col className="col-2">
                                                {/* <p>Quantidade de Títulos</p> */}
                                                <p>{i18n.t('siso.quantidadeTitulos')}</p>
                                                <h2>{this.state.qtd_md_titulo}</h2>
                                            </Col>
                                            <Col className="col-4">
                                                <p>Valor Médio dos Títulos R$</p>
                                                <h2>R$ {Formatar.formatReal(this.state.valorMedio)}</h2>
                                            </Col>
                                            <Col className="col-2">
                                                {/* <p>Prazo Médio em Dias</p> */}
                                                <p>{i18n.t('siso.prazoMedio')}</p>
                                                <h2>{this.state.prazo}</h2>
                                            </Col>
                                            <Col className="col-4">
                                                {/* <p>Quantidade de Sacados</p> */}
                                                <p>{i18n.t('siso.quantidadeSacados2')}</p>
                                                <h2>{this.state.qtd_media_sacados}</h2>
                                            </Col>
                                            <br /><br /><br /><br />
                                            <Col className="col-12">
                                                {/* <p>Valor Liberado R$</p> */}
                                                <p>{i18n.t('siso.valorLiberado')}</p>
                                            </Col>
                                            <Col className="col-12">
                                                <h2>R$ {Formatar.formatReal(this.state.res_simulador.simulacao.a_ser_creditado)}</h2>
                                            </Col>

                                            <br /><br /><br /><br />
                                            <Col className="col-4">
                                                {/* <p>Taxa de Juros Mensal %</p> */}
                                                <p>{i18n.t('siso.taxa')}</p>
                                                <h2>% {Formatar.decimalMask(this.state.res_simulador.simulacao.juros_mensal)}</h2>
                                            </Col>
                                            <Col className="col-4">
                                                {/* <p>IOF R$</p> */}
                                                <p>{i18n.t('siso.iof')}</p>
                                                <h2>R$ {Formatar.formatReal(this.state.res_simulador.simulacao.iof)}</h2>
                                            </Col>
                                            <Col className="col-4">
                                                {/* <p>CET %</p> */}
                                                <p>{i18n.t('siso.cet')}</p>
                                                <h2>% {Formatar.decimalMask(this.state.res_simulador.simulacao.cet)}</h2>
                                            </Col>


                                            <Col className="col-10">
                                                <br />
                                                {/* <Button onClick={() => this.pdfSimulacao()} className="btnPDF" >Baixar PDF de Simulação</Button> */}
                                                <Button onClick={() => this.pdfSimulacao()} className="btnPDF" >{i18n.t('siso.pdf')}</Button>
                                            </Col>
                                            <Col className="col-12">
                                                <br /><br />
                                                <hr className="divisoria" />
                                                <br /><br />
                                            </Col>

                                            <Col className="col-6">
                                                {/* <Button onClick={() => window.location.href = "/siso"} className="btnLojasApp" >Refazer a Simulação</Button> */}
                                                <Button onClick={() => window.location.href = "/siso"} className="btnLojasApp" >{i18n.t('siso.refazer')}</Button>
                                            </Col>

                                            <Col className="col-6">
                                                {/* <Button onClick={() => this.aprovarSimulacao()} className="btnLojasApp" >Aprovar a Simulação</Button> */}
                                                <Button onClick={() => this.aprovarSimulacao()} className="btnLojasApp" >{i18n.t('siso.aprovar')}</Button>
                                            </Col>

                                            <Col className="col-12">
                                                <br /><br />
                                                {/* <h4>Ficou interessado em nossos produtos? Aproveite para instalar o nosso Aplicativo escolhendo a Loja disponivel em seu dispositivo movel no botões abaixo e scaneando o QRCode</h4> */}
                                                <h4>{i18n.t('siso.interessado')}</h4>
                                                <h4></h4>
                                                <hr className="divisoria" />
                                                <br /><br />
                                            </Col>


                                            {Produtos.btnPlay ? (
                                                <Col className="col-6">
                                                    <Button onClick={() => this.setState({ playStore: true })} className="btnLojasApp" >Play Store</Button>
                                                </Col>
                                            ) : null}

                                            {Produtos.btnApple ? (
                                                <Col className="col-6">
                                                    <Button onClick={() => this.setState({ appleStore: true })} className="btnLojasApp" >Apple Store</Button>
                                                </Col>
                                            ) : null}

                                        </Row>

                                    ) : null}

                                </Container>

                            </Col>

                        </Row>
                    </Container>
                </section>


                <Modal show={this.state.playStore} centered onHide={() => this.setState({ playStore: false })}>
                    <Modal.Body>
                        <Row>
                            <Col className="col-md-12">
                                <h2>Play Store</h2>
                                <hr className="divisoria" />
                            </Col>
                        </Row>
                        <div style={{ display: 'block', margin: 'auto' }}>
                            {Objetos.qrcode_play_store}
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.appleStore} centered onHide={() => this.setState({ appleStore: false })}>
                    <Modal.Body>
                        <Row>
                            <Col className="col-md-12">
                                <h2>Apple Store</h2>
                                <hr className="divisoria" />
                            </Col>
                        </Row>
                        <div style={{ display: 'block', margin: 'auto' }}>
                            {Objetos.qrcode_apple_store}
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal size="lg" show={this.state.historioModal} centered onHide={() => this.setState({ historioModal: false })}>
                    <Modal.Body >
                        <Row>
                            <Col className="col-md-">
                                {/* <h3>Ja existe solicitações feitas anteriormente</h3> */}
                                <h3>{i18n.t('solicitacoes')}</h3>
                                <hr className="divisoria" />
                            </Col>
                        </Row>
                        {this.state.historicoSimula.map((histo) => {
                            return (
                                <Row key={histo.simulacao.id} className="historico">
                                    <Col className="col-md-8">
                                        {/* <h5 >Data de Simulação: <b><u>{Formatar.formatarDateSave(histo.simulacao.criado_em)}</u></b></h5> */}
                                        <h5 >{i18n.t('siso.dataSimulacao2')}<b><u>{Formatar.formatarDateSave(histo.simulacao.criado_em)}</u></b></h5>
                                        <h5 >Valor Desejado: <b>R$ {
                                            histo.parametros.map((param) => {
                                                if (param.chave == "valor") {
                                                    return (<u key={param.id}>{Formatar.formatReal(param.valor)}</u>)
                                                }
                                            })}</b></h5>
                                        {/* <h5 >Valor a ser Creditado: <b>R$ { */}
                                        <h5 >{i18n.t('siso.valorDesejado2')}<b>R$ {
                                            histo.resultado.map((result) => {
                                                if (result.campo == "a ser creditado") {
                                                    return (<u key={result.id}>{Formatar.formatReal(result.valor)}</u>)
                                                }
                                            })}</b></h5>
                                    </Col>
                                    <Col className="col-md-4">
                                        <Button id={histo.simulacao.id} onClick={() => this.refazerSimulacao(1)}>Refazer Simulação</Button>
                                    </Col>
                                </Row>
                            )
                        })}
                        <Col className="col-md-12">
                            <Button className="btnFazerSimulacao" onClick={() => this.refazerSimulacao(2)}>Realizar Nova Simulação</Button>
                        </Col>
                    </Modal.Body>
                </Modal>


                <Modal size="lg" show={this.state.modalAprovar} centered onHide={() => this.setState({ modalAprovar: false })}>
                    <Modal.Body >
                        <Col className="col-12" style={{ justifyContent: 'center' }}>
                            {/* <h2>Obrigado por Aprovar a Simulação!</h2> */}
                            <h2>{i18n.t('siso.obrigado')}</h2>
                            <hr className="divisoria" />
                            <br />
                            {/* <h3> Aproveite para abrir uma conta no nosso Banco Digital.</h3> */}
                            <h3>{i18n.t('siso.aproveite')}</h3>
                        </Col>
                        <Col className="col-md-12">
                            <br />
                            <button type="button" className="btn btnSimulacaoCancelar btn-danger float-right" onClick={() => this.setState({ modalAprovar: false })}>Fechar</button>
                        </Col>
                    </Modal.Body>
                </Modal>

                <br /><br /><br /><br />
            </section >

        );
    }
}
