import React from 'react';
// import { CsvToHtmlTable } from 'react-csv-to-table';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

function DataTable(props) {
  const { classes, outputStr } = props;
  const outputArr = outputStr.split('\n').map(function(row) {
    return row.split(',');
  });
  outputArr.unshift(['', '遮陰網', '內循環扇', '天窗', '捲揚1', '捲揚2']);
  function cellRenderer({ columnIndex, key, rowIndex, style }) {
    return (
      <div key={key} style={style}>
        {outputArr[rowIndex][columnIndex]}
      </div>
    );
  }
  const fixedWidthColumns = {
    0: 200
  };
  const getColumnWidthHelper = getColumnWidth => ({ index }) =>
    fixedWidthColumns.hasOwnProperty(index) ? fixedWidthColumns[index] : getColumnWidth({ index });

  return (
    <Paper className={classes.paper}>
      <AutoSizer>
        {({ height, width }) => (
          <ColumnSizer columnMaxWidth={200} columnMinWidth={50} columnCount={outputArr[0].length} width={width - 200}>
            {({ adjustedWidth, getColumnWidth, registerChild }) => (
              <Grid
                ref={registerChild}
                cellRenderer={cellRenderer}
                columnCount={outputArr[0].length}
                // columnWidth={index => (index === 0 ? 200 : 50)}
                // estimatedColumnSize={450}
                // columnWidth={getColumnWidth}
                columnWidth={getColumnWidthHelper(getColumnWidth)}
                height={height}
                rowCount={outputArr.length}
                rowHeight={30}
                width={width}
              />
            )}
          </ColumnSizer>
        )}
      </AutoSizer>
    </Paper>
  );
}

const styles = {
  paper: {
    width: '100%',
    height: '300px',
    padding: '20px 40px'
  }
};
export default withStyles(styles)(DataTable);
