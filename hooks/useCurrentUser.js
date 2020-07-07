import { get as getCookie } from 'js-cookie';
import useUser from './userUser';

const useCurrentUser = () => useUser(getCookie('uid'));

export default useCurrentUser;
