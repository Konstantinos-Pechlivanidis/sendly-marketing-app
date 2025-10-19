import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";

export default function SettingsPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  
  const balance = data?.balance || {};
  const transactions = data?.transactions?.items || [];
  const packages = data?.packages?.items || [];
  const contactStats = data?.contactStats || {};
  const systemHealth = data?.systemHealth || {};
  const settings = data?.settings || {};

  const [selectedPackage, setSelectedPackage] = useState("");
  const [providerApiKey, setProviderApiKey] = useState(settings.smsProvider?.apiKey || "");
  const [senderId, setSenderId] = useState(settings.smsProvider?.senderId || "");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [billingSettings, setBillingSettings] = useState({
    autoRecharge: false,
    autoRechargeAmount: 50,
    lowBalanceAlert: true,
    lowBalanceThreshold: 10
  });

  const handlePurchase = () => {
    if (selectedPackage) {
      setLoading(true);
      fetcher.submit(
        { _action: "purchasePackage", packageId: selectedPackage },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Package purchase initiated!' });
      setLoading(false);
    }
  };

  const handleSaveSettings = () => {
    setLoading(true);
    fetcher.submit(
      { _action: "saveSettings", providerApiKey, senderId },
      { method: "post" }
    );
    setAlert({ type: 'success', message: 'Settings saved successfully!' });
    setLoading(false);
  };

  const handleSaveBillingSettings = () => {
    setLoading(true);
    fetcher.submit(
      { _action: "saveBillingSettings", ...billingSettings },
      { method: "post" }
    );
    setAlert({ type: 'success', message: 'Billing settings saved successfully!' });
    setLoading(false);
  };

  const handleProcessPayment = () => {
    setLoading(true);
    fetcher.submit(
      { 
        _action: "processPayment", 
        packageId: selectedPackage,
        paymentMethod,
        amount: packages.find(p => p.id === selectedPackage)?.price || 0
      },
      { method: "post" }
    );
    setAlert({ type: 'success', message: 'Payment processed successfully!' });
    setIsPaymentModalOpen(false);
    setLoading(false);
  };

  const handleSubmitSupport = () => {
    setLoading(true);
    fetcher.submit(
      { 
        _action: "submitSupport", 
        subject: supportSubject,
        message: supportMessage
      },
      { method: "post" }
    );
    setAlert({ type: 'success', message: 'Support ticket submitted successfully!' });
    setIsSupportModalOpen(false);
    setSupportMessage('');
    setSupportSubject('');
    setLoading(false);
  };

  const handleExportTransactions = () => {
    const csvData = transactions.map(tx => ({
      date: new Date(tx.date || tx.createdAt).toLocaleDateString(),
      type: tx.type,
      description: tx.description || tx.type,
      amount: tx.amount,
      credits: tx.credits || 0
    }));
    
    const csv = convertToCSV(csvData);
    downloadCSV(csv, 'transactions.csv');
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    return csvContent;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="min-h-screen bg-background">
      {/* Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* iOS 18 Glass Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1">Settings</h1>
              <p className="text-caption mt-1">Manage your account and billing preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsSupportModalOpen(true)}
                className="rounded-xl"
              >
                🆘 Support
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsPaymentModalOpen(true)}
                className="rounded-xl"
              >
                💳 Add Funds
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        <Tabs defaultValue="billing">
          <TabsList className="flex gap-2 bg-muted rounded-xl p-2 mb-6 overflow-x-auto">
            <TabsTrigger value="billing" className="rounded-lg px-6 py-2">
              💳 Billing
            </TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-lg px-6 py-2">
              👥 Contacts
            </TabsTrigger>
            <TabsTrigger value="sms" className="rounded-lg px-6 py-2">
              📱 SMS Provider
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-lg px-6 py-2">
              ⚙️ System
            </TabsTrigger>
          </TabsList>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Current Balance */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h3">Current Balance</h2>
                  <Badge variant="info" size="lg">
                    {formatCurrency(balance.balance)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card className="p-6 bg-primary/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-caption text-deep mb-1">Wallet Balance</p>
                        <p className="text-h1 text-primary">
                          {formatCurrency(balance.balance)}
                        </p>
                      </div>
                      <Badge variant="primary" size="lg">💰</Badge>
                    </div>
                  </Card>
                  <Card className="p-6 bg-secondary/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-caption text-deep mb-1">SMS Credits</p>
                        <p className="text-h1 text-secondary">
                          {balance.credits?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <Badge variant="secondary" size="lg">📱</Badge>
                    </div>
                  </Card>
                </div>
              </Card>

              {/* Purchase SMS Credits */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h3">Purchase SMS Credits</h2>
                  <Badge variant="info" size="lg">
                    {packages.length} packages
                  </Badge>
                </div>
                {packages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                    {packages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`p-6 cursor-pointer transition-all duration-200 ${
                          selectedPackage === pkg.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-body font-semibold text-deep">
                            {pkg.name}
                          </h3>
                          {selectedPackage === pkg.id && (
                            <Badge variant="primary" size="sm">Selected</Badge>
                          )}
                        </div>
                        <p className="text-h2 text-primary mb-1">
                          {pkg.credits?.toLocaleString()} credits
                        </p>
                        <p className="text-caption text-gray-600">
                          {formatCurrency(pkg.price)} ({pkg.pricePerCredit?.toFixed(4)} per SMS)
                        </p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl">📦</span>
                    <p className="text-caption text-gray-600 mt-2">No packages available</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handlePurchase}
                    disabled={!selectedPackage || loading}
                    className="rounded-xl"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Purchase Package'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="rounded-xl"
                  >
                    💳 Payment Options
                  </Button>
                </div>
              </Card>

              {/* Transaction History */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h3">Transaction History</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="info" size="lg">
                      {transactions.length} transactions
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportTransactions}
                      className="rounded-lg"
                    >
                      📊 Export
                    </Button>
                  </div>
                </div>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <Card key={tx.id} className="p-4 hover:bg-primary/5 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {tx.type === "purchase" ? "💳" : "📤"}
                            </span>
                            <div>
                              <p className="text-body font-medium text-deep">
                                {tx.description || tx.type}
                              </p>
                              <p className="text-caption text-gray-600">
                                {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Badge variant={tx.amount > 0 ? "success" : "danger"} size="sm">
                                {tx.amount > 0 ? "+" : ""}{tx.amount?.toLocaleString() || 0} credits
                              </Badge>
                              <p className={`text-body font-semibold ${
                                tx.amount > 0 ? "text-primary" : "text-danger"
                              }`}>
                                {formatCurrency(tx.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl">📋</span>
                    <p className="text-caption mt-2">No transactions yet</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">Contact Management</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                <div className="p-6 bg-muted rounded-xl">
                  <p className="text-caption text-gray-600 mb-1">Total Contacts</p>
                  <p className="text-h2 text-deep">
                    {contactStats.total?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-6 bg-primary/10 rounded-xl">
                  <p className="text-caption text-deep mb-1">Subscribed</p>
                  <p className="text-h2 text-primary">
                    {contactStats.subscribed?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-6 bg-danger/10 rounded-xl">
                  <p className="text-caption text-deep mb-1">Unsubscribed</p>
                  <p className="text-h2 text-danger">
                    {contactStats.unsubscribed?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" className="rounded-xl">
                  Import Contacts
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Export Data
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* SMS Provider Tab */}
          <TabsContent value="sms">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">SMS Provider Configuration</h2>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <Label htmlFor="providerApiKey">Provider API Key</Label>
                  <Input
                    id="providerApiKey"
                    type="password"
                    value={providerApiKey}
                    onChange={(e) => setProviderApiKey(e.target.value)}
                    placeholder="Enter your SMS provider API key"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="senderId">Sender ID</Label>
                  <Input
                    id="senderId"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    placeholder="Your business name or number"
                    className="mt-1"
                  />
                  <p className="text-caption mt-1">
                    This will appear as the sender in recipient messages
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleSaveSettings}
                  disabled={fetcher.state === "submitting"}
                  className="rounded-xl"
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              <h2 className="text-h3 mb-4">System Health</h2>
              {systemHealth.ok ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <span className="text-body font-medium text-deep">System Status</span>
                    </div>
                    <span className="text-body font-semibold text-primary">Operational</span>
                  </div>
                  {systemHealth.checks && Object.entries(systemHealth.checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {value.status === "healthy" ? "✅" : "⚠️"}
                        </span>
                        <span className="text-body capitalize">{key}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        value.status === "healthy" ? "text-secondary" : "text-accent"
                      }`}>
                        {value.status || "unknown"}
                      </span>
                    </div>
                  ))}
                  {systemHealth.uptime && (
                    <div className="p-4 bg-secondary/10 rounded-lg mt-4">
                      <p className="text-body text-deep">
                        Uptime: {Math.floor(systemHealth.uptime / 3600)}h{" "}
                        {Math.floor((systemHealth.uptime % 3600) / 60)}m
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-6xl">⚠️</span>
                  <h3 className="text-h3 mt-4 mb-2">Health check unavailable</h3>
                  <p className="text-caption">System health information could not be retrieved</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Payment Options"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleProcessPayment}
              disabled={!selectedPackage || loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Process Payment'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: 'card', label: 'Credit/Debit Card' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'bank', label: 'Bank Transfer' }
              ]}
            />
          </div>

          {selectedPackage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Selected Package</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    {packages.find(p => p.id === selectedPackage)?.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    {packages.find(p => p.id === selectedPackage)?.credits?.toLocaleString()} credits
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-900">
                    {formatCurrency(packages.find(p => p.id === selectedPackage)?.price)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Payment will be processed securely through our payment provider.
            </p>
          </div>
        </div>
      </Modal>

      {/* Support Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="Contact Support"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsSupportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitSupport}
              disabled={!supportSubject || !supportMessage || loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Submit Ticket'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="supportSubject">Subject</Label>
            <Input
              id="supportSubject"
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              placeholder="Brief description of your issue..."
            />
          </div>

          <div>
            <Label htmlFor="supportMessage">Message</Label>
            <Textarea
              id="supportMessage"
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              rows={6}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Support Response:</strong> We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
