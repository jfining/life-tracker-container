import React, { useState } from 'react';
import { Link, Redirect  } from 'react-router-dom';
import { signin, toUsername } from '../helpers/Cognito';
import {useHistory, useLocation} from 'react-router-dom';
import UserProfile from '../helpers/UserProfile';
import Card from 'react-bootstrap/esm/Card';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function SignIn(props) {
  let history = useHistory();
  let location = useLocation();

  const [inputEmail, setInputEmail] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [errMessage, setErrMessage] = useState('');

  function reRoute() {
    let { from } = location.state || { from: { pathname: "/app" } };
    history.replace(from);
  }

  const onSuccess = (res) => {
    var accessToken = res.getAccessToken().getJwtToken();        
    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
    var idToken = res.idToken.jwtToken;
    props.handleAuthenticated(accessToken, idToken, inputEmail, toUsername(inputEmail));
    reRoute();
  }

  const onFailure = (error) => {
    setErrMessage(error.message);
  }

  const onUserChange = (event) => {
    setInputEmail(event.target.value)
  }

  const onPassChange = (event) => {
    setInputPass(event.target.value);
  }

  const handleClick = () => {
    signin(inputEmail, inputPass, onSuccess, onFailure)
  }

  if(props.authenticated) {
    console.log("Signin already authenticated, re-routing");
    this.reRoute();
  }

  return (
    UserProfile.getUserInfo().validSession ? <Redirect
    to={{
      pathname: "/app"
    }}/> : (
    <div className="signInBody">
      <Navbar bg="light" expand="md">
        <Navbar.Brand href="#home" style={{maxWidth: "35%"}}><img alt="logo" src="/trackr_logo.png" className={"float-left"} style={{width: "100%"}}></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={"ml-auto"}>
            <Nav.Link href="/app">Home</Nav.Link>
            <Nav.Link href="">Coming Soon</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div class="login">
        <div class="conainer d-flex">
            {errMessage ? <div className="alert alert-danger" role="alert">
              {errMessage}
            </div> : <div/>}
          <Card className="text-center mx-auto my-auto" style={{ width: '18rem' }}>
            <Card.Header>
              <span>Login</span>
            </Card.Header>
            <Card.Body>
              <input className="loginInput" type="text" name="u" placeholder="Email" required="required" onChange={onUserChange} />
              <input className="loginInput" type="password" name="p" placeholder="Password" required="required" onChange={onPassChange}/>
              <Button className="btn btn-primary btn-block btn-large" onClick={handleClick}>Log In</Button>
            </Card.Body>
            <Card.Footer className="text-muted">
              <Link to="/register">
                <button className="btn btn-secondar btn-block btn-md">New? Click Here to Register</button>
              </Link>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>)
    )
}

export default SignIn