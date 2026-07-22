import os
import sys
import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Import Supervised Learning Modules
from src.trainer import train_model
from src.validator import validate_model

# Import Reinforcement Learning Modules
from src.rl_agent import train_rl_agent, backtest_agent

if __name__ == "__main__":
    # Expect a ticker symbol instead of a dataset path
    if len(sys.argv) < 2:
        print("ERROR: Please provide a stock ticker (e.g., AAPL or RELIANCE.NS).")
        sys.exit(1)
        
    ticker = sys.argv[1]
    data_path = f"{ticker}_dataset.csv"
    
    print(f"\n========== DOWNLOADING DATA FROM YFINANCE ==========")
    print(f"Fetching historical data for: {ticker}")
    
    # Download 5 years of daily data
    df_raw = yf.download(ticker, period="5y", interval="1d")
    
    if df_raw.empty:
        print(f"ERROR: Could not fetch data for {ticker}. Check the ticker symbol.")
        sys.exit(1)
        
    # --- NEW FIX: Flatten the multi-index columns if yfinance returns them ---
    if isinstance(df_raw.columns, pd.MultiIndex):
        df_raw.columns = df_raw.columns.droplevel(1)
        
    # Reset index to make 'Date' a standard column
    df_raw.reset_index(inplace=True)
    
    # yfinance sometimes returns 'Datetime' depending on the interval, rename to 'Date' if needed
    if 'Date' not in df_raw.columns and 'Datetime' in df_raw.columns:
        df_raw = df_raw.rename(columns={'Datetime': 'Date'})
        
    # Drop any remaining NaN rows that might mess up the scaler
    df_raw = df_raw.dropna()
        
    # Save it to a CSV
    df_raw.to_csv(data_path, index=False)
    print(f"Successfully saved {len(df_raw)} rows of data to {data_path}")
    
    print(f"\n========== QUANT ENGINE MASTER PIPELINE ==========")
    
    # PHASE 1 & 2: TRAIN THE PREDICTIVE ENGINE (LSTM)
    train_model(data_path, seq_length=60, epochs=20)
    
    print("\n========== INITIATING VALIDATION ==========")
    test_predictions = validate_model(data_path, seq_length=60)
    
    print("\n========== PREPARING RL ENVIRONMENT ==========")
    df = pd.read_csv(data_path)
    df['Date'] = pd.to_datetime(df['Date']).dt.tz_localize(None)
    
    merged_data = pd.merge(df, test_predictions, on='Date', how='inner')
    
    # ---------------------------------------------------------
    # NEW FEATURE: UNSUPERVISED MARKET REGIME DETECTION (K-MEANS)
    # ---------------------------------------------------------
    print("\n========== EXTRACTING MARKET REGIMES (K-MEANS) ==========")
    # 1. Feature Engineering: Calculate Volatility and Momentum
    merged_data['Daily_Return'] = merged_data['Close'].pct_change()
    merged_data['Volatility_14d'] = merged_data['Daily_Return'].rolling(window=14).std()
    merged_data['Momentum_14d'] = merged_data['Daily_Return'].rolling(window=14).mean()
    
    # Drop the first 14 days which have NaN values due to the rolling window
    merged_data = merged_data.dropna().reset_index(drop=True)
    
    # 2. Scale the features for K-Means
    scaler_kmeans = StandardScaler()
    cluster_features = scaler_kmeans.fit_transform(merged_data[['Volatility_14d', 'Momentum_14d']])
    
    # 3. Fit K-Means (3 Clusters: e.g., Bull, Bear, Sideways)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    merged_data['Regime'] = kmeans.fit_predict(cluster_features)
    print("Successfully clustered market into 3 distinct regimes.")
    # ---------------------------------------------------------
    
    # Create the 3-Way Split for RL
    rl_split_index = int(len(merged_data) * 0.5)
    
    rl_train_data = merged_data.iloc[:rl_split_index].reset_index(drop=True)
    rl_test_data = merged_data.iloc[rl_split_index:].reset_index(drop=True)
    
    print(f"RL Training Environment built with {len(rl_train_data)} trading days.")
    print(f"Final Backtest Environment built with {len(rl_test_data)} trading days.")
    
    # PHASE 4 & 5: TRAIN & BACKTEST THE TRADING BRAIN (PPO)
    train_rl_agent(rl_train_data, rl_train_data, total_timesteps=50000)
    backtest_agent(rl_test_data, rl_test_data)