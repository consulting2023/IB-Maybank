import React, { Component } from "react";
import "../../templates/style_header.scss";
import NotificationBadge from "react-notification-badge";
import {
  Navbar,
  Container,
  Modal,
  Row,
  Image,
  Col,
  Button,
  Dropdown,
} from "react-bootstrap";
import ReactLoading from "react-loading";
import Icones from "../../constants/Icon";
import Objetos from "../../constants/Objetos";
import * as Funcoes from "../../constants/Funcoes";
import * as Formatar from "../../constants/Formatar";
import Produtos from "../../constants/Produtos";
// import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import i18n from "../../tradutor/tradutor";

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      qtd_notificacao: 0,
      msgBadge: false,
      showMsgModal: false,
      lista_msg: [],
      msgListShow: false,
      msg: [],
      pessoa: {},
      saldos: {},
    };
  }

  componentDidMount() {
    const pessoaObj = Funcoes.pessoa;
    this.setState({ pessoa: pessoaObj }, () => {
      this.listar_msg();
    });

    this.SaldoConta();
  }

  componentWillUnmount() {
    this.componentDidMount();
  }

  SaldoConta = () => {
    const data = {
      url: "conta/saldo",
      data: { conta_id: Funcoes.pessoa.conta_id },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      let tmpSaldos = this.state.saldos;

      if (Produtos.saldoDigital)
        tmpSaldos.digital = {
          id: "1",
          show: false,
          icone: Icones.saldo1,
          titulo: i18n.t("home.saldoDigital"),
          saldo: Formatar.formatarMoeda(res.digital),
          saldoTrue: res.digital,
        };

      // if (Produtos.saldoCartao) tmpSaldos.push({ show: false, icone: Icones.saldo2, titulo: i18n.t('home.saldoCartao'), saldo: Formatar.formatarMoeda(res.cartao), saldoTrue: res.cartao });

      // if (Produtos.saldoCredito) tmpSaldos.push({ show: false, icone: Icones.saldo3, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.credito), saldoTrue: res.credito });

      // if (Produtos.saldoInvestimento) tmpSaldos.push({ show: false, icone: Icones.saldo4, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.investimento), saldoTrue: res.investimento });

      this.setState({ saldos: tmpSaldos });
    });
  };

  setBlur = () => {
    this.SaldoConta()
    setTimeout(() => {
      const newSaldos = this.state.saldos;
    newSaldos.digital.show = !this.state.saldos.digital.show;
    
    this.setState({ saldos: newSaldos });
    }, 500);
    
  };

  exibir_msg = (dados) => {
    this.setState({
      msg: dados,
      showMsgModal: true,
    });
  };

  openList = (data) => {
    this.setState({ msgListShow: data });
  };

  listar_msg = () => {
    const dados = {
      url: "mensagem-conta/lista",
      data: {
        data_de: format(new Date(), "yyyy-MM-dd"),
        data_ate: format(new Date(), "yyyy-MM-dd"),
        conta_id: this.state.pessoa.conta_id,
      },
      method: "POST",
    };

    Funcoes.Geral_API(dados, true).then((result) => {
      if (Object.keys(result).length > 0) {
        this.setState({ msgBadge: true });

        var tem_not = 0;
        var lista_msg = [];

        for (var i = 0; i < Object.keys(result).length; i++) {
          if (result[i].status == 0) {
            tem_not++;

            var str = result[i].mensagem;
            var res = "";

            if (str.length > 20) {
              res = str.substr(0, 30);
              res = res + " ...";
            } else {
              res = result[i].mensagem;
            }

            lista_msg.push({
              id: result[i].id,
              msg: result[i].mensagem,
              inicio: res,
            });
          }
        }

        if (tem_not > 0) {
          this.setState({ msgBadge: true, qtd_notificacao: tem_not });
        } else {
          this.setState({
            msgBadge: false,
            qtd_notificacao: tem_not,
          });
        }
      } else {
        this.setState({ msgBadge: false });
      }
      //         lista_msg = [
      //           {
      //             id: 1,
      //             msg: "aaaaaaaaaaaaaaaaaaaaaaaaaa",
      //             inicio: "aaaa"
      //           },
      //           {
      //             id: 2,
      //             msg: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      //             inicio: "bbbb"
      //           }
      //         ]
      //         this.setState({ lista_msg });

      //       this.setState({ msgBadge: true, qtd_notificacao: 2 });

      // console.log(this.state)
    });
  };

  marcarMsg = () => {
    const dados = {
      url: "mensagem-conta/status",
      data: { id: this.state.msg.id },
      method: "POST",
    };

    Funcoes.Geral_API(dados, true).then(() => {
      this.setState({ showMsgModal: false, lista_msg: [], msg: [] });
      this.listar_msg();
    });
  };

  render() {
    const { pessoa } = this.state;
    if (Object.keys(pessoa).length > 0) {
      return (
        <div className="header">
          <Navbar className="navbar-expand-lg header-component">
            <Container fluid className="p-4">
              <Navbar.Brand className="select-none">
                {Objetos.logo_banco_header}
              </Navbar.Brand>

              <ul className="navbar-nav align-items-center">
                <li className="nav-item mx-1">
                  {this.state.saldos.digital ? (
                    <div className="saldosWrapper">
                      <Button
                        className="saldosBtn btn-light w-100 p-1"
                        onClick={() => this.setBlur()}
                      >
                        <Container className="saldosContainer textoOverlay cursor-pointer py-2 justify-content-center position-relative">
                          <Row className="select-none">
                            <Col xs={3} className="px-0 pr-2">
                              <p className="mt-2">
                                {this.state.saldos.digital.icone}
                              </p>
                            </Col>

                            <Col xs={9}>
                              <Row className="saldosHome justify-content-center">
                                <p className="text-nowrap texto-saldos select-none">
                                  {/* {this.state.saldos.digital.titulo} */}
                                  {this.state.saldos.digital.id === "1"
                                    ? i18n.t("home.saldoDigital")
                                    : "var_error"}
                                </p>
                              </Row>

                              <Row className="justify-content-center">
                                <span
                                  className={
                                    "texto-saldos select-none saldoValor " +
                                    (this.state.saldos.digital.show
                                      ? "deblurred"
                                      : null)
                                  }
                                >
                                  {this.state.saldos.digital.saldo}
                                </span>
                              </Row>
                            </Col>
                          </Row>
                          <span className="p-2 px-3 mt-8 position-absolute text-center textoHeader">
                            Saldo
                          </span>
                        </Container>
                      </Button>
                    </div>
                  ) : (
                    <div className="saldosWrapper">
                      <ReactLoading
                        type={"spin"}
                        className="p-2 m-auto d-block"
                      />
                    </div>
                  )}
                </li>

                <li className="nav-item mx-1">
                  <div className="usuarioWrapper">
                    <Button
                      variant="outline-primary"
                      className="p-1 m-0 w-100 usuarioBtn"
                      onClick={() => (window.location.href = "/perfil")}
                    >
                      <Container className="textoOverlay cursor-pointer justify-content-center position-relative">
                        <Col xs={4} className="px-2">
                          <Image
                            draggable="false"
                            className="usuarioPfp select-none"
                            src={"data:image/png;base64," + pessoa.image_home}
                            roundedCircle
                          />
                        </Col>
                        <Col xs={8} className="px-2">
                          <p className="text-left usuario">
                            {i18n.t("header.ola") + pessoa.nome.split(" ")[0]}
                            <br />
                            {i18n.t("header.conta") +
                              ("0000000" + pessoa.conta_id).slice(-7) +
                              "-" +
                              pessoa.digito}
                            <br />
                            {i18n.t("header.agencia") + pessoa.agencia}
                            <br />
                            {pessoa.mostrar &&
                              i18n.t("header.empresa") + pessoa.razao_social}
                          </p>
                        </Col>
                        <span className="p-2 px-3 mt-8 position-absolute text-center textoHeader">
                          Perfil
                        </span>
                      </Container>
                    </Button>
                  </div>
                </li>

                <li className="nav-item mx-1">
                  <Dropdown
                    onClick={() => this.openList(!this.state.msgListShow)}
                    onBlur={() => this.openList(false)}
                  >
                    <Dropdown.Toggle
                      variant="outline-primary"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      type="button"
                      className="btnHeader textoOverlay"
                    >
                      <Container className="p-0 justify-content-center">
                        {this.state.msgBadge ? (
                          <NotificationBadge
                            className="mt-n1 mr-n1"
                            count={this.state.qtd_notificacao}
                          />
                        ) : null}

                        {Icones.notificacoes}

                        {!this.state.msgListShow ? (
                          <span className="p-2 px-3 mt-8 position-absolute text-center textoHeader">
                            Mensagens
                          </span>
                        ) : null}
                      </Container>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      className="dropdown-menu-right mt-2 p-2 msgLista"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <table className="w-100">
                        <tbody>
                          {Object.keys(this.state.lista_msg).length > 0 ? (
                            this.state.lista_msg.map((i) => (
                              <tr key={i.id} className="w-100 h-100">
                                <td>
                                  <Dropdown.Item
                                    className="p-2"
                                    onClick={() => this.exibir_msg(i)}
                                  >
                                    {i.inicio}
                                  </Dropdown.Item>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="float-left w-100 text-left btnDropMsg">
                              <td>
                                <br />
                                <span className="d-block w-100">
                                  {i18n.t("header.nenhumaNotif")}
                                </span>
                                <br />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </Container>
          </Navbar>

          <Modal
            // dialogClassName="modalDialog"
            // contentClassName="modalContent"
            centered
            show={this.state.showMsgModal}
            onHide={() => this.setState({ showMsgModal: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>{i18n.t("header.ola") + pessoa.nome}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container className="p-4 text-center">
                <p>{this.state.msg.msg}</p>
              </Container>
            </Modal.Body>
            <Modal.Footer className="p-0">
              <Button onClick={() => this.marcarMsg()} className="m-3">
                {i18n.t("header.lidoNotif")}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else {
      return null;
    }
  }
}
