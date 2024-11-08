// import React from 'react';
import React, { Component } from "react";
// import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import PrivateRoute from './privateRoute';
import Produtos from '../constants/Produtos';

import Login from '../pages/login/Login';
import Ajustes from '../pages/ajustes/Ajustes';
import Home from '../pages/home/Home';
import Extrato from '../pages/extrato/Extrato';
import ExtratoConta from '../pages/extrato/Extrato_Conta';
import ExtratoCartao from '../pages/extrato/Extrato_Cartao';
import ExtratoConvenio from '../pages/extrato/Extrato_Convenio';
import ExtratoInvestimento from '../pages/extrato/Extrato_Investimento';
import ExtratoParcelado from '../pages/extrato/Extrato_Parcelado';
import ExtratoFinanceiro from '../pages/extrato/Extrato_Financeiro';
import Transferencia from '../pages/transferencia/Transferencia';
import TransferenciaInterna from '../pages/transferencia/Transferencia_Interna';
import TransferenciaOutros from '../pages/transferencia/Transferencia_Outros';
import Tela_escolha_cobranca from '../pages/cobrancas/tela_escolha_cobranca';
import BoletoCobranca from '../pages/cobrancas/gerar_boleto';
import BoletoCobranca_Multiplo from '../pages/cobrancas/multiplos_boletos';
import GerenciarLotesBoletos from '../pages/cobrancas/gerenciar_lotes';
import Gerenciar_Boletos from '../pages/cobrancas/gerenciar_boletos';
import Cadastro_Sacado from '../pages/cobrancas/cadastro_sacado';
import Editar_Sacado from '../pages/cobrancas/editar_sacado';
import Deposito from '../pages/deposito/deposito';
import GerenciarDeposito from '../pages/deposito/gerenciar_deposito';
import Comprovante from '../pages/comprovantes/comprovantes';
import ComprovanteConta from '../pages/comprovantes/comprovantes_conta';
import ComprovanteCartao from '../pages/comprovantes/comprovante_cartao';
import ComprovanteInvestimento from '../pages/comprovantes/comprovante_investimento';
import ComprovanteConvenio from '../pages/comprovantes/comprovante_convenio';
import ComprovanteLimite from '../pages/comprovantes/comprovante_limite';
import ComprovanteParcelado from '../pages/comprovantes/comprovante_parcelado';
import ComprovanteServico from '../pages/comprovantes/comprovante_servicos';
import Pagar from '../pages/pagar/pagar';
import Pix from '../pages/pix/pix';
import Perfil from '../pages/perfil/perfil';
import EscolhaCartao from '../pages/cartao/escolha_cartao';
import Servicos from '../pages/servicos/servicos';
import Recarga from '../pages/servicos/recarga';
import Entretenimento from '../pages/servicos/entretenimento';
import Games from '../pages/servicos/games';
import Aplicativos from '../pages/servicos/aplicativos';
// import Siso from '../pages/siso/Siso';
import QRCode from '../pages/qrcode/qrcode';
import TransferenciaLote from '../pages/transferencia/Transferencia_Lote';
import NoMatch from '../components/noMatch/NoMatch';
import Senha from "../pages/senha/senha";
import Cambio from "../pages/usdt/escolher_usdt";
import Relatorio from "../pages/relatorio/relatorio";
import RelatorioSaida from "../pages/relatorio/relatorio_saida";
import RelatorioEntrada from "../pages/relatorio/relatorio_entrada";





