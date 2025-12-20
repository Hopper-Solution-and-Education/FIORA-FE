import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import Busboy from 'busboy';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res);
      case 'POST':
        return POST(req, res);
      case 'PUT':
        return PUT(req, res);
      case 'DELETE':
        return DELETE(req, res);
      default:
        return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
    }
  } catch (error: any) {
    return createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sortBy, page, limit } = req.query;
    let sortObj: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sortBy) {
      try {
        sortObj = JSON.parse(sortBy as string);
      } catch {
        return createError(res, RESPONSE_CODE.BAD_REQUEST, 'Invalid sortBy format');
      }
    }
    const safePage = page ? Number(page) : 1;
    const safeLimit = limit ? Number(limit) : 20;
    const result = await walletUseCase.getPackageFXPaginated({
      sortBy: sortObj,
      page: safePage,
      limit: safeLimit,
    });
    return res.status(RESPONSE_CODE.OK).json({
      status: RESPONSE_CODE.OK,
      message: Messages.GET_PACKAGE_FX_SUCCESS,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    console.error(error.message);
    return createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
  }
}
async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    const busboy = Busboy({ headers: req.headers });
    const fields: Record<string, any> = {};
    const fileUploadPromises: Promise<void>[] = [];
    const files: Array<{ url: string; size: number; path: string; type: string }> = [];

    busboy.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info;
      const buffers: Uint8Array[] = [];
      file.on('data', (data) => buffers.push(data));
      file.on('end', () => {
        const buffer = Buffer.concat(buffers);
        const blob = new Blob([buffer], { type: mimeType });
        const size = buffer.length;
        if (size > 5 * 1024 * 1024) {
          if (!fields.__fileSizeError) fields.__fileSizeError = [];
          fields.__fileSizeError.push(`${filename} vượt quá 5MB`);
          return;
        }
        const uploadPromise = uploadToFirebase({
          file: blob,
          path: `images/packagefx/${fieldname}`,
          fileName: filename,
        })
          .then((firebaseUrl) => {
            files.push({
              url: firebaseUrl,
              size,
              path: `images/packagefx/${fieldname}`,
              type: fieldname.toUpperCase(),
            });
          })
          .catch((err) => {});
        fileUploadPromises.push(uploadPromise);
      });
    });

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('finish', async () => {
      try {
        await Promise.all(fileUploadPromises);
        if (fields.__fileSizeError && fields.__fileSizeError.length > 0) {
          return createError(
            res,
            RESPONSE_CODE.BAD_REQUEST,
            `File size error: ${fields.__fileSizeError.join(', ')}`,
          );
        }
        if (!fields.fxAmount) {
          return createError(res, RESPONSE_CODE.BAD_REQUEST, 'fxAmount are required');
        }
        const fxAmount = Number(fields.fxAmount);
        if (isNaN(fxAmount) || fxAmount < 0) {
          return createError(
            res,
            RESPONSE_CODE.BAD_REQUEST,
            'fxAmount must be a non-negative number',
          );
        }
        const data = {
          fxAmount,
          files,
          createdBy: fields.createdBy || null,
        };
        const result = await walletUseCase.createPackageFx(data);
        return res
          .status(RESPONSE_CODE.CREATED)
          .json(createResponse(RESPONSE_CODE.CREATED, 'PackageFX created successfully', result));
      } catch (error: any) {
        return createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
      }
    });
    req.pipe(busboy);
  } else {
    return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_CONTENT_TYPE_MULTIPART);
  }
}
async function PUT(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    const busboy = Busboy({ headers: req.headers });
    const fields: Record<string, any> = {};
    const fileUploadPromises: Promise<void>[] = [];
    const files: Array<{ url: string; size: number; path: string; type: string }> = [];

    busboy.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info;
      const buffers: Uint8Array[] = [];
      file.on('data', (data) => buffers.push(data));
      file.on('end', () => {
        const buffer = Buffer.concat(buffers);
        const blob = new Blob([buffer], { type: mimeType });
        const size = buffer.length;
        // BỔ SUNG KIỂM TRA DUNG LƯỢNG FILE 5MB
        if (size > 5 * 1024 * 1024) {
          if (!fields.__fileSizeError) fields.__fileSizeError = [];
          fields.__fileSizeError.push(`${filename} vượt quá 5MB`);
          return; // Không upload file này
        }
        const uploadPromise = uploadToFirebase({
          file: blob,
          path: `images/packagefx/${fieldname}`,
          fileName: filename,
        }).then((firebaseUrl) => {
          files.push({
            url: firebaseUrl,
            size,
            path: `images/packagefx/${fieldname}`,
            type: fieldname.toUpperCase(),
          });
        });
        fileUploadPromises.push(uploadPromise);
      });
    });

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('finish', async () => {
      try {
        await Promise.all(fileUploadPromises);
        if (fields.__fileSizeError && fields.__fileSizeError.length > 0) {
          return createError(
            res,
            RESPONSE_CODE.BAD_REQUEST,
            `File size error: ${fields.__fileSizeError.join(', ')}`,
          );
        }
        if (!fields.id) {
          return createError(res, RESPONSE_CODE.BAD_REQUEST, 'id is required');
        }
        if (!fields.fxAmount) {
          return createError(res, RESPONSE_CODE.BAD_REQUEST, 'fxAmount is required');
        }

        const fxAmount = Number(fields.fxAmount);
        if (isNaN(fxAmount) || fxAmount < 0) {
          return createError(
            res,
            RESPONSE_CODE.BAD_REQUEST,
            'fxAmount must be a non-negative number',
          );
        }

        let removeAttachmentIds: string[] | undefined = undefined;
        if (fields.removeAttachmentIds) {
          try {
            removeAttachmentIds = JSON.parse(fields.removeAttachmentIds);
          } catch {
            removeAttachmentIds = undefined;
          }
        }

        const result = await walletUseCase.updatePackageFX(fields.id, {
          fxAmount,
          newFiles: files.length > 0 ? files : undefined,
          removeAttachmentIds,
        });

        if (!result) {
          return createError(res, RESPONSE_CODE.NOT_FOUND, 'PackageFX not found');
        }

        return res
          .status(RESPONSE_CODE.OK)
          .json(createResponse(RESPONSE_CODE.OK, 'PackageFX updated successfully', result));
      } catch (error: any) {
        console.error(error.message);
        return createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR);
      }
    });
    req.pipe(busboy);
  } else {
    return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_CONTENT_TYPE_MULTIPART);
  }
}
async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id || req.body?.id;
    if (!id || typeof id !== 'string') {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing or invalid id');
    }
    const deleted = await walletUseCase.deletePackageFX(id);
    if (!deleted) {
      return createError(res, RESPONSE_CODE.NOT_FOUND, 'PackageFX not found');
    }
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'PackageFX deleted successfully', deleted));
  } catch (error: any) {
    console.error(error.message);
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
      status: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      message: error?.message || Messages.INTERNAL_ERROR,
    });
  }
}
