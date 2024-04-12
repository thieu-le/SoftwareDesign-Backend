import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import apiService from '../services/apiService';
import './styles.css';

interface FuelQuoteFormProps {
    clientProfile: {
        deliveryAddress: string;
    };
}

const FuelQuoteForm: React.FC<FuelQuoteFormProps> = ({ clientProfile }) => {
    const [gallonsRequested, setGallonsRequested] = useState<number | ''>('');
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [suggestedPrice, setSuggestedPrice] = useState<number | ''>('');
    const [totalAmountDue, setTotalAmountDue] = useState<number | ''>('');
    const [deliveryAddress, setDeliveryAddress] = useState(clientProfile.deliveryAddress);

    const gallonChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Ensure that value is a number or an empty string
        setGallonsRequested(value === '' ? '' : Number(value));
    };

    const dateChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Convert the input value to a Date object
        const date = value ? new Date(value) : null;
        // Set the delivery date state
        setDeliveryDate(date);
    };

    const priceChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Ensure that value is a number or an empty string
        setSuggestedPrice(value === '' ? '' : Number(value));
    };

    const handleDeliveryAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Update the delivery address state
        setDeliveryAddress(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Call the backend API to calculate suggested price and total amount due
            const { suggestedPrice, totalAmountDue } = await apiService.calculateFuelQuote({
                gallonsRequested: gallonsRequested as number,
                deliveryDate,
                clientAddress: deliveryAddress // Use the state value here
            });

            setSuggestedPrice(suggestedPrice);
            setTotalAmountDue(totalAmountDue);
        } catch (error) {
            console.error('Error calculating fuel quote:', error);
        }
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
                    <label htmlFor='deliveryAddress'>Delivery Address</label>
                    <input
                        type="text"
                        id="deliveryAddress"
                        value={deliveryAddress}
                        onChange={handleDeliveryAddressChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="deliveryDate">Delivery Date</label>
                    <input
                        type="date"
                        id="deliveryDate"
                        name="deliveryDate"
                        value={deliveryDate ? deliveryDate.toISOString().split('T')[0] : ''}
                        onChange={dateChanges}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="suggestedPrice">Suggested Price per Gallon</label>
                    <input
                        type="number"
                        id="suggestedPrice"
                        value={suggestedPrice}
                        onChange={priceChanges}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalAmountDue">Total Amount Due ($)</label>
                    <input
                        type="number"
                        id="totalAmountDue"
                        value={totalAmountDue}
                        readOnly
                    />
                </div>
                <button type="submit">Calculate</button>
            </form>
        </div>
    );
};
export default FuelQuoteForm;