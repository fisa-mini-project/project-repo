import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY })

export async function requestLLMSummary(text) {
  const prompt = `
너는 시각장애인과 문해력이 낮은 사람들을 위해 웹사이트 내용을 쉽게 요약해주는 AI야.

사용자에게 읽기 쉽게 보여줄 수 있도록, 다음과 같은 구조로 핵심 정보를 정리해서 반드시 아래 JSON 형식 그대로만 응답해:

{
  "title": "이 글의 주제를 한 줄로 요약",
  "summary": "핵심 내용을 쉬운 말로 3~5줄 요약한 글. 각 문장은 줄바꿈(\\n)으로 구분"
}

🟡 유의사항
- 반드시 JSON 형태로만 응답해. 설명, 인삿말, 말머리, 코드블럭(\`\`\`) 없이 순수 JSON만 출력해.
- key와 value는 모두 큰따옴표(")로 감싸야 해.
- summary는 줄바꿈(\\n)을 사용하여 문장을 구분하고, 광고나 홍보 내용 없이 순수 핵심 내용만 포함해야 해.
- 표나 리스트 형식 말고, 설명문 형태로 작성해줘.
  `.trim()

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: text },
      ],
      model: 'deepseek-r1-distill-llama-70b',
      temperature: 0.7,
    })

    const rawText = chatCompletion.choices?.[0]?.message?.content ?? '{}'
    console.log('[📥 LLM 원본 응답]', rawText)

    // JSON 파싱
    const jsonMatch = rawText.match(/{[\s\S]*?}/)
    if (!jsonMatch) throw new Error('JSON 형식 응답을 찾을 수 없음')

    const jsonResult = JSON.parse(jsonMatch[0])
    console.log('[📥 LLM 응답 JSON]', jsonResult.title, jsonResult.summary)

    return jsonResult
  } catch (err) {
    console.error('[❌ 요약 실패]', err)
    return {
      title: '요약 실패',
      summary: '요약을 가져오는 중 오류가 발생했습니다.',
    }
  }
}
