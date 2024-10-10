import React, { Component } from 'react';
import '../../templates/style_servicos.scss';
import * as Funcoes from '../../constants/Funcoes';
import { Container, Col, Row, Modal, Alert, Breadcrumb, Image, Accordion, Card, Button, InputGroup, Link } from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import { addDays, parse, subDays } from 'date-fns';
import CurrencyInput from 'react-currency-input';
import * as Formatar from '../../constants/Formatar';
import Produtos from '../../constants/Produtos';
import Objetos from '../../constants/Objetos';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Icones from '../../constants/Icon';
import * as Iconfa from "react-icons/fa";
import * as Icon from 'react-bootstrap-icons';
import ReactLoading from 'react-loading';
import OtpInput from 'react-otp-input';
import Select from 'react-select'
import { configConsumerProps } from 'antd/lib/config-provider';
import InputMask from 'react-input-mask';
import i18n from '../../tradutor/tradutor'


const data = [
    { label: "AC", value: "AC", key: 0 },
    { label: "AL", value: "AL", key: 1 },
    { label: "AM", value: "AM", key: 2 },
    { label: "AP", value: "AP", key: 3 },
    { label: "BA", value: "BA", key: 4 },
    { label: "CE", value: "CE", key: 5 },
    { label: "DF", value: "DF", key: 6 },
    { label: "ES", value: "ES", key: 7 },
    { label: "GO", value: "GO", key: 8 },
    { label: "MA", value: "MA", key: 9 },
    { label: "MT", value: "MT", key: 10 },
    { label: "MS", value: "MS", key: 11 },
    { label: "MG", value: "MG", key: 12 },
    { label: "PA", value: "PA", key: 13 },
    { label: "PB", value: "PB", key: 14 },
    { label: "PR", value: "PR", key: 15 },
    { label: "PE", value: "PE", key: 16 },
    { label: "PI", value: "PI", key: 17 },
    { label: "RJ", value: "RJ", key: 18 },
    { label: "RN", value: "RN", key: 19 },
    { label: "RS", value: "RS", key: 20 },
    { label: "RO", value: "RO", key: 21 },
    { label: "RR", value: "RR", key: 22 },
    { label: "SC", value: "SC", key: 23 },
    { label: "SP", value: "SP", key: 24 },
    { label: "SE", value: "SE", key: 25 },
    { label: "TO", value: "TO", key: 26 },
];

export default class Recarga extends Component {
    constructor() {
        super();
        global.servicos_recarga = [];
        this.state = {
            recarga: false,
            entretenimento: false,
            games: false,
            aplicativos: false,
            lista_precos: [],
            modal_valores: false,
            valores_recargas: false,
            recarregar: false,
            lista_ddd: [],
            loading: true,
            telefone: '',
            ddd: '',
            saldoDigital: 0,
            vl_min: '',
            vl_max: '',
            texto: '',
            show_preco: false,
            show_tel: false,
            show: false,
            id: '',
            vl_recarga: 0,
            confirmar_recarga: false,
            nome_recarga: '',
            operadoras:
            {
                text: [
                    'TIM',
                    'CLARO',
                    'OI',
                    'VIVO',
                    'ALGAR FIXO',
                    'ALGAR CEL',
                    'CLARO FIXO',
                    'VIVO FIXO',
                    'OI FIXO',
                    'NEXTEL',
                    'SERCOMTELF FIXO',
                    'SERCOMTELF CELULAR',
                    'CORREIOS CELULAR',
                ],
                img: [
                    Objetos.recargaOperadora1,
                    Objetos.recargaOperadora2,
                    Objetos.recargaOperadora3,
                    Objetos.recargaOperadora4,
                    Objetos.recargaOperadora5,
                    Objetos.recargaOperadora6,
                    Objetos.recargaOperadora7,
                    Objetos.recargaOperadora8,
                    Objetos.recargaOperadora9,
                    Objetos.recargaOperadora10,
                    Objetos.recargaOperadora11,
                    Objetos.recargaOperadora12,
                    Objetos.recargaOperadora13,
                ]
            },
            lista_nova_rv: [],
            modal_loading: false,
            servico_escolha: [],
            bloquear: false,
            signer_code: '',

        }
    }

