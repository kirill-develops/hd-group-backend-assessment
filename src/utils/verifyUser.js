import { initilizeCognitoUser } from './initializeCognitoUser';

export function verifyUser({ email, verification }) {

  const cognitoUser = initilizeCognitoUser(email);
  cognitoUser.confirmRegistration(verification, true, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log('call result: ' + result);
  });
}