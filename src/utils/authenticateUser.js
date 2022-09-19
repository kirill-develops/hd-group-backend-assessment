// for verifying email and password
import * as AWS from 'aws-sdk/global';
import { userPool } from './addUser';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

export function authenticateUser({ email, password }) {
  const authenticationData = {
    Username: email,
    Password: password,
  };

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const accessToken = result.getAccessToken().getJwtToken();
      const COGNITO_ID = `cognito-idp.${process.env.GATSBY_AWS_S3_REGION}.com/${process.env.GATSBY_AWS_USER_POOL_ID}`

      //POTENTIAL: Region needs to be set if not already set previously elsewhere.
      AWS.config.region = process.env.GATSBY_AWS_S3_REGION;

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.GATSBY_AWS_IDENTITY_POOL_ID, // your identity pool id here
        Logins: {
          // Change the key below according to the specific region your user pool is in.
          [COGNITO_ID]: result
            .getIdToken()
            .getJwtToken(),
        },
      });

      //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
      AWS.config.credentials.refresh(error => {
        if (error) {
          console.error(error);
        } else {
          // Instantiate aws sdk service objects now that the credentials have been updated.
          // example: var s3 = new AWS.S3();
          console.log('Successfully logged!');
        }
      });
    },

    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
    },
  });
}