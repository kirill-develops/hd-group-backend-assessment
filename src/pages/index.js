import React, { useCallback, useEffect, useState } from 'react';

const pageStyles = {
  color: '#232129',
  padding: 96,
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
}

const IndexPage = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    passwordConfirm: ''
  })

  const handleFormValueChange = useCallback((e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    })
  }, [formValues]);

  const handleValidation = useCallback(() => {
    const fields = formValues;
    const errors = {};
    let formIsValid = true;

    //Email
    if (!fields.email) {
      formIsValid = false;
      errors.email = 'cannot be empty';
    }

    if (fields.email) {
      let lastAtPos = fields.email.lastIndexOf('@');
      let lastDotPos = fields.email.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields.email.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          fields.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors.email = 'is not valid';
      }
    }
    const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8}$/;

    // Password
    if (!fields.password) {
      formIsValid = false;
      errors.password = 'cannot be empty';
    }

    if (fields.password) {
      if (!fields.password.match(passwordRules)) {
        formIsValid = false;
        errors.password = 'must contain atleast 1 number & 1 special character'
      }

      if (fields.password.length < 8) {
        formIsValid = false;
        errors.password = 'must be at least 8 characters'
      }
    }

    // passwordConfirm
    if (fields.passwordConfirm !== fields.password) {
      formIsValid = false;
      errors.passwordConfirm = `doesn't match password above`
    }
    setFormErrors(errors);

    return formIsValid;
  }, [formValues]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const isValid = handleValidation();

    if (isValid) {
    };

  }, [formValues]);

  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        style={formStyles}>
        <input
          type="text"
          placeholder="email"
          name="email"
          value={formValues.email}
          onChange={handleFormValueChange}
        />
        <input
          type="password"
          placeholder="new password"
          name="password"
          value={formValues.password}
          onChange={handleFormValueChange}
        />
        <input
          type="password"
          placeholder="re-enter password"
          name="passwordConfirm"
          value={formValues.passwordConfirm}
          onChange={handleFormValueChange}
        />
        <button type="submit">SIGN UP</button>
      </form>
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
