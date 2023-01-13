import React from 'react';

import classes from './style.module.css';

const Spinner: React.FC = () => {
  return (
    <div className={classes.ldsRing}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
