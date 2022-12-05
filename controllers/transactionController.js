const Transaction = require("../models/Transaction");
const Ethereum = require("../models/Ethereum");
var cron = require("node-cron");
const fetch = require("node-fetch");

async function getPosts(url) {
  const transaction = await fetch(url);
  const response = await transaction.json();
  return response;
}

const addTransaction = async (req, res) => {
  try {
    let url = `https://api.etherscan.io/api?module=account&action=txlist&address=${req.body.userAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=91NEUK9U61PJW86SQDK86ZPW5U5AZVSA7I`;
    let transactions = getPosts(url);
    transactions.then(async function (result) {
      console.log(result.result.length);

      for (let i = 0; i < result.result.length; i++) {
        var transaction = new Transaction({
          userAddress: req.body.userAddress,
          blockNumber: result.result[i].blockNumber,
          hash: result.result[i].hash,
          blockHash: result.result[i].blockHash,
          from: result.result[i].from,
          to: result.result[i].to,
          value: result.result[i].value,
          gasUsed: result.result[i].gasUsed,
          gasPrice: result.result[i].gasPrice,
        });
        const transct = await Transaction.findOne({
          $and: [
            { userAddress: req.body.userAddress },
            { hash: result.result[i].hash },
          ],
        });
        if (!transct) {
          await transaction.save();
        }
      }
      console.log("Transactions saved successfully");
      const trnsts = await Transaction.find({
        userAddress: req.body.userAddress,
      }).sort({ createdAt: -1 });
      return res.status(201).json(trnsts);
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const balanceAndPrice = async (req, res) => {
  try {
    let user = req.query.id;
    const etherPrc = await Ethereum.find();
    if (etherPrc.length === 0) {
      let url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`;

      let ethereumPrice = getPosts(url);
      ethereumPrice.then(async function (result) {
        var price = result.ethereum.inr;
        console.log("price1", price);
      });
    } else {
      price = etherPrc[0].ethereumPrice;
      console.log("price2", price);
    }

    const trnsts = await Transaction.find({
      userAddress: user,
    });
    let balance = 0;
    for (let i = 0; i < trnsts.length; i++) {
      if (user === trnsts[i].to) {
        balance = balance + trnsts[i].value;
      } else {
        balance = balance - trnsts[i].value;
      }
    }
    console.log(balance);
    return res.status(201).json({
      balance: balance,
      price: price,
      message: "Current Balance and Current Ethereum Price",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  addTransaction,
  balanceAndPrice,
};