    componentDidMount = () => {
        this.lista_produtos_rv()

        const dados = {
            url: 'conta/saldo',
            data: { 'conta_id': Funcoes.pessoa.conta_id },
            method: 'POST',
        };

        Funcoes.Geral_API(dados, true).then((res) => {
            this.setState({
                saldoDigital: res.digital
            });
        })

    }

    lista_produtos_rv = () => {

        const dados = {
            url: 'credito-em-servico/lista',
            data: '',
            method: 'POST',
        };
        /* const response = await api.post('conta/saldo', data, { headers },); */
        Funcoes.Geral_API(dados, true).then((res) => {


            var keys = Object.keys(res).length;

            for (var i = 0; i < keys; i++) {
                if (res[i].provider == "TIM") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                } else if (res[i].provider == "CLARO") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "VIVO") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "OI") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "ALGAR FIXA") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "ALGAR CEL") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "CLARO FIXO") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "VIVO FIXO") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "OI FIXO") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "NEXTEL") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "SERCOMTELF") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "SERCOMTELC") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "CORREIOS CELULAR") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
            }
            this.setState({ lista_nova_rv: global.servicos_recarga, loading: false })

        })
    }


    renderItem = (item, index) => {


        if (item.provider == "TIM") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[0]}
                    </p>
                    {this.state.operadoras.img[0]}
                </Button>
            )
        } else if (item.provider == "CLARO") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[1]}
                    </p>
                    {this.state.operadoras.img[1]}
                </Button>
            )
        } else if (item.provider == "OI") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[2]}
                    </p>
                    {this.state.operadoras.img[2]}
                </Button>
            )
        } else if (item.provider == "VIVO") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[3]}
                    </p>
                    {this.state.operadoras.img[3]}
                </Button>
            )
        } else if (item.provider == "ALGAR FIXA") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[4]}
                    </p>
                    {this.state.operadoras.img[4]}
                </Button>
            )
        } else if (item.provider == "ALGAR CEL") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[5]}
                    </p>
                    {this.state.operadoras.img[5]}
                </Button>
            )
        } else if (item.provider == "CLARO FIXO") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[6]}
                    </p>
                    {this.state.operadoras.img[6]}
                </Button>
            )
        } else if (item.provider == "VIVO FIXO") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[7]}
                    </p>
                    {this.state.operadoras.img[7]}
                </Button>
            )
        } else if (item.provider == "OI FIXO") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[8]}
                    </p>
                    {this.state.operadoras.img[8]}
                </Button>
            )
        } else if (item.provider == "NEXTEL") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[9]}
                    </p>
                    {this.state.operadoras.img[9]}
                </Button>
            )
        } else if (item.provider == "SERCOMTELF") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[10]}
                    </p>
                    {this.state.operadoras.img[10]}
                </Button>
            )
        } else if (item.provider == "SERCOMTELC") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[11]}
                    </p>
                    {this.state.operadoras.img[11]}
                </Button>
            )
        } else if (item.provider == "CORREIOS CELULAR") {
            return (
                <Button
                    key={index}
                    onClick={() => this.lista_valores_novo_rv(item.links[0].href)}
                    className="btn btn-primary botoesRecargas"
                    style={{}} >
                    <p className="">
                        {this.state.operadoras.text[12]}
                    </p>
                    {this.state.operadoras.img[12]}
                </Button>
            )
        }
    }

    lista_valores_novo_rv = (href) => {

        const dados = {
            url: 'credito-em-servico/info-produto',
            data: { "href": href },
            method: 'POST',
        };
        /* const response = await api.post('conta/saldo', data, { headers },); */
        Funcoes.Geral_API(dados, true).then((res) => {


            this.setState({ lista_precos: [] });

            var keys = Object.keys(res).length;

            var lista = [];

            for (var i = 0; i < keys; i++) {
                lista.push(
                    {
                        id: i,
                        nomeOperadora: res[i].valor,
                        amount: res[i].amount,
                        area_codes: res[i].area_codes,
                        fixed_amount: res[i].fixed_amount,
                        key: res[i].key,
                        kind: res[i].kind,
                        max: res[i].max,
                        min: res[i].min,
                        valor: res[i].valor,

                    },
                )
            }
            this.setState({ lista_precos: lista });
            setTimeout(() => {
                this.setState({ modal_valores: true, valores_recargas: true });
            }, 300);

        })
    }

    /* lista_ddd = (id) => {
        this.setState({ lista_ddd: [] });

        var lista = []

        this.state.lista_precos.map((value) => {
            if (value.id == id) {

                value.area_codes.map((value) => {
                    lista.push(
                        value
                    )
                })

                var keys = Object.keys(lista);
                var tam = keys.length;

                this.setState({ lista_ddd: lista })
                setTimeout(() => {
                    this.setState({ recarregar: true, valores_recargas: false });
                }, 300);
            }
        })
    } */

    detalhes_pedido = (item) => {
        this.setState({ servico_escolha: item });

        console.log(item)

        var valor_min = item.min;
        valor_min = valor_min.replace('R$', '');
        valor_min = valor_min.replace('.', '');

        console.log(valor_min);

        var valor_max = item.max;
        valor_max = valor_max.replace('R$', '');
        valor_max = valor_max.replace('.', '');

        console.log(valor_max);

        var num1 = valor_min;
        var num2 = valor_max;

        console.log(num1)
        console.log(num2)

        var num3 = saldoDigital.replace('.', '');
        num3 = num3.replace(',', '');

        console.log(num3)

        this.setState({
            vl_min: Formatar.formatReal(item.min),
            vl_max: Formatar.formatReal(item.max)
        })

        if (parseFloat(num1) == parseFloat(num2)) {
            if (parseFloat(num1) > parseFloat(num3)) {
                alert("Saldo Insuficiente para prosseguir");
            } else {
                var Tamanho_key = item.area_codes.length;

                if (Tamanho_key == 0) {
                    var lista = data;

                    this.setState({
                        texto: 'Escolha o Estado da Operadora'
                    });
                } else {
                    var Tamanho_key = item.area_codes.length;

                    var lista = [];

                    for (var i = 0; i < Tamanho_key; i++) {
                        lista.push({
                            label: String(item.area_codes[i]),
                            value: String(item.area_codes[i]),
                            key: i
                        })
                    }

                    this.setState({
                        texto: 'Escolha o DDD da Operadora'
                    })
                }

                if (item.fixed_amount == false) {
                    this.setState({
                        show_preco: true
                    })
                }

                this.setState({
                    lista_ddd: lista,
                    show_tel: true,
                    show: false,
                    id: item.key
                })

                setTimeout(() => {
                    this.setState({ show_tel: true })
                }, 200);
            }

        } else {
            if (parseFloat(num1 <= parseFloat(num3))) {
                var Tamanho_key = item.area_codes.length;

                if (Tamanho_key == 0) {
                    var lista = data;

                    this.setState({
                        texto: 'Escolha o Estado da Operadora'
                    })
                } else {
                    var Tamanho_key = item.area_codes.length;

                    var lista = []

                    for (var i = 0; i < Tamanho_key; i++) {
                        lista.push({
                            label: String(item.area_codes[i]),
                            value: String(item.area_codes[i]),
                            key: i
                        })
                    }

                    this.setState({
                        texto: 'Escolha o DDD da Operadora'
                    })
                }

                if (item.fixed_amount == false) {
                    this.setState({ show_preco: true })
                }

                this.setState({
                    lista_ddd: lista,
                    show_tel: true,
                    show: false,
                    id: item.key

                });

                setTimeout(() => {
                    this.setState({ show_tel: true })
                }, 200);
            } else {
                alert("Saldo Insuficiente")
            }
        }
    };

    valor = (text) => {
        var min = this.state.vl_min;
        var max = this.state.vl_max;

        var num1 = text.replace('.', '');
        num1 = num1.replace('.', '');
        num1 = num1.replace('.', '');
        num1 = num1.replace(',', '.');

        var num2 = this.state.saldoDigital.replace('.', '');
        num2 = num2.replace('.', '');
        num2 = num2.replace('.', '');
        num2 = num2.replace(',', '.');

        if (parseFloat(num1) > parseFloat(num2)) {
            this.setState({ bloquear: true });
        } else if (parseFloat(num1) < parseFloat(parseFloat(min))) {
            this.setState({ bloquear: true })
        } else if (parseFloat(num1) > parseFloat(max)) {
            this.setState({ bloquear: true })
        } else {
            this.setState({ bloquear: false })
        }
    }

    pedidoRecarga = () => {
        if (this.state.lista_ddd == '' || this.state.lista_ddd == null) {
            alert("É necessario escolher o DDD para prosseguir!")
        } else if (this.state.telefone == '' || this.state.telefone == null) {
            alert("É necessario preencher o Número de telefone para prosseguir!")
        } else {
            this.setState({ modal_loading: true })

            var servico = this.state.servico_escolha;
            var amount = this.state.advanced;
            var nome_servico = servico.nomeOperadora;

            if (amount != '') {
                amount = amount.replace(',', '');
                amount = parseInt(amount);
                nome_servico = nome_servico.split('R$')[0] + ' R$ ' + this.state.advanced;
            }

            const dados = {
                url: 'credito-em-servico/pedido',
                data: {
                    'kind': servico.kind,
                    'product_id': servico.key,
                    'fixed_amount': servico.fixed_amount,
                    'signer_code': this.state.signer_code,
                    'nome_servico': nome_servico,
                    'area_code': this.state.ddd_estado,
                    'cell_phone_number': this.state.telefone,
                    'amount': amount
                },
                method: 'POST',
                
            }


        }

    }


    render() {

        return (
            <>
                <section>

                    <BannerTitle title={"Serviços"} img={Objetos.servicoImg}/>

                    <Container>
                        <Row>
                            <Col className="col-12">
                                {/* <h3>Recarregue seu celular ou fixo de forma fácil e rápida</h3> */}
                                <h3>{i18n.t('servicos.recarregueCel')}</h3>
                                <hr />
                            </Col>
                        </Row>
                    </Container>
                    <Container fluid className="mt-4">
                        {/* <p className="text-center" style={{ fontSize: '1.65em' }}>Escolha o metodo de Servicos</p> */}
                        <Col className="text-center">
                            {this.state.loading ? (
                                <ReactLoading className="loadingPagar" type={'bubbles'} color={'#000'} height={'15%'} width={'15%'} />
                            ) : (
                                <Col className="text-center">
                                    {/* Recarga de Telefone */}
                                    {this.state.lista_nova_rv.map((value, index) => {
                                        return (this.renderItem(value, index))
                                    })}
                                </Col>
                            )}



                        </Col>
                    </Container>

                    <Modal centered animation={true} size="lg" show={this.state.modal_valores} onHide={() => { this.setState({ modal_valores: false }), window.location.href = '/recarga' }}>
                        <Modal.Body>
                            <div>
                                {/* <h3>Recarregue seu celular ou fixo de forma fácil e rápida</h3> */}
                                <h3>{i18n.t('servicos.recarregueCel')}</h3>
                                <hr />
                                {this.state.valores_recargas ? (
                                    <div>

                                        <ul className="valoresListas">
                                            {this.state.lista_precos.map((value) => {
                                                return (
                                                    <li key={value.key}>
                                                        <Button className="btnValor" onClick={() => {

                                                            this.setState({ vl_recarga: value.max, nome_recarga: value.nomeOperadora })
                                                            this.detalhes_pedido(value)
                                                        }}>{value.valor}</Button>
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                    </div>
                                ) : null}

                                {this.state.recarregar ? (
                                    <div>
                                        <select className="selectDDD" value={this.state.ddd} onChange={(e) => this.setState({ ddd: e.target.value })}>
                                            <option></option>
                                            {this.state.lista_ddd.map((value, index) => {

                                                return (
                                                    <option key={index} value={value} >{value}</option>
                                                )
                                            })}
                                        </select>
                                        <br /><br />
                                        {/* <h5>Número do Celular</h5> */}
                                        <h5>{i18n.t('servicos.cel')}</h5>
                                        <InputMask
                                            onChange={(e) => this.setState({ telefone: e.target.value })}
                                            className="form-control"
                                            required
                                            mask="99999-9999"
                                        />

                                        <button onClick={() => this.pedidoRecarga()} className="btn btnServicosSucesso btnServicosSucesso">Confirmar</button>
                                    </div>
                                ) : null}
                                <button type="button" className="btn btnServicosCancelar float-right" onClick={() => this.setState({ modal_valores: false })}>Fechar</button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal centered animation={true} size="lg" show={this.state.modal_loading} >
                        <Modal.Body>
                            <div>
                                <h2>Por Favor, Aguarde!</h2>
                                <ReactLoading className="loadingPagar" type={'bubbles'} color={'#000'} height={'15%'} width={'15%'} />
                            </div>
                        </Modal.Body>
                    </Modal>
                </section>
            </>
        );
    }
}