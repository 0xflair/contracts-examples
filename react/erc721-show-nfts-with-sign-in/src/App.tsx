import React from "react";
import logo from "./logo.svg";

import "./App.css";

import {
  ConnectButton,
  IfWalletConnected,
  WalletDropdown,
} from "@flair-sdk/react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to Flair examples!</p>
        <div>
          {/* Render a simple connect button: */}
          Hi! You can connect here: <ConnectButton />
          
          {/* If user is connected render a dropdown: */}
          <IfWalletConnected>
            <WalletDropdown />
          </IfWalletConnected>
          
          {/* If user is connected show a sign button: */}
          <IfWalletConnected>
            <SignInButton />
          </IfWalletConnected>

          {/* If user is signed-in show list of their NFTs: */}
          <IfWalletSignedIn>
            <MyCustomNFTListComponent />
          </IfWalletSignedIn>
        </div>
      </header>
    </div>
  );
}

export default App;
