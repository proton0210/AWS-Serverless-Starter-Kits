#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const jsonFile = path.join(__dirname, '../cdk-outputs.json');
const txtFile = path.join(__dirname, '../cdk-outputs.txt');

try {
  // Read the JSON file
  const jsonContent = fs.readFileSync(jsonFile, 'utf8');
  const outputs = JSON.parse(jsonContent);
  
  // Convert to text format
  let textContent = '# CDK Stack Outputs\n';
  textContent += `# Generated at: ${new Date().toISOString()}\n`;
  textContent += '# ================================================\n\n';
  
  // Iterate through each stack
  for (const [stackName, stackOutputs] of Object.entries(outputs)) {
    textContent += `## Stack: ${stackName}\n`;
    textContent += '-'.repeat(50) + '\n';
    
    // Iterate through each output in the stack
    for (const [outputKey, outputValue] of Object.entries(stackOutputs)) {
      textContent += `${outputKey}: ${outputValue}\n`;
    }
    
    textContent += '\n';
  }
  
  // Write to text file
  fs.writeFileSync(txtFile, textContent);
  console.log(`✅ CDK outputs saved to: ${txtFile}`);
  
  // Optionally, also create an environment variables file
  const envFile = path.join(__dirname, '../.env.cdk-outputs');
  let envContent = '# CDK Output Environment Variables\n';
  envContent += '# This file is auto-generated. Do not edit manually.\n\n';
  
  for (const [stackName, stackOutputs] of Object.entries(outputs)) {
    for (const [outputKey, outputValue] of Object.entries(stackOutputs)) {
      // Convert to environment variable format (uppercase with underscores)
      const envKey = outputKey.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
      envContent += `${envKey}="${outputValue}"\n`;
    }
  }
  
  fs.writeFileSync(envFile, envContent);
  console.log(`✅ Environment variables saved to: ${envFile}`);
  
} catch (error) {
  console.error('❌ Error converting outputs:', error.message);
  process.exit(1);
}