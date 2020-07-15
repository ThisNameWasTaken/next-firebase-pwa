import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Card,
  CardActionArea,
  FormHelperText,
} from '@material-ui/core';
import clsx from 'clsx';
import { Photo } from '@material-ui/icons';

// import * as tf from '@tensorflow/tfjs';
// import * as mobilenet from '@tensorflow-models/mobilenet';

import getSrcFromImageFile from '../../utils/getSrcFromImageFile';

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'block',
    borderRadius: 8,
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
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,

    '& > div': {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
  },
  image: {
    position: 'absolute',
    objectFit: 'cover',
    display: 'block',
    width: '100%',
    height: '100%',
  },
  helperText: {
    textAlign: 'center',
    fontSize: '1rem',
  },
}));

const AvatarEdit = ({
  className = '',
  register,
  src: _src = undefined,
  onSrcUpdate = src => {},
  ...otherProps
}) => {
  const classes = useStyles();
  const [src, setSrc] = useState(_src);
  const [alt, setAlt] = useState();

  const inputRef = useRef(null);
  const imageRef = useRef(null);

  async function updateImagePreview() {
    try {
      const src = await getSrcFromImageFile(inputRef.current?.files[0]);
      setSrc(src);

      // const model = await mobilenet.load({
      //   version: 2,
      //   alpha: 1,
      // });
      // const predictions = await model.classify(imageRef.current);

      const img = new Image();
      img.src = src;
      img.addEventListener('load', event => {
        console.log(img.width, img.height);

        const canvasWorker = new Worker('/canvas.worker.js');

        const canvas = document.createElement('canvas');

        document.body.appendChild(canvas);

        canvas.width = img.width;
        canvas.height = img.height;

        const offscreenCanvas = canvas.transferControlToOffscreen();

        createImageBitmap(img, 0, 0, img.width, img.height)
          .then(imageBitmap => {
            canvasWorker.postMessage({ canvas: offscreenCanvas, imageBitmap }, [
              offscreenCanvas,
              imageBitmap,
            ]);
          })
          .catch(console.error);
      });

      onSrcUpdate(src);

      setAlt('media');
      console.log('');
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
          aria-label="tap to upload a photo or change the selected one"
        ></CardActionArea>
        <Photo className={classes.icon} />
        <div className={classes.imageContainer}>
          <div>
            <img ref={imageRef} className={classes.image} src={src} alt={alt} />
          </div>
        </div>
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
        <input
          id="avatar-alt"
          type="text"
          name="alt"
          hidden
          value={alt}
          ref={ref => {
            register(ref);
          }}
        />
      </Card>
      <FormHelperText className={classes.helperText}>
        {src
          ? 'Tap on the image to change it'
          : 'Tap on the icon to upload an image'}
      </FormHelperText>
    </>
  );
};
export default AvatarEdit;
