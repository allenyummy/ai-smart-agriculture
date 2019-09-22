import React from 'react';
import PredictForm from './components/predict-form/PredictForm';
import CleanForm from './components/clean-form/CleanForm';

import { withStyles } from '@material-ui/core/styles';
import Navbar from './components/nav/Navbar';
import Footer from './components/footer/Footer';
import Container from '@material-ui/core/Container';
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App(props) {
  const { classes } = props;
  return (
    <BrowserRouter>
      <Navbar />
      <Container maxWidth='lg' className={classes.container}>
        <Switch>
          <Route exact path='/data-cleaning' component={CleanForm} />
          <Route exact path='/classification' component={PredictForm} />
        </Switch>
      </Container>
      <Footer />
    </BrowserRouter>
  );
}

const styles = {
  container: {
    padding: '20px 5px 20px 5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: window.innerHeight - 130 + 'px'
  }
};

export default withStyles(styles)(App);
