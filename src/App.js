import React from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faMinusSquare, faPlusSquare, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';

let now = new Date();

class App extends React.Component {
  
  state = {
    selectedDate: now,
    selectedDateString: this.getYearMonthDayString(now),
    fieldDefinitions: {
      "Tracked Number 1": {
        type: "number"
      },
      "Tracked Number 2": {
        type: "number"
      }
    },
    data: {
      "2020-1-25": {
        "Tracked Number 1": 5,
        "Tracked Number 2": 3
      }
    }
  };

  getYearMonthDayString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "-" + month + "-" + day;
  }

  sendDataUpdate = (data) => {
    return null;
  }
 
  handleDateChange = date => {
    console.log(date);
    console.log(typeof(date));
    let selectedDateString = this.getYearMonthDayString(date);
    this.setState({
      selectedDate: date,
      selectedDateString: selectedDateString
    });
  };

  initializeDataForDate = (dateString, field, value) => {
    let tempObject = {};
    for (var key of Object.keys(this.state.fieldDefinitions)) {
      if (key === field) {
        tempObject[key] = value;
      }
      else if (this.state.fieldDefinitions[key].type === "number") {
        tempObject[key] = 0;
      }
    }
    let newData = Object.assign({}, this.state.data);
    newData[dateString] = tempObject;
    this.setState({
      data: newData
    });
  }

  stepUp = event => {
    let field = event.currentTarget.value;
    //if our data doesn't have an entry for this date, create it
    if (!this.state.data.hasOwnProperty(this.state.selectedDateString)) {
      this.initializeDataForDate(this.state.selectedDateString, field, 1);
    }
    else {
      let currentData = this.state.data;
      currentData[this.state.selectedDateString][field] = currentData[this.state.selectedDateString][field] + 1;
      this.setState({
        data: currentData
      });
      this.sendDataUpdate(currentData);
    }
  }

  stepDown = event => {
    let field = event.currentTarget.value;
    //if our data doesn't have an entry for this date, create it
    if (!this.state.data.hasOwnProperty(this.state.selectedDateString)) {
      this.initializeDataForDate(this.state.selectedDateString, field, 0);
    }
    //we have the date
    else {
      let currentData = this.state.data;
      if (currentData[this.state.selectedDateString][field] > 0) {
        currentData[this.state.selectedDateString][field] = currentData[this.state.selectedDateString][field] - 1;
      }
      this.setState({
        data: currentData
      });
      //probably should move this to componentWillUpdate or something
      this.sendDataUpdate(currentData);
    }
  }

  dateStepUp = () => {
    var newDate = new Date(this.state.selectedDate);
    newDate.setDate(newDate.getDate()+1);
    this.handleDateChange(newDate);
  }

  dateStepDown = () => {
    var newDate = new Date(this.state.selectedDate);
    newDate.setDate(newDate.getDate()-1);
    this.handleDateChange(newDate);
  }


  createListGroupItem = field => {
    if (!this.state.fieldDefinitions.hasOwnProperty(field)) {
      return;
    }
    let fieldType = this.state.fieldDefinitions[field].type;
    var inputGroup = <></>;
    if(fieldType === "number") {
      inputGroup = 
      <InputGroup>
        <InputGroup.Prepend>
          <Button variant={"dark"} value={field} onClick={this.stepDown}>
            <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
          </Button>
        </InputGroup.Prepend>
        <Form.Control type="number" placeholder="0" value={
          this.state.data.hasOwnProperty(this.state.selectedDateString) ? 
          this.state.data[this.state.selectedDateString][field] : 0
        }/>
        <InputGroup.Append>
          <Button variant={"dark"} value={field} onClick={this.stepUp}>
            <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
          </Button>
        </InputGroup.Append>
      </InputGroup>;
    }
    
    return(
      <ListGroup.Item key={field}>
        <Form.Group as={Row}>
          <Col xs={5}>
          <Form.Label>
            {field}
          </Form.Label>
          </Col>
          <Col xs={7}>
            {inputGroup}
          </Col>
        </Form.Group>
      </ListGroup.Item>
    )
  }

  render() {
    return (
      <div className="App">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">Trackr</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        {/*Date Picker Row*/}
        <Row>
          <Col>
            <FontAwesomeIcon className={"dateLeft"} icon={faChevronCircleLeft} onClick={this.dateStepDown}/>
            <DatePicker selected={this.state.selectedDate} onChange={this.handleDateChange}></DatePicker>
            <FontAwesomeIcon className={"dateRight"} icon={faChevronCircleRight} onClick={this.dateStepUp}/>
          </Col>
        </Row>
        {/*Card row*/}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <span className={"float-left"}>Your Life</span>
                <Button variant="dark" className={"float-right"}>
                  <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </Button>
              </Card.Header>
              <ListGroup variant="flush">
                { this.state.data[this.state.selectedDateString] ?
                Object.keys(this.state.data[this.state.selectedDateString]).map(this.createListGroupItem) : 
                Object.keys(this.state.fieldDefinitions).map(this.createListGroupItem) }  
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
