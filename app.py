from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import numpy as np
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

CORS(app)


# Load the machine learning model from the pickle file
# This assumes 'model_pipelines.pkl' is in the same directory as 'app.py'
try:
    with open('model_pipelines.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    print("Error: 'model_pipelines.pkl' not found. Make sure the file is in the correct directory.")
    model = None # Set model to None if it fails to load

# Define the home page route
@app.route('/')
def home():
    """Renders the main page of the application (index.html)."""
    return render_template('index.html')

# Define the prediction route
@app.route('/predict', methods=['POST'])
def predict():
    """Receives data from the form, makes a prediction using the loaded model, and returns it."""
    if model is None:
        return jsonify({'error': 'Model not loaded. Please check server logs.'}), 500

    try:
        # Get the JSON data sent from the frontend
        data = request.get_json()
        
        # Create a pandas DataFrame from the received data.
        # The model was trained on a DataFrame and expects the same format for prediction.
        input_df = pd.DataFrame([data])
        
        # Use the loaded model to make a prediction
        prediction = model.predict(input_df)
        
        # Return the prediction as a JSON object.
        # We access the first element [0] because model.predict() returns a NumPy array.
        return jsonify({'prediction': prediction[0]})
        
    except Exception as e:
        # Handle any potential errors during the prediction process
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400

# This block allows you to run the app directly from the command line
if __name__ == '__main__':
    # The debug=True flag provides detailed error messages in the browser,
    # which is very helpful during development.
    app.run(debug=True)
