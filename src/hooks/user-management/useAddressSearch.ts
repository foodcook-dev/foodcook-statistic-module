import { useCallback } from 'react';

export function useAddressSearch(
  onComplete: (data: { address: string; zip_code: string }) => void,
) {
  const openAddressSearch = useCallback(() => {
    new window.kakao.Postcode({
      oncomplete: (data) => {
        const address = data.roadAddress || data.jibunAddress;

        let extra = '';
        if (data.userSelectedType === 'R') {
          if (data.bname && /[동로가]$/.test(data.bname)) extra += data.bname;
          if (data.buildingName && data.apartment === 'Y') {
            extra += (extra ? ', ' : '') + data.buildingName;
          }
          if (extra) extra = ` (${extra})`;
        }

        onComplete({
          address: address + extra,
          zip_code: data.zonecode,
        });
      },
    }).open();
  }, [onComplete]);

  return { openAddressSearch };
}
