import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { flexbox } from '@material-ui/system';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';

function Navbar(props) {
  const { classes } = props;
  return (
    <nav>
      <AppBar position='static'>
        <Toolbar className={classes.toolbar}>
          <Typography variant='h6' color='inherit' className={classes.title}>
            {/* AI Smart Agriculture */}
            <Button component={NavLink} to='/' activeStyle={{ color: '#fff' }}>
              AI Smart Agriculture
            </Button>
          </Typography>
          {/* <Typography variant="h6" color="inherit" className={classes.lab}>
            國立台灣大學生物產業機電工程學系
            <img src={logo} alt="Kitten" height="65" width="65" />
          </Typography> */}
          <Typography variant='h6' color='inherit' className={classes.navBar}>
            <Button component={NavLink} to='/data-cleaning1' activeStyle={{ color: '#fff' }}>
              Data Cleaning1
            </Button>
            <Button component={NavLink} to='/data-cleaning2' activeStyle={{ color: '#fff' }}>
              Data Cleaning2
            </Button>
            <Button component={NavLink} to='/data-cleaning3' activeStyle={{ color: '#fff' }}>
              Data Cleaning3
            </Button>
            <Button component={NavLink} to='/classification' activeStyle={{ color: '#fff' }}>
              Classification
            </Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </nav>
  );
}
const styles = {
  toolbar: {
    justifyContent: 'space-between'
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
