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
      agencias: [],
      valueAgencia: "",
      agenciaNome: "",
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
    };
  }
  componentDidMount = () => {
    this.agCadastro();
  };

  agCadastro = () => {
    const data = {
      url: "agencia/lista",
      data: {},
      method: "GET",
    };
    Funcoes.Geral_API(data).then((res) => {
      this.setState({ agencias: res });
      console.log(res);
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
        this.setState({ liberarTelefone: true });
      } else {
        alert("CNPJ invalido, tente novamente");
      }
    });
  };

  handleTelefoneChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, ""); // Remove a máscara
    const formattedValue = Formatar.formatarTelefone(numericValue); // Reaplica a máscara

    // Permite apagar normalmente
    this.setState({
      celEmpresa: numericValue.length > 0 ? formattedValue : "",
    });

    if (rawValue.length === 15) {
      this.setState({ liberarEmail: true });
    }
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
                      </h1>
                      <hr className="divisoria" />
                      <span className="ttAgencia">Escolha a Agencia</span>
                      <Select
                        options={this.state.agencias.map((agencia) => ({
                          value: agencia.id,
                          label: agencia.nome, // Exibe o nome da agência no dropdown
                        }))}
                        placeholder="Agência"
                        value={this.state.valueAgencia} // Passa o objeto selecionado ou `null`
                        onChange={(selectedOption) => {
                          this.setState({
                            valueAgencia: selectedOption, // Atualiza o estado com o objeto selecionado
                            agenciaNome: selectedOption.label,
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
                              this.setState({ cnpj }, () => {
                                // Chama validarCNPJ após o estado ser atualizado
                                if (cnpj.length === 14) {
                                  this.validarCNPJ();
                                }
                              });
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
                            placeholder="(00) 00000-0000"
                            style={{ height: 40, width: "100%" }}
                            maxLength={15} // Limite do formato com máscara
                            onChange={this.handleTelefoneChange}
                          />
                        </>
                      ) : null}

                      {this.state.liberarEmail ? (
                        <>
                          <span className="ttAgencia">
                            Informe o Email da empresa (Aperte Enter para
                            continuar)
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
                              if (e.key === "Enter") {
                                const email = this.state.emailEmpresa;

                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (emailRegex.test(email)) {
                                  this.setState({
                                    cadastroPt1: false,
                                    cadastroPt2: true,
                                  });
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
                      <span className="ttAgencia">
                        Informe a Razão Social da empresa (Aperte Enter para
                        continuar)
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
                          if (e.key === "Enter") {
                            const razaoSocial = this.state.razaoSocial.trim();

                            if (razaoSocial.length > 0) {
                              // Prossegue para o próximo passo se a razão social for preenchida
                              this.setState({
                                liberarFantasia: true,
                              });
                            } else {
                              alert(
                                "Por favor, insira a Razão Social da empresa."
                              );
                            }
                          }
                        }}
                      />
                      {this.state.liberarFantasia ? (
                        <div>
                          <span className="ttAgencia">
                            Informe o Nome Fantasia da empresa (Aperte Enter
                            para continuar)
                          </span>
                          <br />
                          <input
                            value={this.state.razanomeFantasiaoSocial}
                            placeholder="Digite a Razão Social"
                            style={{ height: 40, width: "100%" }}
                            onChange={(e) =>
                              this.setState({ nomeFantasia: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const nomeFantasia =
                                  this.state.nomeFantasia.trim();

                                if (nomeFantasia.length > 0) {
                                  // Prossegue para o próximo passo se a razão social for preenchida
                                  this.setState({
                                    liberarInscricao: true,
                                  });
                                } else {
                                  alert(
                                    "Por favor, insira a Razão Social da empresa."
                                  );
                                }
                              }
                            }}
                          />
                        </div>
                      ) : null}
                      {this.state.liberarInscricao ? (
                        <>
                          <span className="ttAgencia">
                            Informe a Inscrição Estadual da empresa (Aperte
                            Enter para continuar)
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
                              if (e.key === "Enter") {
                                const inscricaoEstadual =
                                  this.state.inscricaoEstadual.trim();

                                // Validação: verifica se há um valor válido
                                if (inscricaoEstadual.length > 0) {
                                  // Prossegue para o próximo passo se a inscrição estadual for preenchida
                                  this.setState({
                                    liberaFaturamento: true,
                                  });
                                } else {
                                  alert(
                                    "Por favor, insira a Inscrição Estadual da empresa."
                                  );
                                }
                              }
                            }}
                          />
                        </>
                      ) : null}

                      {this.state.liberaFaturamento ? (
                        <>
                          <span className="ttAgencia">
                            Informe o Faturamento da empresa (Aperte Enter para
                            continuar)
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
                              if (e.key === "Enter") {
                                const faturamento =
                                  this.state.faturamento.trim();

                                // Validação: verifica se há um valor válido
                                if (faturamento.length > 0) {
                                  // Prossegue para o próximo passo se o faturamento for preenchido
                                  this.setState({
                                    liberarContribuicao: true,
                                  });
                                } else {
                                  alert(
                                    "Por favor, insira o Faturamento da empresa."
                                  );
                                }
                              }
                            }}
                          />
                        </>
                      ) : null}

                      {this.state.liberarContribuicao ? (
                        <>
                          <span className="ttAgencia">
                            Informe a Contribuição da empresa (Aperte Enter para
                            continuar)
                          </span>
                          <br />
                          <input
                            value={this.state.contribuicao}
                            placeholder="Digite a Contribuição"
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
                              ).format(numericValue / 100); // Divide por 100 apenas quando formatando para exibir centavos

                              // Atualiza o estado com o valor formatado
                              this.setState({ contribuicao: formattedValue });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const contribuicao =  
                                  this.state.contribuicao.trim();

                                // Validação: verifica se há um valor válido
                                if (contribuicao.length > 0) {
                                  // Prossegue para o próximo passo se a contribuição for preenchida
                                  this.setState({
                                    liberarProximoPasso: true, // Altere conforme necessário
                                  });
                                } else {
                                  alert(
                                    "Por favor, insira a Contribuição da empresa."
                                  );
                                }
                              }
                            }}
                          />
                        </>
                      ) : null}
                    </div>
                  ) : null}
                  <Button onClick={() => this.validarCNPJ()}>Teste</Button>
                </div>

                <br />
              </div>
            </div>
          </div>

          {/* Campo Slide */}
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
