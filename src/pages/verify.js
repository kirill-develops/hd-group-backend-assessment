import React, { useCallback, useState } from 'react';
import { handleValidation } from '../utils/handleValidation';
import { verifyUser } from '../utils/verifyUser';

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


const Verify = ({ location }) => {
  // state and handler function for form values and updating them
  const [formValues, setFormValues] = useState({
    email: location?.state?.email || '',
    verification: ''
  });
  const handleFormValueChange = useCallback((e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    })
  }, [formValues]);


  // state for form errors used during validation & state rendered in window
  const [formErrors, setFormErrors] = useState({});


  // handler function for form submission
  const handleSubmit = useCallback((e) => {
    // prevent refresh of browser
    e.preventDefault();


    // boolean value representing return from handleValidation function. Checks to see if form values are valid
    const isValid = handleValidation({ formValues, setFormErrors, type: 'verify' });

    if (isValid) {
      verifyUser({ email: formValues.email, verification: formValues.verification });
    };
  }, [formValues]);

  // render component
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Verify Email</h1>
      <form
        onSubmit={handleSubmit}
        style={formStyles}>
        <div style={inputWrapperStyles}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formValues.email}
            onChange={handleFormValueChange}
            style={inputStyles}
          />
          {formErrors.email
            && <span style={errorStyles}>Email {formErrors.email}</span>}
        </div>
        <div style={inputWrapperStyles}>
          <input
            type="text"
            placeholder="Verification Code"
            name="verification"
            value={formValues.verification}
            onChange={handleFormValueChange}
            style={inputStyles}
          />
          {formErrors.verification
            && <span style={errorStyles}>Verification code {formErrors.verification}</span>}
        </div>
        <button type="submit">VERIFY</button>
      </form>
      <div>
        <a href='./'>Sign Up</a>
        <span>{" "}</span>
        <a href='./signIn'>Sign In</a>
      </div>
    </main>
  );
};

export default Verify;

export const Head = () => <title>Verify Account | HD GROUP</title>;
