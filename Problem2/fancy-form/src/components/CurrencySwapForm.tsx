import React, { useState, useMemo } from 'react';
import { prices } from '../data/tokenPrices';

const tokens = Object.keys(prices);

const CurrencySwapForm = () => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const exchangeRate = useMemo(() => {
    if (!fromToken || !toToken || !prices[fromToken] || !prices[toToken]) return null;
    return prices[fromToken] / prices[toToken];
  }, [fromToken, toToken]);

  const convertedAmount = useMemo(() => {
    if (!exchangeRate || !amount) return '';
    return (parseFloat(amount) * exchangeRate).toFixed(4);
  }, [exchangeRate, amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromToken || !toToken || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (fromToken === toToken) {
      setError('Cannot swap the same token');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      alert(`Swapped ${amount} ${fromToken} to ${convertedAmount} ${toToken}`);
      setIsLoading(false);
    }, 1000);
  };

  const renderOption = (token: string) => (
    <option key={token} value={token}>
      {token}
    </option>
  );

  const renderSelectedIcon = (token: string) => (
    <img
      src={`../assets/${token}.svg`}
      alt={`${token} icon`}
      className="w-5 h-5 mr-2 inline-block align-middle"
    />
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl shadow-md w-full max-w-[24rem] space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 text-center">Currency Swap</h2>

      {error && (
        <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* FROM */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">From</label>
        <div className="relative">
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="w-full p-2 pl-9 border border-gray-300 rounded-md appearance-none bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select token</option>
            {tokens.map(renderOption)}
          </select>
          {fromToken && (
            <span className="absolute left-2 top-2">{renderSelectedIcon(fromToken)}</span>
          )}
        </div>
      </div>

      {/* TO */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">To</label>
        <div className="relative">
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="w-full p-2 pl-9 border border-gray-300 rounded-md appearance-none bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select token</option>
            {tokens.map(renderOption)}
          </select>
          {toToken && (
            <span className="absolute left-2 top-2">{renderSelectedIcon(toToken)}</span>
          )}
        </div>
      </div>

      {/* AMOUNT */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter amount"
        />
      </div>

      {/* RESULT */}
      {convertedAmount && !error && (
        <div className="text-center text-sm text-gray-600">
          ≈ <strong>{convertedAmount} {toToken}</strong>
        </div>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 rounded-md text-white text-sm font-semibold transition-all ${
          isLoading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Swapping...' : 'Swap'}
      </button>
    </form>
  );
};

export default CurrencySwapForm;
