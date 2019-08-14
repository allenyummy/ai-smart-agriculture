import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { withTheme } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';

class UploadForm extends Component {
  constructor(props) {
    super(props);
    this.state = { inputFile: '', modelFile: '', outputFile: '' };
  }

  onChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ [e.target.name]: e.target.files[0] });
    }
    console.log(this.state.inputFile);
  };

  showText = file => {
    return file ? <span>File Selected - {file.name}</span> : <span>No file selected...</span>;
  };

  onFormSubmit = async e => {
    e.preventDefault();

    // const result = await axios.get('api/test');
    // console.log(result.data);
    // this.setState({ outputFile: result.data });

    const url = '/api/predict';
    const formData = new FormData();
    formData.append('inputFile', this.state.inputFile);
    formData.append('modelFile', this.state.modelFile);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    axios.post(url, formData, config);
    // const result = await axios.post(url, formData, config);
    // console.log('Post success!');
    // this.setState({ outputFile: result.data });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Paper className={classes.paper}>
          <form onSubmit={this.onFormSubmit}>
            <input
              type="file"
              name="inputFile"
              accept=".csv"
              style={{ display: 'none' }}
              id="input-file-input"
              onChange={this.onChange}
            />
            <div className={classes.label}>
              <Button className={classes.upload} variant="contained" component="label" htmlFor="input-file-input">
                Upload Cleaned Data
                <CloudUploadIcon className={classes.rightIcon} />
              </Button>
              <span style={{ display: 'inline-block' }}>{this.showText(this.state.inputFile)}</span>
            </div>
            <br />

            <input
              type="file"
              name="modelFile"
              style={{ display: 'none' }}
              id="model-file-input"
              onChange={this.onChange}
            />
            <div className={classes.label}>
              <Button className={classes.upload} variant="contained" component="label" htmlFor="model-file-input">
                Upload Model File
                <CloudUploadIcon className={classes.rightIcon} />
              </Button>
              <span style={{ display: 'inline-block' }}>{this.showText(this.state.modelFile)}</span>
            </div>
            <br />

            <input type="submit" style={{ display: 'none' }} id="raised-button-submit" />
            <Button
              className={classes.submit}
              variant="contained"
              color="primary"
              component="label"
              htmlFor="raised-button-submit"
            >
              Submit
            </Button>
            <Button
              className={classes.download}
              variant="contained"
              color={this.props.theme.jason}
              // href={'data:attachment/csv' + encodeURIComponent(this.state.outputFile)}
              href="/api/predict"
            >
              Download
            </Button>
          </form>
        </Paper>
        {/* <Paper>
          {this.state.outputFile ? (
            <CsvToHtmlTable
              data={this.state.outputFile}
              csvDelimiter=","
              tableClassName="table table-striped table-hover"
            />
          ) : (
            ''
          )}
        </Paper> */}
      </>
    );
  }
}

const styles = {
  paper: {
    width: '100%',
    padding: '20px 40px'
  },
  rightIcon: {
    marginLeft: '5px'
  },
  upload: { padding: '5px 10px', marginRight: '8px', minWidth: '40%', textTransform: 'none' },
  label: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  submit: {
    marginTop: '20px',
    width: '100%'
  },
  download: {
    marginTop: '20px',
    width: '100%'
    // color: theme.palette.jason
  }
};

export default withStyles(styles)(withTheme(UploadForm));
