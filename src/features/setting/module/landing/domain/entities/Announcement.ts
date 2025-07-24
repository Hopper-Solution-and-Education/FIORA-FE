interface IAnnouncement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
}

export type { IAnnouncement };

export type CreateAnnouncement = Omit<IAnnouncement, 'id'>;
