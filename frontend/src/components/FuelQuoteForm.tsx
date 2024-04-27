import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import './styles.css';
import apiService from '../services/apiService';

interface FuelQuoteFormProps {
    clientProfile: {
        deliveryAddress: string;
        state: string;
    };
}

// Pricing logic integrated into frontend
const calculateFuelQuote = (userState: string, hasRateHistory: boolean, gallonsRequested: number): { suggestedPrice: number, totalAmountDue: number } => {
    const currentPricePerGallon = 1.50;
    const locationFactor = userState === 'Texas' ? 0.02 : 0.04;
    const rateHistoryFactor = hasRateHistory ? 0.01 : 0;
    const gallonsRequestedFactor = gallonsRequested > 1000 ? 0.02 : 0.03;
    const companyProfitFactor = 0.10;

    const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
    const suggestedPrice = currentPricePerGallon + margin;
    const totalAmountDue = gallonsRequested * suggestedPrice;

    return {
        suggestedPrice: suggestedPrice,
        totalAmountDue: totalAmountDue
    };
};

const FuelQuoteForm: React.FC<FuelQuoteFormProps> = ({ clientProfile }) => {
    const [gallonsRequested, setGallonsRequested] = useState<number | ''>('');
    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [suggestedPrice, setSuggestedPrice] = useState<number | ''>('');
    const [totalAmountDue, setTotalAmountDue] = useState<number | ''>('');
    const [deliveryAddress, setDeliveryAddress] = useState(clientProfile.deliveryAddress);
    const [loading, setLoading] = useState<boolean>(false);
    //const [rateHistory,   setRateHistory] = useState<boolean>(false);

    // Gallon Input
    const gallonChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGallonsRequested(value === '' ? '' : Number(value));
    };

    // Delivery Date Input
    const handleDeliveryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/[^\d/]/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        } else if (value.length > 2 && value[2] !== '/') {
            value = value.slice(0, 2) + '/' + value.slice(2);
        } else if (value.length > 5 && value[5] !== '/') {
            value = value.slice(0, 5) + '/' + value.slice(5);
        }
        setDeliveryDate(value);
    };


    const handleGetQuote = async () => {
        setLoading(true);
        try {
            const { suggestedPrice, totalAmountDue } = calculateFuelQuote(clientProfile.state, false, Number(gallonsRequested));

            setSuggestedPrice(suggestedPrice);
            setTotalAmountDue(totalAmountDue);
        } catch (error) {
            console.error('Error calculating fuel quote:', error);
        } finally {
            setLoading(false);
        }
      };

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Submit the form data
    };

    return (
        <div>
            <h2>Fuel Quote Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="gallonsRequested">Gallons Requested </label>
                    <input
                        type="number"
                        id="gallonsRequested"
                        value={gallonsRequested}
                        onChange={gallonChanges}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="deliveryAddress">Delivery Address</label>
                    <input
                        type="text"
                    id="deliveryAddress"
                    value={deliveryAddress} // Display the user's delivery address
                    readOnly
                    />
                </div>
                <div>
                    <label htmlFor="deliveryDate">Delivery Date (MM/DD/YYYY)</label>
                    <input
                        type="text"
                        id="deliveryDate"
                        value={deliveryDate}
                        onChange={handleDeliveryDateChange}
                        placeholder="MM/DD/YYYY"
                        maxLength={10}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="suggestedPrice">Suggested Price per Gallon</label>
                    <input
                        type="number"
                        id="suggestedPrice"
                        value={suggestedPrice === '' ? '' : suggestedPrice.toFixed(2)}
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="totalAmountDue">Total Amount Due ($)</label>
                    <input
                        type="number"
                        id="totalAmountDue"
                        value={totalAmountDue === '' ? '' : totalAmountDue.toFixed(2)}
                        readOnly
                    />
                </div>
                <button type="button" onClick={handleGetQuote} disabled={!gallonsRequested || !deliveryAddress || !deliveryDate || loading}>
                    {loading ? 'Loading...' : 'Get Quote'}
                </button>
                <button type="submit" disabled={!suggestedPrice || !totalAmountDue}>Submit Quote</button>
            </form>
        </div>
    );
};

export default FuelQuoteForm;
