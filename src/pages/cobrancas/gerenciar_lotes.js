import React, { Component } from 'react';
import '../../templates/style_cobrar.scss';
import { Container, Row, Accordion, Card, Button } from 'react-bootstrap';
import { registerLocale } from "react-datepicker";
import br from 'date-fns/locale/pt-BR';
import * as Icon from 'react-bootstrap-icons';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes';
import * as Formatar from '../../constants/Formatar';
import Produtos from '../../constants/Produtos';
import i18n from '../../tradutor/tradutor';

registerLocale('pt-BR', br)
export default class GerenciarLotesBoletos extends Component {
    constructor() {
        super();
        this.state = {
            pessoa: [],
            lotes: [],
            logs: [],
            lotes_mostrar: false,
            dataDe: new Date(),
            dataAte: new Date(),
        };
    }

    componentDidMount() {
        const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: pessoa });

        const dados = {
            url: 'arquivo-boleto-massa/lista',
            data: { 'conta_id': Funcoes.pessoa.conta_id },
            method: 'POST',
        };

        Funcoes.Geral_API(dados, true).then((res) => {

            if (res.length > 0) {
                this.setState({ lotes: res, lotes_mostrar: true })
            } else {
                // alert('Nenhum arquivo encontrado');
                alert(i18n.t('cobranca.nenhumArquivo'));
            }
        });
    };

    logs_lista = (id) => {
        const dados = {
            url: 'arquivo-boleto-massa/lista-logs-do-arquivo',
            data: { id: id },
            method: 'POST',
        };

        Funcoes.Geral_API(dados, true).then((res) => {
            this.boleto_lista(res)
        });
    };

    boleto_lista = (id) => {

        if (id.length > 0) {
            const dados = {
                url: 'boleto/boleto/boletos-usuario',
                data: {
                    usuario_id: this.state.pessoa.usuario_id,
                    data_de: id[0].dataHora.split(' ')[0],
                    data_ate: id[0].dataHora.split(' ')[0]
                },
                method: 'POST',
            };

            Funcoes.Geral_API(dados, true).then((res) => {

                let lista = [];

                var keys = Object.keys(id).length;

                for (var i = 0; i < keys; i++) {

                    if (id[i].boleto_cobranca_id != null) {
                        res.map((boleto) => {
                            if (boleto.id == id[i].boleto_cobranca_id) {
                                lista.push(
                                    {
                                        id: boleto.id,
                                        status: boleto.status,
                                        data_vencimento: boleto.data_vencimento,
                                        data_pago: boleto.data_pago,
                                        sacado_nome: boleto.sacado_nome,
                                        valor: boleto.valor,
                                        path: boleto.path
                                    }
                                )
                            }
                        })
                    } else {
                        lista.push(
                            {
                                id: id[i].id,
                                status: '',
                                msg: id[i].descricao,
                                linha: id[i].linha
                            }
                        )
                    }
                }
                this.setState({ logs: lista });
            });
        }
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

                    <Container fluid className=" mt-4 col-md-10">
                      {/*   <Breadcrumb className="breadCobrar">
                            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href="/cobrancas">Cobranças</Breadcrumb.Item>
                            <Breadcrumb.Item active>Gerenciar Lotes de Boletos</Breadcrumb.Item>
                        </Breadcrumb> */}
                    </Container>
                    < Container className="mt-1 col-md-10 text-center" >
                        <p className="text-center" style={{ fontSize: '1.65em' }}>{i18n.t('cobranca.textGerenciarLote')}</p>
                    </Container >

                    {this.state.lotes_mostrar ? (
                        <>

                            <Container className="mt-4 col-md-12">
                                <div className="card mt-5 mb-5">

                                    <Accordion className="mt-2 mb-2 col-12" >
                                        {this.state.lotes.map(lote => {
                                            if (lote.status != 0) {
                                                return (

                                                    <Card style={{ marginBottom: '5px' }} key={lote.id}>
                                                        <Card.Header style={{ fontSize: '1.00em', padding: '0px' }}>
                                                            <Row>
                                                                <Accordion.Toggle onClick={() => this.logs_lista(lote.id)} as={Button} variant="link" eventKey={lote.id}>
                                                                    <Icon.Plus style={{ fontSize: '1.65em' }} />
                                                                </Accordion.Toggle>

                                                                <div className='col-sm-4' ><strong>{i18n.t('cobranca.nomeArqLote')} </strong>{lote.caminho_arquivo}</div>
                                                                <div className='col-sm-2' ><strong>{i18n.t('cobranca.dataLote')} </strong>{Formatar.formatarDate(lote.dataHora)}</div>
                                                                <div className='col-sm-2' ><strong>{i18n.t('cobranca.qtdRegistroLote')} </strong>{lote.qtd_registros}</div>
                                                                <div className='col-sm-2' ><strong>{i18n.t('cobranca.registradosLote')} </strong>{lote.qtd_processados}</div>
                                                                <div className='col-sm-1' ><strong>{i18n.t('cobranca.errosLote')} </strong>{lote.qtd_erros}</div>
                                                            </Row>
                                                        </Card.Header>
                                                        <Accordion.Collapse eventKey={lote.id}>


                                                            <Card.Body>
                                                                {this.state.logs.map(log => {

                                                                    if (log.status === "") {
                                                                        return (
                                                                            <div key={log.id} className="col-sm-12" style={{ fontSize: "16px", border: '1px solid #aaaaaa', marginBottom: '5px', borderRadius: '10px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px', backgroundColor: 'rgba(240,240,240)' }}>
                                                                                <Row>
                                                                                    <div className='col-sm-2' ><strong>{i18n.t('cobranca.erroLinhaLote')} </strong>{log.linha}</div>
                                                                                    <div className='col-sm-8'><strong>{i18n.t('cobranca.msgErroLote')} </strong>{log.msg}</div>
                                                                                </Row>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        var status = log.status;
                                                                        var cor_status = '';
                                                                        var texto_status = '';

                                                                        if (status == 0) {
                                                                            var data_atual = new Date();
                                                                            data_atual = data_atual.toJSON();
                                                                            data_atual = data_atual.split("T");

                                                                            if (data_atual[0] > log.data_vencimento) {
                                                                                cor_status = '#ff6d5f';
                                                                                texto_status = 'Vencido';
                                                                            } else {
                                                                                cor_status = '#41a8d8';
                                                                                texto_status = 'Em aberto';
                                                                            }
                                                                        } else {
                                                                            cor_status = 'green';
                                                                            if (log.data_pago != null) {
                                                                                var data_pago = log.data_pago.split("-");
                                                                                data_pago = (data_pago[2] + '/' + data_pago[1] + '/' + data_pago[0]);
                                                                                texto_status = 'Pago: ' + data_pago;
                                                                            } else {
                                                                                texto_status = 'Pago';
                                                                            }

                                                                        }

                                                                        return (
                                                                            <div key={log.id} className="col-sm-12" style={{ fontSize: "16px", border: '1px solid #aaaaaa', marginBottom: '5px', borderRadius: '10px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px', backgroundColor: 'rgba(240,240,240)' }}>
                                                                                <Row>
                                                                                    <div className='col-sm-3' ><strong>{i18n.t('cobranca.sacadoLote')} </strong>{log.sacado_nome}</div>
                                                                                    <div className='col-sm-2'><strong>{i18n.t('cobranca.statusLote')} </strong>{texto_status}</div>
                                                                                    <div className='col-sm-3'><strong>{i18n.t('cobranca.vencimentoLote')} </strong>{log.data_vencimento}</div>
                                                                                    <div className='col-sm-2'><strong>{i18n.t('cobranca.valorLote')} </strong>{Formatar.formatarMoeda(log.valor)}</div>
                                                                                    <button className='btn btn-sm btnBaixarCobrar btn-success' onClick={() => this.boleto_ver(log.path)}>{i18n.t('cobranca.dwnPDFLote')}</button>
                                                                                </Row>
                                                                            </div>
                                                                        )
                                                                    }

                                                                })}
                                                            </Card.Body>

                                                        </Accordion.Collapse>
                                                    </Card>

                                                )
                                            }
                                        }
                                        )}
                                    </Accordion>
                                </div>
                            </Container>
                        </>
                    ) : null
                    }

                </>
            );
    }
}
