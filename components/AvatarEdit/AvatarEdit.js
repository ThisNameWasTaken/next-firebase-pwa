import React, { useState, useEffect } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Photo } from '@material-ui/icons';
import getSrcFromImageFile from '../../utils/getSrcFromImageFile';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: '50%',
    height: 'auto',
    zIndex: 0,
    color: 'rgba(0, 0, 0, .55)',
  },
  image: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    zIndex: 1,
  },
}));

const AvatarEdit = ({ className = '', inputRef, ...otherProps }) => {
  const classes = useStyles();
  const [src, setSrc] = useState(null);

  async function updateImagePreview() {
    try {
      const src = await getSrcFromImageFile(inputRef.current.files[0]);
      setSrc(src);
    } catch (err) {
      requestAnimationFrame(updateImagePreview);
    }
  }

  useEffect(() => {
    updateImagePreview();
    inputRef.current.addEventListener('change', updateImagePreview);
  }, []);

  return (
    <Paper
      className={clsx(classes.root, className)}
      {...otherProps}
      variant="outlined"
      square
    >
      <Photo className={classes.icon} />
      <img className={classes.image} src={src} />
    </Paper>
  );
};

export default AvatarEdit;
