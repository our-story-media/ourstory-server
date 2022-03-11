import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';

import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
// import red from '@material-ui/core/colors/red';
// import green from '@material-ui/core/colors/green';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#d9534f',
    },
    secondary: {
      main: '#d9534f',
    },
  },
});
// declare module '@mui/material/styles' {
//   interface Theme {
//     status: {
//       danger: string;
//     };
//   }
//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     status?: {
//       danger?: string;
//     };
//   }
// }

// const theme = {
  // palette: {
  //   primary: '#00bcd4',
  //   secondary: '#ff4081'
  // }
// }

ReactDOM.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
  <App />
  </ThemeProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
