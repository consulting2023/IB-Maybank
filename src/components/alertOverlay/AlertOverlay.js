import React, { Component } from "react";
import { Alert, Container, Row } from "react-bootstrap";
import '../../templates/style_alerts.scss';

export default class AlertOverlay extends Component {
  render() {
    return (
      <Container fluid className="overlay position-absolute">
        <Row className='alertWrapper position-fixed max-vh-100 d-flex flex-wrap'>
          {this.props.alerts.map(alert => (
            <Alert key={alert.key} show={alert.show} variant={alert.type} onClose={ () => this.props.closeProp(alert.key)} transition={true} dismissible>
              <Alert.Heading>{alert.title}</Alert.Heading>
              <p>{alert.text}</p> 
            </Alert>
          ))}
        </Row>
      </Container>
    );
  }
}
