import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from './logo.png';

function Navbar(props) {
  const { classes } = props;
  return (
    <nav>
      <AppBar position='static'>
        <Toolbar className={classes.toolbar}>
          <Typography variant='h6' color='inherit' className={classes.lab}>
            國立台灣大學生物產業機電工程學系
            <img src={logo} alt='Kitten' height='65' width='65' />
          </Typography>
        </Toolbar>
      </AppBar>
    </nav>
  );
}
const styles = {
  toolbar: {
    justifyContent: 'center'
  },
  title: {
    textDecoration: 'none'
  },
  lab: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  },
  navBar: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '15px'
  }
};

export default withStyles(styles)(Navbar);
