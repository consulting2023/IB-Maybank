import React, { Component } from 'react';
import * as Funcoes from '../../constants/Funcoes';
import ReactPagination from 'react-js-pagination';
import '../../templates/style_extrato.scss';
import { Container, Row, Col, Breadcrumb, Button, ButtonGroup, Table } from 'react-bootstrap';
import * as Formatar from '../../constants/Formatar';
import { addDays } from 'date-fns';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
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
      mostrarExtrato: false,
      paginacao: 1,
      numeroRegistros: 0,
      cortarExtrato: [],
      pessoa: [],
      confirm_compartilhar: 0,
      loading: false,
      disabled: false,
      soma: 0,

      cartao_ativo: false,
    };
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
    this.consulta_interna_cartao(pessoa);
  }

  consulta_interna_cartao = (pessoa) => {
    const data = {
      url: 'cartao/consultar',
      data: {
        'conta_id': pessoa.conta_id
      },
      method: 'POST',
    };

    Funcoes.Geral_API(data, true).then((res) => {
      if (res[0]) this.setState({ cartao_ativo: true });
      else this.setState({ cartao_ativo: false });
      // else alert(i18n.t('extrato.alertaCartao'));
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
    let cortado = array_cortar.slice(numero1, numero2);
    this.setState({ cortarExtrato: cortado })
  };

  extrato_pdf = () => {
    if (this.state.confirm_compartilhar == 0) {
      alert("Nenhum lançamento encontrado");
    } else {
      const data = {
        url: 'conta/extrato-novo-pdf',
        data: {
          'conta_id': this.state.pessoa.conta_id,
          "data_de": Formatar.formatarDateAno(this.state.dataDe),
          "data_ate": Formatar.formatarDateAno(this.state.dataAte)
        },
        method: 'POST',
      };

      Funcoes.Geral_API(data, true).then((res) => {
        let pdfWindow = window.open("");
        pdfWindow.document.write("<body style='margin: 0;'><embed width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(res) + "' /></body>");
        pdfWindow.document.title = 'Extrato';
      });
    }
  };

  extrato_csv = () => {
    if (this.state.confirm_compartilhar == 0) {
      alert("Nenhum lançamento encontrado");
    } else {
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

      Funcoes.Geral_API(data, true).then((res) => {
        let csvContent = window.atob(res);
        var blob = new Blob([csvContent], {type: "data:application/octet-stream;base64"});
        var url  = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'Extrato.csv');
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
      var keys = Object.keys(res);
      if (keys.length === 0) {
        this.props.alerts('Nenhuma movimentação encontrada', 'Selecione outro período ou tente novamente mais tarde', 'warning');
        this.setState({ loading: false });
        this.setState({ disabled: false });
        this.setState({ mostrarExtrato: false });
      } else {
        var arr = [];
        var i = 0;
        keys.forEach((key) => {
          arr.push(res[key]);
        });

        arr.map(dados => (
          dados.map(() => (
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
        let cortado = array_cortar_aux.slice(numero1_aux, numero2_aux)
        let soma = 0;
        array_cortar_aux.forEach(e => (soma = soma + e.valor));

        this.setState({ cortarExtrato: cortado, soma: soma });

        this.setState({ loading: false, mostrarExtrato: true, numeroRegistros: i, extrato: arr, confirm_compartilhar: 1, disabled: false })
      }
    });
  };

  render() {
    return (
      <div className="extrato">
        <BannerTitle title={i18n.t('extrato.extrato')} img={Objetos.extratoImg}/>

        {/* <Container className="col-md-10">
          <Breadcrumb className="pages">
            <Breadcrumb.Item href="/extrato">{i18n.t('extrato.breadCrumb2')}</Breadcrumb.Item>
            <Breadcrumb.Item active>{i18n.t('extrato.breadCrumb3')}</Breadcrumb.Item>
          </Breadcrumb>
        </Container> */}

        <Container className="p-3 col-md-10 d-flex justify-content-center">
          <Row className="baseWindow px-5 py-4">
              {
                this.state.cartao_ativo ? (
                  <Col>
                    <Row>
                      <p className="mb-4" style={{ fontSize: "1.30em" }}><strong>{i18n.t('extrato.textoEscolhaExtrato')}</strong></p>
                    </Row>
                    <Row>
                      <Col className="form-group">
                        <label>{i18n.t('extrato.dataInicio')}</label>
                        <br/>
                        <DatePicker
                          className="form-control text-center"
                          locale='pt-BR'
                          selected={this.state.dataDe}
                          required
                          dateFormat="dd/MM/yyyy"
                          popperPlacement="bottom"
                          maxDate={addDays(new Date(), 0)}
                          onChange={(data) => this.setState({ dataDe: data })}
                        />
                      </Col>
                      <Col className="form-group">
                        <label>{i18n.t('extrato.dataFinal')}</label>
                        <br/>
                        <DatePicker
                          className="form-control text-center"
                          locale='pt-BR'
                          selected={this.state.dataAte}
                          required
                          dateFormat="dd/MM/yyyy"
                          popperPlacement="bottom"
                          maxDate={addDays(new Date(), 0)}
                          onChange={(data) => this.setState({ dataAte: data })}
                        />
                      </Col>
                    </Row>
                    <Row className="form-group m-0">
                      <Button onClick={() => this.verExtrato()} disabled={this.state.disabled} className="m-auto px-5 py-2 btnProcurarExtrato">{i18n.t('extrato.btnPesquisar')}</Button>
                    </Row>
                  </Col>
                ) : (
                  <Col>
                    <Row>
                      <p className="mb-4" style={{ fontSize: "1.30em" }}><strong>{i18n.t('extrato.alertaCartao')}</strong></p>
                    </Row>
                    <Row>
                      <Link to='/extrato' className="m-auto">
                        <ButtonGroup className="buttonGroup">
                          <Button className="px-4 py-2">Voltar</Button>
                        </ButtonGroup>
                      </Link>
                    </Row>
                  </Col>
                )
              }
          </Row>
        </Container>

        <Container className="p-3 col-md-10">
          {
            this.state.loading ? (
              <ReactLoading className="d-block m-auto" type={'spin'} color={'#000'} height={'5%'} />
            ) : (
              (this.state.mostrarExtrato && (
                <Col className="baseWindow px-5 py-4">
                  <Row>
                    <ButtonGroup className="buttonGroup flex-row justify-content-between">
                      <Button className="mr-1" onClick={() => this.extrato_pdf()}>{i18n.t('extrato.downloadPdf')}</Button>
                      <Button onClick={() => this.extrato_csv()}>{i18n.t('extrato.downloadCsv')}</Button>
                    </ButtonGroup>

                    {
                      (this.state.soma != 0) ? (
                        <div className="d-flex flex-grow-1">
                          <p className="my-auto ml-auto texto-saldos-Extrato">
                            Total no período:
                            <span className={(this.state.soma < 0) ? "redText" : "greenText"}>  R$ {Formatar.formatReal(this.state.soma)}</span>
                          </p>
                        </div>
                      ) : null
                    }
                    
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Table striped bordered id="tabela-extrato">
                        <thead>
                          <tr>
                            <th scope="col">{i18n.t('extrato.descr')}</th>
                            <th className="text-right" scope="col">{i18n.t('extrato.descrValor')}</th>
                            <th className="text-right" scope="col">{i18n.t('extrato.descrData')}</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.cortarExtrato.map(dados => (
                            <tr key={dados.id}>
                              <td>{i18n.t('extrato.descrNome', { descricao: dados.descricao })}</td>
                              <td className={"text-right " + ((dados.valor < 0) ? "redText" : "greenText")}>{Formatar.formatReal(dados.valor)}</td>
                              <td className="text-right">{Formatar.formatarDate(dados.dataHora)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                  <Row className="d-flex justify-content-center">
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
                  </Row>
                </Col>
              )
            ))
          }
        </Container>
      </div>
    )
  }
}