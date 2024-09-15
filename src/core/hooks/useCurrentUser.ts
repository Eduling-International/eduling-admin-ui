'use client';

import { AuthenticationService } from '@/api';
import { CurrentUserInfo } from '@/models';
import * as React from 'react';

const authService = new AuthenticationService();

const useCurrentUser = () => {
  const [userInfo, setUserInfo] = React.useState<CurrentUserInfo | null>(null);

  React.useEffect(() => {
    if (!userInfo) {
      (async () => {
        const res = await authService.getCurrentUser();
        if (res.data) {
          setUserInfo(res.data);
        }
      })();
    }
  }, [userInfo]);

  return { userInfo };
};

export default useCurrentUser;
