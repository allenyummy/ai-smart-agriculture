import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withTheme } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

import UploadInput from './UploadInput';
import SubmitButton from './SumbitButton';
import DownloadButton from './DownloadButton';
import DataTable from '../data-table/DataTable';
import PretrainedButton from './PretrainedButton';
import AccuracyTable from './AccuracyTable';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const httpClient = axios.create();
httpClient.defaults.timeout = 60 * 25 * 1000;

class PredictForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFile: '',
      modelFile: '',
      outputStr: '',
      loading: false,
      success: false,
      pretrainedModel: ''
    };
  }

  onChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ [e.target.name]: e.target.files[0] });
    }
  };

  onSubmit = async e => {
    e.preventDefault();
    if (this.state.pretrainedModel) {
      await this.onSubmitPretrainedModel(e, this.state.pretrainedModel);
    }
    if (!this.state.inputFile || !this.state.modelFile) {
      alert('Please upload file first!');
      return;
    }
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
    // const result = await axios.post(url, formData, config);
    const result = await httpClient.post(url, formData, config);
    let resultArr = result.data.split('\n').map(function(row) {
      return row.split(',');
    });
    resultArr.unshift(['', '遮陰網', '內循環扇', '天窗', '捲揚1', '捲揚2']);
    this.setState({
      outputStr: result.data,
      outputArr: resultArr,
      loading: false,
      success: true
    });
  };

  onSelectPretrainedModel = (e, model) => {
    this.setState({ pretrainedModel: model });
    this.setState({ modelFile: { name: model } });
  };

  onSubmitPretrainedModel = async (e, model) => {
    e.preventDefault();
    if (!this.state.inputFile) {
      alert('Please upload file first!');
      return;
    }
    const url = '/api/predictPretrain';
    const formData = new FormData();
    formData.append('inputFile', this.state.inputFile);
    formData.append('model', model);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    this.setState({ loading: true, success: false });
    const result = await httpClient.post(url, formData, config);
    let resultArr = result.data.split('\n').map(function(row) {
      return row.split(',');
    });
    resultArr.unshift(['', '遮陰網', '內循環扇', '天窗', '捲揚1', '捲揚2']);

    this.setState({
      outputStr: result.data,
      outputArr: resultArr,
      loading: false,
      success: true
    });
  };

  onDownload = () => {
    let data = new Blob([this.state.outputStr], { type: 'text/csv' });
    let csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'predict-output.csv');
    tempLink.click();
  };

  render() {
    const { classes } = this.props;
    const pretrainedModelArr = ['RF', 'DT', 'XGB', 'LSTM'];
    return (
      <div className={classes.wrapper}>
        <Paper className={(classes.paper, classes.large)}>
          <form>
            <UploadInput
              file={this.state.inputFile}
              onChange={this.onChange}
              name='inputFile'
              showText='Upload Cleaned Data'
              accept='.csv'
            />
            <UploadInput
              file={this.state.modelFile}
              onChange={this.onChange}
              name='modelFile'
              showText='Upload Model File'
            />
            <div className={classes.pretrainedWrapper}>
              {pretrainedModelArr.map(model => (
                <PretrainedButton
                  onSubmit={e => this.onSelectPretrainedModel(e, model)}
                  success={this.state.success}
                  loading={this.state.loading}
                  key={model}
                  model={model}
                />
              ))}
            </div>
            <div className={classes.pretrainedText}>
              (輸入時間點 = 6，即5分鐘1筆之整合感測資料，取30分鐘作為輸入) <br />
              (輸入特徵點 = 10，即除了四個土壤感測值之外的其餘感測值)
            </div>
            <SubmitButton
              onSubmit={this.onSubmit}
              success={this.state.success}
              loading={this.state.loading}
            />
            {this.state.outputStr ? <DownloadButton onDownload={this.onDownload} /> : ''}
          </form>
          <div className={classes.dataTable}>
            {this.state.outputArr ? (
              <>
                <Typography variant='h6' className={classes.title} align='center'>
                  Result Table
                </Typography>
                <DataTable outputArr={this.state.outputArr} />
              </>
            ) : (
              ''
            )}
          </div>
        </Paper>

        <Paper className={classes.paper}>
          <AccuracyTable />

          <Typography variant='h6' className={classes.title} align='center'>
            Data
          </Typography>
          <div className={classes.downloadContainer}>
            <Button
              className={classes.download}
              component='a'
              variant='contained'
              href='./files/clean_data_des.docx'
              download='clean_data_description.docx'
            >
              Format Description
            </Button>
            <Button
              className={classes.download}
              component='a'
              variant='contained'
              href='files/clean_data_ex.csv'
              download='clean_data_example.csv'
            >
              Example File
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

const styles = {
  large: {
    width: '55%',
    padding: '20px 10px',
    marginBottom: '20px'
  },
  paper: {
    width: '40%',
    padding: '20px 10px',
    marginBottom: '20px'
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pretrainedWrapper: {
    width: '40%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  pretrainedText: {
    width: '40%',
    margin: '10px 0 0 0',
    fontSize: '14px'
  },
  dataTable: {
    padding: '20px 40px'
  },
  title: { margin: '10px 0' },
  downloadContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  download: { width: '40%' }
};

export default withStyles(styles)(withTheme(PredictForm));
