import React, { useCallback, useState } from 'react';
import { handleValidation } from '../utils/handleValidation';
import { addUser } from '../utils/addUser';
import { authenticateUser } from '../utils/authenticateUser';
import { handleImageUpload } from '../utils/handleImageUpload';
import { Link } from 'gatsby';
import { Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';


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
    const fileTypes = ['jpg', 'jpeg', 'png', 'svg'];

    if (fileTypes.includes(extFile)) {
      setFormValues({
        ...formValues,
        photo: e.target.files[0]
      })
    } else {
      alert("Only jpg/jpeg, svg and png files are allowed!");
      e.target.value = '';
    }
  }, [formValues]);


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
      (async () => {
        try {
          await handleImageUpload({ email, photo });
        } catch (err) {
          console.log("Error", err);
          setFormErrors({
            photo: 'upload encountered error. Please try again'
          });
        }
      })();
      setTimeout(() => {
        authenticateUser({ email, password });
      }, 1500);
    };
  }, [formValues]);


  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Sign Up</h1>
      <Paper
        component='form'
        onSubmit={handleSubmit}
        elevation={10}
        sx={{ p: '1rem', m: '1rem auto', width: 'fit-content' }}
        style={formStyles}
      >
        <TextField
          label='EMAIL'
          name="email"
          variant='outlined'
          type="email"
          error={Boolean(formErrors?.email)}
          helperText={formErrors?.email && `Email ${formErrors?.email}`}
          value={formValues.email}
          onChange={handleFormValueChange}
          size='small'
          fullWidth
        />
        <FormControl
          error={Boolean(formErrors?.photo) || false}
          size='small'
          fullWidth
        >
          <Button variant='outlined' component='label' fullWidth>
            UPLOAD PROFILE PIC
            <input
              hidden
              type="file"
              name="image"
              accept='image/*'
              // onChange={handlePhotoUpload}
              style={inputStyles}
            />
          </Button>
          <FormHelperText>
            {formErrors?.photo && `Photo ${formErrors?.photo}`}
          </FormHelperText>
        </FormControl>
        <FormControl
          error={Boolean(formErrors?.password) || false}
          size='small'
          fullWidth
        >
          <InputLabel
            htmlFor='password'
          >PASSWORD</InputLabel>
          <OutlinedInput
            name='password'
            label='PASSWORD'
            variant='outlined'
            type={passwordType.password1}
            value={formValues.password}
            onChange={handleFormValueChange}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label="toggle password visibility"
                  name='password1'
                  onClick={handleReveal}
                  edge="end"
                >
                </IconButton>
                {passwordType.password1 === 'password'
                  ? <Visibility /> : <VisibilityOff />}
              </InputAdornment>
            }
          />
          <FormHelperText>
            {formErrors?.password && `Password ${formErrors?.password}`}
          </FormHelperText>
        </FormControl>
        <div>
          <p>Password must contain:</p>
          <p> - at least 1 number</p>
          <p> - at least 1 special character &#40; ^ $ * . &#91; &#93; &#123; &#125; &#40; &#41; ? - &#34; ! @ # % &amp; / \ , &#62; &#60;	&#39; : ; | _ ~ &#96; + = &#41;</p>
          <p> - at least 1 lowercase letter &amp; 1 uppercase letter</p>
        </div>
        <FormControl
          error={Boolean(formErrors?.passwordConfirm) || false}
          size='small'
          fullWidth
        >
          <InputLabel
            htmlFor='passwordConfirm'
          >RE-ENTER PASSWORD
          </InputLabel>
          <OutlinedInput
            name='passwordConfirm'
            label="RE-ENTER PASSWORD"
            variant='outlined'
            type={passwordType.password2}
            value={formValues.passwordConfirm}
            onChange={handleFormValueChange}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label="toggle password visibility"
                  name='password2'
                  onClick={handleReveal}
                  edge="end"
                >
                </IconButton>
                {passwordType.password2 === 'password'
                  ? <Visibility /> : <VisibilityOff />}
              </InputAdornment>
            }
          />
          <FormHelperText>
            {formErrors?.passwordConfirm && `Password ${formErrors?.passwordConfirm}`}
          </FormHelperText>
        </FormControl>
        <Button
          variant='contained'
          type='submit'
          fullWidth
        >
          SIGN IN
        </Button>
      </Paper>
      <div>
        <Link to='/signIn/'>Sign In</Link>
      </div>
    </main>
  );
};


export default IndexPage;

export const Head = () => (<>
  <title>Sign Up | HD GROUP</title>
  <meta property="og:title" content="Sign Up | Backend Assessment" />
  <meta property="og:description" content="A simple AWS sign-up & sign-in workflow meant to demonstrate comprehension of necessary AWS microservices." />
  <meta property="og:type" content="website" />
</>)
