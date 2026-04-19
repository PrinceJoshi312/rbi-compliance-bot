from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import os
from utils import load_docs, generate_vectorstore, build_qa_chain, build_task_chain, guess_topic

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for vectorstore and chains (for simplicity in this prototype)
# In a real app, you might use a session-based or persistent storage
state = {
    "vectorstore": None,
    "qa_chain": None,
    "task_chain": None,
    "topic_label": "the uploaded RBI circular"
}

class QuestionRequest(BaseModel):
    question: str

class TaskRequest(BaseModel):
    pass

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    try:
        file_contents = []
        file_names = []
        for file in files:
            content = await file.read()
            file_contents.append(content)
            file_names.append(file.filename)
        
        docs = load_docs(file_contents, file_names)
        if not docs:
            raise HTTPException(status_code=400, detail="No valid PDF pages found.")
        
        vectorstore = generate_vectorstore(docs)
        retriever = vectorstore.as_retriever()
        
        state["vectorstore"] = vectorstore
        state["qa_chain"] = build_qa_chain(retriever)
        state["task_chain"] = build_task_chain(retriever)
        state["topic_label"] = guess_topic(docs)
        
        return {"message": "Files uploaded and processed successfully", "topic": state["topic_label"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    if not state["qa_chain"]:
        raise HTTPException(status_code=400, detail="Please upload files first.")
    
    try:
        response = state["qa_chain"].run(request.question)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks")
async def generate_tasks():
    if not state["task_chain"]:
        raise HTTPException(status_code=400, detail="Please upload files first.")
    
    try:
        response = state["task_chain"].run("Generate department-wise tasks based on this circular.")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clear")
async def clear_data():
    state["vectorstore"] = None
    state["qa_chain"] = None
    state["task_chain"] = None
    state["topic_label"] = "the uploaded RBI circular"
    return {"message": "State cleared successfully"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
