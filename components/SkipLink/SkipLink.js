import React from 'react';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
import { useStyles } from './styles';

const SkipLink = ({ className = '', ...otherProps }) => {
  const classes = useStyles();

  return (
    <Button
      variant="text"
      color="primary"
      className={clsx(classes.skipLink, className)}
      size="large"
      {...otherProps}
    />
  );
};

export default SkipLink;
