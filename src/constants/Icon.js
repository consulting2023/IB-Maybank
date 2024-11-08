import React from 'react';
import * as Icon from 'react-bootstrap-icons';
import * as Icomim from "react-icons/im";
import * as Iconfa from "react-icons/fa";
import * as Iconio5 from "react-icons/io5";
import * as Iconmd from "react-icons/md";
import * as Iconbs from "react-icons/bs";
import * as Iconhi from "react-icons/hi";

import '../templates/style_icones.scss';

export default {

    home: <div><Icon.HouseDoorFill data-tip="Home" className="iconeHome" /></div>,

    extrato: <div><Iconio5.IoReceiptOutline data-tip="Extrato" className="iconeHome" /></div>,

    deposito: <div><Iconfa.FaDollarSign data-tip="Depósito" className="iconeHome" /></div>,

    transferencia: <div><Icon.ArrowLeftRight data-tip="Transferência" className="iconeHome" /></div>,

    comprovantes: <div><Icon.Receipt data-tip="Comprovantes" className="iconeHome" /></div>,

    pagar: <div><Iconio5.IoCashOutline data-tip="Pagamentos" className="iconeHome" /></div>,

    cobrar: <div><Iconfa.FaHandHoldingUsd data-tip="Cobrar" className="iconeHome" /></div>,

    pixIcon: <div><Iconmd.MdPix data-tip="Pix" className="iconeHome"/></div>,

    cartoes: <div><Iconio5.IoCardOutline data-tip="Cartões" className="iconeHome" /></div>,

    servico: <div><Iconmd.MdCardTravel data-tip="Serviços" className="iconeHome" /></div>,

    maquininha: <div><Icon.Calculator data-tip="Maquininha" className="iconeHome" /></div>,

    investimentos: <div><Icon.GraphUp data-tip="Investimentos" className="iconeHome" /></div>,

    cashback: <div><Icon.CashStack data-tip={'Cashback ' + process.env.NOME_BANCO} className="iconeHome" /></div>,

    mimo: <div><Icon.GiftFill data-tip={"Pra Você"} className="iconeHome" /></div>,

    beneficio: <div><Icon.CashStack data-tip="Benefícios" className="iconeHome" /></div>,

    produtosBancario: <div><Iconfa.FaFileInvoiceDollar data-tip="Produtos Bancários" className="iconeHome" /></div>,

    informe: <div><Icon.GraphUp data-tip="Investimentos" className="iconeHome" /></div>,

    procidade: <div><Iconfa.FaGlobe data-tip="Pró-Cidade" className="iconeHome" /></div>,

    tarifas: <div><Iconfa.FaFunnelDollar data-tip="Tarifas" className="iconeHome" /></div>,

    senha: <div><Iconfa.FaKey data-tip="Senha" className="iconeHome" /></div>,

    qrcode: <div><Icomim.ImQrcode data-tip="QRCode" className="iconeHome" /></div>,

    cambio: <div><Iconfa.FaMoneyBillAlt data-tip="Cambio" className="iconeHome" /></div>,
    
    relatorio: <div><Iconfa.FaClipboardCheck  data-tip="Cambio" className="iconeHome" /></div>,

    sair: <div><Iconio5.IoExitOutline data-tip="Sair" className="iconeHome" /></div>,

    //Header

    notificacoes: <Iconbs.BsBell className="icon" />,

    //Saldos 

    saldo1: <Iconio5.IoWalletOutline className="iconesSaldos" />,

    saldo2: <Iconio5.IoCardOutline className="iconesSaldos" />,

    saldo3: <Iconfa.FaRegMoneyBillAlt className="iconesSaldos" />,

    saldo4: <Iconfa.FaRegChartBar className="iconesSaldos" />,

    //Favoritos

    fav1: <div><Iconfa.FaDollarSign className="iconesFavoritos" /></div>,

    fav2: <div><Iconio5.IoReceiptOutline className="iconesFavoritos" /></div>,

    fav3: <div><Iconio5.IoCashOutline className="iconesFavoritos" /></div>,

    fav4: <div><Icon.ArrowLeftRight className="iconesFavoritos" /></div>,

    //Login

    token_qrcode: <div><Iconfa.FaQrcode className="Login" /></div>,

    token: <div><Iconfa.FaKey className="Login" /></div>,

    apagar: <div><Iconio5.IoBackspaceOutline data-tip="Extrato"/></div>,

    //Validação

    pagarConta: <div><Iconfa.FaDollarSign className="Login" /></div>,

    // Tradutor

    langsIcon: <div><Iconfa.FaGlobeAmericas className="langsIcon" /></div>,

    // Pix

    documento: <div><Iconhi.HiIdentification style={{ fontSize: '26pt' }}/></div>,

    celular: <div><Iconmd.MdPhoneIphone style={{ fontSize: '26pt' }}/></div>,

    email: <div><Iconhi.HiOutlineMail style={{ fontSize: '26pt' }}/></div>,

    chave: <div><Icomim.ImKey style={{ fontSize: '26pt' }}/></div>,

    copiacola: <div><Iconfa.FaRegCopy style={{ fontSize: '26pt' }}/></div>,

    qrPix: <div><Icomim.ImQrcode style={{ fontSize: '26pt' }}/></div>,

    // Extratos

    extratoDigital: <div><Iconio5.IoReceiptOutline style={{ fontSize: '26pt' }}/></div>,

    extratoCartao: <div><Iconio5.IoCardOutline style={{ fontSize: '26pt' }}/></div>,

    // Transferencia

    transferenciaInterna: <div><Icon.BoxArrowInDownLeft style={{ fontSize: '26pt' }}/></div>,

    transferenciaOutros: <div><Icon.BoxArrowUpRight style={{ fontSize: '26pt' }}/></div>,

    transferenciaLote: <div><Icon.Files style={{ fontSize: '26pt' }}/></div>,

    transfBuscaConta: <div><Icon.WalletFill style={{ fontSize: '26pt' }}/></div>,

    transfBuscaTelefone: <div><Icon.TelephoneFill style={{ fontSize: '26pt' }}/></div>,

    transfBuscaCpf: <div><Icon.PersonBadge style={{ fontSize: '26pt' }}/></div>,

    // Depósito

    depositoBoleto: <div><Iconfa.FaBarcode style={{ fontSize: '26pt' }}/></div>,

    depositoGerenciar: <div><Icon.JournalText style={{ fontSize: '26pt' }}/></div>,

    depositoTed: <div><Icon.ArrowLeftRight style={{ fontSize: '26pt' }}/></div>,

    depositoComprovante: <div><Icon.FileEarmarkArrowUp style={{ fontSize: '26pt' }}/></div>,

    // Senhas

    senhaLogin: <div><Icon.KeyFill style={{ fontSize: '26pt' }}/></div>,

    senhaTransfer: <div><Icon.Key style={{ fontSize: '26pt' }}/></div>,

}