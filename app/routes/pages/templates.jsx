import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { Input, Label } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { api } from "../../utils/api.client";

export default function TemplatesPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [alert, setAlert] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    q: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    category: '',
    tags: [],
    variables: []
  });

  // Adapt to backend response structure
  const templates = data?.templates?.data || data?.templates?.items || [];
  const categories = data?.categories?.data || data?.categories || [];

  const openPreviewModal = async (template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
    
    // Track template usage
    try {
      await api.templates.track(template.id);
    } catch (error) {
      console.error('Failed to track template:', error);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleUseTemplate = () => {
    // Copy template to clipboard
    if (selectedTemplate?.content || selectedTemplate?.message) {
      navigator.clipboard.writeText(selectedTemplate.content || selectedTemplate.message);
      setAlert({ type: 'success', message: 'Template copied to clipboard!' });
      closePreviewModal();
    }
  };

  const handleCreateTemplate = async () => {
    setLoading(true);
    try {
      fetcher.submit(
        {
          _action: "createTemplate",
          ...formData,
          tags: JSON.stringify(formData.tags),
          variables: JSON.stringify(formData.variables)
        },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Template created successfully!' });
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        content: '',
        category: '',
        tags: [],
        variables: []
      });
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to create template: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template) => {
    setFormData({
      name: template.name,
      description: template.description || '',
      content: template.content || template.message,
      category: template.category,
      tags: template.tags || [],
      variables: template.variables || []
    });
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  const handleUpdateTemplate = async () => {
    setLoading(true);
    try {
      fetcher.submit(
        {
          _action: "updateTemplate",
          id: selectedTemplate.id,
          ...formData,
          tags: JSON.stringify(formData.tags),
          variables: JSON.stringify(formData.variables)
        },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Template updated successfully!' });
      setIsEditModalOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      setAlert({ type: 'error', message: `Failed to update template: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      fetcher.submit(
        { _action: "deleteTemplate", id: templateId },
        { method: "post" }
      );
      setAlert({ type: 'success', message: 'Template deleted successfully!' });
    }
  };

  const handleDuplicateTemplate = (template) => {
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description || '',
      content: template.content || template.message,
      category: template.category,
      tags: template.tags || [],
      variables: template.variables || []
    });
    setIsCreateModalOpen(true);
  };

  const handleExportTemplates = () => {
    const csvData = templates.map(template => ({
      name: template.name,
      category: template.category,
      description: template.description || '',
      content: template.content || template.message,
      tags: template.tags ? template.tags.join(';') : '',
      variables: template.variables ? template.variables.join(';') : '',
      usageCount: template.usageCount || 0
    }));
    
    const csv = convertToCSV(csvData);
    downloadCSV(csv, 'templates.csv');
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

  const handleAddTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleAddVariable = (variable) => {
    if (variable && !formData.variables.includes(variable)) {
      setFormData({ ...formData, variables: [...formData.variables, variable] });
    }
  };

  const handleRemoveVariable = (variableToRemove) => {
    setFormData({ ...formData, variables: formData.variables.filter(variable => variable !== variableToRemove) });
  };

  // Client-side filtering and sorting
  const filteredTemplates = templates.filter((template) => {
    const searchLower = filters.q.toLowerCase();
    const matchesSearch = !filters.q || 
      template.name?.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower) ||
      template.content?.toLowerCase().includes(searchLower);

    const matchesCategory = 
      filters.category === 'all' ||
      template.category === filters.category;

    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const aValue = a[filters.sortBy] || '';
    const bValue = b[filters.sortBy] || '';
    return filters.sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const getCategoryColor = (category) => {
    const colors = {
      'promotional': 'primary',
      'abandoned_cart': 'warning',
      'holiday_offers': 'success',
      'customer_service': 'info',
      'welcome': 'secondary',
      'birthday': 'danger'
    };
    return colors[category] || 'default';
  };

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

      {/* Header */}
      <header className="glass-surface sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1">SMS Templates</h1>
              <p className="text-caption mt-1">Browse and use pre-made SMS message templates</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExportTemplates}
                className="rounded-xl"
              >
                📊 Export
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-xl"
              >
                ➕ Create Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Advanced Filters */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ category: 'all', q: '', sortBy: 'name', sortOrder: 'asc' })}
              className="rounded-lg"
            >
              Clear Filters
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="searchFilter">Search Templates</Label>
              <Input
                id="searchFilter"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                placeholder="Search by name, description, or content..."
              />
            </div>
            
            <div>
              <Label htmlFor="categoryFilter">Category</Label>
              <Select
                id="categoryFilter"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...categories.map(cat => ({
                    value: cat.id || cat.value,
                    label: cat.name || cat.label
                  }))
                ]}
              />
            </div>

            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                options={[
                  { value: 'name', label: 'Name' },
                  { value: 'category', label: 'Category' },
                  { value: 'usageCount', label: 'Usage Count' },
                  { value: 'createdAt', label: 'Created Date' }
                ]}
              />
            </div>

            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Select
                id="sortOrder"
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                options={[
                  { value: 'asc', label: 'Ascending' },
                  { value: 'desc', label: 'Descending' }
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Category Stats */}
        {categories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setFilters({ ...filters, category: 'all' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
                filters.category === 'all'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
            >
              <span>All Templates</span>
              <Badge variant="default" size="sm">{templates.length}</Badge>
            </button>
            {categories.map((category) => {
              const count = templates.filter(t => t.category === (category.id || category.value)).length;
              return (
                <button
                  key={category.id || category.value}
                  onClick={() => setFilters({ ...filters, category: category.id || category.value })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
                    filters.category === (category.id || category.value)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  <span>{category.name || category.label}</span>
                  <Badge variant="default" size="sm">{count}</Badge>
                </button>
              );
            })}
          </div>
        )}

        {/* Templates Grid */}
        {sortedTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-elevated transition-all duration-200 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={getCategoryColor(template.category)} size="sm">
                      {template.category}
                    </Badge>
                    {template.usageCount !== undefined && (
                      <Badge variant="info" size="sm">
                        {template.usageCount} uses
                      </Badge>
                    )}
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                )}

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-1">
                  <p className="text-sm text-gray-800 line-clamp-4">
                    {template.content || template.message}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>
                    {template.content?.length || template.message?.length || 0} characters
                  </span>
                  <span>
                    {Math.ceil((template.content?.length || template.message?.length || 0) / 160)} SMS
                  </span>
                </div>

                {/* Tags */}
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" size="sm">
                        +{template.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openPreviewModal(template)}
                    disabled={loading}
                  >
                    👁️ Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(template.content || template.message);
                      setAlert({ type: 'success', message: 'Template copied!' });
                    }}
                    disabled={loading}
                  >
                    📋 Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    disabled={loading}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                    disabled={loading}
                  >
                    📋 Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteTemplate(template.id)}
                    disabled={loading}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <span className="text-6xl">📝</span>
              <h3 className="text-h3 mt-4 mb-2">
                {filters.q || filters.category !== 'all' ? "No templates found" : "No templates available"}
              </h3>
              <p className="text-caption mb-6">
                {filters.q || filters.category !== 'all'
                  ? "Try adjusting your search or filters"
                  : "Create your first template to get started"}
              </p>
              {!filters.q && filters.category === 'all' && (
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="rounded-xl"
                >
                  ➕ Create Your First Template
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Information Banner */}
        <Card className="bg-blue-50 border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Pro Tips for SMS Templates</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep messages under 160 characters for single SMS</li>
                <li>• Personalize with customer names and details</li>
                <li>• Include clear call-to-action (CTA)</li>
                <li>• Add discount codes for promotional messages</li>
                <li>• Always comply with SMS marketing regulations</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
        title="Template Preview"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closePreviewModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUseTemplate}>
              📋 Copy Template
            </Button>
          </>
        }
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedTemplate.name}
              </h3>
              <Badge variant={getCategoryColor(selectedTemplate.category)}>
                {selectedTemplate.category}
              </Badge>
            </div>

            {selectedTemplate.description && (
              <p className="text-gray-600">
                {selectedTemplate.description}
              </p>
            )}

            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Message Content:</p>
              <p className="text-base text-gray-900 whitespace-pre-wrap">
                {selectedTemplate.content || selectedTemplate.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-gray-600 mb-1">Character Count</p>
                <p className="font-semibold text-gray-900">
                  {selectedTemplate.content?.length || selectedTemplate.message?.length || 0} / 160
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-gray-600 mb-1">SMS Segments</p>
                <p className="font-semibold text-gray-900">
                  {Math.ceil((selectedTemplate.content?.length || selectedTemplate.message?.length || 0) / 160)}
                </p>
              </div>
            </div>

            {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900 mb-2">
                  Available Variables:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-mono rounded"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag, index) => (
                    <Badge key={index} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Template Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Template"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTemplate}
              disabled={!formData.name || !formData.content || loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Template'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Welcome Message"
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this template..."
            rows={2}
          />
          
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'promotional', label: 'Promotional' },
              { value: 'abandoned_cart', label: 'Abandoned Cart' },
              { value: 'holiday_offers', label: 'Holiday Offers' },
              { value: 'customer_service', label: 'Customer Service' },
              { value: 'welcome', label: 'Welcome' },
              { value: 'birthday', label: 'Birthday' }
            ]}
          />
          
          <Textarea
            label="Template Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter your SMS template content..."
            rows={4}
            maxLength={160}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add tag..."]');
                    if (input.value) {
                      handleAddTag(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Variables</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.variables.map((variable, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {variable}
                    <button
                      onClick={() => handleRemoveVariable(variable)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add variable..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddVariable(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add variable..."]');
                    if (input.value) {
                      handleAddVariable(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTemplate(null);
        }}
        title={`Edit Template: ${selectedTemplate?.name}`}
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedTemplate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateTemplate}
              disabled={!formData.name || !formData.content || loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Update Template'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Welcome Message"
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this template..."
            rows={2}
          />
          
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'promotional', label: 'Promotional' },
              { value: 'abandoned_cart', label: 'Abandoned Cart' },
              { value: 'holiday_offers', label: 'Holiday Offers' },
              { value: 'customer_service', label: 'Customer Service' },
              { value: 'welcome', label: 'Welcome' },
              { value: 'birthday', label: 'Birthday' }
            ]}
          />
          
          <Textarea
            label="Template Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter your SMS template content..."
            rows={4}
            maxLength={160}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add tag..."]');
                    if (input.value) {
                      handleAddTag(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Variables</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.variables.map((variable, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {variable}
                    <button
                      onClick={() => handleRemoveVariable(variable)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add variable..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddVariable(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add variable..."]');
                    if (input.value) {
                      handleAddVariable(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

