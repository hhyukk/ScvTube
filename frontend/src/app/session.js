import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useCheckSession = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('http://localhost:4000/session', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.loggedIn) {
        router.push('/');
      }
    };

    checkSession();
  }, [router]);
};

export default useCheckSession;
