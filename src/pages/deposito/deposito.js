import React, { Component } from 'react';
import '../../templates/style_deposito.scss';
import ReactPagination from 'react-js-pagination';
import { Container, Col, Row, Modal, Alert, Breadcrumb, Button } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input';
import DatePicker, { registerLocale } from "react-datepicker";
import { addDays } from 'date-fns';
import * as Iconfa from "react-icons/fa";
import * as Icon from 'react-bootstrap-icons';
import Icones from '../../constants/Icon';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes';
import * as Formatar from '../../constants/Formatar';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import i18n from '../../tradutor/tradutor';

export default class BoletoCobranca extends Component {
  constructor() {
    super();
    this.state = {
      pessoa: [],
      mostrarBotoes: true,
      mostrarBoletos: false,
      mostrarBoletos_lista: true,
      transferenciaShow: false,
      uploadShow: false,
      boletoShow: false,
      boleto: [],
      valorBoleto: [],
      valor: '',
      multa: '',
      juros: '',
      desconto: '',
      abatimento: '',
      sacadoId: '',
      descricao: '',
      notaDoc: '',
      dataDe: new Date(),
      dataAte: new Date(),
      dataVecimento: new Date(),
      mostrar_download: false,
      pdf: null,
      paginacao: 1,
      numeroRegistros: 0,
      cortarBoleto: [],
      comprovante: null,
      loading: false,
      nome_do_arquivo: ''
    };
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
  };

  boletos_lista = () => {
    this.setState({ loading: true });
    const data = {
      url: 'boleto/boleto/boletos-usuario',
      data: {
        'usuario_id': this.state.pessoa.usuario_id,
        "data_de": Formatar.formatarDateAno(this.state.dataDe),
        "data_ate": Formatar.formatarDateAno(this.state.dataAte)
      },
      method: 'POST',
    };

    Funcoes.Geral_API(data, true).then((res) => {

      var keys = Object.keys(res)
      if (keys.length === 0) {
        this.setState({ loading: false });
        // alert('Não foi encontrado nenhum boleto na data selecionada');
        alert(i18n.t('deposito.nenhumBoleto'));
      } else {
        this.setState({ loading: false });
        var arr = [];
        var i = 0;
        var keys = Object.keys(res);
        let array_cortar_aux = [];

        keys.forEach((key) => {
          if (res[key].sacado_id == null) {
            arr.push(res[key]);
            array_cortar_aux.push(res[key])
            i++
          }
        });

        this.setState({ paginacao: 1 });

        let numero1_aux = 0
        let numero2_aux = 10
        this.setState({ cortarBoleto: array_cortar_aux.slice(numero1_aux, numero2_aux) })

        this.setState({ mostrarBoletos_lista: true, numeroRegistros: i, boleto: arr })
      }

    });
  };

