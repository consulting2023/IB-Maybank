import React, { Component } from "react";
import "../../templates/style_login.scss";
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
import Password from "../../components/password/Password";
import Otp from "../../components/otp/otp";
import LangButton from "../../components/langButton/LangButton";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      loadingModal: false,
      Qrcode_imagem: null,
      contas: [],
      confirmShow: false,

      token_chave: "",
      pfp: "",
      novaSenhaShow: false,
      token: false,
      inputToken: true,
      inputTokenQrcode: false,
      email: "",

      password: ["", "", "", "", "", ""],
      senhaNew: "",
      modalShowLogin: false,
      OTP: "",
      loading: false,
      lang: "",
      cadastro: false,
    };
  }

  componentDidMount() {
    Funcoes.logout();
  }

  componentWillUnmount() {
    this.gerar_qrcode();
    this.validar_qrcode();
  }

  combinacoes = async () => {
    this.setState({ loading: true });
    let { password, email } = this.state;

    if (password.some((e) => e == "") || email == "") {
      this.props.alerts(
        i18n.t("login.alertaCombinacoes"),
        i18n.t("login.preencha"),
        "warning"
      );
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });

      const cartesian = (a) =>
        a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
      let output = cartesian(password);
      let texto = [];

      for (var i = 0; i < Object.keys(output).length; i++) {
        texto.push(
          output[i][0] +
            "" +
            output[i][1] +
            "" +
            output[i][2] +
            "" +
            output[i][3] +
            "" +
            output[i][4] +
            "" +
            output[i][5]
        );
      }

      const data = {
        url: "usuario/login",
        data: {
          email: email,
          password: texto,
          sub_banco_id: "",
          token_aparelho: "",
          nome_aparelho: "",
        },
        method: "POST",
      };

      // Funcoes.Geral_API(data, false).then((res) => {
      Funcoes.Geral_API(data, false).then((res) => {
        console.log(res);

        if (res == 0) {
          this.props.alerts(
            i18n.t("login.alertaCombinacoes"),
            i18n.t("login.senhaIncorreta"),
            "warning"
          );
        } else if (texto == "") {
          this.props.alerts("Erro interno", "", "danger");
        } else {
          var arrContas = [];
          Object.keys(res).forEach(function (key) {
            arrContas.push(res[key]);
          });

          this.setState({ contas: arrContas });
          var orderedArr = [];

          if (Object.keys(res).length == 1) {
            arrContas.map((conta) => this.loginConta(conta));
          } else {
            if (arrContas[0]["pessoa_fisica"]) {
              orderedArr = arrContas;
            } else if (arrContas[0]["representante"]) {
              orderedArr[0] = arrContas[1];
              orderedArr[1] = arrContas[0];
            }
            this.setState({ contas: orderedArr, confirmShow: true });
          }
        }
        this.setState({ loading: false });
      });
    }
  };

  loginConta = (dados) => {
    console.log(dados.conta.ativo);
    if (dados.conta.ativo == 0) {
      this.props.alerts(
        i18n.t("login.tituloContaNãoAprovada"),
        i18n.t("login.contaNãoAprovada"),
        "warning"
      );
      return;
    }
    localStorage.setItem("nivel", dados.usuario.nivel);
    const contaGrupos = dados.conta_grupos || [];
    console.log("Salvando conta_grupos no localStorage:", contaGrupos);
    localStorage.setItem("conta_grupos", JSON.stringify(contaGrupos));
    this.enviarToken();
    this.setState({
      Qrcode_imagem: null,
      inputToken: true,
      inputTokenQrcode: false,
    });

    var n = dados.conta.id;
    n = ("0000000" + n).slice(-7);

    var pessoa = {
      chave: dados.chave,
      email: dados.usuario.email,
      token_api: dados.token_acesso,
      cpf_cnpj: dados.documentos.cpf,
      agencia: dados.conta.agencia,
      conta: n,
      conta_id: dados.conta.id,
      digito: dados.conta.digito,
      // image_home: dados.foto_perfil,
      cep: dados.endereco.cep,
      endereco: dados.endereco.endereco,
      numero: dados.endereco.numero,
      complemento: dados.endereco.complemento,
      bairro: dados.endereco.bairro,
      cidade: dados.endereco.cidade,
      estado: dados.endereco.estado,
      emite_boleto: dados.conta.emite_boleto,
    };

    if (dados.pessoa_fisica.nome) {
      pessoa.celular = dados.pessoa_fisica.celular;
      pessoa.data_nascimento = dados.pessoa_fisica.datanascimentos;
      pessoa.documento_id = dados.pessoa_fisica.documento_id;
      pessoa.razao_social = dados.pessoa_fisica.nome;
      pessoa.mostrar = false;
      pessoa.endereco_id = dados.pessoa_fisica.enderecoid;
      pessoa.estado_civil = dados.pessoa_fisica.civil;
      pessoa.id = dados.pessoa_fisica.id;
      pessoa.nome = dados.pessoa_fisica.nome;
      pessoa.nomemae = dados.pessoa_fisica.nomemae;
      pessoa.politicamente_exposta = dados.pessoa_fisica.politico;
      pessoa.sexo = dados.pessoa_fisica.sexo;
      pessoa.token_id = dados.pessoa_fisica.tokenid;
      pessoa.usuario_id = dados.pessoa_fisica.usuarioid;
      pessoa.pf_pj = "pf";
    } else if (dados.representante.nome) {
      pessoa.celular = dados.representante.celular;
      pessoa.data_nascimento = dados.representante.data_nascimento;
      pessoa.documento_id = dados.representante.documento_id;
      pessoa.doc = dados.pessoaJuridica.CNPJ;
      pessoa.razao_social = dados.pessoaJuridica.razao_social;
      pessoa.mostrar = true;
      pessoa.endereco_id = dados.representante.endereco_id;
      pessoa.estado_civil = dados.representante.estado_civil;
      pessoa.id = dados.representante.id;
      pessoa.nome = dados.representante.nome;
      pessoa.nomemae = dados.representante.nomemae;
      pessoa.pessoa_juridica_id = dados.representante.pessoa_juridica_id;
      pessoa.politicamente_exposta = dados.representante.politicamente_exposta;
      pessoa.sexo = dados.representante.sexo;
      pessoa.token_id = dados.representante.token_id;
      pessoa.usuario_id = dados.representante.usuario_id;
      pessoa.pf_pj = "pj";
    }
    const chave = JSON.stringify(pessoa);
    this.setState({
      token: true,
      token_chave: chave,
      pfp: dados.foto_perfil,
      confirmShow: false,
      loading: false,
    });
  };

  tipoConta = (conta) => {
    if (conta.pessoa_fisica) return i18n.t("login.pessoa_fisica");
    if (conta.representante) return i18n.t("login.pessoa_juridica");
  };

  Valida_token = async (id) => {
    let email = "";
    Produtos.testSuporte.testLogin
      ? (email = Produtos.testSuporte.emailTest)
      : (email = this.state.email);
    const pessoa = JSON.parse(this.state.token_chave);
    const data = {
      url: "utilitarios/validacao-email-ib",
      data: {
        usuario_id: pessoa.conta_id,
        email: email,
        token: id,
        ativa: 1,
      },
      method: "POST",
    };
    setTimeout(() => {
      // Funcoes.Geral_API(data, true).then((res) => {
      Funcoes.Geral_API(data, true).then((res) => {
        console.log(res);
        if (res == true) {
          Funcoes.setToken(this.state.token_chave, this.state.pfp);
          window.location.href = "/home";
        } else {
          this.props.alerts("Erro", "Token inválido", "warning");
        }
      });
    }, 300);
  };

  traduzir = async (data) => {
    this.props.langProp(data);
  };

  getPass = async (data) => {
    this.setState({ password: data });
  };

  getOtp = async (data) => {
    if (data.length == 6) {
      this.Valida_token(data);
    }
  };

  enviarToken = () => {
    let email = "";
    Produtos.testSuporte.testLogin
      ? (email = Produtos.testSuporte.emailTest)
      : (email = this.state.email);
    const data = {
      url: "utilitarios/validacao-email-envio",
      data: {
        email: email,
      },
      method: "POST",
    };

    setTimeout(() => {
      // Funcoes.Geral_API(data, true).then((res) => {
      Funcoes.Geral_API(data, true).then((res) => {
        if (res == true) {
          console.log(res);
        }
      });
    }, 300);
  };

  modalSenhaLogin = () => {
    if (this.state.email == "") {
      alert(i18n.t("login.alertEsqueciSenha"));
    } else {
      this.setState({ modalShowLogin: true });

      this.enviarTokenTrocaSenha();
    }
  };

  enviarTokenTrocaSenha = () => {
    const data = {
      url: "token2f/novo",
      data: {
        email: this.state.email,
      },
      method: "POST",
    };

    setTimeout(() => {
      Funcoes.Geral_API(data, true).then((res) => {
        if (res === 1) {
          alert(i18n.t("login.tokenEnviado"));
        }
      });
    }, 300);
  };

  trocarSenha = () => {
    if (this.state.senha == "") {
      alert(i18n.t("login.alertSemSenha"));
    } else if (this.state.OTP == "") {
      alert(i18n.t("login.alertSemToken"));
    } else {
      const data = {
        url: "usuario/troca-senha",
        data: {
          email: this.state.email,
          token: this.state.OTP,
          senha: this.state.senhaNew,
        },
        method: "POST",
        console: false,
        tipo_aparelho: global.tipoaparelho,
        funcao: "salvar_nova",
        tela: "recuperar",
      };

      Funcoes.Geral_API(data, true).then((res) => {
        if (res === 1) {
          alert(i18n.t("login.alertSenhaAlteradaComSucesso"));
          location.reload();
        } else {
          alert(i18n.t("login.alertErroAlterarSenha"));
          location.reload();
        }
      });
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
              {Produtos.mostrar_tradutor ? (
                <li className="loginLangWrapper">
                  <LangButton langProp={this.traduzir} />
                </li>
              ) : null}
            </ul>
          </Container>

          <div className="h-80 d-flex flex-row align-items-center justify-content-center">
            {/* Campos de Login */}
            <div className="login-usuario select-none d-flex align-items-center">
              <div className="w-100">
                <div>
                  <h1 className="mb-2">
                    {i18n.t("login.acesse_sua_conta", {
                      banco: process.env.NOME_BANCO,
                    })}
                  </h1>

                  <hr className="divisoria" />

                  <h2 className="m-0">
                    {i18n.t("login.info_credenciais", {
                      banco: process.env.NOME_BANCO,
                    })}
                  </h2>
                </div>

                <br />

                <FormGroup className="m-0">
                  {/* Campo de E-Mail */}
                  <label>{i18n.t("login.email")}</label>
                  <FormControl
                    className="email-input btn-primary"
                    id="email"
                    autoComplete="off"
                    value={this.state.email}
                    onChange={(event) =>
                      this.setState({ email: event.target.value })
                    }
                  />
                </FormGroup>

                <br />

                <label>{i18n.t("login.senha")}</label>
                <Button
                  type="button"
                  className="resetSenha"
                  onClick={() => this.modalSenhaLogin()}
                >
                  {" "}
                  {i18n.t("login.esqueciSenha")}
                </Button>

                <div className="loginPassWrapper">
                  <Password passProp={this.getPass} />
                </div>

                <br />

                <div>
                  <Row>
                    {Produtos.cadastro.cadastroLiberado ? (
                      <Col className="text-center">
                        <Button
                          type="button"
                          className="botaologin btn-primary"
                          onClick={() => this.setState({ cadastro: true })}
                        >
                          Cadastrar
                        </Button>
                      </Col>
                    ) : null}

                    {/* Botao de Entrar */}
                    <Col className="text-center">
                      {this.state.loading ? (
                        <ReactLoading
                          className="d-block m-auto"
                          type={"bubbles"}
                          color={"#fff"}
                          height={"50px"}
                          width={"15%"}
                        />
                      ) : (
                        <Button
                          disabled={
                            this.state.password[0] == "" ||
                            this.state.password[1] == "" ||
                            this.state.password[2] == "" ||
                            this.state.password[3] == "" ||
                            this.state.password[4] == "" ||
                            this.state.password[5] == "" ||
                            this.state.email.length < 5 ||
                            !this.state.email.match(
                              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            )
                          }
                          type="button"
                          className="botaologin btn-primary"
                          onClick={() => this.combinacoes()}
                        >
                          {i18n.t("login.entrar")}
                        </Button>
                      )}
                    </Col>
                    
                  </Row>

                  {/* {Produtos.siso ? (<Row> */}
                  {/* Botao de Entrar */}
                  {/* <Col className="botaologinCol col-sm-12 "> */}
                  {/* <Button onClick={() => window.location.href = '/siso'} className="botaologin" >{i18n.t('login.conheca_produtos')}</Button> */}
                  {/* </Col> */}
                  {/* </Row>) : null} */}
                </div>
              </div>
            </div>

            {/* Campo Slide */}
            <div className="slider d-block">
              <Carousel
                fade={true}
                indicators={true}
                prevLabel=""
                nextLabel=""
                slide
              >
                <Carousel.Item>
                  <img
                    className="d-block object-fit-cover w-100"
                    src={Objetos.sliderLogin}
                  />
                  <Carousel.Caption className="m-auto">
                    <h3 className="m-1">{process.env.NOME_BANCO}</h3>
                    <p className="m-2">{i18n.t("login.texto_1")}</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img className="d-block w-100" src={Objetos.sliderLogin2} />
                  <Carousel.Caption>
                    <h3 className="m-1">{i18n.t("login.texto_2")}</h3>
                    <p className="m-2">{i18n.t("login.texto_3")}</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img className="d-block w-100" src={Objetos.sliderLogin3} />
                  <Carousel.Caption>
                    <h3 className="m-1">{i18n.t("login.texto_2")}</h3>
                    <p className="m-2">{i18n.t("login.texto_3")}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>

            <Modal
              // dialogClassName="modalDialog"
              contentClassName="modalContent"
              show={this.state.confirmShow}
              // show={true}
              centered
              onHide={() =>
                this.setState({ confirmShow: false, loading: false })
              }
            >
              <Modal.Body>
                <div className="container text-center">
                  <h1>{i18n.t("login.como_deseja_logar")}</h1>
                  <ButtonGroup className="mt-4 d-flex flex-row justify-content-between">
                    {this.state.contas.map((conta) => (
                      <Button
                        disabled={this.state.loadingModal}
                        key={conta.conta.id}
                        type="button"
                        className={
                          "btn-primary col-12 mx-1 text-center modalBtn"
                        }
                        onClick={() => this.loginConta(conta)}
                      >
                        <h5 className="py-2">{this.tipoConta(conta)}</h5>
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
              </Modal.Body>
            </Modal>

            <Modal
              centered
              contentClassName="modalContent"
              // dialogClassName="modalDialog"
              show={this.state.token}
              // show={true}
              onHide={() => this.setState({ token: false })}
            >
              <Modal.Body>
                <h1>{i18n.t("login.chave_de_acesso")}</h1>
                <span>
                  {i18n.t("login.abra_o_aplicativo", {
                    banco: process.env.NOME_BANCO,
                  })}
                </span>
                <div>
                  {this.state.inputToken ? (
                    <div>
                      <hr className="divisoria" />
                      <h1>{i18n.t("login.token")}</h1>
                      <span>{i18n.t("login.chave_token")}</span>
                      <Otp otpProp={this.getOtp} className="mt-2" />
                    </div>
                  ) : null}

                  {/* QR Code */}
                  {/* {this.state.inputTokenQrcode ?
                    <Container>
                      <hr />
                      <h4>{i18n.t('login.qrcode')}</h4>
                      <span>{i18n.t('login.ler_qrcode')}</span>
                      <Row >
                        <Col className="col-md-12">
                          <img src={this.state.Qrcode_imagem} className="qrCode" />
                        </Col>
                      </Row>
                    </Container>
                  :
                    <></>
                  } */}
                </div>
              </Modal.Body>
            </Modal>

            <Modal
              size="lg"
              show={this.state.modalShowLogin}
              onHide={() => this.setState({ modalShowLogin: false })}
            >
              <Modal.Header closeButton>
                <Modal.Title>{i18n.t("login.senha")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Row>
                    <h3>{i18n.t("login.tokenModalSenha")}</h3>
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
                    <h6>{i18n.t("login.senhaModalSenha")}</h6>
                  </Row>
                  <Row>
                    <OtpInput
                      focusInput={1}
                      isInputNum={true}
                      value={this.state.senhaNew}
                      onChange={(value) => this.setState({ senhaNew: value })}
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

            <Modal
              // dialogClassName="modalDialog"
              contentClassName="modalContent"
              show={this.state.cadastro}
              // show={true}
              centered
              onHide={() => this.setState({ cadastro: false })}
            >
              <Modal.Body>
                <div className="container text-center">
                  <h1 style={{ color: "white" }}>
                    Selecione o tipo de conta para cadastro
                  </h1>
                  <ButtonGroup className="mt-4 d-flex flex-row justify-content-between">
                    {Produtos.cadastro.cadastroPF ? (
                      <Button
                        type="button"
                        className={
                          "btn-primary col-12 mx-1 text-center modalBtn"
                        }
                        onClick={() => (window.location.href = "/cadastropf")}
                      >
                        <h5 className="py-2">Pessoa Física</h5>
                      </Button>
                    ) : null}

                    {Produtos.cadastro.cadastroPj ? (
                      <Button
                        type="button"
                        className={
                          "btn-primary col-12 mx-1 text-center modalBtn"
                        }
                        onClick={() => (window.location.href = "/cadastropj")}
                      >
                        <h5 className="py-2">Pessoa Jurídica</h5>
                      </Button>
                    ) : null}
                  </ButtonGroup>
                </div>
              </Modal.Body>
            </Modal>
          </div>
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
