import React from 'react';
import UploadForm from './components/upload-form/UploadForm';
import AccuracyTable from './components/accuracy-table/AccuracyTable';

import { withStyles } from '@material-ui/core/styles';
import Navbar from './components/nav/Navbar';
import Container from '@material-ui/core/Container';

function App(props) {
  const { classes } = props;
  return (
    <>
      <Navbar />
      <Container maxWidth="md" className={classes.container}>
        {/* <AccuracyTable /> */}
        <UploadForm />
      </Container>
    </>
  );
}

const styles = {
  container: {
    padding: '20px 0 0 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default withStyles(styles)(App);
