import Icones from './Icon';

const home_mostrar = true;
const extrato_mostar = true;
const transferencia_mostrar = true;
const depostio_mostrar = true;
const comprovante_mostar = true;
const pagar_mostrar = true;
const cobrar_mostrar = true;
const cartao_mostrar = false;
const servicos_mostrar = false;
const qrcode_mostrar = true;
const tarifas_mostrar = true;
const perfil_mostrar = true;
const pix_mostrar = true;

export default {

    //Ajustes
    ajustesWeb: false,

    //Menu
    lista_produtos: [
        { key: 0, icone: Icones.home, titulo: 'sidebar.home', rota: "/home", mostrar: home_mostrar },
        { key: 1, icone: Icones.extrato, titulo: 'sidebar.extrato', rota: "/extrato", mostrar: extrato_mostar },
        { key: 2, icone: Icones.transferencia, titulo: 'sidebar.transferencia', rota: "/transferencia", mostrar: transferencia_mostrar },
        { key: 3, icone: Icones.deposito, titulo: 'sidebar.deposito', rota: "/deposito", mostrar: depostio_mostrar },
        { key: 4, icone: Icones.comprovantes, titulo: 'sidebar.comprovantes', rota: "/comprovantes", mostrar: comprovante_mostar },
        { key: 5, icone: Icones.pagar, titulo: 'sidebar.pagamento', rota: "/Pagar", mostrar: pagar_mostrar },
        { key: 6, icone: Icones.cobrar, titulo: 'sidebar.cobranca', rota: "/cobrancas", mostrar: cobrar_mostrar },
        { key: 7, icone: Icones.pixIcon, titulo: 'sidebar.pix', rota: "/pix", mostrar: pix_mostrar },
        { key: 8, icone: Icones.cartoes, titulo: 'sidebar.cartoes', rota: "/cartoes", mostrar: cartao_mostrar },
        { key: 9, icone: Icones.servico, titulo: 'sidebar.servico', rota: "/servicos", mostrar: servicos_mostrar },
        { key: 10, icone: Icones.qrcode, titulo: 'sidebar.qrcode', rota: '/qr_code', mostrar: qrcode_mostrar },
        { key: 17, icone: Icones.tarifas, titulo: 'sidebar.tarifas', rota: '', mostrar: tarifas_mostrar },
    ],

    // Pages
    home: home_mostrar,
    extrato: extrato_mostar,
    transferencia: transferencia_mostrar,
    deposito: depostio_mostrar,
    comprovante: comprovante_mostar,
    pagar: pagar_mostrar,
    cobrancas: cobrar_mostrar,
    pix: pix_mostrar,
    cartoes: cartao_mostrar,
    servicos: servicos_mostrar,
    qrcode: qrcode_mostrar,
    tarifa: tarifas_mostrar,
    perfil: perfil_mostrar,

    //Saldos Home
    saldoDigital: true,
    saldoCartao: false,
    saldoCredito: false,
    saldoInvestimento: false,

    //Extrato
    extratoConta: true,
    extratoCartao: true,
    extratoConvenio: false,
    extratoInvestimento: false,
    extratoParcelado: false,
    extratoFinanceira: false,

    //Comprovante
    comprovantesConta: true,
    comprovantesCartao: true,
    comprovantesConvenio: false,
    comprovantesServicos: false,
    comprovantesParcelado: false,
    comprovantesLimite: false,
    comprovantesInvestimento: false,

    //Transferencia
    trasnferenciaInterna: true,
    transferenciaOutros: true,
    transferenciaLote: true,

    //Cobrar
    cadastroSacado: true,
    editarSacado: true,
    boletoCobranca: true,
    multiplosBoletos: true,
    indexMultiplosBoletos: true,
    gerenciarMultiplosBoletos: true,
    gerenciar_Boletos: true,
    gerenciarLotesBoletos: true,
    gerenciarPagadores: true,

    //Maquininha
    cadastroMaquininha: true,

    //Microcredito
    solicitarMicrocredito: true,
    listarMicrocredito: true,

    //Cartão
    ativarCartao: true,
    recargaBoletoCartao: true,
    transferencia2p2: true,
    TrocarSenhaCartao: true,

    //Pro-Cidade
    solicitarlojista: true,

    //Styles
    style_old: true,
    style_new: false,

    // Botões Lojas
    btnApple: true,
    btnPlay: true,

    // Siso
    siso: false,

    //tradutor
    mostrar_tradutor: false

}