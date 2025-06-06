'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center items-center px-6 py-16 text-gray-800">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to IOTechz Internship LMS
        </h1>
        <p className="text-lg text-gray-600">
          Learn, build, and grow with real-world projects, guided mentorship, and a powerful LMS experience tailored for interns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          {user ? 
          <>
            <Link href="/dashboard">
            <Button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Get Started
            </Button>
          </Link>
          </>:<><Link href="/sign-up">
            <Button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Get Started
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" className="px-6 py-3 rounded-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              Login
            </Button>
          </Link></>}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-6xl px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Structured Curriculum</h3>
          <p className="text-gray-600">Access learning paths, resources, and tasks specific to your domain.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">Monitor your daily, weekly, and overall progress as you learn.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Mentorship Support</h3>
          <p className="text-gray-600">Connect with expert mentors for guidance throughout your journey.</p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-2">Kickstart your career with IOTechz</h2>
        <p className="text-gray-600 mb-4">Apply now or log in to explore your dashboard.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/apply">
            <Button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Apply Now
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="px-6 py-3 rounded-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
