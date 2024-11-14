import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-pro-sidebar/dist/css/styles.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./routers/router";
import Header from "./components/header/Header";
import Sidebar from "./components/sidemenu/Sidebar";
import AlertOverlay from "./components/alertOverlay/AlertOverlay";
import "./templates/App.scss";

import { Col, Row } from "react-bootstrap";

function App() {
  document.title = process.env.NOME_BANCO;

  var privatePaths = [
    "/home",
    "/pix",
    "/extrato",
    "/extrato_conta",
    "/extrato_cartao",
    "/extrato_convenio",
    "/extrato_investimento",
    "/extrato_parcelado",
    "/extrato_financeira",
    "/transferencia",
    "/transferencia_interna",
    "/transferencia_outros",
    "/transferencia_lote",
    "/cobrancas",
    "/cobrancas_boleto",
    "/multiplos_boletos",
    "/GerenciarLotesBoletos",
    "/Gerenciar_Boletos",
    "/Cadastro_Sacado",
    "/Editar_Sacado",
    "/Pagar",
    "/deposito",
    "/gerenciar_deposito",
    "/comprovantes",
    "/comprovantes_conta",
    "/cartoes",
    "/servicos",
    "/recarga",
    "/entretenimento",
    "/games",
    "/aplicativos",
    "/comprovantes_cartao",
    "/comprovantes_investimento",
    "/comprovantes_convenio",
    "/comprovantes_limite",
    "/comprovantes_parcelado",
    "/comprovantes_servico",
    "/qr_code",
    "/perfil",
    "/senha",
    "/cambio",
    "/relatorio",
    "/relatorio_saida",
    "/relatorio_entrada",
    "/relatorio_crypo",
  ];

  var isPrivate = privatePaths.includes(document.location.pathname)
    ? true
    : false;

  const [lang, setLang] = React.useState(null);
  const traduzir = async (data) => {
    setLang(data);
  };

  const [alerts, setAlerts] = React.useState([]);
  const [count, setCount] = React.useState(0);

  const createAlert = async (alertTitle, alertText, alertType) => {
    if (alerts.length >= 30) setAlerts(alerts.shift());
    const newKey = alerts.length;
    const newAlert = {
      key: newKey,
      show: true,
      title: alertTitle,
      text: alertText,
      type: alertType,
    };
    setAlerts([...alerts, newAlert]);
    setTimeout(() => {
      setCount([newKey]);
    }, 30000);
    //30 segundos
  };

  React.useEffect(() => {
    closeAlert(count);
  }, [count]);

  const closeAlert = async (index) => {
    let alertList = [...alerts];
    if (alertList[index]) {
      alertList[index].show = false;
      setAlerts(alertList);
    }
  };

  return (
    <BrowserRouter>
      {/* <div className="site-content container-fluid m-0 p-0 min-vh-100 h-100 position-relative"> */}
      <div className="site-content container-fluid m-0 p-0 min-vh-100 min-w-100 position-relative">
        <AlertOverlay alerts={alerts} closeProp={closeAlert} />
        {isPrivate && <Header />}
        <Row className="m-0 p-0 min-vh-100">
          {isPrivate && <Sidebar langProp={traduzir} />}
          <Col className={"m-0 px-0 " + (isPrivate && "pb-5")}>
            <Router className="" langProp={traduzir} alerts={createAlert} />
          </Col>
        </Row>
      </div>
    </BrowserRouter>
  );
}

export default App;
