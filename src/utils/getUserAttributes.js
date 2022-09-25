import { initilizeCognitoUser } from './initializeCognitoUser';

export function getUserAttributes(setAttributeList) {
  const cognitoUser = initilizeCognitoUser();

  if (cognitoUser === null) return;

  cognitoUser?.getUserAttributes((err, result) => {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }

    let attributeData = {};
    for (let i = 0; i < result.length; i++) {
      const attributeName = result[i].getName();
      const attributeValue = result[i].getValue();
      attributeData[attributeName] = attributeValue;
    }
    setAttributeList(attributeData);
  })
}