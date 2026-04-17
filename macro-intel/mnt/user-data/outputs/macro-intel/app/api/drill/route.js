export async function POST(req) {
  const { query } = await req.json();
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `You are a sharp macro analyst. Today is ${today}.

The user wants a focused intelligence briefing on: "${query}"

Use web search to find current, relevant information. Write a structured analytical response using exactly these section headers:

WHAT'S HAPPENING
2-3 sentences. Specific facts, names, numbers.

WHY IT MATTERS
2-3 sentences. Causality, second-order effects, who's affected.

WHAT TO WATCH
1-2 sentences. Leading indicators, upcoming catalysts.

Be direct. No fluff. Flag conflicting signals if they exist.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return Response.json({ error: err.error?.message || 'API error' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
