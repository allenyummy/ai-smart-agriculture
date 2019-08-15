import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withTheme } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';

import UploadInput from './UploadInput';
import SubmitButton from './SumbitButton';
import DownloadButton from './DownloadButton';
import DataTable from '../data-table/DataTable';

class UploadForm extends Component {
  constructor(props) {
    super(props);
    this.state = { inputFile: '', modelFile: '', outputStr: '', loading: false, success: false };
  }

  onChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ [e.target.name]: e.target.files[0] });
    }
  };

  onSubmit = async e => {
    e.preventDefault();

    const url = '/api/predict';
    const formData = new FormData();
    formData.append('inputFile', this.state.inputFile);
    formData.append('modelFile', this.state.modelFile);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    // axios.post(url, formData, config);
    this.setState({ loading: true, success: false });
    const result = await axios.post(url, formData, config);
    this.setState({ outputStr: result.data, loading: false, success: true });
  };

  onDownload = () => {
    let data = new Blob([this.state.outputStr], { type: 'text/csv' });
    let csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'output.csv');
    tempLink.click();
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Paper className={classes.paper}>
          <form>
            <UploadInput
              file={this.state.inputFile}
              onChange={this.onChange}
              name="inputFile"
              showText="Upload Cleaned Data"
              accept=".csv"
            />

            <UploadInput
              file={this.state.modelFile}
              onChange={this.onChange}
              name="modelFile"
              showText="Upload Model File"
            />

            <SubmitButton onSubmit={this.onSubmit} success={this.state.success} loading={this.state.loading} />
            {this.state.outputStr ? <DownloadButton onDownload={this.onDownload} /> : ''}
          </form>
        </Paper>

        {/* {this.state.outputStr ? <DataTable outputStr={this.state.outputStr} /> : ''} */}
        {/* <Paper>
          {this.state.outputStr ? (
            <CsvToHtmlTable
              data={this.state.outputStr}
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
  }
};

export default withStyles(styles)(withTheme(UploadForm));
