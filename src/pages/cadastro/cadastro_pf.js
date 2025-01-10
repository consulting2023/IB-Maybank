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
export default class CadastroPf extends Component {
  constructor() {
    super();
    this.state = {
      cadastro: '0',

      agencias: [],
      valueAgencia: "",
      agenciaNome: "",
      agenciaNumero: "",

      liberarCPF: false,
      cpf: "",

      liberarTelefone: false,
      celEmpresa: "",

      liberarEmail: false,
      emailEmpresa: "",

      razaoSocial: "",

      liberarFantasia: false,
      nomeFantasia: "",

      liberarInscricao: false,
      inscricaoEstadual: "",

      faturamento: "",
      liberaFaturamento: false,

      liberarContribuicao: false,

      termo: "",
      termoModal: false,

      dataAbertura: "",

      liberarCnae: false,
      cnae: "",

      liberarCep: false,
      cep: "",
      cepModal: false,
      endereço: "",
      numero: "",
      complemento: "", 
      bairro: "",
      cidade: "",
      estado: "",
      liberarEnderecoCompleto: false,

      liberarComprovante: false,
      comprovante: "",

      cartao: "",

      liberarContrato: false,
      contrato: "",

      rep_nome:"",

      liberarRepCpf: false,
      rep_cpf: "",

      liberarRepCelular: false,
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

      liberarRepNomeMae: false,
      rep_nomeMae: "",

      liberarRepData: false,
      rep_data: "",

      liberarRepGenero: false,

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

      liberarRepCep: false,
      rep_cep: "",
      rep_cepModal: false,
      rep_endereço: "",
      rep_numero: "",
      rep_complemento: "", 
      rep_bairro: "",
      rep_cidade: "",
      rep_estado: "",
      liberarRepEnderecoCompleto: false,

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
          this.salvarDormente('imagecomprovante', base64String)
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
            liberarContrato: true
          });
          this.salvarDormente('imagecnpj', base64String)
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
            contrato: base64String,
          });
  
          // Salvar os dados no backend ou localmente
          this.salvarDormente('imagecontrato', base64String);
        };
  
        // Escolhe o método de leitura com base no tipo
        if (file.type === 'application/pdf') {
          reader.readAsArrayBuffer(file); // PDFs precisam de ArrayBuffer
        } else {
          reader.readAsDataURL(file); // Imagens podem ser lidas como Data URL
        }
      } else {
        // Caso o arquivo seja inválido
        alert('Arquivo inválido. Apenas arquivos PNG, JPEG e PDF são aceitos.');
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

          this.salvarDormente('imagecomprovante_endereco', base64String)
        };

        reader.readAsDataURL(file);
      }
    } else {
      this.setState({rep_comprovante: ''});
    }
  };

  uploadProcuracao = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          const binaryString = reader.result;
          const base64String = btoa(binaryString);
  
          this.setState({
            rep_procuracao: base64String,
            liberarRepPolitico: true,
          });
  
          this.salvarDormente('representante_procuracao', base64String);
        };
  
        // Aqui usamos `readAsBinaryString` diretamente
        reader.readAsBinaryString(file);
      } else {
        alert('Arquivo inválido. Apenas arquivos PNG, JPEG e PDF são aceitos.');
        this.setState({
          rep_procuracao: '',
        });
      }
    } else {
      this.setState({ rep_procuracao: '' });
    }
  };

  validarCPF = () => {
    const data = {
      url: 'usuario/valida-cpf',
      data: {
        cpf: this.state.cpf,
        agencia: this.state.valueAgencia.value,
        tipo: "pf",
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((res) => {
      console.log(res);
      // if (res) {
      //   this.salvarDormente('agencia', this.state.agenciaNumero);
      //   localStorage.setItem("cpf", this.state.cpf);
      //   this.setState({ cadastro: "4" });
      // } else {
      //   alert("CNPJ invalido, tente novamente");
      // }
    });
  };

  consultarCEP = () => {
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
        } else {
          this.setState({
            cepModal: true,
            endereço: res.logradouro,
            complemento: res.complemento,
            bairro: res.bairro,
            cidade: res.localidade,
            estado: this.nomeParaSigla(res.estado)
          });
        }
      } else {
        alert("Erro ao consultar CEP, tente novamente");
      }
    });
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
    this.salvarDormente('endereco', this.state.endereço);
    this.salvarDormente('numero', this.state.numero);
    this.salvarDormente('bairro', this.state.bairro);
    this.salvarDormente('cidade', this.state.cidade);
    this.salvarDormente('estado', this.state.estado);
    if (this.state.complemento != '') {
      this.salvarDormente('complemento', this.state.complemento);
    }
  };

  consultarRepCEP = () => {
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
        } else {
          this.setState({ 
            rep_cepModal: true,
            rep_endereço: res.logradouro,
            rep_complemento: res.complemento,
            rep_bairro: res.bairro,
            rep_cidade: res.localidade,
            rep_estado: this.nomeParaSigla(res.estado)
          });
        }
      } else {
        alert("Erro ao consultar CEP, tente novamente");
      }
    });
  };

  salvarRepEndereco = () => {
    this.salvarDormente('representante_cep', this.state.rep_cep);
    this.salvarDormente('representante_endereco', this.state.rep_endereço);
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
      url: "dormente-pf/previa",
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
      url: "dormente-pf/concluir",
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

          <div className="h-80 d-flex flex-row align-items-center justify-content-center">

            <div className="cadastropj select-none d-flex align-items-center">
              <div className="w-100">
                <span style={{ color: 'white' }}>
                  (Aperte Enter dentro da caixa de texto para cadastrar a informação pedida.)
                </span>
                { 
                  (this.state.cadastro == "0") && ( <>

                    <h1 className="mb-2">
                      Iremos começar o cadastro da sua conta PJ
                    </h1>
                      
                    <hr className="divisoria" />

                    <span className="ttAgencia">Escolha a Agencia</span>
                    <Select
                      options={this.state.agencias.map((agencia) => ({
                        value: agencia.id,
                        label: agencia.nome, // Exibe o nome da agência no dropdown
                        number: agencia.numero
                      }))}
                      placeholder="Agência"
                      value={this.state.valueAgencia} // Passa o objeto selecionado ou `null`
                      onChange={(selectedOption) => {
                        this.setState({
                          valueAgencia: selectedOption, // Atualiza o estado com o objeto selecionado
                          agenciaNome: selectedOption.label,
                          agenciaNumero: selectedOption.number,
                          liberarCPF: true, // Guarda o nome da agência selecionada
                        });
                      }}
                      isSearchable
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

                    {
                      this.state.liberarCPF && ( 
                      
                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe seu CPF
                          </span>

                          <input
                            value={Formatar.cpf_mask(this.state.cpf)}
                            placeholder="000.000.000-00"
                            style={{ height: 40, width: "100%" }}
                            maxLength={14}
                            onChange={(e) => {
                              // Remove a máscara e atualiza o estado com apenas os números
                              const cpf = e.target.value.replace(/\D/g, "");
                              this.setState({ cpf });
                            }}
                            onKeyDown={(e) => {
                              const cpf = this.state.cpf; 
                              if (cpf.length > 0 && e.key === "Enter") {
                                if(cpf.length === 11) {
                                  this.validarCPF();
                                } else {
                                  alert("Por favor, termine de digitar o CPF.");
                                }
                              }
                            }}
                          />
                        </div> 

                      )
                    }

                  </> )
                }

                {
                  (this.state.cadastro == "4") && ( <>

                    <hr className="divisoria" />

                    <span className="ttAgencia">
                      Por favor, informe o nome completo do Representante.
                    </span>

                    <input
                      value={this.state.rep_nome}
                      style={{ height: 40, width: "100%" }}
                      onChange={(e) => {
                        this.setState({ rep_nome: e.target.value });
                      }}
                      onKeyDown={(e) => {
                        const rep_nome = this.state.rep_nome.trim(); 
                        if (rep_nome.length > 0 && e.key === "Enter") {
                          this.salvarDormente('representante_nome', rep_nome)
                          this.setState({ liberarRepCpf: true }, () => {
                            this.handleFocus(this.inputRepCpf);
                          });
                        }
                      }}
                    />

                    {
                      this.state.liberarRepCpf && (
                        <div className="mt-3">
                          <span className="ttAgencia">
                            Por favor, informe o CPF do Representante.
                          </span>

                          <input
                            ref={this.inputRepCpf}
                            value={Formatar.cpf_mask(this.state.rep_cpf)}
                            placeholder="000.000.000-00"
                            style={{ height: 40, width: "100%" }}
                            maxLength={14}
                            onChange={(e) => {
                              const rep_cpf = e.target.value.replace(/\D/g, "");
                              this.setState({ rep_cpf });
                            }}
                            onKeyDown={(e) => {
                              const rep_cpf = this.state.rep_cpf; 
                              if (rep_cpf.length > 0 && e.key === "Enter") {
                                if(rep_cpf.length === 11) {
                                  this.salvarDormente('representante_cpf', rep_cpf);
                                  this.setState({ liberarRepCelular: true }, () => {
                                    this.handleFocus(this.inputRepCelular);
                                  });
                                } else {
                                  alert("Por favor, termine de digitar o CPF.");
                                }
                              }
                            }}
                          />
                        </div>
                      )
                    }

                    {
                      this.state.liberarRepCelular && (

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Por favor, informe o número de celular do Representante.
                          </span>

                          <input
                            ref={this.inputRepCelular}
                            value={this.state.rep_celular}
                            // placeholder="(00) 00000-0000"
                            style={{ height: 40, width: "100%" }}
                            maxLength={15} // Limite do formato com máscara
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              const numericValue = rawValue.replace(/\D/g, "");
                              const formattedValue = Formatar.formatarTelefone(numericValue); // Reaplica a máscara

                              this.setState({
                                rep_celular: numericValue.length > 0 ? formattedValue : "",
                              });
                            }}
                            onKeyDown={(e) => {
                              const cel = this.state.rep_celular;
                              if (cel.length > 0 && e.key === "Enter") {
                                if(cel.length > 13){
                                  this.salvarDormente('representante_celular', cel.replace(/\s+/g, ""));
                                  this.sms_envia(); 
                                } else {
                                  alert("Por favor, termine de digitar o telefone.");
                                }
                              }
                            }}
                          />
                        </div>

                      )
                    }

                  </> )
                }

                {
                  (this.state.cadastro == "5") && ( <>

                    <hr className="divisoria" />

                    <span className="ttAgencia">
                      Informe o email do Representante
                    </span>

                    <input
                      ref={this.inputRepEmail}
                      value={this.state.rep_email}
                      placeholder="Digite o e-mail do representante"
                      style={{ height: 40, width: "100%" }}
                      onChange={(e) =>
                        this.setState({ rep_email: e.target.value })
                      }
                      onKeyDown={(e) => {
                        const email = e.target.value;
                        if (email.length > 0 && e.key === "Enter") {
                          const email = this.state.rep_email;
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (emailRegex.test(email)) {
                            this.salvarDormente('representante_email', email);
                            this.email_envia(); 
                          } else {
                            alert("Por favor, insira um e-mail válido.");
                          }
                        }
                      }}
                    />

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

                    {
                      this.state.liberarRepNomeMae && (

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Por favor, insira o nome completo da sua mãe.
                          </span>

                          <input
                            ref={this.inputRepNomeMae}
                            value={this.state.rep_nomeMae}
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({ rep_nomeMae: e.target.value })
                            }
                            onKeyDown={(e) => {
                              const nomeMae = this.state.rep_nomeMae.trim();
                              if (nomeMae.length > 0 && e.key === "Enter") {
                                this.salvarDormente('representante_nomemae', nomeMae);
                                this.setState({ liberarRepData: true }, () => {
                                  this.handleFocus(this.inputRepData);
                                });
                              }

                            }}
                          />
                        </div>

                      )
                    }

                    {
                      this.state.liberarRepData && (

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Por favor, informe a data de nascimento do Representante.
                          </span>

                          <input
                            ref={this.inputRepData}
                            type="date"
                            value={this.state.rep_data}
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) => {
                              this.salvarDormente('representante_data_nascimento', e.target.value + ' 00:00:00')
                              this.setState({ 
                                rep_data: e.target.value, 
                                liberarRepGenero: true 
                              }, () => {
                                this.handleFocus(this.inputRepGenero);
                              })
                            }}
                          />
                        </div>

                      )
                    }

                    {
                      this.state.liberarRepGenero && (

                         <div className="mt-3">
                          <span className="ttAgencia">
                            Escolha o gênero
                          </span>

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
                              this.salvarDormente('representante_sexo', selectedOption.value);
                              this.setState({
                                // rep_genero: selectedOption,
                                cadastro: "6"
                              });
                              localStorage.setItem("save", "6");
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

                  </> )
                }

                {
                  (this.state.cadastro == "6") && ( <>
                  
                    <hr className="divisoria" />

                    <span className="ttAgencia">
                      Informe seu estado civil
                    </span>

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
                        this.salvarDormente('representante_estado_civil', selectedOption.label);
                        this.setState({
                          liberarRepTipodoc: true
                        });
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
                                  alt="Comprovante de endereço"
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
                                  alt="Comprovante de endereço"
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
                            alt="Comprovante de endereço"
                            style={{ maxWidth: '200px' }} 
                          />
                        </div>
                      )
                    }

                    {
                      this.state.liberarRepComprovante && (

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Agora precisamos do seu comprovante de residência em PNG ou JPG.
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
                              this.state.rep_endereço + ' ' + 
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
                            Precisamos da procuração do Representante.
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
                                value = 1;
                              } else {
                                value = 0;
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
            onHide={() => this.setState({ cepModal: false })}
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
                  value={this.state.cep}
                  style={{ height: 40, width: "100%" }}
                  disabled
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Endereço
                </span>
                <input
                  value={this.state.endereço}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const endereco = e.target.value.trim();
                    this.setState({ endereco });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Número
                </span>
                <input
                  value={this.state.numero}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const numero = e.target.value.trim();
                    this.setState({ numero });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Complemento
                </span>
                <input
                  value={this.state.complemento}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const complemento = e.target.value.trim();
                    this.setState({ complemento });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Bairro
                </span>
                <input
                  value={this.state.bairro}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const bairro = e.target.value.trim();
                    this.setState({ bairro });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Cidade
                </span>
                <input
                  value={this.state.cidade}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const cidade = e.target.value.trim();
                    this.setState({ cidade });
                  }}
                />

                <br />
                <br />
                <span className="ttAgencia">
                  Estado
                </span>
                <input
                  value={this.state.estado}
                  style={{ height: 40, width: "100%" }}
                  onChange={(e) => {
                    const estado = e.target.value.trim();
                    this.setState({ estado });
                  }}
                />
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  if (this.state.numero == '' || this.state.endereço == '' || this.state.numero == '' || this.state.bairro == '' || this.state.cidade == '' || this.state.estado == '') {
                    alert('Por favor, complete o endereço de sua empresa.');
                  } else {
                    this.salvarEndereco();
                    this.setState({
                      cepModal: false,
                      liberarEnderecoCompleto: true,
                      liberarComprovante: true,
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
                  value={this.state.rep_endereço}
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
                  if (this.state.rep_numero == '' || this.state.rep_endereço == '' || this.state.rep_numero == '' || this.state.rep_bairro == '' || this.state.rep_cidade == '' || this.state.rep_estado == '') {
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
                Deseja continuar o cadastro da conta de CPF {Formatar.cpf_mask(this.state.cpf)}?
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
