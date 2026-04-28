
import fetch from 'node-fetch';

async function testGemini() {
  const response = await fetch('http://localhost:3000/api/generate-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Generate a travel itinerary for Bukidnon, Philippines. Trip Type: adventure, Duration: 1 days, Budget: budget. Only return JSON with title, summary, days, estimatedCost, tips.'
    })
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testGemini();
