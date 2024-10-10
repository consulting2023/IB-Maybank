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
import Select from 'react-select'
import { configConsumerProps } from 'antd/lib/config-provider';
import InputMask from 'react-input-mask';
import i18n from '../../tradutor/tradutor';

export default class Games extends Component {
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
                    "RAZER GOLD",
                    "LEVEL UP",
                    "STEAM",
                    "PLAYSTATION",
                    "LEAGUE OF LEGENDS",
                    "XBOX",

                ],
                img: [
                    Objetos.games1,
                    Objetos.games2,
                    Objetos.games3,
                    Objetos.games4,
                    Objetos.games5,
                    Objetos.games6,
                    

                ]
            },
            lista_nova_rv: []

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
                if (res[i].provider == "STEAM") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                } else if (res[i].provider == "PAYSAFECARD") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "SPOTIFY") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "SKY") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "OI TV") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
                else if (res[i].provider == "GOOGLEPLAY") {
                    global.servicos_recarga.push(
                        res[i],
                    )
                }
            }
            this.setState({ lista_nova_rv: global.servicos_recarga, loading: false })

        })
    }


    renderItem = (item, index) => {


        if (item.provider == "STEAM") {
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
        } else if (item.provider == "PAYSAFECARD") {
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
        } else if (item.provider == "SPOTIFY") {
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
        } else if (item.provider == "SKY") {
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
        } else if (item.provider == "OI TV") {
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
        } else if (item.provider == "GOOGLEPLAY") {
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

    lista_ddd = (id) => {
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
    }


    render() {

        return (
            <>
                <section>

                    <BannerTitle title={i18n.t("Serviço")} img={Objetos.servicoImg}/>

                    <Container>
                        <Row>
                            <Col className="col-12">
                                {/* <h3>Recarregue seus games de forma fácil e rápida</h3> */}
                                <h3>{i18n.t('servicos.recarregueGames')}</h3>
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
                                <h3>{i18n.t('servicos.recarregaCel')}</h3>
                                <hr />
                                {this.state.valores_recargas ? (
                                    <div>

                                        <ul className="valoresListas">
                                            {this.state.lista_precos.map((value) => {
                                                return (
                                                    <li key={value.key}>
                                                        <Button className="btnValor" onClick={() => {
                                                            this.lista_ddd(value.id);
                                                            this.setState({ vl_recarga: value.max, nome_recarga: value.nomeOperadora })
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

                                        <button onClick={() => this.setState({ confirmar_recarga: true, recarregar: false })} className="btn btnServicosSucesso btnServicosSucesso">Continuar</button>
                                    </div>
                                ) : null}

                                {this.state.confirmar_recarga ? (
                                    <div>
                                        <h3>{this.state.nome_recarga}</h3>
                                        <h4>{this.state.vl_recarga}</h4>
                                    </div>
                                ) : null}




                                <button type="button" className="btn btnServicosCancelar float-right" onClick={() => this.setState({ modal_valores: false })}>Fechar</button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </section>
            </>
        );
    }
}