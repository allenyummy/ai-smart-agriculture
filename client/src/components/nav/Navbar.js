import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    // Style sheet name
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        color: 'white'
      }
    }
  }
});

function Navbar(props) {
  const { classes } = props;
  return (
    <nav>
      <MuiThemeProvider theme={theme}>
        <AppBar position='static'>
          <Toolbar className={classes.toolbar}>
            <Typography variant='h6' color='inherit' className={classes.title}>
              {/* AI Smart Agriculture */}
              <Button component={NavLink} to='/'>
                AI Smart Agriculture
              </Button>
            </Typography>
            <Typography variant='h6' color='inherit' className={classes.navBar}>
              <Button
                theme={theme}
                component={NavLink}
                to='/data-cleaning1'
                color='MuiButton'
                activeStyle={{ color: '#ffd700' }}
              >
                Data Cleaning1
              </Button>
              <Button component={NavLink} to='/data-cleaning2' activeStyle={{ color: '#ffd700' }}>
                Data Cleaning2
              </Button>
              <Button component={NavLink} to='/data-cleaning3' activeStyle={{ color: '#ffd700' }}>
                Data Cleaning3
              </Button>
              <Button component={NavLink} to='/classification' activeStyle={{ color: '#ffd700' }}>
                Classification
              </Button>
            </Typography>
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
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
