import os
os.environ["TRANSFORMERS_NO_TENSORFLOW"] = "1"
os.environ["TRANSFORMERS_NO_TORCH"] = "0" # Ensure torch is used

from sentence_transformers import SentenceTransformer
import numpy as np

class LocalEmbedder:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def embed(self, texts):
        return self.model.encode(texts, convert_to_numpy=True)
