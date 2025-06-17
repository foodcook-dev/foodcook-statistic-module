// import { Navigate, Outlet } from 'react-router-dom';
// import { decryption } from '@/libs/hash';

// type RestrictRouteProps = {
//   allow: boolean;
//   redirect: string;
// };

// export default function RestrictRoute({ allow = false, redirect = '/' }: RestrictRouteProps) {
//   if (!allow) return <Navigate to={redirect} />;
//   return <Outlet />;
// }

// export const isSignIn = (() => {
//   try {
//     const encryptedData = localStorage.getItem('userData');
//     if (!encryptedData) return false;

//     const decryptedData = decryption(encryptedData);
//     if (!decryptedData) return false;

//     const parsedData = JSON.parse(decryptedData);
//     return parsedData?.accessToken !== undefined;
//   } catch (error) {
//     console.error('Error checking sign-in status:', error);
//     return false;
//   }
// })();

// TODO: 토큰 처리 로직 수정 필요
