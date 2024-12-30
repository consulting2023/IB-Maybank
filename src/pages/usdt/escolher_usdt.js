import React, { Component } from "react";
import "../../templates/style_transferencia.scss";
import {
  Container,
  Col,
  Row,
  Button,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";
import Icones from "../../constants/Icon";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import Objetos from "../../constants/Objetos";
import i18n from "../../tradutor/tradutor";
import * as Funcoes from "../../constants/Funcoes";
import OtpInput from "react-otp-input";
import MaskedInput from "react-text-mask";
import Produtos from "../../constants/Produtos";

export default class Cambio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalComprar: false,
      modalConfirmComprar: false,
      moeda: [],
      valueMoeda: null, // Moeda selecionada
      valueCompra: "",
      senha: "",
      senhaConfirm: "",
      senhaSaque: "",
      hidePassword: true,
      idCotacao: "",
      disabled: false,
      valorCotacao: [],
      token: "",
      tokenSaque: "",
      btnComprar: false,
      viewValidar: true,
      disabled: false,
      moedaNome: "",
      tempo: 0,
      tempoConfirm: 0,
      modalSaque: false,
      carteiraSaque: "",
      valorSaque: "",
      moedaSaque: null,
      saque: [],
      liberarSaque: true,
      saldoForSaque: 0,
      travarSaque: false,
      taxa: 0,
      totalLiquido: 0,
      tarifa: "00,00",
      totalPagar: "",
      totalPagarConfirmar: "",
      idMoeda: 0,
      valorMoedaTravar: 0,
      disabledConfirm: false,
      contaGrupos: {},
      contaId: 0,
      saldoConta: 0,
      saldoCrypto: 0,
    };
  }

  componentDidMount() {
    this.setState({
      contaGrupos: JSON.parse(localStorage.getItem("conta_grupos")),
    });

    console.log(JSON.parse(localStorage.getItem("conta_grupos")));
    const data = {
      url: "cambio/cambio/get-all-crypto",
      method: "GET",
    };

    Funcoes.Geral_API(data, true).then((responseJson) => {
      this.setState({ moeda: responseJson.data });
    });

    const dados = {
      url: "cambio/cambio/saldo",
      data: JSON.stringify({
        conta_id: Funcoes.pessoa.conta_id,
      }),
      method: "POST",
      console: false,
      funcao: "trazer moeda crypto",
      tela: "comprar_moeda",
    };

    Funcoes.Geral_API(dados, true).then((res) => {
      if (res.status == 1 && res.saldos && res.saldos.length > 0) {
        this.setState({ liberarSaque: false, saque: res.saldos });
      } else {
        console.warn("Dados não encontrados ou status inválido.");
        this.setState({ liberarSaque: false });
      }
    });
  }

  // Função de troca de senha para o modal
  cotacao = (id) => {
    console.log(this.state.contaId.value);
    let data = {};
    if (id == undefined) {
      if (this.state.contaGrupos && this.state.contaGrupos !== "undefined") {
        data = {
          url: "cambio/cambio/cotacao",
          data: JSON.stringify({
            moeda: this.state.idMoeda,
            conta_id: this.state.contaId.value,
          }),
          method: "POST",
        };
      } else {
        data = {
          url: "cambio/cambio/cotacao",
          data: JSON.stringify({
            moeda: this.state.idMoeda,
            conta_id: Funcoes.pessoa.conta_id,
          }),
          method: "POST",
        };
      }

      Funcoes.Geral_API(data, true).then((responseJson) => {
        console.log(responseJson);
        // Defina o valorCotacao diretamente como o valor recebido
        const valorCotacao = JSON.parse(responseJson.data); // Certifique-se de parsear o JSON se necessário

        // Atualize o estado após o valor estar pronto
        this.setState({ valorCotacao });
        this.setState({ taxa: responseJson.taxa });
      });
    } else {
      if (this.state.contaGrupos && this.state.contaGrupos !== "undefined") {
        data = {
          url: "cambio/cambio/cotacao",
          data: JSON.stringify({
            moeda: id,
            conta_id: this.state.contaId.value,
          }),
          method: "POST",
        };
      } else {
        data = {
          url: "cambio/cambio/cotacao",
          data: JSON.stringify({
            moeda: id,
            conta_id: Funcoes.pessoa.conta_id,
          }),
          method: "POST",
        };
      }

      Funcoes.Geral_API(data, true).then((responseJson) => {
        // Defina o valorCotacao diretamente como o valor recebido
        const valorCotacao = JSON.parse(responseJson.data); // Certifique-se de parsear o JSON se necessário

        // Atualize o estado após o valor estar pronto
        this.setState({ valorCotacao });
        this.setState({ taxa: responseJson.taxa });
      });
    }
  };

  travarCotacao = () => {
    if (
      this.state.senha == "" ||
      this.state.valueCompra == 0 ||
      this.state.valueMoeda == []
    ) {
      alert(i18n.t("cambio.campos"));
    } else if (
      this.state.valueCompra < 10000 ||
      this.state.valueCompra > 900000
    ) {
      alert("Compra minima de 10.000 e Compra Maxima é de 900.000");
    } else {
      if (this.state.valueCompra < 10000) {
        alert(i18n.t("cambio.limit"));
      } else {
        this.setState({ viewValidar: false, disabled: true });
        let data = {};
        if (this.state.contaGrupos && this.state.contaGrupos !== "undefined") {
          data = {
            url: "cambio/cambio/travar-cotacao",
            data: JSON.stringify({
              moeda: this.state.valueMoeda.value,
              amount: this.state.valueCompra,
              operation: "BUY",
              conta_id: this.state.contaId.value,
              senha: this.state.senha,
              amount_total: this.state.totalPagar,
            }),
            method: "POST",
          };
        } else {
          data = {
            url: "cambio/cambio/travar-cotacao",
            data: JSON.stringify({
              moeda: this.state.valueMoeda.value,
              amount: this.state.valueCompra,
              operation: "BUY",
              conta_id: Funcoes.pessoa.conta_id,
              senha: this.state.senha,
              amount_total: this.state.totalPagar,
            }),
            method: "POST",
          };
        }

        Funcoes.Geral_API(data, true).then((res) => {
          console.log(res);

          if (res.success == 0) {
            if (res.cod == 0) {
              alert(res.messagem);
              this.setState({ disabled: false });
            } else if (res.cod == 1) {
              alert(i18n.t("cambio.timeLimite"));
              location.reload();
            } else if (res.cod == 2) {
              alert(res.messagem);
              this.setState({ disabled: false });
            } else if (res.cod == 101) {
              alert(res.messagem);
              this.setState({ disabled: false });
            } else if (res.cod == 104) {
              alert(i18n.t("cambio.erroTravar"));
              location.location();
            } else if (res.cod == 105) {
              alert(i18n.t("cambio.verifiqueParam"));
              this.setState({ disabled: false });
            } else if (res.cod == 203) {
              alert("Erro interno, aguarde");
            } else if (res.cod == 204) {
              alert(res.messagem);
              this.setState({ disabled: false });
            } else if (res.cod == 102) {
              alert(res.messagem);
              this.setState({ disabled: false });
            } else {
              alert(res.messagem);
              this.setState({ disabled: false });
            }
          } else if (res.success == 1) {
            this.setState({ valorMoedaTravar: res.data.result.price }, () => {
              this.calcularTotalPagarConfirmar();
            });
            this.startTimerCancel();
            this.setState({
              idCotacao: res.data.result.id,
              modalConfirmComprar: true,
              modalComprar: false,
            });
          } else {
            alert("Erro interno");
          }
        });
      }
    }
  };

  buyMoeda = () => {
    if (this.state.senhaConfirm == "") {
      alert(i18n.t("cambio.senhaInform"));
      return;
    } else if (this.state.senhaConfirm != this.state.senha) {
      alert(i18n.t("cambio.senhaIncorreta"));
    } else {
      this.setState({ disabledConfirm: true });
      // Define um temporizador para exibir alerta após 15 segundos

      let data = {};
      if (this.state.contaGrupos && this.state.contaGrupos !== "undefined") {
        data = {
          url: "cambio/cambio/comprar",
          data: JSON.stringify({
            id: this.state.idCotacao,
            moeda: this.state.valueMoeda.value,
            conta_id: this.state.contaId.value,
            amount: this.state.valueCompra,
            amount_total: this.state.totalPagarConfirmar,
          }),
          method: "POST",
        };
      } else {
        data = {
          url: "cambio/cambio/comprar",
          data: JSON.stringify({
            id: this.state.idCotacao,
            moeda: this.state.valueMoeda.value,
            conta_id: Funcoes.pessoa.conta_id,
            amount: this.state.valueCompra,
            amount_total: this.state.totalPagarConfirmar,
          }),
          method: "POST",
        };
      }

      Funcoes.Geral_API(data).then((res) => {
        if (res.success == 0) {
          if (res.cod == 0) {
            alert(res.message);
            this.setState({ disabledConfirm: false });
          } else if (res.cod == 1) {
            alert(i18n.t("cambio.timeLimite"));
            location.reload();
          } else if (res.cod == 2) {
            alert(res.messagem);
            this.setState({ disabledConfirm: false });
          } else if (res.cod == 101) {
            alert(res.message);
            this.setState({ disabledConfirm: false });
          } else if (res.cod == 104) {
            alert(i18n.t("cambio.erroCompra"));
            location.location();
          } else if (res.cod == 105) {
            alert(i18n.t("cambio.verifiqueParam"));
            this.setState({ disabledConfirm: false });
          } else if (res.cod == 203) {
            alert("Erro interno, aguarde");
          } else if (res.cod == 204) {
            alert(res.messagem);
            this.setState({ disabledConfirm: false });
          } else {
            alert("Erro Desconhecido");
          }
        } else {
          alert(i18n.t("cambio.compraSuccess"));
          window.location.href = "/relatorio_crypo";
        }
      });
    }
  };

  saqueCrypto = () => {
    const { carteiraSaque, valorSaque, moedaSaque, saldoForSaque, senhaSaque } =
      this.state;

    // Verifica se todos os campos necessários estão preenchidos
    if (!carteiraSaque) {
      alert(i18n.t("cambio.informeCarteira"));
      this.setState({ travarSaque: false });
      return;
    }

    if (!valorSaque || isNaN(valorSaque) || valorSaque <= 0) {
      alert(i18n.t("cambio.informeValorSaque"));
      this.setState({ travarSaque: false });
      return;
    }

    if (!moedaSaque) {
      alert(i18n.t("cambio.informeMoedaSaque"));
      this.setState({ travarSaque: false });
      return;
    }

    if (!senhaSaque) {
      alert(i18n.t("cambio.informeSenhaSaque"));
      this.setState({ travarSaque: false });
      return;
    }

    // Se todas as validações passarem, procede com a requisição

    let data = {};
    if (this.state.contaGrupos && this.state.contaGrupos !== "undefined") {
      data = {
        url: "cambio/cambio/saque",
        data: JSON.stringify({
          moeda: moedaSaque.value,
          conta_id: this.state.contaId.value,
          amount: valorSaque,
          senha: senhaSaque,
          wallet: carteiraSaque,
        }),
        method: "POST",
      };
    } else {
      data = {
        url: "cambio/cambio/saque",
        data: JSON.stringify({
          moeda: moedaSaque.value,
          conta_id: Funcoes.pessoa.conta_id,
          amount: valorSaque,
          senha: senhaSaque,
          wallet: carteiraSaque,
        }),
        method: "POST",
      };
    }

    console.log(data);

    Funcoes.Geral_API(data, true).then((responseJson) => {
      console.log(responseJson);
      if (responseJson.success) {
        alert(i18n.t("cambio.saqueSuccess"));
        window.location.href = "/relatorio_crypo";
      } else {
        if (responseJson.cod == 101) {
          alert(i18n.t("cambio.saqueCod101"));
          this.setState({ travarSaque: false });
        } else if (responseJson.cod == 105) {
          alert(i18n.t("cambio.saqueCod105"));
          this.setState({ travarSaque: false });
        } else if (responseJson.cod == 203) {
          alert("Erro em solicitar o saque, tente novamente");
          Funcoes.logout();
        } else if (responseJson.cod == 2) {
          alert(i18n.t("cambio.saqueCod2"));
          this.setState({ travarSaque: false });
        } else if (responseJson.cod == 104) {
          alert(i18n.t("cambio.saqueCod104"));
          this.setState({ travarSaque: false });
        } else {
          alert("Erro em solicitar o saque, tente novamente");
          this.setState({ travarSaque: false });
        }
      }
    });
  };

  startTimer = (id) => {
    this.setState({ idMoeda: id.value, tempo: 0 }); // Reinicia o tempo e define o idMoeda

    // Define o temporizador de 1 segundo
    this.intervalId = setInterval(() => {
      this.setState(
        (prevState) => ({ tempo: prevState.tempo + 1 }),
        () => {
          // Quando atinge 15 segundos, reinicia o tempo e chama a cotação
          if (this.state.tempo > 15) {
            this.cotacao(id.value);
            this.setState({ tempo: 0 }); // Reinicia o contador
          }
        }
      );
    }, 1000);
  };

  startTimerCancel = () => {
    this.setState({ tempoConfirm: 0 }); // Reinicia o tempo e define o idMoeda

    // Define o temporizador de 1 segundo
    this.intervalId = setInterval(() => {
      this.setState(
        (prevState) => ({ tempoConfirm: prevState.tempoConfirm + 1 }),
        () => {
          // Quando atinge 60 segundos, dá um reload na página
          if (this.state.tempoConfirm >= 60) {
            clearInterval(this.intervalId); // Cancela o temporizador para evitar múltiplos reloads
            window.location.reload(); // Recarrega a página
          }
        }
      );
    }, 1000);
  };

  calcularTotalPagar = () => {
    const taxa = this.state.taxa / 100 || 0; // Taxa padrão 0 se não definida
    const valorCotacao = this.state.valorCotacao.price_buy || 0; // Valor padrão 0
    const valueCompra = this.state.valueCompra || 0; // Valor padrão 0

    // Cálculo de totalTaxa e totalPagar
    const totalTaxa = valorCotacao * valueCompra * taxa;
    const totalPagar = valorCotacao * valueCompra + totalTaxa;

    // Atualiza o estado com o valor numérico de totalPagar
    this.setState({ totalPagar });
  };

  calcularTotalPagarConfirmar = () => {
    const taxa = this.state.taxa / 100 || 0; // Taxa padrão 0 se não definida
    const valorCotacao = this.state.valorMoedaTravar; // Valor padrão 0
    const valueCompra = this.state.valueCompra || 0; // Valor padrão 0

    // Cálculo de totalTaxa e totalPagar
    const totalTaxa = valorCotacao * valueCompra * taxa;
    const totalPagarConfirmar = valorCotacao * valueCompra + totalTaxa;

    console.log(totalPagarConfirmar);

    // Atualiza o estado com o valor numérico de totalPagar
    this.setState({ totalPagarConfirmar });
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

  saldoCrypto = (id) => {
    const dados = {
      url: "cambio/cambio/saldo",
      data: JSON.stringify({
        conta_id: id,
      }),
      method: "POST",
    };

    Funcoes.Geral_API(dados, true).then((res) => {
      console.log(res.saldos);
      res.saldos.map((saldo) => {
        this.setState({ saldoCrypto: saldo });
      });
    });
  };

  render() {
    return (
      <div>
        <BannerTitle
          title={i18n.t("cambio.cambiotitle")}
          img={Objetos.transferenciaImg}
        />

        <Container className="p-3 d-flex justify-content-center">
          <Col md={8} className="baseWindow px-5 py-4">
            <Row>
              <p
                className="mb-2 w-100 text-center"
                style={{ fontSize: "1.30em" }}
              >
                <strong>{i18n.t("cambio.cambiotitle")}</strong>
              </p>
            </Row>
            {this.state.liberarSaque == false && this.state.saque.length > 0 ? (
              <Row>
                {this.state.saque.map((data, index) => {
                  return (
                    <Col key={data.key || index}>
                      <h5>
                        {i18n.t("cambio.moeda")} {data.symbol || "N/A"}
                      </h5>
                      <h5>
                        {i18n.t("cambio.saldo")}{" "}
                        {data.saldo !== undefined ? data.saldo : "N/A"}
                      </h5>
                    </Col>
                  );
                })}
              </Row>
            ) : null}

            <Row className="text-center px-3">
              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => {
                    this.setState({ modalComprar: true });
                  }}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.cambio}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">
                        {i18n.t("cambio.comprarMoeda")}
                      </p>
                    </Col>
                  </Row>
                </Button>
              </Col>

              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  disabled={this.state.liberarSaque}
                  className="baseButtonPrimary"
                  onClick={() => {
                    this.setState({ modalSaque: true });
                  }}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.cambio}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">
                        {i18n.t("cambio.saqueMoeda")}
                      </p>
                    </Col>
                  </Row>
                </Button>
              </Col>
            </Row>
          </Col>
        </Container>

        {/* Modal de Compra */}
        <Modal
          size="lg"
          show={this.state.modalComprar}
          onHide={() => this.setState({ modalComprar: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("cambio.comprarMoeda")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              {this.state.contaGrupos &&
              this.state.contaGrupos !== "undefined" ? (
                <Row>
                  <Col md={8}>
                    <h3>{i18n.t("home.conta")}</h3>
                    <Select
                      options={
                        Array.isArray(this.state.contaGrupos)
                          ? this.state.contaGrupos.map((conta) => ({
                              value: conta.conta_id,
                              label: conta.conta_id + " " + conta.nome_conta,
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
                  </Col>
                  <Col md={4}>
                    <h3>
                      {i18n.t("home.saldo") + " " + i18n.t("home.conta")}{" "}
                    </h3>
                    <span style={{ marginLeft: 10 }}>
                      <input
                        value={
                          this.state.saldoConta
                            ? "R$ " + ` ${this.state.saldoConta}`
                            : i18n.t("home.saldoNull")
                        }
                        placeholder=" 00,00"
                        disabled
                        style={{ height: 40 }}
                      />
                    </span>
                  </Col>
                </Row>
              ) : null}

              <br />

              <Row>
                <Col>
                  <h3>{i18n.t("cambio.moeda")}</h3>
                  <Select
                    options={this.state.saque.map((moeda) => ({
                      value: moeda.id,
                      label: moeda.symbol,
                    }))}
                    placeholder={i18n.t("cambio.escolherMoeda")}
                    value={this.state.valueMoeda} // Passa o objeto selecionado ou `null`
                    onChange={(selectedOption) => {
                      this.setState({
                        valueMoeda: selectedOption,
                        moedaNome: selectedOption.label,
                      }); // Atualiza o estado com o objeto selecionado
                      this.cotacao(selectedOption.value);
                      this.startTimer(selectedOption); // Passa `value` para a função `cotacao`
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
                </Col>
              </Row>
              <br />
              <Row className="mb-3">
                <Col>
                  <h3>{i18n.t("cambio.valDsj")}</h3>
                  <input
                    value={this.state.valueCompra.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2, // Garante que exiba sempre duas casas decimais
                      maximumFractionDigits: 2,
                    })}
                    placeholder="00,00"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, ""); // Remove tudo que não é número
                      const valorNumerico = Number(value) / 100; // Divide por 100 para ajustar o valor

                      this.setState({ valueCompra: valorNumerico }, () => {
                        this.calcularTotalPagar(); // Recalcula o total
                      });
                    }}
                  />
                </Col>
                <Col>
                  <h3>{i18n.t("cambio.valMoeda")}</h3>
                  <span style={{ marginLeft: 10 }}>
                    <input
                      value={
                        this.state.valorCotacao.price_buy
                          ? ` ${this.state.valorCotacao.price_buy}`
                          : " 00,00"
                      }
                      placeholder=" 00,00"
                      disabled
                    />

                    {/* {this.state.valorCotacao.price_buy
                      ? this.state.valorCotacao.price_buy
                      : " 00,00"} */}
                  </span>
                </Col>
                <Col>
                  <h3>{i18n.t("cambio.valLqd")}</h3>
                  <input
                    value={
                      this.state.valorCotacao.price_buy
                        ? new Intl.NumberFormat("pt-BR", {
                            minimumFractionDigits: 2, // Garante duas casas decimais
                            maximumFractionDigits: 2,
                          }).format(
                            this.state.valorCotacao.price_buy *
                              (this.state.valueCompra || 0)
                          )
                        : "00,00"
                    }
                    placeholder="00,00"
                    disabled
                    onChange={() => {
                      this.setState({
                        totalLiquido:
                          this.state.valorCotacao.price_buy *
                          this.state.valueCompra,
                      });
                    }} // Adicionado para evitar warnings
                  />
                </Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col>
                  <h3>{i18n.t("cambio.taxa")}</h3>
                  <input
                    value={this.state.taxa + "%"}
                    placeholder=" 00,00"
                    disabled
                  />
                </Col>
                <Col>
                  <h3>{i18n.t("cambio.tarifa")}</h3>
                  <span style={{ marginLeft: 10 }}>
                    <input
                      value={" " + this.state.tarifa}
                      placeholder=" 00,00"
                      disabled
                    />
                  </span>
                </Col>
                <Col>
                  <h3>{i18n.t("cambio.totalPagar")}</h3>
                  <input
                    value={
                      this.state.totalPagar
                        ? this.state.totalPagar.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2, // Garante duas casas decimais
                            maximumFractionDigits: 2,
                          })
                        : "00,00"
                    } // Exibe o totalPagar formatado ou "00,00" caso esteja vazio
                    placeholder="00,00"
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>{i18n.t("cambio.senhaTransfer")}</h3>
                  <OtpInput
                    isInputSecure={true}
                    focusInput={1}
                    isInputNum={true}
                    value={this.state.senha}
                    onChange={(value) => this.setState({ senha: value })}
                    numInputs={6}
                    className="tokenValidacao"
                    inputType="password"
                  />
                </Col>
              </Row>
            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              disabled={this.state.disabled}
              onClick={() => {
                this.travarCotacao();
              }}
            >
              {i18n.t("cambio.confirmCompra")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="lg"
          show={this.state.modalConfirmComprar}
          onHide={() => this.setState({ modalConfirmComprar: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("cambio.confirmCompra")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Alert style={{ fontSize: "13px" }} variant="secondary">
                <Row>
                  <Col>
                    <h4>{i18n.t("cambio.moeda")}</h4>
                    <input
                      type="text"
                      value={this.state.moedaNome}
                      disabled
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </Col>
                  <Col>
                    <h4>{i18n.t("cambio.valMoeda")}</h4>
                    <input
                      type="text"
                      value={this.state.valorMoedaTravar || "00,00"}
                      disabled
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </Col>
                  <Col>
                    <h4>{i18n.t("cambio.taxa")}</h4>
                    <input
                      type="text"
                      value={this.state.taxa + "%" || "00.00%"}
                      disabled
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <h4>{i18n.t("cambio.valDsj")}</h4>
                    <input
                      type="text"
                      value={this.state.valueCompra.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      disabled
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </Col>
                  <Col>
                    <h4>{i18n.t("cambio.totalPagar")}</h4>
                    <input
                      type="text"
                      value={this.state.totalPagarConfirmar.toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                      disabled
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </Col>
                </Row>
              </Alert>
              <br />
              <Row>
                <h6>{i18n.t("cambio.senhaTransfer")}</h6>
              </Row>
              <Row>
                <OtpInput
                  isInputSecure={true}
                  focusInput={1}
                  isInputNum={true}
                  value={this.state.senhaConfirm}
                  onChange={(value) => this.setState({ senhaConfirm: value })}
                  numInputs={6}
                  className="tokenValidacao"
                  inputType="password"
                />
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              disabled={this.state.disabledConfirm}
              onClick={this.buyMoeda}
            >
              {i18n.t("cambio.confirmCompra")}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Saque */}
        <Modal
          size="lg"
          show={this.state.modalSaque}
          onHide={() => this.setState({ modalSaque: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t("cambio.saqueMoeda")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              {this.state.contaGrupos &&
              this.state.contaGrupos !== "undefined" ? (
                <Row>
                  <Col md={8}>
                    <h3>{i18n.t("home.conta")}</h3>
                    <Select
                      options={
                        Array.isArray(this.state.contaGrupos)
                          ? this.state.contaGrupos.map((conta) => ({
                              value: conta.conta_id,
                              label: conta.conta_id + " " + conta.nome_conta,
                            }))
                          : []
                      } // Verifica se contaGrupos é um array
                      value={this.state.contaId}
                      onChange={(selectedOption) => {
                        this.setState({ contaId: selectedOption });
                        this.saldoCrypto(selectedOption.value);
                        console.log(this.state.contaId);
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
                  </Col>
                  <Col md={4}>
                    <h3>
                      {i18n.t("home.saldo") + " USDT" }{" "}
                    </h3>
                    <span style={{ marginLeft: 10 }}>
                      <input
                        value={
                          this.state.saldoCrypto
                            ? "R$ " + ` ${this.state.saldoCrypto.saldo}`
                            : i18n.t("home.saldoNull")
                        }
                        placeholder=" 00,00"
                        disabled
                        style={{ height: 40 }}
                      />
                    </span>
                  </Col>
                </Row>
              ) : null}

              <br />

              <Row className="mb-3">
                <Col>
                  <h3>{i18n.t("cambio.moeda")}</h3>
                  <Select
                    options={this.state.saque.map((moeda) => ({
                      value: moeda.id,
                      label: moeda.symbol,
                      saldo: moeda.saldo, // Adiciona saldo como uma propriedade extra
                    }))}
                    placeholder="Escolher Moeda"
                    value={this.state.moedaSaque} // Passa o objeto completo para `value`
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        this.setState({
                          moedaSaque: selectedOption, // Define o objeto completo selecionado
                          saldoForSaque: selectedOption.saldo, // Define o saldo da moeda selecionada
                        });
                        console.log(selectedOption);
                        /* this.cotacao(selectedOption.value); */ // Passa `value` para a função `cotacao`
                      }
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
                </Col>
                <Col>
                  <h3>{i18n.t("cambio.saldo")}</h3>
                  <h4>
                    {this.state.saldoForSaque !== 0.0
                      ? " " + this.state.saldoForSaque
                      : i18n.t("home.saldoNull")}
                  </h4>
                </Col>
                <Col>
                  <h3>{i18n.t("cambio.valSaque")}</h3>
                  <div>
                    <input
                      value={
                        this.state.valorSaque
                          ? this.state.valorSaque.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) // Exibe o valor formatado sem "R$"
                          : "00,00"
                      }
                      placeholder="00,00"
                      style={{ height: 40 }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[\s.,]/g, ""); // Remove espaços e vírgulas
                        const valorNumerico = Number(value) / 100; // Divide por 100 para obter o valor em reais

                        this.setState({ valorSaque: valorNumerico });
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>{i18n.t("cambio.carteiraSaque")}</h3>
                  <input
                    type="text"
                    style={{ width: "90%", height: 40 }}
                    placeholder={i18n.t("cambio.placeholderSaque")}
                    onChange={(e) =>
                      this.setState({ carteiraSaque: e.target.value })
                    }
                  />
                </Col>
              </Row>

              <br />
              <Row>
                <h6>{i18n.t("cambio.senhaTransfer")}</h6>
              </Row>
              <Row>
                <OtpInput
                  focusInput={1}
                  isInputNum={true}
                  value={this.state.senhaSaque}
                  onChange={(value) => this.setState({ senhaSaque: value })}
                  numInputs={6}
                  className="tokenValidacao"
                  isInputSecure={true}
                />
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            {this.state.travarSaque ? (
              // Exibe o spinner enquanto a ação está travada
              <div className="d-flex justify-content-center align-items-center">
                <Spinner
                  animation="border"
                  role="status"
                  variant="primary"
                  style={{ width: "2rem", height: "2rem" }}
                >
                  <span className="sr-only">{i18n.t("cambio.carregando")}</span>
                </Spinner>
              </div>
            ) : (
              // Exibe o botão quando travarSaque é falso
              <Button
                variant="primary"
                disabled={this.state.travarSaque}
                onClick={() => {
                  this.setState({ travarSaque: true }); // Ativa o estado de loading
                  this.saqueCrypto(); // Chama a função
                }}
              >
                {i18n.t("cambio.sacar")}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
