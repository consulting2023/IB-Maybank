import React, { Component } from 'react';
import ReactPagination from "react-js-pagination";
import '../../templates/style_cobrar.scss';
import { Container, Col, Row, Button } from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import br from 'date-fns/locale/pt-BR';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes';
import * as Formatar from '../../constants/Formatar';
import ReactLoading from 'react-loading';
import i18n from '../../tradutor/tradutor';

registerLocale('pt-BR', br)
export default class Gerenciar_Boletos extends Component {
    constructor() {
        super();
        this.state = {
            pessoa: [],
            lotes: [],
            logs: [],
            lotes_mostrar: false,
            dataDe: new Date(),
            dataAte: new Date(),
            paginacao: 1,
            cortarLotes: [],
            numeroRegistro: 0,
            loading: false,
            qtd_dias: 1,
        };
    }

    componentDidMount() {
        const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: pessoa });
    };

    paginacao = (numero) => {
        let array_cortar = [];
        this.state.lotes.map(dados => (
            array_cortar.push(dados)
        ))

        this.setState({ paginacao: (numero) })
        let numero1 = (numero - 1) * 10
        let numero2 = (numero * 10)
        this.setState({ cortarLotes: array_cortar.slice(numero1, numero2) })
    }

    boleto_lista = () => {
        this.setState({ loading: true });
        this.setState({ paginacao: 1 })

        this.setState({ cortarLotes: [] })
        this.setState({ numeroRegistro: 0, lotes: [] });
        this.setState({ lotes_mostrar: false })

        const dados = {
            url: 'boleto/boleto/boletos-usuario',
            data: {
                usuario_id: Funcoes.pessoa.usuario_id,
                data_de: Formatar.formatarDateAno(this.state.dataDe),
                data_ate: Formatar.formatarDateAno(this.state.dataAte)
            },
            method: 'POST',
        };
        /* const response = await api.post('conta/saldo', data, { headers },); */
        Funcoes.Geral_API(dados, true).then((res) => {
            this.setState({ loading: false });

            const obj = res;
            let lista = [];
            var i = 0;

            var num = obj.length;

            if (num > 0) {
                res.map((boleto) => {
                    if (boleto.sacado_id != null) {

                        var data_emissao = boleto.data_emissao.split("-");
                        var data_vencimento = boleto.data_vencimento.split("-");
                        data_emissao = (data_emissao[2] + '/' + data_emissao[1] + '/' + data_emissao[0]);
                        data_vencimento = (data_vencimento[2] + '/' + data_vencimento[1] + '/' + data_vencimento[0]);
                        var cor_status = '';

                        var status = boleto.status;

                        if (status == 0) {
                            var data_atual = new Date();
                            data_atual = data_atual.toJSON();
                            data_atual = data_atual.split("T");
                            var texto_status = '';

                            if (data_atual[0] > boleto.data_vencimento) {
                                cor_status = '#ff6d5f';
                                // texto_status = 'Vencido';
                                texto_status = i18n.t('cobranca.vencido');
                            } else {
                                cor_status = '#41a8d8';
                                // texto_status = 'Em aberto';
                                texto_status = i18n.t('cobranca.emAberto');
                            }
                        } else {
                            cor_status = 'green';
                            if (boleto.data_pago != null) {
                                var data_pago = boleto.data_pago.split("-");
                                data_pago = (data_pago[2] + '/' + data_pago[1] + '/' + data_pago[0]);
                                // texto_status = 'Pago: ' + data_pago;
                                texto_status = i18n.t('cobranca.pagoEm', {dataPago: data_pago});
                            } else {
                                // texto_status = 'Pago';
                                texto_status = i18n.t('cobranca.pago');
                            }
                        }

                        if (this.state.qtd_dias == 1) {
                            lista.push(
                                {
                                    id: boleto.id,
                                    agencia: boleto.agencia,
                                    carteira: boleto.carteira,
                                    cedente_cep: boleto.cedente_cep,
                                    cedente_cidade: boleto.cedente_cidade,
                                    cedente_documento: boleto.cedente_documento,
                                    cedente_endereco: boleto.cedente_endereco,
                                    cedente_nome: boleto.cedente_nome,
                                    cedente_uf: boleto.cedente_uf,
                                    conta: boleto.conta,
                                    conta_id: boleto.conta_id,
                                    data_emissao: boleto.data_emissao,
                                    data_vencimento: boleto.data_vencimento,
                                    instrucoes: boleto.instrucoes,
                                    juros: boleto.juros,
                                    linha_digitavel: boleto.linha_digitavel,
                                    multa: boleto.multa,
                                    nosso_numero: boleto.nosso_numero,
                                    numero_documento: boleto.numero_documento,
                                    path: boleto.path,
                                    sacado_cep: boleto.sacado_cep,
                                    sacado_cidade: boleto.sacado_cidade,
                                    sacado_documento: boleto.sacado_documento,
                                    sacado_endereco: boleto.sacado_endereco,
                                    sacado_nome: boleto.sacado_nome,
                                    sacado_tipo_documento: boleto.sacado_tipo_documento,
                                    sacado_uf: boleto.sacado_uf,
                                    sequencial: boleto.sequencial,
                                    usuario_id: boleto.usuario_id,
                                    valor: boleto.valor,
                                    status: boleto.status,
                                    cor_status: cor_status,
                                    texto_status: texto_status,
                                },
                            )
                            i++
                        }
                        else if (this.state.qtd_dias == 2) {
                            // if (texto_status == 'Pago') {
                            if (texto_status == i18n.t('cobranca.pago')) {
                                lista.push(
                                    {
                                        id: boleto.id,
                                        agencia: boleto.agencia,
                                        carteira: boleto.carteira,
                                        cedente_cep: boleto.cedente_cep,
                                        cedente_cidade: boleto.cedente_cidade,
                                        cedente_documento: boleto.cedente_documento,
                                        cedente_endereco: boleto.cedente_endereco,
                                        cedente_nome: boleto.cedente_nome,
                                        cedente_uf: boleto.cedente_uf,
                                        conta: boleto.conta,
                                        conta_id: boleto.conta_id,
                                        data_emissao: boleto.data_emissao,
                                        data_vencimento: boleto.data_vencimento,
                                        instrucoes: boleto.instrucoes,
                                        juros: boleto.juros,
                                        linha_digitavel: boleto.linha_digitavel,
                                        multa: boleto.multa,
                                        nosso_numero: boleto.nosso_numero,
                                        numero_documento: boleto.numero_documento,
                                        path: boleto.path,
                                        sacado_cep: boleto.sacado_cep,
                                        sacado_cidade: boleto.sacado_cidade,
                                        sacado_documento: boleto.sacado_documento,
                                        sacado_endereco: boleto.sacado_endereco,
                                        sacado_nome: boleto.sacado_nome,
                                        sacado_tipo_documento: boleto.sacado_tipo_documento,
                                        sacado_uf: boleto.sacado_uf,
                                        sequencial: boleto.sequencial,
                                        usuario_id: boleto.usuario_id,
                                        valor: boleto.valor,
                                        status: boleto.status,
                                        cor_status: cor_status,
                                        texto_status: texto_status,
                                    },
                                )
                                i++
                            }
                        }
                        else if (this.state.qtd_dias == 3) {
                            if (texto_status == 'Em aberto') {
                                lista.push(
                                    {
                                        id: boleto.id,
                                        agencia: boleto.agencia,
                                        carteira: boleto.carteira,
                                        cedente_cep: boleto.cedente_cep,
                                        cedente_cidade: boleto.cedente_cidade,
                                        cedente_documento: boleto.cedente_documento,
                                        cedente_endereco: boleto.cedente_endereco,
                                        cedente_nome: boleto.cedente_nome,
                                        cedente_uf: boleto.cedente_uf,
                                        conta: boleto.conta,
                                        conta_id: boleto.conta_id,
                                        data_emissao: boleto.data_emissao,
                                        data_vencimento: boleto.data_vencimento,
                                        instrucoes: boleto.instrucoes,
                                        juros: boleto.juros,
                                        linha_digitavel: boleto.linha_digitavel,
                                        multa: boleto.multa,
                                        nosso_numero: boleto.nosso_numero,
                                        numero_documento: boleto.numero_documento,
                                        path: boleto.path,
                                        sacado_cep: boleto.sacado_cep,
                                        sacado_cidade: boleto.sacado_cidade,
                                        sacado_documento: boleto.sacado_documento,
                                        sacado_endereco: boleto.sacado_endereco,
                                        sacado_nome: boleto.sacado_nome,
                                        sacado_tipo_documento: boleto.sacado_tipo_documento,
                                        sacado_uf: boleto.sacado_uf,
                                        sequencial: boleto.sequencial,
                                        usuario_id: boleto.usuario_id,
                                        valor: boleto.valor,
                                        status: boleto.status,
                                        cor_status: cor_status,
                                        texto_status: texto_status,
                                    },
                                )
                                i++
                            }
                        }
                        else if (this.state.qtd_dias == 4) {
                            // if (texto_status == 'Vencido') {
                            if (texto_status == i18n.t('cobranca.vencido')) {
                                lista.push(
                                    {
                                        id: boleto.id,
                                        agencia: boleto.agencia,
                                        carteira: boleto.carteira,
                                        cedente_cep: boleto.cedente_cep,
                                        cedente_cidade: boleto.cedente_cidade,
                                        cedente_documento: boleto.cedente_documento,
                                        cedente_endereco: boleto.cedente_endereco,
                                        cedente_nome: boleto.cedente_nome,
                                        cedente_uf: boleto.cedente_uf,
                                        conta: boleto.conta,
                                        conta_id: boleto.conta_id,
                                        data_emissao: boleto.data_emissao,
                                        data_vencimento: boleto.data_vencimento,
                                        instrucoes: boleto.instrucoes,
                                        juros: boleto.juros,
                                        linha_digitavel: boleto.linha_digitavel,
                                        multa: boleto.multa,
                                        nosso_numero: boleto.nosso_numero,
                                        numero_documento: boleto.numero_documento,
                                        path: boleto.path,
                                        sacado_cep: boleto.sacado_cep,
                                        sacado_cidade: boleto.sacado_cidade,
                                        sacado_documento: boleto.sacado_documento,
                                        sacado_endereco: boleto.sacado_endereco,
                                        sacado_nome: boleto.sacado_nome,
                                        sacado_tipo_documento: boleto.sacado_tipo_documento,
                                        sacado_uf: boleto.sacado_uf,
                                        sequencial: boleto.sequencial,
                                        usuario_id: boleto.usuario_id,
                                        valor: boleto.valor,
                                        status: boleto.status,
                                        cor_status: cor_status,
                                        texto_status: texto_status,
                                    },
                                )
                                i++
                            }
                        }
                    }
                })
                if (i > 0) {
                    this.setState({ paginacao: 1 })
                    let numero1_aux = 0
                    let numero2_aux = 10
                    this.setState({ cortarLotes: lista.slice(numero1_aux, numero2_aux) })
                    this.setState({ lotes_mostrar: true, numeroRegistro: i, lotes: lista });
                    this.setState({ lotes: lista, lotes_mostrar: true });
                }
                else {
                    // alert("Nenhum boleto encontrado")
                    alert(i18n.t('cobranca.nenhumBoleto'))
                    this.setState({ lotes_mostrar: false })
                }
            } else {
                // alert("Nenhum boleto encontrado")
                alert(i18n.t('cobranca.nenhumBoleto'))
                this.setState({ lotes_mostrar: false })
            }
        });
    };

    boleto_ver = (path) => {
        const linkSource = `data:application/pdf;base64,${path}`;
        const downloadLink = document.createElement("a");
        const fileName = "Boleto.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    render() {
            return (
                <>
                    <BannerTitle title={i18n.t('cobranca.cobranca')} img={Objetos.cobrarImg}/>

                    <Container className="mt-4 col-md-10">
                        {/* <Breadcrumb>
                            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href="/cobrancas">Cobranças</Breadcrumb.Item>
                            <Breadcrumb.Item active>Gerenciar Boletos</Breadcrumb.Item>
                        </Breadcrumb> */}
                    </Container>
                    <Container className="blocoPesquisaExt mt-4 col-md-10 d-flex justify-content-center"  >
                        <div >
                            <p className="" style={{ fontSize: "1.30em" }}><strong >{i18n.t('cobranca.textGerenciarBoleto')}</strong></p>
                            <Col >
                                <Row >
                                    <div className="form-group col-lg-5">
                                        <label>{i18n.t('cobranca.dataInicialBoleto')}</label>
                                        <br></br>
                                        <DatePicker
                                            className="form-control"
                                            locale='pt-BR'
                                            selected={this.state.dataDe}
                                            required
                                            dateFormat="dd/MM/yyyy"
                                            popperPlacement="down"
                                            onChange={date => this.setState({ dataDe: date })}
                                        />
                                    </div>
                                    <div className="form-group col-lg-5">
                                        {/* <label>Data Final:</label> */}
                                        <label>{i18n.t('cobranca.dataFinal')}:</label>
                                        <br></br>
                                        <DatePicker
                                            className="form-control"
                                            locale='pt-BR'
                                            selected={this.state.dataAte}
                                            required
                                            dateFormat="dd/MM/yyyy"
                                            popperPlacement="down"
                                            onChange={date => this.setState({ dataAte: date })}
                                        />
                                    </div>

                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <div className="col-lg-3">
                                        <Button onClick={() => {
                                            this.setState({ qtd_dias: 1 })
                                            this.boleto_lista()
                                        }} className="btn btnProcurarCobrar  btn-success">{i18n.t('cobranca.todosBoleto')}</Button>
                                    </div>
                                    <div className="col-lg-3">
                                        <Button onClick={() => {
                                            this.setState({ qtd_dias: 2 })
                                            this.boleto_lista()
                                        }} className="btn btnProcurarCobrar  btn-success">{i18n.t('cobranca.pagoBoleto')}</Button>
                                    </div>
                                    <div className="col-lg-3">
                                        <Button onClick={() => {
                                            this.setState({ qtd_dias: 3 })
                                            this.boleto_lista()
                                        }} className="btn btnProcurarCobrar  btn-success">{i18n.t('cobranca.abertoBoleto')}</Button>
                                    </div>
                                    <div className="col-lg-3">
                                        <Button onClick={() => {
                                            this.setState({ qtd_dias: 4 })
                                            this.boleto_lista()
                                        }} className="btn btnProcurarCobrar  btn-success">{i18n.t('cobranca.vencidoBoleto')}</Button>
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Container>
                    {this.state.loading ? (
                        <ReactLoading className="loadingPagar" type={'bubbles'} color={'#000'} height={'15%'} width={'15%'} />
                    ) : (
                        (this.state.lotes_mostrar > 0 ? (
                            <Container className="mt-4 col-md-10 paginas" style={{}}>
                                <Row className="mt-3">
                                    <Col>
                                        <table id="tabela-extrato" className="table table-striped table-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col">{i18n.t('cobranca.sacadoBoleto')}</th>
                                                    <th scope="col">{i18n.t('cobranca.statusBoleto')}</th>
                                                    <th scope="col">{i18n.t('cobranca.dataVencimentoBoleto')}</th>
                                                    <th scope="col" style={{ textAlign: 'right' }}>{i18n.t('cobranca.valorGerenciarBoleto')}</th>
                                                    <th scope="col" style={{ textAlign: 'right' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.cortarLotes.map(lotes => {

                                                    return (
                                                        <tr key={lotes.id}>
                                                            <td>{lotes.sacado_nome}</td>
                                                            <td>{lotes.texto_status}</td>
                                                            <td>{lotes.data_vencimento}</td>
                                                            <td style={{ textAlign: 'right' }}>{Formatar.formatReal(lotes.valor)}</td>
                                                            <td style={{ float: 'right' }}><button className='btn btnBaixarCobrar btn-sm btn-success' onClick={() => this.boleto_ver(lotes.path)}>{i18n.t('cobranca.downBoleto')}</button></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </Col>
                                </Row>


                                <div className="d-flex justify-content-center" style={{ marginTop: "10px" }}>
                                    <ReactPagination
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        hideNavigation
                                        activePage={this.state.paginacao}
                                        itemsCountPerPage={10}
                                        totalItemsCount={this.state.numeroRegistro}
                                        pageRangeDisplayed={5}
                                        onChange={this.paginacao.bind(this)}
                                    />
                                </div>

                            </Container >

                        ) : null))}

                </>
            );
    }
}
