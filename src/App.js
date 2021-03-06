import React from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faMinusSquare, faPlusSquare, faEdit, faPlus, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import {BrowserRouter, Route, Redirect, Link} from 'react-router-dom';
import Registration from './routes/Registration';
import SignIn from './routes/SignIn';
import UserProfile from './helpers/UserProfile';
import {signout} from './helpers/Cognito';


class App extends React.Component {
  constructor(props) { 
    super(props);
    let now = new Date();
    let selectedDateString = this.getYearMonthDayString(now); 
    this.state = {
      isLoaded: false,
      selectedDate: now,
      editMode: false,
      selectedDateString: selectedDateString,
      fieldDefinitions: {},
      data: {},
      tempFieldDefinitions: {},
      userEmail: "",
      userName: "",
      authenticated: false
    };
    this.updateTimer = null;
  }

  getData = () => {
    var url = process.env.REACT_APP_HOST + "/user?email=" + UserProfile.getEmail();
    console.log("getting user data");
    fetch(url, {
      method: "GET",
      headers: {
      }
    })
    .then(res => res.json())
    .then(results => {
      var userInfo = results.userData[UserProfile.getEmail()];
      this.setState({
        isLoaded: true,
        data: userInfo.data,
        fieldDefinitions: userInfo.fieldDefinitions
      })}
    )
    .catch(err => console.log(err))
  }

  sendDataUpdate = () => {
    var url = process.env.REACT_APP_HOST + "/";
    let payload = {
      userEmail: UserProfile.getEmail(),
      data: JSON.stringify(this.state.data),
      fieldDefinitions: JSON.stringify(this.state.fieldDefinitions)
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(results => {
    }
    )
    .catch(err => console.log(err))
  }

  getYearMonthDayString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "-" + month + "-" + day;
  }
 
  handleDateChange = date => {
    let selectedDateString = this.getYearMonthDayString(date); 
    this.setState({
      selectedDate: date,
      selectedDateString: selectedDateString
    });
    if (!this.state.data.hasOwnProperty(selectedDateString)) {
      this.initializeDate(selectedDateString);
    }
  };

  initializeDate = (dateString) => {
    let tempObject = {};
    for (var key of Object.keys(this.state.fieldDefinitions)) {
      tempObject[key] = this.getDefaultForField(key);
    }
    let newData = Object.assign({}, this.state.data);
    newData[dateString] = tempObject;
    console.log("new data", newData);
    this.setState({
      data: newData
    });
  };

