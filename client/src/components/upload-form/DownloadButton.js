import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

function DownloadButton(props) {
  const { classes } = props;
  return (
    <>
      <Button
        className={classes.download}
        variant="contained"
        color="secondary"
        // href={'data:attachment/csv' + encodeURIComponent(this.state.outputFile)}
        // href="/api/predict" // directly donwload static output data
        onClick={props.onDownload}
      >
        Download
      </Button>
    </>
  );
}

const styles = {
  download: {
    marginTop: '20px',
    width: '100%'
  }
};

export default withStyles(styles)(DownloadButton);
