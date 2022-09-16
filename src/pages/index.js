import React, { useCallback, useState } from 'react';

import { handleValidation } from '../utils/handleValidation';
import { run } from '../utils/handlePhotoUpload';
import { addUser } from '../utils/addUser';

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
  marginBottom: "8px",
}

const errorStyles = {
  color: 'red',
  display: 'block',
}


const IndexPage = () => {
  const [formValues, setFormValues] = useState({
    email: '',
    photo: '',
    password: '',
    passwordConfirm: ''
  })


  const handleFormValueChange = useCallback((e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    })
  }, [formValues]);


  const handlePhotoUpload = useCallback((e) => {
    setFormValues({
      ...formValues,
      photo: e.target.files[0]
    })
  }, [formValues])


  // state and handler function to reveal password to user
  const [passwordType, setPasswordType] = useState({
    password1: 'password',
    password2: 'password'
  })


  const handleReveal = useCallback((e) => {
    if (passwordType[e.target.name] === 'password') {
      setPasswordType({
        ...passwordType,
        [e.target.name]: 'text'
      })
    };

    if (passwordType[e.target.name] === 'text') {
      setPasswordType({
        ...passwordType,
        [e.target.name]: 'password'
      })
    };
  }, [passwordType]);


  const [formErrors, setFormErrors] = useState({});
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { email, photo, password } = formValues;
    const isValid = handleValidation({ formValues, setFormErrors });


    if (isValid) {
      // ? producing error, posted question on stackOverflow
      // run({ email, photo });
      addUser({ email, photo, password });
    };

  }, [formValues]);


  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        style={formStyles}>
        <div style={inputWrapperStyles}>
          <input
            type="text"
            placeholder="email"
            name="email"
            value={formValues.email}
            onChange={handleFormValueChange}
            style={inputStyles}
          />
          {formErrors.email && <span style={errorStyles}>Email {formErrors.email}</span>}
        </div>
        <input
          type="file"
          name="image"
          accept='image/*'
          onChange={handlePhotoUpload}
        />
        <div style={inputWrapperStyles}>
          <div style={passwordWrapperStyles}>
            <input
              type={passwordType.password1}
              placeholder="new password"
              name="password"
              value={formValues.password}
              onChange={handleFormValueChange}
              style={inputStyles}
            />
            <input
              type='checkbox'
              name='password1'
              onClick={handleReveal}
            />
          </div>
          {formErrors.password && <span style={errorStyles}>Password {formErrors.password}</span>}
        </div>
        <div style={inputWrapperStyles}>
          <div style={passwordWrapperStyles}>
            <input
              type={passwordType.password2}
              placeholder="re-enter password"
              name="passwordConfirm"
              value={formValues.passwordConfirm}
              onChange={handleFormValueChange}
              style={inputStyles}
            />
            <input
              type='checkbox'
              name='password2'
              onClick={handleReveal} />
          </div>
          {formErrors.password && <span style={errorStyles}>Password {formErrors.password}</span>}
        </div>
        <button type="submit">SIGN UP</button>
      </form>
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
