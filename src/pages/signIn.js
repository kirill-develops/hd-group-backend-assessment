import { Link } from 'gatsby';
import React, { useCallback, useRef, useState } from 'react';
import { authenticateUser } from '../utils/authenticateUser';
import { handleValidation } from '../utils/handleValidation';


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
  gap: '1rem',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'fit-content',
  margin: 'auto',
}
const inputWrapperStyles = {
  width: '100%',
}
const passwordWrapperStyles = {
  display: 'flex',
  width: '100%',
}
const inputStyles = {
  width: '100%',
}
const errorStyles = {
  color: 'red',
  display: 'block',
  marginTop: "6px",
}


const SignInPage = ({ location }) => {
  // state and handler function for form values and updating them
  const [formValues, setFormValues] = useState({
    email: location?.state?.email || '',
    password: '',
  })
  const handleFormValueChange = useCallback((e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    })
  }, [formValues]);


  const passwordTypeRef = useRef();
  const handleReveal = () => {
    if (passwordTypeRef.current.type === 'text') {
      return passwordTypeRef.current.type = 'password'
    };
    if (passwordTypeRef.current.type === 'password') {
      return passwordTypeRef.current.type = 'text'
    };
  };


  // state for form errors used during validation & state rendered in window
  const [formErrors, setFormErrors] = useState({});

  // handler function for form submission
  const handleSubmit = useCallback((e) => {
    // prevent refresh of browser
    e.preventDefault();

    // deconstructed values from form inputs
    const { email, password } = formValues;

    // boolean value representing return from handleValidation function. Checks
    // to see if form values are valid
    const isValid = handleValidation({ formValues, setFormErrors, type: 'signIn' });

    if (isValid) {
      authenticateUser({ email, password });
    };
  }, [formValues]);


  // render component
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Sign In</h1>
      <form
        onSubmit={handleSubmit}
        style={formStyles}>
        <div style={inputWrapperStyles}>
          <input
            type="email"
            placeholder="email"
            name="email"
            value={formValues.email}
            onChange={handleFormValueChange}
            style={inputStyles}
          />
          {formErrors.email
            && <span style={errorStyles}>Email {formErrors.email}</span>}
        </div>
        <div style={inputWrapperStyles}>
          <div style={passwordWrapperStyles}>
            <input
              type={'password'}
              ref={passwordTypeRef}
              placeholder="password"
              name="password"
              value={formValues.password}
              onChange={handleFormValueChange}
              style={inputStyles}
            />
            <input
              type='checkbox'
              name='passwordReveal'
              onClick={handleReveal}
            />
          </div>
          {formErrors.password
            && <span style={errorStyles}>Password {formErrors.password}</span>}
        </div>
        <button type="submit">SIGN IN</button>
      </form>
      <div>
        <Link to='/'>Sign Up</Link>
      </div>
    </main>
  );
};


export default SignInPage;

export const Head = () => (<>
  <title>Sign In | HD GROUP</title>;
  <meta property="og:title" content="Sign In | Backend Assessment" />
  <meta property="og:description" content="A simple AWS sign-up & sign-in workflow meant to demonstrate comprehension of necessary AWS microservices." />
  <meta property="og:type" content="website" />
</>)
