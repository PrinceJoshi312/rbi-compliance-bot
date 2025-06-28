from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import tempfile
import os

# Set your Gemini API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyBPng2X8FIx0R81rmpfo3N-A8PtxZ6aGXo"  # Replace this before running

def load_docs(uploaded_files):
    docs = []
    for file in uploaded_files:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(file.read())
            loader = PyPDFLoader(tmp_file.name)
            docs.extend(loader.load())
    return docs

def generate_vectorstore(docs):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(docs)
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    return vectorstore

def build_qa_chain(retriever):
    llm = ChatGoogleGenerativeAI(model="models/gemini-1.5-flash-latest")
    return RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

def build_task_chain(retriever):
    llm = ChatGoogleGenerativeAI(model="models/gemini-1.5-flash-latest")
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
