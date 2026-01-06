import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  await firstValueFrom(authService.checkAuthStatus());
  const user = authService.isAdminUser();

  if (!user) {
    router.navigateByUrl('/', { replaceUrl: true });
    return false;
  }

  return true;
};
