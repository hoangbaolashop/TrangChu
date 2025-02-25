// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientID = import.meta.env.REACT_APP_GG_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  // <GoogleOAuthProvider clientId={clientID}>

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>

  // </GoogleOAuthProvider>
  // </React.StrictMode>
)
