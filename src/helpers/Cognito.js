import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: process.env.REACT_APP_POOL_ID,
    ClientId: process.env.REACT_APP_POOL_CLIENT_ID
};

/*
 * Cognito User Pool functions
 */

export function register(email, password, onSuccess, onFailure) {
     var userPool = new CognitoUserPool(poolData);
 
     var dataEmail = {
         Name: 'email',
         Value: email
     };
     var attributeEmail = new CognitoUserAttribute(dataEmail);
    
     userPool.signUp(toUsername(email), password, [attributeEmail], null,
         function signUpCallback(err, result) {
             if (!err) {
                 onSuccess(result);
             } else {
                 onFailure(err);
             }
         }
     );
}

export function verify(email, code, onSuccess, onFailure) {
    createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
        if (!err) {
            onSuccess(result);
        } else {
            onFailure(err);
        }
    });
}

export function signin(email, password, onSuccess, onFailure) {
    var authenticationDetails = new AuthenticationDetails({
        Username: toUsername(email),
        Password: password
    });

    var cognitoUser = createCognitoUser(email);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onFailure
    });
}

export function signout(email) {
    var cognitoUser = createCognitoUser(email);
    cognitoUser.signOut();
}

export function getSessionUser(onSuccess, onFailure) {
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                onFailure(err)
                return;
            }
            var accessToken = session.getAccessToken().getJwtToken();        
            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            var idToken = session.idToken.jwtToken;
            onSuccess(accessToken, idToken)
        });
    }
}


function createCognitoUser(email) {
    var userPool = new CognitoUserPool(poolData);

    return new CognitoUser({
        Username: toUsername(email),
        Pool: userPool
    });
}

export function toUsername(email) {
    return email.replace('@', '-at-');
}