  GerarBoleto = () => {
	  this.setState({ loading: true });

    var valor = this.state.valor;
    valor = valor.replace('.', '');
    valor = valor.replace('.', '');
    valor = valor.replace('.', '');
    valor = valor.replace('.', '');
    valor = valor.replace(',', '.');

    const data = {
        url: 'boleto/boleto/boleto-deposito',
        data: {
            'usuario_id': this.state.pessoa.usuario_id,
            'data_vencimento': Formatar.formatarDateAno(this.state.dataVecimento),
            'valor': valor
        },
        method: 'POST',
    };
    Funcoes.Geral_API(data, true).then((res) => {
      if (res !== 0) {
        alert("Boleto gerado com sucesso");
       
        if (res.path) {
          let pdfWindow = window.open("a");
          pdfWindow.document.write("<body style='margin: 0;'><embed width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(res.path) + "' /></body>");
          pdfWindow.document.title = 'Boleto';
        } else if (res.link) {
          const fileName = "Boleto.pdf";
          const downloadLink = document.createElement("a");
          downloadLink.href = res.link;
          downloadLink.download = fileName;
          downloadLink.click();
        }
      } else {
        // alert("Erro ao Gerar Boleto, Tente Novamente Mais Tarde");
        alert(i18n.t('deposito.erroGerar'));
        /* window.location.href = '/deposito'; */
      }
	    this.setState({ loading: false });
	    window.location.href = '/deposito';
    });
  };

  download_boleto = () => {
    window.open(process.env.BASE_BOLETO + this.state.pdf);
  };

  colorStatus = (status, vencimento) => {
    let data_atual = Formatar.formatarDateAnoComparativo(Date())

    if (status === 1) {
      return 'green';
    }
    if (status === 0 && Formatar.formatarDateGerenciadorBoletosComparativo(vencimento) >= data_atual) {
      return '#41a8d8';
    } else {
      return '#ff6d5f'
    }
  };

  situacao = (status, vencimento) => {
    let data_atual = Formatar.formatarDateAnoComparativo(Date());
    if (status === 1) {
      // return 'Pago'
      return i18n.t('deposito.pago');
    }
    if (status === 0 && Formatar.formatarDateGerenciadorBoletosComparativo(vencimento) >= data_atual) {
      // return 'Em Aberto';
      return i18n.t('deposito.emAberto');
    } else {
      // return 'Vencido'
      return i18n.t('deposito.vencido');
    }
  };

  paginacao = (numero) => {
    let array_cortar = [];
    this.state.boleto.map(dados => (
      array_cortar.push(dados)
    ))

    this.setState({ paginacao: (numero) })
    let numero1 = (numero - 1) * 10
    let numero2 = (numero * 10)
    this.setState({ cortarBoleto: array_cortar.slice(numero1, numero2) })
  };

  receberComprovante = (event) => {
    let i = 0;
    let slice_name = (event.target.files[0]['name']).split('.');
    if (slice_name[1] === "jpeg" || slice_name[1] === "jpg" || slice_name[1] === "png") {
      alert(event.target.files[0]['name']);
      this.setState({ comprovante: event.target.files[0], nome_do_arquivo: event.target.files[0]['name'] });
    } else {
      // alert("Formato de arquivo inválido")
      alert(i18n.t('deposito.formatoInvalido'));
    }
  };

  uploadComprovante = () => {
    if (this.state.comprovante != null) {
      let timestamp = new Date().getTime();
      let filename = 'comprovante_' + this.state.pessoa.id + this.state.pessoa.conta + timestamp + '.png';
      let formData = new FormData();

      formData.append('photo', this.state.comprovante, filename);
      const data = {
        url: 'documento/upload&pasta=comprovante_deposito',
        data: formData.append('photo', this.state.comprovante, filename),
        method: 'POST',
      };
        
      Funcoes.Geral_API(data, true).then((res) => {
        if (res === 1) {
          this.salvarComprovante(filename);
        } else {
          // alert('Falha ao enviar comprovante');
          alert(i18n.t('deposito.falhaComprovante'));
        }
      });
    } else {
      // alert("Para fazer upload é necessário selecionar um arquivo");
      alert(i18n.t('deposito.upload'));
    }
  }


  salvarComprovante = (filename) => {
    const data = {
      url: 'comprovante-deposito/create',
      data: {
        'imagem_comprovante': filename,
        'conta_id': this.state.pessoa.conta_id,
      },
      method: 'POST',
    };
    /* const response = await api.post('conta/saldo', data, { headers },); */
    Funcoes.Geral_API(data, true).then((res) => {
      if (res === 1) {
        // alert('Comprovante Enviado com sucesso');
        alert(i18n.t('deposito.comprovanteEnviado'));
        window.location.href = '/deposito';
      } else {
        // alert('Falha ao enviar comprovante, tente novamente mais tarde');
        alert(i18n.t('deposito.falhaComprovanteTente'));
      }
    });
  }

  render() {
    return (
      <div>
        <BannerTitle title={i18n.t('deposito.deposito')} img={Objetos.depositoImg}/>
        <Container className="p-3 d-flex justify-content-center">
          <Col md={8} className="baseWindow px-5 py-4">
            <Row>
              <p className="mb-2 w-100 text-center" style={{ fontSize: "1.30em" }}><strong>Opções de depósito:</strong></p>
            </Row>
            <Row className="text-center px-3">
              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => { this.setState({ boletoShow: true }) }}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.depositoBoleto }
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">{i18n.t('deposito.btnDepositoBoleto')}</p>
                    </Col>
                  </Row>
                </Button>
              </Col>

              <Col className="p-3">
                <Link to='/gerenciar_deposito'>
                  <Button
                    variant="outline-primary"
                    className="baseButtonPrimary"
                  >
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.depositoGerenciar }
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">{i18n.t('deposito.btnDepositoGerenciar')}</p>
                      </Col>
                    </Row>
                  </Button>
                </Link>
              </Col>

              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => { this.setState({ transferenciaShow: true }) }}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.depositoTed}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">{i18n.t('deposito.btnDepositoTED')}</p>
                    </Col>
                  </Row>
                </Button>
              </Col>

              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => { this.setState({ uploadShow: true }) }}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.depositoComprovante}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">{i18n.t('deposito.btnDepositoComprovante')}</p>
                    </Col>
                  </Row>
                </Button>
              </Col>
            </Row>
          </Col>
        </Container>
          
        <Modal centered animation={false} size="sm" show={this.state.boletoShow} onHide={() => window.location.href = '/deposito'}>
          <Modal.Body>
            <div>
			          {
			            this.state.loading ? (
                  <ReactLoading className="loadingPagar" type={'bubbles'} color={'#000'} height={'15%'} width={'15%'} />
                ) : (
			              <div>
			                <label>{i18n.t('deposito.textBoleto')}</label>
                    <br></br>
                    <br></br>
                    <div className="form-group">
                      <label>{i18n.t('deposito.descrValor')}</label>
                      <CurrencyInput
                        className="form-control"
                        decimalSeparator=","
                        thousandSeparator="."
                        value={this.state.valor}
                        onChange={valor => this.setState({ valor })}
                      />
                    </div>

                    <div className="form-group">
                      <label>{i18n.t('deposito.dataVencimento')}</label>
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

                    <button 
                      type="button"
                      className="btn btnDepositoSucesso btn-success"
                      onClick={() => { this.GerarBoleto() }}
                    >
                      {i18n.t('deposito.gerarBoleto')}
                    </button>
                    
                    <button 
                      type="button"
                      className="btn btnDepositoCancelar btn-danger float-right" 
                      onClick={() => window.location.href = '/deposito'}
                    >
                      {i18n.t('deposito.fecharBoleto')}
                    </button>
			              </div>
			            )
			          }
            </div>
          </Modal.Body>
        </Modal>

        <Modal centered animation={false} show={this.state.transferenciaShow} onHide={() => window.location.href = '/deposito'}>
          <Modal.Body>
            <p><strong> {i18n.t('deposito.textTED') + process.env.NOME_BANCO}</strong></p>
            <hr></hr>
            <Alert variant={'success'}>
              <div style={{ color: 'black' }}>
                CNPJ: {process.env.CNPJ_BANCO}<br></br>
                Nome: {process.env.RAZAO_NOME}<br></br>
                Banco: {process.env.BANCO_BANCO}<br></br>
                Agência: {process.env.AGENCIA_BANCO}<br></br>
                Conta Corrente: {process.env.CONTA_BANCO}<br></br>
              </div>
            </Alert>
            <hr></hr>

            <Alert variant={'secondary'}>
              {i18n.t('deposito.alertTED') + process.env.NOME_BANCO}
            </Alert>

            <button 
              type="button"
              className="btn btnDepositoCancelar btn-danger float-right"
              onClick={() => window.location.href = '/deposito'}
            >
              {i18n.t('deposito.fecharBoleto')}
            </button>
          </Modal.Body>
        </Modal>

        <Modal animation={false} show={this.state.uploadShow} centered onHide={() => window.location.href = '/deposito'}>
          <Modal.Body>
            <p><strong>{i18n.t('deposito.textComp')}</strong></p>
              <div>
                <div className="form-group">

                  <Row className="custom-file-caixa">
                    <label className="custom-file-upload">
                      <input type="file" onChange={(event) => this.receberComprovante(event)} />
                      {i18n.t('deposito.eschComp')}
                    </label>
                    <label>{this.state.nome_do_arquivo}</label>
                  </Row>

                </div>
                  <button 
                    type="button"
                    className="btn btnDepositoSucesso btn-success"
                    onClick={() => this.uploadComprovante()}
                  >
                    {i18n.t('deposito.enviarComp')}
                  </button>

                  <button
                    type="button"
                    className="btn btnDepositoCancelar btn-danger float-right"
                    onClick={() => window.location.href = '/deposito'}
                  >
                   {i18n.t('deposito.fecharBoleto')}
                  </button>
                </div>
            </Modal.Body>
        </Modal>
      </div>
    );
  }
}
