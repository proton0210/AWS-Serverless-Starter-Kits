#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cdkOutputPath = path.join(__dirname, '../../backend/cdk-outputs.json');
const envLocalPath = path.join(__dirname, '../.env.local');

function setupEnvironment() {
  console.log('Setting up environment variables from CDK outputs...');

  // Check if CDK outputs exist
  if (!fs.existsSync(cdkOutputPath)) {
    console.error('Error: cdk-outputs.json not found!');
    console.error('Please deploy the backend first by running:');
    console.error('  cd ../backend && npm run deploy');
    process.exit(1);
  }

  try {
    // Read CDK outputs
    const cdkOutputs = JSON.parse(fs.readFileSync(cdkOutputPath, 'utf8'));
    
    // Find the relevant stack outputs
    let userPoolId = '';
    let userPoolClientId = '';
    let graphqlEndpoint = '';
    let region = 'us-east-1'; // Default region

    // Search through all stacks for the required outputs
    for (const [stackName, outputs] of Object.entries(cdkOutputs)) {
      for (const [key, value] of Object.entries(outputs)) {
        if (key.includes('UserPoolId')) {
          userPoolId = value;
        } else if (key.includes('UserPoolClientId')) {
          userPoolClientId = value;
        } else if (key.includes('GraphQLApiEndpoint') || key.includes('AppsyncGraphqlUrl')) {
          graphqlEndpoint = value;
          // Extract region from endpoint
          const regionMatch = value.match(/\.([a-z]{2}-[a-z]+-\d+)\./);
          if (regionMatch) {
            region = regionMatch[1];
          }
        }
      }
    }

    // Validate required values
    if (!userPoolId || !userPoolClientId || !graphqlEndpoint) {
      console.error('Error: Missing required CDK outputs!');
      console.error('Found:');
      console.error(`  UserPoolId: ${userPoolId || 'NOT FOUND'}`);
      console.error(`  UserPoolClientId: ${userPoolClientId || 'NOT FOUND'}`);
      console.error(`  GraphQL Endpoint: ${graphqlEndpoint || 'NOT FOUND'}`);
      process.exit(1);
    }

    // Create .env.local content
    const envContent = `# AWS Cognito Configuration
NEXT_PUBLIC_USER_POOL_ID=${userPoolId}
NEXT_PUBLIC_USER_POOL_CLIENT_ID=${userPoolClientId}

# AWS AppSync Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT=${graphqlEndpoint}
NEXT_PUBLIC_AWS_REGION=${region}

# Generated from CDK outputs on ${new Date().toISOString()}
`;

    // Write .env.local file
    fs.writeFileSync(envLocalPath, envContent);
    
    console.log('✅ Successfully created .env.local with:');
    console.log(`   - User Pool ID: ${userPoolId}`);
    console.log(`   - User Pool Client ID: ${userPoolClientId}`);
    console.log(`   - GraphQL Endpoint: ${graphqlEndpoint}`);
    console.log(`   - AWS Region: ${region}`);
    console.log('\nYou can now run the development server with: npm run dev');

  } catch (error) {
    console.error('Error processing CDK outputs:', error);
    process.exit(1);
  }
}

// Run the setup
setupEnvironment();