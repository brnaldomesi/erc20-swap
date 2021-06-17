// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ERC20Mock = await hre.ethers.getContractFactory("ERC20Mock");
  const tokenA = await ERC20Mock.deploy("Avalanche-test-token-A", "AVTA");
  await tokenA.deployed();
  console.log("TokenA deployed to:", tokenA.address);

  const tokenB = await ERC20Mock.deploy("Avalanche-test-token-B", "AVTB");
  await tokenB.deployed();
  console.log("TokenB deployed to:", tokenB.address);

  const Wrapper = await hre.ethers.getContractFactory("Wrapper");
  const wrapper = await Wrapper.deploy("Avalanche-test-token-C", "AVTC");
  await wrapper.deployed(); 
  console.log("Wrapper deployed to:", wrapper.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
