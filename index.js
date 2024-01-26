import { apiKey } from "./api-key.js";

const stockTickerInput = document.getElementById("stock-ticker");

const getStockInfoButton = document.getElementById("get-stock-info");

const statusOutput = document.getElementById("status");
const stockOutput = document.getElementById("stock-output");
const stockNameOutput = document.getElementById("stock-name");
const stockCurrentPriceOutput = document.getElementById("stock-current-price");
const stockClosingPriceOutput = document.getElementById("stock-close-price");
const stockOpeningPriceOutput = document.getElementById("stock-open-price");
const stockPriceChangeOutput = document.getElementById("stock-percent-change");

stockOutput.style.display = `none`;

getStockInfoButton.addEventListener('click', _event => {
    let _stockTicker = stockTickerInput.value.toUpperCase();

    stockOutput.style.display = `none`;
    statusOutput.textContent = "Loading..."

    fetch(`https://finnhub.io/api/v1/quote?symbol=${_stockTicker}&token=${apiKey}`)
    .catch(_error => console.error(`An error occured when calling the stock quote API: ${_error}`))
    .then(_result => _result.json())
    .catch(_error => console.error(`An error occured when converting the
    stock quote API response to an object: ${_error}`))
    .then(_result => {
        if (_result.d == null || _result.dp == null) {
            statusOutput.textContent = "The ticker entered was not found. Please try again.";
            return;
        }

        statusOutput.textContent = "";
        stockOutput.style.display = `block`;

        stockNameOutput.textContent = _stockTicker;
        stockCurrentPriceOutput.textContent = `Current Price: $${_result.c.toFixed(2)}`;
        stockClosingPriceOutput.textContent = `Previous Closing Price: $${_result.pc.toFixed(2)}`
        stockOpeningPriceOutput.textContent = `Opening Price: $${_result.o.toFixed(2)}`
        let _stockPricePercentChange = (_result.c - _result.o) / _result.o * 100;
        stockPriceChangeOutput.textContent = `Change (since opening): ${_stockPricePercentChange.toFixed(2)}%`;

        const _minStockPriceChange = 0.75;
        if (_stockPricePercentChange > _minStockPriceChange) {
            stockPriceChangeOutput.textContent += " 📈";
        }

        else if (_stockPricePercentChange < -_minStockPriceChange) {
            stockPriceChangeOutput.textContent += " 📉";
        }

        else {
            stockPriceChangeOutput.textContent += " 📊";
        }
    });
});