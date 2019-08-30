import React from 'react';
import PredictForm from './components/predict-form/PredictForm';
import CleanForm from './components/clean-form/CleanForm';

import { withStyles } from '@material-ui/core/styles';
import Navbar from './components/nav/Navbar';
import Container from '@material-ui/core/Container';

function App(props) {
  const { classes } = props;
  return (
    <>
      <Navbar />
      <Container maxWidth="md" className={classes.container}>
        <PredictForm />
        {/* <CleanForm /> */}
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
