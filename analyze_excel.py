import pandas as pd
import json
import sys
import os

try:
    # Read Excel file
    file_path = "/workspace/uploads/EMPRESAS_PALMAS_TO_1.xlsx"
    df = pd.read_excel(file_path)
    
    # Basic information
    result = {
        "num_rows": len(df),
        "num_columns": len(df.columns),
        "columns": list(df.columns),
        "data_types": {col: str(df[col].dtype) for col in df.columns},
        "missing_values": {col: int(df[col].isna().sum()) for col in df.columns},
        "sample_rows": df.head(5).to_dict(orient="records"),
        "unique_values": {}
    }
    
    # Get unique values for selected columns
    categorical_columns = ["Natureza Jurídica", "Matriz ou Filial", "Porte da Empresa", 
                          "Forma Tributação", "Optante Simples", "Optante MEI", 
                          "Situação Cadastral", "UF", "Município"]
    
    for col in categorical_columns:
        if col in df.columns:
            # Limit to 50 values maximum to avoid huge output
            unique_vals = df[col].dropna().unique().tolist()
            if len(unique_vals) <= 50:
                result["unique_values"][col] = unique_vals
            else:
                result["unique_values"][col] = unique_vals[:50] + ["... and more"]
    
    # Save results to JSON
    with open("/workspace/excel_analysis.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print("Analysis completed successfully!")
    
except Exception as e:
    error_result = {
        "error": str(e),
        "traceback": str(sys.exc_info())
    }
    with open("/workspace/excel_analysis_error.json", "w", encoding="utf-8") as f:
        json.dump(error_result, f, ensure_ascii=False, indent=2)
    print(f"Error analyzing file: {str(e)}")
