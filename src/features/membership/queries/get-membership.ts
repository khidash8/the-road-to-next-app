import { prisma } from '@/lib/prisma';

export const getMembership = async ({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) => {
  return await prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
};
