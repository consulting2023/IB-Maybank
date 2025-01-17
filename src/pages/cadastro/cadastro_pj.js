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
import Produtos from "../../constants/Produtos";
import i18n from "../../tradutor/tradutor";
import LangButton from "../../components/langButton/LangButton";
import Select from "react-select";
import * as Formatar from "../../constants/Formatar";
export default class CadastroPj extends Component {
  constructor() {
    super();
    this.state = {
      cadastro: "0",

      agencias: [],
      valueAgencia: {
        id: "",
        numero: "",
        nome: "",
      },
      cnpj: "",
      termo: "",
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
      rep_genero: "",
      rep_estadocivil: "",

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
    };

    this.inputTelefone = React.createRef();
    this.inputEmail = React.createRef();
    this.inputFantasia = React.createRef();
    this.inputInscricao = React.createRef();
    this.inputFaturamento = React.createRef();
    this.inputContribuicao = React.createRef();
    this.inputAbertura = React.createRef();
    this.inputCnae = React.createRef();
    this.inputCep = React.createRef();
    this.inputRepCpf = React.createRef();
    this.inputRepCelular = React.createRef();
    this.inputSenha1 = React.createRef();
    this.inputSenha2 = React.createRef();
    this.inputRepNomeMae = React.createRef();
    this.inputRepData = React.createRef();

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
    const cnpj = localStorage.getItem("cnpj");
    const save = localStorage.getItem("save");
    if (cnpj && save) {
      this.setState({ cnpj: cnpj, statusModal: true });
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
      // console.log(res);
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
      // console.log(res.texto);
      this.setState({ termo: res.texto });
    });
  };

  handleFocus = (nextInputRef) => {
    if (nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus(); // Muda o foco para o próximo input
    }
  };

  // uploadComprovante = (e) => {
  //   const file = e.target.files[0]; // Pega o arquivo selecionado
  //   if (file) {
  //     // Verifica se o arquivo é PNG ou JPG
  //     const validTypes = ['image/png', 'image/jpeg'];
  //     if (!validTypes.includes(file.type)) {
  //       alert("Arquivo inválido");
  //       this.setState({
  //         comprovante: '', // Limpa a imagem em caso de erro
  //       });
  //     } else {
  //       const reader = new FileReader();

  //       // Quando a leitura do arquivo terminar, armazenar o base64 no estado

  //       reader.onloadend = () => {
  //         const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
  //         this.setState({
  //           comprovante: base64String,
  //         });
  //         this.salvarDormente('imagecomprovante', base64String)
  //       };

  //       // Ler o arquivo como uma URL de dados (base64)
  //       reader.readAsDataURL(file);
  //     }
  //   } else {
  //     this.setState({ comprovante: '' });
  //   }
  // };

  uploadComprovante = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "application/pdf"]; // Tipos válidos

      if (validTypes.includes(file.type)) {
        const reader = new FileReader();

        reader.onloadend = () => {
          let base64String = "";

          if (file.type === "application/pdf") {
            // Para PDFs
            base64String = btoa(
              String.fromCharCode(...new Uint8Array(reader.result))
            );
          } else {
            // Para imagens (PNG, JPEG)
            base64String = reader.result.replace(
              /^data:image\/(png|jpeg);base64,/,
              ""
            );
          }

          this.setState({
            comprovante: base64String,
          });
        };

        // Ler o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ comprovante: "" });
    }
  };

  uploadCartao = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      // Verifica se o arquivo é PNG ou JPG
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          cartao: "", // Limpa a imagem em caso de erro
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({
            cartao: base64String,
          });
        };

        // Ler o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ cartao: "" });
    }
  };

  uploadContrato = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      const validTypes = ["application/pdf"];

      if (validTypes.includes(file.type)) {
        const reader = new FileReader();

        reader.onloadend = () => {
          let base64String = "";

          if (file.type === "application/pdf") {
            // Para PDFs
            base64String = btoa(
              String.fromCharCode(...new Uint8Array(reader.result))
            );
          } else {
            // Para imagens (PNG, JPEG)
            base64String = reader.result.replace(
              /^data:image\/(png|jpeg);base64,/,
              ""
            );
          }

          this.setState({
            contrato: base64String,
          });
        };

        // Escolhe o método de leitura com base no tipo
        if (file.type === "application/pdf") {
          reader.readAsArrayBuffer(file); // PDFs precisam de ArrayBuffer
        } else {
          reader.readAsDataURL(file); // Imagens podem ser lidas como Data URL
        }
      } else {
        // Caso o arquivo seja inválido
        alert("Arquivo inválido. Apenas arquivos PDF são aceitos.");
        this.setState({
          contrato: "", // Limpa o estado em caso de erro
        });
      }
    } else {
      this.setState({ contrato: "" }); // Limpa o estado caso nenhum arquivo seja selecionado
    }
  };

  uploadDoc = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          rep_doc: "",
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({
            rep_doc: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ rep_doc: "" });
    }
  };

  uploadDocVerso = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          rep_docverso: "",
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({
            rep_docverso: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ rep_docverso: "" });
    }
  };

  uploadSelfie = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          rep_selfie: "",
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({
            rep_selfie: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ rep_selfie: "" });
    }
  };

  uploadRepComprovante = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          rep_comprovante: "",
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({
            rep_comprovante: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({ rep_comprovante: "" });
    }
  };

  uploadProcuracao = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      const validTypes = ["application/pdf"];

      if (validTypes.includes(file.type)) {
        const reader = new FileReader();

        reader.onloadend = () => {
          let base64String = "";

          if (file.type === "application/pdf") {
            // Para PDFs
            base64String = btoa(
              String.fromCharCode(...new Uint8Array(reader.result))
            );
          } else {
            // Para imagens (PNG, JPEG)
            base64String = reader.result.replace(
              /^data:image\/(png|jpeg);base64,/,
              ""
            );
          }

          this.setState({
            rep_procuracao: base64String,
          });
        };

        // Escolhe o método de leitura com base no tipo
        if (file.type === "application/pdf") {
          reader.readAsArrayBuffer(file); // PDFs precisam de ArrayBuffer
        } else {
          reader.readAsDataURL(file); // Imagens podem ser lidas como Data URL
        }
      } else {
        // Caso o arquivo seja inválido
        alert("Arquivo inválido. Apenas arquivos PDF são aceitos.");
        this.setState({
          rep_procuracao: "", // Limpa o estado em caso de erro
        });
      }
    } else {
      this.setState({ rep_procuracao: "" }); // Limpa o estado caso nenhum arquivo seja selecionado
    }
  };

  validarCNPJ = () => {
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
      if (res) {
        this.salvarDormente("agencia", this.state.valueAgencia.numero);
        localStorage.setItem("cnpj", this.state.cnpj);
        this.setState({ termoModal: true });
      } else {
        // alert("CNPJ invalido, tente novamente");
        this.props.alerts("Erro", "CNPJ inválido, tente novamente", "warning");
      }
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
              cepLoading: false,
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
      Acre: "AC",
      Alagoas: "AL",
      Amapá: "AP",
      Amazonas: "AM",
      Bahia: "BA",
      Ceará: "CE",
      "Espírito Santo": "ES",
      Goiás: "GO",
      Maranhão: "MA",
      "Mato Grosso": "MT",
      "Mato Grosso do Sul": "MS",
      "Minas Gerais": "MG",
      Pará: "PA",
      Paraíba: "PB",
      Paraná: "PR",
      Pernambuco: "PE",
      Piauí: "PI",
      "Rio de Janeiro": "RJ",
      "Rio Grande do Norte": "RN",
      "Rio Grande do Sul": "RS",
      Rondônia: "RO",
      Roraima: "RR",
      "São Paulo": "SP",
      "Santa Catarina": "SC",
      "São João do Sul": "SE",
      Sergipe: "SE",
      Tocantins: "TO",
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
            alert("CEP inválido, tente novamente");
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
          alert("Erro ao consultar CEP, tente novamente");
        }
      });
    } else {
      this.setState({ rep_cepLoading: false });
      alert("CEP inválido");
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
        alert("Erro ao enviar SMS.");
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
        alert("Código inválido.");
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
        alert("Erro ao enviar Token.");
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
        alert("Token inválido.");
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
        // alert("Falha ao cadastrar informações, tente novamente." + campo );
      }
    });
  };

  concluir = () => {
    const data = {
      url: "dormente-pj/concluir",
      data: {
        documento: this.state.cnpj,
        representante: 1,
        nome_banco: process.env.NOME_BANCO,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (!res) {
        alert("Falha ao cadastrar informações, tente novamente.");
      } else {
        alert(
          "Cadastro realizado com sucesso, em ate 3 dias sua conta sera aprovada"
        );
        window.location.href = "/";
      }
    });
  };

  salvarEmpresaInfo = () => {
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
        this.salvarDormente(key, value);
      }
    });

    this.setState({ cadastro: "2" });
    localStorage.setItem("save", "2");
  };

  salvarRepresentanteInfo = () => {
    const dados = {
      representante_nome: this.state.rep_nome.trim(),
      representante_cpf: this.state.rep_cpf,
      representante_nomemae: this.state.rep_nomeMae.trim(),
      representante_data_nascimento: this.state.rep_data + " 00:00:00",
      representante_sexo: this.state.rep_genero,
      representante_estado_civil: this.state.rep_estadocivil,

      cep: this.state.rep_cep,
      endereco: this.state.rep_endereco,
      numero: this.state.rep_numero,
      bairro: this.state.rep_bairro,
      cidade: this.state.rep_cidade,
      estado: this.state.rep_estado,
      complemento: this.state.rep_complemento,

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

    this.setState({ cadastro: "3" });
    localStorage.setItem("save", "3");
  };

  salvarSenha = () => {
    const { senha1, senha2 } = this.state;
    if (senha1.length == 6 && senha2.length == 6) {
      if (senha1 === senha2) {
        this.salvarDormente("senha", senha1);
        this.setState({ cadastro: "5" });
        localStorage.setItem("save", "5");
      } else {
        alert("As senhas não são iguais. Tente novamente.");
      }
    }
  };

  salvarDoc = () => {};

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
              {this.state.cadastro == "0" && (
                <>
                  <h1 className="mb-2">
                    Iremos começar o cadastro da sua conta PJ
                  </h1>
                  <hr className="divisoria" />

                  <FormGroup>
                    <label>Escolha a Agencia</label>

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
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Informe o CNPJ da empresa</label>
                    <FormControl
                      value={Formatar.cnpj_mask(this.state.cnpj)}
                      placeholder="00.000.000/0000-00"
                      style={{ height: 40, width: "100%" }}
                      maxLength={18}
                      onChange={(e) => {
                        const cnpj = e.target.value.replace(/\D/g, "");
                        this.setState({ cnpj });
                      }}
                    />
                  </FormGroup>

                  <Button
                    className="float-right mt-3"
                    disabled={
                      this.state.cnpj.length < 14 ||
                      this.state.valueAgencia.numero == "" ||
                      this.state.valueAgencia.id == ""
                    }
                    onClick={() => {
                      this.validarCNPJ();
                    }}
                  >
                    Continuar
                  </Button>
                </>
              )}

              {this.state.cadastro == "1" && (
                <>
                  <div>
                    <h1 className="mb-2">Insira os dados da empresa</h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe o Telefone da empresa</label>

                            <FormControl
                              value={this.state.celEmpresa}
                              style={{ height: 40, width: 300 }}
                              placeholder="(00) 00000-0000"
                              maxLength={15}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(
                                  /\D/g,
                                  ""
                                );
                                const formattedValue =
                                  Formatar.formatarTelefone(numericValue);

                                this.setState({
                                  celEmpresa:
                                    numericValue.length > 0
                                      ? formattedValue
                                      : "",
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe o Email da empresa</label>

                            <FormControl
                              value={this.state.emailEmpresa}
                              placeholder="exemplo@mail.com"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ emailEmpresa: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe a Razão Social da empresa</label>

                            <FormControl
                              value={this.state.razaoSocial}
                              placeholder="Digite a Razão Social"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ razaoSocial: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe o Nome Fantasia da empresa</label>

                            <FormControl
                              value={this.state.nomeFantasia}
                              placeholder="Digite o Nome Fantasia"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ nomeFantasia: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>
                              Informe a Inscrição Estadual da empresa
                            </label>

                            <FormControl
                              value={this.state.inscricaoEstadual}
                              placeholder="Digite a Inscrição Estadual"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({
                                  inscricaoEstadual: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe o Faturamento da empresa</label>

                            <FormControl
                              value={this.state.faturamento}
                              placeholder="Digite o Faturamento"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Remove tudo que não for número ou ponto
                                const numericValue = value.replace(
                                  /[^0-9]/g,
                                  ""
                                ); // Permite apenas números

                                // Aplica a máscara de R$ (usando Intl.NumberFormat)
                                const formattedValue = new Intl.NumberFormat(
                                  "pt-BR",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                ).format(numericValue / 100); // Aqui dividimos por 100 apenas quando formatamos para exibir centavos

                                // Atualiza o estado com o valor formatado
                                this.setState({ faturamento: formattedValue });
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe a Contribuição da empresa</label>

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
                              placeholder="Selecione a Contribuição"
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
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe a data de abertura da empresa</label>

                            <FormControl
                              type="date"
                              value={this.state.dataAbertura}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                this.setState({ dataAbertura: e.target.value });
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe a CNAE da empresa</label>

                            <FormControl
                              value={Formatar.cnae_mask(this.state.cnae)}
                              placeholder="0000-0/00"
                              style={{ height: 40, width: 300 }}
                              maxLength={9}
                              onChange={(e) =>
                                this.setState({ cnae: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe a CEP da empresa</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                maxLength={9} // Limite do formato com máscara
                                value={Formatar.cep_mask(this.state.cep)}
                                placeholder="00000-000"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ cep: e.target.value });
                                }}
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
                                    disabled={this.state.cep.length < 9}
                                    onClick={() => {
                                      if (this.state.cep.length == 9) {
                                        this.setState({ cepLoading: true });
                                        this.consultarCEP();
                                      }
                                    }}
                                  >
                                    Pesquisar
                                  </Button>
                                </>
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="my-2 mx-4">
                          <FormGroup>
                            <label>Endereço</label>

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
                              Foto do Comprovante de endereço (PNG ou JPG)
                            </label>
                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputComprovante.current.click();
                                }}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.comprovante == ""}
                                className="mx-1"
                                onClick={() => {
                                  this.setState({ comprovante: "" });
                                }}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputComprovante}
                              // className="d-block"
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
                            <label>Foto do cartão CNPJ (PNG ou JPG)</label>

                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputCartao.current.click();
                                }}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.cartao == ""}
                                className="mx-1"
                                onClick={() => {
                                  // this.setState({ cadastro: "3" });
                                  // localStorage.setItem("save", "3");
                                  this.setState({ cartao: "" });
                                }}
                              >
                                Não tenho
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
                              Contrato social ou sua ultima alteração (PDF)
                            </label>

                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputContrato.current.click();
                                }}
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
                                <h6>CONTRATO CARREGADO COM SUCESSO</h6>
                              )}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Container>
                  </div>

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
                    Continuar
                  </Button>
                </>
              )}

              {this.state.cadastro == "2" && (
                <>
                  <div>
                    <h1 className="mb-2">
                      Agora insira os dados do Representante
                    </h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>Nome completo do Representante</label>

                            <FormControl
                              value={this.state.rep_nome}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                this.setState({ rep_nome: e.target.value });
                              }}
                              // onKeyDown={(e) => {
                              //   const rep_nome = this.state.rep_nome.trim();
                              //   if (rep_nome.length > 0 && e.key === "Enter") {
                              //     this.salvarDormente('representante_nome', rep_nome)
                              //     this.setState({ liberarRepCpf: true }, () => {
                              //       this.handleFocus(this.inputRepCpf);
                              //     });
                              //   }
                              // }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>CPF do Representante</label>

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
                              // onKeyDown={(e) => {
                              //   const rep_cpf = this.state.rep_cpf;
                              //   if (rep_cpf.length > 0 && e.key === "Enter") {
                              //     if(rep_cpf.length === 11) {
                              //       this.salvarDormente('representante_cpf', rep_cpf);
                              //       this.setState({ liberarRepCelular: true }, () => {
                              //         this.handleFocus(this.inputRepCelular);
                              //       });
                              //     } else {
                              //       alert("Por favor, termine de digitar o CPF.");
                              //     }
                              //   }
                              // }}
                            />
                          </FormGroup>
                        </Col>

                        

                        <Col className="m-2">
                          <FormGroup>
                            <label>Nome completo da mãe do Representante</label>
                            <FormControl
                              value={this.state.rep_nomeMae}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ rep_nomeMae: e.target.value })
                              }
                             
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Data de nascimento do Representante</label>

                            <FormControl
                              type="date"
                              value={this.state.rep_data}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                // this.salvarDormente('representante_data_nascimento', e.target.value + ' 00:00:00')
                                this.setState({
                                  rep_data: e.target.value,
                                  //   liberarRepGenero: true
                                  // }, () => {
                                  //   this.handleFocus(this.inputRepGenero);
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Gênero do Representante</label>

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
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Estado civil do Representante</label>

                            <Select
                              options={[
                                { label: "Solteiro" },
                                { label: "Casado" },
                                { label: "Separado" },
                                { label: "Divorciado" },
                                { label: "Viúvo" },
                                { label: "União Estável" },
                              ]}
                              placeholder="Selecione seu estado civil"
                              value={this.state.rep_estadocivil}
                              onChange={(selectedOption) => {
                                // this.salvarDormente('representante_estado_civil', selectedOption.label);
                                this.setState({
                                  rep_estadocivil: selectedOption,
                                  //   liberarRepTipodoc: true
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
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>CEP do Representante</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                maxLength={9} // Limite do formato com máscara
                                value={Formatar.cep_mask(this.state.rep_cep)}
                                placeholder="00000-000"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ rep_cep: e.target.value });
                                }}
                                // onKeyDown={(e) => {
                                //   const cep = this.state.cep;
                                //   if (cep.length > 0 && e.key === "Enter") {
                                //     if (cep.length === 9){
                                //       this.consultarCEP();
                                //     } else {
                                //       alert("Por favor, termine de digitar o CEP.");
                                //     }
                                //   }
                                // }}
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
                                    disabled={this.state.rep_cep.length < 9}
                                    onClick={() => {
                                      if (this.state.rep_cep.length == 9) {
                                        this.setState({ rep_cepLoading: true });
                                        this.consultarRepCEP();
                                      }
                                    }}
                                  >
                                    Pesquisar
                                  </Button>
                                </>
                              )}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="my-2 mx-4">
                          <FormGroup>
                            <label>Endereço do Representante</label>

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
                            <label>Selfie do Representate (PNG ou JPG)</label>
                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputRepSelfie.current.click();
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
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.rep_comprovante == ""}
                                className="mx-1"
                                onClick={() => {
                                  this.setState({ rep_comprovante: "" });
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
                              Foto da procuração do Representante (PDF)
                            </label>
                            <div className="d-flex">
                              <Button
                                className="mx-1"
                                onClick={() => {
                                  this.inputRepProcuracao.current.click();
                                }}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.rep_procuracao == ""}
                                className="mx-1"
                                onClick={() => {
                                  this.setState({ rep_procuracao: "" });
                                }}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepProcuracao}
                              // className="d-block"
                              type="file"
                              accept="application/pdf"
                              onChange={(event) => this.uploadProcuracao(event)}
                            />

                            <div
                              className="d-flex p-2"
                              style={{ height: 50, width: 300 }}
                            >
                              {this.state.rep_procuracao.length > 0 && (
                                <h6>PROCURAÇÃO CARREGADA COM SUCESSO</h6>
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
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Container>
                  </div>

                  <Button
                    className="float-right mt-3"
                    disabled={
                      this.state.rep_nome.trim() == "" ||
                      this.state.rep_cpf.length != 11 ||
                      this.state.rep_nomeMae.trim() == "" ||
                      this.state.rep_data == "" ||
                      this.state.rep_genero == "" ||
                      this.state.rep_estadocivil == "" ||
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
                    Continuar
                  </Button>
                </>
              )}

              {this.state.cadastro == "3" && (
                <>
                  <div>
                    <h1 className="mb-2">
                      Validação de E-mail e celular do representante
                    </h1>
                    <hr className="divisoria" />

                    <Container>
                      <Row>
                        <Col className="m-2">
                          <FormGroup>
                            <label>E-mail do Representante</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                value={this.state.rep_email}
                                placeholder="exemplo@mail.com"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) =>
                                  this.setState({ rep_email: e.target.value })
                                }
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
                                        Validar
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
                            <label>Celular do Representante</label>

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
                                        Validar
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

                  <Button
                    className="float-right mt-3"
                    disabled={
                      !this.state.email_validado || !this.state.celular_validado
                    }
                    onClick={() => {
                      if (
                        this.state.email_validado &&
                        this.state.celular_validado
                      ) {
                        this.setState({ cadastro: "4" });
                        localStorage.setItem("save", "4");
                      }
                    }}
                  >
                    Continuar
                  </Button>
                </>
              )}

              {this.state.cadastro == "4" && (
                <>
                  <div>
                    <h1 className="mb-2">Agora cadastre sua senha</h1>
                    <div>
                      <span>Dicas:</span>

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
                    onClick={() => {
                      this.salvarSenha();
                    }}
                  >
                    Continuar
                  </Button>
                </>
              )}

              {this.state.cadastro == "5" && (
                <>
                  <div>
                    <h1 className="mb-2">
                      Precisamos de fotos de um documento do representante
                      <br />
                      Qual documento você usará para abrir sua conta?
                    </h1>
                    <hr className="divisoria" />

                    <div className="d-flex">
                      <Select
                        options={[
                          { label: "RG", value: "1" },
                          { label: "CNH", value: "2" },
                          { label: "Passaporte", value: "3" },
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
                    disabled={this.state.rep_tipodoc == ""}
                    onClick={() => {
                      this.setState({ cadastro: "6" });
                    }}
                  >
                    Continuar
                  </Button>
                </>
              )}

              {this.state.cadastro == "6" && (
                <>
                  <div>
                    <h1 className="mb-2">
                      {this.state.rep_tipodoc.value == "1" ? (
                        <>Preencha os dados de seu RG</>
                      ) : this.state.rep_tipodoc.value == "2" ? (
                        <>Preencha os dados de sua CNH</>
                      ) : (
                        this.state.rep_tipodoc.value == "3" && (
                          <>Preencha os dados de seu Passaporte</>
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
                                >
                                  Escolher arquivo
                                </Button>
                              </div>

                              <input
                                ref={this.inputRepDoc}
                                // className="d-block"
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
                                  <>Número de seu RG</>
                                ) : this.state.rep_tipodoc.value == "2" ? (
                                  <>Número de sua CNH</>
                                ) : (
                                  this.state.rep_tipodoc.value == "3" && (
                                    <>Número de seu Passaporte</>
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
                              />
                            </FormGroup>
                          </Col>

                          <Col className="m-2">
                            <FormGroup>
                              <label>Data de emissão</label>

                              <FormControl
                                type="date"
                                value={this.state.rep_docemissao}
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({
                                    rep_docemissao: e.target.value,
                                  });
                                }}
                              />
                            </FormGroup>
                          </Col>

                          {this.state.rep_tipodoc.value == "1" ||
                          this.state.rep_tipodoc.value == "2" ? (
                            <>
                              <Col className="m-2">
                                <FormGroup>
                                  <label>Órgão emissor</label>

                                  <FormControl
                                    value={this.state.rep_docorgao}
                                    style={{ height: 40, width: 300 }}
                                    onChange={(e) => {
                                      this.setState({
                                        rep_docorgao: e.target.value,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col className="m-2">
                                <FormGroup>
                                  <label>Estado emissor</label>

                                  <Select
                                    options={[
                                      { label: "Acre", value: "AC" },
                                      { label: "Alagoas", value: "AL" },
                                      { label: "Amazonas", value: "AM" },
                                      { label: "Bahia", value: "BA" },
                                      { label: "Ceará", value: "CE" },
                                      {
                                        label: "Distrito Federal",
                                        value: "DF",
                                      },
                                      { label: "Espírito Santo", value: "ES" },
                                      { label: "Goiás", value: "GO" },
                                      { label: "Maranhão", value: "MA" },
                                      { label: "Mato Grosso", value: "MT" },
                                      {
                                        label: "Mato Grosso do Sul",
                                        value: "MS",
                                      },
                                      { label: "Minas Gerais", value: "MG" },
                                      { label: "Pará", value: "PA" },
                                      { label: "Paraíba", value: "PB" },
                                      { label: "Paraná", value: "PR" },
                                      { label: "Pernambuco", value: "PE" },
                                      { label: "Piauí", value: "PI" },
                                      { label: "Rio de Janeiro", value: "RJ" },
                                      {
                                        label: "Rio Grande do Norte",
                                        value: "RN",
                                      },
                                      {
                                        label: "Rio Grande do Sul",
                                        value: "RS",
                                      },
                                      { label: "Rondônia", value: "RO" },
                                      { label: "Roraima", value: "RR" },
                                      { label: "Santa Catarina", value: "SC" },
                                      { label: "São Paulo", value: "SP" },
                                      { label: "Sergipe", value: "SE" },
                                      { label: "Tocantins", value: "TO" },
                                    ]}
                                    placeholder="Selecione o estado emissor"
                                    className="m-auto"
                                    value={this.state.rep_docestado}
                                    onChange={(selectedOption) => {
                                      this.setState({
                                        rep_docestado: selectedOption,
                                        rep_docestadoStr: selectedOption.value,
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
                                </FormGroup>
                              </Col>
                            </>
                          ) : (
                            this.state.rep_tipodoc.value == "3" && (
                              <>
                                <Col className="m-2">
                                  <FormGroup>
                                    <label>País emissor</label>

                                    <FormControl
                                      value={this.state.rep_passpais}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({
                                          rep_passpais: e.target.value,
                                        });
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Nacionalidade</label>

                                    <FormControl
                                      value={this.state.rep_passnaci}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({
                                          rep_passnaci: e.target.value,
                                        });
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Naturalidade</label>

                                    <FormControl
                                      value={this.state.rep_passnatu}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({
                                          rep_passnatu: e.target.value,
                                        });
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Tipo de Passaporte</label>

                                    <FormControl
                                      value={this.state.rep_passtipo}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({
                                          rep_passtipo: e.target.value,
                                        });
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col className="m-2">
                                  <FormGroup>
                                    <label>Data de validade</label>

                                    <FormControl
                                      type="date"
                                      value={this.state.rep_passvalidade}
                                      style={{ height: 40, width: 300 }}
                                      onChange={(e) => {
                                        this.setState({
                                          rep_passvalidade: e.target.value,
                                        });
                                      }}
                                    />
                                  </FormGroup>
                                </Col>
                              </>
                            )
                          )}
                        </Row>
                      </Container>
                    </div>
                  </div>

                  <Button
                    className="float-right mt-3"
                    disabled={
                      this.state.rep_doc == "" ||
                      this.state.rep_docverso == "" ||
                      this.state.rep_docnumero == "" ||
                      this.state.rep_docemissao == "" ||
                      (this.state.rep_tipodoc.value == "1" ||
                      this.state.rep_tipodoc.value == "2"
                        ? this.state.rep_docorgao == "" ||
                          this.state.rep_docestadoStr == ""
                        : this.state.rep_tipodoc.value == "3" &&
                          (this.state.rep_passpais == "" ||
                            this.state.rep_passnaci == "" ||
                            this.state.rep_passnatu == "" ||
                            this.state.rep_passtipo == "" ||
                            this.state.rep_passvalidade == ""))
                    }
                    onClick={() => {
                      this.setState({ concluirModal: true });
                    }}
                  >
                    Continuar
                  </Button>
                </>
              )}
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
                      cadastro: "1",
                      termoModal: false,
                    });
                    localStorage.setItem("save", "1");
                  }}
                >
                  Declaro que li e aceito os termos de uso e de privacidade{" "}
                  {process.env.NOME_BANCO}
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
                  if (
                    this.state.numero == "" ||
                    this.state.endereco == "" ||
                    this.state.numero == "" ||
                    this.state.bairro == "" ||
                    this.state.cidade == "" ||
                    this.state.estado == ""
                  ) {
                    alert("Por favor, complete o endereço de sua empresa.");
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
                Enviamos um código via SMS para seu número. Informe o código.
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
              <Modal.Title>
                Enviamos um token para seu e-mail. Informe o token.
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
                Validar token
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
                      <label>CEP</label>
                      <FormControl
                        value={this.state.rep_cep}
                        style={{ height: 40, width: 300 }}
                        disabled
                      />
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <label>Endereço</label>
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
                      <label>Número</label>
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
                      <label>Bairro</label>
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
                      <label>Cidade</label>
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
                      <label>Estado</label>
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
                    alert("Por favor, complete o endereço do representante.");
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
            show={this.state.statusModal}
            backdrop="static"
          >
            <Modal.Body>
              <Container>
                Deseja continuar o cadastro da conta de CNPJ{" "}
                {Formatar.cnpj_mask(this.state.cnpj)}?
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex">
              <Button
                className="mr-auto"
                variant="primary"
                onClick={() => {
                  this.setState({
                    cadastro: localStorage.getItem("save"),
                    statusModal: false,
                  });
                }}
              >
                Sim
              </Button>

              <Button
                className="ml-auto"
                variant="primary"
                onClick={() => {
                  this.setState({ statusModal: false, cnpj: "" });
                  localStorage.removeItem("cnpj");
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
              <Container>Finalizar seu cadastro?</Container>
            </Modal.Body>
            <Modal.Footer className="d-flex">
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
