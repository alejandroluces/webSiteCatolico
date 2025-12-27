export interface ExcelRow {
  CELULAR: string | number;
  TEXTO_MENSAJE: string;
  NOMBRES?: string;
  SMS: string | number;
  [key: string]: string | number | undefined;
}

export interface WhatsAppMessage {
  phoneNumber: string | number;
  message: string;
  name?: string;
  imageFile?: File;
  sendAudio?: boolean;
}

export interface MessageWithImage {
  text: string;
  phone: string | number;
  imageFile?: File;
  sendAudio?: boolean;
}