function Router(props) {
  if (Produtos.ajustesWeb) {
    return (
      <Routes>
        <Route path="*" component={Ajustes} />
      </Routes>
    );
  } else {
    const traduzir = async (data) => {
      props.langProp(data);
    }

    return (
      <Routes>
        <Route exact path="/" element={<Login langProp={traduzir} alerts={props.alerts}/>}/>
        
        <Route path="*" element={<NoMatch langProp={traduzir} alerts={props.alerts}/>}/>
        {/* <Route exact path="/siso" component={Siso} /> */}

        <Route element={<PrivateRoute />}>
            <Route exact path="/home" element={<Home langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.home}/>

            <Route exact path="/extrato" element={<Extrato langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.extrato}/>
            <Route exact path="/extrato_conta" element={<ExtratoConta langProp={traduzir} alerts={props.alerts}/>}  notBlocked={Produtos.extratoConta}/>
            <Route exact path="/extrato_cartao" element={<ExtratoCartao langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.extratoCartao}/>
            <Route exact path="/extrato_convenio" element={<ExtratoConvenio langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.extratoConvenio}/>
            <Route exact path="/extrato_investimento" element={<ExtratoInvestimento langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.extratoInvestimento}/>
            <Route exact path="/extrato_parcelado" element={<ExtratoParcelado langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.extratoParcelado}/>
            <Route exact path="/extrato_financeira" element={<ExtratoFinanceiro langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.extratoFinanceira}/>

            <Route exact path="/transferencia" element={<Transferencia langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.transferencia} />
            <Route exact path="/transferencia_interna" element={<TransferenciaInterna langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.trasnferenciaInterna} />
            <Route exact path="/transferencia_outros" element={<TransferenciaOutros langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.transferenciaOutros} />
            <Route exact path="/transferencia_lote" element={<TransferenciaLote langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.transferenciaLote} />

            <Route exact path="/cobrancas" element={<Tela_escolha_cobranca langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.cobrancas} />
            <Route exact path="/cobrancas_boleto" element={<BoletoCobranca langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.boletoCobranca} />
            <Route exact path="/multiplos_boletos" element={<BoletoCobranca_Multiplo langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.multiplosBoletos} />
            <Route exact path="/GerenciarLotesBoletos" element={<GerenciarLotesBoletos langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.gerenciarLotesBoletos} />
            <Route exact path="/Gerenciar_Boletos" element={<Gerenciar_Boletos langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.gerenciar_Boletos} />
            <Route exact path="/Cadastro_Sacado" element={<Cadastro_Sacado langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.cadastroSacado} />
            <Route exact path="/Editar_Sacado" element={<Editar_Sacado langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.editarSacado} />

            <Route exact path="/senha" element={<Senha langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.senha} />
            
            <Route exact path="/pix" element={<Pix langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.pix} />

            <Route exact path="/Pagar" element={<Pagar langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.pagar} />

            <Route exact path="/deposito" element={<Deposito langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.deposito} />
            <Route exact path="/gerenciar_deposito" element={<GerenciarDeposito langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.deposito} />

            <Route exact path="/comprovantes" element={<Comprovante langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.comprovante} />
            <Route exact path="/comprovantes_conta" element={<ComprovanteConta langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.ComprovanteConta} />

            <Route exact path="/cartoes" element={<EscolhaCartao langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.cartoes} />

            <Route exact path="/servicos" element={<Servicos langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.servicos} />
            <Route exact path="/recarga" element={<Recarga langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.servicos} />
            <Route exact path="/entretenimento" element={<Entretenimento langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.servicos} />
            <Route exact path="/games" element={<Games langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.servicos} />
            <Route exact path="/aplicativos" element={<Aplicativos langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.servicos} />

            <Route exact path="/comprovantes_cartao" element={<ComprovanteCartao langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.comprovantesCartao} />
            <Route exact path="/comprovantes_investimento" element={<ComprovanteInvestimento langProp={traduzir} alerts={props.alerts}/>} isPrivate isNotBlocked={Produtos.comprovantesInvestimento} />
            <Route exact path="/comprovantes_convenio" element={<ComprovanteConvenio langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.comprovantesConvenio} />
            <Route exact path="/comprovantes_limite" element={<ComprovanteLimite langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.comprovantesLimite} />
            <Route exact path="/comprovantes_parcelado" element={<ComprovanteParcelado langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.comprovantesParcelado} />
            <Route exact path="/comprovantes_servico" element={<ComprovanteServico langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.comprovantesServicos} />

            <Route exact path="/cambio" element={<Cambio langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.cambio} />

            <Route exact path="/relatorio" element={<Relatorio langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.relatorio} />
            <Route exact path="/relatorio_saida" element={<RelatorioSaida langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.relatorio_escolha.relatorioSaida} />
            <Route exact path="/relatorio_entrada" element={<RelatorioEntrada langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.relatorio_escolha.relatorioEntrada} />

            <Route exact path="/qr_code" element={<QRCode langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.qrcode} />

            <Route exact path="/perfil" element={<Perfil langProp={traduzir} alerts={props.alerts}/>} notBlocked={Produtos.perfil} />
        </Route>
      </Routes>
    );
  }
};

export default Router;