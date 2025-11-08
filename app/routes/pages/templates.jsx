import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { Input, Label } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs"; // Not strictly needed unless UI components depend on it
import { PageLayout, PageHeader, PageContent, PageSection } from "../../components/ui/PageLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "../../components/ui/Breadcrumb";
import { ActionButton, ActionGroup } from "../../components/ui/ActionButton";
import { Icon } from "../../components/ui/Icon";
import { api } from "../../utils/api.client"; // Assuming API client exists

export default function TemplatesPage() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [alert, setAlert] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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

  // Adapt to backend response structure - provide defaults
  const templates = data?.templates?.data || data?.templates?.items || [];
  const categories = data?.categories?.data || data?.categories || []; // Example structure: [{ id: 'promotional', name: 'Promotional' }, ...]

  // Handle fetcher responses for alerts
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const responseData = fetcher.data?.data || fetcher.data;
      const { success, message, error } = responseData;
      
      if (success !== false) {
        setAlert({ type: 'success', message: message || 'Action completed successfully!' });
      } else {
        setAlert({ type: 'error', message: error || message || 'An error occurred.' });
      }
    }
  }, [fetcher.state, fetcher.data]);

  // Open Preview Modal and track usage
  const openPreviewModal = async (template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
    try {
      // Track template usage via server-side action
      const submitData = new FormData();
      submitData.append("_action", "trackTemplateUsage");
      submitData.append("id", template.id);
      fetcher.submit(submitData, { method: "post" });
    } catch (error) {
      // eslint-disable-next-line no-undef
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to track template view:', error);
      }
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  // Copy template content to clipboard
  const handleUseTemplate = () => {
    const contentToCopy = selectedTemplate?.content || selectedTemplate?.message;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy)
        .then(() => {
          setAlert({ type: 'success', message: 'Template copied to clipboard!' });
          closePreviewModal();
        })
        .catch(() => {
          setAlert({ type: 'error', message: 'Failed to copy template.' });
        });
    } else {
       setAlert({ type: 'warning', message: 'No content to copy for this template.' });
    }
  };

  // Note: Backend doesn't support creating custom templates
  // Templates are pre-defined system templates
  const handleCreateTemplate = async () => {
    setAlert({ 
      type: 'info', 
      message: 'Templates are pre-defined. You can use existing templates and customize them in campaigns.' 
    });
    setIsCreateModalOpen(false);
    setFormData({ name: '', description: '', content: '', category: '', tags: [], variables: [] });
  };

  // Prepare edit modal
  const handleEditTemplate = (template) => {
    setFormData({
      name: template.name || '',
      description: template.description || '',
      content: template.content || template.message || '',
      category: template.category || '',
      tags: Array.isArray(template.tags) ? template.tags : [],
      variables: Array.isArray(template.variables) ? template.variables : []
    });
    setSelectedTemplate(template); // Keep track of the ID
    setIsEditModalOpen(true);
  };

  // Submit template update
  const handleUpdateTemplate = async () => {
    if (!selectedTemplate?.id) return; // Need an ID to update
    fetcher.submit(
      {
        _action: "updateTemplate",
        id: selectedTemplate.id,
        ...formData,
        tags: JSON.stringify(formData.tags || []),
        variables: JSON.stringify(formData.variables || [])
      },
      { method: "post" }
    );
    // Optimistic close
    setIsEditModalOpen(false);
    setSelectedTemplate(null);
  };

  // Submit template deletion
  const handleDeleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template? This cannot be undone.')) {
      fetcher.submit(
        { _action: "deleteTemplate", id: templateId },
        { method: "post" }
      );
    }
  };

  // Prepare create modal with duplicated data
  const handleDuplicateTemplate = (template) => {
    setFormData({
      name: `${template.name || 'Template'} (Copy)`, // Ensure name exists
      description: template.description || '',
      content: template.content || template.message || '',
      category: template.category || '',
      tags: template.tags || [],
      variables: template.variables || []
    });
    setIsCreateModalOpen(true);
  };

   // Export templates logic
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

    if (csvData.length === 0) {
        setAlert({ type: 'info', message: 'No templates to export.' });
        return;
    }
    const csv = convertToCSV(csvData);
    downloadCSV(csv, 'templates.csv');
    setAlert({ type: 'success', message: 'Templates exported successfully!' });
  };

  // --- Helper Functions ---
  const convertToCSV = (data) => {
     if (!data || data.length === 0) return '';
     const headers = Object.keys(data[0] || {});
     const csvContent = [
       headers.join(','),
       ...data.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(','))
     ].join('\n');
     return csvContent;
   };

  const downloadCSV = (csv, filename) => {
     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = filename;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     window.URL.revokeObjectURL(url);
   };

   // Tag and Variable handlers (using trim and checking existence)
  const handleAddTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };
  const handleAddVariable = (variable) => {
    const trimmedVar = variable.trim().replace(/[{}]/g, ''); // Remove braces if accidentally added
    if (trimmedVar && !formData.variables.includes(trimmedVar)) {
      setFormData(prev => ({ ...prev, variables: [...prev.variables, trimmedVar] }));
    }
  };
  const handleRemoveVariable = (variableToRemove) => {
    setFormData(prev => ({ ...prev, variables: prev.variables.filter(v => v !== variableToRemove) }));
  };

  // --- Filtering and Sorting ---
  const filteredTemplates = templates.filter((template) => {
    const searchLower = filters.q.toLowerCase();
    const matchesSearch = !filters.q ||
      template.name?.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower) ||
      template.content?.toLowerCase().includes(searchLower) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchLower));

    const matchesCategory = filters.category === 'all' || template.category === filters.category;

    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
     const getSortValue = (obj, key) => {
         if (key === 'usageCount') return obj.usageCount || 0;
         if (key === 'createdAt') return obj.createdAt || ''; // Assuming createdAt exists
         return obj[key] || '';
     };
     const aValue = getSortValue(a, filters.sortBy);
     const bValue = getSortValue(b, filters.sortBy);
     if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
     }
     return filters.sortOrder === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
   });

  // Alert timeout effect
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      'promotional': 'primary', 'abandoned_cart': 'warning', 'holiday_offers': 'success',
      'customer_service': 'info', 'welcome': 'secondary', 'birthday': 'accent'
    };
    return colors[category] || 'default';
  };

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <PageLayout>
      {/* Alert */}
      {alert && (
        <div className="fixed top-20 right-4 z-50 max-w-md">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="SMS Templates"
        subtitle="Browse, manage, and create reusable message templates"
        actions={
          <ActionGroup>
            <ActionButton variant="outline" onClick={handleExportTemplates}>
              <Icon name="download" size="sm" className="mr-2" /> Export
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={() => {
                 setFormData({ name: '', description: '', content: '', category: '', tags: [], variables: [] });
                 setIsCreateModalOpen(true);
              }}
            >
              <Icon name="plus" size="sm" className="mr-2" /> Create Template
            </ActionButton>
          </ActionGroup>
        }
      >
        <Breadcrumb>
          <BreadcrumbItem href="/app">Sendly</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast>Templates</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>

      {/* Page Content */}
      <PageContent className="space-y-10">
        {/* Advanced Filters */}
        <PageSection>
          <Card className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Filter & Sort Templates</h3>
              <Button variant="outline" size="sm" onClick={() => setFilters({ category: 'all', q: '', sortBy: 'name', sortOrder: 'asc' })} className="rounded-lg self-end sm:self-center">
                 <Icon name="close" size="sm" className="mr-2" /> Clear Filters
              </Button>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Label htmlFor="searchFilter">Search Templates</Label>
                  <Input id="searchFilter" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="By name, content, tag..." />
                </div>
                <div>
                  <Label htmlFor="sortBy">Sort By</Label>
                  <Select id="sortBy" value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    options={[
                      { value: 'name', label: 'Name' }, { value: 'category', label: 'Category' },
                      { value: 'usageCount', label: 'Usage Count' }, { value: 'createdAt', label: 'Created Date' }
                    ]}
                  />
                </div>
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Select id="sortOrder" value={filters.sortOrder} onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                    options={[ { value: 'asc', label: 'Ascending' }, { value: 'desc', label: 'Descending' } ]}
                  />
                </div>
              </div>
            </div>
          </Card>
        </PageSection>

        {/* Category Filters */}
        <PageSection>
           <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Browse by Category</h2>
           <div className="relative">
              <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-1"> {/* Added padding */}
                 <button
                   onClick={() => setFilters({ ...filters, category: 'all' })}
                   className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap text-sm font-medium ${
                     filters.category === 'all' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                   }`}
                 >
                   <Icon name="template" size="sm" /> <span>All Templates</span>
                   <Badge variant={filters.category === 'all' ? 'inverted' : 'default'} size="sm">{templates.length}</Badge>
                 </button>
                 {categories.map((category) => {
                   const categoryId = category.id || category.value || category.name; // Use ID, value, or name as key
                   const categoryName = category.name || category.label || categoryId;
                   const count = templates.filter(t => t.category === categoryId).length;
                   const isActive = filters.category === categoryId;
                   return (
                     <button key={categoryId} onClick={() => setFilters({ ...filters, category: categoryId })}
                       className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap text-sm font-medium ${
                         isActive ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                       }`}
                     >
                       <span>{categoryName}</span>
                       <Badge variant={isActive ? 'inverted' : 'default'} size="sm">{count}</Badge>
                     </button>
                   );
                 })}
              </div>
           </div>
        </PageSection>

        {/* Templates Grid */}
        <PageSection>
          {sortedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedTemplates.map((template) => (
                <Card key={template.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between mb-4 gap-2"> {/* Added gap */}
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2"> {/* Allow wrapping */}
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {template.category && (
                         <Badge variant={getCategoryColor(template.category)} size="sm" className="capitalize">
                           {template.category.replace(/_/g, ' ')}
                         </Badge>
                      )}
                      {template.usageCount !== undefined && (
                        <Badge variant="info" size="sm" className="flex items-center gap-1">
                          <Icon name="chart" size="xs" /> {template.usageCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {template.description && (
                    <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 mb-5 flex-1 border border-gray-100 min-h-[60px]"> {/* Min height */}
                    <p className="text-sm text-gray-800 line-clamp-3">
                      {template.content || template.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-5">
                    <span>{template.content?.length || template.message?.length || 0} chars</span>
                    <span>{Math.ceil((template.content?.length || template.message?.length || 0) / 160)} SMS</span>
                  </div>

                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-5 min-h-[20px]"> {/* Min height for tags */}
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" size="xs">{tag}</Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" size="xs">+{template.tags.length - 3} more</Badge>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => openPreviewModal(template)}>
                      <Icon name="search" size="sm" className="mr-2" /> Preview
                    </Button>
                    <Button variant="primary" size="sm" className="w-full" onClick={() => handleUseTemplate(template)}> {/* Pass template */}
                      <Icon name="copy" size="sm" className="mr-2" /> Copy
                    </Button>
                    <div className="col-span-2 flex justify-end gap-1 mt-2"> {/* Tiny buttons for other actions */}
                         <Button variant="ghost" size="icon-sm" onClick={() => handleEditTemplate(template)} title="Edit"> <Icon name="edit" size="sm"/> </Button>
                         <Button variant="ghost" size="icon-sm" onClick={() => handleDuplicateTemplate(template)} title="Duplicate"> <Icon name="duplicate" size="sm"/> </Button>
                         <Button variant="ghost" size="icon-sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteTemplate(template.id)} title="Delete"> <Icon name="trash" size="sm"/> </Button>
                     </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="bg-white rounded-xl p-12 shadow-sm text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon name="template" size="2xl" className="text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mt-4 mb-3">
                  {filters.q || filters.category !== 'all' ? "No templates found" : "No templates available"}
                </h3>
                <p className="text-base text-gray-600 mb-8">
                  {filters.q || filters.category !== 'all' ? "Try adjusting your filters or search." : "Create your first template to reuse messages easily."}
                </p>
                {!filters.q && filters.category === 'all' && (
                  <Button variant="primary" onClick={() => setIsCreateModalOpen(true)} className="rounded-xl">
                    <Icon name="plus" size="sm" className="mr-2" /> Create Template
                  </Button>
                )}
              </div>
            </Card>
          )}
        </PageSection>

        {/* Information Banner */}
        <PageSection>
          <Card className="bg-blue-50 border-blue-200 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <Icon name="info" size="xl" className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Pro Tips for SMS Templates</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Keep messages concise (&lt;160 chars for 1 SMS credit).</li>
                  <li>• Use variables like `{`{firstName}`}` for personalization.</li>
                  <li>• Include a clear Call-To-Action (link, reply keyword).</li>
                  <li>• Use tags (e.g., 'sale', 'welcome') for easy filtering.</li>
                  <li>• Ensure compliance with opt-out requirements.</li>
                </ul>
              </div>
            </div>
          </Card>
        </PageSection>

      </PageContent>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={closePreviewModal} title="Template Preview" size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closePreviewModal}> Close </Button>
            <Button variant="primary" onClick={handleUseTemplate}>
              <Icon name="copy" size="sm" className="mr-2" /> Copy Template
            </Button>
          </>
        }
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedTemplate.name}</h3>
               {selectedTemplate.category && (
                   <Badge variant={getCategoryColor(selectedTemplate.category)} className="capitalize">
                      {selectedTemplate.category.replace(/_/g, ' ')}
                   </Badge>
               )}
            </div>
            {selectedTemplate.description && (<p className="text-sm text-gray-600">{selectedTemplate.description}</p>)}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Message Content</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedTemplate.content || selectedTemplate.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 mb-1 uppercase tracking-wider">Character Count</p>
                <p className="font-semibold text-blue-900">{selectedTemplate.content?.length || selectedTemplate.message?.length || 0} / 160</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 mb-1 uppercase tracking-wider">SMS Segments</p>
                <p className="font-semibold text-green-900">{Math.ceil((selectedTemplate.content?.length || selectedTemplate.message?.length || 0) / 160)}</p>
              </div>
            </div>
            {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs font-medium text-yellow-700 mb-2 uppercase tracking-wider">Available Variables</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-mono rounded">{`{${variable}}`}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag, index) => (<Badge key={index} variant="secondary" size="sm">{tag}</Badge>))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Template Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Template" size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}> Cancel </Button>
            <Button variant="primary" onClick={handleCreateTemplate} disabled={!formData.name || !formData.content || isSubmitting}>
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="plus" size="sm" className="mr-2" />} Create Template
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <Input label="Template Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Welcome Message" required />
          <Textarea label="Description (Optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." rows={2} />
          <Select label="Category (Optional)" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[ { value: '', label: 'Select Category...' }, ...(categories.map(cat => ({ value: cat.id || cat.value, label: cat.name || cat.label }))) ]}
          />
          <Textarea label="Template Content *" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Enter SMS content... Use {variable} for placeholders." rows={4} maxLength={160} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div> {/* Tags Input */}
              <Label className="mb-1">Tags (Optional)</Label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]"> {formData.tags.map((tag, index) => (<Badge key={index} variant="secondary" size="sm" className="flex items-center">{tag}<button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-gray-500 hover:text-red-500 focus:outline-none" aria-label={`Remove ${tag}`}><Icon name="close" size="xs"/></button></Badge>))}</div>
              <div className="flex gap-2"><Input placeholder="Add tag..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(e.target.value); e.target.value = ''; } }} id="create-tag-input"/><Button type="button" variant="outline" size="icon" onClick={() => { const input = document.getElementById('create-tag-input'); if (input && input.value) { handleAddTag(input.value); input.value = ''; } }} aria-label="Add tag"><Icon name="plus" size="sm" /></Button></div>
            </div>
            <div> {/* Variables Input */}
              <Label className="mb-1">Variables (Optional)</Label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]"> {formData.variables.map((variable, index) => (<Badge key={index} variant="info" size="sm" className="flex items-center font-mono">{`{${variable}}`}<button type="button" onClick={() => handleRemoveVariable(variable)} className="ml-1.5 text-blue-600 hover:text-red-500 focus:outline-none" aria-label={`Remove ${variable}`}><Icon name="close" size="xs"/></button></Badge>))}</div>
              <div className="flex gap-2"><Input placeholder="Add variable (e.g., firstName)..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVariable(e.target.value); e.target.value = ''; } }} id="create-variable-input"/><Button type="button" variant="outline" size="icon" onClick={() => { const input = document.getElementById('create-variable-input'); if (input && input.value) { handleAddVariable(input.value); input.value = ''; } }} aria-label="Add variable"><Icon name="plus" size="sm" /></Button></div>
              <p className="text-xs text-gray-500 mt-1">Variables will be replaced with data.</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Template Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedTemplate(null); }} title={`Edit Template: ${selectedTemplate?.name}`} size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedTemplate(null); }}> Cancel </Button>
            <Button variant="primary" onClick={handleUpdateTemplate} disabled={!formData.name || !formData.content || isSubmitting}>
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <Icon name="check" size="sm" className="mr-2" />} Update Template
            </Button>
          </>
        }
      >
        {/* Reuse form structure from Create Modal */}
        <div className="space-y-6">
          <Input label="Template Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Textarea label="Description (Optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
          <Select label="Category (Optional)" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={[ { value: '', label: 'Select Category...' }, ...(categories.map(cat => ({ value: cat.id || cat.value, label: cat.name || cat.label }))) ]} />
          <Textarea label="Template Content *" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} maxLength={160} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div> {/* Tags Input */}
              <Label className="mb-1">Tags (Optional)</Label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]"> {formData.tags.map((tag, index) => (<Badge key={index} variant="secondary" size="sm" className="flex items-center">{tag}<button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-gray-500 hover:text-red-500 focus:outline-none" aria-label={`Remove ${tag}`}><Icon name="close" size="xs"/></button></Badge>))}</div>
              <div className="flex gap-2"><Input placeholder="Add tag..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(e.target.value); e.target.value = ''; } }} id="edit-tag-input"/><Button type="button" variant="outline" size="icon" onClick={() => { const input = document.getElementById('edit-tag-input'); if (input && input.value) { handleAddTag(input.value); input.value = ''; } }} aria-label="Add tag"><Icon name="plus" size="sm" /></Button></div>
            </div>
            <div> {/* Variables Input */}
              <Label className="mb-1">Variables (Optional)</Label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]"> {formData.variables.map((variable, index) => (<Badge key={index} variant="info" size="sm" className="flex items-center font-mono">{`{${variable}}`}<button type="button" onClick={() => handleRemoveVariable(variable)} className="ml-1.5 text-blue-600 hover:text-red-500 focus:outline-none" aria-label={`Remove ${variable}`}><Icon name="close" size="xs"/></button></Badge>))}</div>
              <div className="flex gap-2"><Input placeholder="Add variable..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVariable(e.target.value); e.target.value = ''; } }} id="edit-variable-input"/><Button type="button" variant="outline" size="icon" onClick={() => { const input = document.getElementById('edit-variable-input'); if (input && input.value) { handleAddVariable(input.value); input.value = ''; } }} aria-label="Add variable"><Icon name="plus" size="sm" /></Button></div>
              <p className="text-xs text-gray-500 mt-1">Variables will be replaced with data.</p>
            </div>
          </div>
        </div>
      </Modal>

    </PageLayout>
  );
}