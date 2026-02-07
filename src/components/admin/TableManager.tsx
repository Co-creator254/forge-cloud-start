import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

export const TableManager: React.FC = () => {
  const { tableName } = useParams<{ tableName: string }>();
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (tableName) {
      loadTableData();
      loadTableSchema();
    }
  }, [tableName, currentPage, searchTerm]);

  const loadTableSchema = async () => {
    try {
      // Get table schema from information_schema
      const { data: schemaData, error } = await supabase
        .rpc('get_table_columns', { table_name: tableName });

      if (error) {
        // Fallback: Try to infer from first row
        const { data: sampleData } = await supabase
          .from(tableName!)
          .select('*')
          .limit(1)
          .single();

        if (sampleData) {
          const inferredColumns: ColumnInfo[] = Object.keys(sampleData).map(key => ({
            column_name: key,
            data_type: typeof sampleData[key],
            is_nullable: 'YES'
          }));
          setColumns(inferredColumns);
        }
      } else {
        setColumns(schemaData || []);
      }
    } catch (error) {
      console.error('Error loading schema:', error);
    }
  };

  const loadTableData = async () => {
    if (!tableName) return;

    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      // Add search if present
      if (searchTerm && columns.length > 0) {
        const searchableColumn = columns.find(c =>
          ['text', 'character varying', 'varchar'].includes(c.data_type.toLowerCase())
        );

        if (searchableColumn) {
          query = query.ilike(searchableColumn.column_name, `%${searchTerm}%`);
        }
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      // Order by created_at if exists, otherwise by first column
      const hasCreatedAt = columns.some(c => c.column_name === 'created_at');
      if (hasCreatedAt) {
        query = query.order('created_at', { ascending: false });
      }

      const { data: tableData, error, count } = await query;

      if (error) throw error;

      setData(tableData || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error('Error loading table data:', error);
      toast({
        title: 'Error Loading Data',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from(tableName!)
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Record Created',
        description: 'Successfully created new record'
      });

      setShowCreateDialog(false);
      loadTableData();
    } catch (error: any) {
      toast({
        title: 'Error Creating Record',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleUpdate = async (id: string, formData: any) => {
    try {
      const { error } = await supabase
        .from(tableName!)
        .update(formData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Record Updated',
        description: 'Successfully updated record'
      });

      setShowEditDialog(false);
      setEditingRow(null);
      loadTableData();
    } catch (error: any) {
      toast({
        title: 'Error Updating Record',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const { error } = await supabase
        .from(tableName!)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Record Deleted',
        description: 'Successfully deleted record'
      });

      loadTableData();
    } catch (error: any) {
      toast({
        title: 'Error Deleting Record',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(c => c.column_name).join(',');
    const rows = data.map(row =>
      columns.map(c => JSON.stringify(row[c.column_name] || '')).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableName}_${new Date().toISOString()}.csv`;
    link.click();
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl capitalize">{tableName?.replace(/_/g, ' ')}</CardTitle>
              <CardDescription>
                Managing {totalCount} records
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => loadTableData()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.slice(0, 8).map((col) => (
                    <TableHead key={col.column_name} className="font-semibold">
                      {col.column_name}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={row.id || idx}>
                    {columns.slice(0, 8).map((col) => (
                      <TableCell key={col.column_name}>
                        {renderCellValue(row[col.column_name], col.data_type)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRow(row);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Dialogs would go here */}
    </div>
  );
};

// Helper function to render cell values
const renderCellValue = (value: any, dataType: string): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic">null</span>;
  }

  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'true' : 'false'}
      </Badge>
    );
  }

  if (dataType.includes('timestamp') || dataType.includes('date')) {
    return new Date(value).toLocaleString();
  }

  if (typeof value === 'object') {
    return <span className="text-xs text-muted-foreground">{JSON.stringify(value).slice(0, 50)}...</span>;
  }

  const strValue = String(value);
  return strValue.length > 50 ? `${strValue.slice(0, 50)}...` : strValue;
};
