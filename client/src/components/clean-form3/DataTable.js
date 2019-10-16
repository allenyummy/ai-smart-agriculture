import React from 'react';
// import { CsvToHtmlTable } from 'react-csv-to-table';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
  const fixWidth = {};
  for (let i = 0; i < 40; i++) {
    fixWidth[i] = 180;
  }
  const fixedWidthColumnsMap = {
    'Merge regular time': { 0: 200, 9: 180, 10: 170 },
    'Output statistics1': {},
    'Output statistics2': fixWidth
  };
  const getColumnWidthHelper = getColumnWidth => ({ index }) => {
    return fixedWidthColumnsMap[props.title].hasOwnProperty(index)
      ? fixedWidthColumnsMap[props.title][index]
      : getColumnWidth({ index });
  };

  return (
    <div className={classes.wrapper} style={{ flex: '1 1 auto' }}>
      <AutoSizer>
        {({ height, width }) => (
          <ColumnSizer
            columnMaxWidth={500}
            columnMinWidth={70}
            columnCount={outputArr[0].length}
            width={width}
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
                width={adjustedWidth}
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
