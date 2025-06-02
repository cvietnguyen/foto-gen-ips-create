
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
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
          <Button 
            onClick={onLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign in with Azure AD
          </Button>
          
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
