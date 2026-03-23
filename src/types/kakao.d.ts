interface KakaoPostcodeData {
  zonecode: string; // 우편번호 5자리
  address: string; // 기본 주소 (검색어 타입에 따라 도로명/지번)
  roadAddress: string; // 도로명 주소
  jibunAddress: string; // 지번 주소
  userSelectedType: 'R' | 'J'; // 사용자가 선택한 타입
  bname: string; // 법정동명
  buildingName: string; // 건물명
  apartment: 'Y' | 'N'; // 공동주택 여부
}

declare global {
  interface Window {
    kakao: {
      Postcode: new (options: {
        oncomplete: (data: KakaoPostcodeData) => void;
        onclose?: (state: 'FORCE_CLOSE' | 'COMPLETE_CLOSE') => void;
        width?: number | string;
        height?: number | string;
      }) => { open: () => void };
    };
  }
}

export {};
