
import React, { useState, useEffect } from "react";
import axios from "axios";
import { currencies } from "./currencies";
import { FaSun, FaMoon } from "react-icons/fa";

const App = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversionHistory, setConversionHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setConversionHistory(savedHistory);
  }, []);

  const saveHistory = (entry) => {
    const updatedHistory = [entry, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  const convertCurrencies = async () => {
    if (!amount || !selectedCurrency) {
      alert("Please enter an amount and select a currency.");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/convert?base_currency=${baseCurrency}&currencies=${selectedCurrency}`
      );
      let result = Object.values(data.data)[0] * amount;
      let roundoffResult = result.toFixed(2);
      const countryCode = currencies.find((currency) => currency.code === selectedCurrency);
      saveHistory({
        result: roundoffResult,
        flag: countryCode.flag,
        symbol: countryCode.symbol,
        code: countryCode.code,
        countryName: countryCode.name,
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      alert("Error fetching conversion rates.");
    }
  };

  const deleteHistoryItem = (index) => {
    const updatedHistory = conversionHistory.filter((_, i) => i !== index);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setConversionHistory(updatedHistory);
  };

  return (
    <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen flex items-center justify-center p-5 transition-all`}>
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-lg border dark:border-gray-700">
        
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4 cursor-pointer text-2xl" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </div>
        <h1 className="text-4xl font-extrabold mb-6 text-center dark:text-white tracking-wide">💱 Currency Converter</h1>

        <div className="space-y-6">
          <div>
            <label className="block font-semibold dark:text-gray-300 mb-2">Base Currency</label>
            <select className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white outline-none" value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold dark:text-gray-300 mb-2">Amount</label>
            <input 
              type="number" 
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white outline-none" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block font-semibold dark:text-gray-300 mb-2">Convert To</label>
            <select className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white outline-none" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.name}</option>
              ))}
            </select>
          </div>

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition" onClick={convertCurrencies}>
            Convert
          </button>
        </div>

        <h2 className="text-2xl font-bold mt-8 dark:text-white">Conversion History</h2>

        <ul className="mt-4 space-y-3">
          {conversionHistory.length > 0 ? conversionHistory.map((entry, index) => (
            <li key={index} className="flex justify-between items-center p-3 border rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700">
              <div className="flex items-center gap-4">
                <img src={`https://flagcdn.com/w40/${entry.flag}.png`} alt="Flag" className="w-8 h-8 rounded-full" />
                <p className="font-semibold dark:text-white">{entry.symbol} {entry.result} - {entry.countryName}</p>
              </div>
              <button className="text-red-500 dark:text-red-400 text-xl" onClick={() => deleteHistoryItem(index)}>×</button>
            </li>
          )) : <p className="text-gray-500 dark:text-gray-400 text-center">No conversion history yet.</p>}
        </ul>
      </div>
    </div>
  );
};

export default App;

