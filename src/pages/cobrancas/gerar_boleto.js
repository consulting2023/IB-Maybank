import React, { Component } from 'react';
import '../../templates/style_cobrar.scss';
import { Container, Row, Col } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input';
import DatePicker, { registerLocale } from "react-datepicker";
import { addDays } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes';
import * as Formatar from '../../constants/Formatar';
import i18n from '../../tradutor/tradutor';

registerLocale('pt-BR', br)
export default class BoletoCobranca extends Component {
    constructor() {
        super();
        this.state = {
            pessoa: [],
            pagadores: [],
            valorBoleto: [],
            valor: '',
            multa: '',
            juros: '',
            desconto: '',
            abatimento: '',
            sacadoId: '',
            descricao: '',
            notaDoc: '',
            dataVecimento: new Date(),
            mostrar_download: false,
            pdf: null,
            mostrar_boleto: false,
            boletoId: '',
        };
    }

    componentDidMount() {
        // const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: Funcoes.pessoa });

        const dados = {
            url: 'configuracao/ver',
            data: JSON.stringify({
                chave: 'bloqueado_boleto'
            }),
            method: 'POST',
        };

        Funcoes.Geral_API(dados, true).then((res) => {
            if (res.valor != 0) {
                if (this.state.pessoa.emite_boleto == 0) {
                    window.location.href = "/home"

                    // alert("Você não possuí essa funcionalidade liberada, para habilitar entre em contato através dos meios a seguir: " + process.env.EMAIL_BANCO + " " + process.env.TELEFONE_BANCO)
                    alert(i18n.t('cobranca.funcLiberada', {email_banco: process.env.EMAIL_BANCO, telefone_banco: process.env.TELEFONE_BANCO}))
                } else {
                    this.setState({ mostrar_boleto: true })
                }
            } else {
                this.setState({ mostrar_boleto: true })
            }
        });


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

    GerarBoleto = () => {

        var valor = this.state.valor;
        var sacadoId = this.state.sacadoId;

        if (valor == '') {
            // alert('Digite o valor');
            alert(i18n.t('cobranca.digiteValor'));
        } else if (sacadoId == '') {
            // alert('Escolha o pagador');
            alert(i18n.t('cobranca.escolhaPagador'));
        } else {

            var nome_beneficiario = '';
            var doc_beneficiario = '';

            if (this.state.pessoa.pf_pj == 'pf') {
                nome_beneficiario = this.state.pessoa.razao_social;
                doc_beneficiario = this.state.pessoa.cpf_cnpj;

            } else {
                nome_beneficiario = this.state.pessoa.razao_social;
                doc_beneficiario = this.state.pessoa.doc;
            }

            valor = valor.replace('.', '');
            valor = valor.replace('.', '');
            valor = valor.replace('.', '');
            valor = valor.replace(',', '.');

            var multa = this.state.multa;
            multa = multa.replace('.', '');
            multa = multa.replace('.', '');
            multa = multa.replace('.', '');
            multa = multa.replace(',', '.');

            var juros = this.state.juros;
            juros = juros.replace('.', '');
            juros = juros.replace('.', '');
            juros = juros.replace('.', '');
            juros = juros.replace(',', '.');

            var abatimento = this.state.abatimento;
            abatimento = abatimento.replace('.', '');
            abatimento = abatimento.replace('.', '');
            abatimento = abatimento.replace('.', '');
            abatimento = abatimento.replace(',', '.');

            var desconto = this.state.desconto;
            desconto = desconto.replace('.', '');
            desconto = desconto.replace('.', '');
            desconto = desconto.replace('.', '');
            desconto = desconto.replace(',', '.');

            var descricao = this.state.descricao;
            var notaDoc = this.state.notaDoc;
            var dataVecimento = this.state.dataVecimento;

            var multa_int = multa.replace(/[^\d]+/g, '');
            if (multa_int > 0) {
                multa = multa
            } else {
                multa = '0';
            }

            var juros_maior = 0;
            var juros_int = juros.replace(/[^\d]+/g, '');
            if (juros_int > 0) {
                var calc_juros = (valor * 0.03);

                if (juros > calc_juros) {
                    juros_maior = 1;
                }

            } else {
                juros = '0';
            }

            const dados = {
                url: 'boleto/boleto/boleto-cobranca',
                data: JSON.stringify({
                    "data_vencimento": Formatar.formatarDateAno(dataVecimento),
                    "valor": valor,
                    "multa": multa,
                    "juros": juros,
                    "sacado_id": sacadoId,
                    "descricao": descricao,
                    "nota_doc": notaDoc,
                    'conta_id': this.state.pessoa.conta_id,
                    'nome_beneficiario': nome_beneficiario,
                    'doc_beneficiario': doc_beneficiario.replace(/[^\d]+/g, ''),
                    'usuario_id': this.state.pessoa.id,
                    'abatimento': abatimento,
                    'desconto': desconto
                }),
                method: 'POST',
            };


            if (juros_maior == 0) {

                Funcoes.Geral_API(dados, true).then((res) => {
                    if (res !== 0) {
                        // alert("Boleto gerado com sucesso");
                        alert(i18n.t('cobranca.boletoGerado'));
                        this.setState({ boletoId: res.id, mostrar_download: true });

                    } else {
                        // alert("Erro ao Gerar Boleto, Tente Novamente Mais Tarde");
                        alert(i18n.t('cobranca.erroGerarTente'));
                    }
                });
            } else {
                // alert('Erro ao Gerar Boleto,juros não pode ser superior a 3% ao mês')
                alert(i18n.t('cobranca.erroGerarJuros'));
            }
        }
    }

    download_boleto = () => {
        const dados = {
            url: 'boleto/boleto/imprimir-boleto',
            data: {
                id: this.state.boletoId
            },
            method: 'POST',
        };
        Funcoes.Geral_API(dados, true).then((res) => {
            const linkSource = `data:application/pdf;base64,${res}`;
            const downloadLink = document.createElement("a");
            const fileName = "Boleto.pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        });
    }

    render() {
            if (this.state.mostrar_boleto == true) {
                return (
                    <>
                        <BannerTitle title={i18n.t('cobranca.cobranca')} img={Objetos.cobrarImg}/>

                        <Container className="mt-4 col-md-10">
                            {/* <Breadcrumb>
                                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                                <Breadcrumb.Item href="/cobrancas">Cobranças</Breadcrumb.Item>
                                <Breadcrumb.Item active>{i18n.t('cobranca.gerarBoleto')}</Breadcrumb.Item>
                            </Breadcrumb> */}
                        </Container>

                        <Container className="mt-4 col-md-10 text-center">
                            <p className="text-center" style={{ fontSize: '1.70em' }}>{i18n.t('cobranca.textGerarBoleto')}</p>
                        </Container>
                        <Container className="mt-4 campoGerarBoleto col-md-10 margin-auto" style={{}} >
                            <Col>
                                <div className="margin-auto">
                                    <Row>
                                        <div className="form-group col-lg-3">
                                            <label>{i18n.t('cobranca.valorBoleto')}</label>
                                            <CurrencyInput
                                                className="form-control"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={this.state.valor}
                                                onChange={valor => this.setState({ valor })}
                                            />
                                        </div>
                                        <div className="form-group col-lg-3">
                                            <label>{i18n.t('cobranca.vencimentoBoleto')}</label>
                                            <br></br>
                                            <DatePicker
                                                className="form-control"
                                                locale='pt-BR'
                                                selected={this.state.dataVecimento}
                                                popperPlacement="down"
                                                dateFormat="dd/MM/yyyy"
                                                required
                                                onChange={dataVecimento => this.setState({ dataVecimento })}
                                                minDate={addDays(new Date(), 0)}
                                            />
                                        </div>
                                        <div className="form-group col-lg-3">
                                            <label>{i18n.t('cobranca.multaBoleto')}</label>
                                            <CurrencyInput
                                                className="form-control"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={this.state.multa}
                                                onChange={multa => this.setState({ multa })}
                                            />
                                        </div>
                                        <div className="form-group col-lg-3">
                                            <label>{i18n.t('cobranca.jurosBoleto')}</label>
                                            <CurrencyInput
                                                className="form-control"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={this.state.juros}
                                                onChange={juros => this.setState({ juros })}
                                            />
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="form-group col-lg-3">
                                            <label>{i18n.t('cobranca.descontoBoleto')}</label>
                                            <CurrencyInput
                                                className="form-control"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={this.state.desconto}
                                                onChange={desconto => this.setState({ desconto })}
                                            />
                                        </div>
                                        <div className="form-group col-lg-3">
                                            <label>{i18n.t('cobranca.abatimentoBoleto')}</label>
                                            <CurrencyInput
                                                className="form-control"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={this.state.abatimento}
                                                onChange={abatimento => this.setState({ abatimento })}
                                            />
                                        </div>
                                        <div className="form-group col-6">
                                            <label>{i18n.t('cobranca.pagadorBoleto')}</label>
                                            <select required className="form-control" onChange={event => this.setState({ sacadoId: event.target.value })}>
                                                <option>Selecione o Pagador</option>
                                                {this.state.pagadores.map(pagador => (
                                                    <option key={pagador.id} value={pagador.id}>{pagador.nome}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="form-group col-lg-3">
                                            <label>{i18n.t('cobranca.notaBoleto')}</label>
                                            <input
                                                className="form-control"
                                                required
                                                id="nota_doc"
                                                placeholder=""
                                                value={this.state.notaDoc}
                                                onChange={event => this.setState({ notaDoc: event.target.value })}
                                            />
                                        </div>

                                        <div className="form-group col-9">
                                            <label>{i18n.t('cobranca.descBoleto')}</label>
                                            <input
                                                className="form-control"
                                                required
                                                id="descricao"
                                                placeholder=""
                                                value={this.state.descricao}
                                                onChange={event => this.setState({ descricao: event.target.value })}
                                            />
                                        </div>
                                    </Row>
                                    <button type="button" onClick={() => this.GerarBoleto()} className="btn gerarBoletoCobrar btn-sm btn-success">{i18n.t('cobranca.gerarBoleto')}</button>
                                    {this.state.mostrar_download ? (
                                        <button type="button" onClick={() => this.download_boleto()} className="btn baixarBoletoCobrar btn-sm btn-success">{i18n.t('cobranca.downBoleto')}</button>
                                    ) : null}
                                </div>
                            </Col>
                        </Container>
                    </>
                )
            } else {
                return (
                    <></>
                )
            }
    }
}
