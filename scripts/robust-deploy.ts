import { 
  makeContractDeploy, 
  broadcastTransaction, 
  AnchorMode,
  PostConditionMode,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';

// Multiple API endpoints to try
const API_ENDPOINTS = [
  'https://api.testnet.hiro.so',
  'https://stacks-node-api.testnet.stacks.co',
  'https://api.nakamoto.testnet.hiro.so'
];

async function deployWithRetry() {
  // Read environment variables
  const privateKeyHex = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKeyHex) {
    throw new Error('DEPLOYER_PRIVATE_KEY environment variable is required');
  }

  // Read contract source
  const contractPath = path.join(process.cwd(), 'contracts', 'oracle-market.clar');
  const contractSource = fs.readFileSync(contractPath, 'utf8');

  // Create private key and get address
  const privateKey = createStacksPrivateKey(privateKeyHex);
  const address = getAddressFromPrivateKey(privateKey.data, TransactionVersion.Testnet);
  
  console.log('Deploying from address:', address);
  console.log('Contract size:', contractSource.length, 'bytes');

  for (let i = 0; i < API_ENDPOINTS.length; i++) {
    const apiUrl = API_ENDPOINTS[i];
    console.log(`\nAttempt ${i + 1}: Trying API endpoint: ${apiUrl}`);
    
    try {
      const network = new StacksTestnet({ url: apiUrl });
      
      // Try to get nonce, default to 0 for new accounts
      let nonce = 0;
      try {
        const nonceResponse = await fetch(`${apiUrl}/v1/address/${address}/nonces`);
        if (nonceResponse.ok) {
          const nonceData = await nonceResponse.json();
          nonce = nonceData.possible_next_nonce;
        }
      } catch (error) {
        console.log('Using default nonce 0 for new account');
      }
      
      console.log('Using nonce:', nonce);

      // Create transaction with manual fee
      const txOptions = {
        contractName: 'oracle-market',
        codeBody: contractSource,
        senderKey: privateKeyHex,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        nonce,
        fee: 50000 // Higher fee for better success rate
      };

      console.log('Creating contract deploy transaction...');
      const transaction = await makeContractDeploy(txOptions);
      
      console.log('Broadcasting transaction...');
      const response = await fetch(`${apiUrl}/v1/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: Buffer.from(transaction.serialize())
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (response.ok) {
        // Try to parse as JSON, fallback to text
        let result;
        try {
          result = JSON.parse(responseText);
        } catch {
          result = responseText;
        }
        
        console.log('✅ Transaction broadcast successful!');
        console.log('Transaction ID:', typeof result === 'object' ? result.txid : result);
        console.log('🔍 Check status at: https://explorer.hiro.so/txid/' + (typeof result === 'object' ? result.txid : result) + '?chain=testnet');
        
        return result;
      } else {
        console.log('❌ Broadcast failed with status:', response.status);
        console.log('Response:', responseText);
        
        if (i === API_ENDPOINTS.length - 1) {
          throw new Error(`All API endpoints failed. Last error: ${responseText}`);
        }
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ Error with ${apiUrl}:`, errorMsg);
      
      if (i === API_ENDPOINTS.length - 1) {
        throw new Error(`All deployment attempts failed. Last error: ${errorMsg}`);
      }
    }
  }
}

// Load environment and deploy
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.contracts' });

deployWithRetry()
  .then((result) => {
    console.log('\n🎉 Deployment completed successfully!');
    console.log('Result:', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Deployment failed:', error.message);
    process.exit(1);
  });