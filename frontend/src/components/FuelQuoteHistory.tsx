import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './styles.css';

interface FuelQuote {
  gallonsRequested: number;
  deliveryAddress: string;
  deliveryDate: string;
  suggestedPrice: number;
  totalAmountDue: number;
}

const FuelQuoteHistory = () => {
  const [quotes, setQuotes] = useState<FuelQuote[]>([]);

  useEffect(() => {
    // Fetch fuel quote history when component mounts
    fetchFuelQuoteHistory();
  }, []);

  const fetchFuelQuoteHistory = async () => {
    try {
      const history = await apiService.fetchFuelQuoteHistory();
      setQuotes(Array.isArray(history) ? history : []); // Ensure history is an array
    } catch (error) {
      console.error('Error fetching fuel quote history:', error);
    }
  };

  return (
    <div>
      <h2>Fuel Quote History</h2>
      {Array.isArray(quotes) && quotes.length === 0 ? (
        <p>No data available</p>
      ) : (
        quotes.map((quote, index) => (
          <div key={index}>
            <p>Gallons Requested: <span>{quote.gallonsRequested}</span></p>
            <p>Delivery Address: <span>{quote.deliveryAddress}</span></p>
            <p>Delivery Date: <span>{quote.deliveryDate}</span></p>
            <p>Suggested Price per gallon: <span>{quote.suggestedPrice}</span></p>
            <p>Total Amount Due: <span>{quote.totalAmountDue}</span></p>
          </div>
        ))
      )}
    </div>
  );
};

export default FuelQuoteHistory;
