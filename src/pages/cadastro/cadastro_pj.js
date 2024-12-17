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
export default class CadastroPj extends Component {
  constructor() {
    super();
    this.state = {
      cadastroPt1: true,
      cadastroPt2: false,
      cadastroPt3: false,
      cadastroPt4: false,

      agencias: [],
      valueAgencia: "",
      agenciaNome: "",
      agenciaNumero: "",

      liberarCNPJ: false,
      cnpj: "",

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
      contribuicao: "",

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
      contrato: ""
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
  }

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
            // cadastroPt3: false,
            // cadastroPt4: true
          });
        };

        // Ler o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(file);
      }
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
            comprovante: base64String,
          });
        };

        // Ler o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(file);
      }
    }
  };

  componentDidMount = () => {
    this.agCadastro();
    this.buscarTermoUso();
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
        this.salvarDormente('agencia', this.state.agenciaNumero);
        this.setState({ liberarTelefone: true }, () => {
          this.handleFocus(this.inputTelefone);
        });
      } else {
        alert("CNPJ invalido, tente novamente");
      }
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
      if (!res) {
        alert("Falha ao cadastrar informações, tente novamente.");
        window.location.reload();
      } else {
        console.log(campo + ' ok');
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
              {Produtos.mostrar_tradutor ? (
                <li className="loginLangWrapper">
                  <LangButton langProp={this.traduzir} />
                </li>
              ) : null}
            </ul>
          </Container>

          <div className="h-80 d-flex flex-row align-items-center justify-content-center">

            <div className="cadastropj select-none d-flex align-items-center">
              <div className="w-100">
                (Aperte Enter para continuar para o próximo campo)

                { 
                  this.state.cadastroPt1 ? ( <>

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
                          liberarCNPJ: true, // Guarda o nome da agência selecionada
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
                      this.state.liberarCNPJ ? ( 
                      
                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe o CNPJ da empresa
                          </span>

                          <input
                            value={Formatar.cnpj_mask(this.state.cnpj)}
                            placeholder="00.000.000/0000-00"
                            style={{ height: 40, width: "100%" }}
                            maxLength={18}
                            onChange={(e) => {
                              // Remove a máscara e atualiza o estado com apenas os números
                              const cnpj = e.target.value.replace(/\D/g, "");
                              this.setState({ cnpj });
                            }}
                            onKeyDown={(e) => {
                              const cnpj = this.state.cnpj; 
                              if (cnpj.length > 0 && e.key === "Enter") {
                                if(cnpj.length === 14) {
                                  this.validarCNPJ();
                                } else {
                                  alert("Por favor, termine de digitar o CNPJ.");
                                }
                              }
                            }}
                          />
                        </div> 

                      ) : null
                    }

                    {
                      this.state.liberarTelefone ? ( 
                      
                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe o Telefone da empresa
                          </span>

                          <input
                            ref={this.inputTelefone}
                            value={this.state.celEmpresa}
                            // placeholder="(00) 00000-0000"
                            style={{ height: 40, width: "100%" }}
                            maxLength={15} // Limite do formato com máscara
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              const numericValue = rawValue.replace(/\D/g, ""); // Remove a máscara
                              const formattedValue = Formatar.formatarTelefone(numericValue); // Reaplica a máscara

                              // Permite apagar normalmente
                              this.setState({
                                celEmpresa: numericValue.length > 0 ? formattedValue : "",
                              });
                            }}
                            onKeyDown={(e) => {
                              const cel = this.state.celEmpresa;
                              if (cel.length > 0 && e.key === "Enter") {
                                if(cel.length > 13){
                                  this.salvarDormente('telefone', cel.replace(/\s+/g, ""))
                                  this.setState({ liberarEmail: true }, () => {
                                    this.handleFocus(this.inputEmail);
                                  });
                                } else {
                                  alert("Por favor, termine de digitar o telefone.");
                                }
                              }
                            }}
                          />
                        </div> 

                      ) : null
                    }

                    {
                      this.state.liberarEmail ? ( 

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe o Email da empresa
                          </span>

                          <input
                            ref={this.inputEmail}
                            value={this.state.emailEmpresa}
                            placeholder="Digite o e-mail da empresa"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({ emailEmpresa: e.target.value })
                            }
                            onKeyDown={(e) => {
                              const email = e.target.value;
                              if (email.length > 0 && e.key === "Enter") {
                                const email = this.state.emailEmpresa;
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (emailRegex.test(email)) {
                                  this.salvarDormente('email', email);
                                  this.setState({ termoModal: true });
                                } else {
                                  alert("Por favor, insira um e-mail válido.");
                                }
                              }
                            }}
                          />
                        </div> 

                      ) : null
                    }

                  </> ) : null 
                }

                {
                  this.state.cadastroPt2 ? ( <>

                    <hr className="divisoria" />

                    <span className="ttAgencia">
                      Informe a Razão Social da empresa
                    </span>

                    <input
                      value={this.state.razaoSocial}
                      placeholder="Digite a Razão Social"
                      style={{ height: 40, width: "100%" }}
                      onChange={(e) =>
                        this.setState({ razaoSocial: e.target.value })
                      }
                      onKeyDown={(e) => {
                        const razaoSocial = this.state.razaoSocial.trim();
                        if (razaoSocial.length > 0 && e.key === "Enter") {
                          this.salvarDormente('razao_social', razaoSocial);
                          this.setState({ liberarFantasia: true }, () => {
                            this.handleFocus(this.inputFantasia);
                          });
                        }
                      }}
                    />

                    {
                      this.state.liberarFantasia ? ( 

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe o Nome Fantasia da empresa
                          </span>

                          <input
                            ref={this.inputFantasia}
                            value={this.state.nomeFantasia}
                            placeholder="Digite o Nome Fantasia"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({ nomeFantasia: e.target.value })
                            }
                            onKeyDown={(e) => {
                              const nomeFantasia = this.state.nomeFantasia.trim();
                              if (nomeFantasia.length > 0 && e.key === "Enter") {
                                this.salvarDormente('nome_fantasia', nomeFantasia);
                                this.setState({ liberarInscricao: true }, () => {
                                  this.handleFocus(this.inputInscricao);
                                });
                              }
                            }}
                          />
                        </div> 

                      ) : null
                    }

                    {
                      this.state.liberarInscricao ? (

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe a Inscrição Estadual da empresa
                          </span>

                          <input
                            ref={this.inputInscricao}
                            value={this.state.inscricaoEstadual}
                            placeholder="Digite a Inscrição Estadual"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({
                                inscricaoEstadual: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              const inscricaoEstadual = this.state.inscricaoEstadual.trim();
                              if (inscricaoEstadual.length > 0 && e.key === "Enter") {
                                this.salvarDormente('inscricao_estadual', inscricaoEstadual);
                                this.setState({ liberaFaturamento: true }, () => {
                                  this.handleFocus(this.inputFaturamento);
                                });
                              }
                            }}
                          />
                        </div>

                      ) : null
                    }

                    {
                      this.state.liberaFaturamento ? ( 

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe o Faturamento da empresa
                          </span>

                          <input
                            ref={this.inputFaturamento}
                            value={this.state.faturamento}
                            placeholder="Digite o Faturamento"
                            style={{ height: 40, width: "100%" }}
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
                            onKeyDown={(e) => {
                              const faturamento = this.state.faturamento.trim();
                              console.log('faturamento', faturamento);
                              if (faturamento.length > 0 && e.key === "Enter") {
                                if (faturamento != "R$ 0,00") {
                                  this.salvarDormente('faturamento', faturamento);
                                  this.setState({ liberarContribuicao: true }, () => {
                                    this.handleFocus(this.inputContribuicao);
                                  });
                                } else {
                                  alert("Insira o valor de faturamento.");
                                }
                              }
                            }}
                          />
                        </div> 

                      ) : null
                    }

                    {
                      this.state.liberarContribuicao ? ( 

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe a Contribuição da empresa
                          </span>

                          <input
                            ref={this.inputContribuicao}
                            value={this.state.contribuicao}
                            placeholder="Digite a Contribuição"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({ contribuicao: e.target.value })
                            }
                            onKeyDown={(e) => {
                              const contribuicao = this.state.contribuicao.trim();
                              if (contribuicao.length > 0 && e.key === "Enter") {
                                this.salvarDormente('contribuicao', contribuicao);
                                this.setState({ cadastroPt2: false, cadastroPt3: true });
                              }
                            }}
                          />
                        </div>

                      ) : null
                    }

                  </> ) : null
                }

                {
                  this.state.cadastroPt3 ? ( <>

                    <hr className="divisoria" />

                    <span className="ttAgencia">
                      Informe a data de abertura da empresa
                    </span>

                    <input
                      type="date"
                      value={this.state.dataAbertura}
                      style={{ height: 40, width: "100%" }}
                      onChange={(e) => {
                        this.salvarDormente('dataabertura', e.target.value + ' 00:00:00')
                        this.setState({ dataAbertura: e.target.value, liberarCnae: true }, () => {
                          this.handleFocus(this.inputCnae);
                        })
                      }}
                    />

                    {
                      this.state.liberarCnae ? ( 

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe a CNAE da empresa
                          </span>

                          <input
                            ref={this.inputCnae}
                            value={Formatar.cnae_mask(this.state.cnae)}
                            placeholder="0000-0/00"
                            style={{ height: 40, width: "100%" }}
                            maxLength={9}
                            onChange={(e) =>
                              this.setState({ cnae: e.target.value })
                            }
                            onKeyDown={(e) => {
                              const nomeCnae = this.state.cnae;
                              if (nomeCnae.length > 0 && e.key === "Enter") {
                                if (nomeCnae.length === 9) {
                                  this.salvarDormente('cnae', nomeCnae);
                                  this.setState({ liberarCep: true }, () => {
                                    this.handleFocus(this.inputCep);
                                  });
                                } else {
                                  alert("Por favor, termine de digitar a CNAE.");
                                }
                              }
                            }}
                          />
                        </div>

                      ) : null
                    }

                    {
                      this.state.liberarCep ? ( 

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Informe a CEP da empresa
                          </span>

                          <input
                            ref={this.inputCep}
                            maxLength={9} // Limite do formato com máscara
                            value={Formatar.cep_mask(this.state.cep)}
                            placeholder="00000-000"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) => {
                              this.setState({ cep: e.target.value })
                            }}
                            onKeyDown={(e) => {
                              const cep = this.state.cnae;
                              if (cep.length > 0 && e.key === "Enter") {
                                if (cep.length === 9){
                                  this.consultarCEP();
                                } else {
                                  alert("Por favor, termine de digitar o CEP.");
                                }
                              }
                            }}
                          />
                        </div>

                      ) : null
                    }

                    {
                      this.state.liberarEnderecoCompleto ? ( 

                        <div className="mt-3">
                          <span className="ttAgencia">
                            Endereço
                          </span>

                          <input
                            value={
                              this.state.endereço + ' ' + 
                              this.state.numero + ', ' + 
                              this.state.complemento + ((this.state.complemento == "") ? '' : ', ') +
                              this.state.bairro + ', ' + 
                              this.state.cidade + ' - ' + 
                              this.state.estado + ' - CEP ' + 
                              this.state.cep
                            }
                            disabled
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) => {
                              this.setState({ cep: e.target.value })
                            }}
                            onKeyDown={(e) => {
                              const cep = this.state.cnae;
                              if (cep.length > 0 && e.key === "Enter") {
                                if (cep.length === 9){
                                  this.consultarCEP();
                                } else {
                                  alert("Por favor, termine de digitar o CEP.");
                                }
                              }
                            }}
                          />
                        </div>

                      ) : null
                    }

                    {
                      this.state.liberarComprovante ? ( 
                      
                        <div className="mt-3">
                          <span className="ttAgencia">
                            Agora precisamos do comprovante de endereço da empresa em PNG ou JPG.
                          </span>

                          <input 
                            style={{ "display": "block" }}
                            type="file" 
                            accept="image/png, image/jpeg" 
                            onChange={(event) => this.uploadComprovante(event)} 
                          />
                          <br/>
                          <div className="w-100">
                            {this.state.comprovante && <img src={`data:image/jpeg;base64,${this.state.comprovante}`} alt="Imagem em base64" style={{ maxWidth: '200px' }} />}

                            {
                              (this.state.comprovante != "") ? (
                                <button 
                                  className="float-right mt-auto" 
                                  type="button"
                                  onClick={ () => this.setState({ cadastroPt3: false, cadastroPt4: true }) }
                                >
                                  Continuar
                                </button>
                              ) : null
                            }
                          </div>

                        
                        </div>

                      ) : null
                    }

                  </> ) : null
                }

                {
                  this.state.cadastroPt4 ? ( <>

                    <hr className="divisoria" />

                    <span className="ttAgencia">
                      Agora precisamos da imagem do cartão CNPJ em PNG ou JPG.
                    </span>

                    <input 
                      style={{ "display": "block" }}
                      type="file" 
                      accept="image/png, image/jpeg" 
                      onChange={(event) => this.uploadComprovante(event)} 
                    />
                    <br/>
                    <div className="w-100">
                      {this.state.cartao && <img src={`data:image/jpeg;base64,${this.state.cartao}`} alt="Imagem em base64" style={{ maxWidth: '200px' }} />}

                      {
                        (this.state.cartao != "") ? (
                          <button 
                            className="float-right mt-auto" 
                            type="button"
                            onClick={ () => this.setState({ cadastroPt3: false, cadastroPt4: true }) }
                          >
                            Continuar
                          </button>
                        ) : null
                      }
                    </div>

                  </> ) : null
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
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({
                    cadastroPt1: false,
                    cadastroPt2: true,
                    termoModal: false,
                  });
                }}
              >
                Declaro que li e aceito os termos de uso e de privacidade {process.env.NOME_BANCO}
              </Button>
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
