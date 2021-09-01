import React from 'react';
import NavBar from './components/navbar/Headers';
import CardsPage from './components/cards/cardsPage';
import FolderPage from './components/folder/folderPage';
import customTheme from './components/utils/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

require('dotenv').config();

function App() {
  return (
    <SnackbarProvider maxStack={3}>
      <Router>
        <ChakraProvider theme={customTheme}>
          <NavBar />
          <Switch>
            <Route exact path="/cards"><FolderPage /></Route>
            <Route path="/folder/:folder"><CardsPage /></Route>
          </Switch>
        </ChakraProvider>
      </Router>
    </SnackbarProvider>
  );
}

export default App;