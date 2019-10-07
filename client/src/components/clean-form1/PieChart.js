import ReactApexChart from 'react-apexcharts';
import React from 'react';
class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: props.labels,
        // title: {
        //   text: 'Number of leads'
        // },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 250
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      },
      series: props.series
    };
  }

  render() {
    return (
      <div id='chart' style={{ width: '80%' }}>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type='pie'
          width='100%'
        />
      </div>
    );
  }
}
export default PieChart;
