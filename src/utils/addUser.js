import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.GATSBY_AWS_USER_POOL_ID,
  ClientId: process.env.GATSBY_AWS_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);
const attributeList = [];

export function addUser({ email, photo, password }) {

  const dataEmail = {
    Name: 'email',
    Value: email,
  };
  const dataPhoto = {
    Name: 'picture',
    Value: email + "/" + photo.name
  };

  const attributeEmail = new CognitoUserAttribute(dataEmail);
  const attributePhoto = new CognitoUserAttribute(dataPhoto);
  attributeList.push(attributeEmail);
  attributeList.push(attributePhoto);

  userPool.signUp(email, password, attributeList, null, function (
    err,
    result
  ) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    const cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
  });
}