import translate from "google-translate-api-x";

const handler = async (request) => {
  try {
    const data = await request.json();
    const text = (await translate(data.text, {to: 'ru'})).text;
    return new Response(JSON.stringify({text,}), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export default handler
