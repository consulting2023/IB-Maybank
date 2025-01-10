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
import {
  isIOS,
  isAndroid,
  isMobile,
  isBrowser,
  deviceType,
} from "react-device-detect";
import Produtos from "../../constants/Produtos";
import i18n from "../../tradutor/tradutor"; import LangButton from "../../components/langButton/LangButton";
import Select from "react-select";
import * as Formatar from "../../constants/Formatar";
export default class CadastroPj extends Component {
  constructor() {
    super();
    this.state = {
      cadastro: '0',

      agencias: [],
      valueAgencia: {
        id: "",
        numero: "",
        nome: ""
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

      rep_nome:"",
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

      rep_celular: "",
      smsModal: false,
      sms: "",

      rep_email: "",
      tokenModal: false,
      token: "",

      liberarSenha1: false,
      senha1: "",

      liberarSenha2: false,
      senha2: "",


      liberarRepTipodoc: false,
      rep_tipodoc: "",

      liberarRepDoc: false,
      rep_doc: "",

      liberarRepDocVerso: false,
      rep_docverso: "",
      rep_docnumero: "",
      liberarRepDocEmissao: false,
      rep_docemissao: "",

      liberarRepDocOrgao: false,
      // rep_docorgao: "",
      liberarRepDocEstado: false,
      // rep_docestado: "",

      liberarRepPassPais: false,
      rep_passpais: "",
      liberarRepPassNaci: false,
      rep_passnaci: "",
      liberarRepPassNatu: false,
      rep_passnatu: "",
      liberarRepPassValidade: false,
      rep_passvalidade: "",

      rep_selfie: "",

      liberarRepComprovante: false,
      rep_comprovante: "",

      liberarRepProcuracao: false,
      rep_procuracao: "",

      liberarRepPolitico: false,
      rep_politico: false,

      statusModal: false
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
  }
  
  componentDidMount = () => {
    this.agCadastro();
    this.buscarTermoUso();
    this.checkStatus();
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

  uploadComprovante = (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    if (file) {
      // Verifica se o arquivo é PNG ou JPG
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          comprovante: '', // Limpa a imagem em caso de erro
        });
      } else {
        const reader = new FileReader();

        // Quando a leitura do arquivo terminar, armazenar o base64 no estado

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
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
          rep_doc: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            rep_doc: base64String,
            liberarRepDocVerso: true 
          });

          this.salvarDormente('representante_imagedoc', base64String)
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({rep_doc: ''});
    }
  };

  uploadDocVerso = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          rep_docverso: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            rep_docverso: base64String,
          });

          this.salvarDormente('representante_imagedoc_verso', base64String)
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({rep_docverso: ''});
    }
  };

  uploadSelfie = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          rep_selfie: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            rep_selfie: base64String,
            liberarRepComprovante: true,
          });

          this.salvarDormente('representante_imageself', base64String)
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({rep_selfie: ''});
    }
  };

  uploadRepComprovante = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert("Arquivo inválido");
        this.setState({
          rep_comprovante: '',
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
          this.setState({
            rep_comprovante: base64String,
          });
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({rep_comprovante: ''});
    }
  };

  // uploadProcuracao = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  
  //     if (validTypes.includes(file.type)) {
  //       const reader = new FileReader();
  
  //       reader.onloadend = () => {
  //         const binaryString = reader.result;
  //         const base64String = btoa(binaryString);
  
  //         this.setState({
  //           rep_procuracao: base64String,
  //           liberarRepPolitico: true,
  //         });
  
  //         this.salvarDormente('representante_procuracao', base64String);
  //       };
  
  //       // Aqui usamos `readAsBinaryString` diretamente
  //       reader.readAsBinaryString(file);
  //     } else {
  //       alert('Arquivo inválido. Apenas arquivos PNG, JPEG e PDF são aceitos.');
  //       this.setState({
  //         rep_procuracao: '',
  //       });
  //     }
  //   } else {
  //     this.setState({ rep_procuracao: '' });
  //   }
  // };

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
            rep_procuracao: base64String,
            liberarRepPolitico: true,
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
          rep_procuracao: '', // Limpa o estado em caso de erro
        });
      }
    } else {
      this.setState({ rep_procuracao: '' }); // Limpa o estado caso nenhum arquivo seja selecionado
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
        this.salvarDormente('agencia', this.state.valueAgencia.numero);
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

  salvarEndereco = () => {
    this.salvarDormente('cep', this.state.cep);
    this.salvarDormente('endereco', this.state.endereco);
    this.salvarDormente('numero', this.state.numero);
    this.salvarDormente('bairro', this.state.bairro);
    this.salvarDormente('cidade', this.state.cidade);
    this.salvarDormente('estado', this.state.estado);
    if (this.state.complemento != '') {
      this.salvarDormente('complemento', this.state.complemento);
    }
  };

  consultarRepCEP = () => {
    const regex = /^\d{5}-\d{3}$/;
    if (regex.test(this.state.rep_cep)) {
      const data = {
        url: 'utilitarios/cep',
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
              rep_cepLoading: false
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

  salvarRepEndereco = () => {
    this.salvarDormente('representante_cep', this.state.rep_cep);
    this.salvarDormente('representante_endereco', this.state.rep_endereco);
    this.salvarDormente('representante_numero', this.state.rep_numero);
    this.salvarDormente('representante_bairro', this.state.rep_bairro);
    this.salvarDormente('representante_cidade', this.state.rep_cidade);
    this.salvarDormente('representante_estado', this.state.rep_estado);
    if (this.state.rep_complemento != '') {
      this.salvarDormente('representante_complemento', this.state.complemento);
    }
  };

  sms_envia = () => {
    const data = {
      url: "utilitarios/validacao-sms-envio",
      data: {
        telefone: this.state.rep_celular
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res){
        this.setState({ smsModal: true });
      } else {
        alert("Erro ao enviar SMS.");
      }
    });
  };

  sms_valida = () => {
    const data = {
      url: "utilitarios/validacao-sms-confere",
      data: {
        telefone: this.state.rep_celular,
        token: this.state.sms
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res){
        this.setState({ cadastro: "5", smsModal: false });
        localStorage.setItem("save", "5");
      } else {
        alert("SMS inválido.");
      }
    });
  }

  email_envia = () => {
    const data = {
      url: "utilitarios/validacao-email-envio",
      data: {
        email: this.state.rep_email
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res){
        this.setState({ tokenModal: true });
      } else {
        alert("Erro ao enviar SMS.");
      }
    });
  };

  email_valida = () => {
    const data = {
      url: "utilitarios/validacao-email-confere",
      data: {
        email: this.state.rep_email,
        token: this.state.token
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (res){
        this.setState({ tokenModal: false, liberarSenha1: true }, () => {
          this.handleFocus(this.inputSenha1)
        });
      } else {
        alert("SMS inválido.");
      }
    });
  }

  setSenha = () => {
    const { senha1, senha2 }  = this.state;
    if (senha1 === senha2) {
      this.salvarDormente('senha', senha1);
      this.setState({
        liberarRepNomeMae: true,
      }, () => {
        this.handleFocus(this.inputRepNomeMae);
      })
    } else {
      alert("As senhas não são iguais. Tente novamente.");
    }
  }

  salvarDormente = (campo, valor) => {
    const data = {
      url: "dormente-pj/previa",
      data: {
        "documento": this.state.cnpj,
        "campo": campo,
        "valor": valor,
        "representante": 1
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      // console.log(res)
      if (!res) {
        // alert("Falha ao cadastrar informações, tente novamente.");
        alert("Falha ao cadastrar informações, tente novamente." + campo );
        
      } else {
        // console.log(campo + ' ok');
      }
    });
  }

  concluir = () => {
    const data = {
      url: "dormente-pj/concluir",
      data: {
        "documento": this.state.cnpj,
        "representante": 1,
        "nome_banco": process.env.NOME_BANCO
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      if (!res) {
        alert("Falha ao cadastrar informações, tente novamente.");
      } else {
        alert("Cadastro realizado com sucesso, em ate 3 dias sua conta sera aprovada");
        window.location.href = "/";
      }
    });
  }


  salvarEmpresaInfo = () => {
    this.salvarDormente('telefone', this.state.celEmpresa.replace(/\s+/g, ""));
    this.salvarDormente('email', this.state.emailEmpresa);
    this.salvarDormente('razao_social', this.state.razaoSocial.trim());
    this.salvarDormente('nome_fantasia', this.state.nomeFantasia.trim());
    this.salvarDormente('inscricao_estadual', this.state.inscricaoEstadual.trim());
    this.salvarDormente('faturamento', this.state.faturamento.trim());
    this.salvarDormente('contribuicao', this.state.contribuicao);
    this.salvarDormente('dataabertura', this.state.dataAbertura + ' 00:00:00');
    this.salvarDormente('cnae', this.state.cnae);
    
    this.salvarDormente('cep', this.state.cep);
    this.salvarDormente('endereco', this.state.endereco);
    this.salvarDormente('numero', this.state.numero);
    this.salvarDormente('bairro', this.state.bairro);
    this.salvarDormente('cidade', this.state.cidade);
    this.salvarDormente('estado', this.state.estado);
    if (this.state.complemento != '') {
      this.salvarDormente('complemento', this.state.complemento);
    }

    this.salvarDormente('imagecomprovante', this.state.comprovante);
    this.salvarDormente('imagecnpj', this.state.cartao);
    this.salvarDormente('imagecontrato', this.state.contrato);

    this.setState({ cadastro: "2" });
    localStorage.setItem("save", "2");
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
                        //   liberarCNPJ: true, // Guarda o nome da agência selecionada
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
                      (this.state.cnpj.length < 14) ||
                      (this.state.valueAgencia.numero == "") ||
                      (this.state.valueAgencia.id == "")
                    }
                    onClick={ () => {
                      this.validarCNPJ();
                    }}
                  >
                    Continuar
                  </Button>

                </> )
              }

              {
                (this.state.cadastro == "1") && ( <>

                  <div>
                    <h1 className="mb-2">
                      Insira os dados da empresa
                    </h1>
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
                                const numericValue = rawValue.replace(/\D/g, "");
                                const formattedValue = Formatar.formatarTelefone(numericValue);

                                this.setState({
                                  celEmpresa: numericValue.length > 0 ? formattedValue : "",
                                });
                              }}
                              // onKeyDown={(e) => {
                              //   const cel = this.state.celEmpresa;
                              //   if (cel.length > 0 && e.key === "Enter") {
                              //     if(cel.length > 13){
                              //       this.salvarDormente('telefone', cel.replace(/\s+/g, ""))
                              //       this.setState({ liberarEmail: true }, () => {
                              //         this.handleFocus(this.inputEmail);
                              //       });
                              //     } else {
                              //       alert("Por favor, termine de digitar o telefone.");
                              //     }
                              //   }
                              // }}
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
                              // onKeyDown={(e) => {
                              //   const email = e.target.value;
                              //   if (email.length > 0 && e.key === "Enter") {
                              //     const email = this.state.emailEmpresa;
                              //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              //     if (emailRegex.test(email)) {
                              //       this.salvarDormente('email', email);
                              //       this.setState({ termoModal: true });
                              //     } else {
                              //       alert("Por favor, insira um e-mail válido.");
                              //     }
                              //   }
                              // }}
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
                              // onKeyDown={(e) => {
                              //   const razaoSocial = this.state.razaoSocial.trim();
                              //   if (razaoSocial.length > 0 && e.key === "Enter") {
                              //     this.salvarDormente('razao_social', razaoSocial);
                              //     this.setState({ liberarFantasia: true }, () => {
                              //       this.handleFocus(this.inputFantasia);
                              //     });
                              //   }
                              // }}       
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
                              // onKeyDown={(e) => {
                              //   const nomeFantasia = this.state.nomeFantasia.trim();
                              //   if (nomeFantasia.length > 0 && e.key === "Enter") {
                              //     this.salvarDormente('nome_fantasia', nomeFantasia);
                              //     this.setState({ liberarInscricao: true }, () => {
                              //       this.handleFocus(this.inputInscricao);
                              //     });
                              //   }
                              // }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe a Inscrição Estadual da empresa</label>

                            <FormControl 
                              value={this.state.inscricaoEstadual}
                              placeholder="Digite a Inscrição Estadual"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({
                                  inscricaoEstadual: e.target.value,
                                })
                              }
                              // onKeyDown={(e) => {
                              //   const inscricaoEstadual = this.state.inscricaoEstadual.trim();
                              //   if (inscricaoEstadual.length > 0 && e.key === "Enter") {
                              //     this.salvarDormente('inscricao_estadual', inscricaoEstadual);
                              //     this.setState({ liberaFaturamento: true }, () => {
                              //       this.handleFocus(this.inputFaturamento);
                              //     });
                              //   }
                              // }}
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
                                const numericValue = value.replace(/[^0-9]/g, ""); // Permite apenas números

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
                              // onKeyDown={(e) => {
                              //   const faturamento = this.state.faturamento.trim();
                              //   if (faturamento.length > 0 && e.key === "Enter") {
                              //     if (faturamento != "R$ 0,00") {
                              //       this.salvarDormente('faturamento', faturamento);
                              //       this.setState({ liberarContribuicao: true }, () => {
                              //         this.handleFocus(this.inputContribuicao);
                              //       });
                              //     } else {
                              //       alert("Insira o valor de faturamento.");
                              //     }
                              //   }
                              // }}
                            />

                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Informe a Contribuição da empresa</label>

                            <Select
                              options={
                                [
                                  { label: "Sociedade Anônima - SA", value: "SA" },
                                  { label: "Sociedade Limitada - LTDA", value: "LTDA" },
                                  { label: "Sociedade Simples - SS", value: "SS" },
                                  { label: "Microempresa - ME", value: "ME" },
                                  { label: "Empresa de Pequeno Porte - EPP", value: "EPP" },
                                  { label: "Empresário Individual - SOLE_PROPRIETOR", value: "SOLE_PROPRIETOR" },
                                  { label: "Empresa Individual de Responsabilidade - EIRELI", value: "EIRELI" },
                                  { label: "Microempreendedor Individual - MEI", value: "MEI" },
                                  { label: "Sociedade de Conta de Participação - SCP", value: "SCP" },
                                  { label: "Sociedade em Nome Coletivo - S/A", value: "S/A" },
                                  { label: "Sociedade em Comandita Simples", value: "SOCIEDADE EM COMANDITA SIMPLES" },
                                  { label: "Sociedade em Comandita por Ações", value: "SOCIEDADE EM COMANDITA POR ACOES" },
                                  { label: "Sociedade de Propósito Específico - SPE", value: "SPE" },
                                  { label: "Cooperativa", value: "COOPERATIVA" },
                                  { label: "Consórcio de Empresas", value: "CONSORCIO DE EMPRESAS" },
                                  { label: "Associação", value: "ASSOCIACAO" },
                                  { label: "Fundação", value: "FUNDACAO" },
                                  { label: "Organização Não Governamental - ONG", value: "ONG" },
                                  { label: "Entidade Religiosa", value: "ENTIDADE RELIGIOSA" },
                                  { label: "Organização da Sociedade Civil de Interesse Público - OSCIP", value: "OSCIP" },
                                  { label: "Instituto", value: "INSTITUTO" },
                                  { label: "Condomínio", value: "CONDOMÍNIO" },
                                  { label: "Consórcio Público", value: "CONSORCIO PUBLICO" },
                                  { label: "Empreendedor Rural", value: "EMPREENDEDOR RURAL" },
                                  { label: "Entidade Sindical", value: "ENTIDADE SINDICAL" },
                                ]
                              }
                              placeholder="Selecione a Contribuição"
                              onChange={(selectedOption) => {
                                this.setState({ contribuicao: selectedOption.value });
                                // this.salvarDormente('contribuicao', selectedOption.value);
                              //   this.setState({ cadastro: "2" });
                              //   localStorage.setItem("save", "2");
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
                            <label>Informe a data de abertura da empresa</label>

                            <FormControl
                              type="date"
                              value={this.state.dataAbertura}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) => {
                                // this.salvarDormente('dataabertura', e.target.value + ' 00:00:00')
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
                              // onKeyDown={(e) => {
                              //   const nomeCnae = this.state.cnae;
                              //   if (nomeCnae.length > 0 && e.key === "Enter") {
                              //     if (nomeCnae.length === 9) {
                              //       this.salvarDormente('cnae', nomeCnae);
                              //       this.setState({ liberarCep: true }, () => {
                              //         this.handleFocus(this.inputCep);
                              //       });
                              //     } else {
                              //       alert("Por favor, termine de digitar a CNAE.");
                              //     }
                              //   }
                              // }} 
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
                                  this.setState({ cep: e.target.value })
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
                            <label>Foto do Comprovante de endereço (PNG ou JPG)</label>
                            <div className="d-flex">
                              <Button 
                                className="mx-1"
                                onClick={ () => {
                                  this.inputComprovante.current.click() 
                                }}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.comprovante == ''}
                                className="mx-1"
                                onClick={ () => {
                                  // this.setState({ cadastro: "3" });
                                  // localStorage.setItem("save", "3");
                                  this.setState({ comprovante: '' });
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
                              onChange={ (event) => this.uploadComprovante(event) } 
                            />

                            <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                              {
                                (this.state.comprovante.length > 0) && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.comprovante}`}
                                    alt="Comprovante de endereço"
                                    style={{ maxHeight: '50px' }} 
                                  />
                                )
                              }
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>Foto do cartão CNPJ (PNG ou JPG)</label>

                            <div className="d-flex">
                              <Button 
                                className="mx-1"
                                onClick={ () => {
                                  this.inputCartao.current.click() 
                                }}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.cartao == ''}
                                className="mx-1"
                                onClick={ () => {
                                  // this.setState({ cadastro: "3" });
                                  // localStorage.setItem("save", "3");
                                  this.setState({ cartao: '' });
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

                            <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                              {
                                (this.state.cartao.length > 0) && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.cartao}`}
                                    alt="Cartão CNPJ"
                                    style={{ maxHeight: '50px' }} 
                                  />
                                )
                              }
                            </div>

                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>Contrato social ou sua ultima alteração (PDF)</label>

                            <div className="d-flex">
                              <Button 
                                className="mx-1"
                                onClick={ () => {
                                  this.inputContrato.current.click() 
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

                            <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                              {
                                (this.state.contrato.length > 0) && (
                                  <h6>CONTRATO CARREGADO COM SUCESSO</h6>
                                )
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
                      (this.state.celEmpresa.length < 14) ||
                      (this.state.emailEmpresa == "") ||
                      (this.state.razaoSocial.trim() == "") ||
                      (this.state.nomeFantasia.trim() == "") ||
                      (this.state.inscricaoEstadual.trim() == "") ||
                      (this.state.faturamento.trim.length == "R$ 0,00") ||
                      (this.state.contribuicao == "") ||
                      (this.state.dataAbertura == "") ||
                      (this.state.cnae == "") ||
                      (this.state.cep == "") ||
                      (this.state.endereco == "") ||
                      (this.state.contrato == "")
                    }
                    onClick={ () => {
                      this.salvarEmpresaInfo();
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
                                const rep_cpf = e.target.value.replace(/\D/g, "");
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

                        {/* <Col className="m-2">
                          <FormGroup>
                            <label>Celular do Representante</label>

                            <FormControl
                              value={this.state.rep_celular}
                              placeholder="(00) 00000-0000"
                              style={{ height: 40, width: 300 }}
                              maxLength={15} // Limite do formato com máscara
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = rawValue.replace(/\D/g, "");
                                const formattedValue = Formatar.formatarTelefone(numericValue); // Reaplica a máscara

                                this.setState({
                                  rep_celular: numericValue.length > 0 ? formattedValue : "",
                                });
                              }}
                              // onKeyDown={(e) => {
                              //   const cel = this.state.rep_celular;
                              //   if (cel.length > 0 && e.key === "Enter") {
                              //     if(cel.length > 13){
                              //       this.salvarDormente('representante_celular', cel.replace(/\s+/g, ""));
                              //       this.sms_envia(); 
                              //     } else {
                              //       alert("Por favor, termine de digitar o telefone.");
                              //     }
                              //   }
                              // }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>E-Mail do Representante</label>

                            <FormControl
                              value={this.state.rep_email}
                              placeholder="exemplo@mail.com"
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ rep_email: e.target.value })
                              }
                              // onKeyDown={(e) => {
                              //   const email = e.target.value;
                              //   if (email.length > 0 && e.key === "Enter") {
                              //     const email = this.state.rep_email;
                              //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              //     if (emailRegex.test(email)) {
                              //       this.salvarDormente('representante_email', email);
                              //       this.email_envia(); 
                              //     } else {
                              //       alert("Por favor, insira um e-mail válido.");
                              //     }
                              //   }
                              // }}
                            />
                          </FormGroup>
                        </Col> */}

                        <Col className="m-2">
                          <FormGroup>
                            <label>Nome completo da mãe do Representante</label>
                            <FormControl
                              value={this.state.rep_nomeMae}
                              style={{ height: 40, width: 300 }}
                              onChange={(e) =>
                                this.setState({ rep_nomeMae: e.target.value })
                              }
                              // onKeyDown={(e) => {
                              //   const nomeMae = this.state.rep_nomeMae.trim();
                              //   if (nomeMae.length > 0 && e.key === "Enter") {
                              //     this.salvarDormente('representante_nomemae', nomeMae);
                              //     this.setState({ liberarRepData: true }, () => {
                              //       this.handleFocus(this.inputRepData);
                              //     });
                              //   }

                              // }}
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
                                // this.setState({ 
                                //   rep_data: e.target.value, 
                                //   liberarRepGenero: true 
                                // }, () => {
                                //   this.handleFocus(this.inputRepGenero);
                                // })
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            <label>Gênero do Representante</label>

                            <Select
                              options={
                                [
                                  { label: "Masculino", value: "MASCULINO" },
                                  { label: "Feminino", value: "FEMININO" },
                                  { label: "Outros", value: "OUTROS" }
                                ]
                              }
                              placeholder="Selecione seu gênero"
                              // value={this.state.rep_genero}
                              onChange={(selectedOption) => {
                                // this.salvarDormente('representante_sexo', selectedOption.value);
                                // this.setState({
                                //   // rep_genero: selectedOption,
                                //   cadastro: "6"
                                // });
                                // localStorage.setItem("save", "6");
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
                            <label>Estado civil do Representante</label>

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
                              value={this.state.rep_genero}
                              onChange={(selectedOption) => {
                                // this.salvarDormente('representante_estado_civil', selectedOption.label);
                                // this.setState({
                                //   liberarRepTipodoc: true
                                // });
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
                            <label>CEP do Representante</label>

                            <div className="d-flex flex-row">
                              <FormControl
                                maxLength={9} // Limite do formato com máscara
                                value={Formatar.cep_mask(this.state.rep_cep)}
                                placeholder="00000-000"
                                style={{ height: 40, width: 300 }}
                                onChange={(e) => {
                                  this.setState({ rep_cep: e.target.value })
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

                              {
                                this.state.rep_cepLoading ? ( <>

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
                                    disabled={ this.state.rep_cep.length < 9 }
                                    onClick={ () => {
                                      if (this.state.rep_cep.length == 9) {
                                        this.setState({ rep_cepLoading: true });
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
                            <label>Endereço do Representante</label>

                            <FormControl
                              value={
                                (this.state.rep_endereco != "") ?
                                (
                                  this.state.rep_endereco + ' ' + 
                                  this.state.rep_numero + ', ' + 
                                  this.state.rep_complemento + ((this.state.rep_complemento == "") ? '' : ', ') +
                                  this.state.rep_bairro + ', ' + 
                                  this.state.rep_cidade + ' - ' + 
                                  this.state.rep_estado
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
                                active={this.state.rep_comprovante == ''}
                                className="mx-1"
                                onClick={ () => {
                                  // this.setState({ cadastro: "3" });
                                  // localStorage.setItem("save", "3");
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
                                (this.state.rep_comprovante.length > 0) && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.rep_comprovante}`}
                                    alt="Comprovante de endereço"
                                    style={{ maxHeight: '50px' }} 
                                  />
                                )
                              }
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2 border rounded">
                          <FormGroup>
                            <label>Foto da procuração do Representante (PDF)</label>
                            <div className="d-flex">
                              <Button 
                                className="mx-1"
                                onClick={ () => {
                                  this.inputRepProcuracao.current.click() 
                                }}
                              >
                                Escolher arquivo
                              </Button>
                              <Button
                                active={this.state.rep_procuracao == ''}
                                className="mx-1"
                                onClick={ () => {
                                  // this.setState({ cadastro: "3" });
                                  // localStorage.setItem("save", "3");
                                  this.setState({ rep_procuracao: '' });
                                }}
                              >
                                Não tenho
                              </Button>
                            </div>

                            <input
                              ref={this.inputRepProcuracao}
                              // className="d-block"
                              type="file" 
                              accept="image/png, image/jpeg" 
                              onChange={(event) => this.uploadProcuracao(event)} 
                            />

                            <div className="d-flex p-2" style={{ height: 50, width: 300 }}>
                              {
                                (this.state.rep_procuracao.length > 0) && (
                                  <img
                                    className="m-auto"
                                    src={`data:image/jpeg;base64,${this.state.rep_procuracao}`}
                                    alt="Comprovante de endereço"
                                    style={{ maxHeight: '50px' }} 
                                  />
                                )
                              }
                            </div>
                          </FormGroup>
                        </Col>

                        <Col className="m-2">
                          <FormGroup>
                            {/* <label>O Representante é uma pessoa políticamente exposta?</label> */}
                            <FormCheck
                              label="O Representante é uma pessoa políticamente exposta?"
                              type="switch"
                              checked={this.state.rep_politico}
                              onChange={ (event) => this.setState({ rep_politico: event.target.checked }) }
                            />
                            
                          </FormGroup>
                        </Col>

                      </Row>
                    </Container>
                    
                  </div>

                  <Button 
                    className="float-right mt-3"
                    onClick={ () => {
                      // this.salvarEmpresaInfo();
                    }}
                  >
                    Continuar
                  </Button>

                </> )
              }

              {
                (this.state.cadastro == "5") && ( <>

                  {
                    this.state.liberarSenha1 && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Ótimo! Agora, vamos criar sua senha de acesso.
                        </span>

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

                        <input
                          ref={this.inputSenha1}
                          maxLength={6}
                          type="password"
                          value={this.state.senha1}
                          placeholder="Digite sua senha"
                          style={{ height: 40, width: "100%" }}
                          onChange={(e) =>
                            this.setState({ senha1: e.target.value })
                          }
                          onKeyDown={(e) => {
                            const senha = this.state.senha1;
                            if (senha.length > 0 && e.key === "Enter") {
                              this.setState({ liberarSenha2: true }, () => {
                                this.handleFocus(this.inputSenha2);
                              });
                            }
                          }}
                        />
                      </div>

                    )
                  }

                  {
                    this.state.liberarSenha2 && (

                       <div className="mt-3">
                        <span className="ttAgencia">
                          Repita a senha
                        </span>

                        <input
                          ref={this.inputSenha2}
                          maxLength={6}
                          type="password"
                          value={this.state.senha2}
                          placeholder="Repita sua senha"
                          style={{ height: 40, width: "100%" }}
                          onChange={(e) =>
                            this.setState({ senha2: e.target.value })
                          }
                          onKeyDown={(e) => {
                            const senha = this.state.senha2;
                            if (senha.length > 0 && e.key === "Enter") {
                              this.setSenha();
                            }
                          }}
                        />
                      </div>                       

                    )
                  }

                </> )
              }

              {
                (this.state.cadastro == "6") && ( <>

                  {
                    this.state.liberarRepTipodoc && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Precisamos da foto de um documento.
                          Qual documento você usará para abrir sua conta?
                        </span>

                        <div className="d-flex">
                          <Button
                            className="mr-3"
                            onClick={ () => {
                              this.salvarDormente('idoc', '1');
                              this.setState({ rep_tipodoc: '1', liberarRepDoc: true, liberarRepDocVerso: false, rep_doc: "", rep_docverso: "", rep_docnumero: "", rep_docemissao: "", rep_docorgao: "", rep_docestado: "", rep_passpais: "", rep_passnacionalidade: "", rep_passnaturalidade: "", rep_passvalidade: "" });
                            }}
                          >
                            RG
                          </Button>

                          <Button
                            className="mr-3"
                            onClick={ () => {
                              this.salvarDormente('idoc', '2');
                              this.setState({ rep_tipodoc: '2', liberarRepDoc: true, liberarRepDocVerso: false, rep_doc: "", rep_docverso: "", rep_docnumero: "", rep_docemissao: "", rep_docorgao: "", rep_docestado: "", rep_passpais: "", rep_passnacionalidade: "", rep_passnaturalidade: "", rep_passvalidade: "" });
                            }}
                          >
                            CNH
                          </Button>

                          <Button
                            className="mr-3"
                            onClick={ () => {
                              this.salvarDormente('idoc', '3');
                              this.setState({ rep_tipodoc: '3', liberarRepDoc: true, liberarRepDocVerso: false, rep_doc: "", rep_docverso: "", rep_docnumero: "", rep_docemissao: "", rep_docorgao: "", rep_docestado: "", rep_passpais: "", rep_passnacionalidade: "", rep_passnaturalidade: "", rep_passvalidade: "" });
                            }}
                          >
                            Passaporte
                          </Button>
                        </div>
                      </div>

                    )
                  }

                  {
                    this.state.liberarRepDoc && (

                      <div className="mt-3">
                        
                        {
                          this.state.rep_tipodoc == '1' ? (
                            <span className="ttAgencia">
                              Por favor, tire uma foto da frente do seu RG.
                            </span>
                          ) : this.state.rep_tipodoc == '2' ? (
                            <span className="ttAgencia">
                              Por favor, tire uma foto da frente da sua CNH.
                            </span>
                          ) : this.state.rep_tipodoc == '3' ? (
                            <span className="ttAgencia">
                              Por favor, tire uma foto do seu Passaporte.
                            </span>
                          ) : null
                        }

                        <input 
                          style={{ "display": "block" }}
                          type="file" 
                          accept="image/png, image/jpeg" 
                          onChange={(event) => {
                            this.uploadDoc(event);
                            
                          }} 
                        />
                        <br/>
                          {
                            (this.state.rep_doc.length > 0) && (
                              <img 
                                src={`data:image/jpeg;base64,${this.state.rep_doc}`}
                                style={{ maxWidth: '200px' }} 
                              />
                            )
                          }

                      </div>

                    )
                  }

                  {
                    this.state.liberarRepDocVerso && (

                      <div className="mt-3">

                        {
                          this.state.rep_tipodoc == '1' ? (
                            <span className="ttAgencia">
                              Agora, tire uma foto do verso do RG.
                            </span>
                          ) : this.state.rep_tipodoc == '2' ? (
                            <span className="ttAgencia">
                              Agora, tire uma foto do verso da CNH.
                            </span>
                          ) : this.state.rep_tipodoc == '3' ? (
                            <span className="ttAgencia">
                              Agora, tire uma foto da página do visto.
                            </span>
                          ) : null
                        }

                        <input 
                          style={{ "display": "block" }}
                          type="file" 
                          accept="image/png, image/jpeg" 
                          onChange={(event) => this.uploadDocVerso(event)} 
                        />
                        <br/>
                        {
                          (this.state.rep_docverso.length > 0) && (
                            <div className="w-100 d-flex">
                              <img 
                                src={`data:image/jpeg;base64,${this.state.rep_docverso}`}
                                style={{ maxWidth: '200px' }} 
                              />
                              <Button
                                variant="primary"
                                className="mt-auto ml-auto" 
                                onClick={ () => {
                                  this.setState({ 
                                    cadastro: "7"
                                  });
                                  localStorage.setItem("save", "7");
                                }}
                              >
                                Continuar
                              </Button>
                            </div>
                          )
                        }
                      </div>

                    )
                  }
                
                </> )
              }

              {
                (this.state.cadastro == "7") && ( <>
                
                  <hr className="divisoria" />

                  {
                    this.state.rep_tipodoc == '1' ? (
                      <span className="ttAgencia">
                        Insira o número do seu RG.
                      </span>
                    ) : this.state.rep_tipodoc == '2' ? (
                      <span className="ttAgencia">
                        Insira o número do sua CNH.
                      </span>
                    ) : this.state.rep_tipodoc == '3' ? (
                      <span className="ttAgencia">
                        Insira o número do seu Passaporte.
                      </span>
                    ) : null
                  }

                  <input
                    value={this.state.rep_docnumero}
                    placeholder="Digite o número do documento"
                    style={{ height: 40, width: "100%" }}
                    onChange={(e) =>
                      this.setState({ rep_docnumero: e.target.value })
                    }
                    onKeyDown={(e) => {
                      const numero = this.state.rep_docnumero.trim();
                      if (numero.length > 0 && e.key === "Enter") {

                        if (this.state.rep_tipodoc == '1') {
                          this.salvarDormente('representante_numerorg', numero);
                        } else if (this.state.rep_tipodoc == '2') {
                          this.salvarDormente('representante_numercnh', numero);
                        } else if (this.state.rep_tipodoc == '3') {
                          this.salvarDormente('numero_passaporte', numero);
                        }

                        this.setState({ liberarRepDocEmissao: true });
                      }
                    }}
                  />

                  {
                    this.state.liberarRepDocEmissao && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Insira a data de emissão
                        </span>

                        <input
                          type="date"
                          value={this.state.rep_docemissao}
                          style={{ height: 40, width: "100%" }}
                          onChange={(e) => {
                            this.setState({ rep_docemissao: e.target.value });

                            if (this.state.rep_tipodoc == '1') {
                              this.salvarDormente('representante_datarg', e.target.value + ' 00:00:00')
                              this.setState({ liberarRepDocOrgao: true });
                            } else if (this.state.rep_tipodoc == '2') {
                              this.salvarDormente('representante_datacnh', e.target.value + ' 00:00:00')
                              this.setState({ liberarRepDocOrgao: true });
                            } else if (this.state.rep_tipodoc == '3') {

                              this.salvarDormente('data_de_emissao_passaporte', e.target.value + ' 00:00:00')
                              this.setState({ liberarRepPassPais: true });
                            }
                          }}
                        />
                      </div>

                    )
                  }

                  {
                    this.state.liberarRepDocOrgao && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Insira o órgão expedidor
                        </span>

                        <Select
                          options={
                            [
                              { label: "SSP" },
                              { label: "DETRAN" },
                              { label: "IFP" },
                              { label: "IPF" },
                              { label: "POM" },
                              { label: "SPTC" },
                              { label: "MMA" },
                              { label: "SEDS" },
                              { label: "TSE" },
                              { label: "DPT" },
                              { label: "CRA" },
                              { label: "FLS" },
                              { label: "FGTS" },
                              { label: "OAB" },
                              { label: "TEM" },
                              { label: "DPF" },
                            ]
                          }
                          placeholder="Selecione o órgão expedidor"
                          // value={this.state.rep_docorgao}
                          onChange={(selectedOption) => {
                            this.setState({
                              liberarRepDocEstado: true
                            });
                            if (this.state.rep_tipodoc == '1') {
                              this.salvarDormente('representante_orgaorg', selectedOption.label);
                            } else if (this.state.rep_tipodoc == '2') {
                              this.salvarDormente('representante_orgacnh', selectedOption.label);
                            }

                           
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              height: 40,
                              minHeight: 40,
                            }),
                            placeholder: (base) => ({
                              ...base,
                              fontSize: 14,
                            }),
                          }}
                        />
                        
                      </div>

                    )
                  }

                  {
                    this.state.liberarRepDocEstado && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Insira o estado emissor
                        </span>

                        <Select
                          options={
                            [
                              { label: "AC" },
                              { label: "AL" },
                              { label: "AM" },
                              { label: "AP" },
                              { label: "BA" },
                              { label: "CE" },
                              { label: "DF" },
                              { label: "ES" },
                              { label: "GO" },
                              { label: "MA" },
                              { label: "MT" },
                              { label: "MS" },
                              { label: "MG" },
                              { label: "PA" },
                              { label: "PB" },
                              { label: "PR" },
                              { label: "PE" },
                              { label: "PI" },
                              { label: "RJ" },
                              { label: "RN" },
                              { label: "RS" },
                              { label: "RO" },
                              { label: "RR" },
                              { label: "SC" },
                              { label: "SP" },
                              { label: "SE" },
                              { label: "TO" },
                            ]
                          }
                          placeholder="Selecione o estado emissor"
                          // value={this.state.rep_docorgao}
                          onChange={(selectedOption) => {
                            if (this.state.rep_tipodoc == '1') {
                              this.salvarDormente('representante_ufrg', selectedOption.label);
                            } else if (this.state.rep_tipodoc == '2') {
                              this.salvarDormente('representante_ufcnh', selectedOption.label);
                            }

                            this.setState({ 
                              cadastro: "8"
                            });
                            localStorage.setItem("save", "8");
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              height: 40,
                              minHeight: 40,
                            }),
                            placeholder: (base) => ({
                              ...base,
                              fontSize: 14,
                            }),
                          }}
                        />
                      </div>

                    )
                  }

                  {
                    this.state.liberarRepPassPais && (
                      <div className="mt-3">
                        <span className="ttAgencia">
                          Insira o país emissor.
                        </span>

                        <input
                          value={this.state.rep_passpais}
                          placeholder="Digite o país emissor"
                          style={{ height: 40, width: "100%" }}
                          onChange={(e) =>
                            this.setState({ rep_passpais: e.target.value })
                          }
                          onKeyDown={(e) => {
                            const pais = this.state.rep_passpais.trim();
                            if (pais.length > 0 && e.key === "Enter") {
                              this.salvarDormente('pais_emissor_passaporte', pais);
                              this.setState({ liberarRepPassNaci: true });
                            }
                          }}
                        />
                      </div>
                    )
                  }

                  {
                    this.state.liberarRepPassNaci && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Insira a nacionalidade
                        </span>

                        <input
                          value={this.state.rep_passnaci}
                          placeholder="Digite o nome da nacionalidade"
                          style={{ height: 40, width: "100%" }}
                          onChange={(e) =>
                            this.setState({ rep_passnaci: e.target.value })
                          }
                          onKeyDown={(e) => {
                            const naci = this.state.rep_passnaci.trim();
                            if (naci.length > 0 && e.key === "Enter") {
                              this.salvarDormente('nacionalidade_passaporte', naci);
                              this.setState({ liberarRepPassNatu: true });
                            }
                          }}
                        />
                      </div>

                    )
                  }

                  {
                    this.state.liberarRepPassNatu && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Insira a naturalidade
                        </span>

                        <input
                          value={this.state.rep_passnatu}
                          placeholder="Digite o nome da naturalidade"
                          style={{ height: 40, width: "100%" }}
                          onChange={(e) =>
                            this.setState({ rep_passnatu: e.target.value })
                          }
                          onKeyDown={(e) => {
                            const natu = this.state.rep_passnatu.trim();
                            if (natu.length > 0 && e.key === "Enter") {
                              this.salvarDormente('naturalidade_passaporte', natu);
                              this.setState({ liberarRepPassValidade: true });
                            }
                          }}
                        />
                      </div>

                    )
                  }

                  {
                    this.state.liberarRepPassValidade && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Insira a data de validade do passaporte
                        </span>

                        <input
                          type="date"
                          value={this.state.rep_passvalidade}
                          style={{ height: 40, width: "100%" }}
                          onChange={(e) => {
                            this.setState({ rep_passvalidade: e.target.value });

                            this.salvarDormente('validade_passaporte', e.target.value + ' 00:00:00')
                            this.setState({
                              cadastro: "8"
                            });
                            localStorage.setItem("save", "8");
                          }}
                        />
                      </div>

                    )
                  }
                
                </> )
              }

              {
                (this.state.cadastro == "8") && ( <>
                
                  <hr className="divisoria" />

                  <span className="ttAgencia">
                    Precisamos da sua selfie em PNG ou JPG.
                  </span>

                  <div>
                    <ul className="ml-2">
                      <li>-Importante estar em local com boa iluminação.</li>
                      <li>-Não estar usando boné, chapéu ou quaisquer adereços que interfiram em seu rosto.</li>
                      <li>-Retire óculos de Sol ou de grau.</li>
                    </ul>

                    <span className="ttAgencia">
                      Precisamos da sua selfie.
                    </span>
                  </div>

                  <input 
                    style={{ "display": "block" }}
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={(event) => this.uploadSelfie(event)} 
                  />
                  <br/>
                  {
                    (this.state.rep_selfie.length > 0) && (
                      <div className="w-100 d-flex">
                        <img 
                          src={`data:image/jpeg;base64,${this.state.rep_selfie}`}
                          style={{ maxWidth: '200px' }} 
                        />
                      </div>
                    )
                  }

                  {
                    this.state.liberarRepComprovante && (

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Agora precisamos de uma foto do seu comprovante de residência em PNG ou JPG.
                        </span>

                        <input 
                          style={{ "display": "block" }}
                          type="file" 
                          accept="image/png, image/jpeg" 
                          onChange={(event) => this.uploadRepComprovante(event)} 
                        />
                        <br/>
                        {
                          (this.state.rep_comprovante.length > 0) && (
                            <div className="w-100 d-flex">
                              <img 
                                src={`data:image/jpeg;base64,${this.state.rep_comprovante}`}
                                alt="Comprovante de endereço"
                                style={{ maxWidth: '200px' }} 
                              />
                              <Button
                                variant="primary"
                                className="mt-auto ml-auto" 
                                onClick={ () => {
                                  this.setState({ 
                                    cadastro: "9"
                                  });
                                  localStorage.setItem("save", "9");
                                }}
                              >
                                Continuar
                              </Button>
                            </div>
                          )
                        }
                        
                      </div>

                    )
                  }

                </> )
              }

              {
                (this.state.cadastro == "9") && ( <>
                
                  <hr className="divisoria" />

                  <span className="ttAgencia">
                    Informe seu CEP.
                  </span>

                  <input
                    maxLength={9} // Limite do formato com máscara
                    value={Formatar.cep_mask(this.state.rep_cep)}
                    placeholder="00000-000"
                    style={{ height: 40, width: "100%" }}
                    onChange={(e) => {
                      this.setState({ rep_cep: e.target.value })
                    }}
                    onKeyDown={(e) => {
                      const cep = this.state.rep_cep;
                      if (cep.length > 0 && e.key === "Enter") {
                        if (cep.length === 9){
                          this.consultarRepCEP();
                        } else {
                          alert("Por favor, termine de digitar o CEP.");
                        }
                      }
                    }}
                  />

                  {
                    this.state.liberarRepEnderecoCompleto && ( 

                      <div className="mt-3">
                        <span className="ttAgencia">
                          Endereço completo
                        </span>

                        <input
                          value={
                            this.state.rep_endereco + ' ' + 
                            this.state.rep_numero + ', ' + 
                            this.state.rep_complemento + ((this.state.rep_complemento == "") ? '' : ', ') +
                            this.state.rep_bairro + ', ' + 
                            this.state.rep_cidade + ' - ' + 
                            this.state.rep_estado + ' - CEP ' + 
                            this.state.rep_cep
                          }
                          disabled
                          style={{ height: 40, width: "100%" }}
                        />
                      </div>

                    )
                  }

                  {
                    this.state.liberarRepProcuracao && (
                      <div className="mt-3">
                        <span className="ttAgencia">
                          Precisamos da procuração do Representante em PDF.
                        </span>

                        <input 
                          style={{ "display": "block" }}
                          type="file" 
                          accept="image/png, image/jpeg, application/pdf" 
                          onChange={(event) => this.uploadProcuracao(event)} 
                        />
                        <br/>
                        {
                          (this.state.rep_procuracao.length > 0) && (
                            <h6>PROCURAÇÃO CARREGADA COM SUCESSO</h6>
                          )
                        }
                      </div>
                    )
                  }

                  {
                    this.state.liberarRepPolitico && (
                      <div className="mt-3">
                        <span className="ttAgencia">
                          Você é uma pessoa politicamente exposta? Fique tranquilo, isso não impossibilita sua abertura de conta.
                        </span>

                        <div className="w-100 d-flex">
                        <input
                          type="checkbox"
                          // value="opcao3"
                          // checked={selectedValue === 'opcao3'}
                          onChange={() => {
                            const rep_politico = !this.state.rep_politico;
                            this.setState({ rep_politico });
                            let value;
                            if (rep_politico) {
                              value = '1';
                            } else {
                              value = '0';
                            }
                            this.salvarDormente('politico', value);
                          }}
                        />
                        &nbsp;&nbsp;Sim, eu sou politicamente exposto

                        <Button 
                          className="ml-auto"
                          onClick={() => this.concluir()}
                        >
                          Concluir cadastro
                        </Button>
                        </div>


                      </div>
                    )
                  }

                </> )
              }

            </div>
          </div>


          <Modal
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
                Declaro que li e aceito os termos de uso e de privacidade {process.env.NOME_BANCO}
              </Button>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              (O botão de aceitar está no final dos termos.)
            </Modal.Footer>
          </Modal>

          <Modal
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
                    // this.salvarEndereco();
                    this.setState({
                      cepModal: false,
                      // liberarEnderecoCompleto: true,
                      // liberarComprovante: true,
                    });
                  }
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            size="lg"
            show={this.state.smsModal}
            onHide={() => this.setState({ smsModal: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>Enviamos um código via SMS para seu número. Informe o código.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>

                  <input
                    value={this.state.sms}
                    style={{ height: 40, width: "100%" }}
                    maxLength={6} // Limite do formato com máscara
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      this.setState({ sms: numericValue.length > 0 ? numericValue : "" });
                    }}
                  />

              </Container>
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
            size="lg"
            show={this.state.tokenModal}
            onHide={() => this.setState({ tokenModal: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>Enviamos um token para seu e-mail. Informe o token.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>

                  <input
                    value={this.state.token}
                    style={{ height: 40, width: "100%" }}
                    maxLength={6}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      this.setState({ token: numericValue.length > 0 ? numericValue : "" });
                    }}
                  />

              </Container>
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
            size="lg"
            show={this.state.rep_cepModal}
            onHide={() => this.setState({ rep_cepModal: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirme se as informações de endereço estão corretas. Você pode editá-las se precisar.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <span className="ttAgencia">
                  CEP
                </span>
                <input
                  value={this.state.rep_cep}
                  style={{ height: 40, width: "100%" }}
                  disabled
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Endereço
                </span>
                <input
                  value={this.state.rep_endereco}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const rep_endereco = e.target.value.trim();
                    this.setState({ rep_endereco });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Número
                </span>
                <input
                  value={this.state.rep_numero}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const rep_numero = e.target.value.trim();
                    this.setState({ rep_numero });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Complemento
                </span>
                <input
                  value={this.state.rep_complemento}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const rep_complemento = e.target.value.trim();
                    this.setState({ rep_complemento });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Bairro
                </span>
                <input
                  value={this.state.rep_bairro}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const rep_bairro = e.target.value.trim();
                    this.setState({ rep_bairro });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Cidade
                </span>
                <input
                  value={this.state.rep_cidade}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const rep_cidade = e.target.value.trim();
                    this.setState({ rep_cidade });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Estado
                </span>
                <input
                  value={this.state.rep_estado}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const rep_estado = e.target.value.trim();
                    this.setState({ rep_estado });
                  }}
                />
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  if (this.state.rep_numero == '' || this.state.rep_endereco == '' || this.state.rep_numero == '' || this.state.rep_bairro == '' || this.state.rep_cidade == '' || this.state.rep_estado == '') {
                    alert('Por favor, complete o endereço de sua empresa.');
                  } else {
                    this.salvarRepEndereco();
                    this.setState({
                      rep_cepModal: false,
                      liberarRepEnderecoCompleto: true,
                      liberarRepProcuracao: true,
                    });
                  }
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            size="md"
            show={this.state.statusModal}
          >
            <Modal.Body>
              <Container>
                Deseja continuar o cadastro da conta de CNPJ {Formatar.cnpj_mask(this.state.cnpj)}?
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
                  this.setState({ statusModal: false, cnpj: "" });
                  localStorage.removeItem("cnpj");
                  localStorage.removeItem("save");
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
