import { Paper } from '@mui/material';
import { navigate } from 'gatsby';
import React, { useCallback, useEffect, useState } from 'react';
import { getUserAttributes } from '../utils/getUserAttributes';
import { getUserImage } from '../utils/getUserImage';
import { initilizeCognitoUser } from '../utils/initializeCognitoUser';


const pageStyles = {
  color: '#232129',
  margin: '-8px',
  padding: 96,
  minHeight: 'calc(100vh - 192px)',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
  backgroundImage: 'linear-gradient(45deg, #8baaaa 0%, #ae8b9c 100%)',
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};
const sectionStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
}
const imgStyles = {
  maxWidth: '35%',
  margin: '0 auto',
  width: 'fit-content'
}
const linkStyles = {
  color: '-webkit-link',
  cursor: 'pointer',
  textDecoration: 'underline',
  border: 'none',
  backgroundColor: 'inherit',
  fontSize: '1rem'
}


const Dashboard = () => {
  const [attributeList, setAttributeList] = useState({
    email: 'loading',
    picture: 'loading'
  });
  useEffect(() => {
    const attributes = getUserAttributes(setAttributeList);
    if (!attributes) {
      navigate("../signIn");
      alert("You are not logged in");
    }
  }, []);


  const [pictureUrl, setPictureUrl] = useState(null);
  useEffect(() => {
    if (attributeList.picture !== 'loading') {
      (async () => {
        try {
          const imgUrl = await getUserImage({ key: attributeList.picture });
          setPictureUrl(imgUrl);
        } catch (err) {
          console.log("Error", err);
        }
      })();
    }
  }, [attributeList]);


  const handleLogout = useCallback(() => {
    initilizeCognitoUser();
    initilizeCognitoUser.signOut();
    navigate("../signIn");
  }, []);


  const pageJSX = pictureUrl !== null ? (
    <>
      <Paper
        component='section'
        elevation={10}
        sx={{ p: '1rem', m: '1rem auto', width: 'fit-content' }}
        style={sectionStyles}
      >
        <h2>user email:{" "}
          <span>{attributeList?.email}</span>
        </h2>
        <h2>user photo:</h2>
        <img src={pictureUrl}
          style={imgStyles}
          alt={`${attributeList?.email || 'user'} profile`}
        />
      </Paper>
      <div>
        <button onClick={handleLogout}
          style={linkStyles}>
          Logout
        </button>
      </div>
    </>
  ) : (
    <section style={sectionStyles}>
      <span>Loading</span>
    </section>
  );


  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Dashboard</h1>
      {pageJSX}
    </main>
  )
};


export default Dashboard;

export const Head = () => <title>Dashboard | HD GROUP</title>;
