import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import passwordValidator from 'password-validator';
import { register, signin, verify } from '../helpers/Cognito.js';

class Registration extends Component {
  
  constructor(props) {
    super(props)
    
    var schema = new passwordValidator()

    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    
    this.state = {
      handleRegistered: props.handleRegistered,
      accessToken: null,
      idToken: null,
      refreshToken: null,
      registered: false,
      verified: false,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
      errMessage: null,
      schema: schema,
      verificationCode: ""
    }

    this.handleClick = this.handleClick.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onUserChange = this.onUserChange.bind(this)
    this.onPassChange = this.onPassChange.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.onFailure = this.onFailure.bind(this)
    this.onConfirmChange = this.onConfirmChange.bind(this)
    this.onCodeChange = this.onCodeChange.bind(this)
    this.onVerifySuccess = this.onVerifySuccess.bind(this)
    this.onVerifyError = this.onVerifyError.bind(this)
    this.handleVerify = this.handleVerify.bind(this)
    this.onSigninSuccess = this.onSigninSuccess.bind(this)
    this.onSigninFailure = this.onSigninFailure.bind(this)
    this.handleProfileCreated = this.handleProfileCreated.bind(this)
  }

  onSuccess(res) {
    var user = res.user
    console.log(user)
    this.setState({
      registered: true
    })
  }

  onFailure(err) {
    this.setState({errMessage: err.message})
  }

  onVerifySuccess() {
    signin(this.state.email, this.state.password, this.onSigninSuccess, this.onSigninFailure)
  }

  onSigninSuccess(res) {
    var accessToken = res.getAccessToken().getJwtToken();        
    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
    var idToken = res.idToken.jwtToken;
    this.setState({
      verified: true,
      accessToken: accessToken,
      idToken: idToken
    }, this.handleProfileCreated);
  }

  onSigninFailure(err) {
    this.setState({errMessage: err.message})
  }

  onVerifyError(error){
    this.setState({errMessage: error.message})
  }

  onEmailChange(event) {
    this.setState({email: event.target.value})
  }

  onUserChange(event) {
    this.setState({username: event.target.value})
  }

  onPassChange(event) {
    this.setState({password: event.target.value})
  }

  onConfirmChange(event) {
    this.setState({confirmPassword: event.target.value})
  }

  onCodeChange(event) {
    this.setState({verificationCode: event.target.value})
  }

  handleClick() {
    if (!this.state.schema.validate(this.state.password)) {
      this.setState({errMessage: "Password does not meet requirements"})
      return
    }

    if (!this.state.email.includes('@')) {
      this.setState({errMessage: "enter a valid email address"})
      return
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({errMessage: "passwords do not match"})
      return
    }

    register(this.state.email, this.state.password, this.onSuccess, this.onFailure)
  } 

  handleVerify() {
    verify(this.state.email, this.state.verificationCode, this.onVerifySuccess, this.onVerifyError)
  }

  handleProfileCreated() {
    this.state.handleRegistered(this.state.accessToken, this.state.idToken, this.state.refreshToken, this.state.email)
  }


  render() {
    //if (this.state.registered && this.state.verified) return (<ProfileCreation email={this.state.email} username={this.state.username} accessToken={this.state.authToken} idToken={this.state.idToken} handleProfileCreated={this.handleProfileCreated} />)
    if (this.state.registered) return (
      <div className="signinBody">
        <div className="login text-center">
         {this.state.errMessage ? <div className="alert alert-danger" role="alert">
              {this.state.errMessage}
            </div> : <div/>}
          <form>
            <h1 className="h3 mb-3 font-weight-normal">Trackr</h1>
            <h4 className="h4 mb-3 font-weight-normal">Verify Email</h4>

            <label htmlFor="inputCode" className="sr-only">Verification Code</label>
            <input type="text" id="inputCode" className="" placeholder="Code" onChange={this.onCodeChange}/>

            <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleVerify}>Verify</button>
          </form>
         </div>
      </div>
    )

  	return (
      <div className="signinBody">
         <div className="login">
         {this.state.errMessage ? <div className="alert alert-danger" role="alert">
              {this.state.errMessage}
            </div> : <div/>}
          <form>
            <label htmlFor="inputEmail" className="sr-only">Email</label>
            <input type="email" id="inputEmail" className="" placeholder="Email" onChange={this.onEmailChange}/>
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" className="" placeholder="Password" onChange={this.onPassChange}/>

            <label htmlFor="inputPassword" className="sr-only">Confirm Password</label>
            <input type="password" id="confirmPassword" className="" placeholder="Confirm Password" onChange={this.onConfirmChange}/>
            
            <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleClick}>Register</button>
            <p>Already registered? <Link to="/signin">Sign in</Link></p>
            <p>Passwords must be at least 8 characters long and include lowercase, uppercase, numbers, and a special character</p>
          </form>
         </div>
      </div>
      )   
    }
}

export default Registration