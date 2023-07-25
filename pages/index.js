import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [Token, setToken] = useState(0);

 
  const increment = async () => {
    if (atm && account) {
      try {
        const tx = await atm.increment();
        await tx.wait();
        getToken();
      } catch (error) {
        console.error("Error incrementing:", error);
      }
    }
  };

  const decrement = async () => {
    if (atm && account) {
      try {
        const tx = await atm.decrement();
        await tx.wait();
        getToken();
      } catch (error) {
        console.error("Error decrementing:", error);
      }
    }
  };

  const getToken = async () => {
    if (atm && account) {
      const TokenValue = await atm.Token();
      setToken(TokenValue.toNumber());
    }
  };

  
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccount(accounts);
      });
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({method: "eth_accounts"});
      handleAccount(accounts);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <>
        <div>
          <p style={{ fontFamily: "Sans-serif" }}>Your Account: {account}</p>
          <p style={{ fontFamily: "Sans-serif" }}>Your Balance: {balance}</p>
  
          <button style={{ backgroundColor: "#cyan" }} onClick={deposit}>
            Deposit 1 ETH
          </button>
          <button style={{ backgroundColor: "yellow" }} onClick={withdraw}>
            Withdraw 1 ETH
          </button>
        </div>

        {/* Buttons to increment and decrement the Token */}
      <div>
        <h1>Here is your ERC20 Token ATM🪙</h1>
        <p style={{ fontFamily: "Sans-serif" }}>Your Total Token: {Token}</p>
        <button style={{ backgroundColor: "#00ff00" }} onClick={increment}>
          Create Token
        </button>
        <button style={{ backgroundColor: "#ff0000" }} onClick={decrement}>
          Burn Token
        </button>
      </div>
      </>
    );
    
  }

  useEffect(() => {
    getWallet();
    getToken(); 
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the MetaCrafter ATM🤑</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
        
      `}
      </style>
    </main>
  )
}