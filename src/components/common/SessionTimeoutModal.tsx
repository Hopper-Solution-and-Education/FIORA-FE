'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function SessionTimeoutModal() {
  const { data: session, status, update } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Show modal when session is about
  useEffect(() => {
    if (status === 'loading' || !session) return;

    const expiresAt = session.expiredTime * 1000;
    const now = Date.now();
    const timeLeft = expiresAt - now;

    if (timeLeft <= 40000 && timeLeft > 0) {
      setIsVisible(true);
    } else if (timeLeft > 40000) {
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, timeLeft - 40000);
      return () => clearTimeout(timeout);
    } else {
      // Logout when session is expired
      setLogoutTriggered(true);
    }
  }, [session, status]);

  // Handle countdown timer, logout when time's up
  useEffect(() => {
    if (isVisible) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setLogoutTriggered(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isVisible]);

  const handleLogout = async () => {
    await signOut();
  };

  // Handle logout when user click on logout button
  useEffect(() => {
    if (logoutTriggered) {
      handleLogout();
      setLogoutTriggered(false);
    }
  }, [logoutTriggered]);

  // Handle refresh session when user click on refresh button
  const handleRefresh = async () => {
    await update();
    setIsVisible(false);
    setCountdown(30);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  if (!isVisible) return null;

  return (
    <Dialog
      open={isVisible}
      onOpenChange={() => {
        setIsVisible(false);
        setLogoutTriggered(true);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Session Timeout Warning</DialogTitle>
          <DialogDescription>
            Your session will expire in {countdown} seconds. Do you want to extend it?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleRefresh}>
            Extend
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
