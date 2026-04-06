import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserDetail, getSalesCompanyDetail, postTempPassword } from '@/libs/user-management-api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, KeyRound } from 'lucide-react';
import UserCard from '@/components/modules/user-management/detail/UserCard';
import SalesCompanyCard from '@/components/modules/user-management/detail/SalesCompanyCard';
import EmptyTab from '@/components/modules/user-management/detail/EmptyTab';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert';
import { PromptDialog } from '@/components/modules/user-management/dialog/PromptDialog';
import { TempPasswordDialog } from '@/components/modules/user-management/dialog/TempPasswordDialog';

export default function UserManagementDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const companyId = useLocation().state?.companyId;
  const setAlert = useAlert();
  const [promptOpen, setPromptOpen] = useState(false);
  const [tempPasswordData, setTempPasswordData] = useState<{
    user_id: string;
    plain_password: string;
    expires_at: string;
  } | null>(null);

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

  const { mutate: issuedTempPassword } = useMutation({
    mutationFn: (reason: string) => postTempPassword(Number(id), reason),
    onSuccess: (data) => setTempPasswordData(data),
    onError: (error: any) => {
      setAlert({ message: error.detail || '임시 비밀번호 발급에 실패했습니다.' });
    },
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
        {/* 액션 영역 추가되면 분리, 디자인 구상 필요 */}
        <div className="mt-3 flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={() => setPromptOpen(true)}>
            <KeyRound className="h-4 w-4" /> 관리자용 임시 비밀번호 발급
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Tabs defaultValue="sales-company" className="flex flex-1 flex-col overflow-hidden">
          <div className="bg-background z-10">
            <TabsList>
              <TabsTrigger value="sales-company">판매사업자</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="sales-company" className="flex-1 overflow-y-auto pt-4">
            {salesCompanyInfo ? (
              <SalesCompanyCard companyId={companyId} data={salesCompanyInfo} />
            ) : (
              <EmptyTab message="판매사업자 정보가 없습니다.">
                <Button onClick={() => navigate(`/user-management/${id}/sales-company/create`)}>
                  추가하기
                </Button>
              </EmptyTab>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 발급 사유 입력을 위한 PromptDialog */}
      <PromptDialog
        open={promptOpen}
        onConfirm={(reason) => {
          setPromptOpen(false);
          issuedTempPassword(reason);
        }}
        onCancel={() => setPromptOpen(false)}
      />

      {/* 발급된 임시 비밀번호를 보여주는 TempPasswordDialog */}
      <TempPasswordDialog
        open={!!tempPasswordData}
        data={tempPasswordData}
        onClose={() => setTempPasswordData(null)}
      />
    </div>
  );
}
