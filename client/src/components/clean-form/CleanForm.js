import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withTheme } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

import UploadInput from './UploadInput';
import SubmitButton from './SumbitButton';
import DownloadButton from './DownloadButton';
import DataTable from './DataTable';
import PieChart from './PieChart';
import Typography from '@material-ui/core/Typography';
const fs = require('fs');

const httpClient = axios.create();
httpClient.defaults.timeout = 60 * 25 * 1000;

class CleanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorData: '',
      actuatorData: '',
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
    if (!this.state.sensorData || !this.state.actuatorData) {
      alert('Please upload file first!');
      return;
    }
    const url = '/api/clean';
    const formData = new FormData();
    formData.append('sensorData', this.state.sensorData);
    formData.append('actuatorData', this.state.actuatorData);

    this.setState({ loading: true, success: false });
    const result = await httpClient.post(url, formData);
    let resultArr = result.data.map(result =>
      result.split('\n').map(function(row) {
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

  onDownload = idx => {
    let data = new Blob([this.state.outputStrs[idx]], { type: 'text/csv' });
    let csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'data-clean-output.csv');
    tempLink.click();
  };

  render() {
    const { classes } = this.props;
    const fileNameArr = ['compareData.csv', 'sensorData.csv', 'actuatorData.csv'];
    const titleArr = ['Comparison', 'Pivot SensorData', 'Pivot ActuatorData'];
    const pie1Data = this.state.outputArrs
      ? {
          series: this.state.outputArrs[1].map(row => parseInt(row[1], 10)).slice(1, -1),
          labels: this.state.outputArrs[1].map(row => row[0]).slice(1, -1)
        }
      : null;
    const pie2Data = this.state.outputArrs
      ? {
          series: this.state.outputArrs[2][this.state.outputArrs[2].length - 2]
            .slice(1)
            .map(num => parseInt(num)),
          labels: this.state.outputArrs[2][0].slice(1)
        }
      : null;

    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <form>
            <UploadInput
              file={this.state.sensorData}
              onChange={this.onChange}
              name='sensorData'
              showText='Upload Sensor Data'
              accept='.csv'
            />

            <UploadInput
              file={this.state.actuatorData}
              onChange={this.onChange}
              name='actuatorData'
              showText='Upload Actuator Data'
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
          {this.state.outputArrs
            ? this.state.outputArrs.map((outputArr, idx) => (
                <div>
                  <Paper className={classes.paper}>
                    <div className={classes.dataContainer}>
                      <DataTable
                        key={idx}
                        outputArr={outputArr}
                        className={classes.dataTable}
                        title={titleArr[idx]}
                      />
                      {idx === 1 ? (
                        <PieChart series={pie1Data.series} labels={pie1Data.labels} />
                      ) : null}
                      {idx === 2 ? (
                        <PieChart series={pie2Data.series} labels={pie2Data.labels} />
                      ) : null}
                    </div>
                    <DownloadButton
                      key={idx}
                      onDownload={() => this.onDownload(idx)}
                      fileName={fileNameArr[idx]}
                    />
                  </Paper>
                </div>
              ))
            : ''}
        </Paper>
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
  }
};

export default withStyles(styles)(withTheme(CleanForm));
