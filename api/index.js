export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userMessage = url.searchParams.get("question");

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  if (!userMessage) {
    res.writeHead(400, corsHeaders);
    return res.end(JSON.stringify({ error: "Missing 'question' query parameter" }));
  }

  try {
    const payload = {
      model: "gpt-4o",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
    };

    const apiResponse = await fetch("https://api-ru0x.onrender.com/v1/chat/api", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      console.error("Error:", apiResponse.statusText);
      res.writeHead(502, corsHeaders);
      return res.end(
        JSON.stringify({
          Join: "https://t.me/Ashlynn_Repository",
          successful: "failure",
          status: apiResponse.status,
          response: "Error processing your request. Please try again later.",
        })
      );
    }

    const data = await apiResponse.json();

    if (data && data.response) {
      res.writeHead(200, corsHeaders);
      return res.end(
        JSON.stringify({
          successful: "success",
          status: 200,
          response: data.response,
        })
      );
    } else {
      console.error("Error:", data);
      res.writeHead(502, corsHeaders);
      return res.end(
        JSON.stringify({
          successful: "failure",
          status: 502,
          response: "Invalid API response format. Please try again later.",
        })
      );
    }
  } catch (error) {
    console.error("Error:", error);
    res.writeHead(500, corsHeaders);
    return res.end(
      JSON.stringify({
        successful: "failure",
        status: 500,
        response: "An unexpected error occurred. Please try again later.",
      })
    );
  }
}
