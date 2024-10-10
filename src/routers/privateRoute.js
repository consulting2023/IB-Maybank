import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({
  redirectTo,
  notBlocked,
}) {

  const isAuth = localStorage.getItem('info');
  return (isAuth && notBlocked) ? <Outlet/> : <Navigate to={redirectTo} />;
}

PrivateRoute.propTypes = {
  redirectTo: PropTypes.string,
  notBlocked: PropTypes.bool,
};

PrivateRoute.defaultProps = {
  redirectTo: '/',
  notBlocked: true,
};

export default PrivateRoute;