const { TrueFoundryGateway } = require('truefoundry-gateway-sdk');
require('dotenv').config();

async function test(url) {
  const client = new TrueFoundryGateway({
    baseUrl: url,
    apiKey: process.env.TRUEFOUNDRY_API_KEY
  });
  try {
    console.log(`Trying URL: ${url}...`);
    await client.private.agents.sessions.create({ agentName: "agent-root" });
    console.log(`✅ Success with URL: ${url}`);
  } catch (e) {
    console.log(`❌ Failed with URL: ${url} -> ${e.statusCode}`);
  }
}

async function main() {
  await test('https://llm-gateway.truefoundry.com');
  await test('https://gateway.truefoundry.com');
  await test('https://api.truefoundry.com');
}
main();
