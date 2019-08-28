import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
}));

function createData(accuracy, rf, dt, xgb, lstm) {
  return { accuracy, rf, dt, xgb, lstm };
}

const rows = [
  createData('Train set (#5504)', '99.7%', '99.7%', '78.2%', '70.6%'),
  createData('Test set (#1377)', '81.7%', '76.6%', '81.3%', '71.2%')
];

export default function SimpleTable() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Accuracy</TableCell>
            <TableCell align="right">RF</TableCell>
            <TableCell align="right">DT</TableCell>
            <TableCell align="right">XGB</TableCell>
            <TableCell align="right">LSTM</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.accuracy}
              </TableCell>
              <TableCell align="right">{row.rf}</TableCell>
              <TableCell align="right">{row.dt}</TableCell>
              <TableCell align="right">{row.xgb}</TableCell>
              <TableCell align="right">{row.lstm}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
