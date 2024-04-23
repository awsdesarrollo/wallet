/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from 'react';
import { Spinner as NSpinner } from '@nextui-org/react';
import { getCookie } from '../utils';
import { AuthService } from '../services';

export const AuthContext = createContext({
  user: null,
  isLogged: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const maybeHasSession = !!getCookie(process.env.REACT_APP_SESSION_NAME);

  const logout = () => {
    setUser(null);
    AuthService.logout();
  }

  useEffect(() => {
    setIsLoading(true);
    if (maybeHasSession) {
      AuthService.getProfile()
        .then(res => setUser(res?.user?.user))
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));

    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogged: maybeHasSession || !!user,
        login: setUser,
        logout,
        user,
      }}
    >
      {isLoading ? <Spinner /> : children}
    </AuthContext.Provider>
  )
}

const Spinner = () => (
  <div className="w-screen h-screen flex justify-center items-center">
    <NSpinner />
  </div>
);