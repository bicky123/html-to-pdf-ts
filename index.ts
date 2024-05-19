import { Handler } from "aws-lambda";
import { PdfService } from "./src/services/pdf.service";
import { IRequestModel } from "./src/models/request.model";
import { IResponseModel } from "./src/models/response.model";

export const handler: Handler = async (
  event: IRequestModel,
  context: any
): Promise<IResponseModel> => {
  const html = event.html;
  if (!html) {
    return {
      status: 400,
      data: "Html is required parameter",
    };
  }
  const pdfService = new PdfService();
  const response = await pdfService.convertHtmlToPdf(html);
  if (!response) {
    return {
      status: 500,
      data: "Some error occurred",
    };
  }
  const base64 = response.toString("base64");
  //console.log(base64);
  return {
    status: 200,
    data: base64,
  };
};
