import useSWR from 'swr';
import Link from 'next/link';
import withPrivateRoute from '../hocs/withPrivateRoute';

const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then(res => res.json());

const Index = props => {
  const { token } = props;
  const { data, error } = useSWR(['/api/getFood', token], fetcher);

  return (
    <div>
      <div>
        <p>Your token is {token}</p>
      </div>
      <div>
        <Link href={'/example'}>
          <a>Another example page</a>
        </Link>
      </div>
      {error && <div>Failed to fetch food!</div>}
      {data ? (
        <div>Your favorite food is {data.food}.</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default withPrivateRoute(Index);
