import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    authenticationFlowType: 'USER_SRP_AUTH',
    oauth: {
      domain: 'your-domain.auth.us-east-1.amazoncognito.com',
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'http://localhost:5173/',
      redirectSignOut: 'http://localhost:5173/',
      responseType: 'code'
    }
  },
  API: {
    endpoints: [
      {
        name: "EBSAPI",
        endpoint: import.meta.env.VITE_API_BASE_URL,
        region: import.meta.env.VITE_AWS_REGION
      }
    ]
  },
  Storage: {
    AWSS3: {
      bucket: 'your-bucket-name',
      region: import.meta.env.VITE_AWS_REGION
    }
  }
});

export default Amplify;