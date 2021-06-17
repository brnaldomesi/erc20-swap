const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Wrapper contract", function() {
  before(async function() {
    this.Wrapper = await ethers.getContractFactory('Wrapper');
    this.ERC20Mock = await ethers.getContractFactory('ERC20Mock');
  });

  beforeEach(async function () {
    this.wrapper = await this.Wrapper.deploy("Avalanche-test-token-C", "AVTC");
    await this.wrapper.deployed();

    this.tokenA = await this.ERC20Mock.deploy("Avalanche-test-token-A", "AVTA");
    this.tokenB = await this.ERC20Mock.deploy("Avalanche-test-token-B", "AVTB");

    await this.tokenA.deployed();
    await this.tokenB.deployed();

    const [alice, bob] = await ethers.getSigners();

    this.swapper = await this.wrapper.connect(alice);
    this.alice = alice;
    this.bob = bob;
  });

  it('swap fails when token A holder didn\'t approve', async function () {
    const alice = await this.tokenA.connect(this.alice);
    await alice.mint(30);
    await expect(
      this.swapper.swap(this.tokenA.address, 10)
    ).to.be.revertedWith('ERC20: transfer amount exceeds allowance')
  })

  it('swap fails when token A tries to swap beyond its allowance', async function () {
    const alice = await this.tokenA.connect(this.alice);
    await alice.approve(this.wrapper.address, 10);
    await alice.mint(30);

    await expect(
      this.swapper.swap(alice.address, 20)
    ).to.be.revertedWith('ERC20: transfer amount exceeds allowance')
  })

  it('swap fails when token A tries to swap more than his balance', async function () {
    const alice = await this.tokenA.connect(this.alice);
    await alice.approve(this.wrapper.address, 30);
    await alice.mint(10);

    await expect(
      this.wrapper.swap(alice.address, 20)
    ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
  })

  it('swap succeeds', async function () {
    const alice = await this.tokenA.connect(this.alice);
    await alice.mint(50);
    await alice.approve(this.wrapper.address, 100);
    
    const bobB = await this.tokenB.connect(this.bob);
    await bobB.mint(50);
    await bobB.transfer(this.wrapper.address, 50);

    await this.swapper.swap(this.tokenA.address, 20);
    
    expect(
      await this.tokenA.balanceOf(this.alice.address)
    ).to.equal(30)

    expect(
      await this.wrapper.balanceOf(this.alice.address)
    ).to.equal(20)

    expect(
      await this.tokenA.balanceOf(this.wrapper.address)
    ).to.equal(20)

    expect(
      await this.wrapper.balanceOf(this.wrapper.address)
    ).to.equal(0)

    await this.swapper.unswap(this.tokenB.address, 5);

    expect(
      await this.tokenB.balanceOf(this.alice.address)
    ).to.equal(5)

    expect(
      await this.wrapper.balanceOf(this.alice.address)
    ).to.equal(15)
  })

  it('unswap succeeds', async function () {
    const alice = await this.tokenA.connect(this.alice);
    await alice.mint(50);
    await alice.approve(this.wrapper.address, 100);
    await this.swapper.swap(this.tokenA.address, 30);

    const bob = this.tokenA.connect(this.bob);
    await bob.mint(50);
    await bob.transfer(this.wrapper.address, 50);

    await this.swapper.unswap(this.tokenA.address, 20);

    expect(
      await this.tokenA.balanceOf(this.alice.address)
    ).to.equal(40)

    expect(
      await this.wrapper.balanceOf(this.alice.address)
    ).to.equal(10)

    expect(
      await this.tokenA.balanceOf(this.wrapper.address)
    ).to.equal(60)

    expect(
      await this.wrapper.balanceOf(this.wrapper.address)
    ).to.equal(0)
  })
});