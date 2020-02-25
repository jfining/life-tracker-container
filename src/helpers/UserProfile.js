import {getSessionUser} from './Cognito';

var UserProfile = (function() {
    var email = "";
    var accessToken = "";
    var idToken = "";
    var userName = "";
    var err = "";
    var validSession = false;

    var getErr = function() {
        return err;
    }

    var setErr = function(error) {
        err = error;
    }

    var onSessionSuccess = (accessToken, idToken, session) => {
        setAccessToken(accessToken);
        setIdToken(idToken);
        setValidSession(true);
        setEmail(session.idToken.payload.email);
        setUserName(session.idToken.payload["cognito:username"]);
        setErr("");
    }

    var onSessionError = (err) => {
        setErr(err);
        setValidSession(false);
    }

    var getValidSession = function() {
        return validSession;
    }

    var setValidSession = function(b) {
        validSession = b
    }
  
    var getEmail = function() {
        return email;
    };
  
    var setEmail = function(input_email) {
        email = input_email;
    };

    var getAccessToken = function() {
        return accessToken;
    }

    var setAccessToken = function(input_accessToken) {
        accessToken = input_accessToken;
    }

    var getIdToken = function() {
        return idToken;
    }

    var setIdToken = function(input_idToken) {
        idToken = input_idToken;
    }

    var getUserName = function() {
        return userName;
    }

    var setUserName = function(input_userName) {
        userName = input_userName;
    }

    var getUserInfo = () => {
        getSessionUser(onSessionSuccess, onSessionError);

        return {
            email: getEmail(),
            accessToken: getAccessToken(),
            idToken: getIdToken(),
            userName: getUserName(),
            err: getErr(),
            validSession: getValidSession()
        }
    }

    var setUserInfo = (userObject) => {
        setEmail(userObject.email);
        setUserName(userObject.userName);
        setAccessToken(userObject.accessToken);
        setIdToken(userObject.idToken);
    }
  
    return {
      getEmail: getEmail,
      setEmail: setEmail,
      getUserInfo: getUserInfo,
      setUserInfo: setUserInfo
    }
  
  })();
  
  export default UserProfile;
