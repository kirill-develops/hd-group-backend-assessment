
import { userPool } from './addUser';
import { CognitoUser } from 'amazon-cognito-identity-js';

export function verifyUser({ email, verification }) {
  const userData = {
    Username: email,
    Pool: userPool,
  };


  const cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(verification, true, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log('call result: ' + result);
  });
}