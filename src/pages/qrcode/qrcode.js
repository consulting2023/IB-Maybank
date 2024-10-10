import React, { Component } from 'react';
import { Container, Row, Image, Col, Button } from 'react-bootstrap';
import * as Funcoes from '../../constants/Funcoes';
import "bootstrap/dist/css/bootstrap.min.css";
import '../../templates/style_qrcode.scss';
import i18n from '../../tradutor/tradutor';

export default class QRCode extends Component {
    constructor(props) {
        super(props);
        const pessoa = Funcoes.pessoa;
        this.state = {
            imgSelfie: pessoa.image_home,
            nome: pessoa.nome,
            qr_code: '',
            conta_id: pessoa.conta_id
        };
    }

    componentDidMount = () => {
        this.qrCode()
    }

    qrCode = () => {
        const dados = {
            url: 'conta/get-qrcode',
            data: {
                "conta_id": this.state.conta_id
            },
            method: 'POST',
        };
        Funcoes.Geral_API(dados, true).then((res) => {
            console.log(res);

            const image = `data:image/png;base64,${res}`;

            this.setState({ qr_code: res });
        });
    }

    baixar_qrcode = () => {
        const linkSource = `data:image/png;base64,${this.state.qr_code}`;
        const downloadLink = document.createElement("a");
        const fileName = i18n.t('qrcode.qrCode') + ".png";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    render() {
        return (
            <section className="infoPerfil">
                <br /><br />
                <Container className="container{i18n.t('qrcode.qrCode')}">
                    <br />
                    <Row>
                        <Col className="col-12">
                            <h3>{i18n.t('qrcode.qrCode')}</h3>
                            <hr />

                        </Col>
                    </Row>
                    <Row>
                        <Col md="4">
                            <Image className="qrCode" src={`data:image/png;base64,${this.state.qr_code}`} />
                        </Col>
                        <Col md="8" >
                            <h2>{i18n.t('qrcode.qrCode')}</h2>
                            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                            <Button className="btn{i18n.t('qrcode.qrCode')}" onClick={() => this.baixar_qrcode()}>{i18n.t('qrcode.btnQRCOde')}</Button>
                        </Col>

                    </Row>

                </Container>
            </section>
        )
    }
}