import React, { useCallback, useState } from 'react';
import { handleValidation } from '../utils/handleValidation';
import { addUser } from '../utils/addUser';
import { authenticateUser } from '../utils/authenticateUser';
import { handleImageUpload } from '../utils/handleImageUpload';
import { Link } from 'gatsby';
import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const pageStyles = {
  color: '#232129',
  margin: '-8px',
  padding: 96,
  minHeight: 'calc(100vh - 192px)',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
  backgroundColor: '#FBAB7E',
  backgroundImage: 'linear-gradient(62deg, #FBAB7E 0 %, #F7CE68 100 %)',
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
const inputStyles = {
  width: '100%',
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
    if (e.target.files.length === 0) return;

    const fileName = e.target.files[0]?.name;
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
  const handleReveal = useCallback((prop) => {
    if (passwordType[prop] === 'password') {
      setPasswordType({
        ...passwordType,
        [prop]: 'text'
      })
    };
    if (passwordType[prop] === 'text') {
      setPasswordType({
        ...passwordType,
        [prop]: 'password'
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
          <Button
            component='label'
            variant='outlined'
            color={(formValues.photo && 'success') || (formErrors.photo && 'error')}
            fullWidth>
            UPLOAD PROFILE PIC
            <input
              hidden
              type="file"
              name="image"
              accept='image/*'
              onChange={handlePhotoUpload}
              style={inputStyles}
            />
          </Button>
          <FormHelperText>
            {formErrors?.photo && !formValues.photo
              && `Photo ${formErrors?.photo}`}
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
              <InputAdornment
                position='end'
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => handleReveal("password1")}
                  edge="end"
                >
                  {passwordType.password1 === 'password'
                    ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>
            {formErrors?.password && `Password ${formErrors?.password}`}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <span>Password must contain:</span>
              <span> - at least 1 number</span>
              <span> - at least 1 special character &#40; ^ $ * . &#91; &#93; &#123; &#125; &#40; &#41; ? - &#34; ! @ # % &amp; / \ , &#62; &#60;	&#39; : ; | _ ~ &#96; + = &#41;</span>
              <span> - at least 1 lowercase letter &amp; 1 uppercase letter</span>
            </Box>
          </FormHelperText>
        </FormControl>
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
                  onClick={() => handleReveal('password2')}
                  edge="end"
                >
                  {passwordType.password2 === 'password'
                    ? <Visibility /> : <VisibilityOff />}
                </IconButton>
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
