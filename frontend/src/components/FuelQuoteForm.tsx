import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import apiService from '../services/apiService';

interface FuelQuoteFormProps {
    clientProfile: {
        deliveryAddress: string;
    };
}

const FuelQuoteForm: React.FC<FuelQuoteFormProps> =  ({clientProfile}) => {
    const [gallonsRequested, setGallonsRequested] =  useState<number | ''>('');
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [suggestedPrice, setSuggestedPrice] = useState<number | ''>('');
    const [totalAmountDue, setTotalAmountDue] = useState<number | ''>('');


    const gallonChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Ensure that value is a number or an empty string
        setGallonsRequested(value === '' ? '' : Number(value));
    };
    

    const dateChanges = (date: Date | null) => {
        setDeliveryDate(date);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Call the backend API to calculate suggested price and total amount due
            const { suggestedPrice, totalAmountDue } = await apiService.calculateFuelQuote({
                gallonsRequested: gallonsRequested as number,
                deliveryDate,
                clientAddress: clientProfile.deliveryAddress
            });

            setSuggestedPrice(suggestedPrice);
            setTotalAmountDue(totalAmountDue);
        } catch (error) {
            console.error('Error calculating fuel quote:', error);
        }
    };


    return(
        <div>
            <h2>Fuel Quote Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="gallonsRequested">Gallons Requested *</label>
                    <input 
                        type="number"
                        id="gallonsRequested"
                        value = {gallonsRequested}
                        onChange={gallonChanges}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='deliveryAddress'>DeliveryAddress</label>
                    <input
                        type="text"
                        id="deliveryAddress"
                        value={clientProfile.deliveryAddress}
                        readOnly
                    />
                </div>
                <div>
                    <label htmlFor="deliveryDate">Delivery Date</label>
                    <DatePicker 
                        id="deliveryDate"
                        selected = {deliveryDate}
                        onChange={dateChanges}
                        dateFormat="MM/dd/yyyy"
                    />
                </div>
                <div>
                    <label htmlFor="suggestedPrice">Suggested Price per gallon</label>
                    <input
                        type="number"
                        id="suggestedPrice"
                        value={suggestedPrice}
                        readOnly
                    />    
                </div>
                <div>
                    <label htmlFor="totalAmountDue">Total Amount Due</label>
                    <input
                        type="number"
                        id="totalAmountDue"
                        value={totalAmountDue}
                        readOnly
                    />
                </div>
                <button type = "submit">Submit</button>
            </form>
        </div>
    );
};
export default FuelQuoteForm;
