import { groupIntoPairs } from '@/libs/utils';

interface InfoItem {
  label: string;
  value: string;
}

interface InfoTableProps {
  data: InfoItem[];
  info: Record<string, any> | null | undefined;
  groupSize?: number;
}

export default function InfoTable({ data, info, groupSize = 3 }: InfoTableProps) {
  return (
    <div className="flex flex-col border-t border-gray-300 text-sm text-gray-900">
      {groupIntoPairs(data, groupSize).map((rowPair, index) => (
        <div key={index} className="flex items-center border-b border-gray-300 bg-white p-3">
          {rowPair.map((item, itemIndex) => {
            const isLastRow = index === groupIntoPairs(data, groupSize).length - 1;
            const isTwoItemsInLastRow = isLastRow && rowPair.length === 2;

            let widthClass = 'w-1/3';
            if (rowPair.length === 1) widthClass = 'w-full';
            else if (isTwoItemsInLastRow) widthClass = itemIndex === 0 ? 'w-1/3' : 'w-2/3';

            return (
              <div key={itemIndex} className={`flex ${widthClass}`}>
                <div className="flex items-center font-semibold w-[135px]">{item.label}</div>
                <div className="flex items-center flex-1">{info?.[item.value] || '-'}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
