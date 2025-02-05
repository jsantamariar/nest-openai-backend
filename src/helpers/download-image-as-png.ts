import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { InternalServerErrorException } from '@nestjs/common';

export const downloadImageAsPng = async (url: string, fullPath?: boolean) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new InternalServerErrorException('Download image was not possible');
  }
  // NOTE: to development mode
  // const folderPath = path.resolve('./', './generated/images/');
  const folderPath = path.resolve('./tmp', 'images');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}.png`;

  const buffer = Buffer.from(await response.arrayBuffer());

  const completePath = path.join(folderPath, imageNamePng);

  await sharp(buffer).png().ensureAlpha().toFile(path.join(completePath));

  return fullPath ? completePath : imageNamePng;
};

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  fullPath?: boolean,
) => {
  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;

  const completePath = path.join(folderPath, imageNamePng);

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(path.join(folderPath, imageNamePng));

  return fullPath ? completePath : imageNamePng;
};
