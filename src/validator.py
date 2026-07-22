import pandas as pd
import numpy as np
import json
from sklearn.metrics import mean_squared_error, mean_absolute_error
from src.predictor import generate_predictions

def validate_model(full_df_path, seq_length=60):
    print("Initiating Validation Protocol...")
    
    # 1. Load Data
    df = pd.read_csv(full_df_path)
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values('Date')
    
    # 2. Recreate the Test Split (the 20% unseen data)
    train_size = int(len(df) * 0.8)
    # We must include `seq_length` rows from the train set so the first test day has historical context
    test_df = df.iloc[train_size - seq_length:].copy()
    
    # 3. Get Time-Aligned Predictions
    predictions_df = generate_predictions(test_df, seq_length)
    
    # 4. Align Actual True Prices with Predictions for scoring
    actual_prices = df.iloc[train_size:]['Close'].values
    predicted_prices = predictions_df['LSTM_Prediction'].values
    
    # FIX: Dynamically align the arrays to prevent shape mismatches like [251, 311]
    # By taking the last 'min_len' items, we drop any excess lookback padding.
    min_len = min(len(actual_prices), len(predicted_prices))
    actual_prices = actual_prices[-min_len:]
    predicted_prices = predicted_prices[-min_len:]
    
    # 5. Calculate Standard Error Metrics
    rmse = np.sqrt(mean_squared_error(actual_prices, predicted_prices))
    mae = mean_absolute_error(actual_prices, predicted_prices)
    
    # 6. Calculate Model Accuracy Percentage
    mape = np.mean(np.abs((actual_prices - predicted_prices) / actual_prices)) * 100
    accuracy_percentage = 100 - mape
    
    # --- NEW: Save metrics for the API to read ---
    metrics_data = {
        "accuracy_percentage": round(accuracy_percentage, 2),
        "rmse": round(rmse, 4),
        "mae": round(mae, 4)
    }
    with open("model_metrics.json", "w") as f:
        json.dump(metrics_data, f)
    
    print(f"Validation Complete.")
    print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"Mean Absolute Error (MAE): {mae:.4f}")
    print(f"=======================================")
    print(f"TICX PREDICTIVE ACCURACY: {accuracy_percentage:.2f}%")
    print(f"=======================================")
    
    return predictions_df

if __name__ == "__main__":
    # Example usage:
    # validate_model('data.csv')
    pass