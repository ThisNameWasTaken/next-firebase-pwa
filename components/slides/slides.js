import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  slides: {
    position: 'relative',
  },
}));

const Slides = ({ className = '', ...otherProps }) => {
  const classes = useStyles();

  return <div className={clsx(classes.slides, className)} {...otherProps} />;
};

export default Slides;
