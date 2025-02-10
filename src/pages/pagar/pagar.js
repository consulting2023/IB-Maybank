import React, { Component } from 'react';
import '../../templates/style_pagamento.scss';
// import { Container, Col, Row, Modal } from 'react-bootstrap';
import { Container, Col, Button, ButtonGroup, Dropdown, Row, Modal, Image } from 'react-bootstrap';
import InputMask from "react-input-mask";
import { registerLocale } from "react-datepicker";
import { format } from 'date-fns';
import OtpInput from 'react-otp-input';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Icones from '../../constants/Icon';
import * as Icon from 'react-bootstrap-icons';
import Objetos from '../../constants/Objetos';
import * as Funcoes from '../../constants/Funcoes';
import * as Formatar from '../../constants/Formatar';
import ReactLoading from 'react-loading';
import i18n from '../../tradutor/tradutor';
import Password from '../../components/password/Password';

export default class Pagar extends Component {
  constructor() {
    super();
    this.state = {
      pessoa: [],
      mostrarLinhaDigitavel: true,
      mostrarBoleto: false,
      linha_digitavel: '',
      mask: '99999.99999 99999.999999 99999.999999 9 99999999999999',
      tipo_boleto: '',
      code_barra: '',
      nome_beneficiario: '',
      valor: '',
      vencimento: '',
      vencimento2: '',
      nome_pagador: '',
      documento_pagador: '',
      documento_beneficiario: '',
      desconto: '',
      juros_mora: '',
      multa: '',
      total_multa: '',
      total_pagar: '',
      tokenrun: '',
      valor_tarifa: '',
      saldoDigital: '',
      numero_aleatorio: '',
      inputToken: true,
      inputTokenQrcode: false,
      token_app: false,
      Qrcode_imagem: null,
      OTP: "",
      valida_senha_ok: false,
      valida_token_ok: false,
      loading: false,
      mostrar_pagamento: false,

      showModalComprovante: false,
      titleModalComprovante: '',
      comprovante_pdf: '',

      password: ['', '', '', '', '', ''],
    };
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });

    const data = {
      url: 'conta/saldo',
      data: { 'conta_id': pessoa.conta_id },
      method: 'POST',
    };
    Funcoes.Geral_API(data, true).then((res) => {
      this.setState({ saldoDigital: res.digital });
    })
  };

  maskaraInput = (value) => {
    if (parseInt(value[0]) === 8) {
      this.setState({ mask: '99999999999-9 99999999999-9 99999999999-9 99999999999-9', tipo_boleto: 2 });
    } else {
      this.setState({ mask: '99999.99999 99999.999999 99999.999999 9 99999999999999', tipo_boleto: 1 });
    }
    this.setState({ linha_digitavel: value })
  };

  validar_dia_hora = () => {
    //var data_de = new Date(new Date() - (2 * 86400000));
    var data_de = new Date();
    var newDate = format(data_de, 'i');
    var newDate2 = format(data_de, 'km');
    // var newDate2 = 1831;
    var newDate3 = format(data_de, 'yyyy-MM-dd');


    if (newDate == 6 || newDate == 7) {
      // alert("Pagamento só pode ser realizado em dia útil.");
      alert(i18n.t('pagar.diaUtil'));
      this.setState({ loading: false })

    } else {
      if (newDate2 >= 1830) {
        // alert("Pagamento fora do horário permitido.");
        alert(i18n.t('pagar.foraHorario'));
        this.setState({ loading: false })
      } else {
        this.consultar_boleto();
        this.setState({ loading: true })
      }
    }
  }

  consultar_boleto = () => {
    if (this.state.linha_digitavel != '') {
      this.setState({ loading: true });
      const data = {
        url: 'pagamento/consulta',
        data: { 
          codigo_de_barras: (this.state.linha_digitavel).replace(/\D/g, "") 
        },
        method: 'POST',
      };

      Funcoes.Geral_API(data, true).then((res) => {
        if (res.error == true || res == 0) {
          alert(i18n.t('pagar.invalido'));
          this.setState({ loading: false });
        } else {
          if (this.state.tipo_boleto === 2) {
            if (res.dados.nome_beneficiario == process.env.RAZAO_NOME) {
              // alert('Não é permitido pagar um boleto da própria ' + process.env.NOME_BANCO);
              alert(i18n.t('pagar.boletoPropria', {nome_banco: process.env.NOME_BANCO}));
            } else {
              var vencimento = res.dados.vencimento.split("-");
              vencimento = vencimento[2] + "/" + vencimento[1] + "/" + vencimento[0];

              var total_pagar = res.dados.valor;

              let resultado = '';

              var codigo = res.dados.numeroLinhaDigitavel.replace(/[^0-9]/g, '');

              if (this.state.tipo_boleto == 1) {
                resultado = codigo.substr(0, 4) +
                codigo.substr(32, 1) +
                codigo.substr(33, 14) +
                codigo.substr(4, 5) +
                codigo.substr(10, 10) +
                codigo.substr(21, 10);
              } else {
                codigo = codigo.split('');
                codigo.splice(11, 1);
                codigo.splice(22, 1);
                codigo.splice(33, 1);
                codigo.splice(44, 1);
                codigo = codigo.join('');

                resultado = codigo;
              }

              this.setState({
                loading: false,
                mostrarBoleto: true,
                code_barra: resultado,
                nome_beneficiario: res.dados.nome_beneficiario,
                valor: res.dados.valor_original,
                vencimento: vencimento,
                vencimento2: vencimento,
                // nome_pagador: this.state.pessoa.razao_social,
                nome_pagador: res.dados.nome_pagador,
                // documento_pagador: this.state.pessoa.cpf_cnpj,
                documento_pagador: res.dados.documento_pagador,
                desconto: res.dados.valorDesconto,
                juros_mora: res.dados.valorJuros,
                multa: res.dados.valorMulta,
                total_multa: res.dados.total_multa,
                total_pagar: total_pagar
              });
            }
          } else {
            if (res.dados.nome_beneficiario == process.env.RAZAO_NOME) {
              // alert('Não é permitido pagar um boleto da própria ' + process.env.NOME_BANCO);
              alert(i18n.t('pagar.boletoPropria', {nome_banco: process.env.NOME_BANCO}));
            } else {
              var vencimento = res.dados.vencimento.split("-");
              vencimento = vencimento[2] + "/" + vencimento[1] + "/" + vencimento[0];

              var total_pagar = res.dados.valor;

              let resultado = '';

              var codigo = res.dados.numeroLinhaDigitavel.replace(/[^0-9]/g, '');
              if (this.state.tipo_boleto == 1) {
                resultado = codigo.substr(0, 4) +
                codigo.substr(32, 1) +
                codigo.substr(33, 14) +
                codigo.substr(4, 5) +
                codigo.substr(10, 10) +
                codigo.substr(21, 10);
              } else {
                codigo = codigo.split('');
                codigo.splice(11, 1);
                codigo.splice(22, 1);
                codigo.splice(33, 1);
                codigo.splice(44, 1);
                codigo = codigo.join('');

                resultado = codigo;
              }

              this.setState({
                loading: false,
                mostrarBoleto: true,

                code_barra: resultado,
                nome_beneficiario: res.dados.nome_beneficiario,
                documento_beneficiario: res.dados.documento_beneficiario,
                valor: res.dados.valor_original,
                vencimento: vencimento,
                vencimento2: vencimento,
                nome_pagador: this.state.pessoa.razao_social,
                documento_pagador: this.state.pessoa.cpf_cnpj,
                desconto: res.dados.valorDesconto,
                juros_mora: res.dados.valorJuros,
                multa: res.dados.valorMulta,
                total_multa: res.dados.total_multa,
                total_pagar: total_pagar,
              });
            }
          }
        }
        this.valor_tarifa(total_pagar);
      });
    } else {
      // alert('Código de barras inválido')
      alert(i18n.t('pagar.invalido'));
    }
  };

  valor_tarifa = (valor) => {
    const data = {
      url: 'tarifa/consulta',
      data: {
        chave: 'pagamento',
        conta_id: this.state.pessoa.conta_id,
        valor: valor
      },
      method: 'POST',
    };
    Funcoes.Geral_API(data, true).then((res) => {
      this.setState({ valor_tarifa: res });
    });
  };

  enviarToken = () => {
    this.setState({ token_app: true });

    const data = {
      url: "utilitarios/validacao-email-envio",
      data: {
        email: this.state.pessoa.email,
      },
      method: "POST",
    };
    setTimeout(() => {
      // Funcoes.Geral_API(data, true).then((res) => {
      Funcoes.Geral_API(data, true).then((res) => {
        // if (res == true) {
        //   console.log(res);
        // }
      });
    }, 300);
  };

  Valida_token = async (id) => {
    const data = {
      url: 'utilitarios/validacao-email-confere',
      data: {
        email: this.state.pessoa.email,
        token: id,
      },
      method: 'POST',
    };
    setTimeout(() => {
      Funcoes.Geral_API(data, true).then((res) => {
        if (res == true) {
          // this.setState({ valida_token_ok: true, tokenDigtado: id });
          this.Realizar_Pagamento();
        } else {
          this.props.alerts("Erro", "Token inválido", 'warning');
        }
      });
    }, 300);
  };

  combinacoes = async () => {
    this.setState({ loading: true });
    let { password } = this.state;

    if (password.some((e) => e =='')) {
      this.props.alerts('Erro', 'erro de login', 'warning');
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });

      const cartesian = (a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
      let output = cartesian(password);
      let texto = [];

      for (var i = 0; i < (Object.keys(output)).length; i++) {
        texto.push(output[i][0] + '' + output[i][1] + '' + output[i][2] + '' + output[i][3] + '' + output[i][4] + '' + output[i][5]);
      }

      const data = {
        url: 'usuario/login',
        data: {
          'email': Funcoes.pessoa.email,
          'password': texto,
          'sub_banco_id': '',
          'token_aparelho': '',
          'nome_aparelho': ''
        },
        method: 'POST',
      };

      Funcoes.Geral_API(data, false).then((res) => {
        let chave = '';

        if (res != 0) {
          chave = texto;
          i = (Object.keys(output));
        }

        if (chave == '') {
          this.setState({ loading: false });
          this.props.alerts('Erro', 'Senha Incorreta', 'warning');
        } else {
          if (this.state.OTP.length == 6) {
            this.setState({ password: chave });
            this.Valida_token(this.state.OTP);
          } else {
            this.setState({ loading: false })
            this.props.alerts('Erro', 'Preencha o token', 'warning');
          }
        }
      })
    }
  };

  Realizar_Pagamento = () => {
    if (parseFloat(this.state.total_pagar) + parseFloat(this.state.valor_tarifa) > this.state.saldoDigital) {
      // alert('Saldo insuficiente');
      alert(i18n.t('pagar.saldoInsuficiente'));
      window.location.href = '/Pagar'
    } else {
      const dados = {
        url: 'pagamento/novo',
        data: {
          "conta_id": this.state.pessoa.conta_id,
          'tipo': this.state.tipo_boleto,
          'linha_digitavel': this.state.code_barra,
          'linha_digitavel_de_verdade': this.state.code_barra,
          'nome_beneficiario': this.state.nome_beneficiario,
          'valor': this.state.valor,
          'vencimento': this.state.vencimento,
          'nome_pagador': this.state.nome_pagador,
          'documento_pagador': this.state.documento_pagador,
          'documento_beneficiario': this.state.documento_beneficiario,
          'desconto': this.state.desconto,
          'juros_mora': this.state.juros_mora,
          'multa': this.state.multa,
          'total_multa': this.state.total_multa,
          'total_pagar': this.state.total_pagar,
          'token': this.state.OTP,
          'senha': this.state.password,
          'cvv': '',
          'amount': '',
          'parcelas': ''
        },
        method: 'POST',
      };
        
      Funcoes.Geral_API(dados, true).then((res) => {
        // if (res.mov_id) {
        //   // alert('Pagamento realizado com sucesso.\nVerifique em meus comprovantes.');
        //   // alert(i18n.t('pagar.sucesso'));
        //   // window.location.href = '/pagar'

        //   this.setState({ token_app: false });
        //   this.comprovante_ver(res.mov_id);
            
        // } else {
        //   // alert('Não foi possivel concluir o Pagamento.\nTente novamente mais tarde.');
        //   alert(i18n.t('pagar.tente'));
        //   window.location.href = '/pagar'
        // }

        if (res == 0) {
          // Código inválido
          alert('Erro no boleto');
          window.location.href = '/pagar'
        } else if (res == 203) {
          // Alerta pânico
          alert('Código de barras inválido');
          window.location.href = '/pagar'
        } else if (res == 2) {
          alert("Saldo insuficiente");
          window.location.href = '/pagar'
          //*Sem saldo na conta
        } else if (res.mov_id) {
            //*pagamento realizado
          this.setState({ token_app: false });
          alert("Pagamento efetuado com sucesso!");
          Funcoes.comprovante_ver(res.mov_id);
          window.location.href = '/pagar'
        } else {
          //*algum erro não previsto
          alert('Processamento Invalido, Contate seu Gerente!');
          window.location.href = '/pagar'
        }
      });
    }
  };

  comprovante_ver = (id) => {
    this.setState({ loading: true, showModalComprovante: true, titleModalComprovante: 'Gerando comprovante...' });

    const data = {
      url: 'conta/comprovante-pdf',
      data: {
        "id": id
      },
      method: 'POST',
    };

    Funcoes.Geral_API(data, true).then((responseJson) => {
      this.setState({ comprovante_pdf: responseJson });
      setTimeout(() => {
        this.setState({ titleModalComprovante: 'Pagamento efetuado com sucesso!', loading: false });
      }, 1000);
    });
  };

  abrirComprovante = () => {
    let pdfWindow = window.open("")
    pdfWindow.document.write("<body style='margin: 0;'><embed width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(this.state.comprovante_pdf) + "' /></body>");
    pdfWindow.document.title = 'Comprovante'
  }

  closeModalComprovante = () => {
    this.setState({ showModalComprovante: false, loading: false, titleModalComprovante: '', comprovante_pdf: '' });
  }

  getPass = async (data) => {
    this.setState({ password: data });
  }

  render() {
    return (
      <div>
        <BannerTitle title={i18n.t('pagar.pagar')} img={Objetos.pagarImg}/>
    
        {
          this.state.mostrarLinhaDigitavel ? (
            <Container className="mt-1 col-md-7 text-center">
              <div className="margin-auto">
                <label className="text-center" style={{ fontSize: '1.70em' }}>{i18n.t('pagar.linhaDigital')}</label>
                <InputMask
                    className="form-control"
                    required
                    value={this.state.linha_digitavel}
                    onChange={event => this.maskaraInput(event.target.value)}
                    mask={this.state.mask}
                />
                <br></br>
                {
                    this.state.loading ? (
                        <ReactLoading className="loadingPagar" type={'bubbles'} color={'#000'} height={'15%'} width={'15%'} />
                    ) : (
                        <button className="btn btn-primary pagarEscolha" type="button" onClick={() => {
                            this.consultar_boleto();
                            /* this.validar_dia_hora(); */
                        }}>{i18n.t('pagar.btnConsultar')}</button>
    
                    )
                }
              </div>
            </Container>
          ) : null
        }
    
        {
          this.state.mostrarBoleto ? (
            <Container className="mt-4 col-sm-6 margin-auto blocoBoleto" style={{}} >
              <Row>
                <Col sm={6}>
                  <p><strong>{i18n.t('pagar.dadosBoleto')}</strong></p>
                </Col>
                <Col sm={6} style={{ textAlign: 'right' }} className="showhimPagar">
                  <div className="hiddenmePagar" >
                    <p className="saldos-home texto-saldos-pagar" style={{ fontWeight: '500' }}><Icon.Eye className="ocultarSaldoPagar" /></p>
                  </div>
                  <div className="showmePagar" >
                    <p className="saldos-home texto-saldos-pagar" style={{ fontWeight: '500' }}>{Formatar.formatarMoeda(this.state.saldoDigital)}</p>
                  </div>
                </Col>
              </Row>
    
              <hr></hr>
              <Row>
                <div className='col-sm-12 favorecido'>
                  <strong>{i18n.t('pagar.favorecido')}</strong>
                  {this.state.nome_beneficiario}
                </div>
                <div className='col-sm-12 valor'>
                  <strong>{i18n.t('pagar.valorDocumento')}</strong>
                  {Formatar.formatarMoeda(this.state.valor)}
                </div>
              </Row>
              <Row>
                <div className='col-sm-6 desconto'>
                  <strong>{i18n.t('pagar.desconto')}</strong>
                  {Formatar.formatarMoeda(this.state.desconto)}
                </div>
                <div className='col-sm-6 juros'>
                  <strong>{i18n.t('pagar.jurosMora')}</strong>
                  {Formatar.formatarMoeda(this.state.juros_mora)}
                </div>
              </Row>
              <Row>
                <div className='col-sm-6 multas' >
                  <strong>{i18n.t('pagar.multa')}</strong>
                  {Formatar.formatarMoeda(this.state.multa)}
                </div>
                <div className='col-sm-6 encargos'>
                  <strong>{i18n.t('pagar.totalEncargo')}</strong>
                  {Formatar.formatarMoeda(this.state.total_multa)}
                </div>
              </Row>
              <Row>
                <div className='col-sm-6 vencimento'>
                  <strong>{i18n.t('pagar.vencimento')}</strong>
                  {this.state.vencimento}
                </div>
                <div className='col-sm-6 total'>
                  <strong>{i18n.t('pagar.totalPagar')}</strong>
                  {Formatar.formatarMoeda(this.state.total_pagar)}
                </div>
              </Row>
    
              <Row>
                <div className='col-sm-12'>
                  <strong>{i18n.t('pagar.codigoBarras')}</strong>
                  {this.state.code_barra}
                </div>
              </Row>
    
              <br></br>
              {/* <p className="textDescr" style={{}}><Icon.InfoCircle /> <i>Para esta transação será cobrado tarifa de transferencia no valor de {Formatar.formatarMoeda(this.state.valor_tarifa)}</i></p> */}
    
              <button className="btn btn-danger " onClick={() => { window.location.href = '/Pagar' }}>{i18n.t('pagar.btnVoltar')}</button>
    
              <button 
                className="btn pagarValidar btn-success float-right"
                onClick={() => { 
                  this.enviarToken();
                }}
              >
                {i18n.t('pagar.btnProximo')}
              </button>
    
            </Container>

          ) : null
        }
    
        {/* Modal de Chave de Acesso */}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
    
          show={this.state.token_app}
          onHide={() => this.setState({ token_app: false })}
        >
          <Modal.Header closeButton>
            {i18n.t('pagar.titleModalValidacao')}
          </Modal.Header>
          <Modal.Body className="p-4">
            <Container>
              {i18n.t('pagar.textModalValidacao', {nome_banco: process.env.NOME_BANCO})}
              <Col className="mt-3">
                <Row className="mb-5">
                  <label className="ml-n3 w-100">{i18n.t('pagar.titleSenha')}</label>
                  {/* {i18n.t('pagar.textSenha')} */}
                  <Password passProp={this.getPass}/>
                </Row>
    
                <Row className="mt-5">
                  <label className="ml-n3 w-100">{i18n.t('pagar.titleToken')}</label>
                  {/* {i18n.t('pagar.textTokenDescr')} */}
                  <OtpInput
                    focusInput={1}
                    isInputNum={true}
                    value={this.state.OTP}
                    onChange={(value) => {
                      this.setState({ OTP: value });
                    }}
                    numInputs={6}
                    className="tokenValidacao"
                  />
                </Row>
              </Col>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="col-5 mt-12 text-center tokenButton"
              style={{ height: 70, justifyContent: 'center' }}
              onClick={() => this.combinacoes()}
            >
              <span>
                {Icones.pagarConta}
                {i18n.t('pagar.btnPagar')}
              </span>
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.showModalComprovante}
          // show={true}
          centered
          onHide={() => this.closeModalComprovante()}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.titleModalComprovante}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              {
                this.state.loading ?
                  <ReactLoading className="d-block my-5 mx-auto" type={'spin'} color={'#00000'} height={'50px'} />
                :
                  <Row className="p-5 w-100">
                    <Button
                      className="w-100"
                      onClick={() => this.abrirComprovante()}
                    >
                      Visualizar Comprovante
                    </Button>
                  </Row>
              }
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
