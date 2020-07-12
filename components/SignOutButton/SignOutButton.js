import { IconButton } from '@material-ui/core';

import SignOutIcon from './SignOutIcon';
import { useFirebase } from '../../hooks/useFirebase';
import { useStyles } from './styles';
import { useRouter } from 'next/router';

const SignOutButton = props => {
  const classes = useStyles();
  const firebase = useFirebase();
  const router = useRouter();

  async function signOut() {
    const auth = await firebase.auth();

    auth.signOut();
    router.push('/sign-in');
  }

  return (
    <IconButton
      aria-label="log out"
      color="inherit"
      onClick={signOut}
      {...props}
    >
      <SignOutIcon className={classes.icon} />
    </IconButton>
  );
};

export default SignOutButton;
