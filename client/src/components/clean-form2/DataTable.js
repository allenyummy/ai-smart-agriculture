import React from 'react';
// import { CsvToHtmlTable } from 'react-csv-to-table';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

function DataTable(props) {
  const { classes, outputArr } = props;

  function cellRenderer({ columnIndex, key, rowIndex, style }) {
    return (
      <div key={key} style={style}>
        {outputArr[rowIndex][columnIndex]}
      </div>
    );
  }
  const fixedWidthColumns1 = {
    1: 200,
    5: 100,
    12: 100
  };
  const fixedWidthColumns2 = {
    3: 100,
    7: 100,
    11: 80,
    12: 80,
    13: 80,
    14: 80,
    15: 80,
    16: 80,
    17: 80,
    18: 80,
    19: 80,
    20: 80,
    21: 80,
    22: 80,
    23: 80,
    24: 80,
    29: 200
  };
  const getColumnWidthHelper = getColumnWidth => ({ index }) => {
    if (outputArr[0].length <= 17) {
      return fixedWidthColumns1.hasOwnProperty(index)
        ? fixedWidthColumns1[index]
        : getColumnWidth({ index });
    } else {
      return fixedWidthColumns2.hasOwnProperty(index)
        ? fixedWidthColumns2[index]
        : getColumnWidth({ index });
    }
  };

  return (
    <div className={classes.wrapper}>
      <AutoSizer>
        {({ height, width }) => (
          <ColumnSizer
            columnMaxWidth={500}
            columnMinWidth={50}
            columnCount={outputArr[0].length}
            width={width - 600}
          >
            {({ adjustedWidth, getColumnWidth, registerChild }) => (
              <Grid
                ref={registerChild}
                cellRenderer={cellRenderer}
                columnCount={outputArr[0].length}
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
    </div>
  );
}

const styles = {
  paper: {
    width: '100%',
    height: '400px',
    padding: '20px 40px',
    marginBottom: '20px'
  },
  wrapper: {
    width: '100%',
    height: '300px',
    padding: '0px'
  }
};
export default withStyles(styles)(DataTable);
