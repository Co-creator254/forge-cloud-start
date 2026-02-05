import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-farming-team.jpg';
import sokoconnectLogo from '@/assets/sokoconnect-logo.png';

const ResetPassword: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      setSent(true);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={sokoconnectLogo} 
                alt="SokoConnect Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-white">Soko</span>
              <span className="text-green-400">Connect</span>
            </h1>
          </div>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-white">Reset Password</CardTitle>
              <CardDescription className="text-gray-200">
                {sent ? "Check your email for the reset link" : "Enter your email to receive a password reset link"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-white mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-300 mb-6">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSent(false)}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    Try Another Email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3" 
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link 
                to="/auth" 
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
