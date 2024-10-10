import React, { Component } from 'react';
import '../../templates/style_cobrar.scss';
import { Container, Col, Row } from 'react-bootstrap';
import { registerLocale } from "react-datepicker";
import br from 'date-fns/locale/pt-BR';
import Objetos from '../../constants/Objetos';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import * as Funcoes from '../../constants/Funcoes';
import MyCSV from './exemplo_boleto_em_massa.csv';
import Produtos from '../../constants/Produtos';
import i18n from '../../tradutor/tradutor';

registerLocale('pt-BR', br)

var excelUrl = JSON.stringify(MyCSV);
var csvContent = JSON.parse(excelUrl);
export default class BoletoCobranca_Multiplo extends Component {
    constructor() {
        super();
        this.state = {
            pessoa: [],
            mostrar_instrucoes: false,
            loading: false,
            csv: null,
            nome_do_arquivo: '',
            mostrar_boleto: false
        };
    }

    componentDidMount() {
        const pessoa = Funcoes.pessoa;
        this.setState({ pessoa: pessoa });


        const dados = {
            url: 'configuracao/ver',
            data: JSON.stringify({
                chave: 'bloqueado_boleto'
            }),
            method: 'POST',
        };

        Funcoes.Geral_API(dados, true).then((res) => {
            if (res.valor != 0) {
                if (Funcoes.pessoa.emite_boleto == 0) {
                    window.location.href = "/home"

                    alert("Você não possuí essa funcionalidade liberada, para habilitar entre em contato através dos meios a seguir: " + process.env.EMAIL_BANCO + " " + process.env.TELEFONE_BANCO)
                } else {
                    this.setState({ mostrar_boleto: true })
                }
            } else {
                this.setState({ mostrar_boleto: true })
            }
        })
    };

    receberCsv = (event) => {
        let i = 0;
        let slice_name = (event.target.files[0]['name']).split('.')
        if (slice_name[1] === "csv") {
            alert(event.target.files[0]['name']);
            this.setState({ csv: event.target.files[0], nome_do_arquivo: event.target.files[0]['name'] });
        } else {
            // alert("Formato de arquivo inválido")
            alert(i18n.t('cobranca.formatoInvalido'))
        }
    };

    uploadCsv = () => {

        if (this.state.csv != null) {
            const filenameConta = this.state.pessoa.conta_id;

            var date = new Date();
            let fileNameData = date.toJSON();
            fileNameData = fileNameData.replace(':', '-');
            fileNameData = fileNameData.replace(':', '-');
            fileNameData = fileNameData.replace(':', '-');

            let filenameComprovanteAtv = this.state.csv.nome;
            let formDataAtv = new FormData();

            formDataAtv.append('arquivo', this.state.csv, filenameComprovanteAtv);
            formDataAtv.append('json', JSON.stringify({ "conta_id": filenameConta }));

            const dados = {
                url: 'arquivo-boleto-massa/upload',
                data: formDataAtv,
                method: 'POST',
            };

            Funcoes.Geral_API(dados, true).then((res) => {

                if (res.status == 0) {
                    var msg = res.msg.replace(/;/g, '\n');
                    // alert("CSV com erro verifique:" + msg);
                    alert(i18n.t('cobranca.erroCSV', { erroMsg: msg }));
                } else {
                    // alert("CSV em análise acompanhe em Gerenciar Lotes");
                    alert(i18n.t('cobranca.analiseCSV'));
                    window.location.href = '/cobrancas'
                }
            });
        } else {
            // alert("Escolha um arquivo CSV")
            alert(i18n.t('cobranca.escolhaCSV'))
        }
    }

    convertArrayOfObjectsToCSV = (args) => {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        };
        columnDelimiter = args.columnDelimiter || ';';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });


        return result;
    }

    download_file = () => {

        var data, filename, link;

        filename = 'Exemplo_boleto_em_massa.csv';

        data = process.env.BASE + 'modelos/modelo_boleto_em_massa.csv';

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    render() {
            if (this.state.mostrar_boleto == true) {
                return (
                    <>
                        <BannerTitle title={i18n.t('cobranca.cobranca')} img={Objetos.cobrarImg}/>

                        <Container className="mt-4 col-md-10">
                            
                        </Container>

                        < Container className="mt-1 col-md-10 text-center" >
                            <p className="text-center" style={{ fontSize: '1.65em' }}>{i18n.t('cobranca.textLote')}</p>
                        </Container >

                        <Container className="blocoPesquisaExt mt-4 col-md-10 d-flex justify-content-center"  >
                            <Col>

                                <Row>
                                    <div className="form-group col-12">
                                        <label>{i18n.t('cobranca.arqLote')}</label>
                                        <br /><br />
                                        <Row className="custom-file-caixa">
                                            <label className="custom-file-upload" style={{ backgroundColor: '#fff' }}>
                                                <input type="file" onChange={(event) => this.receberCsv(event)} />
                                                {i18n.t('cobranca.escolherArqLote')}
                                            </label>
                                            <label>{this.state.nome_do_arquivo}</label>
                                        </Row>
                                        {/*  <input
                                    required
                                    type="file"
                                    className="form-control"
                                    style={{ marginBottom: '5px', padding: 3 }}
                                    onChange={(event) => this.receberCsv(event)}
                                /> */}
                                    </div>
                                </Row>
                                <button disabled={this.state.loading} onClick={() => this.uploadCsv()} className="btn verMultiBoletos btn-sm btn-success">{i18n.t('cobranca.verificarLote')}</button>
                                <button type="button" className="btn download_csv btn-sm btn-success  float-left" onClick={() => this.download_file()} >{i18n.t('cobranca.exemploLote')}</button>
                                

                            </Col>
                        </Container>
                    </>
                )
            } else { return (<></>) }
    }
}
