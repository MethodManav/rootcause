const { TrueFoundryGateway } = require('truefoundry-gateway-sdk');
require('dotenv').config();

const client = new TrueFoundryGateway({
  baseUrl: process.env.TRUEFOUNDRY_GATEWAY_URL,
  apiKey: process.env.TRUEFOUNDRY_API_KEY
});

async function main() {
  const namesToTry = ['agent-root', 'rootcause', 'rootcause-agent', 'agent', 'root', 'default/rootcause', 'default/agent-root'];
  for (const name of namesToTry) {
    try {
      console.log(`Trying agentName: ${name}...`);
      await client.private.agents.sessions.create({ agentName: name });
      console.log(`✅ Success with agentName: ${name}`);
      return;
    } catch (e) {
      console.log(`❌ Failed with agentName: ${name} -> ${e.statusCode}`);
    }
  }
}
main();
