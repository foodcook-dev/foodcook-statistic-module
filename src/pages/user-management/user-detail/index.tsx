import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserDetail, getSalesCompanyDetail } from '@/libs/user-management-api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import UserCard from '@/components/modules/user-management/detail/UserCard';
import SalesCompanyCard from '@/components/modules/user-management/detail/SalesCompanyCard';
import EmptyTab from '@/components/modules/user-management/detail/EmptyTab';

export default function UserManagementDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const companyId = useLocation().state?.companyId;

  const { data: userInfo } = useQuery({
    queryKey: ['userDetail', id],
    queryFn: () => getUserDetail(Number(id)),
    enabled: !!id,
  });

  const { data: salesCompanyInfo } = useQuery({
    queryKey: ['salesCompanyDetail', companyId],
    queryFn: () => getSalesCompanyDetail(companyId),
    enabled: !!companyId,
  });

  if (!userInfo) return null;

  return (
    <div className="flex h-full w-full gap-6 overflow-hidden">
      <div className="sticky top-0 h-fit w-[330px] shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-contrast/60 hover:text-contrast mb-4 flex h-[41px] items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <UserCard userId={id!} data={userInfo} />
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto">
        <Tabs defaultValue="sales-company">
          <div className="bg-background sticky top-0 z-10">
            <TabsList>
              <TabsTrigger value="sales-company">판매사업자</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="sales-company" className="pt-4">
            {salesCompanyInfo ? (
              <SalesCompanyCard companyId={companyId} data={salesCompanyInfo} />
            ) : (
              <EmptyTab message="판매사업자 정보가 없습니다." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
