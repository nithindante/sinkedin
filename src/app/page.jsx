"use client"

import Link from 'next/link';
import { Briefcase, Users, MessageSquare, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="bg-dark-secondary border-b border-dark-border">
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl font-bold text-light mb-4">
                S<strike className="text-accent no-underline">in</strike>kedIn
              </h1>
              <p className="text-light-secondary text-xl mb-6">
                Where careers go to die (and get roasted)
              </p>
              <p className="text-gray-300 mb-8 text-lg">
                Join the most brutally honest professional network. Share your fails,
                get roasted, and laugh at others' career disasters.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/signup" 
                  className="bg-accent hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Join the Disaster
                </Link>
                <Link
                  href="/welcome"
                  className="bg-gray-700 hover:bg-gray-600 border border-dark-border text-light px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Explore the Chaos
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              {/* Warning Box */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="text-accent mr-3 mt-1">⚠️</div>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-2">
                      Fair Warning
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      This isn't your typical professional network. We celebrate failures,
                      embrace awkwardness, and turn career disasters into comedy gold.
                      If you can't handle brutal honesty and dark humor, LinkedIn is that way →
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-light">Why Choose <span className="text-light">
            S<strike className="text-accent no-underline">in</strike>kedIn
          </span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Briefcase className="w-8 h-8" />}
              title="Career Catastrophes"
              description="Share your most epic interview fails and rejection stories"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Failure Network"
              description="Connect with fellow professional disasters"
            />
            <FeatureCard 
              icon={<MessageSquare className="w-8 h-8" />}
              title="Premium Roasts"
              description="Get and give brutally honest feedback on your career choices"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8" />}
              title="Anti-Success Stories"
              description="Learn what not to do from others' magnificent mistakes"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-dark-secondary border-t border-dark-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-light">Ready to Embrace the Chaos?</h2>
          <p className="text-light-secondary text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've given up on maintaining a perfect image.
            It's time to get real about your career disasters.
          </p>
          <Link 
            href="/signup"
            className="bg-accent hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Start Your Downfall
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-dark-secondary border border-dark-border p-6 rounded-lg hover:border-accent transition-colors">
      <div className="text-accent mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-light text-xl font-semibold mb-3">{title}</h3>
      <p className="text-light-secondary">{description}</p>
    </div>
  );
}
