import React, { Component } from 'react';
import { Container, Row, Image, Col } from 'react-bootstrap';
import * as Funcoes from '../../constants/Funcoes';
import "bootstrap/dist/css/bootstrap.min.css";
import '../../templates/style_perfil.scss';
import i18n from '../../tradutor/tradutor';

export default class Perfil extends Component {
    constructor(props) {
        super(props);
        const pessoa = Funcoes.pessoa;
        this.state = {
            nome: pessoa.nome,
            celular: pessoa.celular,
            cpf: pessoa.cpf_cnpj,
            imgSelfie: pessoa.image_home,
            civil: pessoa.estado_civil,
            cep: pessoa.cep,
            endereco: pessoa.endereco,
            numero: pessoa.numero,
            complemento: pessoa.complemento,
            bairro: pessoa.bairro,
            cidade: pessoa.cidade,
            estado: pessoa.estado,
        };
    }
    componentDidMount = () => {
        
    }

    render() {
        return (
            <section className="infoPerfil">
                <br /><br />
                <Container className="containerPerfil">
                    <Row>
                        <Col className="col-2">
                            <Image style={{ width: "150px", height: '150px', }} src={'data:image/png;base64,' + this.state.imgSelfie} roundedCircle />
                        </Col>
                        <Col className="col-10">
                            <br /><br />
                            <h1 className="nomePerfil">{this.state.nome}</h1>
                        </Col>
                    </Row>
                    <br />

                    <br />
                    <Row>
                        <Col className="col-12">
                            <h3>{i18n.t('perfil.dadosPessoais')}</h3>
                            <hr />
                            <br />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.celular')}</h5>
                        </Col>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.estadoCivil')}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-6">
                            <h5>{this.state.celular}</h5>
                        </Col>
                        <Col className="col-6">
                            <h5>{this.state.civil}</h5>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.documento')}</h5>
                        </Col>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.cep')}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-6">
                            <h5>{this.state.cpf}</h5>
                        </Col>
                        <Col className="col-6">
                            <h5>{this.state.cep}</h5>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="col-12 title" >
                            <h5>{i18n.t('perfil.endereco')}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-12">
                            <h5>{this.state.endereco}</h5>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.numero')}</h5>
                        </Col>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.completo')}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-6">
                            <h5>{this.state.numero}</h5>
                        </Col>
                        <Col className="col-6">
                            <h5>{this.state.complemento}</h5>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="col-12 title">
                            <h5>{i18n.t('perfil.bairro')}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-12 ">
                            <h5>{this.state.bairro}</h5>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.cidade')}</h5>
                        </Col>
                        <Col className="col-6 title">
                            <h5>{i18n.t('perfil.estado')}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-6">
                            <h5>{this.state.cidade}</h5>
                        </Col>
                        <Col className="col-6">
                            <h5>{this.state.estado}</h5>
                        </Col>
                    </Row>
                </Container>
            </section>
        )
    }
}