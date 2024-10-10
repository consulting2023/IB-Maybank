import React, { Component } from 'react';
import ReactPagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { addDays } from 'date-fns';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import br from 'date-fns/locale/pt-BR';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes'
import * as Formatar from '../../constants/Formatar'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import i18n from '../../tradutor/tradutor';

registerLocale('pt-BR', br);

export default class ComprovanteConta extends Component {
    constructor() {
        super();
        this.state = {
            dadosImg: '',
            dataDe: new Date(),
            dataAte: new Date(),
            comprovantes: [],
            pessoa: [],
            paginacao: 1,
            numeroRegistro: 0,
            cortarComprovante: [],
            loading: false,
            data_ateconfirm_compartilhar: 0
        };

    }
    componentDidiMout() {
        const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: pessoa });
    };

    verComprovante = () => {
        this.setState({ loading: true });
        var dados = {
            "data_de": Formatar.formatarDateAno(this.state.dataDe),
            "data_ate": Formatar.formatarDateAno(this.state.dataAte)
        }
        Funcoes.comprovanteCartao(dados).then((res) => {
            var keys = Object.keys(res)
            if (keys.length === 0) {
                // alert("Não Foram Encontrados Comprovantes Para o Período Solicitado");
                alert(i18n.t('comprovante.nenhumComprovante'));
                this.setState({ loading: false });
            }
            else {

                var arr = [];
                var i = 0;
                var keys = Object.keys(res);
                keys.forEach(function (key) {
                    arr.push(res[key]);
                });


                arr.map(dados => (
                    dados.map(dados2 => (
                        i++
                    ))
                ));

                let array_cortar_aux = [];
                arr.map(dados => (
                    dados.map(dado => (
                        array_cortar_aux.push(dado)
                    ))
                ));

                this.setState({ paginacao: 1 })

                let numero1_aux = 0
                let numero2_aux = 10
                this.setState({ cortarComprovante: array_cortar_aux.slice(numero1_aux, numero2_aux) })

                this.setState({ loading: false, comprovante: true, numeroRegistro: i, comprovantes: arr, confirm_compartilhar: 1 })

            }

        })
    };

    paginacao = (numero) => {
        let array_cortar = [];
        this.state.comprovantes.map(dados => (
            array_cortar.push(dados)
        ))

        this.setState({ paginacao: (numero) })
        let numero1 = (numero - 1) * 10
        let numero2 = (numero * 10)
        this.setState({ cortarComprovante: array_cortar.slice(numero1, numero2) })
    };

    comprovante_pdf = (id) => {

        var data = {
            'fav': id.nomeFantasiaEstabelecimento,
            'data': Formatar.formatarDate(id.dataOrigem) + " " + id.dataOrigem.split('T')[1],
            'valor': Formatar.formatReal(id.valorBRL * -1.00)
        };

        Funcoes.ComprovantePDFCartao(data).then((res) => {

            const file = new Blob([res], { type: 'application/pdf' });
            var anchor = document.createElement('a');
            anchor.download = "Comprovante.pdf";
            anchor.href = (window.webkitURL || window.URL).createObjectURL(file);
            anchor.dataset.downloadurl = ['application/pdf', anchor.download, anchor.href].join(':');
            anchor.click();

        });
    };

    render() {
            return (
                <>
                    <BannerTitle title={i18n.t('comprovante.comprovantes')} img={Objetos.comprovanteImg}/>

                    <Container className="mt-4 col-md-10">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/home">{i18n.t('comprovante.breadCrumb1')}</Breadcrumb.Item>
                            <Breadcrumb.Item href="/comprovantes">{i18n.t('comprovante.breadCrumb2')}</Breadcrumb.Item>
                            <Breadcrumb.Item active>{i18n.t('comprovante.breadCrumb2')}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Container>
                    <Container className="blocoPesquisaExt mt-4 col-md-10 d-flex justify-content-center"  >
                        <div >
                            <p className="text-center"><strong >{i18n.t('comprovante.textEscolhaComprovante')}</strong></p>
                            <Col >
                                <Row>
                                    <div className="form-group col-lg-5">
                                        <label>{i18n.t('comprovante.dataInicio')}</label>
                                        <br></br>
                                        <DatePicker
                                            className="form-control"
                                            locale='pt-BR'
                                            dateFormat="dd/MM/yyyy"
                                            selected={this.state.dataDe}
                                            required
                                            popperPlacement="down"
                                            onChange={(data) => this.setState({ dataDe: data })}

                                        />
                                    </div>
                                    <div className="form-group col-lg-5">
                                        <label>{i18n.t('comprovante.dataFinal')}</label>
                                        <br></br>
                                        <DatePicker
                                            className="form-control"
                                            locale='pt-BR'
                                            dateFormat="dd/MM/yyyy"
                                            selected={this.state.dataAte}
                                            required
                                            popperPlacement="down"
                                            maxDate={addDays(new Date(), 0)}
                                            onChange={(data) => this.setState({ dataAte: data })}
                                        />
                                    </div>

                                    <div className="form-group col-lg-2" style={{ marginTop: 'auto' }} >
                                        <button onClick={() => this.verComprovante()} disabled={this.state.disabled} className="btn btnProcurarComprovante btn-sm btn-success">{i18n.t('comprovante.btnPesquisar')}</button>
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Container>
                    {this.state.loading ? (
                        <ReactLoading className="loadingPagar" type={'bubbles'} color={'#000'} height={'15%'} width={'15%'} />
                    ) : (

                        (this.state.comprovantes.length > 0 &&
                            <Container className="mt-4 col-lg-10" style={{ border: '1px solid #dddddd', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: "16px" }} >
                                {this.state.cortarComprovante.map(comprovante => (
                                    <div key={comprovante.mov.id} style={{ border: '1px solid #aaaaaa', borderRadius: '10px', margin: '10px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px', backgroundColor: 'rgba(240,240,240)' }}>
                                        <Row >
                                            <div style={{ marginTop: '10px' }} className='col-lg-6'><strong>{comprovante.mov.descricao}</strong></div>
                                            <div style={{ marginTop: '10px' }} className='col-lg-2'> <strong>{i18n.t('comprovante.valor')} </strong>{Formatar.formatarMoeda(comprovante.mov.valor * -1.00)}</div>
                                            <div style={{ marginTop: '10px' }} className='col-lg-2'><strong>{i18n.t('comprovante.data')} </strong>{Formatar.formatarDate(comprovante.mov.dataHora)}</div>
                                            <button style={{ marginLeft: '15px' }} className='btn btn-sm baixarComprovante btn-success' onClick={() => this.comprovante_pdf(comprovante.mov.id)}>{i18n.t('comprovante.downPDf')}</button>
                                        </Row>
                                    </div>
                                ))}
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
                            </Container>

                        ))}

                </>
            )
    }
}