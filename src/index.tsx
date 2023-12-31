import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { Routers } from './routes';
import reportWebVitals from './reportWebVitals';
import { UserContextProvider } from './contexts/UserContexts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <UserContextProvider>
    <React.StrictMode>
      <Routers />
    </React.StrictMode>
  </UserContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
