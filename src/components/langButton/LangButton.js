import React, { Component } from "react";
import "../../templates/style_langButton.scss";
import { Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Icons from '../../constants/Icon';
import i18n from '../../tradutor/tradutor';

export default class LangButton extends Component {

  setLangArr = async () => {
    let langArr = [];
    const langObj = Object.keys(i18n.translations);

    for (var i = 0, len = langObj.length; i < len; i++) {
      let nextLangCode = (i+1);
      (nextLangCode >= langObj.length) && (nextLangCode = 0);
      const nextLang = i18n.translations[langObj[nextLangCode]].langInfo.key;

      langArr.push({
        currentLang: langObj[i],
        nextLang: langObj[nextLang]
      })
    }
    return langArr;
  }

  traduzir = async (lang) => {
    let langArr = (await this.setLangArr()).find(el => {
      if(el.currentLang == lang) return el;
    });

    const nextLang = langArr.nextLang;

    i18n.locale = nextLang;
    localStorage.setItem('lang', nextLang);
    this.props.langProp(nextLang);
  }

  render() {
    return (
      <div className="langBtnWrapper">
        <div className="flip-btn">
          <div className="flip-btn-inner">
            <div className="flip-btn-front">
              {Icons.langsIcon}
            </div>
            <div className="langBtn"
              onClick={() => this.traduzir(i18n.currentLocale())}
            >
              <Image className="langImg" src={i18n.t('langInfo.bandeira')} />
            </div>
          </div>
        </div>
        <span className="langLabel"> {i18n.t('langInfo.titulo')} </span>
      </div>
    );
  }
}
