import React, { Component } from "react";
import "../../templates/style_transferencia.scss";
import { Container, Col, Row, Button, Modal } from "react-bootstrap";
import Select from "react-select";
import Icones from "../../constants/Icon";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import Objetos from "../../constants/Objetos";
import i18n from "../../tradutor/tradutor";
import * as Funcoes from "../../constants/Funcoes";
import OtpInput from "react-otp-input";
import MaskedInput from "react-text-mask";

export default class Cambio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalComprar: false,
      moeda: [],
      valueMoeda: null, // Moeda selecionada
      valueCompra: "",
      senha: "",
      hidePassword: true,
      idCotacao: "",
      disabled: false,
      valorCotacao: [],
      token: "",
      btnComprar: false,
      viewValidar: true,
      disabled: false,
    };
  }

  componentDidMount() {
    const data = {
      url: "cambio/cambio/get-all-crypto",
      method: "GET",
      console: false,
      funcao: "trazer moeda crypto",
      tela: "comprar_moeda",
    };

    Funcoes.Geral_API(data).then((responseJson) => {
      console.log(responseJson);
      this.setState({ moeda: responseJson.data });
    });
  }

  // Função de troca de senha para o modal
  cotacao = (id) => {
    console.log(id);

    const data = {
      url: "cambio/cambio/cotacao",
      data: JSON.stringify({
        moeda: id,
      }),
      method: "POST",
      console: false,
      funcao: "trazer moeda crypto",
      tela: "comprar_moeda",
    };

    Funcoes.Geral_API(data).then((responseJson) => {
      // Defina o valorCotacao diretamente como o valor recebido
      const valorCotacao = JSON.parse(responseJson.data); // Certifique-se de parsear o JSON se necessário

      // Atualize o estado após o valor estar pronto
      this.setState({ valorCotacao });
    });
  };

  enviar_token2f = () => {
    const data = {
      url: "token2f/novo",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((responseJson) => {
      alert("Enviamos um Token para o seu email");
    });
  };

  valida_token2f = () => {
    this.setState({ disabled: true });
    console.log(this.state.token);
    const data = {
      url: "token2f/valida",
      data: {
        conta_id: Funcoes.pessoa.conta_id,
        email: Funcoes.pessoa.email,
        token: this.state.token,
      },
      method: "POST",
    };
    Funcoes.Geral_API(data).then((responseJson) => {
      console.log(responseJson);
      if (responseJson) {
        this.travarCotacao();
      } else {
        alert("Token Invalido");
        this.setState({disabled: false})
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
      this.setState({ viewValidar: false });
      const data = {
        url: "cambio/cambio/travar-cotacao",
        data: JSON.stringify({
          moeda: this.state.valueMoeda.value,
          amount: this.state.valueCompra,
          operation: "BUY",
          conta_id: Funcoes.pessoa.conta_id,
          senha: this.state.senha,
        }),
        method: "POST",
        console: false,
        funcao: "trazer moeda crypto",
        tela: "comprar_moeda",
      };

      Funcoes.Geral_API(data).then((responseJson) => {
        console.log(responseJson);

        if (responseJson.message != "success") {
          alert(responseJson.message);
          this.setState({disabled: false})
        } else {
          this.setState({ idCotacao: responseJson.data.result.id });
          this.buyMoeda();
        }
      });
    }
  };

  buyMoeda = () => {
    console.log("Id Cotacao: " + this.state.idCotacao);

    const data = {
      url: "cambio/cambio/comprar",
      data: JSON.stringify({
        id: this.state.idCotacao,
      }),
      method: "POST",
      console: false,
      funcao: "trazer moeda crypto",
      tela: "comprar_moeda",
    };

    Funcoes.Geral_API(data).then((responseJson) => {
      console.log(responseJson)
      /* if (responseJson.data.success == false) {
        Alert.alert(responseJson.data.msg);
      } else {
        alert("Compra realizada com Sucesso");
        location.reload();
      } */
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
                <strong>Comprar Criptomoeda</strong>
              </p>
            </Row>
            <Row className="text-center px-3">
              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => {
                    this.setState({ modalComprar: true });
                    this.enviar_token2f();
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
              <Row className="mb-3">
                <Col>
                  <Select
                    options={this.state.moeda.map((moeda) => ({
                      value: moeda.id,
                      label: moeda.symbol,
                    }))}
                    placeholder="Escolher Moeda"
                    value={this.state.valueMoeda} // Passa o objeto selecionado ou `null`
                    onChange={(selectedOption) => {
                      console.log(selectedOption);
                      this.setState({ valueMoeda: selectedOption }); // Atualiza o estado com o objeto selecionado
                      this.cotacao(selectedOption.value); // Passa `value` para a função `cotacao`
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 3,
                }}
              >
                <input
                  value={this.state.valueCompra.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  placeholder="R$ 00,00"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[R$\s.,]/g, ""); // Remove caracteres não numéricos
                    const valorNumerico = Number(value) / 100; // Converte para valor em reais

                    this.setState({ valueCompra: valorNumerico });
                  }}
                />

                <span style={{marginLeft: 10}}>
                  {this.state.valorCotacao.price_buy
                    ? "Valor Moeda: " + this.state.valorCotacao.price_buy
                    : null}
                </span>
              </div>

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
              <Row>
                <h6>Senha</h6>
              </Row>
              <Row>
                <OtpInput
                  focusInput={1}
                  isInputNum={true}
                  value={this.state.senha}
                  onChange={(value) => this.setState({ senha: value })}
                  numInputs={6}
                  className="tokenValidacao"
                  inputType="password"
                />
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" disabled={this.state.disabled} onClick={this.valida_token2f}>
              Confirmar Compra
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
