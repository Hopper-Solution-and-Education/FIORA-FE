import { decorate, inject, injectable } from 'inversify';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IMembershipCronjobDashboardApi } from '../api';
import { IMembershipCronjobRepository } from './IMembershipCronjobRepository';

export class MembershipCronjobRepository implements IMembershipCronjobRepository {
  private api: IMembershipCronjobDashboardApi;

  constructor(api: IMembershipCronjobDashboardApi) {
    this.api = api;
  }
}

decorate(injectable(), MembershipCronjobRepository);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobDashboardApi),
  MembershipCronjobRepository,
  0,
);
