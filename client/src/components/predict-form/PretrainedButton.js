import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';

function PretrainedButton(props) {
  const { classes, success, loading } = props;

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.button]: true
  });

  return (
    <div className={classes.wrapper}>
      <Button className={buttonClassname} variant="contained" onClick={props.onSubmit} disabled={loading}>
        {props.model}
      </Button>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative'
  },
  button: {
    width: '23%'
  },
  root: {
    display: 'flex',
    alignItems: 'center'
  },

  buttonSuccess: {
    color: 'secondary'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
};

export default withStyles(styles)(PretrainedButton);
