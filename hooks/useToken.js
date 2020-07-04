import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cookies from 'js-cookie';

import { useFirebase } from './useFirebase';

const useToken = () => {
  const [token, setToken] = useState();
  const router = useRouter();
  const firebase = useFirebase();

  useEffect(() => {
    const cookie = cookies.get('token');
    if (!cookie) {
      router.push('/sign-in');
    }
  }, []);

  return token;
};

export { useToken as useUser };
