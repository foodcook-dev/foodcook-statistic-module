import { useLocation, useNavigate } from 'react-router-dom';

interface TabsProps {
  className?: string;
}

export function Tabs({ className = '' }: TabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: '통합매입사 대시보드', path: '/integrated' },
    { label: '위탁매입사 대시보드', path: '/consignment' },
    { label: '직매입사 대시보드', path: '/direct' },
  ];

  return (
    <div className={`flex items-center gap-6 border-b border-gray-300 bg-transparent ${className}`}>
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <span
            key={tab.path}
            className={`relative py-2 text-sm font-medium cursor-pointer transition-colors duration-200
              ${
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 border-b-2 border-transparent hover:text-primary'
              }
            `}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </span>
        );
      })}
    </div>
  );
}
