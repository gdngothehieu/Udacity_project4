import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { getUploadUrl, updateUrl } from "../../helpers/todos";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("generateUploadUrl");
// TODO: Return a presigned URL to upload a file for a TODO item with the provided id

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;

    logger.info(`Processing event`);
    const userId = getUserId(event);
    const getUploadURLResponse = await getUploadUrl(todoId);
    const attachmentId = getUploadURLResponse.split("?")[0];

    await updateUrl(userId, todoId, attachmentId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: getUploadURLResponse,
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
