import time
import json
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, StreamingResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("busgo_api")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        path = request.url.path
        method = request.method
        
        # Capture Request Body
        request_body = b""
        if method in ["POST", "PUT", "PATCH"]:
            request_body = await request.body()
            # To allow the actual route handler to read the body again, 
            # we need to override the request's receive method or use a workaround.
            # A common way in FastAPI is to set the result of body() back into a custom attribute 
            # or just be careful. Since we're using BaseHTTPMiddleware, it's safer to avoid 
            # reading body here if we don't have to, OR re-construct the request.
            
            # WORKAROUND for BaseHTTPMiddleware body reading:
            async def receive():
                return {"type": "http.request", "body": request_body}
            request._receive = receive

        # Process Request
        response = await call_next(request)
        
        process_time = (time.time() - start_time) * 1000
        status_code = response.status_code

        # Capture Response Body (safely)
        response_body = getattr(response, 'body', b"")
        if isinstance(response, StreamingResponse):
             # We skip logging streaming bodies to ensure stability
             response_body = b"[Streaming Content]"

        # Format and Print Logs
        log_msg = f"\n{'='*50}\n"
        log_msg += f"🚀 API Request: {method} {path}\n"
        
        if request_body:
            try:
                body_json = json.loads(request_body)
                # Sensitive info masking (simple)
                if "password" in body_json: body_json["password"] = "********"
                log_msg += f"📦 Payload: {json.dumps(body_json, indent=2)}\n"
            except:
                log_msg += f"📦 Payload: {request_body.decode('utf-8', errors='ignore')}\n"

        log_msg += f"✅ Response Status: {status_code} ({process_time:.2f}ms)\n"
        
        if response_body and response_body != b"[Streaming Content]":
            try:
                # Only log short JSON responses to keep logs clean
                res_json = json.loads(response_body)
                log_msg += f"📥 Result: {json.dumps(res_json, indent=2)[:500]}{'...' if len(response_body) > 500 else ''}\n"
            except:
                pass
        
        log_msg += f"{'='*50}\n"
        logger.info(log_msg)

        return response
