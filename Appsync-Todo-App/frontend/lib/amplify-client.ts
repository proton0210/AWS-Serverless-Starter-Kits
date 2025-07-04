'use client';

import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplify-config';

// Configure Amplify on the client side
if (typeof window !== 'undefined') {
  Amplify.configure(amplifyConfig, { ssr: true });
}

export default Amplify;