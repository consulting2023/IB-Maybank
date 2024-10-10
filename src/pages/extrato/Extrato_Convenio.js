import React, { Component } from 'react';
import * as Funcoes from '../../constants/Funcoes';
import ReactPagination from 'react-js-pagination';
import * as Icon from 'react-bootstrap-icons';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import * as Formatar from '../../constants/Formatar';
import { addDays } from 'date-fns';
import DatePicker  from 'react-datepicker';
import Objetos from '../../constants/Objetos';
import ReactLoading from 'react-loading';
import i18n from '../../tradutor/tradutor';

export default class ExtratoConta extends Component {
    constructor() {
        super();
        this.state = {
            extrato: [],
            dataDe: new Date(),
            dataAte: new Date(),
            mostrarExtrato: true,
            paginacao: 1,
            numeroRegistros: 0,
            cortarExtrato: [],
            saldoDigital: false,
            pessoa: [],
            confirm_compartilhar: 0,
            loading: false,
            saldoDigital: 0,
            disabled: false,
        };
    }

    componentDidMount() {
        const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: pessoa });

        const data = {
            url: 'conta/saldo',
            data: { 'conta_id': Funcoes.pessoa.conta_id },
            method: 'POST',
        };
        /* const response = await api.post('conta/saldo', data, { headers },); */
        Funcoes.Geral_API(data, true).then((res) => {
            this.setState({
                saldoDigital: res.digital
            });
        })
    }


    paginacao = (numero) => {
        let array_cortar = [];
        this.state.extrato.map(dados => (
            dados.map(dado => (
                array_cortar.push(dado)
            ))
        ))

        this.setState({ paginacao: (numero) })
        let numero1 = (numero - 1) * 10
        let numero2 = (numero * 10)
        this.setState({ cortarExtrato: array_cortar.slice(numero1, numero2) })
    };

    extrato_pdf = () => {

        if (this.state.confirm_compartilhar == 0) {
            Alert.alert("Nenhum lançamento encontrado");
        }
        else {

            const data = {
                url: 'conta/extrato-novo-pdf',
                data: {
                    'conta_id': this.state.pessoa.conta_id,
                    "data_de": Formatar.formatarDateAno(this.state.dataDe),
                    "data_ate": Formatar.formatarDateAno(this.state.dataAte)
                },
                method: 'PDF',
            };

            Funcoes.Geral_API(data, true).then((res) => {
                console.log(res)
                /*  const fileURL = URL.createObjectURL(file); 
                window.open(fileURL); */
                const file = new Blob([res], { type: 'application/pdf' });
                var anchor = document.createElement('a');
                anchor.download = "Extrato.pdf";
                anchor.href = (window.webkitURL || window.URL).createObjectURL(file);
                anchor.dataset.downloadurl = ['application/pdf', anchor.download, anchor.href].join(':');
                anchor.click();
            });
        }
    };

    extrato_csv = () => {
        if (this.state.confirm_compartilhar == 0) {
            Alert.alert("Nenhum lançamento encontrado");
        }
        else {
            const data = {
                url: 'conta/extrato-csv',
                data: {
                    'conta_id': this.state.pessoa.conta_id,
                    "data_de": Formatar.formatarDateAno(this.state.dataDe),
                    "data_ate": Formatar.formatarDateAno(this.state.dataAte),
                    "tipo": ''
                },
                method: 'POST',
            };

            /* const response = await api.post('conta/extrato-csv', data, { headers },); */
            Funcoes.Geral_API(data, true).then((res) => {

                var data, filename, link;
                /*  var csv = this.convertArrayOfObjectsToCSV({
                     data: csvContent
                 }); */

                filename = 'Extrato.csv';

                /* if (!csv.match(/^data:text\/csv/i)) {
                    csv = 'data:text/csv;charset=utf-8,' + csv;
                } */
                data = process.env.BASE_CSV + res;

                link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename);
                link.click();
            });
        }
    }

    verExtrato = () => {
        this.setState({ loading: true, disabled: true });

        const data = {
            url: 'conta/extrato',
            data: {
                'conta_id': this.state.pessoa.conta_id,
                "data_de": Formatar.formatarDateAno(this.state.dataDe),
                "data_ate": Formatar.formatarDateAno(this.state.dataAte)
            },
            method: 'POST',
        };

        Funcoes.Geral_API(data, true).then((res) => {


            var keys = Object.keys(res)
            if (keys.length === 0) {
                // alert('Não foi encontrado nenhuma movimentação na data selecionada')
                alert(i18n.t('extrato.nenhumEncontrado'));
                this.setState({ loading: false });
                this.setState({ mostrarExtrato: false });
            } else {
                var arr = [];
                var i = 0;
                var keys = Object.keys(res)
                keys.forEach(function (key) {
                    arr.push(res[key]);
                });

                arr.map(dados => (
                    dados.map(dados2 => (
                        i++
                    ))
                ))

                let array_cortar_aux = [];
                arr.map(dados => (
                    dados.map(dado => (
                        array_cortar_aux.push(dado)
                    ))
                ))

                this.setState({ paginacao: 1 })

                let numero1_aux = 0
                let numero2_aux = 10
                this.setState({ cortarExtrato: array_cortar_aux.slice(numero1_aux, numero2_aux) })

                this.setState({ loading: false, mostrarExtrato: true, numeroRegistros: i, extrato: arr, confirm_compartilhar: 1, disabled: false })

            }
        });
    };

    colorStatus = (valor) => {
        if (valor > 0) {
            return '#3a8e32';
        } else {
            return '#ff0000'
        }
    }

    render() {
            return (
                <>

                    <BannerTitle title={i18n.t('extrato.extrato')} img={Objetos.extratoImg}/>

                    <Container className="mt-4 col-md-10">
                        <Breadcrumb className="pages">
                            <Breadcrumb.Item href="/home">{i18n.t('extrato.breadCrumb1')}</Breadcrumb.Item>
                            <Breadcrumb.Item href="/extrato">{i18n.t('extrato.breadCrumb2')}</Breadcrumb.Item>
                            <Breadcrumb.Item active>{i18n.t('extrato.breadCrumb3')}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Container>
                    <Container className="blocoPesquisaExt mt-4 col-md-10 d-flex justify-content-center" style={{}} >
                        <div>
                            <p className="" style={{ fontSize: "1.30em" }}><strong >{i18n.t('extrato.textoEscolhaExtrato')}</strong></p>
                            <Col >
                                <Row >
                                    <div className="form-group col-md-5">
                                        <label>{i18n.t('extrato.dataInicio')}</label>
                                        <br></br>
                                        <DatePicker
                                            className="form-control"
                                            locale='pt-BR'
                                            selected={this.state.dataDe}
                                            required
                                            dateFormat="dd/MM/yyyy"
                                            popperPlacement="down"

                                            onChange={(data) => this.setState({ dataDe: data })
                                            }
                                        />
                                    </div>
                                    <div className="form-group col-md-5">
                                        <label>{i18n.t('extrato.dataFinal')}</label>
                                        <br></br>
                                        <DatePicker
                                            className="form-control"
                                            locale='pt-BR'
                                            selected={this.state.dataAte}
                                            required
                                            dateFormat="dd/MM/yyyy"
                                            popperPlacement="down"
                                            maxDate={addDays(new Date(), 0)}
                                            onChange={(data) => this.setState({ dataAte: data })}
                                        />
                                    </div>
                                    <div className="form-group col-md-2" style={{ marginTop: 'auto' }}>
                                        <button onClick={() => this.verExtrato()} disabled={this.state.disabled} className="btn btnProcurarExtrato btn-sm btn-success">{i18n.t('extrato.btnPesquisar')}</button>
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Container>
                    {this.state.loading ? (
                        <ReactLoading className="loadingPagar" type={'bubbles'} color={'#000'} height={'15%'} width={'15%'} />
                    ) : (

                        (this.state.mostrarExtrato &&

                            <Container className="mt-4 col-md-10 paginas" style={{}}>
                                <Row>
                                    <button className="btn btn-sm baixarExtrato btn-success" style={{ marginLeft: "10px", marginRight: "10px" }} onClick={() => this.extrato_pdf()}>{i18n.t('extrato.downloadPdf')}</button>
                                    <button className="btn btn-sm baixarExtrato btn-success" style={{ marginLeft: "10px", marginRight: "10px" }} onClick={() => this.extrato_csv()}>{i18n.t('extrato.downloadPdf')}</button>
                                    <div className="showhimExtrato">

                                        <div className="hiddenmeExtrato" >

                                            <p className="saldos-home texto-saldos-Extrato" > {i18n.t('extrato.saldo')} <Icon.Eye className="ocultarSaldoExtrato" style={{ fontWeight: '500' }} /></p>

                                        </div>
                                        <div className="showmeExtrato" >

                                            <p className="saldos-home texto-saldos-Extrato" > {i18n.t('extrato.saldo')} {Formatar.formatarMoeda(this.state.saldoDigital)}</p>

                                        </div>

                                    </div>
                                </Row>

                                <Row className="mt-3">
                                    <Col>
                                        <table id="tabela-extrato" className="table table-striped table-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col">{i18n.t('extrato.descr')}</th>
                                                    <th style={{ textAlign: 'right' }} scope="col">{i18n.t('extrato.descrValor')}</th>
                                                    <th style={{ textAlign: 'right' }} scope="col">{i18n.t('extrato.descrData')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.cortarExtrato.map(dados => (

                                                    <tr key={dados.id}>
                                                        <td>{i18n.t('extrato.descrNome', { descricao: dados.descricao })}</td>
                                                        <td style={{ color: this.colorStatus(dados.valor), textAlign: 'right' }}>{Formatar.formatReal(dados.valor)}</td>
                                                        <td style={{ textAlign: 'right' }}>{Formatar.formatarDate(dados.dataHora)}</td>
                                                    </tr>
                                                ))}
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
                                        totalItemsCount={this.state.numeroRegistros}
                                        pageRangeDisplayed={5}
                                        onChange={this.paginacao.bind(this)}
                                    />
                                </div>

                            </Container>

                        ))}

                </>
            )
    }
}