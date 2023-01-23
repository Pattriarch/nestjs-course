import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
	async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		// path - рутовая директория
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		// обеспечиваем наличие директории
		await ensureDir(uploadFolder);

		const response: FileElementResponse[] = [];
		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			response.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname });
		}
		return response;
	}

	convertToWebP(file: Buffer): Promise<Buffer> {
		// конвертируем в webp и возвращаем буффер
		return sharp(file)
			.webp()
			.toBuffer();
	}
}
