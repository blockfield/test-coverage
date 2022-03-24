const hre = require('hardhat')
const { ethers, waffle } = hre
const { loadFixture } = waffle
const { expect } = require('chai')
const { BigNumber } = require('@ethersproject/bignumber')

describe('FundsReceiver Tests', () => {
  async function fixture() {
    const accounts = await ethers.getSigners()
    const [sender, whale] = [accounts[0], accounts[1]]

    const Token = await ethers.getContractFactory('TokenMock')
    const token = await Token.deploy()
    await token.mint(whale.address, ethers.utils.parseEther('10000'))

    // deploy FundsReceiver
    const FundsReceiver = await ethers.getContractFactory('FundsReceiver')
    const fundsReceiver = await FundsReceiver.deploy()

    return {
      sender,
      whale,
      token,
      fundsReceiver,
    }
  }

  it('Should withdraw ETH', async function () {
    const { sender, whale, fundsReceiver } = await loadFixture(fixture)

    await sender.sendTransaction({
      to: fundsReceiver.address,
      value: ethers.utils.parseEther('1'),
    })

    await expect(
      fundsReceiver.connect(whale).claimTokens(ethers.constants.AddressZero, ethers.utils.parseEther('1')),
    ).to.be.revertedWith('Ownable: caller is not the owner')

    await expect(() =>
      fundsReceiver.claimTokens(ethers.constants.AddressZero, ethers.utils.parseEther('1')),
    ).to.changeEtherBalances(
      [fundsReceiver, sender],
      [BigNumber.from(0).sub(ethers.utils.parseEther('1')), ethers.utils.parseEther('1')],
    )

    await expect(fundsReceiver.claimTokens(ethers.constants.AddressZero, ethers.utils.parseEther('1'))).to.be
      .reverted
  })

  it('Should withdraw ERC20', async function () {
    const { sender, whale, fundsReceiver, token } = await loadFixture(fixture)

    const amount = ethers.utils.parseEther('1000')
    await token.connect(whale).transfer(fundsReceiver.address, amount)

    await expect(fundsReceiver.connect(whale).claimTokens(token.address, amount)).to.be.revertedWith(
      'Ownable: caller is not the owner',
    )

    await expect(() => fundsReceiver.claimTokens(token.address, amount)).to.changeTokenBalances(
      token,
      [fundsReceiver, sender],
      [BigNumber.from(0).sub(amount), amount],
    )

    await expect(fundsReceiver.claimTokens(token.address, amount)).to.be.revertedWith(
      'ERC20: transfer amount exceeds balance',
    )
  })
})
