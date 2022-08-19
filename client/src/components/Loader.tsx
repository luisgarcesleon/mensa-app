import * as React from 'react';

export const Loader: React.FC = ({ children }) => (
     <div className="loader">
          <div />
          <p>{children ? children : 'Loading...'}</p>
     </div>
)