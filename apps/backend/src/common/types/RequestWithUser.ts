// src/types/request-with-user.type.ts
import { User } from '@prisma/client';

export type RequestWithUser = Request & {
  user: User;
};
