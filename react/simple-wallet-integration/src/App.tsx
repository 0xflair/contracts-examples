import React from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  IfWalletNotConnected,
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
        <p>
          {/* Render a simple connect button */}
          <IfWalletNotConnected>
            Your custom styled button:
            <ConnectButton className="my-custom-connect-button-class" />
          </IfWalletNotConnected>

          {/* If user is connected render a dropdown */}
          <IfWalletConnected>
            <WalletDropdown />
          </IfWalletConnected>

          {/* Render a wallet profile right after connect button (to avoid using IfWallet... components) */}
          {/* <ConnectButton>
            <WalletProfile />
          </ConnectButton> */}

          {/* Render a dropdown with wallet profile and menu right after connect button */}
          {/* <ConnectButton>
            <WalletDropdown />
          </ConnectButton> */}

          {/* Render a disconnect button after user has connected */}
          {/* <ConnectButton>
            <DisconnectButton />
          </ConnectButton> */}
        </p>
      </header>
    </div>
  );
}

export default App;
