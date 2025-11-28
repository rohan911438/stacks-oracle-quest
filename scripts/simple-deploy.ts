import { 
  makeContractDeploy, 
  broadcastTransaction, 
  AnchorMode,
  PostConditionMode
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment
dotenv.config({ path: '.env.contracts' });

async function simpleDeploy() {
  const privateKeyHex = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKeyHex) {
    throw new Error('DEPLOYER_PRIVATE_KEY required in .env.contracts');
  }

  // Read contract
  const contractSource = fs.readFileSync('contracts/oracle-market.clar', 'utf8');
  console.log('📄 Contract loaded, size:', contractSource.length, 'bytes');

  // Create network
  const network = new StacksTestnet();
  
  console.log('🚀 Creating deployment transaction...');
  
  try {
    const txOptions = {
      contractName: 'oracle-market',
      codeBody: contractSource,
      senderKey: privateKeyHex,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 100000, // Higher fee
    };

    const transaction = await makeContractDeploy(txOptions);
    console.log('✅ Transaction created successfully');
    
    console.log('📡 Broadcasting to network...');
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    console.log('🎉 SUCCESS! Contract deployed!');
    console.log('📍 Transaction ID:', broadcastResponse.txid);
    console.log('🔍 View on Explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=testnet`);
    console.log('📜 Contract Address: ST2A5QBP1A47332FEK5F0HZ1VY9V0KSFYWNH5SNGF.oracle-market');
    
    return broadcastResponse;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    
    // Try to give more helpful error information
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        console.log('💰 Make sure your address has enough STX tokens');
        console.log('🔗 Get tokens: https://explorer.hiro.so/sandbox/faucet?chain=testnet');
      } else if (error.message.includes('contract already exists')) {
        console.log('📝 Contract with this name already exists at this address');
        console.log('🔄 Try changing the contract name or use a different address');
      }
    }
    
    throw error;
  }
}

// Run deployment
simpleDeploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Final error:', error.message);
    process.exit(1);
  });