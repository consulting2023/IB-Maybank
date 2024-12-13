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
import i18n from "../../tradutor/tradutor";
import LangButton from "../../components/langButton/LangButton";
import Select from "react-select";
import * as Formatar from "../../constants/Formatar";
export default class CadastroPj extends Component {
  constructor() {
    super();
    this.state = {
      cadastroPt1: true,
      cadastroPt2: false,
      cadastroPt3: false,
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
    };
  }
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
        this.setState({ liberarTelefone: true });
      } else {
        alert("CNPJ invalido, tente novamente");
      }
    });
  };

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
            {/* Campos de Login */}
            <div className="cadastropj select-none d-flex align-items-center">
              <div className="w-100">
                <div>
                  {this.state.cadastroPt1 ? (
                    <div>
                      <h1 className="mb-2">
                        Iremos começar o cadastro da sua conta PJ
                        <br></br>
                        (Aperte Enter para continuar)
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
                      {this.state.liberarCNPJ ? (
                        <>
                          <span className="ttAgencia">
                            Informe o CNPJ da empresa
                          </span>
                          <br />
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
                        </>
                      ) : null}

                      {this.state.liberarTelefone ? (
                        <>
                          <span className="ttAgencia">
                            Informe o Telefone da empresa
                          </span>
                          <br />
                          <input
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
                                if(cel.length === 15) {
                                  this.salvarDormente('telefone', cel.replace(/\s+/g, ""))
                                  this.setState({ liberarEmail: true });
                                } else {
                                  alert("Por favor, termine de digitar o telefone.");
                                }
                              }
                            }}
                          />
                        </>
                      ) : null}

                      {this.state.liberarEmail ? (
                        <>
                          <span className="ttAgencia">
                            Informe o Email da empresa
                          </span>
                          <br />
                          <input
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
                        </>
                      ) : null}
                    </div>
                  ) : null}

                  {this.state.cadastroPt2 ? (
                    <div>
                      <h1 className="mb-2">
                        (Aperte Enter para continuar)
                      </h1>
                      <hr className="divisoria" />
                      <span className="ttAgencia">
                        Informe a Razão Social da empresa
                      </span>
                      <br />
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
                            this.setState({ liberarFantasia: true });
                          }
                        }}
                      />
                      {this.state.liberarFantasia ? (
                        <div>
                          <span className="ttAgencia">
                            Informe o Nome Fantasia da empresa
                          </span>
                          <br />
                          <input
                            value={this.state.nomeFantasia}
                            placeholder="Digite a Nome Fantasia"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({ nomeFantasia: e.target.value })
                            }
                            onKeyDown={(e) => {
                              const nomeFantasia = this.state.nomeFantasia.trim();
                              if (nomeFantasia.length > 0 && e.key === "Enter") {
                                this.salvarDormente('nome_fantasia', nomeFantasia);
                                this.setState({ liberarInscricao: true });
                              }
                            }}
                          />
                        </div>
                      ) : null}
                      {this.state.liberarInscricao ? (
                        <>
                          <span className="ttAgencia">
                            Informe a Inscrição Estadual da empresa
                          </span>
                          <br />
                          <input
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
                                this.setState({ liberaFaturamento: true });
                              }
                            }}
                          />
                        </>
                      ) : null}

                      {this.state.liberaFaturamento ? (
                        <>
                          <span className="ttAgencia">
                            Informe o Faturamento da empresa
                          </span>
                          <br />
                          <input
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
                              if (faturamento.length > 0 && e.key === "Enter") {
                                // Validação: verifica se há um valor válido
                                this.salvarDormente('faturamento', faturamento);
                                this.setState({ liberarContribuicao: true });
                              }
                            }}
                          />
                        </>
                      ) : null}

                      {this.state.liberarContribuicao ? (
                        <>
                          <span className="ttAgencia">
                            Informe a Contribuição da empresa
                          </span>
                          <br />
                          <input
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
                        </>
                      ) : null}
                    </div>
                  ) : null}

                  {this.state.cadastroPt3 ? (
                    <div>
                      <h1 className="mb-2">
                        (Aperte Enter para continuar)
                      </h1>
                      <hr className="divisoria" />
                      <span className="ttAgencia">
                        Informe a data de abertura da empresa
                      </span>
                      <br />
                      <input
                        type="date"
                        value={this.state.dataAbertura}
                        placeholder="Digite a Razão Social"
                        style={{ height: 40 }}
                        onChange={(e) => {
                          this.salvarDormente('dataabertura', e.target.value + ' 00:00:00')
                          this.setState({ dataAbertura: e.target.value })
                        }
                        }
                      />
                      {this.state.liberarCnae ? (
                        <div>
                          <span className="ttAgencia">
                            Informe a CNAE da empresa
                          </span>
                          <br />
                          <input
                            value={this.state.Cnae}
                            placeholder="Digite a Nome Fantasia"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({ nomeFantasia: e.target.value })
                            }
                            onKeyDown={(e) => {
                              const nomeFantasia = this.state.nomeFantasia.trim();
                              if (nomeFantasia.length > 0 && e.key === "Enter") {
                                this.salvarDormente('nome_fantasia', nomeFantasia);
                                this.setState({ liberarInscricao: true });
                              }
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {/* <Button onClick={() => this.validarCNPJ()}>Teste</Button> */}
                </div>

                <br />
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
