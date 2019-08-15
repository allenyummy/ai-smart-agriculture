import React from 'react';
import UploadForm from './components/upload-form/UploadForm';
import { withStyles } from '@material-ui/core/styles';
import Navbar from './components/nav/Navbar';
import Container from '@material-ui/core/Container';

function App(props) {
  const { classes } = props;
  return (
    <>
      <Navbar />
      <Container maxWidth="sm" className={classes.container}>
        <UploadForm />
      </Container>
    </>
  );
}

const styles = {
  container: {
    padding: '80px 0 0 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default withStyles(styles)(App);
