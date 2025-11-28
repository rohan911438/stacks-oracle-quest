import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import {
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  makeContractDeploy,
  callReadOnlyFunction,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion,
  // ClarityVersion is supported in newer stacks.js; falls back if unavailable
  // @ts-ignore
  ClarityVersion,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

async function main() {
  // Load env from .env then .env.contracts (if present)
  dotenv.config();
  dotenv.config({ path: path.resolve(process.cwd(), '.env.contracts') });
  const CONTRACT_NAME = process.env.CONTRACT_NAME || 'oracle-market';
  const CONTRACT_PATH = process.env.CONTRACT_PATH || 'contracts/oracle-market.clar';
  const STACKS_NETWORK = (process.env.STACKS_NETWORK || 'testnet').toLowerCase();
  const STACKS_API_URL = process.env.STACKS_API_URL || (STACKS_NETWORK === 'mainnet'
    ? 'https://api.hiro.so'
    : 'https://api.testnet.hiro.so');
  const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.STACKS_PRIVATE_KEY;

  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error('Missing DEPLOYER_PRIVATE_KEY (or STACKS_PRIVATE_KEY) in env');
  }

  const sourcePath = path.resolve(process.cwd(), CONTRACT_PATH);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Contract file not found at ${sourcePath}`);
  }
  const codeBody = fs.readFileSync(sourcePath, 'utf8');

  const network = STACKS_NETWORK === 'mainnet' ? new StacksMainnet({ url: STACKS_API_URL }) : new StacksTestnet({ url: STACKS_API_URL });

  // Validate the private key and get address
  const privKey = createStacksPrivateKey(DEPLOYER_PRIVATE_KEY);
  const senderAddress = getAddressFromPrivateKey(
    DEPLOYER_PRIVATE_KEY, 
    STACKS_NETWORK === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet
  );

  console.log(`Deploying contract`);
  console.log(`  name: ${CONTRACT_NAME}`);
  console.log(`  file: ${sourcePath}`);
  console.log(`  network: ${STACKS_NETWORK} (${STACKS_API_URL})`);
  console.log(`  deployer: ${senderAddress}`);

  const tx = await makeContractDeploy({
    contractName: CONTRACT_NAME,
    codeBody,
    senderKey: DEPLOYER_PRIVATE_KEY,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    fee: 10000, // Manual fee to avoid estimation issues
    // Prefer Clarity 3 where supported (Explorer Sandbox expects C3)
    // If the library doesn't support this yet, it will be ignored at runtime
    // @ts-ignore
    clarityVersion: (ClarityVersion && (ClarityVersion as any).Clarity3) || 3,
  });

  let result;
  try {
    result = await broadcastTransaction(tx, network);
    console.log('Raw broadcast result:', result);
  } catch (error) {
    console.error('Broadcast error details:', error);
    // Try alternative API endpoint
    console.log('Trying alternative API...');
    const altNetwork = STACKS_NETWORK === 'mainnet' 
      ? new StacksMainnet({ url: 'https://stacks-node-api.mainnet.stacks.co' }) 
      : new StacksTestnet({ url: 'https://stacks-node-api.testnet.stacks.co' });
    result = await broadcastTransaction(tx, altNetwork);
  }
  
  // @ts-ignore - result may be string or object depending on version
  const txid: string = result.txid || result || '';
  if (!txid) {
    console.error('Broadcast response:', result);
    throw new Error('Failed to broadcast contract deploy');
  }

  const explorer = STACKS_NETWORK === 'mainnet'
    ? `https://explorer.hiro.so/txid/${txid}?chain=mainnet`
    : `https://explorer.hiro.so/txid/${txid}?chain=testnet`;

  console.log('Deploy transaction broadcasted.');
  console.log(`TXID: ${txid}`);
  console.log(`Explorer: ${explorer}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
