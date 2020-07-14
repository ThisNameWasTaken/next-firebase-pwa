import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  skipLink: {
    position: 'fixed',
    top: '-9999vh',
    left: '-9999vw',
    width: 1,
    height: 1,
    zIndex: 9999,
    background: theme.palette.background.default,
    boxShadow:
      '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    borderRadius: 4,

    '&:focus, &:active': {
      top: theme.spacing(2),
      left: theme.spacing(1),
      width: 'auto',
      height: 'auto',
    },
  },
}));

export { useStyles };
