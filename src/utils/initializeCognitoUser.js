import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./addUser";

export function initilizeCognitoUser(email) {
  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  return cognitoUser;
}