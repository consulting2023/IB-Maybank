import i18n from "i18n-js";
import ptBr from "./pt-BR";
import chCh from "./ch-CH";
import enUS from "./english";
import esPN from "./spanish";
import italian from "./italian";
import french from "./french";

const langArr = [ptBr, chCh, enUS, esPN, italian, french];

for (var i = 0, len = langArr.length; i < len; i++) {
  i18n.translations[langArr[i].langInfo.sigla] = langArr[i];
}

const setLanguageToI18n = async () => {
  i18n.defaultLocale = langArr[0].langInfo.sigla;

  let langCode = localStorage.getItem("lang");
  langArr.filter((e) => e.langInfo.sigla === langCode).length < 1 &&
    (langCode = langArr[0].langInfo.sigla);
  localStorage.setItem("lang", langCode);
  i18n.locale = langCode;
};

setLanguageToI18n();

export default i18n;
