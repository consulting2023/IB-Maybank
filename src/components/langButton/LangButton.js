import React, { Component } from "react";
// import "../../templates/style_langButton.scss";
import { 
  Image,
  Dropdown,
  DropdownButton
 } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Icons from '../../constants/Icon';
import i18n from '../../tradutor/tradutor';

export default class LangButton extends Component {

  traduzir = async (lang) => {
    i18n.locale = lang;
    localStorage.setItem('lang', lang);
    this.props.langProp(lang);
  }

  render() {
    const langs = i18n.translations;
    return (
      <div>
        <Dropdown>
          <Dropdown.Toggle style={{width: 70}}>

            <Image 
              className="langImg" 
              src={i18n.t('langInfo.bandeira')} 
              style={{ height: 30 }}
            />
            {/* <span className="mx-1">{ i18n.t('langInfo.titulo') }</span> */}


          </Dropdown.Toggle>
          
          <Dropdown.Menu>
            {
              Object.keys(langs).map(langSigla => (
                <Dropdown.Item
                  onClick={ () => this.traduzir(langSigla) }
                  key={langSigla}
                >
                  <Image 
                    className="langImg m-2" 
                    src={langs[langSigla].langInfo.bandeira} 
                    style={{ height: 30 }}
                  />
                  <span className="mx-1">{ langs[langSigla].langInfo.titulo }</span>

                  
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}
