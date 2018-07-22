import React, { Component } from 'react';
import './App.css';
import './index.css';
import Main from './components/Main';
import SideBar from './components/SideBar';
import { Container, Row, Col } from 'reactstrap';
import 'regenerator-runtime/runtime';



class App extends Component {


  render() {
    return (
      <Container className={"App"}>
      <Row> 
        <Col md="3" className={"side-bar"}>
          <SideBar/>
        </Col>
        
        <Col md="9" className={"content"}>
          <Main />
        </Col>
      </Row> 
      </Container>
    );
  }
}

export default App;
