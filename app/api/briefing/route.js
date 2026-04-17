export async function POST(req) {
  const { theme } = await req.json();

  const themeFilters = {
    all: '',
    geopolitics: 'Focus only on geopolitics, international relations, and military or political conflicts.',
    macro: 'Focus only on macroeconomics: interest rates, inflation, central bank policy, GDP, currency movements.',
    trade: 'Focus only on trade flows, supply chains, tariffs, and logistics disruptions.',
    energy: 'Focus only on energy markets: oil, gas, renewables, energy transitions, and resource geopolitics.',
    em: 'Focus only on emerging markets across Asia, Africa, Latin America, and the Middle East.',
    tech: 'Focus only on technology, AI, semiconductors, and digital economy shifts.'
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const themeFilter = themeFilters[theme] || '';

  const prompt = `You are a macro intelligence analyst. Today is ${today}.

Use web search to find the most current and significant global developments happening right now. ${themeFilter}

Return ONLY a valid JSON array — no markdown, no explanation, no preamble. Exactly 5 items:
[{
  "theme": one of ["Geopolitics","Macro & Rates","Trade & Supply","Energy","Emerging Markets","Tech & AI"],
  "headline": "sharp 8-12 word headline",
  "summary": "2-3 sentences. Specific facts, name countries and figures where relevant.",
  "signal": "1 sentence on what to watch next or downstream effects",
  "tag": one of ["stress","opportunity","watch","shift","neutral"]
}]`;

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
        max_tokens: 1500,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return Response.json({ error: err.error?.message || 'API error' }, { status: 500 });
    }

    const data = await response.json();
    const textBlocks = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const start = textBlocks.indexOf('[');
    const end = textBlocks.lastIndexOf(']');
    if (start === -1) return Response.json({ error: 'No JSON in response' }, { status: 500 });
    const items = JSON.parse(textBlocks.slice(start, end + 1));
    return Response.json({ items, date: today });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
