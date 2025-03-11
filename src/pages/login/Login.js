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
  Image
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
import { UAParser } from "ua-parser-js";
import Produtos from "../../constants/Produtos";
import i18n from "../../tradutor/tradutor";
import Password from "../../components/password/Password";
import Otp from "../../components/otp/otp";
import LangButton from "../../components/langButton/LangButton";
import ReCAPTCHA from "react-google-recaptcha";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      loadingModal: false,
      contas: [],
      confirmShow: false,

      pessoa_id: "",
      token_chave: "",
      pfp: "",
      novaSenhaShow: false,
      token: false,
      email: "",

      password: ["", "", "", "", "", ""],
      senhaNew: "",
      modalShowLogin: false,
      OTP: "",
      loading: false,
      lang: "",
      cadastro: false,

      os: "",
      browser: "",
      cpu: "",
      identificador: "",

      captcha: "",
      captchaModal: false,

      qr: {
        qrcode: "",
        tempo_de_vida_previsto: 1
      },
      qr_key: "",
      qr_reloads: 0
    };
  }

  componentDidMount() {
    Funcoes.logout();

    UAParser()
      .withClientHints()
      .then((result) => {
        this.setState({
          os: result.os.name + " " + result.os.version,
          browser: result.browser.name + " " + result.browser.major,
          cpu: result.cpu.architecture,
        });
      });

    Funcoes.getUniqueToken().then((res) => {
      this.setState({ identificador: res });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (Produtos.login_otp.qrcode) {
      if (prevState.qr.tempo_de_vida_previsto !== this.state.qr.tempo_de_vida_previsto) {
        this.iniciarQr();
      }
    }
  }

  gerarChave = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < 64; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres[indiceAleatorio];
    }
    this.setState({ qr_key: resultado });
    return resultado;
  }

  getQr = async () => {
    const key = this.gerarChave();
    const data = {
      url: "otp/qrcode",
      data: {
        "usuario_id": this.state.otp_user_id,
        "device_key": key
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, false).then((res) => {
      const reloads = ++this.state.qr_reloads; 
      if (reloads >= 5) {
        this.pararQr();
        this.setState({ token: false });
      } else {
        this.setState({ qr: res, qr_reloads: reloads });
      }

    });
  }

  iniciarQr = () => {
    //Iniciar intervalo de geração do QRCode
    if (this.intervalQr) {
      clearInterval(this.intervalQr);
    }
    this.intervalQr = setInterval(() => {
      this.getQr();
    }, this.state.qr.tempo_de_vida_previsto * 1000);


    //Iniciar intervalo de checagem de se o QRCode
    if (this.intervalStatus) {
      clearInterval(this.intervalStatus);
    }
    this.intervalStatus = setInterval(() => {
      this.getQrStatus();
    }, 10000);
  };

  pararQr = () => {
    //Cancelar geração de QRCode
    if (this.intervalQr) {
      clearInterval(this.intervalQr);
      this.intervalQr = null;
    }

    //Cancelar checagem de validação do QRCode
    if (this.intervalStatus) {
      clearInterval(this.intervalStatus);
      this.intervalStatus = null;
    }

    this.setState({ qr_reloads: 0 });
  };

  getQrStatus = async () => {
    const data = {
      url: "otp/qrcode-liberado",
      data: {
        "usuario_id": this.state.otp_user_id,
        "device_key": this.state.qr_key
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, false).then(res => {
      if (res) {
        Funcoes.setToken(this.state.token_chave, this.state.pfp);
        window.location.href = "/home";
      }
    });
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

          // tokenc: this.state.captcha,

          so: this.state.os,
          brand: this.state.browser,
          model: this.state.cpu,
          identificador: this.state.identificador,
        },
        method: "POST",
      };
      if (Produtos.login_captcha) {
        data.data['tokenc'] = this.state.captcha;
      }
      Funcoes.Geral_API(data, false).then((res) => {
        if (res == 0) {
          this.props.alerts(
            i18n.t("login.alertaCombinacoes"),
            i18n.t("login.senhaIncorreta"),
            "warning"
          );
        } else if (res == 303) {
          this.props.alerts(
            i18n.t("login.erro"),
            i18n.t("login.requisicaoNaoPermitida"),
            "warning"
          );
        } else if (texto == "") {
          this.props.alerts(i18n.t("login.erroInterno"), "", "danger");
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
    localStorage.setItem("conta_grupos", JSON.stringify(contaGrupos));

    if (Produtos.login_otp.email) {
      this.enviarToken();
    }

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
      termos: dados.termos,
    };

    localStorage.setItem("termos", JSON.stringify(dados.termos));

    if (dados.pessoa_fisica.nome) {
      pessoa.termos = dados.termos;
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
      pessoa.termos = dados.termos;
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
      otp_user_id: pessoa.usuario_id,
      pfp: dados.foto_perfil,
      confirmShow: false,
      loading: false,
    });

    if (Produtos.login_otp.qrcode) {
      this.iniciarQr();
    }
  };

  tipoConta = (conta) => {
    if (conta.pessoa_fisica) return i18n.t("login.pessoa_fisica");
    if (conta.representante) return i18n.t("login.pessoa_juridica");
  };

  Valida_token_chave = async (id) => {
    const pessoa = JSON.parse(this.state.token_chave);
    const data = {
      url: "otp/validar",
      data: {
        usuario_id: pessoa.conta_id,
        token: id,
        ativa: 1,
      },
      method: "POST",
    };
    setTimeout(() => {
      Funcoes.Geral_API(data, true).then((res) => {
        if (res == true) {
          Funcoes.setToken(this.state.token_chave, this.state.pfp);
          window.location.href = "/home";
        } else {
          this.props.alerts(i18n.t("login.erro"), i18n.t("login.tokenInvalido"), "warning");
        }
      });
    }, 300);
  };

  Valida_token_email = async (id) => {
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
      Funcoes.Geral_API(data, true).then((res) => {
        if (res == true) {
          Funcoes.setToken(this.state.token_chave, this.state.pfp);
          window.location.href = "/home";
        } else {
          this.props.alerts(i18n.t("login.erro"), i18n.t("login.tokenInvalido"), "warning");
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
      if (Produtos.login_otp.email) {
        this.Valida_token_email(data);
      } else if (Produtos.login_otp.chave) {
        this.Valida_token_chave(data);
      }
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
                          {i18n.t("login.cadastrar")}
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
                            !this.state.email.match(
                              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            )
                          }
                          type="button"
                          className="botaologin btn-primary"
                          // onClick={() => this.combinacoes()}
                          onClick={() => {
                            if (Produtos.login_captcha) {
                              this.setState({ captchaModal: true, captcha: "" });
                            } else {
                              this.combinacoes()
                            }
                          }}
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
              onHide={() => {
                this.setState({ token: false });
                this.pararQr();
              }}
            >
              <Modal.Body>
                <Modal.Title className="mb-4">
                  {i18n.t("login.confirmeSuaIdentidade")}:
                </Modal.Title>

                <div>
                  {
                    (Produtos.login_otp.email && Produtos.login_otp.chave) ? (

                      <span>
                        {i18n.t("login.insiraCodigoEnviadoEmailChave")}
                      </span>

                    ) : Produtos.login_otp.email ? (

                      <span>
                        {i18n.t("login.insiraCodigoEnviadoEmail")}
                      </span>

                    ) : Produtos.login_otp.chave && (

                      <span>
                        {i18n.t("login.insiraCodigoChave")}
                      </span>

                    )
                  }

                  <div className="mt-3">
                    <Otp otpProp={this.getOtp}/>
                  </div>
                </div>

                {
                  Produtos.login_otp.qrcode && (Produtos.login_otp.chave || Produtos.login_otp.email) && (
                    <div className="d-flex my-3">
                      <hr className="divisoria" />

                      <span className="my-auto mx-3">
                        {i18n.t("login.ouQr")}
                      </span>

                      <hr className="divisoria" />
                    </div>
                  )
                }

                {
                  Produtos.login_otp.qrcode && (
                    <div>
                      <span>
                        {i18n.t("login.escaneieQr")}
                      </span>

                      <div className="mt-3 d-flex rounded" style={{ height: 200, backgroundColor: 'white' }}>
                        {
                          this.state.qr.qrcode == '' ? (
                            <ReactLoading
                              className="d-block m-auto"
                              type={"spin"}
                              color={"#000000"}
                              height={"50px"}
                              width={"15%"}
                            />
                          ) : (
                            <Image style={{ height: '200px', width: '200px' }} className="m-auto" src={this.state.qr.qrcode} />
                          )
                        }
                      </div>
                    </div>
                  )
                }


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
                    {i18n.t("login.selecionarConta")}
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
                        <h5 className="py-2">{i18n.t("login.pessoa_fisica")}</h5>
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
                        <h5 className="py-2">{i18n.t("login.pessoa_juridica")}</h5>
                      </Button>
                    ) : null}
                  </ButtonGroup>
                </div>
              </Modal.Body>
            </Modal>

            <Modal
              centered
              contentClassName="modalContent"
              show={this.state.captchaModal}
              onHide={() => this.setState({ captchaModal: false })}
            >
              <Modal.Header closeButton>
                Para sua segurança, complete o captcha antes de prosseguir
              </Modal.Header>
              <Modal.Body>
                <div>
                  <Row>
                    <ReCAPTCHA
                      className="mx-auto mb-2"
                      sitekey={process.env.CAPTCHA_KEY}
                      onChange={ (e) => { 
                        this.setState({ captcha: e });
                      }}
                      onErrored={ () => {
                        this.props.alerts(
                          i18n.t("login.erroConexao"),
                          i18n.t("login.tenteRecarregarPagina"),
                          "warning"
                        );
                      }}
                      size="normal"
                      type="image"
                      theme="light"
                      hl={i18n.t("login.captchaLang")}
                    />
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {
                  this.state.captcha && ( <>
                    <Button
                      onClick={ () => {
                        if (
                          this.state.password[0] != "" &&
                          this.state.password[1] != "" &&
                          this.state.password[2] != "" &&
                          this.state.password[3] != "" &&
                          this.state.password[4] != "" &&
                          this.state.password[5] != "" &&
                          this.state.email.match(
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          )
                        ) {
                          this.setState({ captchaModal: false });
                          this.combinacoes();
                        }
                      }}
                    >
                      Continuar
                    </Button>
                  </> )
                }
              </Modal.Footer>
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
