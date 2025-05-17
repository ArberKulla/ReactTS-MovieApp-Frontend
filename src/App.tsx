import { App as AntdApp } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import Routers from "./router";
import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux'
import {store} from "./data/store";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";


const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <AntdApp>
            <Router>
              <Routers />
            </Router>
          </AntdApp>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
