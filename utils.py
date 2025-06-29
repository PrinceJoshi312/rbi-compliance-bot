from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import tempfile
import streamlit as st
import os

# 🔐 Load environment variables from .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    st.error("❌ GOOGLE_API_KEY not found in .env file")
else:
    os.environ["GOOGLE_API_KEY"] = api_key


def load_docs(uploaded_files):
    docs = []
    for file in uploaded_files:
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
                tmp_file.write(file.read())
                loader = PyPDFLoader(tmp_file.name)
                docs.extend(loader.load())
        except Exception as e:
            st.error(f"❌ Error processing file `{file.name}`: {str(e)}")
    return docs


def generate_vectorstore(docs):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(docs)
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    return vectorstore


def build_qa_chain(retriever):
    llm = ChatGoogleGenerativeAI(model="models/gemini-1.5-flash-latest")

    guard_prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are an RBI compliance assistant. Only answer questions related to RBI circulars, banking regulations, and financial compliance.

If the question is not related to RBI or banking, politely reply:
"I'm sorry, I can only assist with RBI compliance and regulatory matters."

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
