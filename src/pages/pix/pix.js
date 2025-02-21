import React, { Component } from "react";
import "../../templates/style_cobrar.scss";
import {
  Container,
  Col,
  Button,
  Dropdown,
  Row,
  Modal,
  Image,
} from "react-bootstrap";
import Icones from "../../constants/Icon";
import OtpInput from "react-otp-input";
import CurrencyInput from "react-currency-input";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import * as Formatar from "../../constants/Formatar";
import Objetos from "../../constants/Objetos";
import * as Funcoes from "../../constants/Funcoes";
import ReactLoading from "react-loading";
import Password from "../../components/password/Password";
import QRCode from "react-qr-code";
import InputMask from "react-input-mask";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Produtos from "../../constants/Produtos";
import logo from "../../assets/images/logos/icon_logo.png"; // Importa a imagem
import i18n from "../../tradutor/tradutor";
import Select from "react-select";
export default class Pix extends Component {
  constructor() {
    super();
    this.state = {
      showModalPesquisa: false,
      pixPesquisa: {},
      chaveValue: "",
      showModalTransferencia: false,
      retornoConsulta: {
        chave: "",
        dados_bancarios: {
          nome: "",
          nome_banco: "",
          agencia: "",
          conta: "",
          documento: "",
        },
      },

      valor: 0,
      msg: "",
      saldo: 0,
      tarifa: 0,
      showModalComprovante: false,
      titleModalComprovante: "",
      comprovante_pdf: {},
      cpfPagador: "",
      nomePagador: "",

      chaves_disponiveis: {},
      minhas_chaves_pix: {},
      showModalChaves: false,
      showModalNovaChave: false,
      selectExcluirChave: {},
      showModalExcluirChave: false,

      showModalQr: false,
      showModalQrReceber: false,
      selectQrChave: {},
      valorQr: "",
      qrCopypaste: "",
      qrImg: "",

      loading: false,

      pessoa: [],

      password: ["", "", "", "", "", ""],

      contaGrupos: {},
      contaId: 0,
      contaIdReceber: 0,
    };
  }

  componentDidMount() {
    this.setState({
      contaGrupos: JSON.parse(localStorage.getItem("conta_grupos")),
    });
    this.SaldoConta();
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
  }

  ValidarChave = () => {
    this.enviarToken();
    this.setState({ loading: true });

    const pix = this.state.pixPesquisa;
    const chave = this.state.chaveValue;

    if (chave.length > 0) {
      switch (pix.code) {
        case "cpf":
          var chave_final = chave.replace(/[^0-9]+/g, "");
          this.pesquisarChave(chave_final);
          break;

        case "cnpj":
          var chave_final = chave.replace(/[^\d]+/g, "");
          this.pesquisarChave(chave_final);
          break;

        case "cel":
          var chave_final = "+55" + chave.replace(/[^\d]+/g, "");
          this.pesquisarChave(chave_final);
          break;

        case "email":
          var verifica = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (verifica.test(chave) === false) {
            this.setState({ loading: false });
            alert(i18n.t("pix.emailFail"));
            return false;
          } else {
            var chave_final = chave.toLowerCase();
            this.pesquisarChave(chave_final);
          }
          break;

        case "random":
          var chave_final = chave;
          this.pesquisarChave(chave_final);
          break;

        case "copy":
          var chave_final = chave;
          this.pesquisarChaveQR(chave_final);
          break;

        default:
          this.setState({ loading: false });
          alert("Erro");
      }
    } else {
      this.setState({ loading: false });
      alert(i18n.t("pix.dgtChave"));
    }
  };

  pesquisarChave = (chave_final) => {
    const dados = {
      url: "pix/pix/consultar-chave",
      method: "POST",
      funcao: "pesquisarChave",
      tela: "pix",
      data: {
        conta_id: this.state.pessoa.conta_id,
        chave_pix: chave_final,
      },
    };

    Funcoes.Geral_API(dados, true).then((responseJson) => {
      if (responseJson == 0) {
        this.setState({ loading: false });
        this.props.alerts("Erro interno", "", "warning");
      } else {
        if (responseJson.chave) {
          this.setState({ retornoConsulta: responseJson });
          setTimeout(() => {
            this.closeModalPesquisa();
            this.setState({ showModalTransferencia: true });
          }, 1000);
        } else {
          this.setState({ loading: false });
          alert(i18n.t("pix.chaveFail"));
        }
      }
    });
  };

  pesquisarChaveQR = (chave_final) => {
    const dados = {
      url: "pix/pix/consultar-qrcode",
      method: "POST",
      funcao: "pesquisarChave",
      tela: "pix",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
        emv: chave_final,
      },
    };

