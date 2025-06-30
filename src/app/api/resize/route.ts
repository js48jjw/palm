import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs'; // Vercel에서 sharp 사용시 필요

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let quality = 80;
    let output = await sharp(buffer)
      .resize({ width: 1600, height: 1600, fit: 'inside' })
      .jpeg({ quality })
      .toBuffer();

    while (output.length > 4 * 1024 * 1024 && quality > 30) {
      quality -= 10;
      output = await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: 'inside' })
        .jpeg({ quality })
        .toBuffer();
    }

    return new NextResponse(output, {
      status: 200,
      headers: { 'Content-Type': 'image/jpeg' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || '이미지 처리 중 알 수 없는 오류' }, { status: 500 });
  }
} 