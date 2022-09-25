import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./addUser";
import * as AWS from 'aws-sdk/global';
import { navigate } from "gatsby";


export function initilizeCognitoUser(email) {
  let cognitoUser = userPool.getCurrentUser();

  const userData = {
    Username: email,
    Pool: userPool,
  };

  if (cognitoUser != null) {
    cognitoUser.getSession((err, result) => {
      const COGNITO_ID = `cognito-idp.${process.env.GATSBY_AWS_S3_REGION}.amazonaws.com/${process.env.GATSBY_AWS_USER_POOL_ID}`

      if (result) {
        console.log('You are now logged in.');

        // Add the User's Id Token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.GATSBY_AWS_IDENTITY_POOL_ID,
          Logins: {
            [COGNITO_ID]: result
              .getIdToken()
              .getJwtToken(),
          }
        });
      } else if (err) {
        console.log(err);
      }
    });
  } else if (email) {
    cognitoUser = new CognitoUser(userData);
  } else {
    navigate("../signIn");
    alert("You are not logged in")
  }

  initilizeCognitoUser.signOut = () => {
    cognitoUser.signOut();
  };

  return cognitoUser;
}