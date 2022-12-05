const Ethereum = require("../models/Ethereum");
var cron = require("node-cron");
const fetch = require("node-fetch");

async function getPosts(url) {
  const transaction = await fetch(url);
  const response = await transaction.json();
  return response;
}

const getEthereumPriceTwo = async (req, res, next) => {
  try {
    let url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`;
    const etherPrc = await Ethereum.find();
    if (etherPrc.length === 0) {
      let ethereumPrice = getPosts(url);
      ethereumPrice.then(async function (result) {
        let price = result.ethereum.inr;
        console.log(price);
        var etherPrice = new Ethereum({
          ethereumPrice: price,
        });
        await etherPrice.save();
      });
    }
    cron.schedule("*/10 * * * *", () => {
      let ethereumPrice = getPosts(url);
      ethereumPrice.then(async function (result) {
        let price = result.ethereum.inr;
        console.log(price);
        const etherPrc = await Ethereum.find();
        console.log(etherPrc[0].ethereumPrice);
        await Ethereum.findOneAndUpdate(
          { ethereumPrice: etherPrc[0].ethereumPrice },
          { ethereumPrice: price },
          { new: true }
        );
      });
    });
    next();
  } catch (error) {
    console.log(error.message);
    next();
  }
};

module.exports = {
  getEthereumPriceTwo,
};
