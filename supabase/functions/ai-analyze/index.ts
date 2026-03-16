import Anthropic from 'npm:@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn tổ chức đám cưới cao cấp tại Việt Nam, có 15 năm kinh nghiệm. Phân tích kế hoạch đám cưới và đưa ra tư vấn thực tế, cụ thể, ưu tiên theo mức độ khẩn cấp. Trả lời bằng tiếng Việt, dùng markdown với emoji. Giọng điệu: ấm áp, chuyên nghiệp, quan tâm.`

Deno.serve(async (req) => {
  const { context, messages } = await req.json()
  const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages
  })

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' }
  })
})
