import React from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { makeStyles, useTheme } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  slide: {
    width: '100%',
    margin: 'auto',
    willChange: 'transform',
    transition: theme.transitions.create('transform'),
  },
  slideEnterFromLeft: {
    transform: 'translateX(-100%)',
  },
  slideEnterFromRight: {
    transform: 'translateX(100%)',
  },
  slideEnterActive: {
    transform: 'translateX(0%)',
  },
  slideExit: {
    transform: 'translateX(0%)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  slideExitFromLeftActive: {
    transform: 'translateX(100%)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  slideExitFromRightActive: {
    transform: 'translateX(-100%)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

const Slide = ({
  index,
  activeStep,
  prevActiveStep,
  className = '',
  ...otherProps
}) => {
  const theme = useTheme();
  const transitionDuration = theme.transitions.duration.standard;

  const classes = useStyles();

  function isSlidingForward() {
    return activeStep === index
      ? activeStep > prevActiveStep
      : activeStep < prevActiveStep;
  }

  return (
    <CSSTransition
      classNames={{
        enterActive: classes.slideEnterActive,
        enterDone: classes.slideEnterActive,
        exit: classes.slideExit,
        exitActive: isSlidingForward()
          ? classes.slideExitFromLeftActive
          : classes.slideExitFromRightActive,
      }}
      timeout={transitionDuration}
      in={activeStep === index}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={clsx(
          classes.slide,
          prevActiveStep !== -1 &&
            (isSlidingForward()
              ? classes.slideEnterFromRight
              : classes.slideEnterFromLeft)
        )}
        {...otherProps}
      />
    </CSSTransition>
  );
};

export default Slide;
