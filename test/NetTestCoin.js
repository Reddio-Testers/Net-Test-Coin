const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("NetTestCoin", function () {
    var tokenAddress;
    async function deployNetTestCoin() {
        const [owner, account1, account2, account3, account4] = await ethers.getSigners();

        const NetTestCoin = await ethers.getContractFactory("NetTestCoin");
        const dNetTestCoin = await NetTestCoin.deploy("NetTestCoin", "NTC", 123123123);

        return { dNetTestCoin, owner, account1, account2, account3, account4 };
    }

    async function deployAirdrop() {
        const [owner] = await ethers.getSigners();

        const Airdrop = await ethers.getContractFactory("Airdrop");
        const dAirdrop = await Airdrop.deploy(owner.address, tokenAddress);

        return { dAirdrop };
    }

    describe("Deploment NetTestCoin", function () {
        it("We had recipients addresses", async function () {
            const { account1, account2, account3, account4 } = await loadFixture(deployNetTestCoin);

            const recipients = [
                account1.address,
                account2.address,
                account3.address,
                account4.address
            ]

            console.log(recipients);
        });

        it("Should has Contract address", async function () {
            const { dNetTestCoin, owner } = await loadFixture(deployNetTestCoin);

            const _tokenAddress = await dNetTestCoin.getAddress();

            expect(_tokenAddress).not.NaN;
            console.log("Token has deployed as:", _tokenAddress);
            console.log("Contract owner is:", owner.address);
            tokenAddress = _tokenAddress;
        });

        it("Should mint the tokens to owner", async function () {
            const { dNetTestCoin, owner } = await loadFixture(deployNetTestCoin);

            expect(await dNetTestCoin.balanceOf(owner.address)).to.equal(ethers.parseUnits("123123123", 18));
            console.log("Contract owner is:", owner.address);
            console.log("Owner balance:", await dNetTestCoin.balanceOf(owner.address));
        });

        it("Should be can burn tokens", async function () {
            const { dNetTestCoin, owner } = await loadFixture(deployNetTestCoin);

            console.log("Total supply before burn:", await dNetTestCoin.totalSupply());
            await dNetTestCoin.burn(ethers.parseUnits("123", 18));
            expect(await dNetTestCoin.balanceOf(owner.address)).to.equal(ethers.parseUnits("123123000", 18));
            console.log("Total supply after burn:", await dNetTestCoin.totalSupply());
            console.log("Contract owner is:", owner.address);
            console.log("Owner balance:", await dNetTestCoin.balanceOf(owner.address));
        });
    });

    describe("Deployment Airdrop", function () {
        it("Should has Contract address and owner", async function () {
            const { owner } = await loadFixture(deployNetTestCoin);
            const { dAirdrop } = await loadFixture(deployAirdrop);

            const _airdropAddress = await dAirdrop.getAddress();

            expect(_airdropAddress).not.NaN;
            expect(await dAirdrop.owner()).to.equal(owner.address);
            console.log("Token has deployed as:", _airdropAddress);
            console.log("Contract owner is:", owner.address);
        });

        it("Owner was can transfer tokens to contract balance", async function () {
            const { dNetTestCoin, owner } = await loadFixture(deployNetTestCoin);
            const { dAirdrop } = await loadFixture(deployAirdrop);

            const _airdropAddress = await dAirdrop.getAddress();

            await dNetTestCoin.transfer(_airdropAddress, ethers.parseUnits("123000", 18));
            expect(await dNetTestCoin.balanceOf(_airdropAddress)).to.equal(ethers.parseUnits("123000", 18));
            expect(await dNetTestCoin.balanceOf(owner.address)).to.equal(ethers.parseUnits("123000123", 18));
            console.log("Owner balance:", await dNetTestCoin.balanceOf(owner.address));
            console.log("Contract balance:", await dNetTestCoin.balanceOf(_airdropAddress));
        });

        it("Owner was can distribute tokens", async function () {
            const { dNetTestCoin, owner, account1, account2, account3, account4 } = await loadFixture(deployNetTestCoin);
            const { dAirdrop } = await loadFixture(deployAirdrop);

            const _airdropAddress = await dAirdrop.getAddress();

            const recipients = [
                account1.address,
                account2.address,
                account3.address,
                account4.address
            ];

            const amounts = [
                ethers.parseUnits("1000", 18),
                ethers.parseUnits("1000", 18),
                ethers.parseUnits("1000", 18),
                ethers.parseUnits("1000", 18)
            ];

            await dNetTestCoin.transfer(_airdropAddress, ethers.parseUnits("4000", 18));
            console.log("Before Airdrop Contract balance was:", await dNetTestCoin.balanceOf(_airdropAddress));

            for (i of recipients)
                console.log(i, "has", await dNetTestCoin.balanceOf(i), "tokens before Airdrop");

            await dAirdrop.distribute(recipients, amounts);
            expect(await dNetTestCoin.balanceOf(_airdropAddress)).to.equal(0);
            for (i of recipients)
                expect(await dNetTestCoin.balanceOf(i)).to.equal(ethers.parseUnits("1000"), 18);
            console.log("After Airdrop Contract balance was:", await dNetTestCoin.balanceOf(_airdropAddress));
            for (i of recipients)
                console.log(i, "has", await dNetTestCoin.balanceOf(i), "tokens after Airdrop");
            console.log("Owner has", await dNetTestCoin.balanceOf(owner), "tokens after Airdrop");
        });

        it("Owner was can withdraw remaining tokens", async function () {
            const { dNetTestCoin, owner, account1, account2, account3 } = await loadFixture(deployNetTestCoin);
            const { dAirdrop } = await loadFixture(deployAirdrop);

            const _airdropAddress = await dAirdrop.getAddress();

            const recipients = [
                account1.address,
                account2.address,
                account3.address
            ];

            const amounts = [
                ethers.parseUnits("1000", 18),
                ethers.parseUnits("1000", 18),
                ethers.parseUnits("1000", 18)
            ];

            await dNetTestCoin.transfer(_airdropAddress, ethers.parseUnits("4000", 18));
            console.log("Before Airdrop Contract balance was:", await dNetTestCoin.balanceOf(_airdropAddress));

            for (i of recipients)
                console.log(i, "has", await dNetTestCoin.balanceOf(i), "tokens before Airdrop");

            await dAirdrop.distribute(recipients, amounts);
            expect(await dNetTestCoin.balanceOf(_airdropAddress)).to.equal(ethers.parseUnits("1000", 18));
            for (i of recipients)
                expect(await dNetTestCoin.balanceOf(i)).to.equal(ethers.parseUnits("1000"), 18);
            console.log("After Airdrop Contract balance was:", await dNetTestCoin.balanceOf(_airdropAddress));
            for (i of recipients)
                console.log(i, "has", await dNetTestCoin.balanceOf(i), "tokens after Airdrop");
            console.log("Owner has", await dNetTestCoin.balanceOf(owner), "tokens after Airdrop");

            await dAirdrop.withdrawRemaining(owner);
            expect(await dNetTestCoin.balanceOf(_airdropAddress)).to.equal(0);
            expect(await dNetTestCoin.balanceOf(owner)).to.equal(ethers.parseUnits("123120123", 18));
            console.log("After withdraw remaining tokens Contract balance was:", await dNetTestCoin.balanceOf(_airdropAddress));
            console.log("Owner has", await dNetTestCoin.balanceOf(owner), "tokens after withdraw remaining tokens");
        });

        it("Owner was can remove ownership after making Airdop", async function () {
            const { owner } = await loadFixture(deployNetTestCoin);
            const { dAirdrop } = await loadFixture(deployAirdrop);

            await dAirdrop.renounceOwnership();
            expect(await dAirdrop.owner()).not.equal(owner.address);
        });

        it("Owner was can transfer ownership to other address", async function () {
            const { owner, account1 } = await loadFixture(deployNetTestCoin);
            const { dAirdrop } = await loadFixture(deployAirdrop);

            expect(await dAirdrop.owner()).to.equal(owner.address);
            console.log("Contract owner before transfer:", await dAirdrop.owner());

            await dAirdrop.transferOwnership(account1.address);

            const _ownerAddress = await dAirdrop.owner();
            expect(_ownerAddress).not.equal(owner.address);
            expect(_ownerAddress).to.equal(account1.address);
            console.log("Contract owner after transfer:", _ownerAddress);
        });
    });
});