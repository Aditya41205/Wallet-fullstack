import React, { useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";

const contractAddress = "0x1943b2434ccfbca3a2a0b0f957accd0e6d34d273";
const contractABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }],
    "name": "fund",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      { "internalType": "address payable", "name": "_toSend", "type": "address" },
      { "internalType": "uint256", "name": "amountToWithdraw", "type": "uint256" },
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "getcontractbalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "info",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [contractBalance, setContractBalance] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setWalletAddress(await signer.getAddress());
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  };

  const fundWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const tx = await contract.fund(name, { value: ethers.parseEther(amount) });
      await tx.wait();
      setSuccess("Wallet funded successfully!");
      setName("");
      setAmount("");
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  };

  const withdrawFunds = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const tx = await contract.withdraw(withdrawAddress, ethers.parseEther(withdrawAmount));
      await tx.wait();
      setSuccess("Withdrawal successful!");
      setWithdrawAddress("");
      setWithdrawAmount("");
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  };

  const getContractBalance = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, contractABI, provider);

      const balance = await contract.getcontractbalance();
      setContractBalance(ethers.formatEther(balance));
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Wallet DApp</h2>
      {walletAddress ? (
        <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      <div>
        <h3>Fund Wallet</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={fundWallet}>Fund</button>
      </div>

      <div>
        <h3>Withdraw Funds</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={withdrawAddress}
          onChange={(e) => setWithdrawAddress(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button onClick={withdrawFunds}>Withdraw</button>
      </div>

      <div>
        <h3>Contract Balance</h3>
        <button onClick={getContractBalance}>Check Balance</button>
        {contractBalance && <p>Contract Balance: {contractBalance} ETH</p>}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default App;
