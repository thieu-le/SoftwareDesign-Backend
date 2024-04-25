import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import './styles.css';

interface FuelQuoteFormProps {
    clientProfile: {
        deliveryAddress: string;
    };
}

const FuelQuoteForm: React.FC<FuelQuoteFormProps> = ({ clientProfile }) => {
    const [gallonsRequested, setGallonsRequested] = useState<number | ''>('');
    const [deliveryDate, setDeliveryDate] = useState<string>('');
    const [suggestedPrice, setSuggestedPrice] = useState<number | ''>('');
    const [totalAmountDue, setTotalAmountDue] = useState<number | ''>('');
    const [deliveryAddress, setDeliveryAddress] = useState(clientProfile.deliveryAddress);
    const [loading, setLoading] = useState<boolean>(false);

    const gallonChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Ensure that value is a number or an empty string
        setGallonsRequested(value === '' ? '' : Number(value));
    };

    const handleDeliveryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Ensure that only digits and slashes are entered
        value = value.replace(/[^\d/]/g, '');
    
        // Ensure that the length does not exceed 10 characters (MM/DD/YYYY format)
        if (value.length > 10) {
            value = value.slice(0, 10);
        } else if (value.length > 2 && value[2] !== '/') {
            // Add slash after month if not present
            value = value.slice(0, 2) + '/' + value.slice(2);
        } else if (value.length > 5 && value[5] !== '/') {
            // Add slash after day if not present
            value = value.slice(0, 5) + '/' + value.slice(5);
        }
    
        setDeliveryDate(value);
    };
    const handleDeliveryAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Update the delivery address state
        setDeliveryAddress(value);
    };

    const handleGetQuote = () => {
        setLoading(true);

        // Convert gallonsRequested to number
        const gallonsRequestedNumber = gallonsRequested === '' ? 0 : Number(gallonsRequested);

        // Calculate Margin based on factors
        const locationFactor = deliveryAddress.toLowerCase().includes('texas') ? 0.02 : 0.04;
        const rateHistoryFactor = 0.01; // Assuming client always has history for simplicity
        const gallonsRequestedFactor = gallonsRequestedNumber > 1000 ? 0.02 : 0.03;
        const companyProfitFactor = 0.10;
        
        const currentPricePerGallon = 1.50;
        const margin = currentPricePerGallon * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
        const suggestedPricePerGallon = currentPricePerGallon + margin;

        // Calculate Total Amount Due
        const totalAmount = gallonsRequestedNumber * suggestedPricePerGallon;

        // Set state with calculated values
        setSuggestedPrice(suggestedPricePerGallon);
        setTotalAmountDue(Number(totalAmount.toFixed(2)));


        setLoading(false);
    };

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
                        value={deliveryAddress}
                        onChange={handleDeliveryAddressChange}
                        required
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
                        value={suggestedPrice === '' ? '' : suggestedPrice.toFixed(2)} // Display calculated value with 2 decimal places
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="totalAmountDue">Total Amount Due ($)</label>
                    <input
                        type="number"
                        id="totalAmountDue"
                        value={totalAmountDue === '' ? '' : totalAmountDue} // Total amount is already formatted to 2 decimal places
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
