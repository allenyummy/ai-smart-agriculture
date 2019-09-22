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
  const fixedWidthColumns = {
    0: 200
  };
  const getColumnWidthHelper = getColumnWidth => ({ index }) =>
    fixedWidthColumns.hasOwnProperty(index) ? fixedWidthColumns[index] : getColumnWidth({ index });

  return (
    <div className={classes.wrapper}>
      <AutoSizer>
        {({ height, width }) => (
          <ColumnSizer
            columnMaxWidth={200}
            columnMinWidth={50}
            columnCount={outputArr[0].length}
            width={width - 200}
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
