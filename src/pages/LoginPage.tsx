
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { LoginButton } from '@/auth/LoginButton';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://www.ips-ag.com/wp-content/themes/ips-group-v1/images/ips-logo-no-claim.svg" 
              alt="IPS Logo" 
              className="h-12"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#17428c' }}>
            FotoGen
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">IPS Enterprise</span>
          </div>
          <p className="text-gray-500 text-sm">
            AI-powered image generation platform
          </p>
        </CardHeader>
        
        <CardContent className="pb-12">
          <LoginButton />
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Restricted to IPS group members only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
