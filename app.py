from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


try:
    with open('model_pipelines.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    print("Error: 'model_pipelines.pkl' not found. Make sure the file is in the correct directory.")
    model = None 

@app.route('/')
def home():
    """Renders the main page of the application (index.html)."""
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    """Receives data from the form, makes a prediction using the loaded model, and returns it."""
    if model is None:
        return jsonify({'error': 'Model not loaded. Please check server logs.'}), 500

    try:

        data = request.get_json()
        
        
        input_df = pd.DataFrame([data])
        

        prediction = model.predict(input_df)
        
        return jsonify({'prediction': prediction[0]})
        
    except Exception as e:
       
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':

    app.run(debug=True)
