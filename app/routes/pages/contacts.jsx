import { useLoaderData, useSubmit, useActionData } from "react-router";
import { useState, useEffect } from "react";
import { Input, Label } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Pagination } from "../../components/ui/Pagination";
import { Alert } from "../../components/ui/Alert";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";
import { Icon } from "../../components/ui/Icon";
import { api } from "../../utils/api.client";

export default function ContactsPage() {
  const data = useLoaderData();
  const submit = useSubmit();
  const actionData = useActionData();
  const [contacts, setContacts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    filter: 'all',
    q: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    gender: '',
    smsConsent: '',
    hasBirthDate: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: '',
    birthDate: '',
    smsConsent: true
  });

  // Adapt to backend response structure
  const initialContacts = data?.contacts?.data?.contacts || data?.contacts?.items || [];
  const stats = data?.stats?.data || data?.stats || {};
  const pagination = data?.contacts?.pagination || {
    page: 1,
    pageSize: 20,
    totalPages: 1,
    totalItems: initialContacts.length
  };

  useEffect(() => {
    setContacts(initialContacts);
  }, [data]);

  // Handle action responses
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        // Success is already handled by individual handlers
        // This can be used for additional handling if needed
      } else if (actionData.error) {
        setAlert({ type: 'error', message: actionData.message || actionData.error || 'An error occurred' });
      }
    }
  }, [actionData]);

  const handleCreateContact = async () => {
    // Use server-side action instead of client API
    const submitData = new FormData();
    submitData.append("_action", "createContact");
    submitData.append("phoneE164", formData.phone);
    if (formData.firstName) submitData.append("firstName", formData.firstName);
    if (formData.lastName) submitData.append("lastName", formData.lastName);
    if (formData.email) submitData.append("email", formData.email);
    if (formData.gender) submitData.append("gender", formData.gender);
    if (formData.birthDate) submitData.append("birthDate", formData.birthDate);
    if (typeof formData.smsConsent !== 'undefined' && formData.smsConsent !== null) {
      const consent = formData.smsConsent === true || formData.smsConsent === 'opted_in' ? 'opted_in' : (formData.smsConsent === 'opted_out' ? 'opted_out' : 'unknown');
      submitData.append("smsConsent", consent);
    }
    if (Array.isArray(formData.tags)) {
      submitData.append("tags", JSON.stringify(formData.tags));
    }
    
    submit(submitData, { method: "post" });
    setAlert({ type: 'success', message: 'Contact created successfully!' });
    closeModal();
  };

  const handleUpdateContact = async () => {
    // Use server-side action instead of client API
    const submitData = new FormData();
    submitData.append("_action", "updateContact");
    submitData.append("id", editingContact.id);
    if (formData.firstName) submitData.append("firstName", formData.firstName);
    if (formData.lastName) submitData.append("lastName", formData.lastName);
    if (formData.phone) submitData.append("phoneE164", formData.phone);
    if (formData.email) submitData.append("email", formData.email);
    if (formData.gender) submitData.append("gender", formData.gender);
    if (formData.birthDate) submitData.append("birthDate", formData.birthDate);
    if (formData.smsConsent) submitData.append("smsConsent", formData.smsConsent);
    if (Array.isArray(formData.tags)) {
      submitData.append("tags", JSON.stringify(formData.tags));
    }
    
    submit(submitData, { method: "post" });
    setAlert({ type: 'success', message: 'Contact updated successfully!' });
    closeModal();
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    // Use server-side action instead of client API
    const submitData = new FormData();
    submitData.append("_action", "deleteContact");
    submitData.append("id", contactId);
    
    submit(submitData, { method: "post" });
    setAlert({ type: 'success', message: 'Contact deleted successfully!' });
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) return;

    // Delete contacts one by one using server-side actions
    // Note: Backend may need a bulk delete endpoint for better performance
    selectedContacts.forEach((contactId) => {
      const submitData = new FormData();
      submitData.append("_action", "deleteContact");
      submitData.append("id", contactId);
      submit(submitData, { method: "post" });
    });
    
    setAlert({ type: 'success', message: `${selectedContacts.length} contacts deleted successfully!` });
    setSelectedContacts([]);
  };

  const handleImportContacts = async (csvData) => {
    // Use server-side action for import
    const submitData = new FormData();
    submitData.append("_action", "importContacts");
    submitData.append("contacts", JSON.stringify(csvData));
    
    submit(submitData, { method: "post" });
    setAlert({ type: 'success', message: `${csvData.length} contacts imported successfully!` });
    setIsImportModalOpen(false);
  };

  const handleExportContacts = async () => {
    setLoading(true);
    try {
      // Export contacts from current loaded data (client-side CSV generation)
      // Backend doesn't have /contacts/export endpoint, so we generate CSV client-side
      const csvHeaders = ['First Name', 'Last Name', 'Phone', 'Email', 'Gender', 'Birth Date', 'SMS Consent', 'Tags'];
      const csvRows = contacts.map(contact => [
        contact.firstName || '',
        contact.lastName || '',
        contact.phoneE164 || contact.phone || '',
        contact.email || '',
        contact.gender || '',
        contact.birthDate ? new Date(contact.birthDate).toLocaleDateString() : '',
        contact.smsConsent || 'unknown',
        Array.isArray(contact.tags) ? contact.tags.join('; ') : ''
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setAlert({ type: 'success', message: 'Contacts exported successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to export contacts: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    const headers = ['firstName', 'lastName', 'phoneE164', 'email', 'gender', 'birthDate', 'smsConsent'];
    const csvContent = [
      headers.join(','),
      ...data.map(contact =>
        headers.map(header => contact[header] || '').join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  const openCreateModal = () => {
    setEditingContact(null);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: '',
      birthDate: '',
      smsConsent: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      phone: contact.phone || '',
      email: contact.email || '',
      gender: contact.gender || '',
      birthDate: contact.birthDate ? contact.birthDate.split('T')[0] : '',
      smsConsent: contact.smsConsent !== false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'subscribed':
        return 'success';
      case 'unsubscribed':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Client-side filtering
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = filters.q.toLowerCase();
    const matchesSearch = !filters.q ||
      contact.firstName?.toLowerCase().includes(searchLower) ||
      contact.lastName?.toLowerCase().includes(searchLower) ||
      contact.phone?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower);

    const matchesFilter =
      filters.filter === 'all' ||
      (filters.filter === 'male' && contact.gender === 'male') ||
      (filters.filter === 'female' && contact.gender === 'female') ||
      (filters.filter === 'consented' && contact.smsConsent) ||
      (filters.filter === 'nonconsented' && !contact.smsConsent);

    return matchesSearch && matchesFilter;
  });

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
        title="Contacts"
        subtitle="Manage your SMS subscriber list"
        actions={
          <ActionGroup>
            {selectedContacts.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {selectedContacts.length} selected
                </Badge>
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  {/* CHANGED: Replaced emoji with Icon */}
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="trash" size="sm" className="mr-2" />} Delete Selected
                </ActionButton>
              </div>
            )}
            <ActionButton
              variant="outline"
              onClick={handleExportContacts}
              disabled={loading}
            >
              {/* CHANGED: Added Icon */}
              {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="download" size="sm" className="mr-2" />} Export
            </ActionButton>
            <ActionButton
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
            >
              {/* CHANGED: Added Icon */}
              <Icon name="upload" size="sm" className="mr-2" /> Import
            </ActionButton>
            <ActionButton variant="primary" onClick={openCreateModal}>
              {/* CHANGED: Replaced + with Icon */}
              <Icon name="plus" size="sm" className="mr-2" /> Add Contact
            </ActionButton>
          </ActionGroup>
        }
      >
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Contacts</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Page Content */}
      <PageContent>
        {/* CHANGED: Removed the redundant hero <section> and <h1>. */}

        {/* Stats Overview */}
        {/* CHANGED: Wrapped in PageSection */}
        <PageSection>
          {stats.total !== undefined && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Contacts</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="users" size="lg" className="text-primary" />
                  </div>
                </div>
              </Card>
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Subscribed</p>
                    <p className="text-3xl font-bold text-primary">{stats.subscribed?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon name="success" size="lg" className="text-green-600" />
                  </div>
                </div>
              </Card>
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Unsubscribed</p>
                    <p className="text-3xl font-bold text-red-600">{stats.unsubscribed?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Icon name="error" size="lg" className="text-red-600" />
                  </div>
                </div>
              </Card>
              <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Growth</p>
                    <p className="text-3xl font-bold text-secondary">{stats.growth || "+0%"}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Icon name="chart" size="lg" className="text-secondary" />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </PageSection>

        {/* Advanced Filters Section - Sand Background */}
        {/* CHANGED: Replaced <section> with <PageSection> */}
        <PageSection className="py-16">
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Contact Management</h2>
              <p className="text-base text-deep/90 leading-relaxed max-w-2xl mx-auto">
                Filter, search, and manage your contact list with advanced segmentation tools.
              </p>
            </div>

            <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Filters & Search</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({
                      page: 1,
                      pageSize: 20,
                      filter: 'all',
                      q: '',
                      sortBy: 'createdAt',
                      sortOrder: 'desc',
                      gender: '',
                      smsConsent: '',
                      hasBirthDate: ''
                    })}
                    className="rounded-lg"
                  >
                    {/* CHANGED: Added Icon */}
                    <Icon name="close" size="sm" className="mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
              <div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                  <Label htmlFor="searchFilter">Search Contacts</Label>
                  <Input
                    id="SearchFilter"
                    label="Search Contacts"
                    value={filters.q}
                    onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                    placeholder="Search by name, phone, or email..."
                  />
                  </div>
                  <Select
                    label="Gender"
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    options={[
                      { value: '', label: 'All Genders' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />

                  <Select
                    label="SMS Consent"
                    value={filters.smsConsent}
                    onChange={(e) => setFilters({ ...filters, smsConsent: e.target.value })}
                    options={[
                      { value: '', label: 'All Consent Status' },
                      { value: 'opted_in', label: 'Opted In' },
                      { value: 'opted_out', label: 'Opted Out' },
                      { value: 'unknown', label: 'Unknown' },
                    ]}
                  />

                  <Select
                    label="Birthday"
                    value={filters.hasBirthDate}
                    onChange={(e) => setFilters({ ...filters, hasBirthDate: e.target.value })}
                    options={[
                      { value: '', label: 'All Contacts' },
                      { value: 'true', label: 'Has Birthday' },
                      { value: 'false', label: 'No Birthday' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Select
                    label="Sort by"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    options={[
                      { value: 'createdAt', label: 'Date Added' },
                      { value: 'firstName', label: 'First Name' },
                      { value: 'lastName', label: 'Last Name' },
                      { value: 'email', label: 'Email' },
                      { value: 'phoneE164', label: 'Phone' },
                    ]}
                  />

                  <Select
                    label="Sort Order"
                    value={filters.sortOrder}
                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                    options={[
                      { value: 'desc', label: 'Descending' },
                      { value: 'asc', label: 'Ascending' },
                    ]}
                  />
                </div>
              </div>
            </Card>
          </div>
        </PageSection>

        {/* Contacts Table */}
        {/* CHANGED: Replaced <section> with <PageSection> */}
        <PageSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Contact List</h2>
            <p className="text-base text-deep/90 leading-relaxed max-w-2xl mx-auto">
              View and manage all your contacts with detailed information and subscription status.
            </p>
          </div>

          {filteredContacts.length > 0 ? (
            <>
              <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* CHANGED: Added responsive wrapper for table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          SMS Consent
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedContacts.includes(contact.id)}
                              onChange={() => handleSelectContact(contact.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </div>
                            {contact.birthDate && (
                              <div className="text-xs text-gray-500">
                                <Icon name="calendar" size="xs" className="inline mr-1" /> {new Date(contact.birthDate).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {contact.phoneE164 || contact.phone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {contact.email || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                            {contact.gender ? (
                              <Badge variant="info" size="sm">
                                {contact.gender}
                              </Badge>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={contact.smsConsent === 'opted_in' ? 'success' : contact.smsConsent === 'opted_out' ? 'danger' : 'warning'} size="sm">
                              {contact.smsConsent === 'opted_in' ? 'Opted In' : contact.smsConsent === 'opted_out' ? 'Opted Out' : 'Unknown'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(contact)}
                                className="rounded-lg"
                              >
                                {/* CHANGED: Replaced emoji with Icon */}
                                <Icon name="edit" size="sm" className="mr-2" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50 rounded-lg"
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                {/* CHANGED: Replaced emoji with Icon */}
                                <Icon name="trash" size="sm" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.pageSize}
                  totalItems={pagination.totalItems}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              )}
            </>
          ) : (
            <Card className="bg-white rounded-xl p-12 shadow-sm text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="users" size="2xl" className="text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">
                  {filters.q || filters.filter !== 'all' ? "No contacts found" : "No contacts yet"}
                </h3>
                <p className="text-base text-gray-600 mb-6">
                  {filters.q || filters.filter !== 'all'
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first contact"}
                </p>
                {!(filters.q || filters.filter !== 'all') && (
                  <Button variant="primary" onClick={openCreateModal} className="rounded-xl">
                    {/* CHANGED: Replaced + with Icon */}
                    <Icon name="plus" size="sm" className="mr-2" /> Add Contact
                  </Button>
                )}
              </div>
            </Card>
          )}
        </PageSection>
      </PageContent>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={editingContact ? handleUpdateContact : handleCreateContact}
              disabled={!formData.firstName || !formData.phone}
            >
              {/* CHANGED: Added conditional Icons */}
              {editingContact ? (
                <Icon name="edit" size="sm" className="mr-2" />
              ) : (
                <Icon name="plus" size="sm" className="mr-2" />
              )}
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Phone Number * (E.164 format)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+306977123456"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Input
              label="Birth Date"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="smsConsent"
              checked={formData.smsConsent}
              onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="smsConsent" className="text-sm font-medium text-gray-700">
              SMS Marketing Consent
            </label>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Contacts"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Handle CSV file upload
                const fileInput = document.getElementById('csvFile');
                if (fileInput.files[0]) {
                  const file = fileInput.files[0];
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const csv = e.target.result;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',');
                    const contacts = lines.slice(1).map(line => {
                      const values = line.split(',');
                      const contact = {};
                      headers.forEach((header, index) => {
                        contact[header.trim()] = values[index]?.trim() || '';
                      });
                      return contact;
                    }).filter(contact => contact.firstName && contact.phoneE164);

                    handleImportContacts(contacts);
                  };
                  reader.readAsText(file);
                }
              }}
              disabled={loading}
            >
              {/* CHANGED: Added Icon */}
              {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="upload" size="sm" className="mr-2" />}
              Import Contacts
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            {/* CHANGED: Replaced emoji with Icon and added flex */}
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Icon name="document" size="sm" className="mr-2" />
              CSV Format Requirements
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Required columns: firstName, phoneE164</li>
              <li>• Optional columns: lastName, email, gender, birthDate, smsConsent</li>
              <li>• Phone numbers must be in E.164 format (+1234567890)</li>
              <li>• Gender values: male, female, other</li>
              <li>• SMS Consent values: opted_in, opted_out, unknown</li>
              <li>• Birth date format: YYYY-MM-DD</li>
            </ul>
          </div>

          <div>
            <Label htmlFor="csvFile">Select CSV File</Label>
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Sample CSV:</h4>
            <pre className="text-xs text-gray-600 bg-white p-2 rounded border">
              {`firstName,lastName,phoneE164,email,gender,birthDate,smsConsent
John,Doe,+1234567890,john@example.com,male,1990-01-01,opted_in
Jane,Smith,+1234567891,jane@example.com,female,1985-05-15,opted_in`}
            </pre>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}