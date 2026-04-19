import faiss
import numpy as np
from typing import List

class VectorStore:
    def __init__(self, dim=384):
        self.index = faiss.IndexFlatL2(dim)
        self.texts = []

    def add(self, embeddings, texts):
        # Convert to float32 as FAISS expects it
        if not isinstance(embeddings, np.ndarray):
            embeddings = np.array(embeddings)
        if embeddings.dtype != np.float32:
            embeddings = embeddings.astype(np.float32)
        
        self.index.add(embeddings)
        self.texts.extend(texts)

    def search(self, query_embedding, k=5):
        if not isinstance(query_embedding, np.ndarray):
            query_embedding = np.array(query_embedding)
        if query_embedding.dtype != np.float32:
            query_embedding = query_embedding.astype(np.float32)
            
        if len(query_embedding.shape) == 1:
            query_embedding = query_embedding.reshape(1, -1)
            
        D, I = self.index.search(query_embedding, k)
        return [self.texts[i] for i in I[0] if i != -1]

    def as_retriever(self, embedder=None):
        if embedder is None:
            if hasattr(self, '_embedder'):
                embedder = self._embedder
            else:
                raise ValueError("Embedder must be provided if self._embedder is not set.")
        
        from langchain.schema import BaseRetriever, Document
        from pydantic import Field
        from typing import Any

        class LocalRetriever(BaseRetriever):
            vector_store: Any = Field(exclude=True)
            embedder: Any = Field(exclude=True)

            class Config:
                arbitrary_types_allowed = True

            def get_relevant_documents(self, query: str) -> List[Document]:
                query_embedding = self.embedder.embed([query])
                results = self.vector_store.search(query_embedding)
                return [Document(page_content=text) for text in results]
            
            async def aget_relevant_documents(self, query: str) -> List[Document]:
                return self.get_relevant_documents(query)

        return LocalRetriever(vector_store=self, embedder=embedder)
