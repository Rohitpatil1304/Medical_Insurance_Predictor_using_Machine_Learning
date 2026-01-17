# Medical Insurance Prediction using Machine Learning

A Machine learning application that predicts medical insurance charges based on individual health and demographic factors. This project combines a Python-based ML backend with a modern React frontend for an interactive prediction experience.

## 📋 Project Overview

This application utilizes machine learning to predict medical insurance costs for individuals based on their personal and health-related attributes. The model is trained on historical insurance data and serve with both a backend API and an interactive web interface.

**Key Features:**
- Machine learning model trained on 1,338 insurance records
- RESTful API built with Flask
- Modern, responsive React frontend with Tailwind CSS
- Real-time predictions with data validation
- Data preprocessing with outlier handling
- Production-ready model serialization

## 📊 Machine Learning Pipeline

### Data Source
- **Dataset**: `insurance.csv` containing 1,338 records with 7 features and 1 target variable
- **Target Variable**: `charges` (insurance cost in dollars)

### Features Used for Prediction
| Feature | Type | Description |
|---------|------|-------------|
| `age` | Numeric | Age of the individual (years) |
| `sex` | Categorical | Gender (male/female) |
| `bmi` | Numeric | Body Mass Index |
| `children` | Numeric | Number of dependents |
| `smoker` | Categorical | Smoking status (yes/no) |
| `region` | Categorical | US geographic region (northeast, northwest, southeast, southwest) |

### Data Preprocessing

#### 1. **Outlier Detection & Treatment (BMI)**
- Applied IQR (Interquartile Range) method to detect outliers
- Calculated Q1, Q3, and IQR values
- Replaced outliers (values > Q3 + 1.5×IQR) with the upper bound
- Visualized distribution using boxplots and KDE plots

#### 2. **Feature Transformation**
The model uses a `ColumnTransformer` with multiple encoding strategies:

- **StandardScaler**: Applied to numerical features (`age`, `bmi`)
  - Standardizes features to have mean=0 and std=1
  - Improves model convergence

- **OrdinalEncoder**: Applied to `smoker` (binary categorical)
  - Encodes: 'no' → 0, 'yes' → 1
  - Preserves ordinal relationship

- **OneHotEncoder**: Applied to multi-class features (`sex`, `region`)
  - Creates binary features for each category
  - Dropped first category to avoid multicollinearity
  - Handles unknown categories gracefully

#### 3. **Train-Test Split**
- Test size: 30% (402 samples)
- Training size: 70% (936 samples)
- Random state: 42 (for reproducibility)

### Model Architecture

**ML Pipeline Components:**
```
┌─────────────────────────────────────┐
│  Raw Data Input                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Feature Transformer (tr1)          │
│  • StandardScaler (age, bmi)        │
│  • OrdinalEncoder (smoker)          │
│  • OneHotEncoder (sex, region)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Linear Regression Model (tr2)      │
│  Predicts insurance charges         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Predicted Insurance Charges        │
└─────────────────────────────────────┘
```

**Algorithms Evaluated:**
- ✅ **Linear Regression** (Selected) - Best performance for this regression task
- DecisionTreeRegressor (Alternative implementation included but not selected)

### Model Performance
- **R² Score**: ~0.76 (76% variance explained)
- **Model Type**: Linear Regression with feature transformation pipeline
- **Serialization**: Pickled and stored as `model_pipelines.pkl`

## 🏗️ Project Architecture

### Backend (Flask API)
- **File**: `app.py`
- **Framework**: Flask with CORS support
- **Port**: 5000 (default)
- **Endpoints**:
  - `GET /` - Renders the main page (index.html)
  - `POST /predict` - Accepts JSON input and returns insurance prediction

### Frontend (React + Vite)
- **Technology Stack**: 
  - React 19.1.1
  - Vite (build tool)
  - Tailwind CSS 4 (styling)
- **Location**: `src/` directory
- **Main Components**:
  - `App.jsx` - Main application component with form and prediction display
  - `FormInput` - Reusable numeric input component
  - `FormSelect` - Reusable dropdown component

### Data
- **Training Data**: `insurance.csv` (1,340 rows × 7 columns)
- **Model File**: `model_pipelines.pkl` (serialized scikit-learn pipeline)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+ (for frontend)
- pip (Python package manager)
- npm (Node package manager)

### Using the Application

1. Open the web interface (localhost:5173)
2. Fill in the form with your details:
   - Age (numeric)
   - Sex (dropdown: Male/Female)
   - BMI (numeric)
   - Number of Children (numeric)
   - Smoker Status (dropdown: Yes/No)
   - Region (dropdown: Northeast/Northwest/Southeast/Southwest)
3. Click "Predict" button
4. View your estimated insurance charges

## 🔧 Technologies Used

### Machine Learning
- **pandas**: Data manipulation and analysis
- **scikit-learn**: ML algorithms and preprocessing
  - `LinearRegression` - Prediction model
  - `ColumnTransformer` - Feature transformation
  - `StandardScaler` - Numerical feature scaling
  - `OrdinalEncoder` - Binary categorical encoding
  - `OneHotEncoder` - Multi-class categorical encoding
  - `Pipeline` - Workflow automation
- **numpy**: Numerical computations
- **matplotlib & seaborn**: Data visualization

### Backend
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **pickle** - Model serialization

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## 📈 Model Development Process

1. **Exploratory Data Analysis (EDA)**
   - Loaded and examined dataset structure
   - Checked data types and missing values
   - Visualized feature distributions

2. **Data Cleaning**
   - Identified and handled outliers in BMI using IQR method
   - No missing values found in dataset

3. **Feature Engineering**
   - Separated features (X) from target (y)
   - Applied domain-appropriate transformations
   - Standardized numerical features
   - Encoded categorical features appropriately

4. **Model Training**
   - Split data into 70% training, 30% testing
   - Created preprocessing + regression pipeline
   - Trained Linear Regression model

5. **Model Evaluation**
   - Calculated R² Score metric
   - Achieved ~0.76 R² score on test set

6. **Model Deployment**
   - Serialized pipeline to `model_pipelines.pkl`
   - Integrated with Flask API
   - Connected to React frontend

## 🎯 Key Insights

- **Age & BMI** significantly influence insurance charges
- **Smoking status** is one of the strongest predictors of higher charges
- **Gender and region** have categorical impacts on premiums
- Linear model effectively captures relationships between features and insurance costs
- Proper feature preprocessing is crucial for model accuracy