import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, FileText, AlertCircle, TrendingUp, Shield } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function Banking() {
  const { data: bankAccounts, isLoading: accountsLoading } = trpc.banking.getBankAccounts.useQuery();
  const { data: lifeInsurance, isLoading: lifeLoading } = trpc.banking.getLifeInsurancePolicies.useQuery();
  const { data: termInsurance, isLoading: termLoading } = trpc.banking.getTermInsurancePolicies.useQuery();
  const { data: claims, isLoading: claimsLoading } = trpc.banking.getInsuranceClaims.useQuery();

  const totalBankBalance = bankAccounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;
  const activePolicies = ((lifeInsurance?.length || 0) + (termInsurance?.length || 0));
  const pendingClaims = claims?.filter(c => c.status === "submitted" || c.status === "under-review").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banking & Insurance</h1>
          <p className="text-gray-600 mt-2">Manage your financial accounts and insurance policies</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <DollarSign className="w-4 h-4 text-green-600" />
                Total Bank Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">₹{totalBankBalance.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-2">{bankAccounts?.length || 0} accounts</p>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Shield className="w-4 h-4 text-blue-600" />
                Active Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{activePolicies}</div>
              <p className="text-xs text-gray-500 mt-2">{lifeInsurance?.length || 0} Life + {termInsurance?.length || 0} Term</p>
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

        {/* Bank Accounts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Bank Accounts</h2>
            <Link href="/banking/add-account">
              <Button>Add Account</Button>
            </Link>
          </div>

          {accountsLoading ? (
            <p className="text-gray-500">Loading accounts...</p>
          ) : bankAccounts && bankAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankAccounts.map((account) => (
                <Card key={account.id} className="card-premium">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{account.bankName}</CardTitle>
                        <CardDescription>{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account</CardDescription>
                      </div>
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">Account Number</p>
                      <p className="text-sm font-mono text-gray-900">****{account.accountNumber.slice(-4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Current Balance</p>
                      <p className="text-2xl font-bold text-gray-900">₹{(account.balance || 0).toLocaleString()}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">IFSC: {account.ifscCode}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-premium">
              <CardContent className="py-8 text-center">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No bank accounts added yet</p>
                <Link href="/banking/add-account">
                  <Button variant="outline" className="mt-4">Add Your First Account</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Insurance Policies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Life Insurance */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Life Insurance</h2>
              <Link href="/banking/add-life-insurance">
                <Button size="sm">Add Policy</Button>
              </Link>
            </div>

            {lifeLoading ? (
              <p className="text-gray-500">Loading policies...</p>
            ) : lifeInsurance && lifeInsurance.length > 0 ? (
              <div className="space-y-3">
                {lifeInsurance.map((policy) => (
                  <Card key={policy.id} className="card-premium">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{policy.providerName}</p>
                          <p className="text-xs text-gray-600">Policy #{policy.policyNumber}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          policy.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-gray-600">Coverage</p>
                          <p className="font-semibold text-gray-900">₹{(policy.coverageAmount || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Premium</p>
                          <p className="font-semibold text-gray-900">₹{(policy.premiumAmount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-premium">
                <CardContent className="py-6 text-center">
                  <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No life insurance policies</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Term Insurance */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Term Insurance</h2>
              <Link href="/banking/add-term-insurance">
                <Button size="sm">Add Policy</Button>
              </Link>
            </div>

            {termLoading ? (
              <p className="text-gray-500">Loading policies...</p>
            ) : termInsurance && termInsurance.length > 0 ? (
              <div className="space-y-3">
                {termInsurance.map((policy) => (
                  <Card key={policy.id} className="card-premium">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{policy.providerName}</p>
                          <p className="text-xs text-gray-600">Policy #{policy.policyNumber}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          policy.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-gray-600">Coverage</p>
                          <p className="font-semibold text-gray-900">₹{(policy.coverageAmount || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Term</p>
                          <p className="font-semibold text-gray-900">{policy.term} years</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-premium">
                <CardContent className="py-6 text-center">
                  <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No term insurance policies</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

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
                        <p className="text-sm text-gray-600">₹{(claim.claimAmount || 0).toLocaleString()}</p>
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
