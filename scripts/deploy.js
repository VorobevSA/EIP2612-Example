async function main() {
  const CollectableFactory = await ethers.getContractFactory("CollectableToken");
  const ContractFactory = await ethers.getContractFactory("YourNewToken");
      
  const [initialOwner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", initialOwner.address);
  const collectableInstance = await CollectableFactory.deploy();
  await collectableInstance.waitForDeployment();

  const instance = await ContractFactory.deploy(await collectableInstance.getAddress());
  await instance.waitForDeployment();
      
  console.log(`Contract deployed to ${await instance.getAddress()}`);
}
      
main().catch((error) => {
  console.error(error);
});
