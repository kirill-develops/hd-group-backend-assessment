import React, { useCallback, useState } from 'react';
import { handleValidation } from '../utils/handleValidation';
import { addUser } from '../utils/addUser';
import { authenticateUser } from '../utils/authenticateUser';
import { handleImageUpload } from '../utils/handleImageUpload';
import { Link } from 'gatsby';

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
  gap: '1.5rem',
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
    const fileName = e.target.files[0].name;
    const idxDot = fileName.lastIndexOf(".") + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    const fileTypes = ['jpg', 'jpeg', 'png', 'svg']
    if (fileTypes.includes(extFile)) {
      setFormValues({
        ...formValues,
        photo: e.target.files[0]
      })
    } else {
      alert("Only jpg/jpeg, svg and png files are allowed!");
      e.target.value = '';
    }

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

  // caller function handling submission process when user clicks submit button
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { email, photo, password } = formValues;
    const isValid = handleValidation({ formValues, setFormErrors, type: 'signUp' });

    if (isValid) {
      addUser({ email, photo, password });
      handleImageUpload({ email, photo, setFormErrors });
      setTimeout(() => {
        authenticateUser({ email, password });
      }, 1500);
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
          <input
            type="file"
            name="image"
            accept='image/*'
            onChange={handlePhotoUpload}
            style={inputStyles}
          />
          {formErrors.photo
            && <span style={errorStyles}>Photo {formErrors.photo}</span>}
        </div>
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
          {formErrors.password
            && <span style={errorStyles}>Password {formErrors.password}</span>}
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
          {formErrors.passwordConfirm
            && <span style={errorStyles}>Password {formErrors.passwordConfirm}</span>}
        </div>
        <button type="submit">SIGN UP</button>
      </form>
      <div>
        <Link to='/signIn/'>Sign In</Link>
      </div>
    </main>
  );
};


export default IndexPage;

export const Head = () => <title>Sign Up | HD GROUP</title>;
