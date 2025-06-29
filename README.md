# 🧠 RBI Compliance Bot (Colab Version)

This is an early-stage AI-powered assistant built in Google Colab to help extract information from RBI circular PDFs. It uses basic LangChain and Gemini Pro (Google's Generative AI model) to let users ask questions about uploaded documents and receive responses based on the text.

---

## 🔍 What This Bot Can Do

- 📄 Load RBI circular PDFs
- 🔍 Split text into chunks for processing
- 🧠 Answer simple questions about the circular contents
- 💾 Uses FAISS for vector-based document retrieval
- 🤖 Powered by Gemini Pro via LangChain integration

---

## 🛠️ Technologies Used

| Component              | Purpose                             |
|------------------------|-------------------------------------|
| Google Colab           | Development & runtime environment   |
| LangChain              | RAG pipeline & chain structure       |
| Google Generative AI   | LLM for question answering           |
| FAISS                  | In-memory vector store               |
| PyPDF2 / PyPDFLoader   | PDF text extraction                  |

---

## 📁 How It Works

1. Upload RBI circular PDFs
2. Text is chunked using LangChain’s splitter
3. Embeddings are generated using Gemini’s embedding model
4. Chunks are stored in FAISS vector DB
5. Questions are answered based on retrieved chunks using Gemini

---

## 🚀 Getting Started (in Colab)

1. Open the notebook in Google Colab
2. Install dependencies:
   ```python
   !pip install langchain langchain-google-genai faiss-cpu pypdf

   
⚠️ Limitations
❌ No error handling for invalid or non-PDF files (e.g. .jpg crashes the app)

❌ No safeguards against off-topic or irrelevant queries (answers everything)

❌ Entirely based on single-pass PDF parsing — cannot handle tables, scanned PDFs, or partially readable files

❌ No UI — must be used via code cells only

❌ All secrets like API keys must be manually pasted into the code

❌ No multi-document topic summarization or version comparison

❌ Unpolished — lacks user-facing controls, logging, or validation
