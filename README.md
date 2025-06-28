# rbi-compliance-bot

# 🧠 RBI Compliance Bot

This project is a simple but powerful tool that helps banks, NBFCs, and compliance teams make sense of RBI circulars — without reading through hundreds of pages manually.

It lets you upload official circular PDFs, ask questions in plain English (like “What are the new KYC rules?”), and even generates department-wise action points for teams like Compliance, IT, Legal, or Customer Support.

Whether you're a compliance officer, part of a legal team, or someone trying to stay on top of changing RBI guidelines, this bot saves you time and effort.

---

## 💡 What It Does

- 📄 Upload one or more RBI circulars (PDF)
- ❓ Ask questions like:
  - “What’s the new definition of an NPA?”
  - “What does the circular say about digital lending?”
  - “What’s the compliance deadline?”
- 🏛️ Get department-wise actionable steps (Compliance, IT, Legal, etc.)

---

## ⚙️ How It Works

- Uses **LangChain** to break down and retrieve content from circulars
- **Google Gemini Pro** (via API) to generate intelligent responses
- **FAISS** for storing and searching document chunks
- Built with **Streamlit** for a clean and simple web interface

---

## 🚀 How to Run Locally

1. Clone this repo:
   ```bash
   git clone https://github.com/yourusername/rbi-compliance-bot.git
   cd rbi-compliance-bot
pip install -r requirements.txt

os.environ["GOOGLE_API_KEY"] = "your_gemini_api_key"

streamlit run app.py

👥 Who This Is For
Bank compliance teams

NBFCs and lending startups

Legal or documentation departments

Anyone tired of manually scanning RBI circulars


🙌 Contribute
Feel free to fork, improve, and submit pull requests. You can also expand this to handle:

Circular version comparison (2023 vs 2025)

Policy change tracking

Custom bank-specific workflows
