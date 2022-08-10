import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButtonOne = document.getElementById("connectButton");
const fundMeButton = document.getElementById("fund");
const get_balance = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdrawButton");
const myBalance = document.getElementById("walletBalance");
connectButtonOne.onclick = connect;
fundMeButton.onclick = fund;
get_balance.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButtonOne.innerHTML = "connected";
  } else {
    connectButtonOne.innerHTML = "please install metamask ";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`funding with ${ethAmount} please wait... `);
  if (window.ethereum);

  const provider = new ethers.providers.Web3Provider(window.ethereum); // connecting to our metamask
  const signer = provider.getSigner(); // gets the address of our metamask

  /** connecting to our contract, we need the ABI and the ADDRESS */
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
    await listenForTransactionMine(transactionResponse, provider);
  } catch (error) {
    console.log(error);
  }
}
// getting the balance of our wallet

async function getBalance() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    const myWalletBalance = ethers.utils.formatEther(balance);
    myBalance.innerHTML = myWalletBalance;
  }
}

// listening to events
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  // listen for this transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`completed with ${transactionReceipt.confirmation}`);
      resolve();
    });
  });
}

//withdraw

async function withdraw() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // connecting to our metamask
    const signer = provider.getSigner(); // gets the address of our metamask

    /** connecting to our contract, we need the ABI and the ADDRESS */
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
