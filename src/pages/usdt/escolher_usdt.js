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
    };
  }

  componentDidMount() {
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
    if (id == undefined) {
      const data = {
        url: "cambio/cambio/cotacao",
        data: JSON.stringify({
          moeda: this.state.idMoeda,
          conta_id: Funcoes.pessoa.conta_id,
        }),
        method: "POST",
        console: false,
        funcao: "trazer moeda crypto",
        tela: "comprar_moeda",
      };

      Funcoes.Geral_API(data, true).then((responseJson) => {
        console.log(responseJson);
        // Defina o valorCotacao diretamente como o valor recebido
        const valorCotacao = JSON.parse(responseJson.data); // Certifique-se de parsear o JSON se necessário

        // Atualize o estado após o valor estar pronto
        this.setState({ valorCotacao });
        this.setState({ taxa: responseJson.taxa });
      });
    } else {
      const data = {
        url: "cambio/cambio/cotacao",
        data: JSON.stringify({
          moeda: id,
          conta_id: Funcoes.pessoa.conta_id,
        }),
        method: "POST",
        console: false,
        funcao: "trazer moeda crypto",
        tela: "comprar_moeda",
      };

      Funcoes.Geral_API(data, true).then((responseJson) => {
        // Defina o valorCotacao diretamente como o valor recebido
        const valorCotacao = JSON.parse(responseJson.data); // Certifique-se de parsear o JSON se necessário

        // Atualize o estado após o valor estar pronto
        this.setState({ valorCotacao });
        this.setState({ taxa: responseJson.taxa });
      });
    }
  };

  enviar_token2f = () => {
    const data = {
      url: "token2f/novo",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data, true).then((responseJson) => {
      alert("Enviamos um Token para o seu email");
    });
  };

  travarCotacao = () => {
    if (
      this.state.senha == "" ||
      this.state.valueCompra == 0 ||
      this.state.valueMoeda == []
    ) {
      alert("Por favor, preencha os campos para prosseguir");
    } else if (this.state.valueCompra < 1000) {
      alert("Compra minima de 1.000");
    } else {
      if (this.state.valueCompra < 0) {
        alert("Valor Minimo de Compra é de 1.000,00");
      } else {
        this.setState({ viewValidar: false, disabled: true });
        const data = {
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

        Funcoes.Geral_API(data, true).then((res) => {
          console.log(res);

          if (res.error == 1) {
            alert(res.message);
            this.setState({ disabled: false });
          } else if (res.message == "success") {
            // Atualiza o valor da moeda antes de calcular
            this.setState({ valorMoedaTravar: res.data.result.price }, () => {
              // Chama a função de cálculo após atualizar o estado
              this.calcularTotalPagarConfirmar();
            });
            this.startTimerCancel();
            this.setState({
              idCotacao: res.data.result.id,
              modalConfirmComprar: true,
              modalComprar: false,
            });
          }

          /* this.setState({ modalConfirmComprar: true, modalComprar: false });
          const responseJson = JSON.parse(jsonstring);

          if (responseJson.message !== "success") {
            console.error("Erro na resposta:", responseJson);

            alert(
              responseJson?.message ||
                "Erro inesperado ao processar a solicitação."
            );

            this.setState({ disabled: false });
          } else if (responseJson.data?.result?.id) {
            this.setState({
              idCotacao: responseJson.data.result.id,
              modalConfirmComprar: true,
              modalComprar: false,
            });
          } else {
            console.warn(
              "Resposta recebida, mas faltam informações necessárias:",
              responseJson
            );

            alert("Resposta recebida, mas faltam informações necessárias.");

            this.setState({ disabled: false });
          } */
        });
      }
    }
  };

  buyMoeda = () => {
    if (this.state.senhaConfirm == "") {
      alert("É necessário informar a senha de transação para comprar");
      return;
    } else if (this.state.senhaConfirm != this.state.senha) {
      alert("Senha incorreta");
    } else {
      this.setState({ disabledConfirm: true });
      // Define um temporizador para exibir alerta após 15 segundos

      const data = {
        url: "cambio/cambio/comprar",
        data: JSON.stringify({
          id: this.state.idCotacao,
          moeda: this.state.valueMoeda.value,
          conta_id: Funcoes.pessoa.conta_id,
          amount: this.state.valueCompra,
          amount_total: this.state.totalPagarConfirmar,
        }),
        method: "POST",
        console: false,
        funcao: "trazer moeda crypto",
        tela: "comprar_moeda",
      };

      Funcoes.Geral_API(data).then((responseJson) => {
        // Cancela o temporizador caso a resposta chegue antes de 15 segundos

        if (responseJson.data.success == false) {
          alert(responseJson.data.mensagem);
          location.reload();
        } else {
          alert("Compra realizada com sucesso");
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
      alert("Informe a carteira para saque.");
      this.setState({ travarSaque: false });
      return;
    }

    if (!valorSaque || isNaN(valorSaque) || valorSaque <= 0) {
      alert("Informe um valor de saque válido.");
      this.setState({ travarSaque: false });
      return;
    }

    if (!moedaSaque) {
      alert("Escolha uma moeda para o saque.");
      this.setState({ travarSaque: false });
      return;
    }

    if (!senhaSaque) {
      alert("Informe a senha para realizar o saque.");
      this.setState({ travarSaque: false });
      return;
    }

    // Se todas as validações passarem, procede com a requisição
    const data = {
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

    console.log(data);

    Funcoes.Geral_API(data, true).then((responseJson) => {
      console.log(responseJson);
      if (responseJson.success) {
        alert("Saque em processamento! Verificar relatorio de Saque");
        window.location.href = "/relatorio_crypo";
      } else {
        if (responseJson.cod == 101) {
          alert("Senha errada, tente novamente");
          this.setState({ travarSaque: false });
        } else if (responseJson.cod == 105) {
          alert(
            "Parametros insuficientes, verifique os campos e tente novamente"
          );
          this.setState({ travarSaque: false });
        } else if (responseJson.cod == 203) {
          alert("Erro em solicitar o saque, tente novamente");
          Funcoes.logout();
        } else if (responseJson.cod == 2) {
          alert(
            "Saldo para saque insuficiente, realize uma compra para poder sacar mais que o saldo"
          );
          this.setState({ travarSaque: false });
        } else if (responseJson.cod == 104) {
          alert(
            "Erro ao completar o Saque, tente novamente mais tarde ou comunique o gerente"
          );
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
                <strong>Cambio</strong>
              </p>
            </Row>
            {this.state.liberarSaque == false && this.state.saque.length > 0 ? (
              <Row>
                {this.state.saque.map((data, index) => {
                  return (
                    <Col key={data.key || index}>
                      <h5>Moeda: {data.symbol || "N/A"}</h5>
                      <h5>
                        Saldo: {data.saldo !== undefined ? data.saldo : "N/A"}
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
                    Produtos.cambioTela.token ? this.enviar_token2f() : null;
                  }}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.cambio}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">Comprar Moeda</p>
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
                    Produtos.cambioTela.tokenSaque
                      ? this.enviar_token2f()
                      : null;
                  }}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.cambio}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">Saque Moeda</p>
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
            <Modal.Title>Compra de Moeda</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <h3>Moeda</h3>
                  <Select
                    options={this.state.saque.map((moeda) => ({
                      value: moeda.id,
                      label: moeda.symbol,
                    }))}
                    placeholder="Escolher Moeda"
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
                  <h3>Valor Desejado</h3>
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
                  <h3>Valor Moeda</h3>
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
                  <h3>Valor Liquido</h3>
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
                  <h3>Taxa</h3>
                  <input
                    value={this.state.taxa + "%"}
                    placeholder=" 00,00"
                    disabled
                  />
                </Col>
                <Col>
                  <h3>Tarifa</h3>
                  <span style={{ marginLeft: 10 }}>
                    <input
                      value={" " + this.state.tarifa}
                      placeholder=" 00,00"
                      disabled
                    />

                    {/* {this.state.valorCotacao.price_buy
                      ? this.state.valorCotacao.price_buy
                      : " 00,00"} */}
                  </span>
                </Col>
                <Col>
                  <h3>Total a Pagar</h3>
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

              {Produtos.cambioTela.token ? (
                <div>
                  <Row>
                    <h3>Token enviado para seu email</h3>
                  </Row>
                  <Row>
                    <OtpInput
                      focusInput={1}
                      isInputNum={true}
                      value={this.state.token}
                      onChange={(value) => this.setState({ token: value })}
                      numInputs={6}
                      className="tokenValidacao"
                    />
                  </Row>
                </div>
              ) : null}

              <Row>
                <Col>
                  <h3>Senha de Transição</h3>
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
                Produtos.cambioTela.token
                  ? this.valida_token2f
                  : this.travarCotacao();
              }}
            >
              Confirmar Compra
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="lg"
          show={this.state.modalConfirmComprar}
          onHide={() => this.setState({ modalConfirmComprar: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Alert style={{ fontSize: "13px" }} variant="secondary">
                <Row>
                  <Col>
                    <h4>Moeda</h4>
                    <input
                      type="text"
                      value={this.state.moedaNome}
                      disabled
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </Col>
                  <Col>
                    <h4>Valor da Moeda</h4>
                    <input
                      type="text"
                      value={this.state.valorMoedaTravar || "00,00"}
                      disabled
                      style={{ width: "100%", padding: "5px" }}
                    />
                  </Col>
                  <Col>
                    <h4>Taxa</h4>
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
                    <h4>Quantidade que quer</h4>
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
                    <h4>Valor Total a Pagar</h4>
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
                <h6>Senha de Transação</h6>
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
              Confirmar Compra
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
            <Modal.Title>Saque Compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row className="mb-3">
                <Col>
                  <h3>Moeda</h3>
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
                  <h3>Saldo Moeda</h3>
                  <h4>
                    {this.state.saldoForSaque != 0
                      ? " " + this.state.saldoForSaque
                      : " 00,00"}
                  </h4>
                </Col>
                <Col>
                  <h3>Valor de Saque</h3>
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
                  <h3>Carteira de Crypto</h3>
                  <input
                    type="text"
                    style={{ width: "90%", height: 40 }}
                    placeholder="Preencha a carteira para saque"
                    onChange={(e) =>
                      this.setState({ carteiraSaque: e.target.value })
                    }
                  />
                </Col>
              </Row>
              {Produtos.cambioTela.tokenSaque ? (
                <div>
                  <Row>
                    <h3>Token enviado para seu email</h3>
                  </Row>
                  <Row>
                    <OtpInput
                      focusInput={1}
                      isInputNum={true}
                      value={this.state.tokenSaque}
                      onChange={(value) => this.setState({ tokenSaque: value })}
                      numInputs={6}
                      className="tokenValidacao"
                    />
                  </Row>
                </div>
              ) : null}
              <br />
              <Row>
                <h6>Senha de Transação</h6>
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
                  <span className="sr-only">Carregando...</span>
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
                Sacar
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
