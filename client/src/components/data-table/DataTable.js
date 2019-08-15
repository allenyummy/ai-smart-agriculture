import React from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';

function DataTable(props) {
  const { classes } = this.props;
  const outputArr = props.outputStr.split('\n').map(function(row) {
    return row.split(',');
  });
  return (
    <Paper className={classes.paper}>
      <CsvToHtmlTable data={props.outputData} csvDelimiter="," tableClassName="table table-striped table-hover" />
    </Paper>
  );
}

const styles = {
  paper: {
    width: '100%',
    padding: '20px 40px'
  }
};
export default withStyles(styles)(DataTable);
