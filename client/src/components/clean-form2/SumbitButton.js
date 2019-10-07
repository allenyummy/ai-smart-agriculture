import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';

function SubmitButton(props) {
  const { classes, success, loading } = props;

  // const [loading, setLoading] = React.useState(false);
  // const [success, setSuccess] = React.useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.button]: true
  });

  return (
    <div className={classes.wrapper}>
      <Button
        className={buttonClassname}
        variant="contained"
        color="primary"
        onClick={props.onSubmit}
        disabled={loading}
      >
        Submit
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
}

const styles = {
  button: {
    width: '100%'
  },
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  wrapper: {
    margin: '30px 3px 3px 3px',
    position: 'relative'
  },
  buttonSuccess: {
    color: 'secondary'
    // backgroundColor: green[500],
    // '&:hover': {
    //   backgroundColor: green[300]
    // }
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

export default withStyles(styles)(SubmitButton);
