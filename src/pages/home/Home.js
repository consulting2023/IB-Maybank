import React, { Component } from 'react';
import '../../templates/style_home.scss';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Icones from '../../constants/Icon';
import * as Icon from 'react-bootstrap-icons';
import Objetos from '../../constants/Objetos';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import * as Funcoes from '../../constants/Funcoes';
import * as Formatar from '../../constants/Formatar';
import Produtos from '../../constants/Produtos';
import { subDays } from 'date-fns';
import i18n from '../../tradutor/tradutor';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      saldo: 0,
      extrato: [],
      mostrarExtrato: false,
      graph: {}
    };
  }

  componentDidMount() {
    this.getSaldo();
    this.getExtrato();
  };

  getSaldo = () => {
    const data = {
      url: 'conta/saldo',
      data: { 'conta_id': Funcoes.pessoa.conta_id },
      method: 'POST',
    };

    Funcoes.Geral_API(data, true).then((res) => {
      this.setState({ saldo: res.digital });
    });
  }

  getExtrato = () => {
    const data = {
      url: 'conta/extrato',
      data: {
        "data_de": Formatar.formatarDateAno(subDays(new Date(), 10)),
        "data_ate": Formatar.formatarDateAno(Date()),
        'conta_id': Funcoes.pessoa.conta_id
      },
      method: 'POST',
    };

    Funcoes.Geral_API(data, true).then((res) => {
      let tempExtrato = [];
      for (let objIndex in res) {
        tempExtrato.push(res[objIndex][0]);
      }
      this.setState({ extrato: tempExtrato });
    });
  }

  setGraph = () => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
    );

    const step = Math.abs((this.state.extrato.reduce((prev, current) => (Math.abs(prev).valor > Math.abs(current).valor) ? prev : current, { valor: 5 })).valor);
    const roundStep = Math.ceil(step / 5) * 5;

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales:{
        y: {
          title: {
            display: true,
            text: 'Saldo'
          },
          ticks: {
            stepSize: roundStep,
            callback: (val) => {
              return "R$ " + val.toFixed(2).replace(".", ",");
            },
          }
        },
        x: {
          title: {
            display: true,
            text: 'Datas'
          }
        }
      },

      plugins: {
        // title: {
        //   display: true,
        //   text: 'Linha do Tempo dos lançamentos',
        // },
        tooltip: {
          callbacks: {
            label: (context) => {
              return "R$ " + context.parsed.y.toFixed(2).replace(".", ",");
            }
          }
        }
      },
    };

    let labels = Formatar.formatarDateMesInterpolacao(Formatar.formatarDateAno(subDays(new Date(), 10)), Formatar.formatarDateAno(Date()));
    let valores = [];
    let graphArr = [];
    let colorArr = [];

    if (this.state.saldo) {
      let tmpSaldo = this.state.saldo;
      const extrato = this.state.extrato;

      extrato.forEach(el => {
        valores.push({ num: tmpSaldo, month: Formatar.formatarDateDiaMes(el.dataHora) });
        tmpSaldo = tmpSaldo + (-el.valor);
      });
      valores.push({ num: tmpSaldo, month: labels[0] });

      valores.forEach(el => {
        const aa = valores.filter(obj => (obj.month == el.month) && (valores.indexOf(obj) > valores.indexOf(el)));

        if (aa.length > 0) {
          aa.forEach(obj => {
            const index = valores.indexOf(obj);
            valores.splice(index, 1)
          });
        }
      });

      let valor = null;
      labels.forEach((el, i) => {
        if (valores.some(e => e.month === el)) valor = valores.find(x => x.month === el).num;
        graphArr[i] = valor;
      });
    
      graphArr.forEach((el, i) => {
        if((el !== graphArr[i - 1]) || (el !== graphArr[i + 1])) colorArr[i] = 5;
        else colorArr[i] = 0;
      });
    }

    var data = {
      labels,
      datasets: [
        {
          data: graphArr,
          borderColor: 'rgb(58, 142, 50)',
          backgroundColor: 'rgb(58, 142, 50)',
          pointRadius: colorArr,
        },
      ],
    };

    const chart = { data: data, options: options };
    return chart;
  }

  colorStatus = (valor) => {
    if (valor > 0) {
      return 'green';
    }
    if (valor < 0) {
      return '#cc0000';
    }
  };

  SaldoConta = (contaId) => {
    const data = {
      url: "conta/saldo",
      data: { conta_id: contaId },
      method: "POST",
    };
  
    Funcoes.Geral_API(data, true).then((res) => {
      let tmpSaldos = this.state.saldos;
  
      if (Produtos.saldoDigital) {
        tmpSaldos[contaId] = {
          id: contaId,
          show: false,
          icone: Icones.saldo1,
          titulo: i18n.t("home.saldoDigital"),
          saldo: Formatar.formatarMoeda(res.digital),
          saldoBloqueado: Formatar.formatarMoeda(res.bloqueados),
          saldoTrue: res.digital,
        };
      }
  
      this.setState({ saldos: tmpSaldos });
    });
  };

  render() {
    const contaGrupos = JSON.parse(localStorage.getItem("conta_grupos")) || [];
    const saldos = this.state.saldos || {}; // Garantir que temos os saldos carregados
  
    if (contaGrupos.length > 1) {
      // Retornar os saldos das contas em um layout semelhante ao da imagem
      return (
        <div className="w-100">
          <Container className="p-3 d-flex justify-content-center">
            <Col md={12} className="baseWindow px-2 py-3">
              <h2 className="mb-4 text-center">Dashboard</h2>
              <p className="text-center">Hello! {this.state.username || "User"}</p>
  
              <Row>
                {contaGrupos.map((conta, index) => (
                  <Col xs={6} key={index} className="text-center">
                    <div className="saldo-card">
                      <h5>
                        {conta.tipo === "proprietary"
                          ? "Proprietary Account Balance"
                          : "Transactional Account Balance"}
                      </h5>
                      <p className="saldo-value">
                        {saldos[conta.id]
                          ? `${saldos[conta.id]} BRL`
                          : "Loading..."}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Container>
        </div>
      );
    } else {
      const graph = this.setGraph();
      return (
        <div className="w-100">
          <BannerTitle title="" img={Objetos.homeImg} />
  
          <Container className="p-3 d-flex justify-content-center">
            <Col md={12} className="baseWindow px-2 py-3">
              <Row>
                <p
                  className="mb-3 w-100 text-center"
                  style={{ fontSize: "1.30em" }}
                >
                  <strong>{i18n.t("home.ultiMov")}</strong>
                </p>
                <Col xs={8}>
                  {this.state.saldo && this.state.extrato.length > 0 ? (
                    <Line
                      options={graph.options}
                      data={graph.data}
                      style={{ height: "250px" }}
                    />
                  ) : null}
                </Col>
  
                <Col xs={4} className="text-center">
                  <Table size="sm" striped className="overflow-hidden">
                    <thead>
                      <tr>
                        <th scope="col">{i18n.t("home.descr")}</th>
                        <th className="text-right" scope="col">
                          {i18n.t("home.descrValor")}
                        </th>
                        <th className="text-right" scope="col">
                          {i18n.t("home.descrData")}
                        </th>
                      </tr>
                    </thead>
  
                    <tbody>
                      {this.state.extrato.map((dados) => (
                        <tr key={dados.id}>
                          <td>
                            {i18n.t("home.descrNome", {
                              descricao: dados.descricao,
                            })}
                          </td>
                          <td
                            style={{
                              color: this.colorStatus(dados.valor),
                              textAlign: "right",
                            }}
                          >
                            {Formatar.formatReal(dados.valor)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {Formatar.formatarDate(dados.dataHora)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Link to="/extrato">
                    <h1 className="link">{i18n.t("home.verMais")}</h1>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Container>
        </div>
      );
    }
  }  
}
