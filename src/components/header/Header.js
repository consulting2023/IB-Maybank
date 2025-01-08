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
import { browserName } from "react-device-detect";
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
      termoModal: false,
      termo: "",
      btnTermo: true,
      chaveTermo: {},
      ipUser: "",
      tokenApp: "",
    };
  }

  componentDidMount() {
    Funcoes.getUserIp().then((res) => {
      this.setState({ ipUser: res });
    });

    Funcoes.getUniqueToken().then((res) => {
      this.setState({ tokenApp: res });
    });
    this.recuperarTermos();
    this.novoTermo();

    const pessoaObj = Funcoes.pessoa;
    this.setState({ pessoa: pessoaObj }, () => {
      this.listar_msg();
    });

    this.SaldoConta();
    if (this.scrollContainer) {
      const images = this.scrollContainer.querySelectorAll("img");
      images.forEach((img) =>
        img.addEventListener("load", this.handleImageLoad)
      );
    }
  }

  componentWillUnmount() {
    this.componentDidMount();
    if (this.scrollContainer) {
      const images = this.scrollContainer.querySelectorAll("img");
      images.forEach((img) =>
        img.removeEventListener("load", this.handleImageLoad)
      );
    }
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
          saldoBloqueado: Formatar.formatarMoeda(res.bloqueados),
          saldoTrue: res.digital,
        };

      // if (Produtos.saldoCartao) tmpSaldos.push({ show: false, icone: Icones.saldo2, titulo: i18n.t('home.saldoCartao'), saldo: Formatar.formatarMoeda(res.cartao), saldoTrue: res.cartao });

      // if (Produtos.saldoCredito) tmpSaldos.push({ show: false, icone: Icones.saldo3, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.credito), saldoTrue: res.credito });

      // if (Produtos.saldoInvestimento) tmpSaldos.push({ show: false, icone: Icones.saldo4, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.investimento), saldoTrue: res.investimento });

      this.setState({ saldos: tmpSaldos });
    });
  };

  setBlur = () => {
    this.SaldoConta();
    setTimeout(() => {
      const newSaldos = this.state.saldos;
      newSaldos.digital.show = !this.state.saldos.digital.show;
      newSaldos.digital.showBloqueado =
        !this.state.saldos.digital.showBloqueado;

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

  modalTermo = () => {
    alert("Para poder Prosseguir é Necessario Aceitar os termos");
  };

  termo = (chave) => {
    console.log(chave);

    let data = {};

    const firstKey = Object.keys(chave)[0];
    if (firstKey) {
      data = {
        url: "termos/texto",
        data: {
          chave: chave[firstKey], // Usa a primeira chave disponível
        },
        method: "POST",
      };
    } else {
      console.error("Nenhuma chave válida encontrada.");
      return; // Encerra a função se não houver chaves válidas
    }

    // Chamada à API
    Funcoes.Geral_API(data, true)
      .then((res) => {
        console.log(res.texto);
        if (res && res.texto) {
          this.setState({ termo: res });
          this.checkScrollRequirement();
        } else {
          console.error("Erro: Resposta inválida da API", res);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar o termo:", error);
      });
  };

  handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // Se chegou ao fim do scroll, libera o botão
    if (scrollTop + clientHeight >= scrollHeight) {
      this.setState({ btnTermo: false });
      console.log("Chegou ao fim do scroll!");
    } else {
      this.setState({ btnTermo: true });
      console.log("Ainda há conteúdo para rolar.");
    }
  };

  checkScrollRequirement = () => {
    if (this.scrollContainer) {
      const { scrollHeight, clientHeight } = this.scrollContainer;

      // Se não há scroll necessário, libera o botão
      if (scrollHeight <= clientHeight) {
        this.setState({ btnTermo: false });
        console.log("Sem necessidade de scroll, botão ativado!");
      }
    }
  };

  handleImageLoad = () => {
    // Força uma revalidação de layout ao carregar imagens
    if (this.scrollContainer) {
      this.scrollContainer.scrollTop = this.scrollContainer.scrollTop; // Mantém o scroll no mesmo lugar
    }
  };

  recuperarTermos = () => {
    const termosSalvos = localStorage.getItem("termos");
    console.log(termosSalvos); // Verifica o que está sendo recuperado

    if (termosSalvos) {
      try {
        // Verifica se os dados são uma string válida antes de tentar parsear
        if (typeof termosSalvos === "string") {
          // Tenta parsear a string JSON e atribuir à Funcoes.pessoa.termos
          Funcoes.pessoa.termos = JSON.parse(termosSalvos);
        } else {
          console.error(
            "Erro: Dados no localStorage não são uma string válida"
          );
          Funcoes.pessoa.termos = []; // Caso o valor não seja válido, usa um array vazio
        }
      } catch (error) {
        console.error("Erro ao recuperar termos do localStorage:", error);
        Funcoes.pessoa.termos = []; // Se o JSON não puder ser lido, usa um array vazio
      }
    } else {
      Funcoes.pessoa.termos = []; // Caso não tenha termos salvos, inicia como array vazio
    }
  };

  // Função para salvar termos no localStorage
  salvarTermos = () => {
    try {
      // Converte para string JSON antes de salvar
      localStorage.setItem("termos", JSON.stringify(Funcoes.pessoa.termos));
    } catch (error) {
      console.error("Erro ao salvar termos no localStorage:", error);
    }
  };

  // Função que é chamada para aceitar o termo
  aceiteTermo = () => {
    console.log(this.state.ipUser);
    console.log(this.state.tokenApp);
    console.log(this.state.termo);

    console.log(Formatar.formatarDateAnoHoraSegundo(new Date()));

    const data = {
      url: "aceite-termos/aceite",
      data: {
        usuario_id: this.state.pessoa.usuario_id,
        conta_id: this.state.pessoa.conta_id,
        ip: this.state.ipUser,
        data_hora: Formatar.formatarDateAnoHoraSegundo(new Date()),
        token: this.state.tokenApp,
        aparelho: "IB: " + browserName,
        termo_id: this.state.termo.id,
        chave_termo: this.state.termo.chave,
        versao: this.state.termo.versao,
      },
      method: "POST",
    };

    console.log(data);

    Funcoes.Geral_API(data, true)
      .then((res) => {
        console.log(res);

        if (res.success) {
          // Encontra o índice do termo com a chave correspondente
          const index = Funcoes.pessoa.termos.findIndex(
            (termo) => termo.chave === this.state.termo.chave
          );

          // Se o índice for válido (termo encontrado), remova-o
          if (index !== -1) {
            Funcoes.pessoa.termos.splice(index, 1); // Remove o termo do array
          }

          // Persistir os termos atualizados no localStorage
          this.salvarTermos();

          // Atualiza o estado
          this.setState({
            termoModal: false,
            termo: "",
            chaveTermo: {},
            btnTermo: true,
          });

          // Após atualizar, podemos recarregar a página
          this.novoTermo();
        } else {
          console.error("Erro: Não foi possível remover o termo.", res);
        }
      })
      .catch((error) => {
        console.error("Erro ao processar a API:", error);
      });
  };

  // Função chamada para carregar os termos atualizados
  novoTermo = () => {
    console.log(Funcoes.pessoa.termos);

    // Recupera os termos do localStorage (se existirem)
    this.recuperarTermos(); // Garante que Funcoes.pessoa.termos está atualizado

    if (
      Array.isArray(Funcoes.pessoa.termos) &&
      Funcoes.pessoa.termos.length > 0
    ) {
      // Constrói um objeto com as chaves do array de termos
      const chaveTermo = Funcoes.pessoa.termos.reduce((acc, termo) => {
        acc[termo.chave] = termo.chave; // Define a própria chave como valor
        return acc;
      }, {});

      // Atualiza o estado com o objeto criado
      this.setState({ chaveTermo, termoModal: true }, () => {
        console.log("Chave termo armazenado:", this.state.chaveTermo);

        // Chama a função termo
        if (this.state.chaveTermo) {
          // Verifica se existe a chave "termo_uso"
          if (this.state.chaveTermo["termo_uso"]) {
            this.termo({ termo_uso: this.state.chaveTermo["termo_uso"] });
          } else {
            // Pega a primeira chave do objeto caso "termo_uso" não exista
            const firstKey = Object.keys(this.state.chaveTermo)[0];
            this.termo({ [firstKey]: this.state.chaveTermo[firstKey] });
          }
        }
      });
    } else {
      console.error("Funcoes.pessoa.termos não é um array ou está vazio.");
    }
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
                                    ? i18n.t("home.saldoBloqueado")
                                    : "var_error"}
                                </p>
                              </Row>

                              <Row className="justify-content-center">
                                <span
                                  style={{ color: "red" }}
                                  className={
                                    "texto-saldos select-none saldoValor " +
                                    (this.state.saldos.digital.showBloqueado
                                      ? "deblurred"
                                      : null)
                                  }
                                >
                                  - {this.state.saldos.digital.saldoBloqueado}
                                </span>
                              </Row>
                            </Col>
                          </Row>
                          <span className="p-2 px-3 mt-8 position-absolute text-center textoHeader">
                            Saldo Bloqueado
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

          <Modal
            show={this.state.termoModal}
            centered
            size="xl"
            onHide={() => this.modalTermo()}
          >
            <Modal.Body>
              <Container
                ref={(el) => (this.scrollContainer = el)} // Ref para o Container
                onScroll={this.handleScroll}
                style={{
                  maxHeight: "800px", // Limita a altura do conteúdo para permitir o scroll
                  overflowY: "auto", // Adiciona barra de rolagem vertical
                }}
              >
                <div
                  style={{
                    color: "black",
                    WebkitTextFillColor: "black", // Para navegadores com preenchimento de texto
                    textAlign: "justify", // Alinha o texto de forma justificada (opcional)
                    fontSize: "16px", // Define o tamanho da fonte
                  }}
                  dangerouslySetInnerHTML={{ __html: this.state.termo.texto }}
                ></div>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{ width: "50%" }}
                disabled={this.state.btnTermo}
                onClick={() => this.aceiteTermo()}
              >
                Aceito o Termo
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
