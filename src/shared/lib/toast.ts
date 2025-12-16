import { toast as sonnerToast } from 'sonner';

/**
 * Custom toast wrapper with data-test attributes for Cypress E2E testing
 *
 * Usage in Cypress:
 * - cy.get('[data-test="TOAST"]') - Any toast
 * - cy.get('[data-test="TOAST-SUCCESS"]') - Success toast
 * - cy.get('[data-test="TOAST-ERROR"]') - Error toast
 * - cy.get('[data-test="TOAST-WARNING"]') - Warning toast
 * - cy.get('[data-test="TOAST-INFO"]') - Info toast
 */

export const toast = {
  success: (message: string, options?: any) => {
    return sonnerToast.success(message, {
      ...options,
      className: `${options?.className || ''} [data-test="TOAST-SUCCESS"]`,
      unstyled: false,
    });
  },

  error: (message: string, options?: any) => {
    return sonnerToast.error(message, {
      ...options,
      className: `${options?.className || ''} [data-test="TOAST-ERROR"]`,
      unstyled: false,
    });
  },

  warning: (message: string, options?: any) => {
    return sonnerToast.warning(message, {
      ...options,
      className: `${options?.className || ''} [data-test="TOAST-WARNING"]`,
      unstyled: false,
    });
  },

  info: (message: string, options?: any) => {
    return sonnerToast.info(message, {
      ...options,
      className: `${options?.className || ''} [data-test="TOAST-INFO"]`,
      unstyled: false,
    });
  },

  loading: (message: string, options?: any) => {
    return sonnerToast.loading(message, {
      ...options,
      className: `${options?.className || ''} [data-test="TOAST-LOADING"]`,
      unstyled: false,
    });
  },

  // Default toast
  message: (message: string, options?: any) => {
    return sonnerToast(message, {
      ...options,
      className: `${options?.className || ''} [data-test="TOAST"]`,
      unstyled: false,
    });
  },

  // Promise wrapper
  promise: sonnerToast.promise,

  // Dismiss
  dismiss: sonnerToast.dismiss,
};
