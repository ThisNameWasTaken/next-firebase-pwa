import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { IconButton } from '@material-ui/core';

import EditUserIcon from './EditUserIcon';
import { useStyles } from './styles';
import useCurrentUser from '../../hooks/useCurrentUser';

const EditUserDialog = dynamic(() => import('../EditUserDialog'), {
  ssr: false,
});

const EditUserButton = props => {
  const classes = useStyles();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const currentUser = useCurrentUser();

  function openEditDialog() {
    setIsEditDialogOpen(true);
  }

  function closeEditDialog() {
    setIsEditDialogOpen(false);
  }

  return (
    <>
      <Head>
        <link
          rel="prefetch"
          href={currentUser?.avatar?.sources[720]?.initial}
        />
      </Head>

      <IconButton
        aria-label="log out"
        color="inherit"
        onClick={openEditDialog}
        {...props}
      >
        <EditUserIcon className={classes.icon} />
      </IconButton>

      <EditUserDialog
        open={isEditDialogOpen}
        onAccept={closeEditDialog}
        onReject={closeEditDialog}
        src={currentUser?.avatar?.sources[720]?.initial}
        name={currentUser?.name}
        userId={currentUser?.id}
      />
    </>
  );
};

export default EditUserButton;
