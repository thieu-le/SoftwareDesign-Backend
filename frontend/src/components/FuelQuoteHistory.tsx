import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import apiService from '../services/apiService';

interface FuelQuote {
  gallonsRequested: number;
  deliveryAddress: string;
  deliveryDate: string; // Assuming this is a string date
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
      setQuotes(history);
    } catch (error) {
      console.error('Error fetching fuel quote history:', error);
    }
  };

  return (
    <div>
      <h1>Fuel Quote History</h1>
      {quotes.length === 0 ? (
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
