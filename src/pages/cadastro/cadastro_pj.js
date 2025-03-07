import React, { Component } from "react";
import "../../templates/style_cadastro.scss";
import {
  Modal,
  Container,
  Row,
  Col,
  Carousel,
  Button,
  ButtonGroup,
  FormControl,
  FormGroup,
  FormCheck,
} from "react-bootstrap";
import Icones from "../../constants/Icon";
import OtpInput from "react-otp-input";
import Objetos from "../../constants/Objetos";
import * as Funcoes from "../../constants/Funcoes";
import ReactLoading from "react-loading";
import * as Icon from "react-bootstrap-icons";
import {
  isIOS,
  isAndroid,
  isMobile,
  isBrowser,
  deviceType,
} from "react-device-detect";
import { UAParser } from "ua-parser-js";
import { browserName } from "react-device-detect";
import Produtos from "../../constants/Produtos";
import i18n from "../../tradutor/tradutor";
import LangButton from "../../components/langButton/LangButton";
import Select from "react-select";
import * as Formatar from "../../constants/Formatar";
import { toHumanSize } from "i18n-js";
export default class CadastroPj extends Component {
  constructor() {
    super();
    this.state = {
      cadastro: "0",

      os: "",
      browser: "",
      cpu: "",
      identificador: "",

      ipUser: "",

      agencias: [],
      valueAgencia: {},
      cnpj: "",
      termo: {},
      termoModal: false,
      celEmpresa: "",
      emailEmpresa: "",
      razaoSocial: "",
      nomeFantasia: "",
      inscricaoEstadual: "",
      faturamento: "",
      contribuicao: "",
      dataAbertura: "",
      cnae: "",

      cep: "",
      cepLoading: false,
      cepModal: false,
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",

      comprovante: "",
      cartao: "",
      contrato: "",

      rep_nome: "",
      rep_cpf: "",
      rep_nomeMae: "",
      rep_data: "",
      rep_genero: {},
      rep_generoStr: "",
      rep_estadocivil: {},
      rep_estadocivilStr: "",

      rep_cep: "",
      rep_cepLoading: false,
      rep_cepModal: false,
      rep_endereco: "",
      rep_numero: "",
      rep_complemento: "",
      rep_bairro: "",
      rep_cidade: "",
      rep_estado: "",

      rep_selfie: "",
      rep_comprovante: "",
      rep_procuracao: "",
      rep_politico: "0",

      rep_email: "",
      rep_emailLoading: false,
      tokenModal: false,
      token: "",
      email_validado: false,

      rep_celular: "",
      rep_celularLoading: false,
      smsModal: false,
      sms: "",
      celular_validado: false,

      senha1: "",
      senha2: "",

      rep_tipodoc: {},

      rep_doc: "",
      rep_docverso: "",
      rep_docnumero: "",
      rep_docemissao: "",

      rep_docorgao: "",
      rep_docestado: {},
      rep_docestadoStr: "",

      rep_passpais: "",
      rep_passnaci: "",
      rep_passnatu: "",
      rep_passtipo: "",
      rep_passvalidade: "",

      statusModal: false,

      concluirModal: false,
      concluirLoading: false,

      geralLoading: false,
    };

    this.inputComprovante = React.createRef();
    this.inputCartao = React.createRef();
    this.inputContrato = React.createRef();
    this.inputRepComprovante = React.createRef();
    this.inputRepProcuracao = React.createRef();
    this.inputRepSelfie = React.createRef();
    this.inputRepDoc = React.createRef();
    this.inputRepDocVerso = React.createRef();
  }

  componentDidMount = () => {
    this.agCadastro();
    this.buscarTermoUso();
    this.checkStatus();

    Funcoes.getUserIp().then((res) => {
      this.setState({ ipUser: res });
    });

    UAParser()
      .withClientHints()
      .then((result) => {
        this.setState({
          os: result.os.name + " " + result.os.version,
          browser: result.browser.name + " " + result.browser.major,
          cpu: result.cpu.architecture,
        });
      });

    Funcoes.getUniqueToken().then((res) => {
      this.setState({ identificador: res });
    });
  };

  checkStatus = () => {
    const cnpjSalvo = localStorage.getItem("cnpj");
    const save = localStorage.getItem("savepj");
    const termoObj = localStorage.getItem("savepjtermo");
    if (cnpjSalvo && save && termoObj) {
      this.setState({ 
        cnpj: cnpjSalvo,
        statusModal: true,
        termo: JSON.parse(termoObj),
      });
    }
  };

  agCadastro = () => {
    const data = {
      url: "agencia/lista",
      data: {},
      method: "GET",
    };
    Funcoes.Geral_API(data).then((res) => {
      this.setState({ agencias: res });
    });
  };

  buscarTermoUso = () => {
    const data = {
      url: "termos/texto",
      data: {
        chave: "termo_uso",
      },
      method: "POST",
    };

    Funcoes.Geral_API(data).then((res) => {
      this.setState({ termo: res });
    });
  };

  aceitaTermos = () => {
    this.setState({
      cadastro: "1",
      termoModal: false,
    });
    localStorage.setItem("savepjtermo", JSON.stringify(this.state.termo));
    localStorage.setItem("savepj", "1");
  }

