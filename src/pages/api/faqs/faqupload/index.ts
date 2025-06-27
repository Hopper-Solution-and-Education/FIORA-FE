// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import AdmZip from 'adm-zip';
// import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
// import Busboy from 'busboy';
// import fetch from 'node-fetch';

// const prisma = new PrismaClient();

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const bb = Busboy({ headers: req.headers });
//     const uploads: any[] = [];
//     const files: { filename: string; mimeType: string; buffers: Uint8Array[] }[] = [];

//     let fileCount = 0;
//     let invalidFile = false;
//     let zipFileBuffer: Buffer | null = null;

//     const allowedExtensions = [
//       '.zip',
//       '.rar',
//       '.7z',
//       '.tar',
//       '.gz',
//       '.tgz',
//       '.pdf',
//       '.xml',
//       '.jpg',
//       '.jpeg',
//       '.png',
//       '.webp',
//     ];

//     bb.on('file', (_name: string, file: any, info: any) => {
//       const { filename, mimeType } = info;
//       const buffers: Uint8Array[] = [];
//       fileCount++;

//       const ext = path.extname(filename).toLowerCase();
//       if (!allowedExtensions.includes(ext)) {
//         invalidFile = true;
//         file.resume();
//         return;
//       }

//       file.on('data', (data: Uint8Array) => {
//         buffers.push(data);
//       });

//       file.on('end', async () => {
//         const buffer = Buffer.concat(buffers);

//         if (buffer.length > 2 * 1024 * 1024) {
//           invalidFile = true;
//           return;
//         }

//         if (ext === '.zip') {
//           zipFileBuffer = buffer;
//         }

//         files.push({ filename, mimeType, buffers });
//       });
//     });

//     bb.on('finish', async () => {
//       const imageUrl = req.headers['image-url'] as string;

//       if (imageUrl) {
//         try {
//           const response = await fetch(imageUrl);
//           if (!response.ok) throw new Error('Failed to download image from URL');

//           const contentType = response.headers.get('content-type') || '';
//           const buffer = Buffer.from(await response.arrayBuffer());

//           const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
//           const uniqueName = `${uuidv4()}.${ext}`;
//           const blob = new Blob([buffer], { type: contentType });

//           const publicUrl = await uploadToFirebase({
//             file: blob,
//             path: 'images',
//             fileName: uniqueName,
//           });

//           const saved = await prisma.attachment.create({
//             data: {
//               type: ext.toUpperCase(),
//               size: buffer.length,
//               url: publicUrl,
//               path: `images/${uniqueName}`,
//               createdBy: null,
//             },
//           });

//           uploads.push(saved);
//         } catch (err: any) {
//           return res.status(400).json({
//             error: 'Invalid image URL',
//             message: err.message || 'Could not fetch or process image URL',
//           });
//         }
//       }

//       if (fileCount > 0) {
//         if (fileCount < 1 || fileCount > 3) {
//           return res.status(400).json({
//             error: 'Invalid quantity',
//             title: 'Invalid quantity',
//             message: 'Quantity must be from 1 to 3 files',
//           });
//         }

//         if (invalidFile) {
//           return res.status(400).json({
//             error: 'Invalid file',
//             title: 'Invalid file type',
//             message:
//               'Allowed file types: pdf, xml, zip, rar, 7z, tar, gz, tgz, jpg, jpeg, png, webp',
//           });
//         }

//         if (fileCount === 1 && zipFileBuffer) {
//           try {
//             const zip = new AdmZip(zipFileBuffer);
//             const zipEntries = zip.getEntries();
//             const validEntries = zipEntries.filter(
//               (entry) =>
//                 !entry.isDirectory &&
//                 ['.pdf', '.xml'].includes(path.extname(entry.entryName).toLowerCase()),
//             );
//             if (validEntries.length < 1 || validEntries.length > 2) {
//               return res.status(400).json({
//                 error: 'File is empty',
//                 title: 'Invalid ZIP content',
//                 message: 'ZIP must contain 1-2 files of type PDF/XML',
//               });
//             }
//           } catch (err) {
//             console.error('ZIP processing error:', err);
//             return res.status(400).json({
//               error: 'Invalid ZIP file',
//               title: 'Corrupted ZIP',
//               message: 'Could not extract ZIP contents',
//             });
//           }
//         }

//         for (const fileObj of files) {
//           const buffer = Buffer.concat(fileObj.buffers);
//           const blob = new Blob([buffer], { type: fileObj.mimeType });
//           const ext = path.extname(fileObj.filename).toLowerCase().replace('.', '');
//           const uniqueName = `${uuidv4()}-${fileObj.filename}`;

//           const publicUrl = await uploadToFirebase({
//             file: blob,
//             path: 'uploads',
//             fileName: uniqueName,
//           });

//           const saved = await prisma.attachment.create({
//             data: {
//               type: ext.toUpperCase().substring(0, 10) || 'UNKNOWN',
//               size: buffer.length,
//               url: publicUrl,
//               path: `uploads/${uniqueName}`,
//               createdBy: null,
//             },
//           });

//           uploads.push(saved);
//         }
//       }

//       res.status(200).json({ message: 'Files uploaded', data: uploads });
//     });

//     req.pipe(bb);
//   } catch (error: any) {
//     console.error('Upload error:', error);
//     res.status(500).json({ error: error?.message || 'Failed to upload files' });
//   }
// }