  initializeFieldForDate = (dateString, field, value) => {
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
      this.initializeFieldForDate(this.state.selectedDateString, field, 1);
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
      this.sendDataUpdate();
    }
  }

  stepDown = event => {
    let field = event.currentTarget.value;
    //if our data doesn't have an entry for this date, create it
    if (!this.state.data.hasOwnProperty(this.state.selectedDateString)) {
      this.initializeFieldForDate(this.state.selectedDateString, field, 0);
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
      this.sendDataUpdate();
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
    else if (this.state.fieldDefinitions[field].type === "dropdown") {
      return "";
    }
    else if (this.state.fieldDefinitions[field].type === "multiselect") {
      return [];
    }
    else if (this.state.fieldDefinitions[field].type === "text") {
      return "";
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
      inputGroup = <></>;
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

    else if(fieldType === "dropdown") {
      inputGroup = 
      <InputGroup>
        <Form.Control required as="select" placeholder="0" value={
          this.state.data[this.state.selectedDateString].hasOwnProperty(field) ? 
          this.state.data[this.state.selectedDateString][field] :
          this.getDefaultForField(field)
          } 
            onChange={(event)=>{
              let tempObject = this.state.data;
              tempObject[this.state.selectedDateString][field] = event.target.value;
              this.setState({data: tempObject}, this.sendDataUpdate);
            }
          }>
          <option value="">Select...</option>
          {this.state.fieldDefinitions[field].options.map((value)=>{return <option value={value}>{value}</option>})}
        </Form.Control>
      </InputGroup>;
    }

    else if(fieldType === "multiselect") {
      inputGroup =
      <Select isMulti={true} isSearchable={false} options={this.state.fieldDefinitions[field].options} placeholder="Multiselect"
        value = {this.state.data[this.state.selectedDateString][field]}
        onChange={(selectedValue) => {
          let tempObject = this.state.data;
          tempObject[this.state.selectedDateString][field] = selectedValue;
          this.setState({data: tempObject}, this.sendDataUpdate);
        }}
      >
      </Select>;
    }

    else if(fieldType === "text") {
      inputGroup = 
      <InputGroup>
        <Form.Control type="text" placeholder="Enter text" value={
          this.state.data[this.state.selectedDateString].hasOwnProperty(field) ? 
          this.state.data[this.state.selectedDateString][field] :
          this.getDefaultForField(field)}
          onChange={(newTextEvent) => {
            console.log("text change:"+newTextEvent.target.value)
            let tempObject = this.state.data;
            tempObject[this.state.selectedDateString][field] = newTextEvent.target.value;
            this.setState({data: tempObject});
            this.resetUpdateTimer();
          }}
        />
      </InputGroup>;
    }
    
    return(
      <ListGroup.Item key={field}>
        <Form.Group as={Row}>
          <Col xs={5}>
            {this.state.editMode ? 
            <Button variant="secondary" value={field} onClick={this.handleItemRemove}>
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </Button> : ""}
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

  resetUpdateTimer = () => {
    clearTimeout(this.updateTimer)
    this.updateTimer = setTimeout(this.sendDataUpdate, 2000);
  }

  toggleEditMode = event => {
    if (event != null) {
      event.preventDefault();
    }
    this.setState({
      editMode: !this.state.editMode
    });
    console.log("Toggled edit mode:"+JSON.stringify(this.state.editMode));
  }

  handleItemRemove = event => {
    //TODO Change this so that the cancel button doesn't remove it.
    //Maybe use a "toDelete" list in the state and flush it on save/clear it on cancel
    let key = event.currentTarget.value;
    let tempCopy = Object.assign({}, this.state.fieldDefinitions);
    delete tempCopy[key];
    this.setState({fieldDefinitions: tempCopy});
  }

  handleTempItemRemove = event => {
    let key = event.currentTarget.value;
    let tempCopy = Object.assign({}, this.state.tempFieldDefinitions);
    delete tempCopy[key];
    this.setState({tempFieldDefinitions: tempCopy});
  }

  renderTempListItem = key => {
    console.log(key);
    let additionalControls = <></>;
    if (this.state.tempFieldDefinitions[key].type === "number"){
      additionalControls = <></>;
    }
    else if (this.state.tempFieldDefinitions[key].type === "dropdown"){
      additionalControls = <Form.Control required type="text" placeholder={"Comma-separated list of dropdown values"}
      value={this.state.tempFieldDefinitions[key].options.join(",")}
      onChange={(event) => {
        let tempCopy = Object.assign({},this.state.tempFieldDefinitions);
        tempCopy[key].options = event.target.value.split(",");
        this.setState({tempFieldDefinitions: tempCopy})
      }}>
    </Form.Control>
    }
    else if (this.state.tempFieldDefinitions[key].type === "multiselect"){
      additionalControls = <Form.Control required type="text" placeholder={"Comma-separated list of select values"}
      value={this.state.tempFieldDefinitions[key].options.join(",")}
      onChange={(event) => {
        let tempCopy = Object.assign({},this.state.tempFieldDefinitions);
        tempCopy[key].options = event.target.value.split(",");
        this.setState({tempFieldDefinitions: tempCopy})
      }}>
    </Form.Control>
    }
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
          <option value="dropdown">Dropdown</option>
          <option value="multiselect">Multiselect</option>
          <option value="text">Text</option>
        </Form.Control>
        {additionalControls}
      </ListGroup.Item>
    )
  }

  createTempListItem = event => {
    let tempCopy = Object.assign({}, this.state.tempFieldDefinitions);
    let newId = new Date().getTime(); 
    tempCopy[newId] = {
      name: "",
      type: "",
      options: []
    }
    this.setState({tempFieldDefinitions: tempCopy});
  }

  saveTempFields = () => {
    let fieldDefCopy = Object.assign({}, this.state.fieldDefinitions);
    for (var key of Object.keys(this.state.tempFieldDefinitions)) {
      if (this.state.tempFieldDefinitions[key].type === "multiselect") {
        let tempOptions = [];
        for (var item of this.state.tempFieldDefinitions[key].options) {
          tempOptions.push({label: item, value: item});
        }
        fieldDefCopy[this.state.tempFieldDefinitions[key]["name"]] = {
          type: this.state.tempFieldDefinitions[key].type,
          options: tempOptions
        };
      }
      else {
        fieldDefCopy[this.state.tempFieldDefinitions[key]["name"]] = {
          type: this.state.tempFieldDefinitions[key].type,
          options: this.state.tempFieldDefinitions[key].options
        };
      }
    }
    this.setState({fieldDefinitions: fieldDefCopy, tempFieldDefinitions: {}});
    this.sendDataUpdate();
    this.toggleEditMode(null);
  }

  componentDidMount() {
    console.log("component did mount");
    if (UserProfile.getUserInfo().validSession) {
      console.log("Valid session, setting authenticated")
      this.setState(
        {authenticated: true}
      );
      this.getData();
    }
    if (!this.state.isLoaded && this.state.authenticated) {
      this.getData();
    }
    if (!this.state.data.hasOwnProperty(this.state.selectedDateString)) {
      this.initializeDate(this.state.selectedDateString);
    }
  }

  PrivateRoute = ({ children, ...rest }) => {
    
    return (
      <Route
        {...rest}
        render={({ location }) =>
        UserProfile.getUserInfo().validSession ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
  //Change this to just use a cognito user object of some sort
  handleAuthenticated = (accessToken, idToken, userEmail, userName) => {
    let userInfo = {
      authenticated: true,
      accessToken: accessToken,
      idToken: idToken,
      userEmail: userEmail,
      userName: userName
    }
    this.setState(userInfo, this.getData);
    UserProfile.setUserInfo(userInfo);
  }

  Logout = () => {
    signout(UserProfile.getUserInfo().email);
    return (
      <Redirect to={{pathname: "/signin"}}/>
    )
  }

  DatePickerButton = ({ value, onClick }) => (
    <Button className="button-purple" onClick={onClick}>
      {value}
    </Button>
  );

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Route exact path="/" component={() => {window.location.href = window.location.href+'home.html'; return null;}}>
          </Route>
          <Route path="/signin">
            <SignIn autheticated={UserProfile.getUserInfo().validSession} handleAuthenticated={this.handleAuthenticated}></SignIn>  
          </Route>
          <Route path="/register" component={() => <Registration handleRegistered={this.handleAuthenticated}/>}>
          </Route>
          <Route path="/logout" component={this.Logout}>
          </Route>
        <this.PrivateRoute path="/app"> 
          <>
          <Navbar bg="light" expand="md">
            <Navbar.Brand href="#home" style={{maxWidth: "35%"}}><img alt="logo" src="/trackr_logo.png" className={"float-left"} style={{width: "100%"}}></img></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className={"ml-auto"}>
                <Nav.Link href="/app">Home</Nav.Link>
                <Nav.Link href="">Coming Soon</Nav.Link>
                <Link to="/logout"><Button>Logout</Button></Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          {/*Card row*/}
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <Row>
                  <Col xs={3}>
                    <span className={"float-left"}>Your Life</span>
                  </Col>
                  <Col xs={6}>
                    <FontAwesomeIcon className={"dateLeft"} icon={faChevronCircleLeft} onClick={this.dateStepDown}/>
                    <DatePicker selected={this.state.selectedDate}
                      onChange={this.handleDateChange}
                      customInput={<this.DatePickerButton></this.DatePickerButton>}
                      todayButton="Jump To Today">
                    </DatePicker>
                    <FontAwesomeIcon className={"dateRight"} icon={faChevronCircleRight} onClick={this.dateStepUp}/>
                  </Col>
                  <Col xs={3}>
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
                    <Button variant="dark" type="button" className={"float-right"} onClick={this.toggleEditMode}>
                      <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                    </Button>
                  }
                  </Col>
                  </Row>
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
          </>
        </this.PrivateRoute>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
