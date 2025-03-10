import React, { Component } from "react";
import "../../templates/style_cobrar.scss";
import { Container, Col, Row, Modal, Table } from "react-bootstrap";
import { registerLocale } from "react-datepicker";
import br from "date-fns/locale/pt-BR";
import Icones from "../../constants/Icon";
import Objetos from "../../constants/Objetos";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import * as Funcoes from "../../constants/Funcoes";
import ReactLoading from "react-loading";
import OtpInput from "react-otp-input";
import i18n from "../../tradutor/tradutor";
import Password from "../../components/password/Password";
import Papa from "papaparse";
// registerLocale('pt-BR', br)

export default class Transferencia_Lote extends Component {
  constructor() {
    super();
    this.state = {
      pessoa: [],
      mostrar_instrucoes: false,
      loading: false,
      csv: null,
      nome_do_arquivo: "",
      loading: false,
      token_app: false,
      inputToken: true,
      valida_senha_ok: false,
      valida_token_ok: false,
      dadosCsv: [], // Armazena os dados processados do CSV
      password: ["", "", "", "", "", ""],
      mensagemErro: "",
    };
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
  }

  combinacoes = async () => {
    this.setState({ loading: true });
    let { password } = this.state;

    if (password.some((e) => e == "")) {
      this.props.alerts("Erro", "erro de login", "warning");
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

      let chave = "";

      chave = texto;
      i = Object.keys(output);

      this.setState({ password: chave });
      if (chave == "") {
        this.setState({ loading: false });
        this.props.alerts("Erro", "Senha Incorreta", "warning");
      } else {
        if (this.state.OTP.length == 6) {
          this.Valida_token(this.state.OTP);
        } else {
          this.setState({ loading: false });
          this.props.alerts("Erro", "Preencha o token", "warning");
        }
      }
    }
  };

  receberCsv = (event) => {
    let i = 0;
    let slice_name = event.target.files[0]["name"].split(".");
    if (slice_name[1] === "csv") {
      this.verRetorno(event);

      this.setState({
        csv: event.target.files[0],
        nome_do_arquivo: event.target.files[0]["name"],
      });
    } else {
      // alert("Formato de arquivo inválido")
      alert(i18n.t("transferencia.formatoInvalido"));
    }
  };

  validarArq = () => {
    if (this.state.csv != null) {
      this.enviarToken();
      this.setState({ token_app: true });
    } else {
      // alert("Escolha um arquivo CSV")
      alert(i18n.t("transferencia.escolhaCSV"));
    }
  };

  uploadCsv = () => {
    this.setState({ loading: true });
    const filenameConta = this.state.pessoa.conta_id;

    var date = new Date();
    let fileNameData = date.toJSON();
    fileNameData = fileNameData.replace(":", "-");
    fileNameData = fileNameData.replace(":", "-");
    fileNameData = fileNameData.replace(":", "-");

    let filenameComprovanteAtv = this.state.csv.nome;
    let formDataAtv = new FormData();

    formDataAtv.append("arquivo", this.state.csv, filenameComprovanteAtv);
    formDataAtv.append("json", JSON.stringify({ conta_id: filenameConta }));

    const dados = {
      url: "transferencia/transferencia-lote",
      data: formDataAtv,
      method: "POST",
    };

    Funcoes.Geral_API(dados, true).then((res) => {
      console.log("res", res);
      if (res.status == 0) {
        this.setState({ loading: false });
        var msg = res.msg.replace(/;/g, "\n");
        // alert("CSV com erro verifique:" + msg);
        alert(i18n.t("transferencia.erroCSV", { erroMsg: msg }));
      } else {
        // alert("Transferência Efetuada com Sucesso! Verifique o Extrato.");
        alert(i18n.t("transferencia.sucessoVerifique"));
        window.location.href = "/extrato";
      }
    });
  };

  convertArrayOfObjectsToCSV = (args) => {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }
    columnDelimiter = args.columnDelimiter || ";";
    lineDelimiter = args.lineDelimiter || "\n";

    keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });
    return result;
  };

  download_file = () => {
    var data, filename, link;

    filename = "Exemplo_Transferencia.csv";

    data = process.env.BASE + "modelos/modelo_transferencia_lote.csv";

    link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", filename);
    link.click();
  };

  input_Token = (id) => {
    if (id == 1) {
      this.setState({ inputToken: true, inputTokenQrcode: false });
    } else if (id == 2) {
      this.setState({ inputToken: false, inputTokenQrcode: true });
      this.gerar_qrcode();
    } else {
      <></>;
    }
  };

  Valida_token = async (id) => {
    const data = {
      url: "utilitarios/validacao-email-confere",
      data: {
        email: Funcoes.pessoa.email,
        token: id,
      },
      method: "POST",
    };

    setTimeout(() => {
      Funcoes.Geral_API(data, true).then((res) => {
        console.log(res);
        if (res == true) {
          this.uploadCsv();
        } else {
          this.props.alerts("Erro", "Token inválido", "warning");
        }
      });
    }, 300);
  };

  getPass = async (data) => {
    this.setState({ password: data });
  };

  enviarToken = () => {
    this.setState({ token_app: true });

    const data = {
      url: "utilitarios/validacao-email-envio",
      data: {
        email: Funcoes.pessoa.email,
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

  verRetorno = (event) => {
    const arquivo = event.target.files[0];

    if (arquivo && arquivo.type === "text/csv") {
      const reader = new FileReader();

      reader.onload = (e) => {
        const conteudo = e.target.result;

        Papa.parse(conteudo, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            console.log("Dados processados do CSV:", result.data);

            const formData = new FormData();
            formData.append("arquivo", arquivo);

            const data = {
              url: "transferencia/ver-transferencia-lote",
              data: formData,
              method: "POST",
            };

            Funcoes.Geral_API(data, true)
              .then((res) => {
                console.log("Resposta do backend:", res);

                if (res.error === 0 && res.code === 1) {
                  alert("CSV validado com sucesso! Nenhum erro encontrado.");

                  this.setState({
                    dadosCsv: result.data,
                    nome_do_arquivo: arquivo.name,
                  });
                } else if (!res || res.length === 0) {
                  alert(
                    "Não foi possível validar o CSV. Tente novamente mais tarde."
                  );
                } else {
                  const dadosComErros = result.data.map((item, index) => {
                    const errosNaLinha = res.filter(
                      (erro) => erro.line - 1 === index + 1
                    );
                    return {
                      ...item,
                      error: errosNaLinha.length
                        ? errosNaLinha.map((err) => err.code) // Mantém os códigos como números
                        : null,
                    };
                  });

                  this.setState({
                    dadosCsv: dadosComErros,
                    nome_do_arquivo: arquivo.name,
                  });
                }
              })
              .catch((err) => {
                console.error("Erro ao validar o arquivo no backend:", err);
                this.setState({
                  mensagemErro: "Erro ao validar o arquivo. Tente novamente.",
                });
              });
          },
          error: (err) => {
            console.error("Erro ao processar o CSV:", err);
          },
        });
      };

      reader.onerror = (err) => {
        console.error("Erro ao ler o arquivo:", err);
      };

      reader.readAsText(arquivo);
    } else {
      this.setState({
        dadosCsv: [],
        mensagemErro: "Por favor, selecione um arquivo CSV válido.",
      });
    }
  };

  renderTabelaComErros = () => {
    const { dadosCsv } = this.state;

    if (dadosCsv.length === 0) {
      return null;
    }

    return (
      <div>
        <h4>Dados Processados:</h4>
        <Table striped bordered id="tabela-extrato">
          <thead>
            <tr>
              {Object.keys(dadosCsv[0])
                .filter((key) => key !== "error")
                .map((key) => (
                  <th key={key}>{key}</th>
                ))}
              <th>Erro</th>
            </tr>
          </thead>
          <tbody>
            {dadosCsv.map((linha, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: linha.error
                    ? "rgba(255, 0, 0, 0.2)"
                    : "inherit",
                }}
              >
                {Object.entries(linha)
                  .filter(([key]) => key !== "error")
                  .map(([_, valor], i) => (
                    <td key={i}>{valor}</td>
                  ))}
                <td style={{ color: linha.error ? "red" : "inherit" }}>
                  {linha.error
                    ? Array.isArray(linha.error)
                      ? linha.error
                          .map((err) => {
                            switch (err) {
                              case 304:
                                return i18n.t("transferencia.loteCod304");
                              case 301:
                                return i18n.t("transferencia.loteCod301");
                              case 302:
                                return i18n.t("transferencia.loteCod302");
                              case 303:
                                return i18n.t("transferencia.loteCod303");
                              case 305:
                                return i18n.t("transferencia.loteCod305");
                              case 306:
                                return i18n.t("transferencia.loteCod306");
                              case 307:
                                return i18n.t("transferencia.loteCod307");
                              default:
                                return i18n.t("transferencia.erroDesconhecido");
                            }
                          })
                          .join(", ")
                      : i18n.t("transferencia.erroDesconhecido")
                    : i18n.t("transferencia.semErro")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  render() {
    return (
      <>
        <BannerTitle
          title={i18n.t("transferencia.transferencia")}
          img={Objetos.transferenciaImg}
        />

        <Container className="mt-1 col-md-10 text-center">
          <p className="text-center" style={{ fontSize: "1.65em" }}>
            {i18n.t("transferencia.titleLote")}
          </p>
        </Container>

        <Container className="blocoPesquisaExt mt-4 col-md-10 d-flex justify-content-center">
          <Col>
            <Row>
              <div className="form-group col-12">
                <label>{i18n.t("transferencia.textLote")}</label>
                <br />
                <br />
                <Row className="custom-file-caixa">
                  <label
                    className="custom-file-upload"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <input
                      type="file"
                      onChange={(event) => {
                        this.receberCsv(event);
                      }}
                    />
                    {i18n.t("transferencia.textEscolhaLote")}
                  </label>
                  <label>{this.state.nome_do_arquivo}</label>
                </Row>
              </div>
            </Row>
            {this.state.loading ? (
              <ReactLoading
                className="float-right"
                type={"bubbles"}
                color={"#000"}
                height={"5%"}
                width={"5%"}
              />
            ) : (
              <button
                disabled={this.state.loading}
                onClick={() => {
                  this.validarArq();
                }}
                className="btn verMultiBoletos btn-sm btn-success"
              >
                {i18n.t("transferencia.btnVerificarLote")}
              </button>
            )}

            <button
              type="button"
              className="btn download_csv btn-sm btn-success  float-left"
              onClick={() => this.download_file()}
            >
              {i18n.t("transferencia.btnDownLote")}
            </button>
          </Col>
        </Container>

        <br />

        <Container>
          {" "}
          {this.state.mensagemErro && (
            <p style={{ color: "red" }}>{this.state.mensagemErro}</p>
          )}
          {this.renderTabelaComErros()}
        </Container>

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.token_app}
          onHide={() => this.setState({ token_app: false })}
        >
          <Modal.Body className="modalValidacao">
            <h2>{i18n.t("transferencia.titleModalValidacao")}</h2>
            <hr />
            <h5>
              {i18n.t("transferencia.textModalValidacao", {
                nome_banco: process.env.NOME_BANCO,
              })}
            </h5>
            <br />
            <Container>
              <Row className="justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary col-12 mt-12 text-center tokenButton"
                  style={{ height: 70, justifyContent: "center" }}
                  onClick={() => this.input_Token(1)}
                >
                  <span>
                    {Icones.token}
                    <h5>{i18n.t("transferencia.tokenValidacao")}</h5>
                  </span>
                </button>
              </Row>
              <Container style={{ marginTop: "10px", padding: 0 }}>
                <hr />
                <h4>{i18n.t("transferencia.titleSenha")}</h4>
                <h6>{i18n.t("transferencia.textSenha")}</h6>
                <Row style={{ height: 70 }} className="token">
                  <Col className="col-md-10">
                    <Password passProp={this.getPass} />
                  </Col>
                </Row>
              </Container>

              {this.state.inputToken ? (
                <Container style={{ marginTop: "10px", padding: 0 }}>
                  <hr />
                  <h4>{i18n.t("transferencia.titleToken")}</h4>
                  <h6>{i18n.t("transferencia.textTokenDescr")}</h6>
                  <Row style={{ height: 70 }} className="token">
                    <Col className="col-md-10">
                      <OtpInput
                        focusInput={1}
                        isInputNum={true}
                        value={this.state.OTP}
                        onChange={(value) => {
                          this.setState({ OTP: value });
                        }}
                        numInputs={6}
                        className="tokenValidacao"
                      />
                    </Col>
                  </Row>
                </Container>
              ) : (
                <></>
              )}

              <br />
              <Row className="justify-content-center">
                {this.state.loading ? (
                  <ReactLoading
                    className="float-right"
                    type={"bubbles"}
                    color={"#000"}
                    height={"25%"}
                    width={"25%"}
                  />
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary col-5 mt-12 text-center tokenButton"
                    style={{ height: 70, justifyContent: "center" }}
                    onClick={() => this.combinacoes()}
                  >
                    <span>
                      {Icones.pagarConta}
                      <h5>{i18n.t("transferencia.btnTransferir")}</h5>
                    </span>
                  </button>
                )}
              </Row>
            </Container>

            <br />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
