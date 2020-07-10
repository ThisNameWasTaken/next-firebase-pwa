import React, { useState, useEffect, forwardRef, useRef } from 'react';
import {
  makeStyles,
  Card,
  CardActionArea,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import clsx from 'clsx';
import { Photo } from '@material-ui/icons';
import getSrcFromImageFile from '../../utils/getSrcFromImageFile';

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'block',
  },
  cardActionArea: {
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
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
    minWidth: '100%',
    minHeight: '100%',
    height: 'auto',
    zIndex: 1,
  },
  helperText: {
    textAlign: 'center',
  },
}));

const AvatarEdit = ({ className = '', register, ...otherProps }) => {
  const classes = useStyles();
  const [src, setSrc] = useState(null);

  const inputRef = useRef(null);

  async function updateImagePreview() {
    try {
      const src = await getSrcFromImageFile(inputRef.current?.files[0]);
      setSrc(src);
    } catch (err) {
      requestAnimationFrame(updateImagePreview);
    }
  }

  useEffect(() => {
    updateImagePreview();
    inputRef.current?.addEventListener('change', updateImagePreview);

    return function cleanup() {
      inputRef.current?.removeEventListener('change', updateImagePreview);
    };
  }, []);

  return (
    <>
      <Card
        className={clsx(classes.card, className)}
        variant="outlined"
        square
        {...otherProps}
      >
        <CardActionArea
          className={classes.cardActionArea}
          component="label"
          htmlFor="avatar-input"
        ></CardActionArea>
        <Photo className={classes.icon} />
        <img className={classes.image} src={src} />
        <input
          id="avatar-input"
          accept="image/*"
          type="file"
          name="avatar"
          hidden
          ref={ref => {
            inputRef.current = ref;
            register(ref);
          }}
        />
      </Card>
      <FormHelperText className={classes.helperText}>
        {src
          ? 'Tap again on the image to change it'
          : 'Tap on the icon to upload an image'}
      </FormHelperText>
    </>
  );
};
export default AvatarEdit;
