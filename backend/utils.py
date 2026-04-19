from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import tempfile
import os
import numpy as np

# Import the new local embedding and vector store modules
from embeddings import LocalEmbedder
from vector_store import VectorStore

# Load Gemini API key from .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("⚠️ WARNING: GOOGLE_API_KEY not found in .env file")
else:
    os.environ["GOOGLE_API_KEY"] = api_key


def load_docs(file_contents, file_names):
    docs = []
    for content, name in zip(file_contents, file_names):
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
                tmp_file.write(content)
                tmp_file_path = tmp_file.name
            
            loader = PyPDFLoader(tmp_file_path)
            docs.extend(loader.load())
            os.unlink(tmp_file_path) # Clean up
        except Exception as e:
            print(f"❌ Error processing file `{name}`: {str(e)}")
    return docs


def generate_vectorstore(docs):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)
    
    # --- LOCAL EMBEDDING PIPELINE ---
    embedder = LocalEmbedder()
    store = VectorStore(dim=384) # all-MiniLM-L6-v2 has 384 dimensions
    
    texts = [doc.page_content for doc in chunks]
    embeddings = embedder.embed(texts)
    store.add(embeddings, texts)
    
    # Store the embedder with the vectorstore for retriever usage
    store._embedder = embedder 
    
    return store


def build_qa_chain(retriever):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

    # RBI-specific assistant with soft small talk support
    guard_prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are an RBI compliance assistant. Your primary job is to help users understand RBI circulars, banking regulations, and financial compliance.

You may also answer small talk or background questions *only* if they are directly related to RBI, KYC, NPAs, compliance policies, or regulatory goals.

If the question is totally unrelated (e.g., about food, sports, celebrities), politely respond:
"I'm designed to assist only with RBI-related topics and compliance queries."

Context:
{context}

Question:
{question}

Answer:
"""
    )

    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": guard_prompt}
    )


def build_task_chain(retriever):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

    action_prompt = PromptTemplate(
        input_variables=["context"],
        template="""
You are an RBI compliance analyst assistant. Based on the following circular text, generate actionable tasks for the relevant departments.

---CIRCULAR CONTENT---
{context}
----------------------

Output Format:
Compliance:
- ...

IT:
- ...

Customer Support:
- ...

Legal:
- ...

Only include departments relevant to the circular. Keep responses short and clear.
"""
    )

    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": action_prompt}
    )


# 🔍 Auto-detect topic for dynamic placeholder
def guess_topic(docs):
    if not docs:
        return "the uploaded RBI circular"
    text = " ".join([doc.page_content.lower() for doc in docs[:5]])
    if "kyc" in text:
        return "KYC guidelines"
    elif "npa" in text or "non-performing asset" in text:
        return "NPA norms"
    elif "digital lending" in text:
        return "digital lending rules"
    elif "compliance" in text:
        return "RBI compliance rules"
    elif "governor" in text:
        return "RBI background and leadership"
    return "the uploaded RBI circular"
