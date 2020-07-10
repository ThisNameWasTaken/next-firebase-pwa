/** @type {import("@material-ui/core").ThemeOptions} */
const sharedThemeProps = {
  typography: {
    fontFamily: ['Nunito', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    fontWeightLight: 400,
    fontWeightMedium: 600,
    fontWeightBold: 800,
    button: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 36,
  },
  overrides: {
    MuiButton: {
      outlined: {
        borderWidth: 2,
      },
    },
    MuiMenu: {
      paper: {
        borderRadius: 8,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: 12,
      },
    },
  },
};

export default sharedThemeProps;
