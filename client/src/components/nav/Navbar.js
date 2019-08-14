import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  toolbar: {
    justifyContent: 'space-between'
  },
  title: {
    textDecoration: 'none'
  }
};

function Navbar(props) {
  const { classes } = props;
  return (
    <nav>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" className={classes.title}>
            AI Smart Agriculture
          </Typography>
        </Toolbar>
      </AppBar>
    </nav>
  );
}

export default withStyles(styles)(Navbar);