  uploadComprovante = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({ comprovante: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ comprovante: "" });
      }
    } else {
      this.setState({ comprovante: "" });
    }
  };

  uploadCartao = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({ cartao: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ cartao: "" });
      }
    } else {
      this.setState({ cartao: "" });
    }
  };

  uploadContrato = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:application\/pdf;base64,/,
            ""
          );
          this.setState({ contrato: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFailType"));
        this.setState({ contrato: "" });
      }
    } else {
      this.setState({ contrato: "" });
    }
  };

  uploadDoc = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({ rep_doc: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ rep_doc: "" });
      }
    } else {
      this.setState({ rep_doc: "" });
    }
  };

  uploadDocVerso = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({ rep_docverso: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ rep_docverso: "" });
      }
    } else {
      this.setState({ rep_docverso: "" });
    }
  };

  uploadSelfie = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({ rep_selfie: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ rep_selfie: "" });
      }
    } else {
      this.setState({ rep_selfie: "" });
    }
  };

  uploadRepComprovante = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({ rep_comprovante: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ rep_comprovante: "" });
      }
    } else {
      this.setState({ rep_comprovante: "" });
    }
  };

  uploadProcuracao = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result;
          this.setState({ rep_procuracao: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFailType"));
        this.setState({ rep_procuracao: "" });
      }
    } else {
      this.setState({ rep_procuracao: "" });
    }
  };

  validarCNPJ = () => {
    this.setState({ geralLoading: true });
    const data = {
      url: "pessoajuridica/valida-cnpj",
      data: {
        cnpj: this.state.cnpj,
        agencia: this.state.valueAgencia.value,
        tipo: "pj",
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      console.log(res)
      if (res == 1) {
        this.salvarDormente("agencia", this.state.valueAgencia.numero);
        localStorage.setItem("cnpj", this.state.cnpj);
        this.setState({ termoModal: true });
      } else {
        this.props.alerts(i18n.t("cadastroPj.erro"), i18n.t("cadastroPj.cpnjFail"), "warning");
      }
      this.setState({ geralLoading: false }); 
    
    });
  };

  consultarCEP = () => {
    const regex = /^\d{5}-\d{3}$/;
    if (regex.test(this.state.cep)) {
      const data = {
        url: "utilitarios/cep",
        data: {
          cep: this.state.cep,
        },
        method: "POST",
      };
      Funcoes.Geral_API(data).then((res) => {
        if (res) {
          if (res.erro) {
            alert(i18n.t("cadastroPJ.cepInvalido"));
            this.setState({ cepLoading: false });
          } else {
            this.setState({
              endereco: res.logradouro,
              complemento: res.complemento,
              bairro: res.bairro,
              cidade: res.localidade,
              estado: this.nomeParaSigla(res.estado),
              cepModal: true,
              cepLoading: false,
            });
          }
        } else {
          this.setState({ cepLoading: false });
          alert(i18n.t("cadastroPJ.cepError"));
        }
      });
    } else {
      this.setState({ cepLoading: false });
      alert(i18n.t("cadastroPJ.cepInvalido"));
    }
  };

  nomeParaSigla = (estado) => {
    const estados = {
      "Acre": "AC",
      "Alagoas": "AL",
      "Amapá": "AP",
      "Amazonas": "AM",
      "Bahia": "BA",
      "Ceará": "CE",
      "Espírito Santo": "ES",
      "Goiás": "GO",
      "Maranhão": "MA",
      "Mato Grosso": "MT",
      "Mato Grosso do Sul": "MS",
      "Minas Gerais": "MG",
      "Pará": "PA",
      "Paraíba": "PB",
      "Paraná": "PR",
      "Pernambuco": "PE",
      "Piauí": "PI",
      "Rio de Janeiro": "RJ",
      "Rio Grande do Norte": "RN",
      "Rio Grande do Sul": "RS",
      "Rondônia": "RO",
      "Roraima": "RR",
      "São Paulo": "SP",
      "Santa Catarina": "SC",
      "São João do Sul": "SE",
      "Sergipe": "SE",
      "Tocantins": "TO",
    };

    return estados[estado] || "Estado não encontrado";
  };

  consultarRepCEP = () => {
    const regex = /^\d{5}-\d{3}$/;
    if (regex.test(this.state.rep_cep)) {
      const data = {
        url: "utilitarios/cep",
        data: {
          cep: this.state.rep_cep,
        },
        method: "POST",
      };
      Funcoes.Geral_API(data).then((res) => {
        if (res) {
          if (res.erro) {
            alert(i18n.t("cadastroPJ.cepInvalido"));
            this.setState({ rep_cepLoading: false });
          } else {
            this.setState({
              rep_endereco: res.logradouro,
              rep_complemento: res.complemento,
              rep_bairro: res.bairro,
              rep_cidade: res.localidade,
              rep_estado: this.nomeParaSigla(res.estado),
              rep_cepModal: true,
              rep_cepLoading: false,
            });
          }
        } else {
          this.setState({ rep_cepLoading: false });
          alert(i18n.t("cadastroPJ.cepError"));
        }
      });
    } else {
      this.setState({ rep_cepLoading: false });
      alert(i18n.t("cadastroPJ.cepInvalido"));
    }
  };

  sms_envia = () => {
    this.setState({ rep_celularLoading: true });
    const data = {
      url: "utilitarios/validacao-sms-envio",
      data: {
        telefone: this.state.rep_celular,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res) {
        this.setState({ smsModal: true });
      } else {
        alert(i18n.t("cadastroPJ.smsErro"));
      }
      this.setState({ rep_celularLoading: false });
    });
  };

  sms_valida = () => {
    this.setState({ rep_celularLoading: true });
    const data = {
      url: "utilitarios/validacao-sms-confere",
      data: {
        telefone: this.state.rep_celular,
        token: this.state.sms,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res) {
        this.salvarDormente("representante_celular", this.state.rep_celular);
        this.setState({ smsModal: false, celular_validado: true });
      } else {
        alert(i18n.t("cadastroPJ.codInvalido"));
      }
      this.setState({ rep_celularLoading: false });
    });
  };

  email_envia = () => {
    this.setState({ rep_emailLoading: true });
    const data = {
      url: "utilitarios/validacao-email-envio",
      data: {
        email: this.state.rep_email,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res) {
        this.setState({ tokenModal: true });
      } else {
        alert(i18n.t("cadastroPJ.erroToken"));
      }
      this.setState({ rep_emailLoading: false });
    });
  };

  email_valida = () => {
    this.setState({ rep_emailLoading: true });
    const data = {
      url: "utilitarios/validacao-email-confere",
      data: {
        email: this.state.rep_email,
        token: this.state.token,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res) {
        this.salvarDormente("representante_email", this.state.rep_celular);
        this.setState({ tokenModal: false, email_validado: true });
      } else {
        alert(i18n.t("cadastroPJ.tokenInvalido"));
      }
      this.setState({ rep_emailLoading: false });
    });
  };

  salvarDormente = (campo, valor) => {
    const data = {
      url: "dormente-pj/previa",
      data: {
        documento: this.state.cnpj,
        campo: campo,
        valor: valor,
        representante: 1,

        termoId: this.state.termo.id,
        ip: this.state.ipUser,
        token: this.state.identificador,
        aparelho: "IB: " + browserName,
        chave: this.state.termo.chave,

        so: this.state.os,
        brand: this.state.browser,
        model: this.state.cpu,
        identificador: this.state.identificador,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (!res) {
        alert(i18n.t("cadastroPJ.tokenInvalido"));
        // alert("Falha ao cadastrar informações, tente novamente." + campo );
      }
    });
  };

  salvarEmpresaInfo = () => {
    this.setState({ geralLoading: true });
    const dados = {
      telefone: this.state.celEmpresa.replace(/\s+/g, ""),
      email: this.state.emailEmpresa,
      razao_social: this.state.razaoSocial.trim(),
      nome_fantasia: this.state.nomeFantasia.trim(),
      inscricao_estadual: this.state.inscricaoEstadual.trim(),
      faturamento: this.state.faturamento.trim(),
      contribuicao: this.state.contribuicao,
      dataabertura: this.state.dataAbertura + " 00:00:00",
      cnae: this.state.cnae,

      cep: this.state.cep,
      endereco: this.state.endereco,
      numero: this.state.numero,
      bairro: this.state.bairro,
      cidade: this.state.cidade,
      estado: this.state.estado,
      complemento: this.state.complemento,

      imagecomprovante: this.state.comprovante,
      imagecnpj: this.state.cartao,
      imagecontrato: this.state.contrato,
    };

    Object.entries(dados).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        console.log(key, value);
        // this.salvarDormente(key, value);
      }
    });

    localStorage.setItem("savepj", "2");
    this.setState({ 
      cadastro: "2",
      geralLoading: false,
    });
  };

  salvarRepresentanteInfo = () => {
    this.setState({ geralLoading: true });
    const dados = {
      representante_nome: this.state.rep_nome.trim(),
      representante_cpf: this.state.rep_cpf,
      representante_nomemae: this.state.rep_nomeMae.trim(),
      representante_data_nascimento: this.state.rep_data + ' 00:00:00',
      representante_sexo: this.state.rep_generoStr,
      representante_estado_civil: this.state.rep_estadocivilStr,

      representante_cep: this.state.rep_cep,
      representante_endereco: this.state.rep_endereco,
      representante_numero: this.state.rep_numero,
      representante_bairro: this.state.rep_bairro,
      representante_cidade: this.state.rep_cidade,
      representante_estado: this.state.rep_estado,
      representante_complemento: this.state.rep_complemento,

      representante_imageself: this.state.rep_selfie,
      representante_imagecomprovante_endereco: this.state.rep_comprovante,
      representante_procuracao: this.state.rep_procuracao,
      politico: this.state.rep_politico,
    };

    Object.entries(dados).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        this.salvarDormente(key, value);
      }
    });

    localStorage.setItem("savepj", "3");
    this.setState({ 
      cadastro: "3",
      geralLoading: false
    });
  };

  salvarEmailPhone = () => {
    this.setState({ geralLoading: true });
    const { rep_email, rep_celular } = this.state;
    if (rep_email.length > 0 && rep_celular.length > 0) {
      this.salvarDormente("representante_email", rep_email);
      this.salvarDormente("representante_celular", rep_celular);
    }
    this.setState({ geralLoading: false });
  };

  salvarSenha = () => {
    this.setState({ geralLoading: true });
    const { senha1, senha2 } = this.state;
    if (senha1.length == 6 && senha2.length == 6) {
      if (senha1 === senha2) {
        this.salvarDormente("senha", senha1);
        this.setState({ cadastro: "5" });
        localStorage.setItem("savepj", "5");
      } else {
        alert("As senhas não são iguais. Tente novamente.");
      }
    }
    this.setState({ geralLoading: false });
  };

  salvarDoc = () => {
    this.setState({ geralLoading: true });
    const tipo = this.state.rep_tipodoc.value;

    const dados = {
      idoc: this.state.rep_tipodoc.value,
      representante_imagedoc: this.state.rep_doc,
      representante_imagedoc_verso: this.state.rep_docverso,
    };

    if (tipo == "1") {
      dados["representante_numerorg"] = this.state.rep_docnumero;
      dados["representante_datarg"] = this.state.rep_docemissao;
      dados["representante_orgaorg"] = this.state.rep_docorgao;
      dados["representante_ufrg"] = this.state.rep_docestadoStr;
    } else if (tipo == "2") {
      dados["representante_numerocnh"] = this.state.rep_docnumero;
      dados["representante_datacnh"] = this.state.rep_docemissao;
      dados["representante_orgaocnh"] = this.state.rep_docorgao;
      dados["representante_ufcnh"] = this.state.rep_docestadoStr;
    } else if (tipo == "3") {
      dados["numero_passaporte"] = this.state.rep_docnumero;
      dados["data_de_emissao_passaporte"] = this.state.rep_docemissao;
      dados["pais_emissor_passaporte"] = this.state.rep_passpais;
      dados["nacionalidade_passaporte"] = this.state.rep_passnaci;
      dados["naturalidade_passaporte"] = this.state.rep_passnatu;
      dados["tipo_passaporte"] = this.state.rep_passtipo;
      dados["validade_passaporte"] = this.state.rep_passvalidade;
    } else {
      alert("Erro: tipo de documento não selecionado");
      return;
    }

    Object.entries(dados).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        this.salvarDormente(key, value);
      }
    });

    this.setState({
      concluirModal: true,
      geralLoading: false
    })
  };

  concluir = () => {
    this.setState({ concluirLoading: true });
    const data = {
      url: "dormente-pj/concluir",
      data: {
        documento: this.state.cnpj,
        representante: 1,
        nome_banco: process.env.NOME_BANCO,

        termoId: this.state.termo.id,
        ip: this.state.ipUser,
        token: this.state.identificador,
        aparelho: "IB: " + browserName,
        chave: this.state.termo.chave,

        so: this.state.os,
        brand: this.state.browser,
        model: this.state.cpu,
        identificador: this.state.identificador,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (!res) {
        alert("Falha ao cadastrar informações, tente novamente.");
      } else {
        localStorage.removeItem("cnpj");
        localStorage.removeItem("savepj");
        alert("Cadastro realizado com sucesso, em até 3 dias sua conta sera aprovada");
        window.location.href = "/";
      }
    });
  };

  render() {
    if (deviceType == "browser") {
      return (
        <div className="login">
          <Container className="navbar navbar-fixed-top barra_superior">
            <div className="navbar-header">
              <div>{Objetos.logo_banco_login}</div>
            </div>
            <ul className="nav navbar-nav">
              <li>
                <Button onClick={() => (window.location.href = "/")}>
                {i18n.t("cadastroPj.retornar")}
                </Button>
              </li>
            </ul>
          </Container>

          <div className="h-80 d-flex align-items-center justify-content-center">
            <div className="cadastropj">
              {this.state.cadastro == "0" && (
                <>
                  <h1 className="mb-2">
                  {i18n.t("cadastroPj.cadastroStart")}
                  </h1>
                  <hr className="divisoria" />

                  <FormGroup>
                    <label>{i18n.t("cadastroPj.escolhaAg")}</label>

                    <Select
                      options={this.state.agencias.map((agencia) => ({
                        value: agencia.id,
                        label: agencia.numero + " - " + agencia.nome,
                        numero: agencia.numero,
                      }))}
                      placeholder="Agência"
                      onChange={(selectedOption) => {
                        this.setState({
                          valueAgencia: selectedOption,
                        });
                      }}
                      isSearchable
                      isDisabled={this.state.geralLoading}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>{i18n.t("cadastroPj.cnpjInforme")}</label>
                    <FormControl
                      value={Formatar.cnpj_mask(this.state.cnpj)}
                      placeholder="00.000.000/0000-00"
                      style={{ height: 40, width: "100%" }}
                      maxLength={18}
                      onChange={(e) => {
                        this.setState({ cnpj: (e.target.value).replace(/\D/g, '') });
                      }}
                      disabled={this.state.geralLoading}
                    />
                  </FormGroup>

                  {
                    this.state.geralLoading ? ( <>

                      <ReactLoading
                        className="float-right mt-3"
                        type={"spin"}
                        color={"#00000"}
                        width={"38px"}
                        height={"40px"}
                      />

                    </> ) : ( <>

                      <Button
                        className="float-right mt-3"
                        disabled={
                          this.state.cnpj.length < 14 ||
                          this.state.valueAgencia.numero == "" ||
                          this.state.valueAgencia.value == ""
                        }
                        onClick={() => {
                          this.validarCNPJ();
                        }}
                      >
                        {i18n.t("cadastroPj.btnContinuar")}
                  </Button>

                    </> )
                  }
                  
                </>
              )}

              {this.state.cadastro == "1" && (
                <>
                  <div>
                    <h1 className="mb-2">{i18n.t("cadastroPj.dadosEmpresa")}</h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informTel")}</label>

                            <FormControl
                              value={Formatar.formatarTelefone(this.state.celEmpresa)}
                              style={{ height: 40, width: 300 }}
                              placeholder="(00) 00000-0000"
                              maxLength={15}
                              onChange={(e) => {
                                this.setState({ celEmpresa: e.target.value });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informeEmail")}</label>

                            <FormControl
                              value={this.state.emailEmpresa}
                              placeholder="exemplo@mail.com"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ emailEmpresa: e.target.value })
                              }
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informeRazao")}</label>

                            <FormControl
                              value={this.state.razaoSocial}
                              placeholder={i18n.t("cadastroPj.placeholderRaz")}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ razaoSocial: e.target.value })
                              }
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informNomeFan")}</label>

                            <FormControl
                              value={this.state.nomeFantasia}
                              placeholder={i18n.t("cadastroPj.placeholderNomeFa")}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ nomeFantasia: e.target.value })
                              }
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>
                            {i18n.t("cadastroPj.informInscricao")}
                            </label>

                            <FormControl
                              value={this.state.inscricaoEstadual}
                              placeholder={i18n.t("cadastroPj.placeholderInscri")}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ inscricaoEstadual: e.target.value })
                              }
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informeFaturamento")}</label>

                            <FormControl
                              value={this.state.faturamento}
                              placeholder={i18n.t("cadastroPj.placeholderFatu")}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                const value = e.target.value;

                                const numericValue = value.replace(
                                  /[^0-9]/g,
                                  ""
                                );

                                const formattedValue = new Intl.NumberFormat(
                                  "pt-BR",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                ).format(numericValue / 100);

                                this.setState({ faturamento: formattedValue });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informeContri")}</label>

                            <Select
                              options={[
                                {
                                  label: "Sociedade Anônima - SA",
                                  value: "SA",
                                },
                                {
                                  label: "Sociedade Limitada - LTDA",
                                  value: "LTDA",
                                },
                                {
                                  label: "Sociedade Simples - SS",
                                  value: "SS",
                                },
                                { label: "Microempresa - ME", value: "ME" },
                                {
                                  label: "Empresa de Pequeno Porte - EPP",
                                  value: "EPP",
                                },
                                {
                                  label:
                                    "Empresário Individual - SOLE_PROPRIETOR",
                                  value: "SOLE_PROPRIETOR",
                                },
                                {
                                  label:
                                    "Empresa Individual de Responsabilidade - EIRELI",
                                  value: "EIRELI",
                                },
                                {
                                  label: "Microempreendedor Individual - MEI",
                                  value: "MEI",
                                },
                                {
                                  label:
                                    "Sociedade de Conta de Participação - SCP",
                                  value: "SCP",
                                },
                                {
                                  label: "Sociedade em Nome Coletivo - S/A",
                                  value: "S/A",
                                },
                                {
                                  label: "Sociedade em Comandita Simples",
                                  value: "SOCIEDADE EM COMANDITA SIMPLES",
                                },
                                {
                                  label: "Sociedade em Comandita por Ações",
                                  value: "SOCIEDADE EM COMANDITA POR ACOES",
                                },
                                {
                                  label:
                                    "Sociedade de Propósito Específico - SPE",
                                  value: "SPE",
                                },
                                { label: "Cooperativa", value: "COOPERATIVA" },
                                {
                                  label: "Consórcio de Empresas",
                                  value: "CONSORCIO DE EMPRESAS",
                                },
                                { label: "Associação", value: "ASSOCIACAO" },
                                { label: "Fundação", value: "FUNDACAO" },
                                {
                                  label: "Organização Não Governamental - ONG",
                                  value: "ONG",
                                },
                                {
                                  label: "Entidade Religiosa",
                                  value: "ENTIDADE RELIGIOSA",
                                },
                                {
                                  label:
                                    "Organização da Sociedade Civil de Interesse Público - OSCIP",
                                  value: "OSCIP",
                                },
                                { label: "Instituto", value: "INSTITUTO" },
                                { label: "Condomínio", value: "CONDOMÍNIO" },
                                {
                                  label: "Consórcio Público",
                                  value: "CONSORCIO PUBLICO",
                                },
                                {
                                  label: "Empreendedor Rural",
                                  value: "EMPREENDEDOR RURAL",
                                },
                                {
                                  label: "Entidade Sindical",
                                  value: "ENTIDADE SINDICAL",
                                },
                              ]}
                              placeholder={i18n.t("cadastroPj.placeholderContri")}
                              onChange={(selectedOption) => {
                                this.setState({
                                  contribuicao: selectedOption.value,
                                });
                              }}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: 300,
                                  height: 40,
                                }),
                              }}
                              isDisabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informDataAbertura")}</label>

                            <FormControl
                              type="date"
                              value={this.state.dataAbertura}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                this.setState({ dataAbertura: e.target.value });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informCNAE")}</label>

                            <FormControl
                              value={Formatar.cnae_mask(this.state.cnae)}
                              placeholder="0000-0/00"
                              style={{ height: 40, width: 300 }}
                              maxLength={9}
                              onChange={(e) =>
                                this.setState({ cnae: e.target.value })
                              }
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.informeCEPEmpresa")}</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                maxLength={9} // Limite do formato com máscara
                                value={Formatar.cep_mask(this.state.cep)}
                                placeholder="00000-000"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ cep: e.target.value });
                                }}
                                disabled={this.state.geralLoading}
                              />

                              {this.state.cepLoading ? (
                                <>
                                  <ReactLoading
                                    className="d-block m-auto"
                                    type={"spin"}
                                    color={"#00000"}
                                    width={"38px"}
                                    height={"40px"}
                                  />
                                </>
                              ) : (
                                <>
                                  <Button
                                    className="ml-2"
                                    disabled={
                                      this.state.cep.length < 9 ||
                                      this.state.geralLoading
                                    }
                                    onClick={() => {
                                      if (this.state.cep.length == 9) {
                                        this.setState({ cepLoading: true });
                                        this.consultarCEP();
                                      }
                                    }}
                                  >
                                    {i18n.t("cadastroPj.btnPesquisar")}
                                  </Button>
                                </>
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="my-2 mx-4">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.retornar")}</label>

                            <FormControl
                              value={
                                this.state.endereco != ""
                                  ? this.state.endereco +
                                    " " +
                                    this.state.numero +
                                    ", " +
                                    this.state.complemento +
                                    (this.state.complemento == "" ? "" : ", ") +
                                    this.state.bairro +
                                    ", " +
                                    this.state.cidade +
                                    " - " +
                                    this.state.estado
                                  : ""
                              }
                              disabled
                              className="mr-auto"
                              style={{ height: 40, width: 600 }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>
                            {i18n.t("cadastroPj.fotoComproEndereco")}
                            </label>
                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputComprovante.current.click();
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.comprovante == ""}
                                className="mx-1"
                                onClick={() => {
                                  this.setState({ comprovante: "" });
                                  this.inputComprovante.current.value = "";
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputComprovante}
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={(event) =>
                                this.uploadComprovante(event)
                              }
                            />

                            <div
                              className="d-flex p-2"
                              style={{ height: 50, width: 300 }}
                            >
                              {this.state.comprovante.length > 0 && (
                                <img
                                  className="m-auto"
                                  src={`data:image/jpeg;base64,${this.state.comprovante}`}
                                  style={{ maxHeight: "50px" }}
                                />
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.fotoCNPJ")}</label>

                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputCartao.current.click();
                                }}
                                disabled={this.state.geralLoading}
                              >
                                {i18n.t("cadastroPj.escolherArquivo")}
                              </Button>
                              <Button
                                active={this.state.cartao == ""}
                                className="mx-1"
                                onClick={() => {
                                  this.setState({ cartao: "" });
                                  this.inputCartao.current.value = "";
                                }}
                                disabled={this.state.geralLoading}
                              >
                                {i18n.t("cadastroPj.btnNaoTenho")}
                              </Button>
                            </div>

                            <input
                              ref={this.inputCartao}
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={(event) => this.uploadCartao(event)}
                            />

                            <div
                              className="d-flex p-2"
                              style={{ height: 50, width: 300 }}
                            >
                              {this.state.cartao.length > 0 && (
                                <img
                                  className="m-auto"
                                  src={`data:image/jpeg;base64,${this.state.cartao}`}
                                  style={{ maxHeight: "50px" }}
                                />
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>
                            {i18n.t("cadastroPj.contratoSocial")}
                            </label>

                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputContrato.current.click();
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Escolher arquivo
                              </Button>
                            </div>

                            <input
                              ref={this.inputContrato}
                              type="file"
                              accept="application/pdf"
                              onChange={(event) => this.uploadContrato(event)}
                            />

                            <div
                              className="d-flex p-2"
                              style={{ height: 50, width: 300 }}
                            >
                              {this.state.contrato.length > 0 && (
                                <h6>{i18n.t("cadastroPj.contratoCarregado")}</h6>
                              )}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Container>
                  </div>

                  {
                    this.state.geralLoading ? ( <>

                      <ReactLoading
                        className="float-right mt-3"
                        type={"spin"}
                        color={"#00000"}
                        width={"38px"}
                        height={"40px"}
                      />

                    </> ) : ( <>

                      <Button
                        className="float-right mt-3"
                        disabled={
                          this.state.celEmpresa.length < 14 ||
                          this.state.emailEmpresa == "" ||
                          this.state.razaoSocial.trim() == "" ||
                          this.state.nomeFantasia.trim() == "" ||
                          this.state.inscricaoEstadual.trim() == "" ||
                          this.state.faturamento.trim.length == "R$ 0,00" ||
                          this.state.contribuicao == "" ||
                          this.state.dataAbertura == "" ||
                          this.state.cnae == "" ||
                          this.state.cep == "" ||
                          this.state.endereco == "" ||
                          this.state.numero == "" ||
                          this.state.bairro == "" ||
                          this.state.cidade == "" ||
                          this.state.estado == "" ||
                          this.state.contrato == ""
                        }
                        onClick={() => {
                          this.salvarEmpresaInfo();
                        }}
                      >
                        {i18n.t("cadastroPj.btnContinuar")}
                      </Button>

                    </> )
                  }

                </>
              )}

              {this.state.cadastro == "2" && (
                <>
                  <div>
                    <h1 className="mb-2">
                    {i18n.t("cadastroPj.dadosRepresentante")}
                    </h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.nomeCompletoRepre")}</label>

                            <FormControl
                              value={this.state.rep_nome}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                this.setState({ rep_nome: e.target.value });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.cpfRepre")}</label>

                            <FormControl
                              value={Formatar.cpf_mask(this.state.rep_cpf)}
                              placeholder="000.000.000-00"
                              style={{ height: 40, width: 300 }}
                              maxLength={14}
                              onChange={(e) => {
                                const rep_cpf = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                this.setState({ rep_cpf });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.nomeMaeRepre")}</label>
                            <FormControl
                              value={this.state.rep_nomeMae}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ rep_nomeMae: e.target.value })
                              }
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.dataNascimentoRepre")}</label>

                            <FormControl
                              type="date"
                              value={this.state.rep_data}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                this.setState({
                                  rep_data: e.target.value,
                                });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.generoRepre")}</label>

                            <Select
                              options={[
                                { label: "Masculino", value: "MASCULINO" },
                                { label: "Feminino", value: "FEMININO" },
                                { label: "Outros", value: "OUTROS" },
                              ]}
                              placeholder="Selecione seu gênero"
                              value={this.state.rep_genero}
                              onChange={(selectedOption) => {
                                this.setState({
                                  rep_genero: selectedOption,
                                  rep_generoStr: selectedOption.value,
                                });
                              }}
                              isDisabled={this.state.geralLoading}

                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: 300,
                                  height: 40,
                                }),
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.estadoCivilRepre")}</label>

                            <Select
                              options={
                                [
                                  { label: "Solteiro", value: "Solteiro" },
                                  { label: "Casado", value: "Casado" },
                                  { label: "Separado", value: "Separado" },
                                  { label: "Divorciado", value: "Divorciado" },
                                  { label: "Viúvo", value: "Viúvo" },
                                  { label: "União Estável", value: "União Estável" },
                                ]
                              }
                              placeholder={i18n.t("cadastroPj.placeholderEstadoCivil")}
                              value={this.state.rep_estadocivil}
                              onChange={(selectedOption) => {
                                this.setState({
                                  rep_estadocivil: selectedOption,
                                  rep_estadocivilStr: selectedOption.value,
                                });
                              }}
                              isDisabled={this.state.geralLoading}

                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: 300,
                                  height: 40,
                                }),
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.cepRepresentante")}</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                maxLength={9}
                                value={Formatar.cep_mask(this.state.rep_cep)}
                                placeholder="00000-000"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ rep_cep: e.target.value });
                                }}
                                disabled={this.state.geralLoading}
                              />

                              {this.state.rep_cepLoading ? (
                                <>
                                  <ReactLoading
                                    className="d-block m-auto"
                                    type={"spin"}
                                    color={"#00000"}
                                    width={"38px"}
                                    height={"40px"}
                                  />
                                </>
                              ) : (
                                <>
                                  <Button
                                    className="ml-2"
                                    disabled={
                                      this.state.rep_cep.length < 9 ||
                                      this.state.geralLoading
                                    }
                                    onClick={() => {
                                      if (this.state.rep_cep.length == 9) {
                                        this.setState({ rep_cepLoading: true });
                                        this.consultarRepCEP();
                                      }
                                    }}
                                  >
                                    {i18n.t("cadastroPj.btnPesquisar")}
                                  </Button>
                                </>
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="my-2 mx-4">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.enderecoRepresentante")}</label>

                            <FormControl
                              value={
                                this.state.rep_endereco != ""
                                  ? this.state.rep_endereco +
                                    " " +
                                    this.state.rep_numero +
                                    ", " +
                                    this.state.rep_complemento +
                                    (this.state.rep_complemento == ""
                                      ? ""
                                      : ", ") +
                                    this.state.rep_bairro +
                                    ", " +
                                    this.state.rep_cidade +
                                    " - " +
                                    this.state.rep_estado
                                  : ""
                              }
                              disabled
                              className="mr-auto"
                              style={{ height: 40, width: 600 }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.selfieRepre")}</label>
                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputRepSelfie.current.click();
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Escolher arquivo
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepSelfie}
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={(event) => this.uploadSelfie(event)}
                            />

                            <div
                              className="d-flex p-2"
                              style={{ height: 50, width: 300 }}
                            >
                              {this.state.rep_selfie.length > 0 && (
                                <img
                                  className="m-auto"
                                  src={`data:image/jpeg;base64,${this.state.rep_selfie}`}
                                  style={{ maxHeight: "50px" }}
                                />
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>
                              Foto do Comprovante de endereço (PNG ou JPG)
                            </label>
                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputRepComprovante.current.click();
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.rep_comprovante == ""}
                                className="mx-1"
                                onClick={() => {
                                  this.setState({ rep_comprovante: "" });
                                  this.inputRepComprovante.current.value = "";
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepComprovante}
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={(event) =>
                                this.uploadRepComprovante(event)
                              }
                            />

                            <div
                              className="d-flex p-2"
                              style={{ height: 50, width: 300 }}
                            >
                              {this.state.rep_comprovante.length > 0 && (
                                <img
                                  className="m-auto"
                                  src={`data:image/jpeg;base64,${this.state.rep_comprovante}`}
                                  style={{ maxHeight: "50px" }}
                                />
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>
                            {i18n.t("cadastroPj.fotoProcuracaoRepre")}
                            </label>
                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputRepProcuracao.current.click();
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.rep_procuracao == ""}
                                className="mx-1"
                                onClick={() => {
                                  this.setState({ rep_procuracao: "" });
                                  this.inputRepProcuracao.current.value = "";
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepProcuracao}
                              type="file"
                              accept="application/pdf"
                              onChange={(event) => this.uploadProcuracao(event)}
                            />

                            <div
                              className="d-flex p-2"
                              style={{ height: 50, width: 300 }}
                            >
                              {this.state.rep_procuracao.length > 0 && (
                                <h6>{i18n.t("cadastroPj.procuraCarregada")}</h6>
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <FormCheck
                              id="rep_politico"
                              label="O Representante é uma pessoa politicamente exposta?"
                              type="switch"
                              checked={this.state.rep_politico == "1"}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  this.setState({ rep_politico: "1" });
                                } else {
                                  this.setState({ rep_politico: "0" });
                                }
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Container>
                  </div>

                  {
                    this.state.geralLoading ? ( <>

                      <ReactLoading
                        className="float-right mt-3"
                        type={"spin"}
                        color={"#00000"}
                        width={"38px"}
                        height={"40px"}
                      />

                    </> ) : ( <>

                      <Button
                        className="float-right mt-3"
                        disabled={
                          this.state.rep_nome.trim() == "" ||
                          this.state.rep_cpf.length != 11 ||
                          this.state.rep_nomeMae.trim() == "" ||
                          this.state.rep_data == "" ||
                          this.state.rep_generoStr == "" ||
                          this.state.rep_estadocivilStr == "" ||
                          this.state.rep_cep == "" ||
                          this.state.rep_endereco == "" ||
                          this.state.rep_numero == "" ||
                          this.state.rep_bairro == "" ||
                          this.state.rep_cidade == "" ||
                          this.state.rep_estado == "" ||
                          this.state.rep_selfie == ""
                        }
                        onClick={() => {
                          this.salvarRepresentanteInfo();
                        }}
                      >
                        {i18n.t("cadastroPj.btnContinuar")}
                      </Button>

                    </> )
                  }


                </>
              )}

              {this.state.cadastro == "3" && (
                <>
                  <div>
                    <h1 className="mb-2">
                    {i18n.t("cadastroPj.validacaoEmailECell")}
                    </h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.emailRepre")}</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                value={this.state.rep_email}
                                placeholder="exemplo@mail.com"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) =>
                                  this.setState({ rep_email: e.target.value })
                                }
                                disabled={this.state.geralLoading}
                              />

                              {this.state.rep_emailLoading ? (
                                <>
                                  <ReactLoading
                                    className="ml-2"
                                    type={"spin"}
                                    color={"#00000"}
                                    width={"38px"}
                                    height={"40px"}
                                  />
                                </>
                              ) : (
                                <>
                                  {!this.state.email_validado ? (
                                    <>
                                      <Button
                                        className="ml-2"
                                        disabled={
                                          !this.state.rep_email.match(
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                          )
                                        }
                                        onClick={() => {
                                          this.email_envia();
                                        }}
                                      >
                                        {i18n.t("cadastroPj.btnValidar")}
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Icon.CheckCircle
                                        className="ml-3"
                                        style={{ fontSize: 40 }}
                                      />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.cellRepre")}</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                value={this.state.rep_celular}
                                placeholder="(00) 00000-0000"
                                style={{ height: 40, width: 300 }}
                                maxLength={15} // Limite do formato com máscara
                                onChange={(e) => {
                                  const rawValue = e.target.value;
                                  const numericValue = rawValue.replace(
                                    /\D/g,
                                    ""
                                  );
                                  const formattedValue =
                                    Formatar.formatarTelefone(numericValue); // Reaplica a máscara

                                  this.setState({
                                    rep_celular:
                                      numericValue.length > 0
                                        ? formattedValue
                                        : "",
                                  });
                                }}
                                disabled={this.state.geralLoading}
                              />

                              {this.state.rep_celularLoading ? (
                                <>
                                  <ReactLoading
                                    className="ml-2"
                                    type={"spin"}
                                    color={"#00000"}
                                    width={"38px"}
                                    height={"40px"}
                                  />
                                </>
                              ) : (
                                <>
                                  {!this.state.celular_validado ? (
                                    <>
                                      <Button
                                        className="ml-2"
                                        disabled={
                                          this.state.rep_celular.length < 14
                                        }
                                        onClick={() => {
                                          this.sms_envia();
                                        }}
                                      >
                                        {i18n.t("cadastroPj.btnValidar")}
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Icon.CheckCircle
                                        className="ml-3"
                                        style={{ fontSize: 40 }}
                                      />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Container>
                  </div>

                  {
                    this.state.geralLoading ? ( <>

                      <ReactLoading
                        className="float-right mt-3"
                        type={"spin"}
                        color={"#00000"}
                        width={"38px"}
                        height={"40px"}
                      />

                    </> ) : ( <>

                      <Button
                        className="float-right mt-3"
                        disabled={
                          !this.state.email_validado || 
                          !this.state.celular_validado
                        }
                        onClick={() => {
                          if (
                            this.state.email_validado &&
                            this.state.celular_validado
                          ) {
                            this.salvarEmailPhone();
                            this.setState({ cadastro: "4" });
                            localStorage.setItem("savepj", "4");
                          }
                        }}
                      >
                        {i18n.t("cadastroPj.btnContinuar")}
                      </Button>

                    </> )
                  }

                </>
              )}

              {this.state.cadastro == "4" && (
                <>
                  <div>
                    <h1 className="mb-2">{i18n.t("cadastroPj.cadastreSenha")}</h1>
                    <div>
                      <span>dicaSenha:</span>

                      <ul className="ml-2">
                        <li>-{i18n.t("cadastroPj.dica1")}</li>
                        <li>-{i18n.t("cadastroPj.dica2")}</li>
                        <li>-{i18n.t("cadastroPj.dica3")}</li>
                        <li>-{i18n.t("cadastroPj.dica4")}</li>
                      </ul>
                    </div>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.insiraAqSenha")}</label>

                            <FormControl
                              type="password"
                              maxLength={6}
                              value={this.state.senha1}
                              style={{
                                height: 40,
                                width: 300,
                                textAlign: "center",
                              }}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(
                                  /\D/g,
                                  ""
                                );
                                this.setState({ senha1: numericValue });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>{i18n.t("cadastroPj.repitaAqSenha")}</label>

                            <FormControl
                              type="password"
                              maxLength={6}
                              value={this.state.senha2}
                              style={{
                                height: 40,
                                width: 300,
                                textAlign: "center",
                              }}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(
                                  /\D/g,
                                  ""
                                );
                                this.setState({ senha2: numericValue });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Container>
                  </div>

                  {
                    this.state.geralLoading ? ( <>

                      <ReactLoading
                        className="float-right mt-3"
                        type={"spin"}
                        color={"#00000"}
                        width={"38px"}
                        height={"40px"}
                      />

                    </> ) : ( <>

                      <Button 
                        className="float-right mt-3"
                        disabled={
                          this.state.senha1.length < 6 || 
                          this.state.senha2.length < 6
                        }
                        onClick={ () => {
                          this.salvarSenha()
                        }}
                      >
                        {i18n.t("cadastroPj.btnContinuar")}
                      </Button>

                    </> )
                  }

                </>
              )}

              {this.state.cadastro == "5" && (
                <>
                  <div>
                    <h1 className="mb-2">
                    {i18n.t("cadastroPj.precisaFotoDocumento")}
                      <br />
                      {i18n.t("cadastroPj.escolhaDocumento")}
                    </h1>
                    <hr className="divisoria" />

                    <div className="d-flex">
                      <Select
                        options={[
                          { label: "RG", value: "1" },
                          { label: "CNH", value: "2" },
                          // { label: "Passaporte", value: "3" },
                        ]}
                        placeholder="Selecione seu tipo de documento"
                        className="m-auto"
                        value={this.state.rep_tipodoc}
                        onChange={(selectedOption) => {
                          this.setState({
                            rep_tipodoc: selectedOption,
                          });
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: 300,
                            height: 40,
                          }),
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    className="float-right mt-3"
                    disabled={
                      this.state.rep_tipodoc == ""
                    }
                    onClick={() => {
                      this.setState({ cadastro: "6" });
                    }}
                  >
                    {i18n.t("cadastroPj.btnContinuar")}
                  </Button>
                </>
              )}

              {
                this.state.cadastro == "6" && ( <>

                  <div>
                    <h1 className="mb-2">
                      {this.state.rep_tipodoc.value == "1" ? (
                        <>{i18n.t("cadastroPj.preenchaRG")}</>
                      ) : this.state.rep_tipodoc.value == "2" ? (
                        <>{i18n.t("cadastroPj.preenchaCNH")}</>
                      ) : (
                        this.state.rep_tipodoc.value == "3" && (
                          <>{i18n.t("cadastroPj.fotoPagVisto")}</>
                        )
                      )}
                    </h1>
                    <hr className="divisoria" />

                    <div className="d-flex">
                      <Container>
                        <Row>
                          <Col className="m-2 border rounded">
                            <FormGroup>
                              <label>
                                {this.state.rep_tipodoc.value == "1" ? (
                                  <>Foto da frente de seu RG</>
                                ) : this.state.rep_tipodoc.value == "2" ? (
                                  <>Foto da frente de sua CNH</>
                                ) : (
                                  this.state.rep_tipodoc.value == "3" && (
                                    <>Foto de seu Passaporte</>
                                  )
                                )}
                              </label>
                              <div className="d-flex">
                                <Button
                                  className="mx-1"
                                  onClick={() => {
                                    this.inputRepDoc.current.click();
                                  }}
                                  disabled={this.state.geralLoading}
                                >
                                  Escolher arquivo
                                </Button>
                              </div>

                              <input
                                ref={this.inputRepDoc}
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={(event) => this.uploadDoc(event)}
                              />

                              <div
                                className="d-flex p-2"
                                style={{ height: 50, width: 300 }}
                              >
                                {this.state.rep_doc.length > 0 && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.rep_doc}`}
                                    style={{ maxHeight: "50px" }}
                                  />
                                )}
                              </div>
                            </FormGroup>
                          </Col>

                          <Col className="m-2 border rounded">
                            <FormGroup>
                              <label>
                                {this.state.rep_tipodoc.value == "1" ? (
                                  <>Foto do verso de seu RG</>
                                ) : this.state.rep_tipodoc.value == "2" ? (
                                  <>Foto do verso de sua CNH</>
                                ) : (
                                  this.state.rep_tipodoc.value == "3" && (
                                    <>Foto da página do visto</>
                                  )
                                )}
                              </label>
                              <div className="d-flex">
                                <Button
                                  className="mx-1"
                                  onClick={() => {
                                    this.inputRepDocVerso.current.click();
                                  }}
                                  disabled={this.state.geralLoading}
                                >
                                  Escolher arquivo
                                </Button>
                              </div>

                              <input
                                ref={this.inputRepDocVerso}
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={(event) => this.uploadDocVerso(event)}
                              />

                              <div
                                className="d-flex p-2"
                                style={{ height: 50, width: 300 }}
                              >
                                {this.state.rep_docverso.length > 0 && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.rep_docverso}`}
                                    style={{ maxHeight: "50px" }}
                                  />
                                )}
                              </div>
                            </FormGroup>
                          </Col>

                          <Col className="m-2">
                            <FormGroup>
                              <label>
                                {this.state.rep_tipodoc.value == "1" ? (
                                  <>{i18n.t("cadastroPj.numeroEnd")} de seu RG</>
                                ) : this.state.rep_tipodoc.value == "2" ? (
                                  <>{i18n.t("cadastroPj.numeroEnd")} de sua CNH</>
                                ) : (
                                  this.state.rep_tipodoc.value == "3" && (
                                    <>{i18n.t("cadastroPj.numeroEnd")} de seu Passaporte</>
                                  )
                                )}
                              </label>

                              <FormControl
                                value={this.state.rep_docnumero}
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({
                                    rep_docnumero: e.target.value,
                                  });
                                }}
                                disabled={this.state.geralLoading}
                              />
                            </FormGroup>
                          </Col>

                          <Col className="m-2">
                            <FormGroup>
                              <label>{i18n.t("cadastroPj.dataEmissao")}</label>

                              <FormControl
                                type="date"
                                value={this.state.rep_docemissao}
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({
                                    rep_docemissao: e.target.value,
                                  });
                                }}
                                disabled={this.state.geralLoading}
                              />
                            </FormGroup>
                          </Col>

                          <Col className="m-2">
                            <FormGroup>
                              <label>{i18n.t("cadastroPj.orgaoEmissor")}</label>

                              <FormControl
                                value={this.state.rep_docorgao}
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({
                                    rep_docorgao: e.target.value,
                                  });
                                }}
                                disabled={this.state.geralLoading}
                              />
                            </FormGroup>
                          </Col>

                          <Col className="m-2">
                            <FormGroup>
                              <label>Estado emissor</label>

                              <Select
                                options={
                                  [
                                    { label: "Acre", value: "AC" },
                                    { label: "Alagoas", value: "AL" },
                                    { label: "Amazonas", value: "AM" },
                                    { label: "Bahia", value: "BA" },
                                    { label: "Ceará", value: "CE" },
                                    { label: "Distrito Federal", value: "DF" },
                                    { label: "Espírito Santo", value: "ES" },
                                    { label: "Goiás", value: "GO" },
                                    { label: "Maranhão", value: "MA" },
                                    { label: "Mato Grosso", value: "MT" },
                                    { label: "Mato Grosso do Sul", value: "MS" },
                                    { label: "Minas Gerais", value: "MG" },
                                    { label: "Pará", value: "PA" },
                                    { label: "Paraíba", value: "PB" },
                                    { label: "Paraná", value: "PR" },
                                    { label: "Pernambuco", value: "PE" },
                                    { label: "Piauí", value: "PI" },
                                    { label: "Rio de Janeiro", value: "RJ" },
                                    { label: "Rio Grande do Norte", value: "RN" },
                                    { label: "Rio Grande do Sul", value: "RS" },
                                    { label: "Rondônia", value: "RO" },
                                    { label: "Roraima", value: "RR" },
                                    { label: "Santa Catarina", value: "SC" },
                                    { label: "São Paulo", value: "SP" },
                                    { label: "Sergipe", value: "SE" },
                                    { label: "Tocantins", value: "TO" },
                                  ]
                                }
                                placeholder="Selecione o estado emissor"
                                className="m-auto"
                                value={this.state.rep_docestado}
                                onChange={(selectedOption) => {
                                  this.setState({
                                    rep_docestado: selectedOption,
                                    rep_docestadoStr: selectedOption.value,
                                  });
                                }}
                                isDisabled={this.state.geralLoading}

                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    width: 300,
                                    height: 40,
                                  }),
                                }}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  </div>

                  {
                    this.state.geralLoading ? ( <>

                      <ReactLoading
                        className="float-right mt-3"
                        type={"spin"}
                        color={"#00000"}
                        width={"38px"}
                        height={"40px"}
                      />

                    </> ) : ( <>

                      <Button
                        className="float-right mt-3"
                        disabled={
                          this.state.rep_doc == "" ||
                          this.state.rep_docverso == "" ||
                          this.state.rep_docnumero == "" ||
                          this.state.rep_docemissao == "" ||
                          this.state.rep_docorgao == "" ||
                          this.state.rep_docestadoStr == ""
                        }
                        onClick={() => {
                          // this.setState({ concluirModal: true });
                          this.salvarDoc();
                        }}
                      >
                        {i18n.t("cadastroPj.btnContinuar")}
                      </Button>                     

                    </> )
                  }
                  
                </> )
              }
            </div>
          </div>

          <Modal
            centered
            size="lg"
            show={this.state.termoModal}
            onHide={() => this.setState({ termoModal: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>{i18n.t("cadastroPj.aceiteTermo")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container
                style={{
                  maxHeight: "400px", // Limita a altura do conteúdo para permitir o scroll
                  overflowY: "auto", // Adiciona barra de rolagem vertical
                }}
              >
                <div
                  style={{
                    color: "black",
                    WebkitTextFillColor: "black", // Para navegadores com preenchimento de texto
                    textAlign: "justify", // Alinha o texto de forma justificada (opcional)
                    fontSize: "16px", // Define a cor do texto como preto
                  }}
                  dangerouslySetInnerHTML={{ __html: this.state.termo.texto }}
                >
                </div>

                <Button
                  variant="primary"
                  onClick={ () => this.aceitaTermos() }
                >
                  {i18n.t("cadastroPj.btnAceiteTermo")}{" "}
                  {process.env.NOME_BANCO}
                </Button>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              ({i18n.t("cadastroPj.btnAceite")}.)
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            size="lg"
            show={this.state.cepModal}
            onHide={() =>
              this.setState({
                cepModal: false,
                endereco: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
              })
            }
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Confirme se as informações de endereço estão corretas. Você pode
                editá-las se precisar.
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.cepModal")}</label>
                      <FormControl
                        value={this.state.cep}
                        style={{ height: 40, width: 300 }}
                        disabled
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.endereco")}</label>
                      <FormControl
                        value={this.state.endereco}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const endereco = e.target.value.trim();
                          this.setState({ endereco });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.numeroDoc")}</label>
                      <FormControl
                        value={this.state.numero}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const numero = e.target.value.trim();
                          this.setState({ numero });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>Complemento</label>
                      <FormControl
                        value={this.state.complemento}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const complemento = e.target.value.trim();
                          this.setState({ complemento });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.bairroEnd")}</label>
                      <FormControl
                        value={this.state.bairro}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const bairro = e.target.value.trim();
                          this.setState({ bairro });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>Cidade</label>
                      <FormControl
                        value={this.state.cidade}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const cidade = e.target.value.trim();
                          this.setState({ cidade });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.estadoEnd")}</label>
                      <FormControl
                        value={this.state.estado}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const estado = e.target.value.trim();
                          this.setState({ estado });
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  if (
                    this.state.numero == "" ||
                    this.state.endereco == "" ||
                    this.state.numero == "" ||
                    this.state.bairro == "" ||
                    this.state.cidade == "" ||
                    this.state.estado == ""
                  ) {
                    alert(i18n.t("cadastroPj.completeEnd"));
                  } else {
                    this.setState({
                      cepModal: false,
                    });
                  }
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            size="lg"
            show={this.state.smsModal}
            onHide={() => this.setState({ smsModal: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>
              {i18n.t("cadastroPj.smsConfirm")}.
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex">
                <input
                  value={this.state.sms}
                  style={{ height: 40, width: 100, textAlign: "center" }}
                  className="m-auto"
                  maxLength={6}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    this.setState({
                      sms: numericValue.length > 0 ? numericValue : "",
                    });
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  this.sms_valida();
                }}
              >
                {i18n.t("cadastroPj.btnValidarCod")}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            size="lg"
            show={this.state.tokenModal}
            onHide={() => this.setState({ tokenModal: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>
              {i18n.t("cadastroPj.emailConfirm")}.
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex">
                <input
                  value={this.state.token}
                  style={{ height: 40, width: 100, textAlign: "center" }}
                  className="m-auto"
                  maxLength={6}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    this.setState({
                      token: numericValue.length > 0 ? numericValue : "",
                    });
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => this.email_valida()}>
              {i18n.t("cadastroPj.btnValidarToken")}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            size="lg"
            show={this.state.rep_cepModal}
            onHide={() =>
              this.setState({
                rep_cepModal: false,
                rep_endereco: "",
                rep_numero: "",
                rep_complemento: "",
                rep_bairro: "",
                rep_cidade: "",
                rep_estado: "",
              })
            }
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Confirme se as informações de endereço estão corretas. Você pode
                editá-las se precisar.
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.cepModal")}</label>
                      <FormControl
                        value={this.state.rep_cep}
                        style={{ height: 40, width: 300 }}
                        disabled
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.endereco")}</label>
                      <FormControl
                        value={this.state.rep_endereco}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const rep_endereco = e.target.value.trim();
                          this.setState({ rep_endereco });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.numeroDoc")}</label>
                      <FormControl
                        value={this.state.rep_numero}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const rep_numero = e.target.value.trim();
                          this.setState({ rep_numero });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>Complemento</label>
                      <FormControl
                        value={this.state.rep_complemento}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const rep_complemento = e.target.value.trim();
                          this.setState({ rep_complemento });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.bairroEnd")}</label>
                      <FormControl
                        value={this.state.rep_bairro}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const rep_bairro = e.target.value.trim();
                          this.setState({ rep_bairro });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.cidadeEnd")}</label>
                      <FormControl
                        value={this.state.rep_cidade}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const rep_cidade = e.target.value.trim();
                          this.setState({ rep_cidade });
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>{i18n.t("cadastroPj.estadoEnd")}</label>
                      <FormControl
                        value={this.state.rep_estado}
                        style={{ height: 40, width: 300 }}
                        onChange={(e) => {
                          const rep_estado = e.target.value.trim();
                          this.setState({ rep_estado });
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  if (
                    this.state.rep_numero == "" ||
                    this.state.rep_endereco == "" ||
                    this.state.rep_numero == "" ||
                    this.state.rep_bairro == "" ||
                    this.state.rep_cidade == "" ||
                    this.state.rep_estado == ""
                  ) {
                    alert(i18n.t("cadastroPj.estadoEndRep"));
                  } else {
                    this.setState({
                      rep_cepModal: false,
                    });
                  }
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            size="md"
            show={this.state.concluirModal}
            backdrop="static"
          >
            <Modal.Body>
              <Container>{i18n.t("cadastroPj.finalizarCadastro")}</Container>
            </Modal.Body>
            <Modal.Footer className="d-flex">
              {
                this.state.concluirLoading ? ( <>

                  <ReactLoading
                    className="m-auto"
                    type={"spin"}
                    color={"#00000"}
                    width={"38px"}
                    height={"40px"}
                  />

                </> ) : ( <> 

                  <Button
                    className="mr-auto"
                    variant="primary"
                    onClick={() => {
                      this.concluir();
                    }}
                  >
                    {i18n.t("cadastroPj.sim")}
                  </Button>

                  <Button
                    className="ml-auto"
                    variant="primary"
                    onClick={() => {
                      this.setState({ concluirModal: false });
                    }}
                  >
                    {i18n.t("cadastroPj.nao")}
                  </Button>

                </> )
              }
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            size="md"
            show={this.state.statusModal}
            backdrop="static"
          >
            <Modal.Body>
              <Container>
              {i18n.t("cadastroPj.ctnCadastro")}{" "}
                {Formatar.cnpj_mask(this.state.cnpj)}?
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex">
              <Button
                className="mr-auto"
                variant="primary"
                onClick={() => {
                  this.setState({
                    cadastro: localStorage.getItem("savepj"),
                    statusModal: false,
                  });
                }}
              >
                {i18n.t("cadastroPj.sim")}
              </Button>

              <Button
                className="ml-auto"
                variant="primary"
                onClick={() => {
                  this.setState({ statusModal: false, cnpj: "" });
                  localStorage.removeItem("cnpj");
                  localStorage.removeItem("savepj");
                }}
              >
                {i18n.t("cadastroPj.nao")}
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      );
    } else {
      if (isAndroid) {
        return (window.location.href = process.env.LOJA_GOOGLE);
      } else if (isIOS) {
        return (window.location.href = process.env.LOJA_APPLE);
      }
    }
  }
}
