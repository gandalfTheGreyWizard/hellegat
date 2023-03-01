import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DownloadQuery, FileList } from './uploader.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
@Controller('files')
export class UploaderController {
  @Get()
  async testGet() {
    const response = {};
    return response;
  }

  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    files.forEach((eachFile) => {
      fs.writeFileSync(`./upload/${eachFile.originalname}`, eachFile.buffer);
    });
  }

  @Get('download')
  async downloadFile(@Query() query: DownloadQuery, @Res() res) {
    try {
      const downloadFile = fs.createReadStream(`./upload/${query.name}`);
      downloadFile.pipe(res);
    } catch (error) {
      throw new HttpException('no such file', HttpStatus.NOT_FOUND);
    }
  }

  @Get('list')
  async listFiles(): Promise<FileList> {
    const contents = fs.readdirSync('./upload/');
    return { files: contents };
  }
}
