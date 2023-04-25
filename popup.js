async function getTokenURI() {
  // Get the Ethereum address from the input field
  const contractAddress = document.getElementById("address").value;
  const tokenId = document.getElementById("id").value;

  // Create a provider object using the provider provided by MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Create a contract object for the contract that contains the scriptURI function
  const contractAbi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const contract = new ethers.Contract(
    contractAddress,
    contractAbi,
    provider
  );

  // Call the scriptURI function and display the result in the output box
  let tokenURI = await contract.tokenURI(tokenId);
  // Check if the scriptURI starts with "data:application/json;base64,"
  if (tokenURI.startsWith("data:application/json;base64,")) {
    // Decode the base64-encoded JSON
    tokenURI = atob(tokenURI.slice(29));
    const json = JSON.parse(tokenURI);

    // Check if the "image" or "animation_url" property starts with "data:text/html;base64,"
    if (
      json.animation_url &&
      json.animation_url.startsWith("data:text/html;base64,")
    ) {
      // Decode the base64-encoded animation data
      tokenURI = json.animation_url;
    }
    if (json.image && json.image.startsWith("data:text/html;base64,")) {
      // Decode the base64-encoded image data
      tokenURI = json.image;
    }
  }

  // Create an iframe element with the decoded tokenURI as the source
  const iframe = document.createElement("iframe");
  iframe.sandbox =
    "allow-scripts allow-same-origin allow-modals allow-popups allow-forms";
  iframe.src = tokenURI;
  iframe.width = "100%";
  iframe.height = "500px";

  // Remove the old iframe if it exists
    const outputDiv = document.getElementById("output");
    const oldIframe = outputDiv.querySelector("iframe");
    if (oldIframe) {
    oldIframe.remove();
    }

    // Add the new iframe to the output div
    outputDiv.appendChild(iframe);
}

async function connectWallet() {
  try {
    // Request access to the MetaMask provider
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.error(error);
  }

  // Hide the "Connect Wallet" button
  document.getElementById("connectButton").style.display = "none";
}

window.addEventListener("load", () => {
    // Check if MetaMask is already connected
    if (
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isConnected()
    ) {
        // Hide the "Connect Wallet" button
        document.getElementById("connectButton").style.display = "none";
    } else {
        // Show the "Connect Wallet" button
        document.getElementById("connectButton").style.display = "block";
    }
});