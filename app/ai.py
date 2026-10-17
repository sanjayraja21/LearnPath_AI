
import httpx
from fastapi import HTTPException

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
OLLAMA_MODEL = "llama3.2"


async def ask_ollama(question: str) -> str:
    question = question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Please enter a question."
        )

    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are LearnPath AI, a helpful learning assistant. "
                    "Explain concepts clearly, use simple language, "
                    "and give practical learning examples."
                ),
            },
            {
                "role": "user",
                "content": question,
            },
        ],
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(
                OLLAMA_URL,
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

        answer = data.get("message", {}).get("content", "")

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="Ollama returned an empty response."
            )

        return answer

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Ollama took too long to respond."
        )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail=(
                "Cannot connect to Ollama. Start Ollama and check "
                "that the llama3.2 model is installed."
            )
        )

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Ollama returned HTTP {exc.response.status_code}."
        )

    except ValueError:
        raise HTTPException(
            status_code=502,
            detail="Ollama returned an invalid response."
        )
