import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material';
import { Link } from 'gatsby';
import React, { useCallback, useState } from 'react';
import { authenticateUser } from '../utils/authenticateUser';
import { handleValidation } from '../utils/handleValidation';


const pageStyles = {
  color: '#232129',
  margin: '-8px',
  padding: 96,
  minHeight: 'calc(100vh - 192px)',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
  backgroundImage: "linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)",
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


  // state and handler function to reveal password to user
  const [passwordType, setPasswordType] = useState('password')
  const handleReveal = useCallback((e) => {
    if (passwordType === 'password') {
      setPasswordType('text')
    };
    if (passwordType === 'text') {
      setPasswordType('password')
    };
  }, [passwordType]);


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
          variant="outlined"
          type='email'
          error={Boolean(formErrors?.email)}
          helperText={formErrors?.email && `Email ${formErrors?.email}`}
          value={formValues.email}
          onChange={handleFormValueChange}
          size="small"
          fullWidth
        />
        <FormControl>
          <InputLabel
            htmlFor="password"
            size='small'
            error={Boolean(formErrors?.password) || false}
          >PASSWORD</InputLabel>
          <OutlinedInput
            label='PASSWORD'
            name="password"
            variant="outlined"
            type={passwordType}
            error={Boolean(formErrors?.password) || false}
            value={formValues.password}
            onChange={handleFormValueChange}
            size="small"
            fullWidth
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label="toggle password visibility"
                  name='passwordReveal'
                  onClick={handleReveal}
                  edge="end"
                >
                  {passwordType === 'password' ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText sx={{ color: '#c51b25' }}>
            {formErrors?.password && `Password ${formErrors?.password}`}
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
        <Link to='/'>Sign Up</Link>
      </div>
    </main >
  );
};


export default SignInPage;

export const Head = () => (<>
  <title>Sign In | HD GROUP</title>
  <meta property="og:title" content="Sign In | Backend Assessment" />
  <meta property="og:description" content="A simple AWS sign-up & sign-in workflow meant to demonstrate comprehension of necessary AWS microservices." />
  <meta property="og:type" content="website" />
</>)
