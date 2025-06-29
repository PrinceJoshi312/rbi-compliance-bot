import streamlit as st
from utils import load_docs, generate_vectorstore, build_qa_chain, build_task_chain, guess_topic

st.set_page_config(page_title="RBI Compliance Bot", layout="wide")
st.title("📄 RBI Circular Compliance Assistant")

st.sidebar.markdown("⚠️ Upload only **valid RBI circulars in PDF format**.")
uploaded_files = st.sidebar.file_uploader(
    "Upload RBI Circulars (PDF only)",
    accept_multiple_files=True,
    type=["pdf"]
)

mode = st.sidebar.radio("Select Mode", ["Ask a Question", "Department-Wise Tasks"])

# Placeholder logic
placeholder_text = "Enter your query"
topic_label = "the uploaded RBI circular"

if uploaded_files:
    with st.spinner("Loading documents and building vector DB..."):
        docs = load_docs(uploaded_files)
        if not docs:
            st.error("❌ No valid PDF pages found. Please upload proper RBI circular PDFs.")
            st.stop()

        vectorstore = generate_vectorstore(docs)
        retriever = vectorstore.as_retriever()
        qa_chain = build_qa_chain(retriever)
        task_chain = build_task_chain(retriever)

        topic_label = guess_topic(docs)
        placeholder_text = f"Ask something about {topic_label}..."

    user_input = st.text_input("Ask a question:", placeholder=placeholder_text)

    if user_input:
        with st.spinner("Processing..."):
            if mode == "Ask a Question":
                response = qa_chain.run(user_input)
            else:
                response = task_chain.run("Generate department-wise tasks based on this circular.")
        st.write("### 📋 Response:")
        st.success(response)
else:
    st.info("Please upload RBI circulars in PDF format to get started.")
