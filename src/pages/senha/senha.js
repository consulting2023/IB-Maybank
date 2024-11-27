import React, { Component } from "react";
import "../../templates/style_transferencia.scss";
import { Container, Col, Row, Button, Modal } from "react-bootstrap";
import Icones from "../../constants/Icon";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import Objetos from "../../constants/Objetos";
import i18n from "../../tradutor/tradutor";
import * as Funcoes from "../../constants/Funcoes";
import OtpInput from "react-otp-input";

export default class Senha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShowLogin: false,
      modalShowTransfer: false,
      OTP: "",
      senha: "",
      senhaTransfer: "",
      nivel: "",
    };
  }

  componentDidMount() {
    const nivel = localStorage.getItem("nivel");
    this.setState({ nivel });
  }

  modalSenhaLogin = () => {
    this.setState({ modalShowLogin: true });

    this.enviarToken();
  };
  modalSenhaTransfer = () => {
    this.setState({ modalShowTransfer: true });

    this.enviarToken();
  };

  enviarToken = () => {
    const data = {
      url: "token2f/novo",
      data: {
        email: Funcoes.pessoa.email,
      },
      method: "POST",
    };

    setTimeout(() => {
      Funcoes.Geral_API(data, true).then((res) => {
        if (res === 1) {
          alert("Token enviado para o email");
        }
      });
    }, 300);
  };

  trocarSenha = () => {
    if (this.state.senha == "") {
      alert("É Obrigatorio preencher a senha para seguir adiante");
    } else if (this.state.OTP == "") {
      alert("É Obrigatorio preencher a o token para seguir adiante");
    } else {
      const data = {
        url: "usuario/troca-senha",
        data: {
          email: Funcoes.pessoa.email,
          token: this.state.OTP,
          senha: this.state.senha,
        },
        method: "POST",
        console: false,
        tipo_aparelho: global.tipoaparelho,
        funcao: "salvar_nova",
        tela: "recuperar",
      };

      Funcoes.Geral_API(data, true).then((res) => {
        console.log(res);
        if (res === 1) {
          alert("Senha alterada com sucesso! Sera preciso Logar novamente");
          Funcoes.logout();
        } else {
          alert("Erro em alterar a senha, tente novamente mais tarde");
          location.reload();
        }
      });
    }
  };

  trocarSenhaTransfer = () => {
    if (this.state.senhaTransfer == "") {
      alert("É Obrigatorio preencher a senha para seguir adiante");
    } else if (this.state.OTP == "") {
      alert("É Obrigatorio preencher a o token para seguir adiante");
    } else {
      const data = {
        url: "usuario/troca-senha-transferencia",
        data: {
          email: Funcoes.pessoa.email,
          token: this.state.OTP,
          senha: this.state.senhaTransfer,
        },
        method: "POST",
        console: false,
        tipo_aparelho: global.tipoaparelho,
        funcao: "salvar_nova",
        tela: "recuperar",
      };

      Funcoes.Geral_API(data, true).then((res) => {
        if (res === 1) {
          alert("Senha alterada com sucesso!");
          location.reload();
        } else {
          alert("Erro em alterar a senha, tente novamente mais tarde");
          location.reload();
        }
      });
    }
  };

  render() {
    return (
      <div>
        <BannerTitle
          title={i18n.t("senha.senhaTitle")}
          img={Objetos.transferenciaImg}
        />

        <Container className="p-3 d-flex justify-content-center">
          <Col md={8} className="baseWindow px-5 py-4">
            <Row>
              <p
                className="mb-2 w-100 text-center"
                style={{ fontSize: "1.30em" }}
              >
                <strong>Escolha a senha que deseja alterar:</strong>
              </p>
            </Row>
            <Row className="text-center px-3">
              <Col className="p-3">
                <Button
                  variant="outline-primary"
                  className="baseButtonPrimary"
                  onClick={() => this.modalSenhaLogin()}
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      {Icones.senhaLogin}
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">Senha de Login</p>
                    </Col>
                  </Row>
                </Button>
              </Col>
              {this.state.nivel !== "400" && (
                <Col className="p-3">
                  <Button
                    variant="outline-primary"
                    className="baseButtonPrimary"
                    onClick={this.modalSenhaTransfer}
                  >
                    <Row className="w-80 m-auto">
                      <Col xs={5} className="m-auto px-0">
                        {Icones.senhaTransfer}
                      </Col>
                      <Col xs={7} className="px-0 my-auto">
                        <p className="buttonTitle m-auto">
                          Senha de Transferência
                        </p>
                      </Col>
                    </Row>
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Container>

        {/* Modal Senha Login */}
        <Modal
          size="lg"
          show={this.state.modalShowLogin}
          onHide={() => this.setState({ modalShowLogin: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Senha Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <h3>Token enviado para seu email</h3>
              </Row>
              <Row>
                <OtpInput
                  focusInput={1}
                  isInputNum={true}
                  value={this.state.OTP}
                  onChange={(value) => this.setState({ OTP: value })}
                  numInputs={6}
                  className="tokenValidacao"
                />
              </Row>
              <Row>
                <h6>Senha Nova</h6>
              </Row>
              <Row>
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
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.trocarSenha}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Senha Transferência */}

        <Modal
          show={this.state.modalShowTransfer}
          size="lg"
          onHide={() => this.setState({ modalShowTransfer: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Senha Transação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <h3>Token enviado para seu email</h3>
              </Row>
              <Row>
                <OtpInput
                  isInputSecure={true}
                  focusInput={1}
                  isInputNum={true}
                  value={this.state.OTP}
                  onChange={(value) => this.setState({ OTP: value })}
                  numInputs={6}
                  className="tokenValidacao"
                />
              </Row>
              <Row>
                <h6>Senha Transação Nova</h6>
              </Row>
              <Row>
                <OtpInput
                  isInputSecure={true}
                  focusInput={1}
                  isInputNum={true}
                  value={this.state.senhaTransfer}
                  onChange={(value) => this.setState({ senhaTransfer: value })}
                  numInputs={6}
                  className="tokenValidacao"
                />
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.trocarSenhaTransfer}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
