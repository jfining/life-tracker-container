import React, { useState } from 'react';
import { Link  } from 'react-router-dom';
import { signin, toUsername } from '../helpers/Cognito';
import {useHistory, useLocation} from 'react-router-dom';

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

  return (
    <div className="signinBody">      
    <div class="login">
      <div>
          {errMessage ? <div className="alert alert-danger" role="alert">
            {errMessage}
          </div> : <div/>}
        <input type="text" name="u" placeholder="Email" required="required" onChange={onUserChange} />
          <input type="password" name="p" placeholder="Password" required="required" onChange={onPassChange}/>
          <button className="btn btn-primary btn-block btn-large" onClick={handleClick}>Log In</button>
          <Link to="/register">
            <button className="btn btn-secondar btn-block btn-md">New? Click Here to Register</button>
          </Link>
      </div>
    </div>
    </div>
    )
}

export default SignIn