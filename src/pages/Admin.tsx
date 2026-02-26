"use client";

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a proper authentication
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage cars, showrooms, offers, and blog posts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Manage Cars</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add, edit, or remove car listings
            </p>
            <Button variant="outline" className="w-full">
              Go to Cars
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Manage Showrooms</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Update showroom information and locations
            </p>
            <Button variant="outline" className="w-full">
              Go to Showrooms
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Manage Offers</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create and manage special offers
            </p>
            <Button variant="outline" className="w-full">
              Go to Offers
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Manage Blog</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Write and publish blog posts
            </p>
            <Button variant="outline" className="w-full">
              Go to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;