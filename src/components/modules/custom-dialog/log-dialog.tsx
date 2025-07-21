import { useState } from 'react';
import { Logs } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import { AgGridReact } from 'ag-grid-react';

interface LogDialogProps {
  endpoint: string;
  companyId: string;
  detailId: string;
}

export default function LogDialog({ endpoint, companyId, detailId }: LogDialogProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['log', endpoint, companyId, detailId],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint,
        params: { company_id: companyId, detail_id: detailId },
      }),
    enabled: open,
  });

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const renderAgGrid = () => {
    if (!data) return null;
    const rows = Array.isArray(data) ? data : data.items || [];
    if (!rows.length)
      return <div className="h-full content-center text-contrast text-center py-8">No logs.</div>;

    const columnDefs = [
      {
        headerName: '변경일자',
        field: 'status_changed_at',
        flex: 0.3,
      },
      {
        headerName: '내용',
        field: 'description',
        flex: 1,
      },
    ];

    const gridOptions = {
      defaultColDef: { headerClass: 'centered', sortable: false, floatingFilter: false },
      columnDefs: columnDefs,
    };

    return (
      <div className="text-xs h-full w-full">
        <AgGridReact rowData={rows} gridOptions={gridOptions} suppressDragLeaveHidesColumns />
      </div>
    );
  };

  return (
    <>
      <Button
        className="w-[32px] h-[30px] bg-gray-200 hover:bg-gray-300"
        onClick={handleDialogOpen}
      >
        <Logs size={16} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[1000px] text-contrast">
          <DialogHeader>
            <DialogTitle>[{detailId}] Logs</DialogTitle>
          </DialogHeader>
          <div className="py-4 min-h-[400px]">
            {isLoading && <div className="text-center">Loading</div>}
            {isError && <div className="text-center">Failed to load data.</div>}
            {!isLoading && !isError && renderAgGrid()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
