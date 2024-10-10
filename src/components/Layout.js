import React from 'react';
import { Container } from 'semantic-ui-react';

import './Layout.css';

const Layout = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  );
};

export default Layout;