import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, FileText, AlertCircle, Shield, Building2 } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

export default function HealthInsurance() {
  const { data: policies, isLoading: policiesLoading } = trpc.banking.getHealthInsurancePolicies.useQuery();
  const { data: claims, isLoading: claimsLoading } = trpc.banking.getHealthInsuranceClaims.useQuery();
  const { data: providers } = trpc.banking.getHealthInsuranceProviders.useQuery();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const activePolicies = policies?.filter(p => p.status === "active").length || 0;
  const totalSumInsured = policies?.reduce((sum, p) => sum + (p.sumInsured || 0), 0) || 0;
  const pendingClaims = claims?.filter(c => c.status === "submitted" || c.status === "under-review").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Insurance</h1>
          <p className="text-gray-600 mt-2">Manage your health insurance policies and claims</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Shield className="w-4 h-4 text-blue-600" />
                Active Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{activePolicies}</div>
              <p className="text-xs text-gray-500 mt-2">Health insurance plans</p>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Heart className="w-4 h-4 text-red-600" />
                Total Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">₹{(totalSumInsured / 100000).toFixed(1)}L</div>
              <p className="text-xs text-gray-500 mt-2">Sum insured across policies</p>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <FileText className="w-4 h-4 text-orange-600" />
                Pending Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{pendingClaims}</div>
              <p className="text-xs text-gray-500 mt-2">Claims under review</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Policies */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Policies</h2>
            <Button>Add Policy</Button>
          </div>

          {policiesLoading ? (
            <p className="text-gray-500">Loading policies...</p>
          ) : policies && policies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((policy) => (
                <Card key={policy.id} className="card-premium">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{policy.providerName}</CardTitle>
                        <CardDescription>{policy.coverageType.charAt(0).toUpperCase() + policy.coverageType.slice(1)} Coverage</CardDescription>
                      </div>
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">Policy Number</p>
                      <p className="text-sm font-mono text-gray-900">{policy.policyNumber}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Sum Insured</p>
                        <p className="text-lg font-bold text-gray-900">₹{(policy.sumInsured || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Annual Premium</p>
                        <p className="text-lg font-bold text-gray-900">₹{(policy.premiumAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">Status</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${
                        policy.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-premium">
              <CardContent className="py-8 text-center">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No health insurance policies yet</p>
                <Button variant="outline" className="mt-4">Add Your First Policy</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Indian Providers */}
        {providers && providers.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Indian Health Insurance Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <Card key={provider.id} className="card-premium hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{provider.name}</CardTitle>
                      </div>
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Popular Plans:</p>
                      <div className="space-y-1">
                        {provider.plans.slice(0, 3).map((plan, idx) => (
                          <p key={idx} className="text-xs text-gray-700">• {plan}</p>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" size="sm">
                      View Plans
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Claims Section */}
        {claims && claims.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Insurance Claims</h2>
            <div className="space-y-3">
              {claims.map((claim) => (
                <Card key={claim.id} className="card-premium">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-900">Claim #{claim.claimNumber}</p>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            claim.status === "approved" ? "bg-green-100 text-green-700" :
                            claim.status === "rejected" ? "bg-red-100 text-red-700" :
                            claim.status === "paid" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{claim.hospitalName}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">₹{(claim.claimAmount || 0).toLocaleString()}</p>
                      </div>
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
