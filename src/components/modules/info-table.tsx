import { groupIntoPairs } from '@/utils/table';

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
    <div className="border-border flex flex-col border-t text-sm text-gray-900">
      {groupIntoPairs(data, groupSize).map((rowPair, index) => (
        <div
          key={index}
          className="border-border bg-background text-contrast flex items-center border-b p-3"
        >
          {rowPair.map((item, itemIndex) => {
            const isLastRow = index === groupIntoPairs(data, groupSize).length - 1;
            const isTwoItemsInLastRow = isLastRow && rowPair.length === 2;

            let widthClass = 'w-1/3';
            if (rowPair.length === 1) widthClass = 'w-full';
            else if (isTwoItemsInLastRow) widthClass = itemIndex === 0 ? 'w-1/3' : 'w-2/3';

            return (
              <div key={itemIndex} className={`flex ${widthClass}`}>
                <div className="flex w-[135px] items-center font-semibold">{item.label}</div>
                <div className="flex flex-1 items-center">{info?.[item.value] || '-'}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
