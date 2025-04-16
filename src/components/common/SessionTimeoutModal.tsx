'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useIdle } from '@/shared/hooks/useIdle';

export function SessionTimeoutModal() {
  const { data: session, status, update } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const isIdle = useIdle(30); // Detects inactivity after 30 seconds (adjustable)

  // Automatically refresh session when user is active
  useEffect(() => {
    if (status === 'authenticated' && !isIdle && session) {
      // Calculate time left until session expiration
      const expiresAt = Math.floor(new Date(session.expires).getTime() / 1000);
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = expiresAt - now;

      const refreshSession = async () => {
        await update();
      };

      // *5 minutes before expiration, refresh the session
      if (timeLeft <= 300 && timeLeft > 0) {
        refreshSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIdle]);

  // Monitor session expiration and show modal only if user is idle
  useEffect(() => {
    if (status === 'loading' || !session) return;

    const expiresAt = Math.floor(new Date(session.expires).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = expiresAt - now;

    if (timeLeft <= 30 && timeLeft > 0 && isIdle) {
      setIsVisible(true);
      setRemainingTime(timeLeft);
    } else {
      setIsVisible(false);
    }

    // Immediate logout if session is already expired
    if (timeLeft <= 0) {
      setLogoutTriggered(true);
    }
  }, [session, status, isIdle]);

  // Update countdown in real-time when modal is visible
  useEffect(() => {
    if (isVisible && session) {
      const expiresAt = Math.floor(new Date(session.expires).getTime() / 1000);
      const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = Math.max(0, expiresAt - now);
        setRemainingTime(remaining);
        if (remaining <= 0) {
          setLogoutTriggered(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible, session]);

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (logoutTriggered) {
      handleLogout();
      setLogoutTriggered(false);
    }
  }, [logoutTriggered]);

  const handleRefresh = async () => {
    await update();
    setIsVisible(false);
    setRemainingTime(0);
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
            Your session will expire in {remainingTime} seconds. Do you want to extend it?
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
