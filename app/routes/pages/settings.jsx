import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";
import { Icon } from "../../components/ui/Icon";

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
  const [alert, setAlert] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const { success, message, error, action } = fetcher.data;

      if (success) {
        setAlert({ type: 'success', message: message || 'Action completed successfully!' });

        // Reset forms/modals on success
        if (action === 'processPayment') {
          setIsPaymentModalOpen(false);
        }
        if (action === 'submitSupport') {
          setSupportMessage('');
          setSupportSubject('');
          setIsSupportModalOpen(false);
        }
      } else {
        // Show error alert if the server response indicates failure
        setAlert({ type: 'error', message: error || 'An error occurred.' });
      }
    }
  }, [fetcher.state, fetcher.data]);


  const handlePurchase = () => {
    if (selectedPackage) {
      fetcher.submit(
        { _action: "purchasePackage", packageId: selectedPackage },
        { method: "post" }
      );
    }
  };

  const handleSaveSettings = () => {
    fetcher.submit(
      { _action: "saveSettings", providerApiKey, senderId },
      { method: "post" }
    );
  };

  const handleProcessPayment = () => {
    fetcher.submit(
      {
        _action: "processPayment",
        packageId: selectedPackage,
        paymentMethod,
        amount: packages.find(p => p.id === selectedPackage)?.price || 0,
        action: 'processPayment' // Send action name to get it back in response
      },
      { method: "post" }
    );
  };

  const handleSubmitSupport = () => {
    fetcher.submit(
      {
        _action: "submitSupport",
        subject: supportSubject,
        message: supportMessage,
        action: 'submitSupport' // Send action name to get it back in response
      },
      { method: "post" }
    );
  };

  const handleExportTransactions = () => {
    const csvData = transactions.map(tx => ({
      date: new Date(tx.date || tx.createdAt).toLocaleDateString(),
      type: tx.type,
      description: tx.description || tx.type,
      amount: tx.amount,
      credits: tx.credits || 0
    }));

    if (csvData.length === 0) {
      setAlert({ type: 'info', message: 'No transactions to export.' });
      return;
    }

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

  const isSubmitting = fetcher.state === "submitting";

  return (
    <PageLayout>
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

      {/* Page Header */}
      <PageHeader
        title="Settings"
        subtitle="Manage your account and billing preferences"
        actions={
          <ActionGroup>
            <ActionButton
              variant="outline"
              onClick={() => setIsSupportModalOpen(true)}
            >
              <Icon name="support" size="sm" className="mr-2" />
              Support
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <Icon name="credit" size="sm" className="mr-2" />
              Add Funds
            </ActionButton>
          </ActionGroup>
        }
      >
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Settings</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Page Content */}
      <PageContent>
        <PageSection>
          <Tabs defaultValue="billing">
            
            {/* STYLING UPDATED HERE to match your screenshot and fix UX */}
            <TabsList className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-1 bg-gray-100 rounded-xl mb-8 shadow-inner">
              <TabsTrigger
                value="billing"
                className="flex-1 px-4 py-1 text-sm text-secondary font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="wallet" size="sm" /> Billing
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="flex-1 px-4 py-1 text-sm text-secondary font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="users" size="sm" /> Contacts
              </TabsTrigger>
              <TabsTrigger
                value="sms"
                className="flex-1 px-4 py-1 text-sm text-secondary font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="sms" size="sm" /> SMS Provider
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="flex-1 px-4 py-1 text-sm text-secondary font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-white/50 flex items-center justify-center gap-2"
              >
                <Icon name="settings" size="sm" /> System
              </TabsTrigger>
            </TabsList>
            {/* END STYLING UPDATE */}

            {/* Billing Tab */}
            <TabsContent value="billing">
              <div className="space-y-6">
                {/* Current Balance */}
                <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-gray-900">Current Balance</h3>
                      <Badge variant="info" size="lg">
                        {formatCurrency(balance.balance)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Card className="bg-primary/10 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Wallet Balance</p>
                            <p className="text-3xl font-bold text-primary">
                              {formatCurrency(balance.balance)}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                            <Icon name="wallet" size="lg" className="text-primary" />
                          </div>
                        </div>
                      </Card>
                      <Card className="bg-secondary/10 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">SMS Credits</p>
                            <p className="text-3xl font-bold text-secondary">
                              {balance.credits?.toLocaleString() || "0"}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                            <Icon name="sms" size="lg" className="text-secondary" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </Card>
                {/* Purchase SMS Credits */}
                <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-gray-900">Purchase SMS Credits</h3>
                      <Badge variant="info" size="lg">
                        {packages.length} packages
                      </Badge>
                    </div>
                  </div>
                  {packages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                      {packages.map((pkg) => (
                        <Card
                          key={pkg.id}
                          className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 ${
                            selectedPackage === pkg.id
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedPackage(pkg.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {pkg.name}
                            </h4>
                            {selectedPackage === pkg.id && (
                              <Badge variant="primary" size="sm">Selected</Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary mb-1">
                            {pkg.credits?.toLocaleString()} credits
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(pkg.price)} ({pkg.pricePerCredit?.toFixed(4)} per SMS)
                          </p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon name="package" size="2xl" className="text-gray-400" />
                      </div>
                      <p className="text-caption text-gray-600 mt-2">No packages available</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={handlePurchase}
                      disabled={!selectedPackage || isSubmitting}
                      className="rounded-xl"
                    >
                      {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="credit" size="sm" className="mr-2" />}
                      Purchase Package
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="rounded-xl"
                    >
                      <Icon name="settings" size="sm" className="mr-2" />
                      Payment Options
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
                        <Icon name="download" size="sm" className="mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <Card key={tx.id} className="p-4 hover:bg-primary/5 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Icon 
                                  name={tx.type === "purchase" ? "credit" : "sms"} 
                                  size="sm" 
                                  className={tx.type === "purchase" ? "text-primary" : "text-secondary"} 
                                />
                              </div>
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
                                <Badge variant={tx.credits > 0 ? "success" : "danger"} size="sm">
                                  {tx.credits > 0 ? "+" : ""}{tx.credits?.toLocaleString() || 0} credits
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
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon name="document" size="2xl" className="text-gray-400" />
                      </div>
                      <p className="text-caption mt-2">No transactions yet</p>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                  <div className="p-6 bg-red-50 rounded-xl">
                    <p className="text-caption text-deep mb-1">Unsubscribed</p>
                    <p className="text-h2 text-red-600">
                      {contactStats.unsubscribed?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="rounded-xl">
                    <Icon name="upload" size="sm" className="mr-2" />
                    Import Contacts
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <Icon name="download" size="sm" className="mr-2" />
                    Export Data
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* SMS Provider Tab */}
            <TabsContent value="sms">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                    disabled={isSubmitting}
                    className="rounded-xl"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="check" size="sm" className="mr-2" />}
                    Save Settings
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-h3 mb-4">System Health</h2>
                {systemHealth.ok ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="success" size="lg" className="text-green-600" />
                        <span className="text-body font-medium text-deep">System Status</span>
                      </div>
                      <span className="text-body font-semibold text-green-600">Operational</span>
                    </div>
                    {systemHealth.checks && Object.entries(systemHealth.checks).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon
                            name={value.status === "healthy" ? "success" : "warning"}
                            size="md"
                            className={value.status === "healthy" ? "text-green-600" : "text-yellow-600"}
                          />
                          <span className="text-body capitalize">{key}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          value.status === "healthy" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {value.status || "unknown"}
                        </span>
                      </div>
                    ))}
                    {systemHealth.uptime && (
                      <div className="p-4 bg-blue-50 rounded-lg mt-4">
                        <p className="text-body text-deep">
                          Uptime: {Math.floor(systemHealth.uptime / 3600)}h{" "}
                          {Math.floor((systemHealth.uptime % 3600) / 60)}m
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon name="warning" size="2xl" className="text-yellow-600" />
                    </div>
                    <h3 className="text-h3 mt-4 mb-2">Health check unavailable</h3>
                    <p className="text-caption">System health information could not be retrieved</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </PageSection>
      </PageContent>

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
              disabled={!selectedPackage || isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="lock" size="sm" className="mr-2" />}
              Process Payment
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
              disabled={!supportSubject || !supportMessage || isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="mail" size="sm" className="mr-2" />}
              Submit Ticket
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
    </PageLayout>
  );
}