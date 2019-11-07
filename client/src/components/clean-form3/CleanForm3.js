import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withTheme } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

import UploadInput from './UploadInput';
import SubmitButton from './SumbitButton';
import DownloadButton from './DownloadButton';
// import DataTable from './DataTable';
import DataTable from './DataTable';
import Button from '@material-ui/core/Button';

import PieChart from './PieChart';
import Typography from '@material-ui/core/Typography';
const fs = require('fs');

const httpClient = axios.create();
httpClient.defaults.timeout = 60 * 25 * 1000;

class CleanForm3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merge_irregular_time_data: '',
      outputStr: '',
      loading: false,
      success: false
    };
  }

  onChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ [e.target.name]: e.target.files[0] });
    }
  };

  onSubmit = async e => {
    e.preventDefault();
    if (!this.state.merge_irregular_time_data) {
      alert('Please upload file first!');
      return;
    }
    const url = '/api/clean3';
    const formData = new FormData();
    formData.append('merge_irregular_time_data', this.state.merge_irregular_time_data);

    this.setState({ loading: true, success: false });
    const result = await httpClient.post(url, formData);
    let resultArr = result.data.slice(0, 3).map((result, index) =>
      index === 0
        ? result.split('\n').map(function(row) {
            row = row.replace(/\"\[(\d+),\s(\d+),\s(\d+)\]\"/g, '[$1;$2;$3]');
            return row.split(',');
          })
        : result.split('\n').map(function(row) {
            return row.split(',');
          })
    );
    this.setState({
      outputStrs: result.data,
      outputArrs: resultArr,
      loading: false,
      success: true
    });
  };

  onDownload = (idx, name) => {
    let data = new Blob([this.state.outputStrs[idx]], { type: 'text/csv' });
    let csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', `${name}.csv`);
    tempLink.click();
  };

  render() {
    const { classes } = this.props;
    const fileNameArr = ['merge_regular_time.csv', 'output_statistics1.csv', 'output_statistics2'];
    const titleArr = ['Merge regular time', 'Output statistics1', 'Output statistics2'];
    // const pie1Data = this.state.outputArrs
    //   ? {
    //       series: this.state.outputArrs[1].map(row => parseInt(row[1], 10)).slice(1, -1),
    //       labels: this.state.outputArrs[1].map(row => row[0]).slice(1, -1)
    //     }
    //   : null;
    // const pie2Data = this.state.outputArrs
    //   ? {
    //       series: this.state.outputArrs[2][this.state.outputArrs[2].length - 2]
    //         .slice(1)
    //         .map(num => parseInt(num)),
    //       labels: this.state.outputArrs[2][0].slice(1)
    //     }
    //   : null;

    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <form>
            <UploadInput
              file={this.state.merge_irregular_time_data}
              onChange={this.onChange}
              name='merge_irregular_time_data'
              showText='Upload Merge Irregular Time Data'
              accept='.csv'
            />

            <SubmitButton
              onSubmit={this.onSubmit}
              success={this.state.success}
              loading={this.state.loading}
            />

            {/* {this.state.outputArrs
              ? [0, 1, 2].map(idx => (
                  <DownloadButton key={idx} onDownload={() => this.onDownload(idx)} fileName={fileNameArr[idx]} />
                ))
              : ''} */}
          </form>
        </Paper>

        <Paper className={classes.downloadPaper}>
          <div className={classes.downloadContainer}>
            <Button
              className={classes.download}
              component='a'
              variant='contained'
              href='./files/clean3-ex.csv'
              download='example_merge_irregular_time_data.docx'
            >
              Example File
            </Button>
          </div>
        </Paper>
        {this.state.outputArrs ? (
          <Paper className={classes.paper}>
            {this.state.outputArrs.map((outputArr, idx) => (
              <div>
                <Typography variant='h6' className={classes.title} align='center'>
                  {titleArr[idx]}
                </Typography>
                <Paper className={classes.paper}>
                  <div className={classes.dataContainer}>
                    {/* <DataTable
                        key={idx}
                        outputArr={outputArr}
                        className={classes.dataTable}
                        title={titleArr[idx]}
                      /> */}
                    <DataTable outputArr={outputArr} title={titleArr[idx]} />
                  </div>
                  <DownloadButton
                    key={idx}
                    onDownload={() => this.onDownload(idx, fileNameArr[idx])}
                    fileName={fileNameArr[idx]}
                  />
                </Paper>
              </div>
            ))}
          </Paper>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const styles = {
  title: { marginTop: '25px' },
  paper: {
    width: '90%',
    padding: '20px 40px',
    margin: '20px 0 10px 0'
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  downloadPaper: {
    width: '90%',
    padding: '20px 40px',
    margin: '10px 0',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  downloadContainer: {
    width: '50%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  download: {
    width: '80%',
    margin: '10px 0'
  },
  title: {
    width: '100%',
    alignContent: 'center',
    margin: '20px 0 -15px 0'
  }
};

export default withStyles(styles)(withTheme(CleanForm3));
