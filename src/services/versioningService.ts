import { CaregiverStatus } from '../../prisma/generated/enums';
import { prisma } from '../config/prisma';
import { normalizeDocs } from '../utils/normalizeDocs';

export const createCaregiverVersions = async (
  caregiverId: string,
  profileData: any,
  status: CaregiverStatus,
) => {
  // PROFILE VERSION
  const lastVersion = await prisma.caregiverProfileVersion.findFirst({
    where: { caregiverId },
    orderBy: { versionNumber: 'desc' },
  });

  const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

  const profileVersion = await prisma.caregiverProfileVersion.create({
    data: {
      caregiverId,
      versionNumber,
      data: profileData,
      status,
    },
  });

  // DOCUMENT VERSION
  const documents = await prisma.caregiverDocument.findMany({
    where: { caregiverId },
  });

  if (documents.length === 0) return;

  const lastDocumentVersion = await prisma.caregiverDocumentVersion.findFirst({
    where: { caregiverId },
    orderBy: { versionNumber: 'desc' },
  });

  let shouldCreateVersion = false;
  let documentVersionNumber = 1;

  const currentDocs = normalizeDocs(documents);

  if (!lastDocumentVersion) {
    shouldCreateVersion = true;
  } else {
    const previousDocs = normalizeDocs(lastDocumentVersion.documents as any[]);

    if (JSON.stringify(previousDocs) !== JSON.stringify(currentDocs)) {
      shouldCreateVersion = true;
      documentVersionNumber = lastDocumentVersion.versionNumber + 1;
    }
  }

  if (shouldCreateVersion) {
    const careDoc = await prisma.caregiverDocumentVersion.create({
      data: {
        caregiverId,
        versionNumber: documentVersionNumber,
        documents: currentDocs,
      },
    });
  }
  return { profileVersion };
};
