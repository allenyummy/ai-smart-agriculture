import React from 'react';
import flow1 from './flow1.png';
import flow2 from './flow2.png';
import { withStyles } from '@material-ui/core/styles';

const Home = props => {
  const { classes } = props;
  return (
    <div className={classes.container}>
      <img src={flow1} className={classes.image}></img>
      <img src={flow2} className={classes.image}></img>
    </div>
  );
};
const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: { width: '45%' }
};
export default withStyles(styles)(Home);
