import Link from 'next/link';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    transform: 'scale(3)',
  },
}));

const Example = props => {
  const classes = useStyles();

  return (
    <div>
      <p>
        This page is static because it does not fetch any data or include the
        authed user info.
      </p>
      <Link href="/" passHref>
        <Button
          className={classes.button}
          type="text"
          color="primary"
          component="a"
        >
          Home
        </Button>
      </Link>
    </div>
  );
};

export default Example;
