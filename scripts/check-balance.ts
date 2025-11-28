import { 
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion
} from '@stacks/transactions';
import * as dotenv from 'dotenv';

// Load environment
dotenv.config({ path: '.env.contracts' });

async function checkAddressBalance() {
  const privateKeyHex = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKeyHex) {
    console.error('❌ DEPLOYER_PRIVATE_KEY environment variable is required');
    process.exit(1);
  }

  // Create private key and get address
  const privateKey = createStacksPrivateKey(privateKeyHex);
  const address = getAddressFromPrivateKey(privateKey.data, TransactionVersion.Testnet);
  
  console.log('🔍 Checking address:', address);
  console.log('🌐 Explorer:', `https://explorer.hiro.so/address/${address}?chain=testnet`);
  
  try {
    const response = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${address}/balances`);
    
    if (response.status === 404) {
      console.log('\n❌ Address not found on testnet - needs funding!');
      console.log('\n💰 Get testnet STX tokens from the faucet:');
      console.log('🔗 https://explorer.hiro.so/sandbox/faucet?chain=testnet');
      console.log('\n📝 Steps:');
      console.log('1. Visit the faucet link above');
      console.log('2. Enter your address:', address);
      console.log('3. Click "Request STX"');
      console.log('4. Wait a few minutes for the transaction to confirm');
      console.log('5. Run this script again to verify funding');
      console.log('6. Then run the deployment script');
      return;
    }
    
    if (!response.ok) {
      console.error('❌ Error checking balance:', response.statusText);
      return;
    }
    
    const balanceData = await response.json();
    const stxBalance = parseInt(balanceData.stx.balance) / 1000000; // Convert microSTX to STX
    
    console.log('\n💰 Current Balance:');
    console.log('STX:', stxBalance.toFixed(6));
    
    if (stxBalance >= 0.1) {
      console.log('✅ Address has sufficient STX for deployment!');
      console.log('\n🚀 You can now run deployment:');
      console.log('npx tsx scripts/robust-deploy.ts');
    } else {
      console.log('⚠️  Low STX balance - you may need more tokens for deployment');
      console.log('💰 Get more from faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💰 If address needs funding, get testnet STX from:');
    console.log('🔗 https://explorer.hiro.so/sandbox/faucet?chain=testnet');
    console.log('📍 Address to fund:', address);
  }
}

checkAddressBalance();