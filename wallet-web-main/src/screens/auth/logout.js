import React, { useContext } from 'react';
import { AuthContext } from '../../context';

const Logout = () => {
  const auth = useContext(AuthContext);
  auth.logout();

  return <></>
}

export default Logout;