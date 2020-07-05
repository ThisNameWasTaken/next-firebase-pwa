import React from 'react';
import { useInView } from 'react-intersection-observer';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: 'auto',
    zIndex: 1,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
    willChange: 'opacity',
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  imageVisible: {
    opacity: 1,
  },
  preview: {
    maxWidth: '100%',
    maxHeight: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    zIndex: 0,
  },
}));

// TODO: Pass width & height attributes so that the preview takes some space
/**
 * @param {{
 *  sources: {[key: number]: { initial: string, webp: string }}
 *  preview: string,
 *  alt: string,
 *  width: number,
 *  height: number
 * }} param0
 */
const Image = ({
  sources = undefined,
  preview,
  alt,
  width,
  height,
  ...otherProps
}) => {
  const maxSize =
    sources &&
    Math.max(...Object.keys(sources).map(size => parseInt(size) || 0));

  const sizes =
    sources &&
    Object.keys(sources).sort(
      (a, b) => (parseInt(a) || 0) - (parseInt(b) || 0)
    );

  const classes = useStyles();

  const [ref, inView] = useInView();

  return (
    <picture ref={ref} {...otherProps} className={classes.root}>
      <div
        className={classes.preview}
        style={{ backgroundImage: `url(${preview})`, width, height }}
      />
      {sources &&
        sizes.map(size => (
          <>
            <source
              srcSet={inView && sources[size].initial}
              media={`(min-width: ${size}px)`}
            />
            <source
              srcSet={inView && sources[size].webp}
              media={`(min-width: ${size}px)`}
            />
          </>
        ))}
      <img
        className={clsx(classes.image, inView && classes.imageVisible)}
        src={sources ? inView && sources[maxSize].initial : ''}
        alt={alt}
        width={width}
        height={height}
      />
    </picture>
  );
};

export default Image;