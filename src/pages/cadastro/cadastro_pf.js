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
  FormCheck
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
import { UAParser } from 'ua-parser-js';
import { browserName } from "react-device-detect";
import Produtos from "../../constants/Produtos";
import i18n from "../../tradutor/tradutor"; import LangButton from "../../components/langButton/LangButton";
import Select from "react-select";
import * as Formatar from "../../constants/Formatar";
export default class CadastroPf extends Component {
  constructor() {
    super();
    this.state = {
      cadastro: '0',

      os: "",
      browser: "",
      cpu: "",
      identificador: "",

      ipUser: "",

      agencias: [],
      valueAgencia: {},
      cpf: "",
      termo: {},
      termoModal: false,

      nome:"",
      nomeMae: "",
      data: "",
      genero: {},
      generoStr: "",
      estadocivil: {},
      estadocivilStr: "",
      renda: "0.00",

      cep: "",
      cepLoading: false,
      cepModal: false,
      endereco: "",
      numero: "",
      complemento: "", 
      bairro: "",
      cidade: "",
      estado: "",

      selfie: "",
      comprovante: "",
      procuracao: "",
      politico: '0',

      email: "",
      emailLoading: false,
      tokenModal: false,
      token: "",
      email_validado: false,

      celular: "",
      celularLoading: false,
      smsModal: false,
      sms: "",
      celular_validado: false,

      senha1: "",
      senha2: "",

      tipodoc: {},

      doc: "",
      docverso: "",
      docnumero: "",
      docemissao: "",

      docorgao: "",
      docestado: {},
      docestadoStr: "",

      passpais: "",
      passnaci: "",
      passnatu: "",
      passtipo: "",
      passvalidade: "",

      statusModal: false,

      concluirModal: false,
      concluirLoading: false,

      geralLoading: false
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

    UAParser().withClientHints().then(result => {
      this.setState({ 
        os: result.os.name + ' ' + result.os.version,
        browser: result.browser.name + ' ' + result.browser.major,
        cpu: result.cpu.architecture,
      });
    });

    Funcoes.getUniqueToken().then((res) => {
      this.setState({ identificador: res });
    });
  };

  checkStatus = () => {
    const cpfSalvo = localStorage.getItem("cpf");
    const save = localStorage.getItem("savepf");
    const termoObj = localStorage.getItem("savepftermo");
    if (cpfSalvo && save && termoObj) {
      this.setState({ 
        cpf: cpfSalvo,
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
    localStorage.setItem("savepftermo", JSON.stringify(this.state.termo));
    localStorage.setItem("savepf", "1");
  }

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
          this.setState({ doc: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ doc: "" });
      }
    } else {
      this.setState({ doc: "" });
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
          this.setState({ docverso: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ docverso: "" });
      }
    } else {
      this.setState({ docverso: "" });
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
          this.setState({ selfie: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert(i18n.t("cadastroPj.alertArqFail"));
        this.setState({ selfie: "" });
      }
    } else {
      this.setState({ selfie: "" });
    }
  };

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

  validarCPF = async () => {
    this.setState({ geralLoading: true });
    const data = {
      url: "usuario/valida-cpf",
      data: {
        cpf: this.state.cpf,
        agencia: this.state.valueAgencia.value,
        tipo: "pf",
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      console.log(res);
      if (res == 1) {
        this.salvarDormente('agencia', this.state.valueAgencia.numero);
        localStorage.setItem("cpf", this.state.cpf);
        this.setState({ termoModal: true });
      } else {
        this.props.alerts("Erro", "CPF inválido, tente novamente", "warning");
      }
      this.setState({ geralLoading: false });
      
    });
  };

  consultarCEP = () => {
    const regex = /^\d{5}-\d{3}$/;
    if (regex.test(this.state.cep)) {
      const data = {
        url: 'utilitarios/cep',
        data: {
          cep: this.state.cep,
        },
        method: "POST",
      };
      Funcoes.Geral_API(data).then((res) => {
        if (res) {
          if (res.erro) {
            alert("CEP inválido, tente novamente");
            this.setState({ cepLoading: false });
          } else {
            this.setState({ 
              endereco: res.logradouro,
              complemento: res.complemento,
              bairro: res.bairro,
              cidade: res.localidade,
              estado: this.nomeParaSigla(res.estado),
              cepModal: true,
              cepLoading: false
            });
          }
        } else {
          this.setState({ cepLoading: false });
          alert("Erro ao consultar CEP, tente novamente");
        }
      });
    } else {
      this.setState({ cepLoading: false });
      alert("CEP inválido");
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
        "Tocantins": "TO"
    };

    return estados[estado] || "Estado não encontrado";
  };

  sms_envia = () => {
    this.setState({ celularLoading: true });
    const data = {
      url: "utilitarios/validacao-sms-envio",
      data: {
        telefone: this.state.celular
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res){
        this.setState({ smsModal: true });
      } else {
        alert("Erro ao enviar SMS.");
      }
      this.setState({ celularLoading: false });
    });
  };

