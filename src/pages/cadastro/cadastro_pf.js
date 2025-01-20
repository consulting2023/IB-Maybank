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
import Produtos from "../../constants/Produtos";
import i18n from "../../tradutor/tradutor"; import LangButton from "../../components/langButton/LangButton";
import Select from "react-select";
import * as Formatar from "../../constants/Formatar";
export default class CadastroPf extends Component {
  constructor() {
    super();
    this.state = {
      cadastro: '1',

      agencias: [],
      valueAgencia: {
        id: "",
        numero: "",
        nome: ""
      },
      cpf: "",
      termo: "",
      termoModal: false,

      nome:"",
      cpf: "",
      nomeMae: "",
      data: "",
      genero: "",
      estadocivil: "",

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

      concluirModal: false
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
    const cpf = localStorage.getItem("cpf");
    const save = localStorage.getItem("save");
    if (cpf && save) {
      this.setState({ cpf: cpf, statusModal: true });
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
      this.setState({ termo: res.texto });
    });
  };

  handleFocus = (nextInputRef) => {
    if (nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus();
    }
  };

  uploadComprovante = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf']; // Tipos válidos
  
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          let base64String = '';
  
          if (file.type === 'application/pdf') {
            // Para PDFs
            base64String = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
          } else {
            // Para imagens (PNG, JPEG)
            base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          }
  
