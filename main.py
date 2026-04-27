from fastapi import FastAPI
from api.routes import router as chat_router
import uvicorn

from fastapi.middleware.cors import CORSMiddleware

import logging
import time
from fastapi import Request

# 📝 CONFIGURE LOGGING
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger("SmartBus")

app = FastAPI()

# 🛡️ REQUEST LOGGING MIDDLEWARE
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = "{0:.2f}".format(process_time)
    
    logger.info(
        f"RID: {request.scope.get('root_path')} | "
        f"Method: {request.method} | "
        f"Path: {request.url.path} | "
        f"Status: {response.status_code} | "
        f"Time: {formatted_process_time}ms"
    )
    return response

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "https://flatbed-engine-degree.ngrok-free.app",
        "https://flatbed-engine-degree.ngrok-free.dev" # Adding both just in case
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],


)

app.include_router(chat_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)