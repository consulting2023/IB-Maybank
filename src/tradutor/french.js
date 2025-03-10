// pt-BR.js
export default {
    langInfo: {
      key: 5,
      titulo: "Français",
      pais: "França",
      sigla: "frFR",
      bandeira: require("../assets/paises/franca.png").default,
    },
  
    login: {
      acesse_sua_conta: "ACCÉDEZ À VOTRE COMPTE\n%{banco}",
      info_credenciais: "Entrez les identifiants de votre compte pour accéder",
      email: "email",
      senha: "mot de passe",
      ou: " ou ",
      entrar: "SE CONNECTER",
      conheca_produtos: "Découvrez Nos Produits!",
      ola: "Bonjour, %{nomeUsuario}",
      como_deseja_logar:
        "Sélectionnez le compte que vous souhaitez connecter ci-dessous",
      pessoa_fisica: "Personne Physique",
      pessoa_juridica: "Personne Morale",
      chave_de_acesso: "Clé d'Accès",
      abra_o_aplicativo:
        "La clé d'accès est une étape de vérification supplémentaire pour garantir plus de sécurité dans votre transaction. Elle sera envoyée à votre email, permettant l'accès à la Banque en Ligne",
      token: "Token",
      chave_token: "Entrez la clé d'accès pour continuer",
      qrcode: "Code QR",
      ler_qrcode: "Scannez le code QR généré par votre Clé d'Accès.",
      texto_1:
        "Une banque transparente, complète et à votre image, avec des produits exclusifs.",
      texto_2: "Votre vie financière plus simple",
      texto_3:
        "Facilité pour tout résoudre via l'application, avec une assistance 24h/24 qui vous aide vraiment",
  
      preencha: "Veuillez remplir tous les champs!",
      senhaExpirou:
        "Votre mot de passe a expiré! Modifiez-le pour en générer un nouveau",
      senhaIncorreta:
        "L'email ou le mot de passe est incorrect, veuillez réessayer",
      esqueciSenha: "Mot de passe oublié",
      alertEsqueciSenha:
        "Veuillez remplir l'email pour récupérer le mot de passe",
      modalSenha: "Mot de Passe de Connexion",
      tokenModalSenha: "Token envoyé à votre email",
      senhaModalSenha: "Nouveau Mot de Passe",
      alertaCombinacoes: "Attention",
      tokenEnviado: "Token envoyé à l'email",
      alertSemSenha: "Le mot de passe est obligatoire pour continuer",
      alertSemToken: "Le token est obligatoire pour continuer",
      alertSenhaAlteradaComSucesso: "Mot de passe modifié avec succès!",
      alertErroAlterarSenha:
        "Erreur lors de la modification du mot de passe, veuillez réessayer plus tard",
      tituloContaNãoAprovada: "Compte Non Approuvé",
      contaNãoAprovada:
        "Compte non approuvé, contactez le gestionnaire pour plus d'informations",
      cadastrar: "S'inscrire",
      selecionarConta: "Sélectionnez le type de compte à enregistrer",

      erroInterno: "Erreur interne",
      captchaLang: "fr",
      erro: "Erreur",
      requisicaoNaoPermitida: "Demande non autorisée",
      erroConexao: "Erreur de connexion",
      tenteRecarregarPagina: "Essayez de recharger la page",
      tokenInvalido: "Jeton invalide",
      confirmeSuaIdentidade: "Confirmez votre identité",
      insiraCodigoEnviadoEmail: "Entrez le code envoyé à votre e-mail",
      insiraCodigoChave: "Entrez le code de la clé d'accès de l'application",
      insiraCodigoEnviadoEmailChave: "Entrez le code envoyé à votre e-mail ou trouvé dans la clé d'accès de l'application",
      ouQr: "ou",
      escaneieQr: "Scannez le QR Code avec la clé d'accès de l'application",
    },

    home: {
        ultiMov: "Derniers mouvements",
        saldoDigital: "Compte Numérique",
        saldoBloqueado: "Solde Bloqué",
        saldoCartao: "Carte",
        saldoConvenio: "Convention",
        saldoInvestimento: "Investissement",
        acoesRapida: "Actions Rapides",
        btnAcoesRapida1: "Dépôt",
        btnAcoesRapida2: "Virement",
        btnAcoesRapida3: "Paiement",
        btnAcoesRapida4: "Relevé",
        ultLancamentos: "Derniers Mouvements du Compte Numérique",
        descr: "Description",
        descrValor: "Valeur €",
        descrData: "Date",
        descrNome: "%{descricao}",
        verMais: "Voir Plus",
        hey: "Salut !",
        proprietaryAccounts: "Comptes Propriétaires",
        proprietaryAccountBalance: "Solde du compte propriétaire",
        conta: "Compte",
        saldo: "Solde",
        saldoNull: "Non disponible",
        transactionalAccounts: "Comptes Transactionnels",
        transactionalAccountBalance: "Solde du compte transactionnel",
    },

    extrato: {
        alertaCartao: "Vous n'avez pas de carte active.",
        btnExtratoDigital: "Compte Numérique",
        btnExtratoCartao: "Carte",
        btnExtratoConvenio: "Convention",
        btnExtratoInvestimento: "Investissement",
        btnExtratoParcelado: "Paiement Échelonné",
        btnExtratoAgenda: "Agenda Financier",
        modalCartaoAtivo: "Vous n'avez pas de carte active.",
        fecharModal: "Fermer",
        breadCrumb1: "Accueil",
        breadCrumb2: "Extrait",
        breadCrumb3: "Extrait du Compte",
        textoEscolhaExtrato: "Choisissez la période que vous souhaitez consulter dans votre extrait :",
        dataInicio: "Date de Début :",
        dataFinal: "Date de Fin :",
        btnPesquisar: "Rechercher",
        downloadPdf: "Télécharger l'Extrait PDF",
        downloadCsv: "Télécharger l'Extrait CSV",
        descr: "Description",
        descrValor: "Valeur €",
        descrData: "Date",
        descrNome: "%{descricao}",
    
        nenhumEncontrado: "Aucun mouvement trouvé à la date sélectionnée",
        extrato: "Extrait",
        nenhumLancamento: "Aucun lancement trouvé",
      },

      deposito: {
        btnDepositoBoleto: "Deposito tramite Boleto",
        btnDepositoGerenciar: "Gestire Boletos di Deposito",
        btnDepositoTED: "Deposito TED/DOC",
        btnDepositoComprovante: "Invia Ricevuta",
        breadCrumb1: "Inizio",
        breadCrumb2: "Deposito",
        breadCrumb3: "Gestire Boletos di Deposito",
        textoEscolhaDeposito: "Scegli il periodo per visualizzare i tuoi boletos",
        dataInicio: "Data Iniziale:",
        dataFinal: "Data Finale:",
        btnPesquisar: "Cerca",
        btnVoltar: "Torna Indietro",
        descr: "Nome del Beneficiario",
        descrNumero: "Nostro Numero",
        descrValor: "Importo €",
        descrVencimento: "Scadenza",
        descrStatus: "Stato",
        downloadPdf: "Scarica PDF",
        textBoleto: "Ricevi importi in modo semplice.",
        dataVencimento: "Data di Scadenza",
        gerarBoleto: "Genera Boleto",
        fecharBoleto: "Chiudi",
        textTED:
          "Basta usare i dati qui sotto per inviare denaro al tuo conto digitale",
        alertTED:
          'Fai molta attenzione a un consiglio:\nInserisci nel campo "DESCRIZIONE" del tuo DOC o TED\nil tuo codice fiscale o il tuo conto digitale nel ',
        textComp:
          "Se hai già effettuato il deposito, inviaci la ricevuta, per favore",
        eschComp: "Seleziona una Ricevuta",
        enviarComp: "Invia Ricevuta",
    
        nenhumBoleto: "Non sono stati trovati boletos nella data selezionata",
        boletoGerado: "Boleto generato con successo, Gestire Boletos!",
        erroGerar: "Errore durante la generazione del boleto, riprova più tardi",
        pago: "Pagato",
        emAberto: "In Sospeso",
        vencido: "Scaduto",
        formatoInvalido: "Formato file non valido",
        falhaComprovante: "Errore durante l'invio della ricevuta",
        upload: "Per caricare, devi selezionare un file",
        comprovanteEnviado: "Ricevuta inviata con successo",
        falhaComprovanteTente:
          "Errore durante l'invio della ricevuta, riprova più tardi",
        deposito: "Deposito",
      },

      comprovante: {
        compDigital: "Compte Numérique",
        compCartao: "Compte Carte",
        compConvenio: "Compte Convention",
        compServicos: "Services",
        compParcelado: "Paiement Échelonné",
        compInvestimento: "Investissement",
        breadCrumb1: "Accueil",
        breadCrumb2: "Reçus",
        breadCrumb3: "Reçus du Compte",
        textEscolhaComprovante: "Choisissez la période pour consulter vos reçus :",
        dataInicio: "De :",
        dataFinal: "À :",
        btnPesquisar: "Rechercher",
        valor: "Montant : ",
        data: "Date : ",
        downPDf: "Télécharger le PDF",
    
        nenhumComprovante:
          "Aucun reçu trouvé pour la période demandée.",
        nenhumCartao: "Vous n'avez pas de carte active.",
        comprovantes: "Reçus",
      },

      cobranca: {
        btnBoletoCobranca: "Bulletin de Paiement",
        btnLoteCobranca: "Multiples Bulletins de Paiement",
        btnPagadorCobranca: "Enregistrer un Payeur",
        btnGerarBoletoCobranca: "Générer un Bulletin",
        btnGerenciarBoletoCobranca: "Gérer les Bulletins",
        btnGerarLoteCobranca: "Générer Multiples Bulletins",
        btnGerenciarLoteCobranca: "Gérer Multiples Bulletins",
        btnCadastrarPagadorCobranca: "Enregistrer un Payeur",
        btnGerenciarPagadorCobranca: "Gérer les Payeurs",
        textGerarBoleto:"Remplissez les informations ci-dessous pour Générer votre Bulletin de Paiement",
          valorBoleto: "Valeur € *",
          vencimentoBoleto: "Échéance",
          multaBoleto: "Amende en Euros",
          jurosBoleto: "Intérêts par Jour en Euros",
          descontoBoleto: "Remise en Euros",
          abatimentoBoleto: "Réduction en Euros",
          pagadorBoleto: "Payeur *",
          notaBoleto: "Facture ou Nº du Doc.",
          descBoleto: "Description",
          gerarBoleto: "Générer le Boleto",
          downBoleto: "Télécharger PDF",
          textGerenciarBoleto: "Choisissez la période de dates que vous souhaitez voir :",
          dataInicialBoleto: "Date de Début :",
          dataFinalBoleto: "Date de Fin :",
          todosBoleto: "Tous",
          pagoBoleto: "Payé",
          abertoBoleto: "En attente",
          vencidoBoleto: "Expiré",
          sacadoBoleto: "Bénéficiaire :",
          statusBoleto: "Statut :",
          dataVencimentoBoleto: "Échéance :",
          valorGerenciarBoleto: "Valeur € :",
          textLote: "Téléchargez le Fichier CSV pour Générer Plusieurs Boletos",
          arqLote: "Fichier CSV",
          escolherArqLote: "Sélectionnez un fichier .CSV",
          verificarLote: "Vérifier",
          exemploLote: "Télécharger Exemple .CSV",
          textGerenciarLote: "Sélectionnez le Lot de Boletos à Gérer",
          nomeArqLote: "Nom du fichier : ",
          dataLote: "Date : ",
          qtdRegistroLote: "Nombre dEnregistrements : ",
          registradosLote: "Enregistrés : ",
          errosLote: "Erreurs : ",
          erroLinhaLote: "Erreur à la ligne : ",
          msgErroLote: "Message : ",
          sacadoLote: "Bénéficiaire : ",
          statusLote: "Statut : ",
          vencimentoLote: "Échéance : ",
          valorLote: "Valeur : ",
          dwnPDFLote: "Télécharger PDF",
          textEditarSacado: "Modifier les Informations du Payeur",
          pagadorSacado: "Payeur",
          nomeSacado: "NIF/SIRET",
          documentoSacado: "NIF/SIRET",
          cepSacado: "Code Postal",
          pesquisarCepSacado: "Rechercher Code Postal",
          enderecoSacado: "Adresse",
          numeroSacado: "Numéro",
          complementoSacado: "Complément",
          ufSacado: "Région",
          municipioSacado: "Commune",
          bairroSacado: "Quartier",
          btnSacado: "Mettre à jour",
          textCadastrarPagador: "Remplissez les informations pour Enregistrer un Payeur",
          btnPagador: "Enregistrer",
          digiteNome: "Inserisci il nome",
          digiteDoc: "Inserisci il documento",
          digiteLog: "Inserisci l'indirizzo",
          digiteNumero: "Inserisci il numero",
          digiteBairro: "Inserisci il quartiere",
          digiteCEP: "Inserisci il codice postale",
          digiteMunicipio: "Inserisci il comune",
          digiteEstado: "Inserisci la provincia",
          falhaCadastro:
           "Errore durante la registrazione, riprova più tardi",
           falhaAtualizacao: "Errore durante l'aggiornamento, riprova più tardi",
           falhaCEP: "Codice postale non valido",
           pagadorCadastrado: "Pagatore registrato con successo",
           pagadorAtualizado: "Pagatore aggiornato con successo",
           funcLiberada:
            "Non disponi di questa funzionalità abilitata. Per attivarla, contatta i seguenti mezzi: %{email_banco} %{telefone_banco}",
            digiteValor: "Inserisci l'importo",
            escolhaPagador: "Seleziona il pagatore",
            boletoGerado: "Boleto generato con successo",
            erroGerarTente: "Errore nella generazione del boleto, riprova più tardi.",
            erroGerarJuros:
          "Errore nella generazione del boleto, gli interessi non possono superare il 3% mensile.",
          vencido: "Échu",
emAberto: "En suspens",
pagoEm: "Payé : %{dataPago}",
pago: "Payé",
nenhumBoleto: "Aucun bulletin trouvé",
dataFinal: "Date Finale",
nenhumArquivo: "Aucun fichier trouvé",
formatoInvalido: "Format de fichier non valide",
erroCSV: "Erreur dans le CSV, vérifiez : %{erroMsg}",
analiseCSV: "CSV en analyse, procédez dans Gestion des Lots",
escolhaCSV: "Sélectionnez un fichier CSV",
nenhumFavorecido:
  "Vous n'avez aucun bénéficiaire enregistré. Enregistrez-en un pour générer votre bulletin.",
cobranca: "Recouvrement",   
  },

  pagar: {
    linhaDigital: "Ligne Digitale",
    btnConsultar: "Consulter",
    dadosBoleto: "Données du billet : ",
    favorecido: "Bénéficiaire : ",
    valorDocumento: "Valeur du Document : ",
    desconto: "Remise : ",
    jurosMora: "Intérêts/Retard : ",
    multa: "Amendes : ",
    totalEncargo: "Total des Charges : ",
    vencimento: "Échéance : ",
    totalPagar: "Total à Payer : ",
    codigoBarras: "Code-barres : ",
    btnVoltar: "Retour",
    btnProximo: "Suivant",
    titleModalValidacao: "Authentification à deux facteurs",
    textModalValidacao:
      "Entrez votre mot de passe et accédez à votre compte %{nome_banco} sur votre appareil pour valider votre clé d'accès.",
    tokenValidacao: "Jeton",
    titleSenha: "Mot de passe",
    textSenha: "Entrez votre mot de passe",
    titleToken: "Jeton",
    textTokenDescr:
      "Entrez le jeton généré par votre clé d'accès dans votre application.",
    btnPagar: "Payer",

    diaUtil: "Le paiement ne peut être effectué que les jours ouvrables.",
    foraHorario: "Paiement en dehors des heures autorisées.",
    invalido: "Code-barres invalide",
    boletoPropria: "Il n'est pas permis de payer un billet de %{nome_banco} lui-même.",
    saldoInsuficiente: "Solde insuffisant",
    erroSenha: "Erreur de mot de passe ou jeton invalide",
    sucesso: "Paiement effectué avec succès.\nVérifiez vos reçus.",
    tente: "Impossible de compléter le paiement.\nVeuillez réessayer plus tard.",
    pagar: "Payer",
},
perfil: {
    dadosPessoais: "Données Personnelles",
    celular: "Téléphone Portable",
    estadoCivil: "État Civil",
    documento: "Numéro Fiscal/Numéro de TVA",
    cep: "Code Postal",
    endereco: "Adresse",
    numero: "Numéro",
    completo: "Complément",
    bairro: "Quartier",
    cidade: "Ville",
    estado: "Province",
},
    
qrcode: {
    qrCode: "Code QR",
    textQRCode:
      "Ceci est votre Code QR de %{nomeBanco}, montrez-le ou téléchargez-le et imprimez-le pour permettre aux gens d'effectuer des paiements vers vous.",
    btnQRCOde: "Télécharger le Code QR",
  },

  transferencia: {
    btnEntraContas: "Comptes %{nome_banco}",
    btnParaOutros: "Autres Banques",
    btnLote: "En Lot (%{nome_banco})",
    textInterna:
      "Choisissez comment transférer entre les comptes de %{nome_banco}",
    btnBuscarConta: "Rechercher par Compte",
    btnBuscarTelefone: "Rechercher par Téléphone",
    btnBuscarDocumento: "Rechercher par NIF/CIF",
    textTelefone: "Téléphone",
    btnPesquisar: "Rechercher",
    btnFechar: "Fermer",
    textDocumento: "NIF/CIF",
    textAgencia: "Agence",
    textConta: "Compte",
    textDigito: "Chiffre",
    textSelecionarConta: "Sélectionnez le compte ci-dessous",
    nomeConta: "Nom :",
    agenciaConta: "Agence :",
    contaConta: "Compte :",
    textDadosFavorecido: "Données du Bénéficiaire :",
    saldo: "Solde",
    valor: "Montant €",
    titleLote:
      "Téléchargez le fichier CSV pour effectuer un transfert interne en lot",
    textLote: "Fichier CSV",
    textEscolhaLote: "Choisissez un fichier .CSV",
    btnVerificarLote: "Vérifier",
    btnDownLote: "Télécharger un exemple .CSV",
    titleTransfOutros:
      "Complétez les Champs pour effectuer le Virement vers d'autres Banques",
    textBanco: "Banque *",
    selectBanco: "Sélectionnez la Banque à laquelle vous souhaitez transférer",
    textOutrosBancos: "Autres Banques",
    agenciaTransfOutros: "Agence *",
    digAgTransfOutros: "Chiffre",
    contaTransfOutros: "Compte *",
    digitoTransfOutros: "Chiffre *",
    tipoConta: "Type de Compte *",
    selecTipoConta: "Sélectionnez le Type de Compte",
    pesquisarBanco: "Rechercher : ",
    documentoTransfOutros: "NIF/CIF *",
    favorecidoTransfOutros: "Bénéficiaire *",
    valorTransfOutros: "Montant *",
    finalidadeTransfOutros: "Finalité *",
    selectFinalidadeTransfOutros: "Sélectionnez la Finalité",
    tranfDescrOutros: "Les champs marqués avec * sont obligatoires !",
    titleConfirmeDados: "Confirmez les Données pour effectuer le virement",
    bancoConfirmeDados: "Banque : ",
    contaConfirmaDados: "Compte : ",
    agenciConfirmeDados: "Agence : ",
    digitoConfirmeDados: "Chiffre : ",
    tipoContaConfirmeDados: "Type de Compte : ",
    documentoConfirmeDados: "NIF/CIF : ",
    favorecidoConfirmeDados: "Bénéficiaire : ",
    valorConfirmeDados: "Montant : ",
    btnCancelar: "Annuler",
    
    
    btnTransferir: "Transférer",
titleModalValidacao: "Authentification à deux facteurs",
textModalValidacao:
  "Entrez votre mot de passe et accédez à votre compte %{nome_banco} sur votre appareil pour valider votre clé d'accès.",
tokenValidacao: "Jeton",
titleSenha: "Mot de passe",
textSenha: "Entrez votre mot de passe de transfert",
titleToken: "Jeton",
textTokenDescr: "Entrez le jeton envoyé à votre adresse e-mail",

erroSenha: "Erreur de mot de passe ou jeton invalide",
sucesso: "Transfert effectué avec succès.",
analise: "Transfert en cours d'analyse pour des raisons de sécurité.",
erroTransferencia: "Impossible de compléter le transfert",
erroNumero: "Aucun compte trouvé avec ce numéro",
erroDoc: "Aucun compte trouvé avec ce document",
funcionalidade:
  "Cette fonctionnalité n'est pas activée. Pour l'activer, veuillez contacter les canaux suivants : %{email_banco} %{telefone_banco}",
formatoInvalido: "Format de fichier invalide",
escolhaCSV: "Sélectionnez un fichier CSV",
erroCSV: "Erreur dans le CSV, veuillez vérifier : %{erroMsg}",
sucessoVerifique:
  "Transfert effectué avec succès ! Veuillez vérifier l'extrait.",
  escolhaBanco: "Sélectionnez la banque",
digiteAgencia: "Saisissez l'agence",
digiteConta: "Saisissez le compte",
digiteDigito: "Saisissez le chiffre",
escolhaTipo: "Sélectionnez le type de compte",
erroCPF: "NIF invalide",
erroCNPJ: "CIF invalide",
digiteCPF: "Saisissez le NIF ou CIF",
digiteFavorecido: "Saisissez le nom du bénéficiaire",
digiteValor: "Saisissez le montant",
finalidade: "Sélectionnez l'objectif",
erroSaldo: "Solde insuffisant",
credito: "Crédit en compte",
pagarAluguel: "Paiement de loyer/condominium",
pagarTitulos: "Paiement de duplicata/titres",
pagarDividendos: "Paiement de dividendes",
pagarMensalidade: "Paiement de frais de scolarité",
pagarSalario: "Paiement de salaires",
pagarFornecedor: "Paiement de fournisseurs/honoraires",
operacoes: "Opérations de change/fonds/bourse",
repasse: "Collecte/Taxes",
internacional: "Virement international en euros",
docPoupanca: "DOC pour épargne",
docDeposito: "DOC pour dépôt judiciaire",
outros: "Autres",
bolsa: "Paiement de bourse",
remuneracao: "Rémunération du coopérateur",
contaCorrente: "Compte courant",
contaPoupanca: "Compte d'épargne",
digiteNumeroConta: "Saisissez le numéro de compte",
transferencia: "Transfert",
loteCod304: "Le numéro de banque est incorrect. '000' était attendu.",
loteCod301: "Le compte fourni est introuvable. Veuillez vérifier.",
loteCod302: "Des données sont manquantes dans l'enregistrement. Vérifiez les champs obligatoires.",
loteCod303: "La valeur ne peut pas être zéro. Saisissez une valeur valide.",
loteCod305:
  "L'agence fournie ne correspond pas au compte fourni. Vérifiez les données.",
loteCod306:
  "Le document fourni n'est pas lié au compte fourni. Vérifiez les données.",
loteCod307:
  "Le fichier CSV contient des champs manquants ou désordonnés. Veuillez ajuster le fichier.",
semErro: "Aucune erreur",
},

escolher_cartao: {
    ativar: "Activer la Carte",
    carregar1: "Charger la Carte",
    alterarSenha: "Changer le Mot de Passe",
    detalhes: "Détails",
    aquisicao: "• Tous les avantages en un seul clic !",
    aquisicaoDesc1:
      "Pour acquérir votre carte %{nome_banco}, des frais uniques de %{tarifa} € seront facturés et débités de votre compte digital. Pour cela, vous devez disposer d'un solde sur votre compte.",
    selecao:
      "Sélectionnez la couleur de votre choix pour votre carte %{nome_banco}",
      termos: "Lisez les conditions d'utilisation",
      confirme: "Pour activer votre carte %{nome_banco}, confirmez quelques informations :",
    nome: "Nom : ",
    telefone: "Téléphone : ",
    textoDescricao:
      "Si les informations ne sont pas correctes, contactez le support %{nome_banco} à %{email_banco}",
    token:
      "Entrez le code d'activation du Jeton, envoyé par SMS à votre mobile",
    instrucoes:
      "Saisissez le code de la carte, situé au-dessus du numéro de la carte et en dessous de la date d'expiration",
    entrar: "Entrez les 4 derniers chiffres de votre carte %{nome_banco}",
    criarSenha:
      "Créez un mot de passe d'accès de 4 chiffres pour votre carte %{nome_banco}",
    desbloqueio:
      "Félicitations ! Votre carte %{nome_banco} a été débloquée avec succès. Profitez-en !",
    carregar: "Comment souhaitez-vous charger votre carte ?",
    transferencia: "Virement",
    boleto: "Générez une facture pour recharger votre carte",
    valorBoleto: "Montant de la Facture",
    vencimento: "Échéance",
    transferenciaRapida: "Transfert rapide entre cartes.",
    codigo: "Entrez le code d'identification de votre carte, qui se trouve juste en dessous de la date d'expiration.",
    mostrarValor: "Combien souhaitez-vous transférer à %{nome_cartao} ?",
    valor: "Montant €",
    senha: "Mot de passe",
    boletoGerado: "Boleto généré avec succès !",
    pagador: "Payeur",
    nossoNumero: "Notre numéro",
    emissao: "Émission",
    validade: "Validité",
    codigoBarras: "Code-barres",
    bloquear: "Ici, vous pouvez bloquer ou débloquer votre carte %{nome_banco}",
    cartao: "Carte : ",
    id: "ID : ",
    status: "Statut : ",
    solicitar: "Demander une carte",
},

ajustes: {
    ola: "Bonjour, Bienvenue à %{nome_banco}",
    manutencao:
      "L'Internet Banking de %{nome_banco} est actuellement en maintenance !",
    retornaremos: "Nous reviendrons bientôt à un fonctionnement normal.",
    info: "Pour plus d'informations, veuillez contacter notre centre d'aide : ",
  },

  servicos: {
    recarregueApp: "Rechargez vos applications facilement et rapidement",
    recarregueCel: "Rechargez votre mobile ou téléphone fixe facilement et rapidement",
    cel: "Numéro de Téléphone",
    recarregueSer: "Rechargez vos services de divertissement facilement et rapidement.",
    recarregueGames: "Rechargez vos jeux facilement et rapidement",
    tituloTel: "Recharge de Téléphone",
    tituloEntr: "Divertissement",
    tituloGames: "Jeux",
    tituloApps: "Applications",
  },

  siso: {
    produtos: "Nos Produits",
    realizar:
      "Voulez-vous réaliser un projet ou un rêve ? Voyager, vous marier, étudier, rénover votre maison ou même investir dans votre entreprise. Nous pouvons vous aider à réaliser ce rêve !",
    pf: "Personne Physique",
    pj: "Personne Juridique",
    cpf: "Pour continuer, nous avons besoin que vous complétiez votre CPF",
    continuar: "Continuer",
    cnpj: "Pour continuer, nous avons besoin que vous complétiez le CNPJ de votre entreprise",
    nomeEmpresa: "*Nom de l'Entreprise :",
    digiteNomeEmpresa: "Entrez le Nom de l'Entreprise",
    emailEmpresa: "Courriel de l'Entreprise :",
    digiteEmailEmpresa: "Entrez le Courriel de l'Entreprise",
    cel: "Téléphone Portable :",
    valorDesejado: "*Montant Souhaité :",
    valorMedio: "*Valeur Moyenne des Titres :",
    quantidadeTil: "*Quantité Moyenne de Titres",
    quantidadeSacados: "*Quantité Moyenne de Débiteurs",
    prazo: "*Délai (Jours) :",
    simular: "Simuler",
    nomeDeEmpresa: "Nom de l'Entreprise",
    cnpjLabel: "CNPJ",
    dataSimulacao: "Date de Simulation",
    valorSolicitado: "Montant Demandé €",
    quantidadeTitulos: "Nombre de Titres",
    valorMedio2: "Valeur Moyenne des Titres €",
    prazoMedio: "Délai Moyen en Jours",
    quantidadeSacados2: "Nombre de Tirés",
    valorLiberado: "Montant Libéré €",
    taxa: "Taux d'Intérêt Mensuel %",
    iof: "IOF €",
    cet: "CET %",
    pdf: "Télécharger le PDF de Simulation",
    refazer: "Refaire la Simulation",
    aprovar: "Approuver la Simulation",
    interessado:
      "Intéressé par nos produits ? Profitez-en pour installer notre application en choisissant la boutique disponible sur votre appareil mobile et en scannant le Code QR.",
    solicitacoes: "Des demandes ont déjà été effectuées auparavant",
    dataSimulacao2: "Date de Simulation :",
    valorDesejado2: "Montant à Créditer :",
    obrigado: "Merci d'avoir Approuvé la Simulation !",
    aproveite: "Profitez-en pour ouvrir un compte dans notre Banque Digitale.",
  },

  sidebar: {
    home: "Accueil",
    extrato: "Extrait",
    transferencia: "Transfert",
    deposito: "Dépôt",
    comprovantes: "Reçus",
    pagamento: "Paiement",
    cobranca: "Facturation",
    pix: "Pix",
    servico: "Services",
    cartoes: "Cartes",
    qrcode: "Code QR",
    tarifas: "Tarifs",
    gratuito: "Gratuit/Mois : ",
    tarifaTitulo: "Tarifs Compte Numérique",
    tarifaCol: "Tarif",
    tarifaValor: "Valeur",
    tarifaFechar: "Fermer",
    senha: "Mots de passe",
    cambio: "Change",
    relatorio: "Rapport",
},

header: {
    ola: "Bonjour, ",
    conta: "C/C: ",
    agencia: "Ag: ",
    empresa: "Entreprise: ",
    perfil: "Profil",
    nenhumaNotif: "Pas de nouveaux messages",
    lidoNotif: "Marquer comme lu",
    cancelarNotif: "Annuler",
    sair: "Quitter",
  },

  senha: {
    senhaTitle: "Mot de Passe",
    senhaLogin: "Mot de Passe de Connexion",
    senhaTransfer: "Mot de Passe de Transaction",
    token: "Jeton Envoyé à Votre Adresse Électronique",
    senhaNova: "Nouveau Mot de Passe",
    senhaTransferNova: "Nouveau Mot de Passe de Transaction",
    alertSemSenha: "Il est obligatoire de remplir le mot de passe pour continuer",
    alertSemToken: "Il est obligatoire de remplir le jeton pour continuer",
    alertSenhaAlteradaComSucesso: "Mot de passe changé avec succès !",
    alertErroAlterarSenha:
      "Erreur lors du changement de mot de passe, veuillez réessayer plus tard",
  },

  relatorio: {
    relatorio: "Rapport",
    relatorioPixOut: "Rapport de Sortie Pix",
    relatorioPixIn: "Rapport d'Entrée Pix",
    relatorioCrypto: "Rapport Crypto",
    dataDe: "Date de Début:",
    dataAte: "Date de Fin:",
    customId: "ID Personnalisé",
    endtoend: "De Bout en Bout",
    nome: "Nom",
    status: "Statut",
    alertPesquisa: "Sélectionnez la période pour rechercher",
    semRelatorio: "Aucun rapport pendant cette période",
    concluido: "Terminé",
    estornado: "Remboursé",
    analise: "En Analyse",
    movimentacao: "Mouvements",
    datahora: "Date et Heure",
    valCotacao: "Valeur de Cotation du Dollar",
    valReal: "Valeur Réelle",
    moeda: "Monnaie",
  },

  cambio: {
    cambiotitle: "Échange",
    moeda: "Monnaie : ",
    saldo: "Solde : ",
    comprarMoeda: "Acheter de la Monnaie",
    saqueMoeda: "Retirer de la Monnaie",
    escolherMoeda: "Sélectionner une Monnaie",
    valDsj: "Valeur Désirée",
    valMoeda: "Valeur de la Monnaie",
    valLqd: "Valeur Nette",
    taxa: "Taux",
    tarifa: "Frais",
    totalPagar: "Total à Payer",
    senhaTransfer: "Mot de Passe de Transaction",
    confirmCompra: "Confirmer l'Achat",
    campos: "Veuillez remplir les champs pour continuer",
    limit: "La valeur minimale d'achat est de 10 000",
    timeLimite:
      "Temps minimum pour fixer le taux de 1 minute, veuillez réessayer",
    erroTravar:
      "Erreur lors de la fixation du taux, veuillez réessayer plus tard ou contacter le gestionnaire",
    verifiqueParam: "Veuillez vérifier les paramètres et réessayer",
    senhaInformer:
      "Il est nécessaire de fournir le mot de passe de transaction pour acheter",
      senhaIncorreta: "Mot de passe incorrect",
      informeCarteira: "Veuillez indiquer le portefeuille pour le retrait",
      informeValorSaque: "Entrez un montant de retrait valide",
      informeMoedaSaque: "Sélectionnez une devise pour le retrait",
      informeSenhaSaque: "Entrez le mot de passe pour effectuer le retrait",
      saqueSuccess: "Retrait en cours. Vérifiez le rapport de retrait",
      saqueCod101: "Mot de passe incorrect, veuillez réessayer",
      saqueCod105:
        "Paramètres insuffisants, vérifiez les champs et réessayez",
      saqueCod2:
        "Solde insuffisant pour le retrait, effectuez un achat pour pouvoir retirer plus que le solde disponible",
      saquecod104:
        "Erreur lors de la finalisation du retrait, réessayez plus tard ou contactez le gestionnaire",
      sacar: "Retirer",
      valSaque: "Montant du Retrait",
      carteiraSaque: "Portefeuille Crypto",
      carregando: "Chargement...",
      placeholderSaque: "Complétez le portefeuille pour le retrait",
      erroCompra:
        "Erreur lors de l'achat, réessayez plus tard ou contactez le gestionnaire",
      compraSuccess: "Achat effectué avec succès",
  },

  pix: {
    emailFail: "E-mail invalide",
    dgtChave: "Entrez la clé Pix",
    chaveFail: "Clé Pix introuvable",
    qrCodeFail: "Clé introuvable",
    saldoInsuficiente: "Solde insuffisant",
    pixCod0:
      "PIX NON DISPONIBLE. Veuillez patienter quelques minutes et réessayez. Si le problème persiste, contactez le support client.",
    pixCod1: "Pix effectué avec succès !",
    pixCod3: "Pix non réalisé, veuillez consulter votre gestionnaire",
    pixCod7: "Un problème est survenu lors de la génération du Pix, veuillez réessayer plus tard",
    pixCod9: "Pix non réalisé, veuillez réessayer plus tard",
    pixCod10:
      "Le système a détecté plusieurs tentatives de transfert sur une courte période. Veuillez patienter quelques minutes et réessayez.",
    pixCod100: "Mot de passe de transaction invalide",
    agendarPixSucces: "Le Pix sera effectué dans un délai d'une heure",
    msgChave: "Saisissez la ",
    msgCell: "Saisissez le numéro de téléphone",
    msgEmail: "Saisissez l'e-mail",
    msgChaveRandom: "Saisissez ou collez la clé aléatoire",
    msgCopy: "Collez le Pix ici",
    celular: "Téléphone portable",
    email: "E-mail",
    chaveRandom: "Clé aléatoire",
    copyPaste: "Copier et coller",
    pagar: "Payer",
    receber: "Recevoir",
    gerarQrCode: "Générer un QR Code",
    modoPix: "Méthode Pix",
    pesquisar: "Rechercher",
    transferPix: "Transfert Pix",
    favorecido: "Bénéficiaire :",
    banco: "Banque : ",
    agConta: "Agence et Compte :",
    doc: "Document :",
    chavePix: "Clé Pix :",
    valPix: "Montant du Pix :",
    msg: "Message (optionnel) :",
    dgtSenha: "Saisissez votre mot de passe de transaction",
    tokenPix: "Saisissez le jeton envoyé par e-mail",
    btnTransfer: "Transférer",
    receberPix: "Recevoir un Pix",
    selectKey: "Sélectionner une clé",
    notKey: "Vous n'avez pas encore de clé enregistrée",
    valorQrCode: "Montant : ",
    nomePagador: "Nom du payeur",
    docPagador: "Document du payeur",
    btnGerarQrCode: "Générer un QR Code",
    qrCodeSucces: "QR Code généré avec succès",
    coyCod: "Copier le code",
    tokenInvalido: "Jeton invalide",
    erro: "erreur",
},

};