          this.setState({
            comprovante: base64String,
          });
        };

        // Ler o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ comprovante: '' });
    }
  };

  uploadCartao = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      // Verifica se o arquivo é PNG ou JPG
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          cartao: '', // Limpa a imagem em caso de erro
        });
      } else {
        const reader = new FileReader();


        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            cartao: base64String,
          });
        };

        // Ler o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ cartao: '' });
    }
  };

  uploadContrato = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      const validTypes = ['application/pdf'];
  
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          let base64String = '';
  
          if (file.type === 'application/pdf') {
            // Para PDFs
            base64String = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
          } else {
            // Para imagens (PNG, JPEG)
            base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          }

          this.setState({
            contrato: base64String,
          });
  
        };
  
        // Escolhe o método de leitura com base no tipo
        if (file.type === 'application/pdf') {
          reader.readAsArrayBuffer(file); // PDFs precisam de ArrayBuffer
        } else {
          reader.readAsDataURL(file); // Imagens podem ser lidas como Data URL
        }
      } else {
        // Caso o arquivo seja inválido
        alert('Arquivo inválido. Apenas arquivos PDF são aceitos.');
        this.setState({
          contrato: '', // Limpa o estado em caso de erro
        });
      }
    } else {
      this.setState({ contrato: '' }); // Limpa o estado caso nenhum arquivo seja selecionado
    }
  };
  
  uploadDoc = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          doc: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            doc: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({doc: ''});
    }
  };

  uploadDocVerso = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          docverso: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            docverso: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({docverso: ''});
    }
  };

  uploadSelfie = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          selfie: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            selfie: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({selfie: ''});
    }
  };

  uploadRepComprovante = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          comprovante: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            comprovante: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({comprovante: ''});
    }
  };

  uploadProcuracao = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      const validTypes = ['application/pdf'];
  
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          let base64String = '';
  
          if (file.type === 'application/pdf') {
            // Para PDFs
            base64String = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
          } else {
            // Para imagens (PNG, JPEG)
            base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          }

          this.setState({
            procuracao: base64String,
          });
  
        };
  
        // Escolhe o método de leitura com base no tipo
        if (file.type === 'application/pdf') {
          reader.readAsArrayBuffer(file); // PDFs precisam de ArrayBuffer
        } else {
          reader.readAsDataURL(file); // Imagens podem ser lidas como Data URL
        }
      } else {
        // Caso o arquivo seja inválido
        alert('Arquivo inválido. Apenas arquivos PDF são aceitos.');
        this.setState({
          procuracao: '', // Limpa o estado em caso de erro
        });
      }
    } else {
      this.setState({ procuracao: '' }); // Limpa o estado caso nenhum arquivo seja selecionado
    }
  };

  validarCPF = () => {
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
      if (res.a == '0') {
        this.salvarDormente('agencia', this.state.valueAgencia.numero);
        localStorage.setItem("cpf", this.state.cpf);
        this.setState({ termoModal: true });
      } else if (res.a == '1') {
        this.props.alerts("Erro", "CPF inválido, tente novamente", "warning");
      } else if (res.a == '2') {
        this.props.alerts("Erro", "CPF já cadastrado", "warning");
      }
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

  consultarRepCEP = () => {
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

        so: this.state.os,
        brand: this.state.browser,
        model: this.state.cpu,
        identificador: this.state.identificador
      },
      method: "POST",
    };
    console.log(data);
    Funcoes.Geral_API(data).then((res) => {
      if (!res) {
        // alert("Falha ao cadastrar informações, tente novamente.");
        alert("Falha ao cadastrar informações, tente novamente." + campo );
      }
    });
  }

  salvarInfo = () => {
    const dados = {
      nome: this.state.nome.trim(),
      cpf: this.state.cpf,
      nome_mae: this.state.nomeMae.trim(),
      data_nascimento: this.state.data + ' 00:00:00',
      sexo: this.state.genero.value,
      estado_civil: this.state.estadocivil.label,

      cep: this.state.cep,
      endereco: this.state.endereco,
      numero: this.state.numero,
      bairro: this.state.bairro,
      cidade: this.state.cidade,
      estado: this.state.estado,
      complemento: this.state.complemento,

      imageself: this.state.selfie,
      imagecomprovante_endereco: this.state.comprovante,
      politico: this.state.politico
    };

    console.log(dados);

    Object.entries(dados).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        this.salvarDormente(key, value);
      }
    });

    this.setState({ cadastro: "3" });
    localStorage.setItem("save", "3");
  }

  salvarEmailPhone = () => {
    const { email, celular }  = this.state;
    if (email.length > 0 && celular.length > 0) {
      this.salvarDormente('email', email);
      this.salvarDormente('celular', celular);
    }
  }

  salvarSenha = () => {
    const { senha1, senha2 }  = this.state;
    if (senha1.length == 6 && senha2.length == 6) {
      if (senha1 === senha2) {
        this.salvarDormente('senha', senha1);
        this.setState({ cadastro: "5" });
        localStorage.setItem("save", "5");
      } else {
        alert("As senhas não são iguais. Tente novamente.");
      }
    }
  }

  salvarDoc = () => {
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

    this.concluir();
  }

  concluir = () => {
    const data = {
      url: "dormente-pf/concluir",
      data: {
        "documento": this.state.cpf,
        "nome_banco": process.env.NOME_BANCO,

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
        alert("Cadastro realizado com sucesso, em até 3 dias sua conta sera aprovada");
        window.location.href = "/";
      }
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
                (this.state.cadastro == "1") && ( <>

                  <h1 className="mb-2">
                    Iremos começar o cadastro da sua conta PJ
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
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Informe seu CPF ou passaporte</label>
                    <FormControl
                      // value={Formatar.cpf_mask(this.state.cpf)}
                      value={this.state.cpf}
                      placeholder="000.000.000-00"
                      style={{ height: 40, width: "100%" }}
                      maxLength={11}
                      onChange={(e) => {
                        // const cpf = e.target.value.replace(/\D/g, "");
                        const cpf = e.target.value;
                        this.setState({ cpf });
                      }}
                    />
                  </FormGroup>

                  <Button 
                    className="float-right mt-3"
                    disabled={
                      (this.state.cpf.length < 10) ||
                      (this.state.valueAgencia.numero == "") ||
                      (this.state.valueAgencia.id == "")
                    }
                    onClick={ () => {
                      this.validarCPF();
                    }}
                  >
                    Continuar
                  </Button>

                </> )
              }

              {
                (this.state.cadastro == "2") && ( <>

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
                            />

                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>CPF ou passaporte</label>

                            <FormControl
                              value={Formatar.cpf_mask(this.state.cpf)}
                              placeholder="000.000.000-00"
                              style={{ height: 40, width: 300 }}
                              maxLength={14}
                              onChange={(e) => {
                                // const cpf = e.target.value.replace(/\D/g, "");
                                const cpf = e.target.value;
                                this.setState({ cpf });
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Nome completo de sua mãe</label>
                            <FormControl
                              value={this.state.nomeMae}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ nomeMae: e.target.value })
                              }
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
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Estado civil</label>

                            <Select
                              options={
                                [
                                  { label: "Solteiro" },
                                  { label: "Casado" },
                                  { label: "Separado" },
                                  { label: "Divorciado" },
                                  { label: "Viúvo" },
                                  { label: "União Estável" },
                                ]
                              }
                              placeholder="Selecione seu estado civil"
                              value={this.state.estadocivil}
                              onChange={(selectedOption) => {
                                this.setState({
                                  estadocivil: selectedOption
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
                                    disabled={ this.state.cep.length < 9 }
                                    onClick={ () => {
                                      if (this.state.cep.length == 9) {
                                        this.setState({ cepLoading: true });
                                        this.consultarRepCEP();
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
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.comprovante == ''}
                                className="mx-1"
                                onClick={ () => {
                                  this.setState({ comprovante: '' });
                                }}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepComprovante}
                              // className="d-block"
                              type="file" 
                              accept="image/png, image/jpeg" 
                              onChange={ (event) => this.uploadRepComprovante(event) } 
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
                            />
                            
                          </FormGroup>
                        </Col>

                      </Row>
                    </Container>
                    
                  </div>

                  <Button 
                    className="float-right mt-3"
                    disabled={
                      (this.state.nome.trim() == "") ||
                      (this.state.cpf.length != 11) ||
                      (this.state.nomeMae.trim() == "") ||
                      (this.state.data == "") ||
                      (this.state.genero == "") ||
                      (this.state.estadocivil == "") ||
                      (this.state.cep == "") ||
                      (this.state.endereco == "") ||
                      (this.state.numero == "") ||
                      (this.state.bairro == "") ||
                      (this.state.cidade == "") ||
                      (this.state.estado == "") ||
                      (this.state.selfie == "")
                    }
                    onClick={ () => {
                      this.salvarInfo();
                    }}
                  >
                    Continuar
                  </Button>

                </> )
              }

              {
                (this.state.cadastro == "3") && ( <>

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
                                      disabled={!this.state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
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
                                      disabled={this.state.celular.length < 14}
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

                  <Button 
                    className="float-right mt-3"
                    disabled={
                      !this.state.email_validado ||
                      !this.state.celular_validado
                    }
                    onClick={ () => {
                      if (this.state.email_validado && this.state.celular_validado) {
                        this.salvarEmailPhone();
                        this.setState({ cadastro: "4" });
                        localStorage.setItem("save", "4");
                      }
                    }}
                  >
                    Continuar
                  </Button>
                    
                </> )
              }

              {
                (this.state.cadastro == "4") && ( <>

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
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Container>
                  </div>

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

              {
                (this.state.cadastro == "5") && ( <>

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
                    disabled={this.state.tipodoc == ""}
                    onClick={ () => {
                      this.setState({ cadastro: "6" });
                    }}
                  >
                    Continuar
                  </Button>
                </> )
              }

              {
                (this.state.cadastro == "6") && ( <>

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
                                    />
                                  </FormGroup>
                                </Col>

                              </> )
                          }
                        </Row>
                      </Container>
                    </div>
                  </div>

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
                      this.setState({ concluirModal: true });
                    }}
                  >
                    Continuar
                  </Button>

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
                  dangerouslySetInnerHTML={{ __html: this.state.termo }}
                ></div>
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({
                    cadastro: "2",
                    termoModal: false,
                  });
                  localStorage.setItem("save", "2");
                }}
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
                    alert('Por favor, complete o endereço.');
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
            size="md"
            show={this.state.statusModal}
            backdrop="static"
          >
            <Modal.Body>
              <Container>
                Deseja continuar o cadastro da conta do CPF {Formatar.cpf_mask(this.state.cpf)}?
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex">
              <Button
                className="mr-auto"
                variant="primary"
                onClick={() => {
                  this.setState({ 
                    cadastro: localStorage.getItem("save"),
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
                  localStorage.removeItem("save");
                }}
              >
                Não
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
              <Button
                className="mr-auto"
                variant="primary"
                onClick={() => {
                  this.salvarDoc();
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
