import React from 'react';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function UploadInput(props) {
  const { classes } = props;
  return (
    <>
      <input
        type="file"
        name={props.name}
        accept={props.accept}
        style={{ display: 'none' }}
        id={props.name}
        onChange={props.onChange}
      />
      <div className={classes.label}>
        <Button className={classes.upload} variant="contained" component="label" htmlFor={props.name}>
          {props.showText}
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>
        <span style={{ display: 'inline-block' }}>{showText(props.file)}</span>
      </div>
    </>
  );
}

function showText(file) {
  return file ? <span>File Selected - {file.name}</span> : <span>No file selected...</span>;
}
const styles = {
  rightIcon: {
    marginLeft: '5px'
  },
  upload: { padding: '5px 10px', marginRight: '8px', minWidth: '40%', textTransform: 'none' },
  label: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  }
};

export default withStyles(styles)(UploadInput);
