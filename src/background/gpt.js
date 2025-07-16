export async function requestGptSummary(text) {
  const apiKey = process.env.VITE_OPENAI_API_KEY

  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `너는 시각장애인, 문해력이 낮은 사람들을 위해 사이트의 정보를 요약하는 AI야.
아래 텍스트를 바탕으로 다음과 같은 JSON 형식으로 응답해줘:

{
  "title": "이 글의 주제를 한 줄로 요약",
  "summary": "핵심 내용을 광고 없이 쉽게 풀어쓴 요약문. 3~5줄 분량으로, 핵심 개념과 내용을 자세하게 설명할 것"
}

⚠️ 반드시 JSON 형태로만 응답해줘. 불필요한 설명 없이 JSON 객체만 출력할 것.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.7,
  }

  // Request Body
  console.log('[📤 GPT 요청 BODY]', JSON.stringify(requestBody, null, 2))

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('[❌ GPT API 호출 실패]', response.status, data?.error?.message)
    return '[요약 실패: 응답 오류]'
  }

  function extractJsonFromText(rawText) {
    try {
      // 코드블럭(````json`) 제거
      const cleaned = rawText.replace(/```json|```/g, '').trim()

      // JSON.parse 시도
      return JSON.parse(cleaned)
    } catch (e) {
      console.error('[❌ JSON 파싱 실패]', e)
      return { title: rawContent.title, summary: rawContent.summary }
    }
  }
  const rawContent = data.choices?.[0]?.message?.content ?? '{}'

  try {
    return extractJsonFromText(rawContent)
  } catch (e) {
    console.error('[❌ JSON 파싱 실패]', e)
    return { title: rawContent.title, summary: rawContent.summary }
  }
}
