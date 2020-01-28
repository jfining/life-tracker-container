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
import { faChevronCircleLeft, faMinusSquare, faPlusSquare, faEdit, faCheckSquare, faPlus, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';

class App extends React.Component {
  constructor(props) { 
    super(props);
    let now = new Date();
    let selectedDateString = this.getYearMonthDayString(now); 
    this.state = {
      selectedDate: now,
      editMode: false,
      selectedDateString: selectedDateString,
      fieldDefinitions: {
        "Tracked Number 1": {
          type: "number"
        },
        "Tracked Number 2": {
          type: "number"
        }
      },
      data: {},
      tempFieldDefinitions: {}
    };
  }

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
    let selectedDateString = this.getYearMonthDayString(date); 
    if (!this.state.data.hasOwnProperty(selectedDateString)){
      this.initializeDataForDate(selectedDateString, "", "")
    }
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
      if (!currentData[this.state.selectedDateString].hasOwnProperty(field)){
        currentData[this.state.selectedDateString][field] = 1;  
      }
      else {
        currentData[this.state.selectedDateString][field] = currentData[this.state.selectedDateString][field] + 1;
      }
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
      if (!currentData[this.state.selectedDateString].hasOwnProperty(field)){
        currentData[this.state.selectedDateString][field] = 0;  
      }
      else {
        if (currentData[this.state.selectedDateString][field] > 0) {
          currentData[this.state.selectedDateString][field] = currentData[this.state.selectedDateString][field] - 1;
        }
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

  createListGroupArray = () => {
    let listGroupArray = [];
    console.log(Object.keys(this.state.fieldDefinitions));
    for (var field of Object.keys(this.state.fieldDefinitions)) {
      let tempItem = this.createListGroupItem(field);
      listGroupArray.push(tempItem);
    }
    console.log(listGroupArray);
    return listGroupArray;
  }

  getDefaultForField = field => {
    if (this.state.fieldDefinitions[field].type === "number") {
      return 0;
    }
  }

  createListGroupItem = field => {
    if (!this.state.fieldDefinitions.hasOwnProperty(field)) {
      console.log("no field definition for: "+field);
      return;
    }
    let fieldType = this.state.fieldDefinitions[field].type;
    let inputGroup = <></>;
    if (!this.state.data.hasOwnProperty(this.state.selectedDateString)) {
      let inputGroup = <></>;
    }
    else if(fieldType === "number") {
      console.log("Field type is number");
      inputGroup = 
      <InputGroup>
        <InputGroup.Prepend>
          <Button variant={"dark"} value={field} onClick={this.stepDown}>
            <FontAwesomeIcon icon={faMinusSquare}></FontAwesomeIcon>
          </Button>
        </InputGroup.Prepend>
        <Form.Control type="number" placeholder="0" value={
          this.state.data[this.state.selectedDateString].hasOwnProperty(field) ? 
          this.state.data[this.state.selectedDateString][field] :
          this.getDefaultForField(field)
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

  toggleEditMode = event => {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  handleTempItemRemove = event => {
    let key = event.currentTarget.value;
    let tempCopy = Object.assign({}, this.state.tempFieldDefinitions);
    delete tempCopy[key];
    this.setState({tempFieldDefinitions: tempCopy});
  }

  renderTempListItem = key => {
    return(
      <ListGroup.Item key={key}>
        <Button variant="secondary" value={key} onClick={this.handleTempItemRemove}>
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
        </Button>
        <Form.Control required type="text" placeholder={"Name of your new tracked aspect"}
          value={this.state.tempFieldDefinitions[key].name}
          onChange={(event) => {
            let tempCopy = Object.assign({},this.state.tempFieldDefinitions);
            tempCopy[key]["name"] = event.target.value;
            this.setState({tempFieldDefinitions: tempCopy})
          }}>
        </Form.Control>
        <Form.Control required as="select" value={this.state.tempFieldDefinitions[key].type}
          onChange={(event) => {
            let tempCopy = Object.assign({},this.state.tempFieldDefinitions);
            tempCopy[key].type = event.target.value;
            this.setState({tempFieldDefinitions: tempCopy})
          }}>
          <option disabled value="">Select Type</option>
          <option value="number">Number</option>
        </Form.Control>
      </ListGroup.Item>
    )
  }

  createTempListItem = event => {
    let tempCopy = Object.assign({}, this.state.tempFieldDefinitions);
    let newId = new Date().getTime(); 
    tempCopy[newId] = {
      name: "",
      type: ""
    }
    this.setState({tempFieldDefinitions: tempCopy});
  }

  saveTempFields = () => {
    let fieldDefCopy = Object.assign({}, this.state.fieldDefinitions);
    for (var key of Object.keys(this.state.tempFieldDefinitions)) {
      fieldDefCopy[this.state.tempFieldDefinitions[key]["name"]] = {
        type: this.state.tempFieldDefinitions[key]["type"]
      };
    }
    this.setState({fieldDefinitions: fieldDefCopy, tempFieldDefinitions: {}});
    this.toggleEditMode();
  }

  componentDidMount() {
    this.initializeDataForDate(this.state.selectedDateString);
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
                {this.state.editMode ? 
                  <>
                  <Button form="tempFieldsForm" type="submit" variant="primary" className={"float-right"}>
                    <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                  </Button>
                  <Button variant="dark" className={"float-right"} onClick={this.toggleEditMode}>
                    Cancel
                  </Button>
                  </>
                  : 
                  <Button variant="dark" className={"float-right"} onClick={this.toggleEditMode}>
                    <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                  </Button>
                }
              </Card.Header>
              <ListGroup variant="flush">
                {this.createListGroupArray(this.state.selectedDateString)}
                {this.state.editMode ?
                <>
                <Form id="tempFieldsForm" onSubmit={this.saveTempFields}>
                  {Object.keys(this.state.tempFieldDefinitions).map(this.renderTempListItem)}
                </Form>
                <ListGroup.Item>
                  <Button variant="primary" onClick={this.createTempListItem}>
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                  </Button>
                </ListGroup.Item></> : ""}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
