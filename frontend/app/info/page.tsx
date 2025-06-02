import { DashboardLayout } from "@/components/DashboardLayout";
import React from "react";

function InfoPage() {
  return (
    <DashboardLayout>
      {/* <h1>What we are thought of going to Building</h1> */}
      {/* <img src="" alt="" />
      
      <div>
        <h2>Currently what we implemented</h2>
        <div>
            <p>Authenication ❌</p>
            <p>Influencer Search with AI ✅</p>
            <p>Implemented YOUTUBE API ✅</p>
            <p>Instagram API ❌</p>
            <p>AI Outreach with phone Negotiation ❌</p>
            <p>With Email ❌</p>
            <p>Call logs ✅</p>
            <p>Phone Negotiation User and AI talk Data ✅</p>
            <p>Other UI Implementation ✅</p>
            <p>For Feature ❌</p>
        </div>

        <p>Provide Some Time We will Finish</p>
      </div>

      <div>
        <h2>How Application works Currently</h2>
        <div>
            <p>Search the Influencer</p>
            <p>Realted Influencer will be shown</p>
            <p>AI Outreach</p>
            <p>Phone Call Negotiation will happen</p>
            <p>Call logs will be displayed in AI outreach section</p>
        </div>
      </div>

      <p>Thank YOU!!!</p> */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What We Are Going to Build
          </h1>

          <div className="my-4">
            <img
              src="https://i.ibb.co/mFbYp9TR/Screenshot-2025-06-02-at-9-50-41-AM.png"
              alt=""
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            Currently What We Implemented
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-500 text-xl mr-3">❌</span>
              <span className="text-gray-700 font-medium">Authentication</span>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <span className="text-gray-700 font-medium">
                Influencer Search with AI
              </span>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <span className="text-gray-700 font-medium">
                YouTube API Implementation
              </span>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-500 text-xl mr-3">❌</span>
              <span className="text-gray-700 font-medium">Instagram API</span>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-500 text-xl mr-3">✅</span>
              <span className="text-gray-700 font-medium">
                AI Outreach with Phone Negotiation
              </span>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-500 text-xl mr-3">❌</span>
              <span className="text-gray-700 font-medium">
                Email Integration
              </span>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <span className="text-gray-700 font-medium">Call Logs</span>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <span className="text-gray-700 font-medium">
                Phone Negotiation Data
              </span>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <span className="text-gray-700 font-medium">
                Other UI Implementation
              </span>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-500 text-xl mr-3">❌</span>
              <span className="text-gray-700 font-medium">Future Features</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium text-center">
              🚀 We will finish these features in due time!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            How Application Works Currently
          </h2>

          <div className="space-y-4">
            <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Search the Influencer
                </h3>
                <p className="text-gray-600 text-sm">
                  Find influencers using our AI-powered search functionality
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Related Influencers Shown
                </h3>
                <p className="text-gray-600 text-sm">
                  View a curated list of relevant influencers based on your
                  search
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  AI Outreach
                </h3>
                <p className="text-gray-600 text-sm">
                  Initiate automated outreach campaigns powered by AI
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Phone Call Negotiation
                </h3>
                <p className="text-gray-600 text-sm">
                  AI handles phone negotiations automatically
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Call Logs Display
                </h3>
                <p className="text-gray-600 text-sm">
                  Review all call logs in the AI outreach section
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-6 px-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-yellow-100">
              We appreciate your interest in our project
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InfoPage;
