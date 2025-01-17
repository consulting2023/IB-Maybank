import React, { Component } from "react";
import "../../templates/style_transferencia.scss";
// import { Container, Col, Row, Modal, Image, Button } from 'react-bootstrap';
import {
  Container,
  Col,
  Button,
  ButtonGroup,
  Dropdown,
  Row,
  Modal,
  Image,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import InputMask from "react-input-mask";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import Objetos from "../../constants/Objetos";
import * as Funcoes from "../../constants/Funcoes";
import * as Formatar from "../../constants/Formatar";
import CurrencyInput from "react-currency-input";
import Icones from "../../constants/Icon";
import OtpInput from "react-otp-input";
import ReactLoading from "react-loading";
import i18n from "../../tradutor/tradutor";
import Password from "../../components/password/Password";

export default class TransferenciaOutros extends Component {
  constructor() {
    super();
    this.state = {
      agencia: "",
      conta: "",
      digito: "",
      documento: "",
      tipoConta: "",
      favorecido: "",
      digitoAg: "",
      finalidade: "",
      bancos: [],
      bancos_filtro: [],
      selecionarRefBanco: "",
      id_banco: "",
      valorTransferencia: "",
      tokenRun: "",
      tokenCriado: "",
      email: "",
      senha: "",
      valor_tarifa: "",
      saldoDigital: "",
      inputToken: true,
      inputTokenQrcode: false,
      pessoa: "",
      valida_senha_ok: false,
      valida_token_ok: false,
      Qrcode_imagem: null,
      token_app: false,
      OTP: "",
      disabilitar: false,
      valor: "",
      mostrar_pesquisar: false,
      mask: "999.999.999-99",
      loading: false,
      valor_simulacao: "",
      modal_confirmacao: false,

      showModalComprovante: false,
      titleModalComprovante: "",
      comprovante_pdf: "",

      password: ["", "", "", "", "", ""],
    };
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });

    const data = {
      url: "conta/saldo",
      data: { conta_id: Funcoes.pessoa.conta_id },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      this.setState({
        saldoDigital: res.digital,
      });
    });

    const dados = {
      url: "bancos/lista",
      data: "",
      method: "GET",
    };

    Funcoes.Geral_API(dados, true).then((res) => {
      this.setState({ bancos: res, bancos_filtro: res });
    });
  }

  valor_tarifa = (valor_simulacao) => {
    const data = {
      url: "tarifa/consulta",
      data: {
        conta_id: this.state.pessoa.conta_id,
        chave: "transferencia",
        valor: valor_simulacao,
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      this.setState({ valor_tarifa: res });
    });
  };
  transferencia = () => {
    this.enviarToken();

    var valor = this.state.valor;
    valor = valor.replace(".", "");
    valor = valor.replace(".", "");
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");

    var valor_simulacao = this.state.valor_simulacao;
    valor_simulacao = valor_simulacao.replace(".", "");
    valor_simulacao = valor_simulacao.replace(".", "");
    valor_simulacao = valor_simulacao.replace(".", "");
    valor_simulacao = valor_simulacao.replace(",", ".");

    var doc = this.state.documento.replace(/[^0-9]+/g, "");
    var teste_doc = "";
    if (doc.length == 11) {
      teste_doc = Formatar.cpf_mask(doc);
    } else if (doc.length == 14) {
      teste_doc = Formatar.cnpj_mask(doc);
    }

    const saldo = this.state.saldoDigital;

    const valorTotal = parseFloat(valor) + parseFloat(this.state.valor_tarifa);

    if (this.state.id_banco == "") {
      // alert('Escolha o banco');
      alert(i18n.t("transferencia.escolhaBanco"));
      this.setState({ disabilitar: false });
    } else if (this.state.agencia == "") {
      // alert('Digite a agencia');
      alert(i18n.t("transferencia.digiteAgencia"));
      this.setState({ disabilitar: false });
    } else if (this.state.conta == "") {
      // alert('Digite a Conta');
      alert(i18n.t("transferencia.digiteConta"));
      this.setState({ disabilitar: false });
    } else if (this.state.digito == "") {
      // alert('Digite o digito')
      alert(i18n.t("transferencia.digiteDigito"));
      this.setState({ disabilitar: false });
    } else if (this.state.tipoConta == "") {
      // alert('Escolha o tipo de conta')
      alert(i18n.t("transferencia.escolhaTipo"));
      this.setState({ disabilitar: false });
    } else if (doc.length == 11 && teste_doc == false) {
      // alert('CPF Inválido')
      alert(i18n.t("transferencia.erroCPF"));
      this.setState({ disabilitar: false });
    } else if (doc.length == 14 && teste_doc == false) {
      // alert('CNPJ Inválido');
      alert(i18n.t("transferencia.erroCNPJ"));
      this.setState({ disabilitar: false });
    } else if (this.state.documento == "") {
      // alert('Digite o CPF ou CNPJ')
      alert(i18n.t("transferencia.digiteCPF"));
      this.setState({ disabilitar: false });
    } else if (this.state.favorecido == "") {
      // alert('Digite o nome do favorecido')
      alert(i18n.t("transferencia.digiteFavorecido"));
      this.setState({ disabilitar: false });
    } else if (this.state.valor == "") {
      // alert('Digite o valor');
      alert(i18n.t("transferencia.digiteValor"));
      this.setState({ disabilitar: false });
    } else if (this.state.finalidade == "") {
      // alert('Escolha a finalidade');
      alert(i18n.t("transferencia.finalidade"));
      this.setState({ disabilitar: false });
    } else if (valorTotal > saldo) {
      // alert('Saldo insuficiente');
      alert(i18n.t("transferencia.erroSaldo"));
      this.setState({ disabilitar: false });
    } else {
      this.setState({ disabilitar: true, token_app: true });
      this.valor_tarifa(valor_simulacao);
    }
  };

  combinacoes = async () => {
    this.setState({ loading: true });
    let { password } = this.state;

    if (password.some((e) => e == "")) {
      this.props.alerts("Erro", "erro de login", "warning");
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });

      const cartesian = (a) =>
        a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
      let output = cartesian(password);
      let texto = [];

      for (var i = 0; i < Object.keys(output).length; i++) {
        texto.push(
          output[i][0] +
            "" +
            output[i][1] +
            "" +
            output[i][2] +
            "" +
            output[i][3] +
            "" +
            output[i][4] +
            "" +
            output[i][5]
        );
      }

      const data = {
        url: "usuario/login",
        data: {
          email: Funcoes.pessoa.email,
          password: texto,
          sub_banco_id: "",
          token_aparelho: "",
          nome_aparelho: "",
        },
        method: "POST",
      };

      Funcoes.Geral_API(data, false).then((res) => {
        let chave = "";

        if (res != 0) {
          chave = texto;
          i = Object.keys(output);
        }

        if (chave == "") {
          this.setState({ loading: false });
          this.props.alerts("Erro", "Senha Incorreta", "warning");
        } else {
          if (this.state.OTP.length == 6) {
            this.setState({ password: chave });
            this.Valida_token(this.state.OTP);
          } else {
            this.setState({ loading: false });
            this.props.alerts("Erro", "Preencha o token", "warning");
          }
        }
      });
    }
  };

  gerarTransferencia = () => {
    this.setState({
      contas: false,
      loading: true,
    });
    let hoje = new Date().toLocaleDateString();

    /*    const dados = localStorage['token'];
        const pessoa = JSON.parse(dados); */

    var valor = this.state.valor;
    valor = valor.replace(".", "");
    valor = valor.replace(".", "");
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");

    var agencia = "";
    var conta = "";

    if (this.state.id_banco == "000") {
      agencia = ("0000" + this.state.agencia).slice(-4);
      conta = ("0000000" + this.state.conta).slice(-7);
    } else {
      agencia = this.state.agencia;
      conta = this.state.conta;
    }

    var doc = this.state.documento.replace(/[^0-9]+/g, "");
    var teste_doc = "";
    if (doc.length == 11) {
      teste_doc = Formatar.cpf_mask(doc);
    } else if (doc.length == 14) {
      teste_doc = Formatar.cnpj_mask(doc);
    }

    const data = {
      url: "transferencia/nova",
      data: JSON.stringify({
        valor: valor,
        nome_banco: String(this.state.id_banco),
        agencia: agencia,
        digitoAg: this.state.digitoAg,
        conta: String(conta),
        digito: String(this.state.digito),
        favorecido: this.state.favorecido,
        documento: teste_doc,
        finalidade: this.state.finalidade,
        tipo_conta: this.state.tipoConta,
        salvar_favorecido: false,
        data_transferencia: hoje,
        conta_id: this.state.pessoa.conta_id,
        cobrar: 1,
        senha: this.state.password,
        token: this.state.OTP,
        usuario_id: this.state.pessoa.usuario_id
      }),
      method: "POST",
    };

    const saldo = this.state.saldoDigital;

    const valorTotal = parseFloat(valor) + parseFloat(this.state.valor_tarifa);

    if (valorTotal > saldo) {
      // alert('Saldo insuficiente');
      alert(i18n.t("transferencia.erroSaldo"));
      window.location.href = "/transferencia_outros";
    } else {
      // if (this.state.valida_senha_ok == false) {
      //     alert('Erro senha ou token invalido');
      //     // alert(i18n.t('transferenciaerroSenha'));
      //     this.setState({ loading: false })
      // } else if (this.state.valida_token_ok == false) {
      //     alert('Erro senha ou token invalido');
      //     // alert(i18n.t('transferenciaerroSenha'));
      //     this.setState({ loading: false })
      // } else {

      Funcoes.Geral_API(data, true).then((res) => {
          if (res.error) {
            alert("Erro: " + res.message);
            window.location.href = "/transferencia_interna";
          } else {
            if (res.dados.mov_id) {
              Funcoes.comprovante_pdf(res.dados.mov_id);
            }
          }

          this.setState({ loading: false, token_app: false, contaSelecionada: false, modal_confirmacao: false });
          this.props.alerts("Transação efetuada", "Comprovante instalado automaticamente.", "success");


        // if (res == 0) {
        //   // Código inválido
        //   alert("Erro na transferencia");
        //   // window.location.href = '/transferencia_outros'
        //   // } else if (res == 203) {
        //   // Alerta pânico
        //   // alert('Código de barras inválido');
        //   // window.location.href = '/transferencia_outros'
        // } else if (res == 2) {
        //   alert("Saldo insuficiente");
        //   // window.location.href = '/transferencia_outros'
        //   //*Sem saldo na conta
        // } else if (res.mov_id) {
        //   //*pagamento realizado
        //   this.comprovante_ver(res.mov_id);
        // } else {
        //   //*algum erro não previsto
        //   alert("Processamento Invalido, Contate seu Gerente!");
        //   window.location.href = "/transferencia_outros";
        // }
      });

      // }
    }
  };

  input_Token = (id) => {
    if (id == 1) {
      this.setState({ inputToken: true, inputTokenQrcode: false });
    } else if (id == 2) {
      this.setState({ inputToken: false, inputTokenQrcode: true });
    } else {
      <></>;
    }
  };

  Valida_token = async (id) => {
    const data = {
      url: "utilitarios/validacao-email-confere",
      data: {
        email: Funcoes.pessoa.email,
        token: id,
      },
      method: "POST",
    };

    setTimeout(() => {
      Funcoes.Geral_API(data, true).then((res) => {
        console.log(res);
        if (res == true) {
          // this.setState({ valida_token_ok: true, tokenDigtado: id })
          this.gerarTransferencia();
        } else {
          // this.setState({ valida_token_ok: false })
          this.props.alerts("Erro", "Token inválido", "warning");
        }
      });
    }, 300);
  };

  /* gerar_qrcode = async () => {
        const dados = { 'usuario_id': this.state.pessoa.usuario_id };
        Funcoes.Gerar_QRcode_app(dados).then((res) => {
            this.setState({ Qrcode_imagem: res.qrcode });
            this.setState({ valida_token_ok: false });
            this.validar_qrcode();
            setTimeout(() => {
                this.gerar_qrcode();
            }, res.tempo_de_vida_previsto * 1000);
        });
    };

    validar_qrcode = async () => {
        const dados = { 'usuario_id': this.state.pessoa.usuario_id };
        Funcoes.Validar_Gerar_QRcode_app(dados).then((res) => {
            if (res == 1) {
                this.setState({ valida_token_ok: true });
            } else {
                this.setState({ valida_token_ok: false });
                this.validar_qrcode();
            }
        });
    }; */

  /* Validar_senha = (value) => {
    const data = {
      url: "usuario/login",
      data: {
        email: this.state.pessoa.email,
        password: value,
        sub_banco_id: "",
        token_aparelho: "",
        nome_aparelho: "",
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      console.log(res);
      if (res != 0) {
        this.setState({ valida_senha_ok: true });
      } else {
        this.setState({ valida_senha_ok: false });
      }
    });
  };
 */
  pesquisar = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = this.state.bancos.filter((data) => {
      return data.title.toLowerCase().search(value) != -1;
    });
    this.setState({ bancos_filtro: result });
  };

  maskaraInput = (value) => {
    value = value.replace(/[^\d]+/g, "");
    if (value.length <= 11) {
      this.setState({ mask: "999.999.999-99*" });
    } else {
      this.setState({ mask: "99.999.999/9999-99" });
    }
    this.setState({ documento: value });
  };

  comprovante_ver = (id) => {
    this.setState({ modal_confirmacao: false });
    this.setState({ token_app: false });
    this.setState({
      loading: true,
      showModalComprovante: true,
      titleModalComprovante: "Gerando comprovante...",
    });

    const data = {
      url: "conta/comprovante-pdf",
      data: {
        id: id,
      },
      method: "POST",
      funcao: "comprovante_ver",
      tela: "pix",
    };

    Funcoes.Geral_API(data, true).then((responseJson) => {
      this.setState({ comprovante_pdf: responseJson });
      setTimeout(() => {
        this.setState({
          titleModalComprovante: "Transferência efetuada com sucesso!",
          loading: false,
        });
      }, 1000);
    });
  };

  abrirComprovante = () => {
    const link = document.createElement("a");
    const pdfBase64 = this.state.comprovante_pdf; // Supondo que você já tenha o Base64 armazenado no estado

    // Definir o tipo de conteúdo como PDF e criar a URL com a string Base64
    link.href = `data:application/pdf;base64,${pdfBase64}`;

    // Definir o nome do arquivo para ser baixado
    link.download = "comprovante.pdf";

    // Simular o clique no link para iniciar o download
    link.click();
  };

  closeModalComprovante = () => {
    this.setState({
      showModalComprovante: false,
      loading: false,
      titleModalComprovante: "",
      comprovante_pdf: "",
    });
  };

  getPass = async (data) => {
    this.setState({ password: data });
  };

  enviarToken = () => {
    this.setState({ token_app: true });

    const data = {
      url: "utilitarios/validacao-email-envio",
      data: {
        email: Funcoes.pessoa.email,
      },
      method: "POST",
    };

    setTimeout(() => {
      // Funcoes.Geral_API(data, true).then((res) => {
      Funcoes.Geral_API(data, true).then((res) => {
        if (res == true) {
          console.log(res);
        }
      });
    }, 300);
  };

  render() {
    const items = [
      // { key: 1, label: 'Crédito em Conta', value: '01' },
      { key: 1, label: i18n.t("transferencia.credito"), value: "01" },
      // { key: 2, label: 'Pagamento de Aluguel/Condomínio', value: '02' },
      { key: 2, label: i18n.t("transferencia.pagarAluguel"), value: "02" },
      // { key: 3, label: 'Pagamento de Duplicata/Títulos', value: '03' },
      { key: 3, label: i18n.t("transferencia.pagarTitulos"), value: "03" },
      // { key: 4, label: 'Pagamento de Dividendos', value: '04' },
      { key: 4, label: i18n.t("transferencia.pagarDividendos"), value: "04" },
      // { key: 5, label: 'Pagamento de Mensalidade Escolar', value: '05' },
      { key: 5, label: i18n.t("transferencia.pagarMensalidade"), value: "05" },
      // { key: 6, label: 'Pagamento de Salários', value: '06' },
      { key: 6, label: i18n.t("transferencia.pagarSalario"), value: "06" },
      // { key: 7, label: 'Pagamento de Fornecedores/Honorários', value: '07' },
      { key: 7, label: i18n.t("transferencia.pagarFornecedor"), value: "07" },
      // { key: 8, label: 'Operações de Câmbios/Fundos/Bolsa de Valores', value: '08' },
      { key: 8, label: i18n.t("transferencia.operacoes"), value: "08" },
      // { key: 9, label: 'Repasse de Arrecadação/Pagamento de Tributos', value: '09' },
      { key: 9, label: i18n.t("transferencia.repasse"), value: "09" },
      // { key: 10, label: 'Transferência Internacional em Real', value: '10' },
      { key: 10, label: i18n.t("transferencia.internacional"), value: "10" },
      // { key: 11, label: 'DOC para Poupança', value: '11' },
      { key: 11, label: i18n.t("transferencia.docPoupanca"), value: "11" },
      // { key: 12, label: 'DOC para Depósito Judicial', value: '12' },
      { key: 12, label: i18n.t("transferencia.docDeposito"), value: "12" },
      // { key: 13, label: 'Outros', value: '13' },
      { key: 13, label: i18n.t("transferencia.outros"), value: "13" },
      // { key: 16, label: 'Pagamento de bolsa auxílio', value: '16' },
      { key: 16, label: i18n.t("transferencia.bolsa"), value: "16" },
      // { key: 17, label: 'Remuneração à cooperado', value: '17' }
      { key: 17, label: i18n.t("transferencia.remuneracao"), value: "17" },
    ];

    let indice_bancos = 0;
    const tipoContas = [
      // { label: 'Conta corrente', value: 'Conta corrente', key: 1 },
      {
        label: i18n.t("transferencia.contaCorrente"),
        value: "Conta corrente",
        key: 1,
      },
      // { label: 'Conta poupança', value: 'Conta poupança', key: 2 },
      {
        label: i18n.t("transferencia.contaPoupanca"),
        value: "Conta poupança",
        key: 2,
      },
    ];

    return (
      <>
        <BannerTitle
          title={i18n.t("transferencia.transferencia")}
          img={Objetos.transferenciaImg}
        />

        <Container className="mt-4 col-md-10">
          {/* <Breadcrumb>
                            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href="/transferencia">Transferência</Breadcrumb.Item>
                            <Breadcrumb.Item active>Transferência Para {i18n.t('transferencia.textOutrosBancos')}</Breadcrumb.Item>
                        </Breadcrumb> */}
        </Container>
        <Container className="mt-1 col-md-12 text-center">
          <p className="text-center" style={{ fontSize: "1.85em" }}>
            {i18n.t("transferencia.titleTransfOutros")}
          </p>
        </Container>
        <Container
          className="mt-4 campoGerarTransf col-md-10 margin-auto"
          style={{}}
        >
          <Col>
            <div className="showhimTransf">
              <div className="hiddenmeTransf">
                <p className="saldos-home texto-saldos-Transf">
                  {i18n.t("transferencia.saldo")}{" "}
                  <Icon.Eye
                    className="ocultarSaldoTransf"
                    style={{ fontWeight: "500" }}
                  />
                </p>
              </div>
              <div className="showmeTransf">
                <p className="saldos-home texto-saldos-Transf">
                  {i18n.t("transferencia.saldo")}{" "}
                  {Formatar.formatarMoeda(this.state.saldoDigital)}
                </p>
              </div>
            </div>
            <hr />
            <div className="margin-auto">
              <Row>
                <div className="form-group col-12">
                  <label>{i18n.t("transferencia.textBanco")}</label>
                  <Row>
                    <Button
                      variant="outline-primary"
                      style={{ width: "80px", height: "80px" }}
                      className="iconeBancos"
                      onClick={() => {
                        this.state.bancos.map((item, index) => {
                          if (item.id == "000") {
                            this.setState({
                              selecionarRefBanco: item.title,
                              id_banco: item.id,
                            });
                          }
                        });
                      }}
                    >
                      {Objetos.transferenciaIcon}
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={{ width: "80px", height: "80px" }}
                      className="iconeBancos"
                      onClick={() => {
                        this.state.bancos.map((item, index) => {
                          if (item.id == "341") {
                            this.setState({
                              selecionarRefBanco: item.title,
                              id_banco: item.id,
                            });
                          }
                        });
                      }}
                    >
                      {Objetos.transferenciaItau}
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={{ width: "80px", height: "80px" }}
                      className="iconeBancos"
                      onClick={() => {
                        this.state.bancos.map((item, index) => {
                          if (item.id == "033") {
                            this.setState({
                              selecionarRefBanco: item.title,
                              id_banco: item.id,
                            });
                          }
                        });
                      }}
                    >
                      {Objetos.transferenciaSantander}
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={{ width: "80px", height: "80px" }}
                      className="iconeBancos"
                      onClick={() => {
                        this.state.bancos.map((item, index) => {
                          if (item.id == "001") {
                            this.setState({
                              selecionarRefBanco: item.title,
                              id_banco: item.id,
                            });
                          }
                        });
                      }}
                    >
                      {Objetos.transferenciaDoBrasil}
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={{ width: "80px", height: "80px" }}
                      className="iconeBancos"
                      onClick={() => {
                        this.state.bancos.map((item, index) => {
                          if (item.id == "104") {
                            this.setState({
                              selecionarRefBanco: item.title,
                              id_banco: item.id,
                            });
                          }
                        });
                      }}
                    >
                      {Objetos.transferenciaCaixa}
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={{ width: "80px", height: "80px" }}
                      className="iconeBancos"
                      onClick={() => {
                        this.state.bancos.map((item, index) => {
                          if (item.id == "237") {
                            this.setState({
                              selecionarRefBanco: item.title,
                              id_banco: item.id,
                            });
                          }
                        });
                      }}
                    >
                      {Objetos.transferenciaBradesco}
                    </Button>
                    <Button
                      variant="outline-primary"
                      style={{ width: "80px", height: "80px" }}
                      className="iconeBancosOutros"
                      onClick={() => {
                        this.setState({ mostrar_pesquisar: true });
                      }}
                    >
                      {" "}
                      <p style={{ width: "100%", heigth: "100%" }}>
                        {i18n.t("transferencia.textOutrosBancos")}
                      </p>
                    </Button>
                  </Row>
                  <label></label>
                  <Row>
                    <div className="form-group col-12">
                      <input
                        disabled={true}
                        className="form-control"
                        required
                        value={this.state.selecionarRefBanco}
                      />
                    </div>
                  </Row>
                </div>
              </Row>

              {/* <Row>
                                    <div className="form-group col-12">
                                        <label>{i18n.t('transferencia.textBanco')}</label>
                                        <select required className="form-control ls-select" value={this.state.selecionarRefBanco} onChange={(e) => this.setState({ selecionarRefBanco: e.target.value })} >
                                            <option>Selecione o Banco</option>
                                            {this.state.bancos.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>{item.title}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
    
                                </Row> */}
              <Row>
                <div className="form-group col-3">
                  <label>{i18n.t("transferencia.agenciaTransfOutros")}</label>
                  <input
                    className="form-control"
                    required
                    id="agencia"
                    placeholder="000"
                    value={this.state.agencia}
                    onChange={(e) => this.setState({ agencia: e.target.value })}
                  />
                </div>
                <div className="form-group col-2">
                  <label>{i18n.t("transferencia.digAgTransfOutros")}</label>
                  <input
                    className="form-control"
                    required
                    id="digitoAg"
                    placeholder="000"
                    value={this.state.digitoAg}
                    onChange={(e) =>
                      this.setState({ digitoAg: e.target.value })
                    }
                  />
                </div>
              </Row>
              <Row>
                <div className="form-group col-3">
                  <label>{i18n.t("transferencia.contaTransfOutros")}</label>
                  <input
                    className="form-control"
                    required
                    id="conta"
                    // placeholder="Digite o número da Conta"
                    placeholder={i18n.t("transferencia.digiteNumeroConta")}
                    value={this.state.conta}
                    onChange={(e) => this.setState({ conta: e.target.value })}
                  />
                </div>
                <div className="form-group col-2">
                  <label>{i18n.t("transferencia.digitoTransfOutros")}</label>
                  <input
                    className="form-control"
                    required
                    id="digito"
                    placeholder="Digite o Digito"
                    value={this.state.digito}
                    onChange={(e) => this.setState({ digito: e.target.value })}
                  />
                </div>
                <div className="form-group col-7">
                  <label>{i18n.t("transferencia.tipoConta")}</label>
                  <select
                    required
                    className="form-control"
                    value={this.state.tipoConta}
                    onChange={(e) =>
                      this.setState({ tipoConta: e.target.value })
                    }
                  >
                    <option>{i18n.t("transferencia.selecTipoConta")}</option>
                    {tipoContas.map((tipo) => (
                      <option key={indice_bancos++} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Row>
              <Row>
                <div className="form-group col-4">
                  <label>{i18n.t("transferencia.documentoTransfOutros")}</label>
                  <InputMask
                    className="form-control"
                    id="cpfBusca"
                    required
                    value={this.state.documento}
                    onChange={(event) => this.maskaraInput(event.target.value)}
                    //onChange={(e) => this.setState({ buscarCpf: e.target.value })}
                    mask={this.state.mask}
                  />
                </div>
                <div className="form-group col-8">
                  <label>
                    {i18n.t("transferencia.favorecidoTransfOutros")}
                  </label>
                  <input
                    className="form-control"
                    required
                    id="favorecido"
                    // placeholder="Digite o nome do Favorecido"
                    placeholder={i18n.t("transferencia.digiteFavorecido")}
                    value={this.state.favorecido}
                    onChange={(e) =>
                      this.setState({ favorecido: e.target.value })
                    }
                  />
                </div>
              </Row>
              <Row>
                <div className="form-group col-4">
                  <label>{i18n.t("transferencia.valorTransfOutros")}</label>

                  <CurrencyInput
                    className="form-control"
                    decimalSeparator=","
                    thousandSeparator="."
                    value={this.state.valor}
                    onChange={(valor) =>
                      this.setState({ valor: valor, valor_simulacao: valor })
                    }
                  />
                </div>

                <div className="form-group col-8">
                  <label>
                    {i18n.t("transferencia.finalidadeTransfOutros")}
                  </label>
                  <select
                    required
                    className="form-control"
                    value={this.state.finalidade}
                    onChange={(e) =>
                      this.setState({ finalidade: e.target.value })
                    }
                  >
                    <option>
                      {i18n.t("transferencia.selectFinalidadeTransfOutros")}
                    </option>
                    {items.map((item) => (
                      <option key={indice_bancos++} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Row>
              <br />
              <p className="textDescr" style={{}}>
                <Icon.InfoCircle />{" "}
                <i>{i18n.t("transferencia.tranfDescrOutros")}</i>
              </p>

              {/* <p style={{ color: 'gray', marginBottom: '5px' }}><Icon.InfoCircle /> <i>Para esta transação será cobrado tarifa de transferencia no valor de {Formatar.formatarMoeda(this.state.valor_tarifa)}</i></p> */}
              <br></br>
              <button
                onClick={() => {
                  /* this.transferencia();  */ this.setState({
                    disabilitar: true,
                    modal_confirmacao: true,
                  });
                }}
                className="btn realizarTransferencia btn-sm btn-success"
              >
                {i18n.t("transferencia.btnTransferir")}
              </button>
            </div>
          </Col>
        </Container>

        <Modal
          centered
          size="lg"
          animation={true}
          show={this.state.modal_confirmacao}
          onHide={() => {
            this.setState({ modal_confirmacao: false });
          }}
        >
          <Modal.Body>
            <Container>
              <h3>{i18n.t("transferencia.titleConfirmeDados")}</h3>
              <hr />
              <Row>
                <h4>{i18n.t("transferencia.titleConfirmeDados")}</h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp; {this.state.selecionarRefBanco}
                </h4>
              </Row>

              <Row>
                <h4>{i18n.t("transferencia.agenciConfirmeDados")}</h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp; {this.state.agencia}
                </h4>
              </Row>

              {this.state.digitoAg != "" ? (
                <Row>
                  <h4>{i18n.t("transferencia.digitoConfirmeDados")} </h4>
                  <h4 style={{ fontWeight: "600" }}>
                    &nbsp;&nbsp; {this.state.digitoAg}
                  </h4>
                </Row>
              ) : null}

              <Row>
                <h4>{i18n.t("transferencia.contaConfirmaDados")}</h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp; {this.state.conta}
                </h4>
              </Row>

              <Row>
                <h4>{i18n.t("transferencia.digitoConfirmeDados")} </h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp; {this.state.digito}
                </h4>
              </Row>

              <Row>
                <h4>{i18n.t("transferencia.tipoContaConfirmeDados")}</h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp; {this.state.tipoConta}
                </h4>
              </Row>

              <Row>
                <h4>{i18n.t("transferencia.documentoConfirmeDados")}</h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp;{this.state.documento}
                </h4>
              </Row>

              <Row>
                <h4>{i18n.t("transferencia.favorecidoConfirmeDados")}</h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp;{this.state.favorecido}
                </h4>
              </Row>

              <Row>
                <h4>{i18n.t("transferencia.valorConfirmeDados")}</h4>
                <h4 style={{ fontWeight: "600" }}>
                  &nbsp;&nbsp;R$ {this.state.valor}
                </h4>
              </Row>

              <hr />

              <button
                type="button"
                className="btn btnTransfCancelar"
                onClick={() => this.setState({ modal_confirmacao: false })}
              >
                {i18n.t("transferencia.btnCancelar")}
              </button>
              <button
                onClick={() => this.transferencia()}
                className="btn btnTransfSucesso float-right btnTransfSucesso"
              >
                {i18n.t("transferencia.btnTransferir")}
              </button>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal
          centered
          animation={true}
          show={this.state.mostrar_pesquisar}
          onHide={() => {
            this.setState({ mostrar_pesquisar: false });
          }}
        >
          <Modal.Body>
            <Container className="text-center">
              <h5>{i18n.t("transferencia.selectBanco")}</h5>
              <div
                style={{
                  margin: "0 auto",
                  marginTop: "10%",
                  textAlign: "left",
                }}
              >
                <label>{i18n.t("transferencia.pesquisarBanco")} &nbsp;</label>
                <input
                  style={{ width: "70%" }}
                  type="text"
                  onChange={(event) => this.pesquisar(event)}
                />
              </div>
              <hr />
              <ul className="listasBancosOutros">
                {this.state.bancos_filtro.map((item, index) => {
                  return (
                    <li>
                      <Button
                        className="bancosOutros"
                        key={index}
                        onClick={() => {
                          this.setState({
                            selecionarRefBanco: item.title,
                            id_banco: item.id,
                            mostrar_pesquisar: false,
                          });
                        }}
                      >
                        <label className="titlebancos" value={item.id}>
                          {item.title.toUpperCase()}
                        </label>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.token_app}
          onHide={() => this.setState({ token_app: false })}
        >
          <Modal.Body className="modalValidacao">
            <h2>{i18n.t("transferencia.titleModalValidacao")}s</h2>
            <hr />
            <h5>
              {i18n.t("transferencia.textModalValidacao", {
                nome_banco: process.env.NOME_BANCO,
              })}
            </h5>
            <br />
            <Container>
              <Row className="justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary col-12 mt-12 text-center tokenButton"
                  style={{ height: 70, justifyContent: "center" }}
                  onClick={() => this.input_Token(1)}
                >
                  <span>
                    {Icones.token}
                    <h5>{i18n.t("transferencia.tokenValidacao")}</h5>
                  </span>
                </button>

                {/* <button type="button" className="btn btn-primary col-5 mt-12 text-center tokenButton"
                                        style={{ height: 70, justifyContent: 'center' }}
                                        onClick={() => this.input_Token(2)}>
                                        <span>{Icones.token_qrcode}<h5>QR Code</h5></span>
                                    </button>
     */}
              </Row>
              <Container style={{ marginTop: "10px", padding: 0 }}>
                <hr />
                <h4>{i18n.t("transferencia.titleSenha")}</h4>
                <h6>{i18n.t("transferencia.textSenha")}</h6>
                <Row style={{ height: 70 }} className="token">
                  <Col className="col-md-10">
                    {/* <OtpInput
                                                isInputSecure={true}
                                                focusInput={1}
                                                isInputNum={true}
                                                value={this.state.password}
                                                onChange={(value) => {
                                                    this.setState({ password: value });
                                                    if (value.length == 6) {
                                                        this.Validar_senha(value);
                                                    } else {
                                                        this.setState({ valida_senha_ok: false })
                                                    }
                                                }}
                                                numInputs={6}
                                                className="tokenValidacao"
                                            /> */}
                    <Password passProp={this.getPass} />
                  </Col>
                </Row>
              </Container>

              {/* Token */}
              {this.state.inputToken ? (
                <Container style={{ marginTop: "10px", padding: 0 }}>
                  <hr />
                  <h4>{i18n.t("transferencia.tokenValidacao")}</h4>
                  <h6>{i18n.t("transferencia.textTokenDescr")}</h6>
                  <Row style={{ height: 70 }} className="token">
                    <Col className="col-md-10">
                      <OtpInput
                        focusInput={1}
                        isInputNum={true}
                        value={this.state.OTP}
                        onChange={(value) => {
                          this.setState({ OTP: value });
                          // if (value.length == 6) {
                          //     this.Valida_token(value);
                          // } else {
                          //     this.setState({ valida_token_ok: false })
                          // }
                        }}
                        numInputs={6}
                        className="tokenValidacao"
                      />
                    </Col>
                  </Row>
                </Container>
              ) : (
                <></>
              )}

              <br />
              <Row className="justify-content-center">
                {this.state.loading ? (
                  <ReactLoading
                    className="loadingPagar"
                    type={"bubbles"}
                    color={"#000"}
                    height={"15%"}
                    width={"15%"}
                  />
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary col-5 mt-12 text-center tokenButton"
                    style={{ height: 70, justifyContent: "center" }}
                    onClick={() => this.combinacoes()}
                  >
                    <span>
                      {Icones.pagarConta}
                      <h5>{i18n.t("transferencia.btnTransferir")}</h5>
                    </span>
                  </button>
                )}
              </Row>
            </Container>

            <br />
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showModalComprovante}
          // show={true}
          centered
          onHide={() => this.closeModalComprovante()}
        >
          <Modal.Header closeButton>
            {/* <Modal.Title>Transação Pix efetuada com sucesso!</Modal.Title> */}
            <Modal.Title>{this.state.titleModalComprovante}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              {this.state.loading ? (
                <ReactLoading
                  className="d-block my-5 mx-auto"
                  type={"spin"}
                  color={"#00000"}
                  height={"50px"}
                />
              ) : (
                <Row className="p-5 w-100">
                  <Button
                    className="w-100"
                    onClick={() => this.abrirComprovante()}
                  >
                    Visualizar Comprovante
                  </Button>
                </Row>
              )}
            </Container>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
