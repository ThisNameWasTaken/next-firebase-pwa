import { createMuiTheme } from '@material-ui/core/styles';

import sharedThemeProps from './shared-theme-props';

const darkTheme = createMuiTheme({
  ...sharedThemeProps,
  palette: {
    type: 'dark',
    primary: {
      main: '#e0c3fc',
    },
    secondary: {
      main: '#fd868c',
    },
    background: {
      default: '#2D3436',
    },
  },
});

export default darkTheme;
