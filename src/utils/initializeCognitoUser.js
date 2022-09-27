import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./addUser";
import * as AWS from 'aws-sdk/global';


export function initilizeCognitoUser(email) {
  let cognitoUser;

  if (email) {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    cognitoUser = new CognitoUser(userData);
  }


  cognitoUser = userPool.getCurrentUser();

  if (cognitoUser !== null) {
    cognitoUser.getSession((err, result) => {
      const COGNITO_ID = `cognito-idp.${process.env.GATSBY_AWS_S3_REGION}.amazonaws.com/${process.env.GATSBY_AWS_USER_POOL_ID}`

      if (result) {
        const idToken = result.getIdToken().getJwtToken();
        // Add the User's Id Token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.GATSBY_AWS_IDENTITY_POOL_ID,
          Logins: {
            [COGNITO_ID]: idToken,
          }
        });
      } else if (err) {
        console.log(err);
      }
    });
  }


  initilizeCognitoUser.signOut = () => {
    cognitoUser.signOut();
  };


  return cognitoUser;
}