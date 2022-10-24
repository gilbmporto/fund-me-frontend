import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

//  Declare the variables
const connectButton = document.getElementById("connect");
const getBalanceButton = document.getElementById("get-balance");
const text = document.getElementById("article");
const fundButton = document.getElementById("fund-me");
const ethAmount = document.getElementById("eth-amount");
const balanceInfoDisplayer = document.getElementById("balance-info");
const withdrawInfoDisplayer = document.getElementById("withdraw-info");
const withdrawButton = document.getElementById("withdraw-eth");

async function connect() {
  try {
    if (typeof window.ethereum !== "undefined") {
      const metaMaskconnection = await window.ethereum.request({ method: "eth_requestAccounts" })
      console.log(metaMaskconnection)
      text.innerHTML = `<p>You are connected!</p>`
    } else {
      connectButton.innerHTML = "Please connect with Metamask"
    }
  } catch (error) {
    console.log(error)
    connectButton.innerHTML = "Are you afraid? Just connect right now!"
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const fundMeBalance = (await provider.getBalance(contractAddress)).toString()
    let balanceInfo = ethers.utils.parseEther(fundMeBalance)
    balanceInfo = balanceInfo / 10 ** 36
    balanceInfoDisplayer.innerHTML = `<p>This the amount of ETH the FundMe Contract has:</p> 
                                      <p><b>${balanceInfo} ETH</b></p>`
  }
}

async function fund(ethAmount0) {
  if (typeof window.ethereum !== undefined) {
    // provider / connection to the blockchain
    // signer / wallet / someone with some gas
    // contract that we are interacting with
    // ^ ABI & Address

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    console.log(signer)
    console.log(contract)
    try {
      const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount.value) })
      // await listenForTransactionMine(transactionResponse, provider)
      text.innerHTML = `<p>Wait for the transaction to finish...</p>`
      const transactionReceipt = await transactionResponse.wait(1)
      console.log(transactionReceipt)
      text.innerHTML = `<p><b>Everything went well!</b></p>
                        <p>This is your transaction receipt:</p>
                        <p><b>Block hash</b>: ${transactionReceipt.blockHash}</p>
                        <p><b>Block Number</b>: ${transactionReceipt.blockNumber}</p>
                        <p><b>Gas used</b>: ${transactionReceipt.gasUsed}</p>
                        <p><b>Transaction Hash</b>: ${transactionReceipt.transactionHash}</p>
                        `
    } catch (err) {
      console.log(err)
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    withdrawInfoDisplayer.innerHTML = `<p>Wait for the withdraw to finish...</p>`
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      console.log(transactionReceipt)
      withdrawInfoDisplayer.innerHTML = `<p>Withdrawed with success!</p>`
    } catch (err) {
      console.log(err)
      withdrawInfoDisplayer.innerHTML = `<p>Something went wrong!</p>
                                        <p>You're probably not the owner!</p>`
    }
  }
}

/* 
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  // Listen for this transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
      resolve()
    })
  })
}
 */

connectButton.addEventListener('click', connect)
fundButton.addEventListener('click', fund)
getBalanceButton.addEventListener('click', getBalance)
withdrawButton.addEventListener('click', withdraw)
