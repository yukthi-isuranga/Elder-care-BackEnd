import { Errback, NextFunction, Request, Response } from 'express';
import { CaregiverCreateRequest, DocumentType } from '../types/caregiver';
import {
  CaregiverStatus,
  District,
  Gender,
  User,
} from '../../prisma/generated/client';
import { prisma } from '../config/prisma';
import { createCaregiverProfileSchema } from '../validators/caregiverProfileValidator';
import { createCaregiverVersions } from '../services/versioningService';
import cloudinary from '../utils/cloudinary.config';

interface CareGiverRequest extends Request {
  user?: User;
}

export const caregiverController = async (req: Request, res: Response) => {
  try {
    const {
      district,
      gender,
      experienceYears,
      canHandleDementia,
      canHandleBedridden,
      canHandleWheelchair,
      availableForNight,
      availableForFullTime,
      hourlyRateMin,
      hourlyRateMax,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const caregivers = await prisma.caregiver.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,

        ...(district && { district: district as District }),
        ...(gender && { gender: gender as Gender }),

        ...(experienceYears && {
          experienceYears: {
            gte: Number(experienceYears),
          },
        }),

        ...(hourlyRateMin && {
          hourlyRate: {
            gte: Number(hourlyRateMin),
          },
        }),

        ...(hourlyRateMax && {
          hourlyRate: {
            lte: Number(hourlyRateMax),
          },
        }),

        ...(canHandleDementia && {
          canHandleDementia: canHandleDementia === 'true',
        }),

        ...(canHandleBedridden && {
          canHandleBedridden: canHandleBedridden === 'true',
        }),

        ...(canHandleWheelchair && {
          canHandleWheelchair: canHandleWheelchair === 'true',
        }),

        ...(availableForNight && {
          availableForNight: availableForNight === 'true',
        }),

        ...(availableForFullTime && {
          availableForFullTime: availableForFullTime === 'true',
        }),
      },

      orderBy: {
        averageRating: 'desc',
      },

      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const total = await prisma.caregiver.count({
      where: {
        status: 'APPROVED',
        isActive: true,
      },
    });

    return res.json({
      page: pageNumber,
      limit: limitNumber,
      total,
      data: caregivers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to fetch caregivers',
    });
  }
};

export const careGiverProfileController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: CaregiverCreateRequest = req.body;

    // Extract logged-in user ID (assuming middleware adds it)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    //Create Caregiver Profile in DB
    const userProfile = await prisma.caregiver.create({
      data: {
        userId: userId,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        nameWithInitials: data.nameWithInitials,
        phone: data.phone,
        secondaryPhone: data.secondaryPhone,
        nic: data.nic,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        postalCode: data.postalCode,
        city: data.city,
        district: data.district,
        experienceYears: data.experienceYears,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        // status: data.status,
        adminNote: data.adminNote,
        approvedById: data.approvedById,

        // =============================
        // PROFESSIONAL DETAILS
        // =============================
        qualifications: data.qualifications, // NEW
        certifications: data.certifications, // NEW
        specialization: data.specialization, // NEW
        languagesSpoken: data.languagesSpoken, // NEW

        // =============================
        // SKILL FLAGS
        // =============================
        canHandleDementia: data.canHandleDementia ?? false, // NEW
        canHandleBedridden: data.canHandleBedridden ?? false, // NEW
        canHandleWheelchair: data.canHandleWheelchair ?? false, // NEW
        canProvidePhysiotherapy: data.canProvidePhysiotherapy ?? false, // NEW
        canAdministerMedication: data.canAdministerMedication ?? false, // NEW
        canHandleEmergency: data.canHandleEmergency ?? false, // NEW

        // =============================
        // AVAILABILITY
        // =============================
        isAvailable: data.isAvailable ?? true, // NEW
        availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
        availableTo: data.availableTo ? new Date(data.availableTo) : null,
        availableForNight: data.availableForNight ?? false, // NEW
        availableForFullTime: data.availableForFullTime ?? false, // NEW

        // =============================
        // VERIFICATION & SAFETY
        // =============================
        isIdentityVerified: data.isIdentityVerified ?? false, // NEW
        isBackgroundChecked: data.isBackgroundChecked ?? false, // NEW
        backgroundCheckDate: data.backgroundCheckDate, // NEW
        // emergencyContactName: data.emergencyContactName, // NEW
        // emergencyContactPhone: data.emergencyContactPhone, // NEW

        // =============================
        // RATING & PERFORMANCE (admin controlled)
        // =============================
        averageRating: data.averageRating ?? 0, // NEW
        totalReviews: data.totalReviews ?? 0, // NEW
        totalCompletedJobs: data.totalCompletedJobs ?? 0, // NEW

        // =============================
        // SYSTEM
        // =============================
        isActive: data.isActive ?? true, // NEW
      },
    });

    if (!userProfile) {
      return res
        .status(400)
        .json({ message: 'CareGiver Profile Data creation Faild...!!!' });
    } else {
      return res.status(200).json({
        message: 'CareGiver Profile Successfully created...!!!',
        userProfile,
      });
    }
  } catch (error: any) {
    console.error(error);

    // Prisma unique constraint error
    if (error.code === 'P2002') {
      return res.status(400).json({
        message: 'Caregiver profile already exists for this user',
      });
    }

    // Foreign key error
    if (error.code === 'P2003') {
      return res.status(400).json({
        message: 'Invalid user reference',
      });
    }

    next(error); // let global error handler handle the rest
  }
};

