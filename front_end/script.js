const connectWalletMsg = document.querySelector('#connectWalletMessage');
const connectWalletBtn = document.querySelector("#connectWallet");
const votingStation = document.querySelector('#votingStation');
const timerTime = document.querySelector('#time');
const timerMessage = document.querySelector("#timerMessage");
const mainBoard = document.querySelector("#mainBoard");
const voteForm = document.querySelector("#voteForm");
const vote = document.querySelector("#vote");
const sendBtn = document.querySelector("#sendVote");
const showResultContainer = document.querySelector("#showResultContainer");
const showResult = document.querySelector("#showResult");
const result = document.querySelector("#result");
const admin = document.querySelector("#admin");
const candidates = document.querySelector("#candidates");
const electionDuration = document.querySelector("#electionDuration");
const startAnElection = document.querySelector("#startAnElection");
const candidate = document.querySelector("#candidate");
const addTheCandidate = document.querySelector("#addTheCandidate");


// Configuring Ethers.js
const contractAddress = '0xEDB94F8153E546F6630a3a3F78E324F0026aDB72';
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "add_candidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "number_of_votes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "check_election_period",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "election_started",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "election_timer",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "list_of_voters",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reset_all_voters_status",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieve_votes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "number_of_votes",
              "type": "uint256"
            }
          ],
          "internalType": "struct voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidates",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_voting_duration",
          "type": "uint256"
        }
      ],
      "name": "start_election",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "vote_to",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "voter_status",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voting_end",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voting_start",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  

let provider;
let signer;
let contract;

// import detectEthereumProvider from "@metamask/detect-provider";

async function setup() {
    provider = await detectEthereumProvider()

    if (provider && provider === window.ethereum) {
        console.log("MetaMask is available!")
        startApp() // Initialize your dapp with MetaMask.

    } else if (provider) {
        console.warn("Another Ethereum provider is detected.");
        // Optionally, handle multiple providers here

    } else {
        console.log("Please install MetaMask!")
    }
}

function startApp() {
    if (provider !== window.ethereum) {
        console.warn("Multiple Ethereum providers detected. Defaulting to MetaMask.");
        // Optionally, select MetaMask's provider explicitly if possible
    } else {
        console.log("Using MetaMask as the Ethereum provider.");
    }
}

window.addEventListener("load", setup) //mmm

// functions
const getAllCandidates = async function() {
    if(document.getElementById("candidateBoard")){
        document.getElementById("candidateBoard").remove();
    }

    let board = document.createElement("table");
    board.id = "candidateBoard";
    mainBoard.appendChild(board);

    let tableHeader = document.createElement("tr");
    tableHeader.innerHTML = `<th>ID No.</th><th>Candidate</th>`;
    board.appendChild(tableHeader);

    let candidates = await contract.retrieve_votes();
    for(let i = 0; i < candidates.length; i++) {
        let candidateRow = document.createElement("tr");
        candidateRow.innerHTML = `<td>${parseInt(candidates[i].id)}</td>
                                  <td>${candidates[i].name}</td>`;
        board.appendChild(candidateRow);
    }
}

const getResult = async function() {
    result.style.display = "flex";

    if (document.getElementById("resultBoard")) {
        document.getElementById("resultBoard").remove();
    }

    let resultBoard = document.createElement("table");
    resultBoard.id = "resultBoard";
    result.appendChild(resultBoard);

    let tableHeader = document.createElement("tr");
    tableHeader.innerHTML = `<th>ID No.</th><th>Candidate</th>
                             <th>Number of Votes</th>`;
    resultBoard.appendChild(tableHeader);

    let candidates = await contract.retrieve_votes();
    for (let i = 0; i < candidates.length; i++) {
        let candidateRow = document.createElement("tr");
        candidateRow.innerHTML = `<td>${parseInt(candidates[i].id)}</td>
                                  <td>${candidates[i].name}</td>
                                  <td>${candidates[i].number_of_votes}</td>`;
        resultBoard.appendChild(candidateRow);
    }
}

