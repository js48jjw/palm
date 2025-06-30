import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import sharp from 'sharp';
import fs from 'fs';
import { Fields, Files } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ error: '파일 파싱 실패' });
    const fileField = files.file;
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    if (!file) return res.status(400).json({ error: '파일이 없습니다.' });
    const buffer = fs.readFileSync((file as unknown as formidable.File).filepath);
    let quality = 80;
    let output = await sharp(buffer)
      .resize({ width: 1600, height: 1600, fit: 'inside' })
      .jpeg({ quality })
      .toBuffer();
    // 4MB 이하로 반복 압축
    while (output.length > 4 * 1024 * 1024 && quality > 30) {
      quality -= 10;
      output = await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: 'inside' })
        .jpeg({ quality })
        .toBuffer();
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(output);
  });
} 