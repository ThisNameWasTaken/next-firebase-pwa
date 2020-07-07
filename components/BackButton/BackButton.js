import { useRouter } from 'next/router';
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

const BackButton = () => {
  const router = useRouter();

  return (
    <IconButton aria-label="back" color="primary" onClick={router.back}>
      <ArrowBack />
    </IconButton>
  );
};

export default BackButton;
