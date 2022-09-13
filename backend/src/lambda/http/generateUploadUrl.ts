import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { getPresignedImageUrl } from "../../helpers/todo";
import { decodeJWTFromAPIGatewayEvent, parseUserId } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("todo");
import * as uuid from "uuid";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);
    const todoId = event.pathParameters.todoId;

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    await getPresignedImageUrl(
      todoId,
      uuid.v4(),
      parseUserId(decodeJWTFromAPIGatewayEvent(event))
    );

    logger.info("Created to do image URL", {
      key: todoId,
      userId: parseUserId(decodeJWTFromAPIGatewayEvent(event)),
      imageId: uuid.v4(),
    });

    return {
      statusCode: 200,
      body: "Successfully created new to do image URL",
    };
  }
);

handler
  .use(
    cors({
      credentials: true,
    })
  )
  .use(httpErrorHandler());
