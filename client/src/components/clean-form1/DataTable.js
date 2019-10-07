import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  container: {
    width: '50%'
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  title: {
    alignContent: 'center'
  }
}));

function createData(accuracy, rf, dt, xgb, lstm) {
  return { accuracy, rf, dt, xgb, lstm };
}

const rows = [
  createData('Train set (#5504)', '99.7%', '99.7%', '78.2%', '70.6%'),
  createData('Test set (#1377)', '81.7%', '76.6%', '81.3%', '71.2%')
];

export default function SimpleTable(props) {
  const classes = useStyles();
  const headArr = props.outputArr[0];
  const bodyArr = props.outputArr.slice(1);
  console.log(bodyArr);

  return (
    <div className={classes.container}>
      <Typography variant='h6' className={classes.title} align='center'>
        {props.title}
      </Typography>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {headArr.map(head => (
                <TableCell align='center'>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {bodyArr.map((row, key) => (
              <TableRow key={key}>
                {row.map((item, key) => (
                  <TableCell align='center'>{item}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
