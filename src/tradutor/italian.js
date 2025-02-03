// pt-BR.js
export default {
  langInfo: {
    key: 4,
    titulo: "Italiano",
    pais: "Italia",
    sigla: "IT",
    bandeira: require("../assets/paises/italia.png").default,
  },

  login: {
    acesse_sua_conta: "ACCEDI AL TUO CONTO\n%{banco}",
    info_credenciais: "Inserisci le credenziali del tuo conto per accedere",
    email: "indirizzo email",
    senha: "password",
    ou: " o ",
    entrar: "ENTRARE",
    conheca_produtos:"Scopri i Nostri Prodotti!",
    ola: "Ciao, %{nomeUsuario}",
    como_deseja_logar:
      "Seleziona il conto che desideri utilizzare per accedere",
    pessoa_fisica: "Persona Física",
    pessoa_juridica: "Persona Giuridica",
    chave_de_acesso: "Token di Accesso",
    abra_o_aplicativo:
      "Il token di accesso è un secondo passaggio di verifica per garantire maggiore sicurezza nelle tue transazioni. Verrà inviato alla tua email, consentendo l'accesso alla Banca Online.",
    token: "Token",
    chave_token: "Inserisci il token di accesso per continuare",
    qrcode: "Codice QR",
    ler_qrcode: "Scansiona il codice QR generato dal tuo Token di Accesso.",
    texto_1:
      "Una banca trasparente, completa e con il tuo stile, con prodotti esclusivi.",
    texto_2: "La tua vita finanziaria più facile",
    texto_3:
    "Facilità di risolvere tutto tramite l'applicazione, e con un supporto 24 ore su 24 che ti aiuta veramente",
   
    preencha: "Completa tutti i campi!",
    senhaExpirou:
      "La tua password è scaduta! Cambia la password per generarne una nuova",
    senhaIncorreta:
      "L'indirizzo email o la password sono errati, riprova",
    esqueciSenha: "Password dimenticata",
    alertEsqueciSenha:
      "Inserisci l'email per recuperare la password",
    modalSenha: "Password di Accesso",
    tokenModalSenha: "Token inviato alla tua email",
    senhaModalSenha: "Nuova Password",
    alertaCombinacoes: "Attenzione",
    tokenEnviado: "Token inviato all'email",
    alertSemSenha: "È obbligatorio inserire la password per continuare",
    alertSemToken: "È obbligatorio inserire il token per continuare",
    alertSenhaAlteradaComSucesso: "Password cambiata con successo!",
    alertErroAlterarSenha:
    "Errore nel cambiare la password, riprova più tardi",
    tituloContaNãoAprovada: "Conto Non Approvato",
    contaNãoAprovada:
      "Conto non approvato, contatta il manager per ulteriori informazioni",
    cadastrar: "Registrati",
    selecionarConta: "Seleziona il tipo di conto da registrare",
  },

  home: {
      ultiMov: "Ultimi movimenti",
      saldoDigital: "Conto Digitale",
      saldoBloqueado: "Saldo Bloccato",
      saldoCartao: "Carta",
      saldoConvenio: "Convenzione",
      saldoInvestimento: "Investimento",
      acoesRapida: "Azioni Rapide",
      btnAcoesRapida1: "Deposito",
      btnAcoesRapida2: "Trasferimento",
      btnAcoesRapida3: "Pagamento",
      btnAcoesRapida4: "Estratto Conto",
      ultLancamentos: "Ultimi Movimenti del Conto Digitale",
      descr: "Descrizione",
      descrValor: "Valore €",
      descrData: "Data",
      descrNome: "%{descrizione}",
      verMais: "Vedi di Più",
      hey: "Ciao!",
      proprietaryAccounts: "Conti Proprietari",
      proprietaryAccountBalance: "Saldo del conto proprietario",
      conta: "Conto",
      saldo: "Saldo",
      saldoNull: "Non disponibile",
      transactionalAccounts: "Conti Transazionali",
      transactionalAccountBalance: "Saldo del conto transazionale",
    },
  

    extrato: {
      alertaCartao: "Non hai una carta attiva.",
      btnExtratoDigital: "Conto Digitale",
      btnExtratoCartao: "Carta",
      btnExtratoConvencao: "Convenzione",
      btnExtratoInvestimento: "Investimento",
      btnExtratoParcelado: "Pagamento Rateizzato",
      btnExtratoAgenda: "Agenda Finanziaria",
      modalCartaAtivo: "Non hai una carta attiva.",
      fecharModal: "Chiudi",
      breadCrumb1: "Inizio",
      breadCrumb2: "Estratto",
      breadCrumb3: "Estratto del Conto",
      textoEscolhaExtrato: "Scegli il periodo che desideri visualizzare nel tuo estratto:",
      dataInicio: "Data Iniziale:",
      dataFinal: "Data Finale:",
      btnPesquisar: "Cerca",
      downloadPdf: "Scarica Estratto PDF",
      downloadCsv: "Scarica Estratto CSV",
      descr: "Descrizione",
      descrValor: "Valore €",
      descrData: "Data",
      descrNome: "%{descrizione}",
  
      nenhumEncontrado: "Non sono stati trovati movimenti nella data selezionata",
      extrato: "Estratto",
      nenhumaOperacao: "Non sono state trovate operazioni",
  },


    deposito: {
      btnDepositoBoleto: "Depósito por Boleto",
      btnDepositoGerenciar: "Gestionar Boletos de Depósito",
      btnDepositoTED: "Depósito TED/DOC",
      btnDepositoComprovante: "Enviar Comprobante",
      breadCrumb1: "Inicio",
      breadCrumb2: "Depósito",
      breadCrumb3: "Gestionar Boletos de Depósito",
      textoEscolhaDeposito: "Elija el período que desea visualizar sus boletos",
      dataInicio: "Fecha Inicial:",
      dataFinal: "Fecha Final:",
      btnPesquisar: "Buscar",
      btnVoltar: "Volver",
      descr: "Nombre del Beneficiario",
      descrNumero: "Nuestro Número",
      descrValor: "Valor €",
      descrVencimento: "Vencimiento",
      descrStatus: "Estado",
      downloadPdf: "Descargar PDF",
      textBoleto: "Reciba valores de forma sencilla.",
      dataVencimento: "Fecha de Vencimiento",
      gerarBoleto: "Generar Boleto",
      fecharBoleto: "Cerrar",
      textTED:
        "Solo necesita usar los datos a continuación para enviar dinero a su cuenta digital",
      alertTED:
        'Preste mucha atención a un consejo:\nColoque en el campo "DESCRIPCIÓN" de su DOC o TED\nsu CPF/CNPJ o su cuenta digital en el ',
      textComp:
        "Si ya ha realizado su depósito, envíenos su comprobante, por favor",
      eschComp: "Seleccione un Comprobante",
      enviarComp: "Enviar Comprobante",
  
      nenhumBoleto: "No se encontraron boletos en la fecha seleccionada",
      boletoGerado: "¡Boleto generado con éxito, Gestionar Boletos!",
      erroGerar: "Error al generar el boleto, intente nuevamente más tarde",
      pago: "Pagado",
      emAberto: "Pendiente",
      vencido: "Vencido",
      formatoInvalido: "Formato de archivo inválido",
      falhaComprovante: "Error al enviar comprobante",
      upload: "Para cargar, debe seleccionar un archivo",
      comprovanteEnviado: "Comprobante Enviado con éxito",
      falhaComprovanteTente:
        "Error al enviar comprobante, intente nuevamente más tarde",
      deposito: "Depósito",
    },
  

  comprovante: {
    compDigital: "Conto Digitale",
    compCartao: "Conto Carta",
    compConvenio: "Conto Convenzione",
    compServicos: "Servizi",
    compParcelado: "Pagamento a Rate",
    compInvestimento: "Investimento",
    breadCrumb1: "Inizio",
    breadCrumb2: "Ricevute",
    breadCrumb3: "Ricevute del Conto",
    textEscolhaComprovante: "Scegli il periodo per visualizzare le tue ricevute:",
    dataInicio: "Da:",
    dataFinal: "A:",
    btnPesquisar: "Cerca",
    valor: "Valore: ",
    data: "Data: ",
    downPDf: "Scarica PDF",

    nenhumComprovante:
      "Non sono state trovate ricevute per il periodo richiesto.",
    nenhumCartao: "Non hai una carta attiva.",
    comprovantes: "Ricevute",
  },

  cobranca: {
    btnBoletoCobranca: "Bolletta di Riscossione",
    btnLoteCobranca: "Più Bollette di Riscossione",
    btnPagadorCobranca: "Registrare Pagatore",
    btnGerarBoletoCobranca: "Genera Bolletta",
    btnGerenciarBoletoCobranca: "Gestisci Bollette",
    btnGerarLoteCobranca: "Genera Più Bollette",
    btnGerenciarLoteCobranca: "Gestisci Più Bollette",
    btnCadastrarPagadorCobranca: "Registrare Pagatore",
    btnGerenciarPagadorCobranca: "Gestisci Pagatori",
    textGerarBoleto: "Compila i dati seguenti per Generare la tua Bolletta di Riscossione",
    valorBoleto: "Importo € *",
    vencimentoBoleto: "Scadenza",
    multaBoleto: "Penale in Euro",
    jurosBoleto: "Interessi Giornalieri in Euro",
    descontoBoleto: "Sconto in Euro",
    abatimentoBoleto: "Riduzione in Euro",
    pagadorBoleto: "Pagatore *",
    notaBoleto: "Fattura o Nº del Doc.",
    descBoleto: "Descrizione",
    gerarBoleto: "Genera Bolletta",
    downBoleto: "Scarica PDF",
    textGerenciarBoleto: "Scegli il periodo temporale che desideri visualizzare:",
    dataInicialBoleto: "Data Iniziale:",
    dataFinalBoleto: "Data Finale:",
    todosBoleto: "Tutti",
    pagoBoleto: "Pagato",
    abertoBoleto: "In sospeso",
    vencidoBoleto: "Scaduto",
    sacadoBoleto: "Beneficiario:",
    statusBoleto: "Stato:",
    dataVencimentoBoleto: "Scadenza:",
    valorGerenciarBoleto: "Importo €:",
    textLote: "Carica il File CSV per Generare Più Bollette",
    arqLote: "File CSV",
    escolherArqLote: "Seleziona un file .CSV",
    verificarLote: "Verifica",
    exemploLote: "Scarica Esempio .CSV",
    textGerenciarLote: "Seleziona il Lotto di Bolletta da Gestire",
    nomeArqLote: "Nome del file: ",
    dataLote: "Data: ",
    qtdRegistroLote: "Numero di Registrazioni: ",
    registradosLote: "Registrati: ",
    errosLote: "Errori: ",
    erroLinhaLote: "Errore alla riga: ",
    msgErroLote: "Messaggio: ",
    sacadoLote: "Beneficiario: ",
    statusLote: "Stato: ",
    vencimentoLote: "Scadenza: ",
    valorLote: "Importo: ",
    dwnPDFLote: "Scarica PDF",
    textEditarSacado: "Modifica Dati del Pagatore",
    pagadorSacado: "Pagatore",
    nomeSacado: "Codice Fiscale/Partita IVA",
    documentoSacado: "Codice Fiscale/Partita IVA",
    cepSacado: "Codice Postale",
    pesquisarCepSacado: "Cerca Codice Postale",
    enderecoSacado: "Indirizzo",
    numeroSacado: "Numero",
    complementoSacado: "Complemento",
    ufSacado: "Provincia",
    municipioSacado: "Comune",
    bairroSacado: "Quartiere",
    btnSacado: "Aggiorna",
    textCadastrarPagador: "Compila i dati per Registrare un Pagatore",
    btnPagador: "Registrare",
    digiteNome: "Inserisci il nome",
    digiteDoc: "Inserisci il documento",
    digiteLog: "Inserisci l'indirizzo",
    digiteNumero: "Inserisci il numero",
    digiteBairro: "Inserisci il quartiere",
    digiteCEP: "Inserisci il codice postale",
    digiteMunicipio: "Inserisci il comune",
    digiteEstado: "Inserisci la provincia",
    falhaCadastro: "Errore durante la registrazione, riprova più tardi",
    falhaAtualizacao: "Errore durante l'aggiornamento, riprova più tardi",
    falhaCEP: "Codice postale non valido",
    pagadorCadastrado: "Pagatore registrato con successo",
    pagadorAtualizado: "Pagatore aggiornato con successo",
    funcLiberada: "Non hai questa funzionalità abilitata. Per attivarla, contatta i seguenti mezzi: %{email_banco} %{telefone_banco}",
    digiteValor: "Inserisci l'importo",
    escolhaPagador: "Scegli il pagatore",
    boletoGerado: "Bolletta generata con successo",
    erroGerarTente: "Errore durante la generazione della bolletta, riprova più tardi.",
    erroGerarJuros: "Errore durante la generazione della bolletta, gli interessi non possono superare il 3% mensile.",
    vencido: "Scaduto",
    emAberto: "In sospeso",
    pagoEm: "Pagato: %{dataPago}",
    pago: "Pagato",
    nenhumBoleto: "Non sono state trovate bollette",
    dataFinal: "Data Finale",
    nenhumArquivo: "Non sono stati trovati file",
    formatoInvalido: "Formato file non valido",
    erroCSV: "Errore nel CSV, verifica: %{erroMsg}",
    analiseCSV: "CSV in analisi, procedi in Gestione Lotti",
    escolhaCSV: "Seleziona un file CSV",
    nenhumFavorecido: "Non hai nessun beneficiario registrato. Registrane uno per generare la tua bolletta.",
    cobranca: "Riscossione"
  },

  pagar: {
    linhaDigital: "Linea Digitale",
    btnConsultar: "Consultare",
    dadosBoleto: "Dati del bollettino: ",
    favorecido: "Beneficiario: ",
    valorDocumento: "Valore del Documento: ",
    desconto: "Sconto: ",
    jurosMora: "Interessi/Mora: ",
    multa: "Multe: ",
    totalEncargo: "Totale Oneri: ",
    vencimento: "Scadenza: ",
    totalPagar: "Totale da Pagare: ",
    codigoBarras: "Codice a Barre: ",
    btnVoltar: "Tornare",
    btnProximo: "Successivo",
    titleModalValidacao: "Autenticazione a due fattori",
    textModalValidacao:
      "Inserisci la tua password e accedi al tuo account %{nome_banco} sul tuo dispositivo per convalidare la tua Chiave di Accesso.",
    tokenValidacao: "Token",
    titleSenha: "Password",
    textSenha: "Inserisci la tua password",
    titleToken: "Token",
    textTokenDescr:
      "Inserisci il Token generato dalla tua Chiave di Accesso nella tua applicazione.",
    btnPagar: "Pagare",

    diaUtil: "Il pagamento può essere effettuato solo nei giorni lavorativi.",
    foraHorario: "Pagamento fuori dall'orario consentito.",
    invalido: "Codice a barre non valido",
    boletoPropria: "Non è consentito pagare un bollettino dello stesso %{nome_banco}",
    saldoInsuficiente: "Saldo insufficiente",
    erroSenha: "Errore nella password o token non valido",
    sucesso: "Pagamento effettuato con successo.\nVerifica nei tuoi ricevute.",
    tente: "Impossibile completare il pagamento.\nRiprova più tardi.",
    pagar: "Pagare",
  },

  perfil: {
    dadosPessoais: "Dati Personali",
    celular: "Telefono Cellulare",
    estadoCivil: "Stato Civile",
    documento: "Codice Fiscale/Partita IVA",
    cap: "Codice Postale",
    endereco: "Indirizzo",
    numero: "Numero",
    completo: "Complemento",
    bairro: "Quartiere",
    cidade: "Città",
    estado: "Provincia",
  },

  qrcode: {
    qrCode: "Codice QR",
    textQRCode:
      "Questo è il tuo Codice QR di %{nomeBanco}, mostralo o scaricalo e stampalo per permettere alle persone di effettuare pagamenti verso di te.",
    btnQRCOde: "Scarica Codice QR",
  },

  transferencia: {
    btnEntraContas: "Conti %{nome_banco}",
    btnParaOutros: "Altre Banche",
    btnLote: "In Lotto (%{nome_banco})",
    textInterna:
      "Scegli come desideri Trasferire tra i Conti di %{nome_banco}",
    btnBuscarConta: "Cerca per Conto",
    btnBuscarTelefone: "Cerca per Telefono",
    btnBuscarDocumento: "Cerca per Codice Fiscale/Partita IVA",
    textTelefone: "Telefono",
    btnPesquisar: "Cerca",
    btnFechar: "Chiudi",
    textDocumento: "Codice Fiscale/Partita IVA",
    textAgencia: "Agenzia",
    textConta: "Conto",
    textDigito: "Cifra",
    textSelecionarConta: "Seleziona il conto qui sotto",
    nomeConta: "Nome:",
    agenciaConta: "Agenzia:",
    contaConta: "Conto:",
    textDadosFavorecido: "Dati del Beneficiario:",
    saldo: "Saldo",
    valor: "Importo €",
    titleLote:
      "Carica il File CSV per effettuare un Trasferimento Interno in Lotto",
    textLote: "File CSV",
    textEscolhaLote: "Seleziona un file .CSV",
    btnVerificarLote: "Verifica",
    btnDownLote: "Scarica Esempio .CSV",

    titleTransfOutros:
      "Compila i Campi per effettuare il Trasferimento verso Altre Banche",
    textBanco: "Banca *",
    selectBanco: "Seleziona la Banca a cui desideri trasferire",
    textOutrosBancos: "Altre Banche",
    agenciaTransfOutros: "Agenzia *",
    digAgTransfOutros: "Cifra",
    contaTransfOutros: "Conto *",
    digitoTransfOutros: "Cifra *",
    tipoConta: "Tipo di Conto *",
    selecTipoConta: "Seleziona il Tipo di Conto",
    pesquisarBanco: "Cerca: ",
    documentoTransfOutros: "Codice Fiscale/Partita IVA *",
    favorecidoTransfOutros: "Beneficiario *",
    valorTransfOutros: "Importo *",
    finalidadeTransfOutros: "Finalità *",
    selectFinalidadeTransfOutros: "Seleziona la Finalità",
    tranfDescrOutros: "I campi contrassegnati con * sono obbligatori!",
    titleConfirmeDados: "Conferma i Dati per effettuare il trasferimento",
    bancoConfirmeDados: "Banca: ",
    contaConfirmaDados: "Conto: ",
    agenciConfirmeDados: "Agenzia: ",
    digitoConfirmeDados: "Cifra: ",
    tipoContaConfirmeDados: "Tipo di Conto: ",
    documentoConfirmeDados: "Codice Fiscale/Partita IVA: ",
    favorecidoConfirmeDados: "Beneficiario: ",
    valorConfirmeDados: "Importo: ",
    btnCancelar: "Annulla",

    btnTransferir: "Trasferire",
titleModalValidacao: "Autenticazione a due fattori",
textModalValidacao:
  "Inserisci la tua password e accedi al tuo account %{nome_banco} sul tuo dispositivo per convalidare la tua Chiave di Accesso.",
tokenValidacao: "Token",
titleSenha: "Password",
textSenha: "Inserisci la tua password per il trasferimento",
titleToken: "Token",
textTokenDescr: "Inserisci il Token inviato al tuo indirizzo email",

erroSenha: "Errore nella password o token non valido",
sucesso: "Trasferimento effettuato con successo.",
analise: "Trasferimento in analisi per motivi di sicurezza.",
erroTransferencia: "Impossibile completare il trasferimento",
erroNumero: "Nessun conto trovato con questo numero",
erroDoc: "Nessun conto trovato con questo documento",
funcionalidade:
  "Non disponi di questa funzionalità attivata. Per abilitarla, contatta i seguenti mezzi: %{email_banco} %{telefone_banco}",
formatoInvalido: "Formato del file non valido",
escolhaCSV: "Seleziona un file CSV",
erroCSV: "Errore nel CSV, verifica: %{erroMsg}",
sucessoVerifique:
  "Trasferimento effettuato con successo! Verifica l'estratto conto.",
escolhaBanco: "Seleziona la banca",
digiteAgencia: "Inserisci l'agenzia",
digiteConta: "Inserisci il conto",
digiteDigito: "Inserisci il codice di controllo",
escolhaTipo: "Seleziona il tipo di conto",
erroCPF: "Codice Fiscale non valido",
erroCNPJ: "Partita IVA non valida",
digiteCPF: "Inserisci il Codice Fiscale o la Partita IVA",
digiteFavorecido: "Inserisci il nome del beneficiario",
digiteValor: "Inserisci l'importo",
finalidade: "Seleziona la finalità",
erroSaldo: "Saldo insufficiente",
credito: "Accredito sul Conto",
pagarAluguel: "Pagamento di Affitto/Condominio",
pagarTitulos: "Pagamento di Cambiali/Titoli",
pagarDividendos: "Pagamento di Dividendi",
pagarMensalidade: "Pagamento di Retta Scolastica",
pagarSalario: "Pagamento di Stipendi",
pagarFornecedor: "Pagamento a Fornitori/Compensi",
operacoes: "Operazioni di Cambio/Fondi/Borsa Valori",
repasse: "Riscossione/Imposte",
internacional: "Trasferimento Internazionale in Euro",
docPoupanca: "DOC per Risparmio",
docDeposito: "DOC per Deposito Giudiziario",
outros: "Altro",
bolsa: "Pagamento di Borsa di Studio",
remuneracao: "Remunerazione al socio",
contaCorrente: "Conto corrente",
contaPoupanca: "Conto di risparmio",
digiteNumeroConta: "Inserisci il numero del conto",
transferencia: "Trasferimento",
loteCod304: "Il numero della banca è errato. Era atteso '000'.",
loteCod301: "Il conto fornito non è stato trovato. Verifica per favore.",
loteCod302: "Mancano dati nel registro. Controlla i campi obbligatori.",
loteCod303: "L'importo non può essere zero. Inserisci un valore valido.",
loteCod305:
  "L'agenzia fornita non corrisponde al conto fornito. Controlla i dati.",
loteCod306:
  "Il documento fornito non è associato al conto fornito. Controlla i dati.",
loteCod307:
  "Il CSV contiene campi mancanti o fuori ordine. Correggi il file per favore.",
semErro: "Nessun errore",
  },

  escolhaCartao: {
    ativar: "Attivare Carta",
    carregar1: "Caricare Carta",
    trocarSenha: "Cambiare Password",
    detalhes: "Dettagli",
    aquisicao: "• Tutti i vantaggi con un solo clic!",
    aquisicaoDesc1:
        "Per ottenere la tua carta %{nome_banco}, verrà addebitata una tariffa unica di %{tarifa} €, che sarà detratta dal tuo conto digitale. Assicurati di avere saldo disponibile sul conto.",
    selecao:
        "Seleziona il colore che preferisci per la tua carta %{nome_banco}",
    termos: "Leggi i termini di utilizzo",
    confirmacao: "Per attivare la tua carta %{nome_banco}, conferma alcuni dati:",
    nome: "Nome: ",
    telefone: "Telefono: ",
    textoDescricao:
        "Se i dati non sono corretti, contatta l'assistenza %{nome_banco} a %{email_banco}",
    token:
        "Inserisci il codice di attivazione del Token inviato via SMS al tuo cellulare",
    instrucao:
        "Inserisci il codice della carta, situato sopra il numero della carta e sotto la data di scadenza",
    digite: "Inserisci le ultime 4 cifre della tua carta %{nome_banco}",
    criarSenha:
        "Crea una password di accesso di 4 cifre per la tua carta %{nome_banco}",
    desbloqueio:
        "Congratulazioni! La tua carta %{nome_banco} è stata sbloccata con successo. Buon utilizzo!",
    carregar: "Come desideri caricare la tua carta?",
    transferencia: "Trasferimento",
    boleto: "Genera un bollettino per ricaricare la tua carta",
    valorBoleto: "Importo del Bollettino",
    vencimento: "Scadenza",
    transferenciaRapida: "Trasferimento rapido tra carte.",
    codigo:
        "Inserisci il codice identificativo della tua carta, situato proprio sotto la data di scadenza.",
    mostrarValor: "Quanto desideri trasferire a %{nome_cartao}?",
    valor: "Importo €",
    senha: "Password",
    boletoGerado: "Bollettino generato con successo!",
    pagador: "Pagatore",
    nossoNumero: "Il nostro numero",
    emissao: "Emissione",
    validade: "Validità",
    codigoBarras: "Codice a barre",
    bloquear: "Qui puoi bloccare o sbloccare la tua carta %{nome_banco}",
    cartao: "Carta: ",
    id: "ID: ",
    status: "Stato: ",
    solicitar: "Richiedi Carta",
  },

  ajustes: {
    ola: "Ciao, Benvenuto a %{nome_banco}",
manutencao:
  "Il Internet Banking di %{nome_banco} è attualmente in manutenzione!",
retornaremos: "Torneremo presto a funzionare normalmente.",
info: "Per maggiori informazioni, contatta il nostro centro assistenza: ",
},

servicos: {
  recarregueApp: "Ricarica le tue applicazioni in modo facile e veloce",
  recarregueCel: "Ricarica il tuo cellulare o telefono fisso in modo facile e veloce",
  cel: "Numero di Telefono",
  recarregueSer:
    "Ricarica i tuoi servizi di intrattenimento in modo facile e veloce.",
  recarregueGames: "Ricarica i tuoi giochi in modo facile e veloce",
  tituloTel: "Ricarica Telefono",
  tituloEntr: "Intrattenimento",
  tituloGames: "Giochi",
  tituloApps: "Applicazioni",
},

  siso: {
    produtos: "I Nostri Prodotti",
realizar:
  "Vuole realizzare un progetto o un sogno? Viaggiare, sposarsi, studiare, ristrutturare la casa o persino investire nella sua attività. Possiamo aiutarla a realizzare quel sogno!",
pf: "Persona Fisica",
pj: "Persona Giuridica",
cpf: "Per continuare, abbiamo bisogno che completi il suo CPF",
continuar: "Continuare",
cnpj: "Per continuare, abbiamo bisogno che completi il CNPJ della sua azienda",
nomeEmpresa: "*Nome dell'Azienda:",
digiteNomeEmpresa: "Inserisca il Nome dell'Azienda",
emailEmpresa: "Email dell'Azienda:",
digiteEmailEmpresa: "Inserisca l'Email dell'Azienda",
cel: "Telefono Cellulare:",
valorDesejado: "*Importo Desiderato:",
valorMedio: "*Importo Medio dei Titoli:",
quantidadeTil: "*Quantità Media di Titoli",
quantidadeSacados: "*Quantità Media di Debitori",
prazo: "*Durata (Giorni):",
simular: "Simulare",
nomeDeEmpresa: "Nome dell'Azienda",
cnpjLabel: "CNPJ",
dataSimulacao: "Data di Simulazione",
valorSolicitado: "Importo Richiesto €",
quantidadeTitulos: "Quantità di Titoli",
valorMedio2: "Importo Medio dei Titoli €",
prazoMedio: "Durata Media in Giorni",
quantidadeSacados2: "Quantità di Debitori",
valorLiberado: "Importo Concesso €",
taxa: "Tasso di Interesse Mensile %",
iof: "IOF €",
cet: "CET %",
pdf: "Scarica PDF della Simulazione",
refazer: "Rifare la Simulazione",
aprovar: "Approvare la Simulazione",
interessado:
  "Interessato ai nostri prodotti? Approfitti per installare la nostra Applicazione scegliendo lo Store disponibile sul suo dispositivo mobile e scansionando il Codice QR.",
solicitacoes: "Esistono già richieste effettuate in precedenza",
dataSimulacao2: "Data di Simulazione:",
valorDesejado2: "Importo da Accreditare:",
obrigado: "Grazie per Aver Approvato la Simulazione!",
aproveite: " Approfitti per aprire un conto presso la nostra Banca Digitale.",
  },

  sidebar: {
    home: "Inizio",
    extrato: "Estratto",
    transferencia: "Trasferimento",
    deposito: "Deposito",
    comprovantes: "Ricevute",
    pagamento: "Pagamento",
    cobranca: "Incasso",
    pix: "Pix",
    servico: "Servizi",
    cartoes: "Carte",
    qrcode: "Codice QR",
    tarifas: "Tariffe",
    gratuito: "Gratuito/Mese: ",
    tarifaTitulo: "Tariffe Conto Digitale",
    tarifaCol: "Tariffa",
    tarifaValor: "Valore",
    tarifaFechar: "Chiudere",
    senha: "Password",
    cambio: "Cambio",
    relatorio: "Rapporto",
  },

  header: {
    ola: "Ciao, ",
    conta: "C/C: ",
    agencia: "Ag: ",
    empresa: "Azienda: ",
    perfil: "Profilo",
    nenhumaNotif: "Non ci sono nuovi messaggi",
    lidoNotif: "Segna come letto",
    cancelarNotif: "Annulla",
    sair: "Esci",
  },

  senha: {
    senhaTitle: "Password",
    senhaLogin: "Password di Accesso",
    senhaTransfer: "Password di Transazione",
    token: "Token Inviato alla tua Email",
    senhaNova: "Nuova Password",
    senhaTransferNova: "Nuova Password di Transazione",
    alertSemSenha: "È obbligatorio compilare la password per continuare",
    alertSemToken: "È obbligatorio compilare il token per continuare",
    alertSenhaAlteradaComSucesso: "Password cambiata con successo!",
    alertErroAlterarSenha: "Errore nel cambiare la password, riprova più tardi",
  },

  relatorio: {
    relatorio: "Rapporto",
    relatorioPixOut: "Rapporto Uscita Pix",
    relatorioPixIn: "Rapporto Entrata Pix",
    relatorioCrypto: "Rapporto Crypto",
    dataDe: "Data Da:",
    dataAte: "Data A:",
    customId: "ID Personalizzato",
    endtoend: "End To End",
    nome: "Nome",
    status: "Stato",
    alertPesquisa: "Seleziona il periodo per cercare",
    semRelatorio: "Non ci sono rapporti per questo periodo",
    concluido: "Completato",
    estornado: "Rimborsato",
    analise: "In Analisi",
    movimentacao: "Movimenti",
    datahora: "Data e Ora",
    valCotacao: "Valore di Quotazione del Dollaro",
    valReal: "Valore Reale",
    moeda: "Valuta",
  },

  cambio: {
    cambioTitle: "Cambio",
    moeda: "Moneta: ",
    saldo: "Saldo: ",
    comprarMoeda: "Acquistare Moneta",
    saqueMoeda: "Ritirare Moneta",
    escolherMoeda: "Selezionare Moneta",
    valDsj: "Valore Desiderato",
    valMoeda: "Valore della Moneta",
    valLqd: "Valore Netto",
    taxa: "Tasso",
    tarifa: "Tariffa",
    totalPagar: "Totale da Pagare",
    senhaTransfer: "Password di Transazione",
    confirmCompra: "Confermare Acquisto",
    campos: "Per favore, compila i campi per continuare",
    limit: "Il valore minimo di acquisto è di 10.000",
    timeLimite:
      "Tempo minimo per bloccare il tasso di cambio: 1 minuto, riprova",
    erroTravar:
      "Errore nel bloccare il tasso di cambio, riprova più tardi o contatta il responsabile",
    verifiqueParam: "Verifica i parametri e riprova",
    senhaInformer:
      "È necessario inserire la password di transazione per effettuare l'acquisto",
    senhaIncorreta: "Password Errata",
    informeCarteira: "Fornisci il portafoglio per il ritiro",
    informeValorSaque: "Inserisci un valore di ritiro valido",
    informeMoedaSaque: "Seleziona una moneta per il ritiro",
    informeSenhaSaque: "Inserisci la password per effettuare il ritiro",
    saqueSuccess: "Ritiro in elaborazione. Verifica il rapporto di Ritiro",
    saqueCod101: "Password errata, riprova",
    saqueCod105:
      "Parametri insufficienti, verifica i campi e riprova",
    saqueCod2:
      "Saldo insufficiente per il ritiro, effettua un acquisto per poter ritirare di più dal saldo",
    saquecod104:
      "Errore durante il completamento del ritiro, riprova più tardi o contatta il responsabile",
    sacar: "Ritirare",
    valSaque: "Valore del Ritiro",
    carteiraSaque: "Portafoglio Crypto",
    carregando: "Caricamento in corso...",
    placeholderSaque: "Compila il portafoglio per il ritiro",
    erroCompra:
      "Errore durante l'acquisto, riprova più tardi o contatta il responsabile",
    compraSuccess: "Acquisto completato con successo",
  },

  pix: {
    emailFail: "Email non valido",
dgtChave: "Inserisci la chiave Pix",
chaveFail: "Chiave Pix non trovata",
qrCodeFail: "Chiave non trovata",
saldoInsuficiente: "Saldo insufficiente",
pixCod0:
  "PIX NON DISPONIBILE. Attendi qualche minuto e riprova. Se il problema persiste, contatta il supporto clienti.",
pixCod1: "Pix effettuato con successo!",
pixCod3: "Pix non effettuato, contatta il tuo gestore",
pixCod7: "Si è verificato un problema durante la generazione del Pix, riprova più tardi",
pixCod9: "Pix non effettuato, riprova più tardi",
pixCod10:
  "Il sistema ha rilevato tentativi multipli di trasferimento in un breve intervallo di tempo. Attendi qualche minuto e riprova.",
pixCod100: "Password di Transazione non valida",
agendarPixSucces: "Il Pix verrà effettuato entro 1 ora",
msgChave: "Inserisci il ",
msgCell: "Inserisci il Numero di Telefono",
msgEmail: "Inserisci l'Email",
msgChaveRandom: "Inserisci o incolla la chiave casuale",
msgCopy: "Incolla qui il Pix",
celular: "Cellulare",
email: "Email",
chaveRandom: "Chiave Casuale",
copyPaste: "Copia e Incolla",
pagar: "Paga",
receber: "Ricevi",
gerarQrCode: "Genera Codice QR",
modoPix: "Metodo Pix",
pesquisar: "Cerca",
transferPix: "Trasferimento Pix",
favorecido: "Beneficiario:",
banco: "Banca: ",
agConta: "Agenzia e Conto:",
doc: "Documento:",
chavePix: "Chiave Pix:",
valPix: "Valore del Pix:",
msg: "Messaggio (opzionale):",
dgtSenha: "Inserisci la tua Password di Transazione",
tokenPix: "Inserisci il Token inviato via Email",
btnTransfer: "Trasferisci",
receberPix: "Ricevi Pix",
selectKey: "Seleziona Chiave",
notKey: "Non hai ancora registrato alcuna chiave",
valorQrCode: "Valore: ",
nomePagador: "Nome del Pagatore",
docPagador: "Documento del Pagatore",
btnGerarQrCode: "Genera Codice QR",
qrCodeSucces: "Codice QR generato con successo",
coyCod: "Copia Codice",
tokenInvalido: "Token non valido",
erro: "Errore",
  },
};
