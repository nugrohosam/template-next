export type Attachment = {
  length: number;
  name: string;
  sftp: boolean;
  status: boolean;
};

export interface UploadAttachment {
  attachment: Array<File>;
  module: string;
}
