import { createMuiTheme } from '@material-ui/core/styles';

import sharedThemeProps from './shared-theme-props';

const lightTheme = createMuiTheme({
  ...sharedThemeProps,
  palette: {
    type: 'light',
    primary: {
      main: '#8338EC',
    },
    secondary: {
      main: '#FFBE0B',
    },
    background: {
      default: '#FFFFFF',
    },
  },
});

export default lightTheme;