    Funcoes.Geral_API(dados, true).then((responseJson) => {
      if (responseJson == 0) {
        alert(i18n.t("pix.qrCodeFail"));
      } else {
        if (responseJson.chave) {
          this.setState({ retornoConsulta: responseJson });
          setTimeout(() => {
            this.closeModalPesquisa();
            this.setState({ showModalTransferencia: true });
          }, 1000);
        } else {
          this.setState({ loading: false });
          alert(i18n.t("pix.qrCodeFail"));
        }
      }
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
      this.setState({ password: chave });
      this.Valida_token(this.state.OTP);
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
          let valor_enviar = this.state.valor.replace("R$", "");
          valor_enviar = valor_enviar.replace(" ", "");
          valor_enviar = valor_enviar.replace(".", "");
          valor_enviar = valor_enviar.replace(",", ".");

          this.valor_tarifa(valor_enviar);
        } else {
          this.setState({ loading: false });
          this.props.alerts(
            i18n.t("pix.erro"),
            i18n.t("pix.tokenInvalido"),
            "warning"
          );
        }
      });
    }, 300);
  };

  SaldoConta = () => {
    const data = {
      url: "conta/saldo",
      data: { conta_id: Funcoes.pessoa.conta_id },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      this.setState({ saldo: res.digital });
    });
  };

  valor_tarifa = (valor_simulacao) => {
    const data = {
      url: "tarifa/consulta",
      data: {
        chave: "pix",
        conta_id: Funcoes.pessoa.conta_id,
        valor: valor_simulacao,
      },
      method: "POST",
      funcao: "valor_tarifa",
      tela: "pix",
    };

    Funcoes.Geral_API(data, true).then((responseJson) => {
      let tarifa = responseJson;

      let valor = this.state.valor;
      valor = valor.replace("R$", "")
      valor = valor.replace(" ", "");
      valor = valor.replace(".", "");
      valor = valor.replace(",", ".");

      var tarifado = parseFloat(tarifa) + parseFloat(valor);

      if (parseFloat(tarifado) > parseFloat(this.state.saldo)) {
        this.setState({ loading: false });
        alert(i18n.t("pix.saldoInsuficiente"));
      } else if (parseFloat(valor) > parseFloat(this.state.saldo)) {
        this.setState({ loading: false });
        alert(i18n.t("pix.saldoInsuficiente"));
      } else {
        this.gerar_transferencia();
      }
    });
  };

  gerar_transferencia = () => {
    let valor_enviar = this.state.valor.replace("R$", "");
    valor_enviar = valor_enviar.replace(" ", "");
    valor_enviar = valor_enviar.replace(".", "");
    valor_enviar = valor_enviar.replace(",", ".");

    let dados = {};
    if (
      this.state.contaGrupos &&
      this.state.contaGrupos !== "undefined" &&
      this.state.contaGrupos.length > 1
    ) {
      dados = {
        url: "pix/pix/enviar-pix",
        method: "POST",
        funcao: "pesquisarChave",
        tela: "pix",
        data: {
          valor: valor_enviar,
          mensagem: this.state.msg,
          dados_recebedor: {
            chave_pix: this.state.retornoConsulta?.chave,
            banco: this.state.retornoConsulta?.dados_bancarios.banco,
            conta: this.state.retornoConsulta?.dados_bancarios.conta,
            agencia: this.state.retornoConsulta?.dados_bancarios.agencia,
            documento: this.state.retornoConsulta?.dados_bancarios.documento,
            tipo_conta: this.state.retornoConsulta?.dados_bancarios.tipo_conta,
            nome: this.state.retornoConsulta?.dados_bancarios.nome,
          },
          conta_id: this.state.contaId.value,
          senha: this.state.password,
          token: this.state.OTP,
          type: this.state.retornoConsulta?.type,
          indentificador_transacao:
            this.state.retornoConsulta?.indentificador_transacao,
          end_to_end_id: this.state.retornoConsulta?.end_to_end_id,
          validation_code: this.state.retornoConsulta?.validation_code,
          tipo_pagamento_pix: this.state.retornoConsulta?.tipo_pagamento_pix,
          usuario_id: Funcoes.pessoa.usuario_id,
        },
      };
    } else {
      dados = {
        url: "pix/pix/enviar-pix",
        method: "POST",
        funcao: "pesquisarChave",
        tela: "pix",
        data: {
          valor: valor_enviar,
          mensagem: this.state.msg,
          dados_recebedor: {
            chave_pix: this.state.retornoConsulta?.chave,
            banco: this.state.retornoConsulta?.dados_bancarios.banco,
            conta: this.state.retornoConsulta?.dados_bancarios.conta,
            agencia: this.state.retornoConsulta?.dados_bancarios.agencia,
            documento: this.state.retornoConsulta?.dados_bancarios.documento,
            tipo_conta: this.state.retornoConsulta?.dados_bancarios.tipo_conta,
            nome: this.state.retornoConsulta?.dados_bancarios.nome,
          },
          conta_id: this.state.pessoa.conta_id,
          senha: this.state.password,
          token: this.state.OTP,
          type: this.state.retornoConsulta?.type,
          indentificador_transacao:
            this.state.retornoConsulta?.indentificador_transacao,
          end_to_end_id: this.state.retornoConsulta?.end_to_end_id,
          validation_code: this.state.retornoConsulta?.validation_code,
          tipo_pagamento_pix: this.state.retornoConsulta?.tipo_pagamento_pix,
          usuario_id: Funcoes.pessoa.usuario_id,
        },
      };
    }

    Funcoes.Geral_API(dados, true).then((responseJson) => {
      console.log(responseJson);
      if (responseJson.cod == 0) {
        this.closeModalTransferencia();
        alert(i18n.t("pix.pixCod0"));
      } else if (responseJson.cod == 1) {
        setTimeout(() => {
          alert(i18n.t("pix.pixCod1"));
          this.closeModalTransferencia();
          Funcoes.comprovanteGeral(responseJson.mov_id);
        }, 1000);
      } else if (responseJson.cod == 2) {
        this.AgendarPix();
      } else if (responseJson.cod == 3) {
        this.setState({ loading: false });

        this.closeModalTransferencia();
        alert(i18n.t("pix.pixCod3"));
      } else if (responseJson.cod == 4) {
        this.closeModalTransferencia();
        alert(responseJson.mensagem);
      } else if (responseJson.cod == 5) {
        this.closeModalTransferencia();
        alert(responseJson.mensagem);
      } else if (responseJson.cod == 6) {
        alert(responseJson.mensagem);
        this.closeModalTransferencia();
      } else if (responseJson.cod == 7) {
        alert(i18n.t("pix.pixCod7"));
        this.closeModalTransferencia();
      } else if (responseJson.cod == 9) {
        alert(i18n.t("pix.pixCod9"));
        this.closeModalTransferencia();
      } else if (responseJson.cod == 10) {
        alert(i18n.t("pix.pixCod10"));
        this.closeModalTransferencia();
      } else if (responseJson.cod == 11) {
        alert(responseJson.mensagem);
        this.closeModalTransferencia();
        location.reload();
      } else if (responseJson.cod == 100) {
        alert(i18n.t("pix.pixCod100"));
        this.closeModalTransferencia();
      } else {
        this.setState({ loading: false });
        alert(
          "PIX INDISPONÍVEL! Aguarde alguns minutos e tente novamente. Caso o problema continue, entre em contato com o suporte ao cliente para assistência."
        );
        location.href();
      }
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

  AgendarPix = () => {
    const dados = {
      url: "pix/pix/agendar-pix",
      method: "POST",
      funcao: "pesquisarChave",
      tela: "pix",
      data: {
        valor: this.state.valor,
        mensagem: this.state.msg,
        dados_recebedor: {
          chave_pix: this.state.retornoConsulta.chave,
          banco: this.state.retornoConsulta.dados_bancarios.banco,
          conta: this.state.retornoConsulta.dados_bancarios.conta,
          agencia: this.state.retornoConsulta.dados_bancarios.agencia,
          documento: this.state.retornoConsulta.dados_bancarios.documento,
          tipo_conta: this.state.retornoConsulta.dados_bancarios.tipo_conta,
          nome: this.state.retornoConsulta.dados_bancarios.nome,
        },
        data_hora: Formatar.formatarDateAnoHoraSegundo(new Date()),
        conta_id: Funcoes.pessoa.conta_id,
      },
    };

    Funcoes.Geral_API(dados, true).then((responseJson) => {
      if (responseJson == 1) {
        this.setState({ loading: false });
        alert(i18n.t("pix.agendarPixSucces"));
        window.location.reload();
      } else {
        this.setState({ loading: false });
        alert("Erro ao agendar pix.");
      }
    });
  };

  consultar_chaves_banco = () => {
    this.setState({ loading: true });
    const data = {
      url: "pix/pix/chaves-disponiveis",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
      },
      method: "GET",
      funcao: "consultar_chaves_banco",
      tela: "pix",
    };
    Funcoes.Geral_API(data, true).then((responseJson) => {
      this.setState({ chaves_disponiveis: responseJson });
      this.setState({ loading: false });
    });
  };

  consultar_chaves_cliente = () => {
    this.setState({ loading: true });
    const data = {
      url: "pix/pix/consultar-chaves",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
      },
      method: "POST",
      funcao: "consultar_chaves_cliente",
      tela: "pix",
    };
    Funcoes.Geral_API(data, true).then((responseJson) => {
      this.setState({ minhas_chaves_pix: responseJson });
      this.setState({ loading: false });
    });
  };

  criar_chave_pix = (tipo) => {
    this.setState({ loading: true });

    const data = {
      url: "pix/pix/criar-chave",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
        tipo: tipo,
        chave: "",
      },
      method: "POST",
      funcao: "criar_chave_pix",
      tela: "pix",
    };

    Funcoes.Geral_API(data, true).then((responseJson) => {
      if (responseJson.status == 200) {
        this.closeModalCriar();
        alert("Chave criada com sucesso");
        this.consultar_chaves_cliente();
      } else if (responseJson.status == 301) {
        this.setState({ showModalChaves: false });
        alert("Não conseguiu criar a chave");
      } else if (responseJson.status == 302) {
        this.setState({ showModalChaves: false });
        alert("Chave já cadastrada em outro banco");
      } else if (responseJson.status == 304) {
        this.setState({ showModalChaves: false });
        alert("O número limite de chaves é cinco");
      } else {
        this.setState({ showModalChaves: false });
        alert("Tente novamente mais tarde");
      }
    });
  };

  excluir_chave_pix = (dados) => {
    this.setState({ loading: true });
    const data = {
      url: "pix/pix/excluir-chave",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
        id: dados.id,
      },
      method: "POST",
      funcao: "excluir_chave_pix",
      tela: "pix",
    };

    Funcoes.Geral_API(data, true).then((responseJson) => {
      if (responseJson.status == 200) {
        alert("Chave excluída");
        this.closeModalExcluir();
      } else if (responseJson.status == 300) {
        alert("Não foi possível excluir a chave");
      }
    });
  };

  GerarQrRecebimento = () => {
    this.setState({ loading: true });

    var valor_qrcodeenviar = this.state.valorQr;

    if (valor_qrcodeenviar == "") {
      valor_qrcodeenviar = 0;
    } else {
      valor_qrcodeenviar = valor_qrcodeenviar.replace("R$ ", "");
      valor_qrcodeenviar = valor_qrcodeenviar.replace(".", "");
      valor_qrcodeenviar = valor_qrcodeenviar.replace(",", ".");
    }

    let dados = {};

    if (
      this.state.contaGrupos &&
      this.state.contaGrupos !== "undefined" &&
      this.state.contaGrupos.length > 1
    ) {
      dados = {
        url: "pix/pix/gera-qrcode-estatico",
        method: "POST",
        funcao: "pesquisarChave",
        tela: "pix",
        data: {
          nome_pagador: this.state.nomePagador,
          cpf_pagador: this.state.cpfPagador,
          conta_id: this.state.contaIdReceber.value,
          valor: valor_qrcodeenviar,
          pixels_modulo: 20,
          formato_imagem: "jpeg",
          chave_pix: this.state.selectQrChave.chave,
        },
      };
    } else {
      dados = {
        url: "pix/pix/gera-qrcode-estatico",
        method: "POST",
        funcao: "pesquisarChave",
        tela: "pix",
        data: {
          nome_pagador: this.state.nomePagador,
          cpf_pagador: this.state.cpfPagador,
          conta_id: Funcoes.pessoa.conta_id,
          valor: valor_qrcodeenviar,
          pixels_modulo: 20,
          formato_imagem: "jpeg",
          chave_pix: this.state.selectQrChave.chave,
        },
      };
    }

    Funcoes.Geral_API(dados, true).then((responseJson) => {
      if (responseJson != 0) {
        this.setState({ qrCopypaste: responseJson.copia_cola });

        setTimeout(() => {
          this.setState({ loading: false });
          this.closeModalQr();
          this.setState({ showModalQrReceber: true });
        }, 1000);
      } else {
        this.setState({ loading: false });
        alert("Erro na geração do QRcode.");
      }
    });
  };

  closeModalPesquisa = () => {
    this.setState({
      showModalPesquisa: false,
      pixPesquisa: {},
      chaveValue: "",
      loading: false,
    });
  };

  closeModalTransferencia = () => {
    this.setState({
      showModalTransferencia: false,
      loading: false,
      valor: 0,
      msg: "",
      chaveValue: "",
      OTP: "",
      password: ["", "", "", "", "", ""],
      password1: "",
      password2: "",
      password3: "",
      password4: "",
      password5: "",
      password6: "",
      senha1: [],
      senha2: [],
      mostrar_1: false,
      mostrar_2: false,
      mostrar_3: false,
      mostrar_4: false,
      mostrar_5: false,
      mostrar_6: false,
      bloco_1: [],
      bloco_2: [],
      bloco_3: [],
      bloco_4: [],
      bloco_5: [],
      bloco_6: [],
    });
  };

  closeModalExcluir = () => {
    this.setState({
      showModalExcluirChave: false,
      loading: false,
      selectExcluirChave: {},
    });
  };

  closeModalCriar = () => {
    this.setState({ showModalNovaChave: false, loading: false });
  };

  closeModalQr = () => {
    this.setState({
      showModalQr: false,
      loading: false,
      selectQrChave: {},
      valorQr: "",
      cpfPagador: "",
      nomePagador: "",
    });
  };

  closeModalQrReceber = () => {
    this.setState({
      showModalQrReceber: false,
      loading: false,
      qrImg: "",
      qrCopypaste: "",
      cpfPagador: "",
      nomePagador: "",
    });
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

  maskaraInput = (value) => {
    value = value.replace(/[^\d]+/g, "");
    if (value.length <= 11) {
      this.setState({ mask: "999.999.999-99*" });
    } else {
      this.setState({ mask: "99.999.999/9999-99" });
    }
    this.setState({ cpfPagador: value });
  };

  saldoContaId = (id) => {
    const data = {
      url: "conta/saldo",
      data: { conta_id: id },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      console.log(res);
      this.setState({ saldoConta: res.digital });
    });
  };

  render() {
    const pixTypesPagar = [
      // { title: 'QR Code' },
      {
        key: 1,
        title: "CPF",
        code: "cpf",
        msg: i18n.t("pix.msgChave") + "CPF",
        icon: Icones.documento,
        mask: Formatar.cpf_mask,
        type: "text",
      },
      {
        key: 2,
        title: "CNPJ",
        code: "cnpj",
        msg: i18n.t("pix.msgChave") + "CNPJ",
        icon: Icones.documento,
        mask: Formatar.cnpj_mask,
      },
      {
        key: 3,
        title: i18n.t("pix.celular"),
        code: "cel",
        msg: i18n.t("pix.msgCell"),
        icon: Icones.celular,
        mask: Formatar.cel_mask,
      },
      {
        key: 4,
        title: i18n.t("pix.email"),
        code: "email",
        msg: i18n.t("pix.msgEmail"),
        icon: Icones.email,
      },
      {
        key: 5,
        title: i18n.t("pix.chaveRandom"),
        code: "random",
        msg: i18n.t("pix.msgChaveRandom"),
        icon: Icones.chave,
      },
      {
        key: 6,
        title: i18n.t("pix.copyPaste"),
        code: "copy",
        msg: i18n.t("pix.msgCopy"),
        icon: Icones.copiacola,
      },
    ];

    return (
      <div>
        <BannerTitle title={"Pix"} img={Objetos.transferenciaImg} />

        <Container className="py-2 px-5">
          Pagar
          <Row>
            {pixTypesPagar.map((el) => (
              <Col key={el.key} sm={4} className="my-3">
                <Button
                  variant="outline-primary"
                  style={{ width: "200px", height: "100px" }}
                  onClick={() =>
                    this.setState({ showModalPesquisa: true, pixPesquisa: el })
                  }
                  // className="cobrarEscolha"
                >
                  <Container>
                    <Row>
                      <Col xs={4} className="align-self-center">
                        {el.icon}
                      </Col>
                      <Col xs={8}>
                        <p className="tituloBotoes">{el.title}</p>
                      </Col>
                    </Row>
                  </Container>
                </Button>
              </Col>
            ))}
          </Row>
          <br />
          Receber
          <Row>
            {Produtos.pix.chavePix ? (
              <Col key={0} sm={4} className="my-3">
                <Button
                  variant="outline-primary"
                  style={{ width: "200px", height: "100px" }}
                  onClick={() => {
                    this.consultar_chaves_cliente();
                    this.setState({ showModalChaves: true });
                  }}
                >
                  <Container>
                    <Row>
                      <Col xs={4} className="align-self-center">
                        {Icones.chave}
                      </Col>
                      <Col xs={8}>
                        <p className="tituloBotoes">Minhas Chaves</p>
                      </Col>
                    </Row>
                  </Container>
                </Button>
              </Col>
            ) : null}

            <Col key={1} sm={4} className="my-3">
              <Button
                variant="outline-primary"
                style={{ width: "200px", height: "100px" }}
                onClick={() => {
                  this.consultar_chaves_cliente();
                  this.setState({ showModalQr: true });
                }}
              >
                <Container>
                  <Row>
                    <Col xs={4} className="align-self-center">
                      {Icones.qrPix}
                    </Col>
                    <Col xs={8}>
                      <p className="tituloBotoes">
                        {i18n.t("pix.gerarQrCode")}
                      </p>
                    </Col>
                  </Row>
                </Container>
              </Button>
            </Col>
          </Row>
        </Container>

        <Modal
          show={this.state.showModalPesquisa}
          // show={true}
          centered
          onHide={() => this.closeModalPesquisa()}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {i18n.t("pix.modoPix")}: {this.state.pixPesquisa.title}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.state.loading ? (
              <ReactLoading
                className="d-block my-5 mx-auto"
                type={"spin"}
                color={"#00000"}
                height={"50px"}
              />
            ) : (
              <Container className="text-center">
                <Row className="p-3">
                  <Col>
                    <label>{this.state.pixPesquisa.msg}</label>
                  </Col>
                  <Col>
                    <input
                      type="text"
                      autoComplete="off"
                      value={this.state.chaveValue}
                      onChange={(event) => {
                        if (this.state.pixPesquisa.mask) {
                          const format = this.state.pixPesquisa.mask;
                          this.setState({
                            chaveValue: format(event.target.value),
                          });
                        } else {
                          this.setState({ chaveValue: event.target.value });
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Container>
            )}
          </Modal.Body>

          {this.state.loading ? null : (
            <Modal.Footer>
              <Button onClick={() => this.ValidarChave()}>
                {i18n.t("pix.pesquisar")}
              </Button>
            </Modal.Footer>
          )}
        </Modal>

        <Modal
          show={this.state.showModalTransferencia}
          // show={true}
          centered
          onHide={() => this.closeModalTransferencia()}
          size="xl"
        >
          <Modal.Body>
            <Modal.Header closeButton>
              <Modal.Title>{i18n.t("pix.transferPix")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container className="text-center py-3">
                {this.state.loading ? (
                  <ReactLoading
                    className="d-block my-5 mx-auto"
                    type={"spin"}
                    color={"#00000"}
                    height={"50px"}
                  />
                ) : (
                  <Row className="justify-content-center">
                    <Col>
                      <div className="pb-3">
                        <Row>
                          <Col className="text-right">
                            {i18n.t("pix.favorecido")}
                          </Col>
                          <Col className="text-left">
                            {this.state.retornoConsulta.dados_bancarios.nome ||
                              "String não populada"}
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-right">
                            {i18n.t("pix.banco")}
                          </Col>
                          <Col className="text-left">
                            {this.state.retornoConsulta.dados_bancarios
                              .nome_banco || "String não populada"}
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-right">
                            {i18n.t("pix.agConta")}
                          </Col>
                          <Col className="text-left">
                            {this.state.retornoConsulta.dados_bancarios
                              .agencia || "String não populada"}{" "}
                            |{" "}
                            {this.state.retornoConsulta.dados_bancarios.conta ||
                              "String não populada"}
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-right">{i18n.t("pix.doc")}</Col>
                          <Col className="text-left">
                            {this.state.retornoConsulta.dados_bancarios
                              .documento || "String não populada"}
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-right">
                            {i18n.t("pix.chavePix")}
                          </Col>
                          <Col className="text-left">
                            {this.state.retornoConsulta.chave ||
                              "String não populada"}
                          </Col>
                        </Row>
                      </div>

                      <div className="pt-3">
                        {this.state.contaGrupos &&
                        this.state.contaGrupos !== "undefined" &&
                        this.state.contaGrupos.length > 1 ? (
                          <>
                            <Row className="m-2">
                              <Col className="text-right">
                                <label>{i18n.t("home.conta")}</label>
                              </Col>
                              <Col className="text-left">
                                <Select
                                  options={
                                    Array.isArray(this.state.contaGrupos)
                                      ? this.state.contaGrupos.map((conta) => ({
                                          value: conta.conta_id,
                                          label:
                                            conta.conta_id +
                                            " " +
                                            conta.nome_conta,
                                        }))
                                      : []
                                  } // Verifica se contaGrupos é um array
                                  value={this.state.contaId}
                                  onChange={(selectedOption) => {
                                    this.setState({ contaId: selectedOption });
                                    this.saldoContaId(selectedOption.value);
                                    console.log(this.state.contaId);
                                  }}
                                  isSearchable
                                />
                              </Col>
                            </Row>

                            <Row className="m-2">
                              <Col className="text-right">
                                <label>
                                  {" "}
                                  {i18n.t("home.saldo") +
                                    " " +
                                    i18n.t("home.conta")}{" "}
                                </label>
                              </Col>
                              <Col className="text-left">
                                <span style={{ marginLeft: 10 }}>
                                  <input
                                    value={
                                      this.state.saldoConta
                                        ? "R$ " + ` ${this.state.saldoConta}`
                                        : i18n.t("home.saldoNull")
                                    }
                                    placeholder=" 00,00"
                                    disabled
                                  />
                                </span>
                              </Col>
                            </Row>
                          </>
                        ) : null}
                        <Row className="m-2">
                          <Col className="text-right">
                            <label>{i18n.t("pix.valPix")}</label>
                          </Col>
                          <Col className="text-left">
                            <CurrencyInput
                              // className="form-control"
                              decimalSeparator=","
                              thousandSeparator="."
                              prefix="R$ "
                              value={this.state.valor}
                              onChange={(event) => {
                                this.setState({ valor: event });
                              }}
                              style={{ width: "180px" }}
                              className="text-center"
                            />
                          </Col>
                        </Row>

                        <Row className="m-2">
                          <Col className="text-right">
                            <label>{i18n.t("pix.msg")}</label>
                          </Col>
                          <Col className="text-left">
                            <textarea
                              value={this.state.msg}
                              onChange={(event) =>
                                this.setState({ msg: event.target.value })
                              }
                              style={{ width: "180px" }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col>
                      <div className="pb-3">
                        <Row>
                          <span className="text-left">
                            {i18n.t("pix.dgtSenha")}
                          </span>
                        </Row>

                        <Row className="justify-content-center m-2">
                          <Password passProp={this.getPass} />
                        </Row>
                      </div>

                      <div>
                        <Row className="pt-3">
                          <span className="text-left">
                            {i18n.t("pix.tokenPix")}
                          </span>
                        </Row>
                        <Row className="justify-content-center m-2">
                          <OtpInput
                            focusInput={1}
                            isInputNum={true}
                            value={this.state.OTP}
                            onChange={(value) => {
                              this.setState({ OTP: value });
                            }}
                            numInputs={6}
                            containerStyle={{ justifyContent: "space-between" }}
                            inputStyle={{
                              fontSize: "18pt",
                              width: "55px",
                              height: "40px",
                              margin: "5px",
                            }}
                          />
                        </Row>
                      </div>
                    </Col>
                  </Row>
                )}
              </Container>
            </Modal.Body>

            {this.state.loading ? null : (
              <Modal.Footer>
                <Button
                  disabled={this.state.disabled}
                  onClick={() => {
                    if (
                      this.state.valor !== "R$ 0,00" ||
                      this.state.valor !== 0 ||
                      this.state.bloco_1 !== "" ||
                      this.state.bloco_2 !== "" ||
                      this.state.bloco_3 !== "" ||
                      this.state.bloco_4 !== "" ||
                      this.state.bloco_5 !== "" ||
                      this.state.bloco_6 !== "" ||
                      this.state.OTP.length == 6
                    ) {
                      this.combinacoes();
                    }
                  }}
                >
                  {i18n.t("pix.btnTransfer")}
                </Button>
              </Modal.Footer>
            )}
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

        <Modal
          show={this.state.showModalChaves}
          // show={true}
          centered
          onHide={() => this.setState({ showModalChaves: false })}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Minhas Chaves Pix</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container className="text-center">
              <Col>
                {this.state.loading ? (
                  <ReactLoading
                    className="d-block my-5 mx-auto"
                    type={"spin"}
                    color={"#00000"}
                    height={"50px"}
                  />
                ) : this.state.minhas_chaves_pix.length > 0 ? (
                  this.state.minhas_chaves_pix.map((chave) => (
                    <Row
                      key={chave.id}
                      style={{
                        border: "3px solid #daa521",
                        borderRadius: "25px",
                      }}
                      className="py-2 px-4 m-2"
                    >
                      <Col xs={10}>
                        <Row>Chave Pix {chave.tipo_chave}</Row>
                        <Row>{chave.chave}</Row>
                      </Col>

                      <Col xs={2}>
                        <Button
                          className="h-100"
                          onClick={() => {
                            this.setState({ selectExcluirChave: chave });
                            this.setState({
                              showModalChaves: false,
                              showModalExcluirChave: true,
                            });
                          }}
                        >
                          Excluir
                        </Button>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row
                    style={{
                      border: "3px solid #daa521",
                      borderRadius: "25px",
                    }}
                    className="py-2 px-4 m-2"
                  >
                    Nenhuma Chave Pix cadastrada no momento
                  </Row>
                )}
              </Col>
            </Container>
          </Modal.Body>

          {this.state.loading ? null : (
            <Modal.Footer>
              <Button
                onClick={() => {
                  this.setState({
                    showModalChaves: false,
                    showModalNovaChave: true,
                  });
                  this.consultar_chaves_banco();
                }}
              >
                Cadastrar Nova Chave
              </Button>
            </Modal.Footer>
          )}
        </Modal>

        <Modal
          show={this.state.showModalNovaChave}
          // show={true}
          centered
          onHide={() => this.closeModalCriar()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Criar Nova Chave Pix</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container className="text-center p-3">
              <Col>
                <Row className="mb-4">
                  Escolha o tipo de chave que deseja criar:
                </Row>

                {this.state.chaves_disponiveis.length > 0 &&
                !this.state.loading ? (
                  this.state.chaves_disponiveis.map((chave) => (
                    <Row
                      className="m-2"
                      key={this.state.chaves_disponiveis.indexOf(chave)}
                    >
                      <Button
                        className="w-100"
                        onClick={() => {
                          this.criar_chave_pix(chave);
                        }}
                      >
                        {chave === "aleatorio" ? (
                          <span>Chave Aleatória</span>
                        ) : (
                          <span>{chave}</span>
                        )}
                      </Button>
                    </Row>
                  ))
                ) : (
                  <ReactLoading
                    className="d-block my-5 mx-auto"
                    type={"spin"}
                    color={"#00000"}
                    height={"50px"}
                  />
                )}
              </Col>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showModalExcluirChave}
          // show={true}
          centered
          onHide={() => this.closeModalExcluir()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Deseja mesmo excluir esta Chave Pix?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container className="text-center">
              Chave Pix: {this.state.selectExcluirChave.chave}
              <br />
              <br />
              {this.state.loading ? (
                <ReactLoading
                  className="d-block my-5 mx-auto"
                  type={"spin"}
                  color={"#00000"}
                  height={"50px"}
                />
              ) : (
                <Row>
                  <Col>
                    <Button
                      onClick={() => {
                        this.excluir_chave_pix(this.state.selectExcluirChave);
                      }}
                    >
                      Sim
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => {
                        this.closeModalExcluir();
                        this.setState({ showModalChaves: true });
                      }}
                    >
                      Não
                    </Button>
                  </Col>
                </Row>
              )}
            </Container>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showModalQr}
          // show={true}
          centered
          onHide={() => this.closeModalQr()}
        >
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("pix.receberPix")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container className="p-3">
              {this.state.loading ? (
                <ReactLoading
                  className="d-block my-5 mx-auto"
                  type={"spin"}
                  color={"#00000"}
                  height={"50px"}
                />
              ) : (
                <div>
                  <Col className="mt-3 px-5">
                    <Row className="mb-5">
                      <div className="w-100">
                        <Dropdown>
                          <Dropdown.Toggle className="w-100">
                            {this.state.selectQrChave.chave ||
                              i18n.t("pix.selectKey")}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {this.state.minhas_chaves_pix.length > 0 ? (
                              this.state.minhas_chaves_pix.map((chave) => (
                                <Dropdown.Item
                                  onClick={() => {
                                    this.setState({ selectQrChave: chave });
                                  }}
                                  key={chave.id}
                                >
                                  {chave.chave}
                                </Dropdown.Item>
                              ))
                            ) : (
                              <div className="p-3">
                                <span>{i18n.t("pix.notKey")}</span>
                              </div>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Row>

                    {this.state.contaGrupos &&
                    this.state.contaGrupos !== "undefined" &&
                    this.state.contaGrupos.length > 1 ? (
                      <>
                        <Row className="mt-5">
                          <Col>
                            <label>{i18n.t("home.conta")}</label>
                          </Col>
                          <Col>
                            <Select
                              options={
                                Array.isArray(this.state.contaGrupos)
                                  ? this.state.contaGrupos.map((conta) => ({
                                      value: conta.conta_id,
                                      label:
                                        conta.conta_id + " " + conta.nome_conta,
                                    }))
                                  : []
                              } // Verifica se contaGrupos é um array
                              value={this.state.contaIdReceber}
                              onChange={(selectedOption) => {
                                this.setState({
                                  contaIdReceber: selectedOption,
                                });

                                console.log(this.state.contaIdReceber);
                              }}
                              isSearchable
                            />
                          </Col>
                        </Row>
                      </>
                    ) : null}

                    <Row className="mt-5">
                      <Col>
                        <label>{i18n.t("pix.valorQrCode")}</label>
                      </Col>
                      <Col>
                        <CurrencyInput
                          decimalSeparator=","
                          thousandSeparator="."
                          prefix="R$ "
                          value={this.state.valorQr}
                          onChange={(event) => {
                            this.setState({ valorQr: event });
                          }}
                          className="form-control"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-5">
                      <Col>
                        <label>{i18n.t("pix.nomePagador")}</label>
                      </Col>
                      <Col>
                        <input
                          type="text"
                          value={this.state.nomePagador}
                          onChange={(event) => {
                            this.setState({ nomePagador: event.target.value });
                          }}
                          className="form-control"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-5">
                      <Col>
                        <label>{i18n.t("pix.docPagador")}</label>
                      </Col>
                      <Col>
                        <InputMask
                          className="form-control"
                          id="cpfBusca"
                          required
                          value={this.state.cpfPagador}
                          onChange={(event) =>
                            this.maskaraInput(event.target.value)
                          }
                          mask={this.state.mask}
                        />
                      </Col>
                    </Row>
                  </Col>
                </div>
              )}
            </Container>
          </Modal.Body>

          {this.state.loading ? null : (
            <Modal.Footer>
              <Button onClick={this.GerarQrRecebimento}>
                {i18n.t("pix.btnGerarQrCode")}
              </Button>
            </Modal.Footer>
          )}
        </Modal>

        <Modal
          show={this.state.showModalQrReceber}
          // show={true}
          centered
          onHide={() => this.closeModalQrReceber()}
        >
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("pix.qrCodeSucces")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              <Col>
                <Row className="w-50 m-auto">
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={this.state.qrCopypaste}
                    viewBox={`0 0 256 256`}
                  />
                </Row>
                <Row style={{ fontSize: "9pt" }} className="p-2 text-center">
                  <span className="my-4" style={{ margin: "auto" }}>
                    {this.state.qrCopypaste
                      .replace(/(.{20})/g, "$1\n")
                      .split("\n")
                      .map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                  </span>
                  <Button
                    className="w-100"
                    onClick={() => {
                      navigator.clipboard.writeText(this.state.qrCopypaste);
                    }}
                  >
                    {i18n.t("pix.coyCod")}
                  </Button>
                </Row>
              </Col>
            </Container>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
