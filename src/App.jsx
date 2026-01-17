import React, { useState } from 'react';

// Helper component for form inputs
const FormInput = ({ label, name, type = 'number', value, onChange, required = true, step }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            step={step}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
    </div>
);

// Helper component for select inputs
const FormSelect = ({ label, name, value, onChange, options, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);


// Main App Component
const App = () => {
    // State to hold form data, prediction result, and loading status
    const [formData, setFormData] = useState({
        age: '31',
        bmi: '34.390',
        children: '3',
        smoker: 'yes',
        sex: 'male',
        region: 'northwest',
    });
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle input changes and update state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * This function now sends the form data to the Flask backend for prediction.
     */
    const handlePredict = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPrediction(null);
        setError('');

        try {
            // Prepare the data to be sent to the Flask API
            const dataToSend = {
                ...formData,
                age: parseInt(formData.age, 10),
                bmi: parseFloat(formData.bmi),
                children: parseInt(formData.children, 10),
            };

            // Make a POST request to the /predict endpoint of the Flask server
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }
            
            setPrediction(result.prediction);

        } catch (err) {
            setError(err.message || 'An error occurred while fetching the prediction.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 font-sans md:grid md:grid-cols-2">
            {/* Left side: Form */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <header className="text-center mb-8">
                         <svg className="mx-auto h-12 w-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.751A11.959 11.959 0 0112 2.964a11.959 11.959 0 01-3-2.772z" />
                        </svg>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                            Insurance Cost Predictor
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Fill in the details to estimate your medical charges.
                        </p>
                    </header>
                    <main className="bg-white p-8 rounded-2xl shadow-lg">
                        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Age" name="age" value={formData.age} onChange={handleChange} />
                            <FormInput label="Body Mass Index (BMI)" name="bmi" value={formData.bmi} onChange={handleChange} step="0.01" />
                            <FormInput label="Children" name="children" value={formData.children} onChange={handleChange} />
                            <FormSelect
                                label="Smoker" name="smoker" value={formData.smoker} onChange={handleChange}
                                options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
                            />
                            <div className="md:col-span-2">
                                <FormSelect
                                    label="Sex" name="sex" value={formData.sex} onChange={handleChange}
                                    options={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <FormSelect
                                    label="Region" name="region" value={formData.region} onChange={handleChange}
                                    options={[
                                        { value: 'northeast', label: 'Northeast' },
                                        { value: 'northwest', label: 'Northwest' },
                                        { value: 'southeast', label: 'Southeast' },
                                        { value: 'southwest', label: 'Southwest' },
                                    ]}
                                />
                            </div>
                            <div className="md:col-span-2 mt-2">
                                <button
                                    type="submit" disabled={isLoading}
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Predicting...
                                        </>
                                    ) : 'Predict Cost'}
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>

            {/* Right side: Result */}
            <div className="flex flex-col bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 md:p-12 justify-center items-center">
                <div className="w-full max-w-md text-center">
                    {error && (
                        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    
                    {prediction === null && !isLoading && (
                         <div className="bg-white/20 p-8 rounded-2xl shadow-lg">
                             <h2 className="text-2xl font-semibold mb-2">Your Prediction Awaits</h2>
                             <p className="opacity-80">
                                 The estimated annual medical cost will be displayed here once you submit your details.
                             </p>
                         </div>
                    )}

                    {isLoading && (
                         <div className="text-center">
                             <h2 className="text-2xl font-semibold mb-2">Calculating...</h2>
                             <p className="opacity-80">
                                 Analyzing your details to predict the cost.
                             </p>
                         </div>
                    )}

                    {prediction !== null && !isLoading && (
                        <div className="bg-white/20 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold text-white/90 mb-2">Predicted Annual Charges</h2>
                            <p className="text-5xl font-bold text-white tracking-tight">
                                {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(prediction)}
                            </p>
                             <p className="text-white/70 mt-3 text-sm">
                                This is an estimated cost. Actual charges may vary based on policy and provider.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
