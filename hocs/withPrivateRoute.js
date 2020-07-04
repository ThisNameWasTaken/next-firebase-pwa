import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { get as getCookie } from 'js-cookie';

export default function withPrivateRoute(Component) {
  return () => {
    const token = getCookie('token');
    const router = useRouter();

    useEffect(() => {
      if (!token) router.push('/sign-in');
    }, []);

    return token ? <Component {...arguments} token={token} /> : <></>;
  };
}
