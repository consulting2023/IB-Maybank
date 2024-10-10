import React, { Component } from 'react';
import '../../templates/style_comprovantes.scss';
import { Container, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import BannerTitle from '../../components/bannerTitle/bannerTitle';
import Objetos from '../../constants/Objetos';
import Produtos from '../../constants/Produtos';
import * as Iconio5 from "react-icons/io5";
import * as Iconmd from "react-icons/md";
import * as Iconai from "react-icons/ai";
import * as Iconfa from "react-icons/fa";
import * as Funcoes from '../../constants/Funcoes';
import i18n from '../../tradutor/tradutor';
export default class Comprovante extends Component {

    constructor() {
        super();
        this.state = {
            confirmShow: false,
            handleConfirmClose: false,
            handleConfirmShow: '',
            loading: false,

        };
    }

    consulta_interna_cartao = () => {
        const data = {
            url: 'cartao/consultar',
            data: {
                'conta_id': Funcoes.pessoa.conta_id
            },
            method: 'POST',
        };

        Funcoes.Geral_API(data, true).then((res) => {

            if (res[0]) {
                window.location.href = '/extrato_cartao';
            } else {
                // alert("Você não tem um cartão ativo.")
                alert(i18n.t('comprovante.nenhumCartao'))
            }
        })
    }



    render() {
            return (
                <>
                    <BannerTitle title={i18n.t('comprovante.comprovantes')} img={Objetos.comprovanteImg}/>
    
                    <Container fluid className="mt-4 d-flex justify-content-center" >
                        <Col className="col-12 text-center">
                            <Link
                                to='/comprovantes_conta'
                                className="btn btn-primary comprovanteEscolha"
                                style={{}} >
                                <Icon.CashCoin className="iconComprovante"
                                    style={{}} />
                                <p className="tituloBotoes">
                                    <br></br>
                                    {i18n.t('comprovante.compDigital')}
                                </p>
                            </Link>
                            {Produtos.comprovantesCartao &&
                                <Button
                                    /* to='/comprovantes_cartao' */
                                    onClick={() => this.consulta_interna_cartao()}
                                    className="btn btn-primary comprovanteEscolha"
                                    style={{}} >
                                    <Icon.CreditCard className="iconComprovante"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('comprovante.compCartao')}
                                    </p>
                                </Button>
                            }
    
                            {Produtos.comprovantesConvenio &&
                                <Link
                                    to='/comprovantes_convenio'
                                    className="btn btn-primary comprovanteEscolha"
                                    style={{}} >
                                    <Iconio5.IoBarChart className="iconComprovante"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('comprovante.compConvenio')}
                                    </p>
                                </Link>
                            }
                            {Produtos.comprovantesServicos &&
                                <Link
                                    to='/comprovantes_servicos'
                                    className="btn btn-primary comprovanteEscolha"
                                    style={{}} >
                                    <Iconmd.MdCardTravel className="iconComprovante"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('comprovante.compServicos')}
                                    </p>
                                </Link>
                            }
                            {Produtos.comprovantesParcelado &&
                                <Link
                                    to='/comprovantes_parcelado'
                                    className="btn btn-primary comprovanteEscolha"
                                    style={{}} >
                                    <Iconai.AiOutlineBarcode className="iconComprovante"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('comprovante.compParcelado')}
                                    </p>
                                </Link>
                            }
                            
                            {Produtos.comprovantesInvestimento &&
                                <Link
                                    to='/comprovantes_investimento'
                                    className="btn btn-primary comprovanteEscolha"
                                    style={{}} >
                                    <Iconfa.FaHandshake className="iconComprovante"
                                        style={{}} />
                                    <p className="tituloBotoes">
                                        <br></br>
                                        {i18n.t('comprovante.compInvestimento')}
                                    </p>
                                </Link>
                            }
                        </Col>
                    </Container>
                </>
            )
    }
}