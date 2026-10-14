function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function localProposal(userMessage) {
  return {
    reply: "I drafted a proposal from your message. Add any missing details and I can refine it.",
    proposal: {
      siret: "To be confirmed",
      office: "To be confirmed",
      timeline: "To be confirmed",
      price: "To be confirmed",
      references: userMessage,
      content: `Proposal Factory

Business proposal draft

1. Company identification
Company SIRET: To be confirmed.

2. Registered office address
Registered office: To be confirmed.

3. Project timeline
Timeline: To be confirmed.

4. Pricing
Price: To be confirmed.

5. References
${userMessage}

6. Closing paragraph
Capgemini is ready to support this initiative with a structured delivery approach, clear governance, and a focus on measurable business outcomes.`,
    },
  };
}

export async function POST(request) {
  const { message } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!message?.trim()) {
    return Response.json({ reply: "Tell me what proposal you want to create." }, { status: 400 });
  }

  if (!apiKey) {
    return Response.json(localProposal(message));
  }

  const prompt = `You are Proposal Factory, a concise Capgemini proposal assistant.

Create a professional business proposal from the user's request. If a detail is missing, use "To be confirmed".

Return only valid JSON in this exact shape:
{
  "reply": "short helpful message",
  "proposal": {
    "siret": "Company SIRET or To be confirmed",
    "office": "Registered office address or To be confirmed",
    "timeline": "Project timeline or To be confirmed",
    "price": "Price or To be confirmed",
    "references": "References or context",
    "content": "Professionally formatted proposal text with title, company identification, registered office address, project timeline, pricing, references, and closing paragraph"
  }
}

User request:
${message}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(localProposal(message));
    }

    const text = data.choices?.[0]?.message?.content || "";
    const parsed = extractJson(text);

    if (!parsed?.proposal?.content) {
      return Response.json(localProposal(message));
    }

    return Response.json(parsed);
  } catch {
    return Response.json(localProposal(message));
  }
}
