const { expect } = require("chai");
const { ethers } = require( "hardhat");

describe("CollectableToken", function () {
  it("Deploy contract", async function () {
    const ContractFactory = await ethers.getContractFactory("CollectableToken");
    const initialOwner = (await ethers.getSigners())[0].address;
    const instance = await ContractFactory.deploy();
    await instance.waitForDeployment();
    expect(await instance.name()).to.equal("CollectableToken");
  });

  it("Mint", async function () {
    const ContractFactory = await ethers.getContractFactory("CollectableToken");
    const initialOwner = (await ethers.getSigners())[0].address;
    const instance = await ContractFactory.deploy();
    await instance.waitForDeployment();
    const amount = await instance.balanceOf(initialOwner);
    await instance.mint(initialOwner,1000);
    const delta  = await instance.balanceOf(initialOwner) - amount;
    expect(delta).to.equal(1000);
  });
});

describe("YourNewToken", function () {
  it("Deploy contract", async function () {
    const ContractFactory = await ethers.getContractFactory("YourNewToken");
    const initialOwner = (await ethers.getSigners())[0].address;
    const instance = await ContractFactory.deploy("0x0000000000000000000000000000000000000000");
    await instance.waitForDeployment();
    expect(await instance.name()).to.equal("YourNewToken");
  });

  it("Test withdraw", async function () {
    const [initialOwner, user] = await ethers.getSigners();
    //ERC-20 with Permit
    const CollectableFactory = await ethers.getContractFactory("CollectableToken");
    const instanceCollectable = await CollectableFactory.deploy();
    await instanceCollectable.waitForDeployment();
    
    // Contract implementing the logic for using Permit
    const ContractFactory = await ethers.getContractFactory("YourNewToken");
    const instance = await ContractFactory.deploy(await instanceCollectable.getAddress());
    await instance.waitForDeployment();

    await instanceCollectable.mint(await instance.getAddress(), 100000);
    await instance.withdrawCollectableToken(await user.getAddress());

    expect(await instanceCollectable.balanceOf(await user.getAddress())).to.equal("100000");
  });

  it("Mint with Permint", async function () {
    const [initialOwner, user] = await ethers.getSigners();

    //ERC-20 with Permit
    const CollectableFactory = await ethers.getContractFactory("CollectableToken");
    const instanceCollectable = await CollectableFactory.deploy();
    await instanceCollectable.waitForDeployment();

    // Contract implementing the logic for using Permit
    const ContractFactory = await ethers.getContractFactory("YourNewToken");
    const instance = await ContractFactory.deploy(await instanceCollectable.getAddress());
    await instance.waitForDeployment();
  
    // Define the deadline for permit
    const deadline = Math.floor(Date.now() / 1000) + 3600; // текущее время + 1 час
    // Retrieve the nonce
    const nonce = await instanceCollectable.nonces(initialOwner.address);
  
      // Generate data for signature (EIP-712)
    const domain = {
       name: await instanceCollectable.name(),
       version: "1",
       chainId: (await ethers.provider.getNetwork()).chainId,
       verifyingContract: await instanceCollectable.getAddress(),
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
  
    const amount_ = 1000

    const value = {
      owner: initialOwner.address,
      spender: await instance.getAddress(),
      value: amount_,
      nonce: nonce,
      deadline: deadline,
    };    

    // Sign the typed data
    const signature = await initialOwner.signTypedData(domain, types, value)

    sign = ethers.Signature.from(signature)
    
    await instance.mint( 
        deadline,
        sign.v,
        sign.r,
        sign.s,
        initialOwner.address, 
        amount_
    );
    
    expect(await instance.balanceOf(initialOwner.address)).to.equal(amount_);
  }); 

});