// Periodically refresh the page state
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const refreshPage = function() {
  setInterval(async () => {
      try {
          const electionStarted = await contract.election_started();
          if (electionStarted) {
              let time = await contract.election_timer();
              if (time > 0) {
                  timerMessage.innerHTML = `<span id="time">${formatTime(time)}</span> left.`;
                  voteForm.style.display = 'flex';
                  showResultContainer.style.display = 'none';
                  // Show candidate table
                  mainBoard.style.display = 'block';
              } else {
                  timerMessage.textContent = "Election ended.";
                  voteForm.style.display = 'none';
                  showResultContainer.style.display = 'block';
                  // Hide candidate table when the election ends
                  mainBoard.style.display = 'none';
              }
          } else {
              timerMessage.textContent = "No election started.";
              voteForm.style.display = 'none';
              showResultContainer.style.display = 'block';
              // Hide candidate table if no election is started
              mainBoard.style.display = 'none';
          }
      } catch (error) {
          console.error('Error updating timer:', error);
          timerMessage.textContent = "Error fetching election timer.";
          voteForm.style.display = 'none';
          showResultContainer.style.display = 'block';
          // Hide candidate table in case of error
          mainBoard.style.display = 'none';
      }
  }, 1000);
};


function showMessage(text, type) {
  const messageContainer = document.getElementById("messageContainer");
  messageContainer.textContent = text;
  messageContainer.className = type;
  messageContainer.style.display = "block";
  setTimeout(() => {
      messageContainer.style.display = "none";
  }, 3000);
}


function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

const sendVote = async function() {
  const voteId = vote.value;
  if (!confirm(`Are you sure you want to vote for Candidate ID ${voteId}?`)) return;

  showLoader(true);
  await contract.vote_to(voteId);
  vote.value = "";
  showLoader(false);
  showMessage("Your vote was successfully sent!", "success");
};

const startElection = async function() {
    if (!candidates.value) {
        alert("List of candidates is empty");
        return;
    }
    if (!electionDuration.value) {
        alert("Please set the election duration");
        return;
    }

    const _candidates = candidates.value.split(",");
    const _votingDuration = electionDuration.value;

    await contract.start_election(_candidates, _votingDuration);
    refreshPage();

    candidates.value = "";
    electionDuration.value = "";

    voteForm.style.display = "flex";
    showResultContainer.style.display = "none";
}

const addCandidate = async function() {
    if (!candidate.value) {
        alert("Please provide the candidate name first");
        return;
    }

    await contract.add_candidate(candidate.value);
    refreshPage();
    candidate.value = "";
}

// Connect to MetaMask and initialize the contract
const getAccount = async function() {
    try {
        console.log('Requesting account access...');
        await provider.request({ method: 'eth_requestAccounts' });

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        signer = ethersProvider.getSigner();
        const userAddress = await signer.getAddress();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Update UI elements
        connectWalletBtn.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        connectWalletMsg.textContent = 'You are currently connected...';
        connectWalletBtn.disabled = true;

        // Check if the user is the contract owner
        const owner = await contract.owner();
        console.log('Contract owner:', owner);

        if (owner.toLowerCase() === userAddress.toLowerCase()) {
            admin.style.display = 'flex';

            const electionStarted = await contract.election_started();
            console.log('Election started:', electionStarted);
            if (electionStarted) {
                try {
                    const time = await contract.election_timer();
                    console.log('Election time remaining:', time.toNumber());
                    if (time.toNumber() === 0) {
                        await contract.check_election_period();
                        console.log('Election period checked/reset.');
                    }
                } catch (error) {
                    console.warn('Election timer not active or No election yet.');
                }
            } else {
                console.log('No election has been started yet.');
            }
        }

        votingStation.style.display = 'block';
        refreshPage();
        await getAllCandidates();
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        alert("Failed to connect wallet. See console for details.");
    }
};
  

// Add event listeners
connectWalletBtn.addEventListener('click', getAccount);
showResult.addEventListener('click', getResult);
sendBtn.addEventListener('click', sendVote);
addTheCandidate.addEventListener('click', addCandidate);
startAnElection.addEventListener('click', startElection);