// Get CareGiver Data. for dashbord
export const caregiverDashboardController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // check caregiver profile was avalable or not. if avalable checks documants are avalable or not. and after cheks the profile status and send the response acordingly
    const caregiverProfile = await prisma.caregiver.findUnique({
      where: { userId: userData.id },
      select: {
        status: true,
        documents: true,
      },
    });

    if (!caregiverProfile) {
      return res.json({
        step: 'PROFILE_NOT_CREATED',
        message: 'Please create caregiver profile',
      });
    }

    // check documents
    if (
      !caregiverProfile.documents ||
      caregiverProfile.documents.length === 0
    ) {
      return res.json({
        step: 'DOCUMENTS_MISSING',
        message: 'Please upload required documents',
      });
    }

    switch (caregiverProfile.status) {
      case CaregiverStatus.DRAFT:
        return res.json({
          step: 'PROFILE_INCOMPLETE',
          message: 'Complete your profile',
        });

      case CaregiverStatus.SUBMITTED:
        return res.json({
          step: 'UNDER_REVIEW',
          message: 'Your profile is under review',
        });

      case CaregiverStatus.APPROVED:
        return res.json({
          step: 'APPROVED',
          message: 'You are ready to accept bookings',
        });

      case CaregiverStatus.REJECTED:
        return res.json({
          step: 'REJECTED',
          message: 'Your profile was rejected. Please update and resubmit',
        });

      case CaregiverStatus.UNDER_REVIEW:
        return res.json({
          step: 'UNDER_REVIEW',
          message:
            'Your profile is under review by admin, Please wait for the response',
        });

      case CaregiverStatus.CHANGES_REQUIRED:
        return res.json({
          step: 'CHANGES_REQUIRED',
          message: 'Your profile needs changes before approval',
        });

      default:
        return res.json({
          step: 'UNKNOWN',
        });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving CareGiver Profile',
      error,
    });
  }
};

export const editcareGiverProfileController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;
    const data = req.body;

    if (!userData) return res.status(401).json({ message: 'Unauthorized' });

    //Update Caregiver data
    const caregiverData = await prisma.caregiver.update({
      where: { userId: userData.id },
      data,
    });
    if (caregiverData) {
      return res.status(200).json({
        message: 'CareGiver Profile Successfully Updated...!!!',
        caregiverData,
      });
    } else
      return res.status(400).json({
        message: 'CareGiver Profile Update Failed...!!!',
      });
  } catch (error) {
    return res.status(400).json({
      message: 'CareGiver Profile Update Failed...!!!',
      error,
    });
  }
};

// Get CareGiver Profile Detils
export const getCaregiverProfileController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const caregiverProfile = await prisma.caregiver.findUnique({
      where: { userId: userData.id },
    });

    if (!caregiverProfile) {
      return res.status(404).json({ message: 'CareGiver Profile not found' });
    }

    return res.status(200).json({
      message: 'CareGiver Profile retrieved successfully',
      caregiverProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving CareGiver Profile',
      error,
    });
  }
};

