import React from "react";
import { useAuth } from "../stores/authStore";
import { isFeatureOn } from "../config/features";
import AppLayout from "../components/AppLayout";
import Companions from "../components/Companions";

export default function FoundersDemo() {
  const { user, authenticated, hasRole } = useAuth();
  const userRoles = user?.roles || [];

  return (
    <AppLayout sidebar={<Companions />}>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold mb-4">🏛️ Founders PAW Demo</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
              <p>Authenticated: {authenticated ? "✅ Yes" : "❌ No"}</p>
              <p>User: {user?.email || "Not logged in"}</p>
              <p>Roles: {userRoles.length > 0 ? userRoles.join(", ") : "None"}</p>
              <p>Is Founder: {hasRole("founder") ? "✅ Yes" : "❌ No"}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Feature Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["JADE", "HERMES", "EVE", "ZEUS", "BETA_REFLECTIONS"].map((feature) => (
                  <div
                    key={feature}
                    className={`p-4 rounded-lg border ${
                      isFeatureOn(feature, userRoles)
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{feature}</span>
                      <span className="text-sm">
                        {isFeatureOn(feature, userRoles) ? "✅ Enabled" : "🔒 Locked"}
                      </span>
                    </div>
                    {isFeatureOn(feature, userRoles) && (
                      <div className="mt-2 text-sm text-gray-600">
                        This companion is available to you!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Environment Info</h2>
              <p>App Tier: {process.env.NEXT_PUBLIC_APP_TIER || "public"}</p>
              <p>Auth Base: {process.env.NEXT_PUBLIC_AUTH_BASE || "Not configured"}</p>
              <p>Cookie Refresh: {process.env.NEXT_PUBLIC_USE_COOKIE_REFRESH || "false"}</p>
            </div>

            {!authenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Demo Mode</h3>
                <p className="text-blue-800 text-sm mt-1">
                  This is a demo of the Founders PAW interface. In production, you would need to:
                </p>
                <ul className="text-blue-800 text-sm mt-2 list-disc list-inside">
                  <li>Log in with founder credentials</li>
                  <li>Have "founder" role in your JWT token</li>
                  <li>Configure NEXT_PUBLIC_APP_TIER=founders</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
