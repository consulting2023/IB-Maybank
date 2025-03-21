import React, { Component } from "react";
import * as Funcoes from "../../constants/Funcoes";
import "../../templates/style_extrato.scss";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Button,
  ButtonGroup,
  Table,
  FormGroup,
  FormControl,
  Modal
} from "react-bootstrap";
import * as Formatar from "../../constants/Formatar";
import { addDays } from "date-fns";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import DatePicker from "react-datepicker";
import Objetos from "../../constants/Objetos";
import ReactLoading from "react-loading";
import i18n from "../../tradutor/tradutor";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Produtos from "../../constants/Produtos";

export default class ExtratoConta extends Component {
  constructor() {
    super();
    this.state = {
      extrato: [],
      dataDe: new Date(),
      dataAte: new Date(),
      mostrarExtrato: false,
      ultimoId: null,
      loading: false,
      disabled: false,
      soma: 0,
      hasMore: true,
      custom_id: "",
      loadingCsv: false,
      disabledCsv: false,
      saldos: {},

      show: '0',
      // 0 = extrato
      // 1 = bloqueados

      bloqueados: [],
      mostrarBloqueados: false,
      respostaModal: false,
      bloqueadoSelect: {},
      respostaTxt: "",
      respostaImg: "",
      loadingResposta: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
    window.addEventListener("scroll", this.handleScroll);
    this.SaldoConta();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { loading, hasMore } = this.state;

    // Verifica se o scroll está próximo ao final da página
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;

    // Executa a função somente se não estiver carregando e houver mais dados
    if (!loading && hasMore && scrollTop + clientHeight >= scrollHeight - 50) {
      this.loadMoreExtrato();
    }
  };

  loadMoreExtrato = () => {
    const { pessoa, dataDe, dataAte, ultimoId, extrato } = this.state;

    this.setState({ loading: true });

    const data = {
      url: "conta/extrato",
      data: {
        conta_id: pessoa.conta_id,
        data_de: Formatar.formatarDateAno(dataDe),
        data_ate: Formatar.formatarDateAno(dataAte),
        ult_id: ultimoId,
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      const keys = Object.keys(res);
      if (keys.length === 0) {
        this.setState({ hasMore: false, loading: false });
        return;
      }

      const novosDados = keys.flatMap((key) => res[key]);
      const soma = novosDados.reduce(
        (acc, e) => acc + e.valor,
        this.state.soma
      );

      this.setState({
        extrato: [...extrato, ...novosDados],
        ultimoId: novosDados[novosDados.length - 1].id,
        soma,
        loading: false,
        hasMore: novosDados.length === 50, // Verifica se ainda há mais resultados
      });
    });
  };

  verExtrato = () => {
    const { dataDe, dataAte, pessoa } = this.state;

    const hoje = new Date() + 1;

    const dataInicio = new Date(dataDe);
    const dataFim = new Date(dataAte);

    // Verificar se as datas são válidas
    if (dataInicio > hoje || dataFim > hoje) {
      this.props.alerts(
        "Data inválida",
        "Informe no máximo a data do dia atual.",
        "warning"
      );
      return;
    }

    // Verificar diferença de dois dias entre as datas
    // const diffInMilliseconds = Math.abs(dataFim - dataInicio);
    // const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    // if (diffInDays > 2) {
    //   this.props.alerts(
    //     "Intervalo inválido",
    //     "Selecione no máximo um intervalo de dois dias.",
    //     "warning"
    //   );
    //   return;
    // }

    this.setState({
      loading: true,
      disabled: true,
      extrato: [],
      ultimoId: null,
      hasMore: true,
    });

    const data = {
      url: "conta/extrato",
      data: {
        conta_id: pessoa.conta_id,
        data_de: Formatar.formatarDateAno(dataDe),
        data_ate: Formatar.formatarDateAno(dataAte),
        custom_id: this.state.custom_id || "",
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      const keys = Object.keys(res);
      if (keys.length === 0) {
        this.props.alerts(
          i18n.t("extrato.nenhumaMovimentacao"),
          i18n.t("extrato.selecioneOutroPeriodo"),
          "warning"
        );
        this.setState({
          loading: false,
          disabled: false,
          mostrarExtrato: false,
        });
        return;
      }

      const arr = keys.flatMap((key) => res[key]);
      const soma = arr.reduce((acc, e) => acc + e.valor, 0);

      this.setState({
        extrato: arr,
        ultimoId: arr[arr.length - 1].id,
        soma,
        mostrarExtrato: true,
        loading: false,
        disabled: false,
        hasMore: arr.length === 50, // Verifica se ainda há mais resultados
      });
    });
  };

  carregarExtratoCsv = async () => {
    const { dataDe, dataAte, pessoa } = this.state;

    // console.log("Data de início:", dataDe);
    // console.log("Data de término:", dataAte);

    const hoje = new Date();
    const dataInicio = new Date(dataDe);
    const dataFim = new Date(dataAte);

    // console.log("Data atual:", hoje);
    // console.log("Data de início convertida:", dataInicio);
    // console.log("Data de término convertida:", dataFim);

    const data = {
      url: "conta/extrato",
      data: {
        conta_id: pessoa.conta_id,
        data_de: Formatar.formatarDateAno(dataDe), // Certifique-se de que o formato de data está correto
        data_ate: Formatar.formatarDateAno(dataAte), // Certifique-se de que o formato de data está correto
        isfile: true,
      },
      method: "POST",
    };

    try {
      const res = await Funcoes.Geral_API(data, true);
      // console.log("Resposta da API:", res); // Verifique se a resposta está correta
      if (res && Object.keys(res).length > 0) {
        return res;
      }
      // console.log("Nenhum dado retornado pela API");
      return []; // Caso contrário, retorna um array vazio
    } catch (error) {
      console.error("Erro ao carregar extrato:", error);
      this.props.alerts(
        "Erro ao carregar extrato",
        "Ocorreu um problema ao carregar os dados.",
        "error"
      );
      return [];
    }
  };

  extrato_csv = async () => {
    const { dataDe, dataAte, pessoa, soma } = this.state;

    // Inicia o loading
    this.setState({ loadingCsv: true, disabledCsv: true });

    try {
      // Chama o endpoint uma única vez
      const dadosExtrato = await this.carregarExtratoCsv();
      // console.log("Dados do extrato:", dadosExtrato); // Verifique se os dados foram carregados corretamente

      if (!dadosExtrato || Object.keys(dadosExtrato).length === 0) {
        this.props.alerts(
          "Sem dados",
          "Nenhum dado encontrado para o período selecionado.",
          "info"
        );
        return;
      }

      // Define valores padrão caso estejam indefinidos
      const saldoTotal = soma ? soma.toFixed(2).replace(".", ",") : "0,00";
      const saldoDisponivel = saldoTotal;

      // Cabeçalho das colunas
      const columns = [
        "Data",
        "Custom ID",
        "Id",
        "Data/Hora",
        "Descrição",
        "Valor",
        "Conta",
        "Status",
      ];

      // Processar o objeto de retorno
      const rows = [];

      for (const [data, transacoes] of Object.entries(dadosExtrato)) {
        transacoes.forEach((item) => {
          rows.push([
            data, // Adiciona a data como uma nova coluna
            item.custom_id || "N/A",
            item.id || "",
            new Date(item.dataHora).toLocaleString(),
            item.descricao || "",
            item.valor || 0, // Retorna o valor como float diretamente
            item.conta_id || "",
            item.bloqueado ? "Bloqueado" : "Desbloqueado",
          ]);
        });
      }

      // Conteúdo CSV
      const csvContent = [
        columns.join(","), // Cabeçalho
        ...rows.map((row) => row.join(",")), // Dados
      ].join("\n");

      // Criando o arquivo para download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Garantindo que a URL seja criada corretamente
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "extrato_movimentacao.csv");

      // Usar appendChild para garantir que o link esteja no DOM
      document.body.appendChild(link);

      // Acionar o clique para download
      link.click();

      // Remover o link após o download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.props.alerts(
        "CSV Gerado",
        "O arquivo CSV foi gerado com sucesso.",
        "success"
      );
    } catch (error) {
      console.error("Erro ao gerar o CSV:", error);
      this.props.alerts(
        "Erro ao gerar CSV",
        "Ocorreu um problema ao carregar os dados.",
        "error"
      );
    } finally {
      // Finaliza o loading
      this.setState({ loadingCsv: false, disabledCsv: false });
    }
  };

  extrato_pdf = async () => {
    // console.log(this.state.saldos);
    const { extrato, dataDe, dataAte, pessoa, soma } = this.state;

    // Verificação de dados antes de gerar o PDF
    if (!extrato || extrato.length === 0) {
      this.props.alerts(
        "Sem dados",
        "Nenhum dado encontrado para o período selecionado.",
        "info"
      );
      return;
    }

    // Configurações do PDF
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Definindo o saldo total e disponível
    const saldoTotal = soma ? soma.toFixed(2).replace(".", ",") : "0,00";
    const saldoDisponivel = saldoTotal;

    // Cabeçalho do PDF
    doc.text("Extrato de Movimentação da Conta:", 10, 10);
    doc.text(
      `Período: ${new Date(dataDe).toLocaleDateString()} até ${new Date(
        dataAte
      ).toLocaleDateString()}`,
      10,
      20
    );
    doc.text(`Cliente: ${pessoa?.nome || "N/A"}`, 10, 30);
    doc.text(`Agência/Conta: 0001 / ${pessoa?.conta_id || "N/A"}`, 10, 40);
    doc.text(`Saldo Total: R$ ${this.state.saldos.digital.saldo}`, 10, 50);
    doc.text(`Saldo Do Dia: R$ ${saldoDisponivel}`, 10, 60);
    doc.text("Saldo Bloqueado: R$ 0,00", 10, 70);

    // Cabeçalho da tabela
    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Data/Hora", dataKey: "dataHora" },
      { header: "Descrição", dataKey: "descricao" },
      { header: "Valor", dataKey: "valor" },
      { header: "Conta", dataKey: "conta" },
      { header: "Custom Id", dataKey: "custom_id" },
    ];

    // Dados da tabela
    const rows = extrato.map((item) => ({
      id: item.id || "",
      dataHora: new Date(item.dataHora).toLocaleString(), // Formata a data para incluir hora também
      descricao: item.descricao || "",
      valor: item.valor ? item.valor.toFixed(2).replace(".", ",") : "0,00",
      conta: item.conta_id || "",
      custom_id: item.custom_id || "N/A",
    }));

    // Adicionando a tabela ao PDF
    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => Object.values(row)),
      startY: 80,
      theme: "striped",
      styles: { fontSize: 10 },
    });

    // Gerar e fazer download do PDF
    doc.save("extrato_movimentacao.pdf");
  };

  SaldoConta = () => {
    const data = {
      url: "conta/saldo",
      data: { conta_id: Funcoes.pessoa.conta_id },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      // console.log(res);
      let tmpSaldos = this.state.saldos;

      if (Produtos.saldoDigital)
        tmpSaldos.digital = {
          saldo: Formatar.formatarMoeda(res.digital),
        };

      // if (Produtos.saldoCartao) tmpSaldos.push({ show: false, icone: Icones.saldo2, titulo: i18n.t('home.saldoCartao'), saldo: Formatar.formatarMoeda(res.cartao), saldoTrue: res.cartao });

      // if (Produtos.saldoCredito) tmpSaldos.push({ show: false, icone: Icones.saldo3, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.credito), saldoTrue: res.credito });

      // if (Produtos.saldoInvestimento) tmpSaldos.push({ show: false, icone: Icones.saldo4, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.investimento), saldoTrue: res.investimento });

      this.setState({ saldos: tmpSaldos });
    });
  };

  getBloqueados = () => {
    this.setState({ loading: true });

    const data = {
      url: 'pix-bloqueados/extrato-pix-bloqueados',
      data: {
        conta_id: this.state.pessoa.conta_id,
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      if (res.length > 0) {
        this.setState({ bloqueados: res, mostrarBloqueados: true });
      } else {
        this.props.alerts("Sem PIX bloqueados", "", "warning");
      }
      this.setState({ loading: false });
    });
  };

  getStatus = (num) => {
    if (num == 0) {
      return "Desbloqueado";
    } else if (num == 1) {
      return "Bloqueado";
    } else if (num == 2) {
      return "Em análise"
    }
  }

  uploadRespostaImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
          );
          this.setState({ respostaImg: base64String });
        };

        reader.readAsDataURL(file);
      } else {
        alert("Arquivo inválido");
        this.setState({ respostaImg: "" });
      }
    } else {
      this.setState({ respostaImg: "" });
    }
  };

  enviarResposta = () => {
    this.setState({ loadingResposta: true });
    const timestamp = Date.now();
    const nomeArquivo = `respostapix_${timestamp}_${this.state.pessoa.conta_id}.png`;

    const data = {
      url: 'pix-bloqueados/respostas',
      data: {
          "conta_id": this.state.pessoa.conta_id,
          "id": this.state.bloqueadoSelect.id,
          "resposta": this.state.respostaTxt,
          "arquivoResposta1": this.state.respostaImg,
          "nomeDoArquivo": nomeArquivo
      },
      method: 'POST',
    };

    Funcoes.Geral_API(data, true).then((res) => {
      this.getBloqueados();

      if (res.status == 2) {
        this.props.alerts("Resposta enviada", "O pix bloqueado entrou em análise", "success");
        this.setState({ respostaModal: false });
        this.getBloqueados();
      } else {
        this.props.alerts("Erro ao enviar resposta", "Tente novamente mais tarde", "warning");
      }
      this.setState({ loadingResposta: false });
    });
  }

  render() {
    const {
      extrato,
      dataDe,
      dataAte,
      loading,
      mostrarExtrato,
      soma,
      disabled,
      show,
      bloqueados,
      mostrarBloqueados,
      respostaModal,
      bloqueadoSelect,
      respostaTxt,
      respostaImg,
      loadingResposta
    } = this.state;

    return (
      <div className="extrato">
        <BannerTitle
          title={i18n.t("extrato.extrato")}
          img={Objetos.extratoImg}
        />

        <Container className="p-3 col-md-10 d-flex justify-content-center">
          <Row className="baseWindow px-5 py-4">
            <Col>
              <Row style={{ width: 600 }} className="mx-2 mb-5">
                <Button 
                  className="m-auto" 
                  style={{ width: 150 }}
                  onClick={ () => {
                    this.setState({ show: '0' });
                  }}
                  active={show == '0'}
                >
                  Extrato
                </Button>

                <Button
                  className="m-auto" 
                  style={{ width: 150 }}
                  onClick={ () => {
                    if (show != '1') {
                      this.setState({ show: '1' });
                      this.getBloqueados();
                    }
                  }}
                  active={show == '1'}
                >
                  Bloqueado
                </Button>
              </Row>

              {
                (show == '0') ? ( <>

                  <Row>
                    <p className="mb-4 mx-auto" style={{ fontSize: "1.30em" }}>
                      <strong>{i18n.t("extrato.textoEscolhaExtrato")}</strong>
                    </p>
                  </Row>
                  <Row>
                    <Col className="form-group d-flex">
                      <FormGroup className="m-auto">
                        <label>{i18n.t("extrato.dataInicio")}</label>
                        <br />
                        <DatePicker
                          className="form-control text-center"
                          locale="pt-BR"
                          selected={dataDe}
                          required
                          dateFormat="dd/MM/yyyy"
                          popperPlacement="bottom"
                          maxDate={addDays(new Date(), 0)}
                          onChange={(data) => this.setState({ dataDe: data })}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="form-group d-flex">
                      <FormGroup className="m-auto">
                        <label>{i18n.t("extrato.dataFinal")}</label>
                        <br />
                        <DatePicker
                          className="form-control text-center"
                          locale="pt-BR"
                          selected={dataAte}
                          required
                          dateFormat="dd/MM/yyyy"
                          popperPlacement="bottom"
                          maxDate={addDays(new Date(), 0)}
                          onChange={(data) => this.setState({ dataAte: data })}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="form-group">
                      <label>Custom ID</label>
                      <br />
                      <input
                        type="text"
                        className="form-control text-center"
                        value={this.state.custom_id || ""}
                        required
                        onChange={(e) =>
                          this.setState({ custom_id: e.target.value })
                        }
                        placeholder="Digite o custom_id"
                      />
                    </Col>
                  </Row>
                  <Row className="form-group m-0">
                    <Button
                      onClick={this.verExtrato}
                      disabled={disabled}
                      className="m-auto px-5 py-2 btnProcurarExtrato"
                    >
                      {i18n.t("extrato.btnPesquisar")}
                    </Button>
                  </Row>

                </> )

                : (show == '1') && ( <>

                  <p className="mb-4 mx-auto text-center" style={{ fontSize: "1.30em" }}>
                    <strong>Movimentações bloqueadas</strong>
                  </p>
                  
                </> )
              }

            </Col>
          </Row>
        </Container>

        <Container className="p-3 col-md-10">
          
          {
            loading && ( <>
              <ReactLoading
                className="d-block m-auto"
                type={"spin"}
                color={"#000"}
                height={"5%"}
              />
            </> )
          }

          { 
            (show == '0' && mostrarExtrato) ? ( <>

              <Col className="baseWindow px-5 py-4">
                <Row>
                  <ButtonGroup className="buttonGroup flex-row justify-content-between">
                    <Button className="mr-1" onClick={this.extrato_pdf}>
                      {i18n.t("extrato.downloadPdf")}
                    </Button>

                    <div>
                      {/* Indicador de loading */}
                      {this.state.loadingCsv && (
                        <div className="loading-overlay">
                          <div className="spinner"></div>
                          <p>Gerando arquivo CSV, por favor, aguarde...</p>
                        </div>
                      )}

                      {/* Botão para gerar o CSV */}

                      <Button
                        className="mr-1"
                        onClick={this.extrato_csv}
                        disabled={this.state.loadingCsv || this.state.disabledCsv}
                      >
                        {this.state.loading
                          ? "Gerando..."
                          : "Download Extrato CSV"}
                      </Button>
                    </div>
                  </ButtonGroup>
                  {soma !== 0 && (
                    <div className="d-flex flex-grow-1">
                      <p className="my-auto ml-auto texto-saldos-Extrato">
                        Total no período:
                        <span className={soma < 0 ? "redText" : "greenText"}>
                          {" "}
                          R$ {Formatar.formatReal(soma)}
                        </span>
                      </p>
                    </div>
                  )}
                </Row>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Conta</th>

                      <th>Custom ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {extrato.map((row, index) => (
                      <tr key={`${row.id}-${index}`}>
                        <td>{row.id}</td>
                        <td>{Formatar.formatarDate(row.dataHora)}</td>
                        <td>{row.descricao}</td>
                        <td>{Formatar.formatReal(row.valor)}</td>
                        <td>{row.conta_id}</td>

                        <td>{row.custom_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {loading && (
                  <div className="text-center mt-3">
                    <ReactLoading type={"spin"} color={"#000"} height={50} />
                  </div>
                )}
              </Col>

            </> )

            : (show == '1' && mostrarBloqueados) && ( <>

              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Motivo</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    bloqueados.map((row, index) => (
                      <tr key={`${row.id}-${index}`}>
                        <td>{this.getStatus(row.status)}</td>
                        <td>{(row.nome && row.nome != '') ?  row.nome : "Nome não informado"}</td>
                        <td>R$ {Formatar.formatReal(row.valor)}</td>
                        <td>{Formatar.formatarDate(row.data_criacao)}</td>
                        <td>{(row.motivo && row.motivo != '') ?  row.motivo : "Motivo não informado"}</td>
                        <td>
                          <Button
                            onClick={ () => {
                              this.setState({ 
                                bloqueadoSelect: row,
                                respostaModal: true 
                              });
                            }}
                            disabled={ row.status != 1 }
                          >
                            Responder
                          </Button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>             

            </> )
          }
        </Container>

        <Modal
          centered
          size="xl"
          show={respostaModal}
          onHide={() => {
            if (!loadingResposta) {
              this.setState({ respostaModal: false, respostaTxt: "", respostaImg: "" });
            }
          }}
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <Container>
              {
                (Object.keys(bloqueadoSelect).length == 0 || loadingResposta) ? ( <>

                  <ReactLoading
                    className="d-block m-auto"
                    type={"spin"}
                    color={"#000"}
                    height={"5%"}
                  />

                </> ) : ( <>

                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Motivo</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>{this.getStatus(bloqueadoSelect.status)}</td>
                        <td>{(bloqueadoSelect.nome && bloqueadoSelect.nome != '') ?  bloqueadoSelect.nome : "Nome não informado"}</td>
                        <td>R$ {Formatar.formatReal(bloqueadoSelect.valor)}</td>
                        <td>{Formatar.formatarDate(bloqueadoSelect.data_criacao)}</td>
                        <td>{(bloqueadoSelect.motivo && bloqueadoSelect.motivo != '') ?  bloqueadoSelect.motivo : "Motivo não informado"}</td>
                      </tr>                     
                    </tbody>
                  </Table>

                  <div className="m-5">
                    <FormGroup className="mx-2">
                      <label>Responder:</label>

                      <FormControl
                        onChange={ (e) => this.setState({ respostaTxt: e.target.value }) }
                        value={respostaTxt}
                        id="resposta"
                        as="textarea"
                        placeholder="Resposta"
                      />
                    </FormGroup>

                    <FormGroup className="mx-2">
                      <label>Anexar uma imagem:</label>
                      <FormControl
                        onChange={ (event) => this.uploadRespostaImg(event) } 
                        accept="image/png, image/jpeg" 
                        className="d-block"
                        id="file"
                        type="file"
                      />
                    </FormGroup>
                  </div>

                </> )
              }
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={ respostaTxt == '' || respostaImg == '' }
              className="float-right"
              variant="primary"
              onClick={() => {
                this.enviarResposta()
              }}
            >
              Enviar resposta
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
