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
 *  width: number | string,
 *  height: number | string
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
  const minWidth = Math.min(
    ...Object.keys(sources).map(size => parseInt(size) || 0)
  );

  function getSizeLimit(width) {
    if (typeof width === 'number') return width < minWidth ? minWidth : width;

    if (width.startsWith('max')) {
      return Infinity;
    }

    if (width.startsWith('min')) {
      const matches = width.match(/(\d+)px/);

      if (matches && matches[1]) {
        const width = parseFloat(matches[1]);

        return width < minWidth ? minWidth : width;
      }

      return Infinity;
    }
  }

  const sizeLimit = getSizeLimit(width);

  console.log({ sizeLimit });

  const maxSize =
    sources &&
    Math.max(
      ...Object.keys(sources)
        .map(size => parseInt(size) || 0)
        .filter(size => size <= sizeLimit)
    );

  const sizes =
    sources &&
    Object.keys(sources)
      .sort((a, b) => (parseInt(b) || 0) - (parseInt(a) || 0))
      .filter(size => parseFloat(size) <= sizeLimit);

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