  sms_valida = () => {
    this.setState({ celularLoading: true });
    const data = {
      url: "utilitarios/validacao-sms-confere",
      data: {
        telefone: this.state.celular,
        token: this.state.sms
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res){
        this.salvarDormente('celular', this.state.celular);
        this.setState({ smsModal: false, celular_validado: true });
      } else {
        alert("Código inválido.");
      }
      this.setState({ celularLoading: false });
    });
  }

  email_envia = () => {
    this.setState({ emailLoading: true });
    const data = {
      url: "utilitarios/validacao-email-envio",
      data: {
        email: this.state.email
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res) {
        this.setState({ tokenModal: true });
      } else {
        alert("Erro ao enviar Token.");
      }
      this.setState({ emailLoading: false });
    });
  };

  email_valida = () => {
    this.setState({ emailLoading: true });
    const data = {
      url: "utilitarios/validacao-email-confere",
      data: {
        email: this.state.email,
        token: this.state.token
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res) {
        this.salvarDormente('email', this.state.celular);
        this.setState({ tokenModal: false, email_validado: true });
      } else {
        alert("Token inválido.");
      }
      this.setState({ emailLoading: false });
    });
  }

  salvarDormente = (campo, valor) => {
    const data = {
      url: "dormente-pf/previa",
      data: {
        documento: this.state.cpf,
        campo: campo,
        valor: valor,
        aparelho: "",

        termoId: this.state.termo.id,
        ip: this.state.ipUser,
        token: this.state.identificador,
        aparelho: "IB: " + browserName,
        chave: this.state.termo.chave,

        so: this.state.os,
        brand: this.state.browser,
        model: this.state.cpu,
        identificador: this.state.identificador
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      // console.log('salvando campo ', campo, valor);
      if (!res) {
        alert("Falha ao cadastrar informações, tente novamente.");
        // alert("Falha ao cadastrar informações, tente novamente." + campo );
      }
    });
  }

  salvarInfo = () => {
    this.setState({ geralLoading: true });
    const dados = {
      cpf: this.state.cpf,
      nome: this.state.nome.trim(),
      nome_mae: this.state.nomeMae.trim(),
      data_nascimento: this.state.data + ' 00:00:00',
      sexo: this.state.generoStr,
      estado_civil: this.state.estadocivilStr,
      renda: this.state.renda,

      cep: this.state.cep,
      endereco: this.state.endereco,
      numero: this.state.numero,
      bairro: this.state.bairro,
      cidade: this.state.cidade,
      estado: this.state.estado,
      complemento: this.state.complemento,

      imageself: this.state.selfie,
      imagecomprovante: this.state.comprovante,
      politico: this.state.politico
    };

    Object.entries(dados).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        this.salvarDormente(key, value);
      }
    });

    localStorage.setItem("savepf", "2");
    this.setState({ 
      cadastro: "2",
      geralLoading: false,
    });
  }

  salvarEmailPhone = () => {
    this.setState({ geralLoading: true });
    const { email, celular }  = this.state;
    if (email.length > 0 && celular.length > 0) {
      this.salvarDormente('email', email);
      this.salvarDormente('celular', celular);
    }
    this.setState({ geralLoading: false });
  }

  salvarSenha = () => {
    this.setState({ geralLoading: true });
    const { senha1, senha2 }  = this.state;
    if (senha1.length == 6 && senha2.length == 6) {
      if (senha1 === senha2) {
        this.salvarDormente('senha', senha1);
        this.setState({ cadastro: "4" });
        localStorage.setItem("savepf", "4");
      } else {
        alert("As senhas não são iguais. Tente novamente.");
      }
    }
    this.setState({ geralLoading: false });
  }

  salvarDoc = () => {
    this.setState({ geralLoading: true });
    const tipo = this.state.tipodoc.value;

    const dados = {
      idoc: this.state.tipodoc.value,
      imagedoc: this.state.doc,
      imagedoc_verso: this.state.docverso,
    }

    if (tipo == '1') {
      dados['numerorg'] = this.state.docnumero;
      dados['datarg'] = this.state.docemissao;
      dados['orgaorg'] = this.state.docorgao;
      dados['ufrg'] = this.state.docestadoStr;
    } else if (tipo == '2') {
      dados['numerocnh'] = this.state.docnumero;
      dados['datacnh'] = this.state.docemissao;
      dados['orgaocnh'] = this.state.docorgao;
      dados['ufcnh'] = this.state.docestadoStr;
    } else if (tipo == '3') {
      dados['numero_passaporte'] = this.state.docnumero;
      dados['data_de_emissao_passaporte'] = this.state.docemissao;
      dados['pais_emissor_passaporte'] = this.state.passpais;
      dados['nacionalidade_passaporte'] = this.state.passnaci;
      dados['naturalidade_passaporte'] = this.state.passnatu;
      dados['tipo_passaporte'] = this.state.passtipo;
      dados['validade_passaporte'] = this.state.passvalidade;
    } else {
      alert('Erro: tipo de documento não selecionado');
      return;
    }

    Object.entries(dados).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        this.salvarDormente(key, value);
      }
    });

    this.setState({ 
      concluirModal: true,
      geralLoading: false
     })
  }

  concluir = () => {
    this.setState({ concluirLoading: true });
    const data = {
      url: "dormente-pf/concluir",
      data: {
        "documento": this.state.cpf,
        "nome_banco": process.env.NOME_BANCO,

        termoId: this.state.termo.id,
        ip: this.state.ipUser,
        token: this.state.identificador,
        aparelho: "IB: " + browserName,
        chave: this.state.termo.chave,

        so: this.state.os,
        brand: this.state.browser,
        model: this.state.cpu,
        identificador: this.state.identificador
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (!res) {
        alert("Falha ao cadastrar informações, tente novamente.");
      } else {
        localStorage.removeItem("cpf");
        localStorage.removeItem("savepf");
        alert("Cadastro realizado com sucesso, em até 3 dias sua conta sera aprovada");
        window.location.href = "/";
      }
      this.setState({ concluirLoading: false });
    });
  }

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
                  Retornar
                </Button>
              </li>
              
            </ul>
          </Container>

          <div className="h-80 d-flex align-items-center justify-content-center">

            <div className="cadastropj">
              { 
                (this.state.cadastro == "0") && ( <>

                  <h1 className="mb-2">
                    Iremos começar o cadastro da sua conta PF
                  </h1>
                  <hr className="divisoria" />

                  <FormGroup>
                    <label>Escolha a Agencia</label>

                    <Select
                      options={this.state.agencias.map((agencia) => ({
                        value: agencia.id,
                        label: agencia.numero + ' - ' + agencia.nome,
                        numero: agencia.numero
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
                    <label>Informe seu CPF ou passaporte</label>
                    <FormControl
                      value={Formatar.cpf_passaporte_mask(this.state.cpf)}
                      placeholder="CPF ou Passaporte"
                      style={{ height: 40, width: "100%" }}
                      maxLength={14}
                      onChange={(e) => {
                        this.setState({ cpf: (e.target.value).replace(/[^a-zA-Z0-9]/g, '') });
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
                          this.state.cpf.length < 11 ||
                          this.state.valueAgencia.numero == "" ||
                          this.state.valueAgencia.id == ""
                        }
                        onClick={ () => {
                          this.validarCPF();
                        }}
                      >
                        Continuar
                      </Button>

                    </> )
                  }



                </> )
              }

              {
                (this.state.cadastro == "1") && ( <>

                  <div>
                    <h1 className="mb-2">
                      Insira seus dados
                    </h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Nome completo</label>

                            <FormControl
                              value={this.state.nome}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                this.setState({ nome: e.target.value });
                              }}
                              disabled={this.state.geralLoading}
                            />

                          </FormGroup>
                        </Col>

                        {/* <Col className="m-2">
                          <FormGroup>
                            <label>CPF ou passaporte</label>

                            <FormControl
                              // value={Formatar.cpf_mask(this.state.cpf)}
                              value={this.state.cpf}
                              // placeholder="000.000.000-00"
                              style={{ height: 40, width: 300 }}
                              maxLength={14}
                              onChange={(e) => {
                                // const cpf = e.target.value.replace(/\D/g, "");
                                const cpf = e.target.value;
                                this.setState({ cpf });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col> */}

                        <Col className="m-2">
                          <FormGroup>
                            <label>Nome completo de sua mãe</label>
                            <FormControl
                              value={this.state.nomeMae}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ nomeMae: e.target.value })
                              }
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Data de nascimento</label>

                            <FormControl
                              type="date"
                              value={this.state.data}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                this.setState({ 
                                  data: e.target.value, 
                                })
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Gênero</label>

                            <Select
                              options={
                                [
                                  { label: "Masculino", value: "MASCULINO" },
                                  { label: "Feminino", value: "FEMININO" },
                                  { label: "Outros", value: "OUTROS" }
                                ]
                              }
                              placeholder="Selecione seu gênero"
                              value={this.state.genero}
                              onChange={(selectedOption) => {
                                this.setState({
                                  genero: selectedOption,
                                  generoStr: selectedOption.value
                                });
                              }}
                              isDisabled={this.state.geralLoading}

                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: 300,
                                  height: 40
                                })
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Estado civil</label>

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
                              placeholder="Selecione seu estado civil"
                              value={this.state.estadocivil}
                              onChange={(selectedOption) => {
                                this.setState({
                                  estadocivil: selectedOption,
                                  estadocivilStr: selectedOption.value
                                });
                              }}
                              isDisabled={this.state.geralLoading}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  width: 300,
                                  height: 40,
                                })
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Sua renda</label>

                            <FormControl
                              value={
                                new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                  minimumFractionDigits: 0,
                                }).format(this.state.renda)
                              }
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                console.log(this.state.renda);
                                this.setState({ renda: parseInt(e.target.value.replace(/\D/g, "")) });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>CEP</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                maxLength={9}
                                value={Formatar.cep_mask(this.state.cep)}
                                placeholder="00000-000"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ cep: e.target.value })
                                }}
                                disabled={this.state.geralLoading}
                              />

                              {
                                this.state.cepLoading ? ( <>

                                  <ReactLoading
                                    className="d-block m-auto"
                                    type={"spin"}
                                    color={"#00000"}
                                    width={"38px"}
                                    height={"40px"}
                                  />

                                </> ) : ( <>

                                  <Button
                                    className="ml-2"
                                    disabled={ 
                                      this.state.cep.length < 9 ||
                                      this.state.geralLoading
                                    }
                                    onClick={ () => {
                                      if (this.state.cep.length == 9) {
                                        this.setState({ cepLoading: true });
                                        this.consultarCEP();
                                      }
                                    }}
                                  >
                                    Pesquisar
                                  </Button>

                                </> )
                              }

                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="my-2 mx-4">
                          <FormGroup>
                            <label>Endereço</label>

                            <FormControl
                              value={
                                (this.state.endereco != "") ?
                                (
                                  this.state.endereco + ' ' + 
                                  this.state.numero + ', ' + 
                                  this.state.complemento + ((this.state.complemento == "") ? '' : ', ') +
                                  this.state.bairro + ', ' + 
                                  this.state.cidade + ' - ' + 
                                  this.state.estado
                                ) : ""
                              }
                              disabled
                              className="mr-auto"
                              style={{ height: 40, width: 600 }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>Selfie sua (PNG ou JPG)</label>
                            <div className="d-flex">
                              <Button 
                                className="mx-1"
                                onClick={ () => {
                                  this.inputRepSelfie.current.click() 
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Escolher arquivo
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepSelfie}
                              // className="d-block"
                              type="file" 
                              accept="image/png, image/jpeg" 
                              onChange={ (event) => this.uploadSelfie(event) } 
                            />

                            <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                              {
                                (this.state.selfie.length > 0) && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.selfie}`}
                                    style={{ maxHeight: '50px' }} 
                                  />
                                )
                              }
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>Foto do Comprovante de endereço (PNG ou JPG)</label>
                            <div className="d-flex">
                              <Button 
                                className="mx-1"
                                onClick={ () => {
                                  this.inputRepComprovante.current.click() 
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.comprovante == ''}
                                className="mx-1"
                                onClick={ () => {
                                  this.setState({ comprovante: '' });
                                  this.inputComprovante.current.value = "";
                                }}
                                disabled={this.state.geralLoading}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepComprovante}
                              // className="d-block"
                              type="file" 
                              accept="image/png, image/jpeg" 
                              onChange={ (event) => this.uploadComprovante(event) } 
                            />

                            <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                              {
                                (this.state.comprovante.length > 0) && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.comprovante}`}
                                    style={{ maxHeight: '50px' }} 
                                  />
                                )
                              }
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <FormCheck
                              id="politico"
                              label="Você é uma pessoa politicamente exposta?"
                              type="switch"
                              checked={this.state.politico == '1'}
                              onChange={ (event) => {
                                if (event.target.checked) {
                                  this.setState({ politico: '1' });
                                } else {
                                  this.setState({ politico: '0' });
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
                          this.state.nome.trim() == "" ||
                          this.state.cpf.length < 11 ||
                          this.state.nomeMae.trim() == "" ||
                          this.state.data == "" ||
                          this.state.generoStr == "" ||
                          this.state.estadocivilStr == "" ||
                          this.state.cep == "" ||
                          this.state.endereco == "" ||
                          this.state.numero == "" ||
                          this.state.bairro == "" ||
                          this.state.cidade == "" ||
                          this.state.estado == "" ||
                          this.state.selfie == ""
                        }
                        onClick={ () => {
                          this.salvarInfo();
                        }}
                      >
                        Continuar
                      </Button>

                    </> )
                  }

                </> )
              }

              {
                (this.state.cadastro == "2") && ( <>

                  <div>
                    <h1 className="mb-2">
                      Validação de E-mail e celular
                    </h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>

                        <Col className="m-2">
                          <FormGroup>
                            <label>E-mail</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                value={this.state.email}
                                placeholder="exemplo@mail.com"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) =>
                                  this.setState({ email: e.target.value })
                                }
                                disabled={this.state.geralLoading}
                              />

                              {
                                this.state.emailLoading ? ( <>

                                  <ReactLoading
                                    className="ml-2"
                                    type={"spin"}
                                    color={"#00000"}
                                    width={"38px"}
                                    height={"40px"}
                                  />

                                </> ) : ( <>

                                {
                                  !this.state.email_validado ? ( <>

                                    <Button
                                      className="ml-2"
                                      disabled={
                                        !this.state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                                      }
                                      onClick={ () => {
                                        this.email_envia();
                                      }}
                                    >
                                      Validar
                                    </Button>

                                  </> ) : ( <>

                                    <Icon.CheckCircle className="ml-3" style={{ fontSize: 40 }}/>

                                  </> )
                                }

                              </> )
                              }

                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Celular</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                value={this.state.celular}
                                placeholder="(00) 00000-0000"
                                style={{ height: 40, width: 300 }}
                                maxLength={15} // Limite do formato com máscara
                                onChange={(e) => {
                                  const rawValue = e.target.value;
                                  const numericValue = rawValue.replace(/\D/g, "");
                                  const formattedValue = Formatar.formatarTelefone(numericValue); // Reaplica a máscara

                                  this.setState({
                                    celular: numericValue.length > 0 ? formattedValue : "",
                                  });
                                }}
                                disabled={this.state.geralLoading}
                              />

                              {
                                this.state.celularLoading ? ( <>

                                  <ReactLoading
                                    className="ml-2"
                                    type={"spin"}
                                    color={"#00000"}
                                    width={"38px"}
                                    height={"40px"}
                                  />

                                </> ) : ( <>

                                {
                                  !this.state.celular_validado ? ( <>

                                    <Button
                                      className="ml-2"
                                      disabled={
                                        this.state.celular.length < 14
                                      }
                                      onClick={ () => {
                                        this.sms_envia();
                                      }}
                                    >
                                      Validar
                                    </Button>

                                  </> ) : ( <>

                                    <Icon.CheckCircle className="ml-3" style={{ fontSize: 40 }}/>

                                  </> )
                                }

                              </> )
                              }
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
                        onClick={ () => {
                          if (this.state.email_validado && this.state.celular_validado) {
                            this.salvarEmailPhone();
                            this.setState({ cadastro: "3" });
                            localStorage.setItem("savepf", "3");
                          }
                        }}
                      >
                        Continuar
                      </Button>

                    </> )
                  }

                </> )
              }

              {
                (this.state.cadastro == "3") && ( <>

                  <div>
                    <h1 className="mb-2">
                      Agora cadastre sua senha
                    </h1>
                    <div>
                      <span>
                        Dicas:
                      </span>

                      <ul className="ml-2">
                        <li>-a senha deve conter 6 números</li>
                        <li>-não use números sequenciais</li>
                        <li>-utilize, no máximo, 3 números repetidos</li>
                        <li>-evite usar seus dados pessoas</li>
                      </ul>
                    </div>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>Insira aqui sua senha</label>

                            <FormControl
                              type="password"
                              maxLength={6}
                              value={this.state.senha1}
                              style={{ height: 40, width: 300, textAlign: 'center' }}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(/\D/g, "");
                                this.setState({ senha1: numericValue });
                              }}
                              disabled={this.state.geralLoading}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Repita aqui sua senha</label>

                            <FormControl
                              type="password"
                              maxLength={6}
                              value={this.state.senha2}
                              style={{ height: 40, width: 300, textAlign: 'center' }}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(/\D/g, "");
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
                        Continuar
                      </Button>

                    </> )
                  }

                </> )
              }

              {
                (this.state.cadastro == "4") && ( <>

                  <div>
                    <h1 className="mb-2">
                      Precisamos de fotos de um documento seu
                      <br/>
                      Qual documento você usará para abrir sua conta?
                    </h1>
                    <hr className="divisoria" />

                    <div className="d-flex">
                      <Select
                        options={
                          [
                            { label: "RG", value: "1" },
                            { label: "CNH", value: "2" },
                            { label: "Passaporte", value: "3" }
                          ]
                        }
                        placeholder="Selecione seu tipo de documento"
                        className="m-auto"
                        value={this.state.tipodoc}
                        onChange={(selectedOption) => {
                          this.setState({
                            tipodoc: selectedOption,
                          });
                        }}

                        styles={{
                          control: (base) => ({
                            ...base,
                            width: 300,
                            height: 40
                          })
                        }}
                      />
                    </div>
                  </div>

                  <Button 
                    className="float-right mt-3"
                    disabled={
                      this.state.tipodoc == ""
                    }
                    onClick={ () => {
                      this.setState({ cadastro: "5" });
                    }}
                  >
                    Continuar
                  </Button>
                </> )
              }

              {
                (this.state.cadastro == "5") && ( <>

                  <div>
                    <h1 className="mb-2">
                      {
                        (this.state.tipodoc.value == '1') ?
                          (<>Preencha os dados de seu RG</>)

                        :
                        
                        (this.state.tipodoc.value == '2') ?
                          (<>Preencha os dados de sua CNH</>)

                        :

                        (this.state.tipodoc.value == '3') &&
                          (<>Preencha os dados de seu Passaporte</>)
                      }
                    </h1>
                    <hr className="divisoria" />

                    <div className="d-flex">
                      <Container>
                        <Row>
                          <Col className="m-2 border rounded">
                            <FormGroup>
                              <label>
                                {
                                  (this.state.tipodoc.value == '1') ?
                                    (<>Foto da frente de seu RG</>)

                                  :

                                  (this.state.tipodoc.value == '2') ?
                                    (<>Foto da frente de sua CNH</>)

                                  :

                                  (this.state.tipodoc.value == '3') &&
                                    (<>Foto de seu Passaporte</>)
                                  
                                }
                              </label>
                              <div className="d-flex">
                                <Button 
                                  className="mx-1"
                                  onClick={ () => {
                                    this.inputRepDoc.current.click();
                                  }}
                                  disabled={this.state.geralLoading}
                                >
                                  Escolher arquivo
                                </Button>
                              </div>

                              <input
                                ref={this.inputRepDoc}
                                // className="d-block"
                                type="file" 
                                accept="image/png, image/jpeg" 
                                onChange={ (event) => this.uploadDoc(event) } 
                              />

                              <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                                {
                                  (this.state.doc.length > 0) && (
                                    <img
                                      className="m-auto"
                                      src={`data:image/jpeg;base64,${this.state.doc}`}
                                      style={{ maxHeight: '50px' }} 
                                    />
                                  )
                                }
                              </div>
                            </FormGroup>
                          </Col>

                          <Col className="m-2 border rounded">
                            <FormGroup>
                              <label>
                                {
                                  (this.state.tipodoc.value == '1') ?
                                    (<>Foto do verso de seu RG</>)

                                  :

                                  (this.state.tipodoc.value == '2') ?
                                    (<>Foto do verso de sua CNH</>)

                                  :

                                  (this.state.tipodoc.value == '3') &&
                                    (<>Foto da página do visto</>)
                                }
                              </label>
                              <div className="d-flex">
                                <Button 
                                  className="mx-1"
                                  onClick={ () => {
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
                                onChange={ (event) => this.uploadDocVerso(event) } 
                              />

                              <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                                {
                                  (this.state.docverso.length > 0) && (
                                    <img
                                      className="m-auto"
                                      src={`data:image/jpeg;base64,${this.state.docverso}`}
                                      style={{ maxHeight: '50px' }} 
                                    />
                                  )
                                }
                              </div>
                            </FormGroup>
                          </Col>

                          <Col className="m-2">
                            <FormGroup>
                              <label>
                                {
                                  (this.state.tipodoc.value == '1') ?
                                    (<>Número de seu RG</>)

                                  :

                                  (this.state.tipodoc.value == '2') ?
                                    (<>Número de sua CNH</>)

                                  :

                                  (this.state.tipodoc.value == '3') &&
                                    (<>Número de seu Passaporte</>)
                                }
                              </label>

                              <FormControl
                                value={this.state.docnumero}
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ docnumero: e.target.value });
                                }}
                                disabled={this.state.geralLoading}
                              />
                            </FormGroup>
                          </Col>

                          <Col className="m-2">
                            <FormGroup>
                              <label>Data de emissão</label>

                              <FormControl
                                type="date"
                                value={this.state.docemissao}
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ docemissao: e.target.value });
                                }}
                                disabled={this.state.geralLoading}
                              />
                            </FormGroup>
                          </Col>

                          {
                            (this.state.tipodoc.value == '1' || this.state.tipodoc.value == '2') ?

                              ( <>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Órgão emissor</label>

                                    <FormControl
                                      value={this.state.docorgao}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({ docorgao: e.target.value });
                                      }}
                                      disabled={this.state.geralLoading}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Estado emissor</label>

                                    <Select
                                      options = {
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
                                          { label: "Tocantins", value: "TO" }
                                        ]
                                      }

                                      placeholder="Selecione o estado emissor"
                                      className="m-auto"
                                      value={this.state.docestado}
                                      onChange={(selectedOption) => {
                                        this.setState({
                                          docestado: selectedOption,
                                          docestadoStr: selectedOption.value
                                        });
                                      }}
                                      isDisabled={this.state.geralLoading}

                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          width: 300,
                                          height: 40
                                        })
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                              </> )

                            : (this.state.tipodoc.value == '3') &&

                              ( <>

                                 <Col className="m-2">
                                  <FormGroup>
                                    <label>País emissor</label>

                                    <FormControl
                                      value={this.state.passpais}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({ passpais: e.target.value });
                                      }}
                                      disabled={this.state.geralLoading}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Nacionalidade</label>

                                    <FormControl
                                      value={this.state.passnaci}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({ passnaci: e.target.value });
                                      }}
                                      disabled={this.state.geralLoading}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Naturalidade</label>

                                    <FormControl
                                      value={this.state.passnatu}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({ passnatu: e.target.value });
                                      }}
                                      disabled={this.state.geralLoading}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Tipo de Passaporte</label>

                                    <FormControl
                                      value={this.state.passtipo}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({ passtipo: e.target.value });
                                      }}
                                      disabled={this.state.geralLoading}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Data de validade</label>

                                    <FormControl
                                      type="date"
                                      value={this.state.passvalidade}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({ passvalidade: e.target.value });
                                      }}
                                      disabled={this.state.geralLoading}
                                    />
                                  </FormGroup>
                                </Col>

                              </> )
                          }
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
                          this.state.doc == "" ||
                          this.state.docverso == "" ||
                          this.state.docnumero == "" ||
                          this.state.docemissao == "" ||
                          (
                            (this.state.tipodoc.value == '1' || this.state.tipodoc.value == '2') ?
                              (this.state.docorgao == "" || this.state.docestadoStr == "")

                            :

                            (this.state.tipodoc.value == '3') &&
                              (
                                this.state.passpais == "" || 
                                this.state.passnaci == "" ||
                                this.state.passnatu == "" ||
                                this.state.passtipo == "" ||
                                this.state.passvalidade == ""
                              )
                          )
                        }
                        onClick={ () => {
                          // this.setState({ concluirModal: true });
                          this.salvarDoc();
                        }}
                      >
                        Continuar
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
              <Modal.Title>Aceite o termo para continuar</Modal.Title>
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
                  Declaro que li e aceito os termos de uso e de privacidade {process.env.NOME_BANCO}
                </Button>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              (O botão de aceitar está no final dos termos.)
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            size="lg"
            show={this.state.cepModal}
            onHide={() => this.setState({ cepModal: false, endereco: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" })}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirme se as informações de endereço estão corretas. Você pode editá-las se precisar.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col>
                    <FormGroup>
                      <label>CEP</label>
                      <FormControl
                        value={this.state.cep}
                        style={{ height: 40, width: 300 }}
                        disabled                     
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>Endereço</label>
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
                      <label>Número</label>
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
                      <label>Bairro</label>
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
                      <label>Estado</label>
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
                  if (this.state.numero == '' || this.state.endereco == '' || this.state.numero == '' || this.state.bairro == '' || this.state.cidade == '' || this.state.estado == '') {
                    alert('Por favor, complete o endereço de sua empresa.');
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
              <Modal.Title>Enviamos um código via SMS para seu número. Informe o código.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex">
                <input
                  value={this.state.sms}
                  style={{ height: 40, width: 100, textAlign: 'center' }}
                  className="m-auto"
                  maxLength={6}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    this.setState({ sms: numericValue.length > 0 ? numericValue : "" });
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
                Validar código
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
              <Modal.Title>Enviamos um token para seu e-mail. Informe o token.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex">
                <input
                  value={this.state.token}
                  style={{ height: 40, width: 100, textAlign: 'center' }}
                  className="m-auto"
                  maxLength={6}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    this.setState({ token: numericValue.length > 0 ? numericValue : "" });
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={ () => this.email_valida() }
              >
                Validar token
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
              <Container>
                Finalizar seu cadastro?
              </Container>
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
                    Sim
                  </Button>

                  <Button
                    className="ml-auto"
                    variant="primary"
                    onClick={() => {
                      this.setState({ concluirModal: false });
                    }}
                  >
                    Não
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
                {/* Deseja continuar o cadastro da conta do CPF {Formatar.cpf_mask(this.state.cpf)}? */}
                Deseja continuar o cadastro da conta do CPF/Passaporte {Formatar.cpf_passaporte_mask(this.state.cpf)}?
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex">
              <Button
                className="mr-auto"
                variant="primary"
                onClick={() => {
                  this.setState({ 
                    cadastro: localStorage.getItem("savepf"),
                    statusModal: false
                  });
                }}
              >
                Sim
              </Button>

              <Button
                className="ml-auto"
                variant="primary"
                onClick={() => {
                  this.setState({ statusModal: false, cpf: "" });
                  localStorage.removeItem("cpf");
                  localStorage.removeItem("savepf");
                }}
              >
                Não
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
