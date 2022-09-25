// for verifying email and password
import * as AWS from 'aws-sdk/global';
import { AuthenticationDetails } from 'amazon-cognito-identity-js';
import { navigate } from 'gatsby';
import { initilizeCognitoUser } from './initializeCognitoUser';

export function authenticateUser({ email, password }) {

  const authenticationData = {
    Username: email,
    Password: password,
  };

  const cognitoUser = initilizeCognitoUser(email);

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const accessToken = result.getAccessToken().getJwtToken();
      const COGNITO_ID = `cognito-idp.${process.env.GATSBY_AWS_S3_REGION}.amazonaws.com/${process.env.GATSBY_AWS_USER_POOL_ID}`

      AWS.config.region = process.env.GATSBY_AWS_S3_REGION;

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.GATSBY_AWS_IDENTITY_POOL_ID,
        Logins: {
          [COGNITO_ID]: result
            .getIdToken()
            .getJwtToken(),
        },
      });

      AWS.config.credentials.refresh(error => {
        if (error) {
          console.error(error);
        } else {
          console.log('Successfully logged!');
          navigate('/dashboard', { state: { email, password } });
        }
      });
    },

    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
    },
  });
}