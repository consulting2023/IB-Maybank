import React, { Component } from "react";
import "../../templates/style_transferencia.scss";
import {
  Container,
  Col,
  Button,
  Row,
  Modal,
  Image,
  Alert,
} from "react-bootstrap";
import Icones from "../../constants/Icon";
import * as Icon from "react-bootstrap-icons";
import InputMask from "react-input-mask";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import Objetos from "../../constants/Objetos";
import * as Funcoes from "../../constants/Funcoes";
import CurrencyInput from "react-currency-input";
import OtpInput from "react-otp-input";
import * as Formatar from "../../constants/Formatar";
import ReactLoading from "react-loading";
import i18n from "../../tradutor/tradutor";
import Password from "../../components/password/Password";
import { jsPDF } from "jspdf";

export default class TransferenciaInterna extends Component {
  constructor() {
    super();
    this.state = {
      saldo: "",
      telefone: false,
      cpf: false,
      conta: false,
      contas: false,
      contaTelefone: false,
      contaSelecionada: false,
      senha: "",
      buscarCpf: "",
      buscarConta: "",
      buscarDigito: "",
      contasMultiplas: [],
      selecionarConta: {
        conta: { id: "", agencia: "", digito: "" },
        dados: { nome: "" },
      },
      documento: "",
      favorecido: "",
      token: [],
      tokenCriado: [],
      valorTransferencia: "",
      agenciaBusca: "",
      telefoneBusca: "",
      email: "",
      agencia_enviar: "",
      inputToken: true,
      inputTokenQrcode: false,
      pessoa: [],
      valida_senha_ok: false,
      valida_token_ok: false,
      Qrcode_imagem: null,
      token_app: false,
      OTP: "",
      disabilitar: false,
      valor: "",
      mask: "999.999.999-99",
      saldoDigital: 0,
      loading: false,

      tokenDigtado: "",

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
      this.setState({
        bancos: res,
      });
    });
  }

  selecionarConta = (dados) => {
    try {
      this.setState({
        documento: dados.dados.documento,
        favorecido: dados.dados.nome,
      });
    } catch (error) {
      this.setState({
        documento: dados.dados.documento,
        favorecido: dados.dados.razao_social,
      });
    }
    this.setState({
      selecionarConta: dados,
      contas: false,
      contaSelecionada: true,
    });
  };

  selecionarContaTelefone = (dados) => {
    try {
      this.setState({
        documento: dados.doc.cpf,
        favorecido: dados.dados.nome,
      });
    } catch (error) {
      this.setState({
        documento: dados.doc.CNPJ,
        favorecido: dados.dados.razao_social,
      });
    }
    this.setState({
      selecionarConta: dados,
      contaTelefone: false,
      contaSelecionada: true,
    });
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

      let chave = "";

      chave = texto;
      i = Object.keys(output);

      this.setState({ password: chave });
      if (chave == "") {
        this.setState({ loading: false });
        this.props.alerts("Erro", "Senha Incorreta", "warning");
      } else {
        if (this.state.OTP.length == 6) {
          this.Valida_token(this.state.OTP);
        } else {
          this.setState({ loading: false });
          this.props.alerts("Erro", "Preencha o token", "warning");
        }
      }
    }
  };

  gerarTransferencia = () => {
    this.setState({
      contas: false,
      loading: true,
    });
    let hoje = new Date().toLocaleDateString();

    var valor = this.state.valorTransferencia;
    valor = valor.replace(".", "");
    valor = valor.replace(".", "");
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");

    const saldo = this.state.saldoDigital;

    if (valor > saldo) {
      alert(i18n.t("transferencia.erroSaldo"));
      window.location.href = "/transferencia_interna";
    } else {
      setTimeout(() => {
        const dados = {
          url: "transferencia/nova",
          data: JSON.stringify({
            valor: valor,
            nome_banco: "000",
            agencia: this.state.selecionarConta.conta.agencia,
            digitoAg: "",
            conta: String(this.state.selecionarConta.conta.id),
            digito: String(this.state.selecionarConta.conta.digito),
            favorecido: this.state.favorecido,
            documento: this.state.documento,
            finalidade: "01",
            tipo_conta: "Conta corrente",
            salvar_favorecido: false,
            data_transferencia: hoje,
            conta_id: this.state.pessoa.conta_id,
            cobrar: 0,
            senha: this.state.password,
            token: this.state.OTP,
          }),
          method: "POST",
        };
        Funcoes.Geral_API(dados, true).then((res) => {
          if (res.error) {
            alert("Erro: " + res.message);
            window.location.href = "/transferencia_interna";
          } else {
            if (res.dados.mov_id) {
              Funcoes.comprovante_pdf(res.dados.mov_id);
            }
          }

          this.setState({ loading: false, token_app: false, contaSelecionada: false });
          this.props.alerts("Transação efetuada", "Comprovante instalado automaticamente.", "success");

          // if (res == 0) {
          //   // Código inválido
          //   alert("Erro na transferencia");
          //   window.location.href = "/transferencia_interna";
          //   // } else if (res == 203) {
          //   // Alerta pânico
          //   // alert('Código de barras inválido');
          //   // window.location.href = '/transferencia_interna'
          // } else if (res.error) {
          //   if (res.error == 1){
          //     alert("Erro: " + res.message);
          //     window.location.href = "/transferencia_interna";
          //   }
          // } else if (res == 2) {
          //   //*Sem saldo na conta
          //   alert("Saldo insuficiente");
          //   window.location.href = "/transferencia_interna";
          // } else if (res.dados) {
          //   if (res.dados.mov_id) {
          //   //*pagamento realizado
          //     Funcoes.comprovante_pdf(res.dados.mov_id);
          //   }
          // } else {
          //   //*algum erro não previsto
          //   alert("Processamento Invalido, Contate seu Gerente!");
          //   window.location.href = "/transferencia_interna";
          // }
        });
      }, 600);
    }
  };

  buscaTelefone = () => {
    let telefoneBusca = this.state.telefoneBusca;
    const data = {
      url: "conta/busca-por-telefone",
      data: {
        telefone: telefoneBusca.replace(/[^0-9]+/g, ""),
      },
      method: "POST",
    };
    Funcoes.Geral_API(data, true).then((res) => {
      let aux = Object.keys(res).length;
      var arr = [];
      Object.keys(res).forEach((key) => {
        arr.push(res[key]);
      });
      this.setState({ contasMultiplas: arr });
      if (aux > 0) {
        this.setState({ telefone: false, contaTelefone: true });
      } else {
        this.setState({ telefone: false });
        alert(i18n.t("transferencia.erroNumero"));
      }
    });
  };

  buscarCpf = () => {
    const data = {
      url: "conta/busca-por-documento",
      data: {
        documento: this.state.buscarCpf,
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      let aux = Object.keys(res).length;

      if (aux > 0) {
        try {
          this.setState({
            contasMultiplas: [
              {
                correntista: {
                  conta: {
                    agencia: res.conta.agencia,
                    id: res.conta.id,
                    digito: res.conta.digito,
                  },
                  dados: {
                    nome: res.correntista.dados.nome,
                    razao_social: res.correntista.dados.razao_social,
                    documento: res.correntista.doc.cpf,
                    mostrar: true,
                    imagem: res.correntista.dados.imageself,
                  },
                },
              },
            ],
          });
        } catch (error) {
          this.setState({
            contasMultiplas: [
              {
                correntista: {
                  conta: {
                    agencia: res.conta.agencia,
                    id: res.conta.id,
                    digito: res.conta.digito,
                  },
                  dados: {
                    nome: res.correntista.dados.razao_social,
                    documento: res.correntista.dados.CNPJ,
                    mostrar: false,
                    imagem: null,
                  },
                },
              },
            ],
          });
        }
        this.setState({
          conta: false,
          contas: true,
        });
      } else {
        alert(i18n.t("transferencia.erroDoc"));
      }
    });
  };

  buscarConta = () => {
    const data = {
      url: "conta/busca-por-agencia-e-conta",
      data: JSON.stringify({
        agencia: ("0000" + this.state.agenciaBusca).slice(-4),
        conta: ("0000000" + this.state.buscarConta).slice(-7),
        digito: this.state.buscarDigito,
      }),
      method: "POST",
    };
    Funcoes.Geral_API(data, true).then((res) => {
      if (Object.keys(res).length > 0) {
        try {
          this.setState({
            contasMultiplas: [
              {
                correntista: {
                  conta: {
                    agencia: res.conta.agencia,
                    id: res.conta.id,
                    digito: res.conta.digito,
                  },
                  dados: {
                    nome: res.correntista.dados.nome,
                    razao_social: res.correntista.dados.razao_social,
                    documento: res.correntista.doc.cpf,
                    mostrar: true,
                    imagem: res.correntista.dados.imageself,
                  },
                },
              },
            ],
          });
        } catch (error) {
          this.setState({
            contasMultiplas: [
              {
                correntista: {
                  conta: {
                    agencia: res.conta.agencia,
                    id: res.conta.id,
                    digito: res.conta.digito,
                  },
                  dados: {
                    nome: res.correntista.dados.razao_social,
                    documento: res.correntista.dados.CNPJ,
                    mostrar: false,
                    imagem: null,
                  },
                },
              },
            ],
          });
        }
        this.setState({
          conta: false,
          contas: true,
        });
      } else {
        alert(i18n.t("transferencia.erroDoc"));
      }
    });
  };

  input_Token = (id) => {
    if (id == 1) {
      this.setState({ inputToken: true, inputTokenQrcode: false });
    } else if (id == 2) {
      this.setState({ inputToken: false, inputTokenQrcode: true });
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
        if (res == true) {
          this.gerarTransferencia();
        } else {
          this.props.alerts("Erro", "Token inválido", "warning");
        }
      });
    }, 300);
  };

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
      if (res != 0) {
        this.setState({ valida_senha_ok: true });
      } else {
        this.setState({ valida_senha_ok: false });
      }
    });
  }; */

  maskaraInput = (value) => {
    value = value.replace(/[^\d]+/g, "");
    if (value.length <= 11) {
      this.setState({ mask: "999.999.999-99*" });
    } else {
      this.setState({ mask: "99.999.999/9999-99" });
    }
    this.setState({ buscarCpf: value });
  };

  comprovante_ver = (id) => {
    const data = {
      url: "conta/comprovante-pdf",
      data: { id: id, app: 1 },
      method: "POST",
    };

    Funcoes.Geral_API(data, true)
      .then((res) => {
        if (!res || !res.transferencia) {
          console.error("Dados inválidos ou ausentes.");
          return;
        }

        const transferencia = res.transferencia;
        const { dados_pagador, dados_recebedor, dados_transacao } =
          transferencia;

        const doc = new jsPDF();
        const startY = 20;
        const cellHeight = 10;
        let cursorY = startY;

        // Adiciona título
        doc.setFontSize(16);
        doc.text("Comprovante de Transferência", 10, cursorY);
        cursorY += 10;

        // Função para adicionar linhas com rótulo e valor
        const addRow = (label, value) => {
          doc.setFontSize(12);
          doc.text(`${label}:`, 10, cursorY);
          doc.text(value || "N/A", 70, cursorY);
          cursorY += cellHeight;
        };

        // Dados da transação
        doc.setFontSize(14);
        doc.text("Dados da Transação", 10, cursorY);
        cursorY += 10;

        addRow("Data", dados_transacao.data);
        addRow("Valor Pago", `R$ ${dados_transacao.valor_pago}`);
        addRow("Finalidade", dados_transacao.finalidade);
        addRow("ID Transação", dados_transacao.codigo_identificacao);
        addRow("Status", dados_transacao.status);

        cursorY += 10;

        // Dados do pagador
        doc.text("Dados do Pagador", 10, cursorY);
        cursorY += 10;

        addRow("Nome", dados_pagador.nome);
        addRow("Documento", dados_pagador.documento);
        addRow("Conta Origem", dados_pagador.conta_origem);
        addRow("Banco", dados_pagador.banco);
        addRow("Tipo", dados_pagador.tipo);

        cursorY += 10;

        // Dados do recebedor
        doc.text("Dados do Recebedor", 10, cursorY);
        cursorY += 10;

        addRow("Nome", dados_recebedor.nome);
        addRow("Conta Destino", dados_recebedor.conta_destino);
        addRow("Tipo de Conta", dados_recebedor.tipo_conta);
        addRow("Documento", dados_recebedor.documento);
        addRow("Banco", dados_recebedor.banco);

        // Salva o PDF
        doc.save("comprovante_transferencia.pdf");

        alert("transferencia realizada com Sucesso!");
        location.reload();
      })
      .catch((error) => {
        console.error("Erro na requisição ou ao gerar o PDF", error);
      });
  };

  getPass = async (data) => {
    this.setState({ password: data });
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

  closeModalTelefone = () => {
    this.setState({ telefone: false, telefoneBusca: "" });
  };

  closeModalCpf = () => {
    this.setState({ cpf: false, buscarCpf: "" });
  };

  closeModalConta = () => {
    this.setState({
      conta: false,
      buscarConta: "",
      buscarDigito: "",
      agenciaBusca: "",
    });
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
        }
      });
    }, 300);
  };

  render() {
    return (
      <div>
        <BannerTitle
          title={i18n.t("transferencia.transferencia")}
          img={Objetos.transferenciaImg}
        />

        <Container className="p-3 d-flex justify-content-center">
          <Col md={8} className="baseWindow px-5 py-4">
            <Row>
              <p
                className="mb-2 w-100 text-center"
                style={{ fontSize: "1.30em" }}
              >
                <strong>
                  {i18n.t("transferencia.textInterna", {
                    nome_banco: process.env.NOME_BANCO,
                  })}
                </strong>
              </p>
            </Row>
            <Row className="text-center px-3">
              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => this.setState({ conta: true })}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.transfBuscaConta}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">
                        {i18n.t("transferencia.btnBuscarConta")}
                      </p>
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => this.setState({ telefone: true })}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.transfBuscaTelefone}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">
                        {i18n.t("transferencia.btnBuscarTelefone")}
                      </p>
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => this.setState({ cpf: true })}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.transfBuscaCpf}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">
                        {i18n.t("transferencia.btnBuscarDocumento")}
                      </p>
                    </Col>
                  </Row>
                </Button>
              </Col>
            </Row>
          </Col>
        </Container>

        <Modal
          centered
          size="sm"
          show={this.state.telefone}
          onHide={() => this.closeModalTelefone()}
        >
          <Modal.Header closeButton>
            {i18n.t("transferencia.btnBuscarTelefone")}
          </Modal.Header>
          <Modal.Body className="py-3 px-5">
            <div>
              <div className="form-group">
                <label className="mb-2">
                  {i18n.t("transferencia.textTelefone")}
                </label>
                {/* {i18n.t('transferencia.btnBuscarTelefone')} */}
                <InputMask
                  onChange={(e) =>
                    this.setState({ telefoneBusca: e.target.value })
                  }
                  className="form-control"
                  required
                  mask="(99)99999-9999"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="">
            <Button
              onClick={() => this.buscaTelefone()}
              className="rounded-pill"
            >
              {i18n.t("transferencia.btnPesquisar")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          centered
          size="sm"
          show={this.state.cpf}
          onHide={() => this.closeModalCpf()}
        >
          <Modal.Header closeButton>
            {i18n.t("transferencia.btnBuscarDocumento")}
          </Modal.Header>
          <Modal.Body className="py-3 px-5">
            <div>
              <div className="form-group">
                <label className="mb-2">
                  {i18n.t("transferencia.textDocumento")}
                </label>
                <InputMask
                  className="form-control"
                  id="cpfBusca"
                  required
                  value={this.state.buscarCpf}
                  onChange={(event) => this.maskaraInput(event.target.value)}
                  mask={this.state.mask}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.buscarCpf()} className="rounded-pill">
              {i18n.t("transferencia.btnPesquisar")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          centered
          size="sm"
          show={this.state.conta}
          onHide={() => this.closeModalConta()}
        >
          <Modal.Header closeButton>
            {i18n.t("transferencia.btnBuscarConta")}
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="form-group">
                <label>{i18n.t("transferencia.textAgencia")}</label>
                <input
                  className="form-control"
                  id="agenciaBusca"
                  required
                  value={this.state.agenciaBusca}
                  type={"number"}
                  onChange={(e) =>
                    this.setState({ agenciaBusca: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>{i18n.t("transferencia.textConta")}</label>
                <input
                  className="form-control"
                  id="contaBusca"
                  required
                  value={this.state.buscarConta}
                  type={"number"}
                  onChange={(e) =>
                    this.setState({ buscarConta: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>{i18n.t("transferencia.textDigito")}</label>
                <input
                  className="form-control"
                  id="digitoBusca"
                  required
                  value={this.state.buscarDigito}
                  type={"number"}
                  onChange={(e) =>
                    this.setState({ buscarDigito: e.target.value })
                  }
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.buscarConta()} className="rounded-pill">
              {i18n.t("transferencia.btnPesquisar")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          centered
          animation={true}
          show={this.state.contas}
          onHide={() => {
            this.setState({ contas: false }),
              (window.location.href = "/transferencia_interna");
          }}
        >
          <Modal.Body>
            <Container className="text-center">
              <h5>{i18n.t("transferencia.textSelecionarConta")}</h5>
              {this.state.contasMultiplas.map((conta) => {
                if (
                  parseInt(this.state.pessoa.conta_id) !=
                  parseInt(conta.correntista.conta.id)
                ) {
                  return (
                    <button
                      key={conta.correntista.conta.id}
                      type="button"
                      className="btn btn-outline-secondary col-10 mt-1 text-left"
                      style={{ fontSize: "1.00em", color: "black" }}
                      onClick={() => this.selecionarConta(conta.correntista)}
                    >
                      {i18n.t("transferencia.nomeConta")}{" "}
                      {conta.correntista.dados.nome ||
                        conta.correntista.dados.razao_social}
                      <br></br>
                      {i18n.t("transferencia.agenciaConta")}{" "}
                      {conta.correntista.conta.agencia}
                      <br></br>
                      {i18n.t("transferencia.contaConta")}
                      {("0000000" + conta.correntista.conta.id).slice(-7)}-
                      {conta.correntista.conta.digito}
                      <br></br>
                      {conta.correntista.dados.mostrar ? (
                        <Image
                          style={{
                            width: "50px",
                            height: "50px",
                            float: "right",
                            margin: "-56px 0 0 0",
                          }}
                          src={
                            "data:image/png;base64," +
                            conta.correntista.dados.imagem
                          }
                          roundedCircle
                        />
                      ) : (
                        Objetos.transferenciaEmpresa
                      )}
                    </button>
                  );
                }
              })}
              <Col>
                <button
                  type="button"
                  className="btn btnTransfCancelar float-right mt-3"
                  onClick={() => {
                    this.setState({ contas: false }),
                      (window.location.href = "/transferencia_interna");
                  }}
                >
                  {i18n.t("transferencia.btnFechar")}
                </button>
              </Col>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal
          centered
          animation={true}
          show={this.state.contaTelefone}
          onHide={() => {
            this.setState({ contas: false }),
              (window.location.href = "/transferencia_interna");
          }}
        >
          <Modal.Body>
            <Container className="text-center">
              <h5>{i18n.t("transferencia.textSelecionarConta")}</h5>

              {this.state.contasMultiplas.map((conta) => {
                if (
                  parseInt(this.state.pessoa.conta_id) !=
                  parseInt(conta.correntista.conta.id)
                ) {
                  return (
                    <button
                      key={conta.correntista.conta.id}
                      type="button"
                      className="btn btn-outline-secondary col-10 mt-1 text-left"
                      style={{ fontSize: "1.00em", color: "black" }}
                      onClick={() =>
                        this.selecionarContaTelefone(conta.correntista)
                      }
                    >
                      {i18n.t("transferencia.nomeConta")}{" "}
                      {conta.correntista.dados.nome ||
                        conta.correntista.dados.razao_social}
                      <br></br>
                      {i18n.t("transferencia.agenciaConta")}{" "}
                      {conta.correntista.conta.agencia}
                      <br></br>
                      {i18n.t("transferencia.contaConta")}
                      {("0000000" + conta.correntista.conta.id).slice(-7)}-
                      {conta.correntista.conta.digito}
                      {conta.correntista.dados.CPNJ ? (
                        Objetos.transferenciaEmpresa
                      ) : (
                        <Image
                          style={{
                            width: "50px",
                            height: "50px",
                            float: "right",
                            margin: "-34px 0 0 0",
                          }}
                          src={
                            "data:image/png;base64," +
                            conta.correntista.dados.imageself
                          }
                          roundedCircle
                        />
                      )}
                    </button>
                  );
                }
              })}
              <Col>
                <button
                  type="button"
                  className="btn btnTransfCancelar float-right mt-3"
                  onClick={() => {
                    this.setState({ contaTelefone: false }),
                      (window.location.href = "/transferencia_interna");
                  }}
                >
                  {i18n.t("transferencia.btnFechar")}
                </button>
              </Col>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal
          centered
          animation={true}
          size="sm"
          show={this.state.contaSelecionada}
          onHide={() => {
            this.setState({ contaSelecionada: false }),
              (window.location.href = "/transferencia_interna");
          }}
        >
          <Modal.Body>
            <Alert style={{ fontSize: "13px" }} variant="secondary">
              <strong>
                <i>{i18n.t("transferencia.textDadosFavorecido")}</i>
              </strong>
              <br></br>
              {i18n.t("transferencia.nomeConta")}{" "}
              {this.state.selecionarConta.dados.nome ||
                this.state.selecionarConta.dados.razao_social}
              <br></br>
              {i18n.t("transferencia.agenciaConta")}{" "}
              {this.state.selecionarConta.conta.agencia} &nbsp;{" "}
              {i18n.t("transferencia.contaConta")}000000
              {this.state.selecionarConta.conta.id}-
              {this.state.selecionarConta.conta.digito}
              <br></br>
            </Alert>
            <hr></hr>
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
            <div>
              <div className="form-group ">
                <label>{i18n.t("transferencia.valor")}</label>
                <CurrencyInput
                  className="form-control"
                  decimalSeparator=","
                  thousandSeparator="."
                  value={this.state.valorTransferencia}
                  onChange={(valor) =>
                    this.setState({ valorTransferencia: valor })
                  }
                />
              </div>
              <button
                onClick={() => this.enviarToken()}
                className="btn btnTransfSucesso"
              >
                {i18n.t("transferencia.btnTransferir")}
              </button>
              <button
                type="button"
                className="btn btnTransfCancelar float-right"
                onClick={() => {
                  this.setState({ contaSelecionada: false }),
                    (window.location.href = "/transferencia_interna");
                }}
              >
                {i18n.t("transferencia.btnFechar")}
              </button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.token_app}
          onHide={() => {
            this.setState({ token_app: false }),
              (window.location.href = "/transferencia_interna");
          }}
        >
          <Modal.Body className="modalValidacao">
            <h2>{i18n.t("transferencia.titleModalValidacao")}</h2>
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
              </Row>
              <Container style={{ marginTop: "10px", padding: 0 }}>
                <hr />
                <h4>{i18n.t("transferencia.titleSenha")}</h4>
                <h6>{i18n.t("transferencia.textSenha")}</h6>
                <Row style={{ height: 70 }} className="token">
                  <Col className="col-md-10">
                    <Password passProp={this.getPass} />
                  </Col>
                </Row>
              </Container>
              <br />
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
                        }}
                        numInputs={6}
                        className="tokenValidacao"
                      />
                    </Col>
                  </Row>
                </Container>
              ) : null}
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
                      {Icones.TransfConta}
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
          centered
          onHide={() => this.closeModalComprovante()}
        >
          <Modal.Header closeButton>
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
      </div>
    );
  }
}
