import React, { Component } from "react";
import "../../templates/style_transferencia.scss";
import { Container, Col, Row, Button, Modal, Alert } from "react-bootstrap";
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
      idMoeda: 0,
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

  valida_token2f = () => {
    
    const data = {
      url: "token2f/valida",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
        email: Funcoes.pessoa.email,
        token: this.state.tokenSaque,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data, true).then((responseJson) => {
      
      if (responseJson) {
        if (Produtos.cambioTela.token) {
          this.travarCotacao();
        } else if (Produtos.cambioTela.tokenSaque) {
          this.saque();
          this.setState({ travarSaque: true });
        }
      } else {
        alert("Token Invalido");
        this.setState({ disabled: false });
      }
    });
  };

  travarCotacao = () => {
    if (
      this.state.senha == "" ||
      this.state.valueCompra == 0 ||
      this.state.valueMoeda == []
    ) {
      alert("Por favor, preencha os campos para prosseguir");
    } else {
      if (this.state.valueCompra < 0) {
        alert("Valor Minimo de Compra é de 1.000,00");
      } else {
        this.setState({ viewValidar: false });
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

        Funcoes.Geral_API(data, true).then((responseJson) => {
          console.log(responseJson);
          /* this.setState({ modalConfirmComprar: true, modalComprar: false }); */

          if (!responseJson || responseJson.message !== "success") {
            console.error("Erro na resposta:", responseJson);
            
            alert(responseJson?.message || "Erro inesperado ao processar a solicitação.");
            
            this.setState({ disabled: false });
          } else if (responseJson.data?.result?.id) {
            this.setState({ 
              idCotacao: responseJson.data.result.id, 
              modalConfirmComprar: true, 
              modalComprar: false 
            });
          } else {
            console.warn("Resposta recebida, mas faltam informações necessárias:", responseJson);
            
            alert("Resposta recebida, mas faltam informações necessárias.");
            
            this.setState({ disabled: false });
          }
          
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
      // Define um temporizador para exibir alerta após 15 segundos

      const data = {
        url: "cambio/cambio/comprar",
        data: JSON.stringify({
          id: this.state.idCotacao,
          moeda: this.state.valueMoeda.value,
          conta_id: Funcoes.pessoa.conta_id,
          amount: this.state.valueCompra,
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
          location.reload();
        }
      });
    }
  };

  saque = () => {
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
        carteira: carteiraSaque,
      }),
      method: "POST",
    };

    

    Funcoes.Geral_API(data, true).then((responseJson) => {
      
      if (responseJson.status) {
        alert("Saque em processamento! Verificar relatorio de Saque");
        window.location.href = "/relatorio_crypo";
      } else {
        alert("Erro em solicitar o saque, tente novamente");
        location.reload();
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
                      style: "currency",
                      currency: "BRL",
                    })}
                    placeholder="R$ 00,00"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[R$\s.,]/g, ""); // Remove caracteres não numéricos
                      const valorNumerico = Number(value) / 100; // Converte para valor em reais

                      this.setState({ valueCompra: valorNumerico }, () => {
                        this.calcularTotalPagar(); // Chama a função para recalcular totalPagar
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
                          ? `R$ ${this.state.valorCotacao.price_buy}`
                          : "R$ 00,00"
                      }
                      placeholder="R$ 00,00"
                      disabled
                    />

                    {/* {this.state.valorCotacao.price_buy
                      ? this.state.valorCotacao.price_buy
                      : "R$ 00,00"} */}
                  </span>
                </Col>
                <Col>
                  <h3>Valor Liquido</h3>
                  <input
                    value={
                      this.state.valorCotacao.price_buy
                        ? new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            this.state.valorCotacao.price_buy *
                              (this.state.valueCompra || 0)
                          )
                        : "R$ 00,00"
                    }
                    placeholder="R$ 00,00"
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
                    placeholder="R$ 00,00"
                    disabled
                  />
                </Col>
                <Col>
                  <h3>Tarifa</h3>
                  <span style={{ marginLeft: 10 }}>
                    <input
                      value={"R$ " + this.state.tarifa}
                      placeholder="R$ 00,00"
                      disabled
                    />

                    {/* {this.state.valorCotacao.price_buy
                      ? this.state.valorCotacao.price_buy
                      : "R$ 00,00"} */}
                  </span>
                </Col>
                <Col>
                  <h3>Total a Pagar</h3>
                  <input
                    value={this.state.totalPagar.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })} // Exibe o totalPagar ou "R$ 00,00" caso esteja vazio
                    placeholder="R$ 00,00"
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
                    <h4>
                      Moeda: <b>{this.state.moedaNome}</b>
                    </h4>
                  </Col>
                  <Col>
                    <h4>
                      Valor da Moeda:{" "}
                      <b>
                        {this.state.valorCotacao.price_buy
                          ? `R$ ${this.state.valorCotacao.price_buy}`
                          : "R$ 00,00"}{" "}
                        {/* Valor padrão caso não exista */}
                      </b>
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h4>
                      Quantidade que quer:{" "}
                      <b>
                        {this.state.valueCompra.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </b>
                    </h4>
                  </Col>
                  <Col>
                    <h4>
                      Valor Total a Pagar:{" "}
                      <b>
                        {this.state.totalPagar.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </b>
                    </h4>
                  </Col>
                </Row>
              </Alert>

              <Row>
                <h6>Senha de Transação</h6>
              </Row>
              <Row>
                <OtpInput
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
              disabled={this.state.disabled}
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
                      ? "R$ " + this.state.saldoForSaque
                      : "R$ 00,00"}
                  </h4>
                </Col>
                <Col>
                  <h3>Valor de Saque</h3>
                  <div>
                    <input
                      value={this.state.valorSaque.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                      placeholder="R$ 00,00"
                      style={{ height: 40 }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[R$\s.,]/g, ""); // Remove caracteres não numéricos
                        const valorNumerico = Number(value) / 100; // Converte para valor em reais

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
                  inputType="password"
                />
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              disabled={this.state.travarSaque}
              onClick={this.valida_token2f}
            >
              Sacar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