export const submitCareGiverProfileController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res.status(400).json({ message: 'User Data Not found....' });
    }
    // first checks for the profile
    const careGiverProfile = await prisma.caregiver.findUnique({
      where: { userId: userData.id },
    });

    if (!careGiverProfile) {
      return res
        .status(400)
        .json({ message: 'CareGiver Profile Not found....' });
    }

    // checks DB data with the Zod shema
    const validate = createCaregiverProfileSchema.safeParse(careGiverProfile);

    if (!validate.success) {
      return res.status(400).json({
        errors: validate.error.format(),
      });
    }

    // Update the Status of the Caregiver Profile
    const updateCgStatus = await prisma.caregiver.update({
      where: { userId: userData.id },
      data: { status: 'SUBMITTED' },
    });

    if (!updateCgStatus) {
      return res
        .status(400)
        .json({ message: 'Approval didnt Submitted...!!!' });
    }

    // // First, get the last version number (if any)
    // const lastVersion = await prisma.caregiverProfileVersion.findFirst({
    //   where: { caregiverId: careGiverProfile.id },
    //   orderBy: { versionNumber: 'desc' },
    // });

    // const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    // // Check Documents Changes
    // const documents = await prisma.caregiverDocument.findMany({
    //   where: { caregiverId: careGiverProfile.id },
    // });

    // // Check if documents exist
    // if (documents.length > 0) {
    //   const lastDocumentVersion =
    //     await prisma.caregiverDocumentVersion.findFirst({
    //       where: { caregiverId: careGiverProfile.id },
    //       orderBy: { versionNumber: 'desc' },
    //     });

    //   let shouldCreateVersion = false;
    //   let documentVersionNumber = 1;

    //   const currentDocs = normalizeDocs(documents);

    //   if (!lastDocumentVersion) {
    //     shouldCreateVersion = true;
    //   } else {
    //     const previousDocs = normalizeDocs(
    //       lastDocumentVersion.documents as any[],
    //     );

    //     if (JSON.stringify(previousDocs) !== JSON.stringify(currentDocs)) {
    //       shouldCreateVersion = true;
    //       documentVersionNumber = lastDocumentVersion.versionNumber + 1;
    //     }
    //   }

    //   if (shouldCreateVersion) {
    //     await prisma.caregiverDocumentVersion.create({
    //       data: {
    //         caregiverId: careGiverProfile.id,
    //         versionNumber: documentVersionNumber,
    //         documents: documents,
    //       },
    //     });
    //   }
    // }

    // // // Check there any previous Document vershons
    // // const documentVersion = await prisma.caregiverDocumentVersion.findFirst({
    // //   where: { caregiverId: careGiverProfile.id },
    // //   orderBy: { versionNumber: 'desc' },
    // // });

    // // // if there is no null documents, make first vershon as 1 after 1++
    // // if (documents && documentVersion) {
    // //   // const documentversionNumber = lastVersion?.documentversionNumber ?? 1;
    // // }

    // // Create a new version Caregiver Profile Version
    // const versionsData = await prisma.caregiverProfileVersion.create({
    //   data: {
    //     caregiverId: careGiverProfile.id,
    //     versionNumber: versionNumber,
    //     data: updateCgStatus, // snapshot of caregiver profile
    //     status: 'SUBMITTED', // optional, can use the same as caregiver
    //   },
    // });
    // First, get the last version number (if any)
    const versionData = await createCaregiverVersions(
      updateCgStatus.id,
      updateCgStatus,
      updateCgStatus.status,
    );

    if (!versionData) {
      return res.status(400).json({ message: 'Version Didnt careted...' });
    }

    return res.status(200).json({
      message: 'Your Request was submitted to ADMIN...',
      updateCgStatus,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const normalizeDocs = (docs: any[]) => {
  return docs
    .map((d) => ({
      type: d.type,
      fileUrl: d.fileUrl,
      verified: d.verified,
    }))
    .sort((a, b) => a.fileUrl.localeCompare(b.fileUrl));
};

// export const createCaregiverDocumentController = async (
//   req: CareGiverRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userData = req.user;
//     const data = req.body;

//     const caregiverData = await prisma.caregiver.findUnique({
//       where: { userId: userData?.id },
//     });
//     if (!caregiverData) {
//       return res.status(400).json({
//         message: 'Caregiver data Not found...!!!',
//       });
//     }

//     const caregiverDocument = await prisma.caregiverDocument.create({
//       data: { caregiverId: caregiverData.id, ...data },
//     });

//     if (!caregiverDocument) {
//       return res.status(400).json({
//         message: 'Caregiver Document Not Created...!!!',
//       });
//     }
//     return res.status(200).json({
//       message: 'Caregiver Document Created...!!!',
//       caregiverDocument,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       error,
//     });
//   }
// };

export const createCaregiverDocumentController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;
    const file = req.file; // 👈 from multer
    const { type } = req.body;

    if (!userData?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    if (!type) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    // ✅ Validate document type
    // const allowedTypes = ['NIC', 'CERTIFICATE', 'POLICE_REPORT', 'OTHER'];
    const allowedTypes = Object.values(DocumentType); // if you have an enum in TypeScript, this is cleaner
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    // ✅ Find caregiver
    const caregiverData = await prisma.caregiver.findUnique({
      where: { userId: userData.id },
    });

    if (!caregiverData) {
      return res.status(400).json({
        message: 'Caregiver data not found',
      });
    }

    // ✅ Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: 'Invalid file type. Only images and PDFs allowed',
      });
    }

    // ✅ Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'caregivers',
          resource_type: 'auto', // 👈 supports image + pdf
          public_id: `${caregiverData.id}_${type}`, // optional naming
          overwrite: true, // replace if re-upload
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(file.buffer);
    });

    // ✅ Save to DB
    const caregiverDocument = await prisma.caregiverDocument.create({
      data: {
        caregiverId: caregiverData.id,
        type,
        fileUrl: uploadResult.secure_url,
        description: req.body.description ?? undefined, // optional description
      },
    });

    // 🔥 Bonus Improvement (Optional but pro)
    // Prevent duplicate uploads: If a document of the same type already exists for this caregiver,
    // you might want to either update it or reject the upload. Here's how you could implement an upsert logic:

    // await prisma.caregiverDocument.upsert({
    //   where: {
    //     caregiverId_type: {
    //       caregiverId: caregiverData.id,
    //       type,
    //     },
    //   },
    //   update: {
    //     fileUrl: uploadResult.secure_url,
    //     verified: false,
    //   },
    //   create: {
    //     caregiverId: caregiverData.id,
    //     type,
    //     fileUrl: uploadResult.secure_url,
    //   },
    // });

    return res.status(200).json({
      message: 'Caregiver Document Uploaded Successfully',
      caregiverDocument,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

// Get CareGiver Documents
export const getCaregiverDocumentController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;

    if (!userData?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Find caregiver
    const caregiverData = await prisma.caregiver.findUnique({
      where: { userId: userData.id },
    });

    if (!caregiverData) {
      return res.status(400).json({
        message: 'Caregiver data not found',
      });
    }

    // ✅ Find From DB
    const caregiverDocument = await prisma.caregiverDocument.findMany({
      where: { caregiverId: caregiverData.id },
    });

    if (!caregiverDocument) {
      return res.status(404).json({
        message: 'No documents found for this caregiver',
      });
    }

    return res.status(200).json({
      message: 'Caregiver Documents found Successfully.',
      caregiverDocument,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

// Delete CareGiver Document
export const deleteCaregiverDocumentController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;
    const { documentId } = req.params;

    if (!userData?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Find caregiver
    const caregiverData = await prisma.caregiver.findUnique({
      where: { userId: userData.id },
    });

    if (!caregiverData) {
      return res.status(400).json({
        message: 'Caregiver data not found',
      });
    }

    // ✅ Find document
    const caregiverDocument = await prisma.caregiverDocument.findUnique({
      where: { id: documentId.toString() },
    });

    if (!caregiverDocument) {
      return res.status(404).json({
        message: 'Document not found',
      });
    }

    // Delete from Cloudinary
    const url = caregiverDocument.fileUrl;

    const isPdf = url.endsWith('.pdf');

    const resourceType = isPdf ? 'raw' : 'image';

    const publicId = caregiverDocument.fileUrl
      .split('/')
      .slice(-2) // 👈 include folder
      .join('/')
      .replace(/\.[^/.]+$/, ''); // remove extension

    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (
      cloudinaryResponse.result !== 'ok' &&
      cloudinaryResponse.result !== 'not found'
    ) {
      return res.status(404).json({
        message: `Cloudinary deletion warning: ${cloudinaryResponse.result} for public_id: ${publicId}`,
      });
      // console.warn(
      //   `Cloudinary deletion warning: ${cloudinaryResponse.result} for public_id: ${publicId}`,
      // );
    }

    // ✅ Delete from DB
    await prisma.caregiverDocument.delete({
      where: { id: caregiverDocument.id },
    });

    return res.status(200).json({
      message: 'Caregiver Document deleted Successfully',
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};
