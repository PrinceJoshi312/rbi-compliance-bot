import streamlit as st
from utils import load_docs, generate_vectorstore, build_qa_chain, build_task_chain

st.set_page_config(page_title="RBI Compliance Bot", layout="wide")
st.title("📄 RBI Circular Compliance Assistant")

# Sidebar upload
uploaded_files = st.sidebar.file_uploader("Upload RBI Circulars (PDF)", accept_multiple_files=True)

# Mode selection
mode = st.sidebar.radio("Select Mode", ["Ask a Question", "Department-Wise Tasks"])

# Load and process PDFs
if uploaded_files:
    with st.spinner("Loading documents and building vector DB..."):
        docs = load_docs(uploaded_files)
        vectorstore = generate_vectorstore(docs)
        retriever = vectorstore.as_retriever()
        qa_chain = build_qa_chain(retriever)
        task_chain = build_task_chain(retriever)

    # Text input
    user_input = st.text_input("Enter your query:", placeholder="e.g., What are the new KYC rules?")
    
    if user_input:
        with st.spinner("Processing..."):
            if mode == "Ask a Question":
                response = qa_chain.run(user_input)
            else:
                response = task_chain.run("Generate department-wise tasks based on this circular.")
        st.write("### 📋 Response:")
        st.success(response)
