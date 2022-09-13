import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { deleteTodo } from "../../helpers/todo";
import { createLogger } from "../../utils/logger";
import { decodeJWTFromAPIGatewayEvent } from "../../auth/utils";
import { parseUserId } from "../../auth/utils";

const logger = createLogger("todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);

    const userId = parseUserId(decodeJWTFromAPIGatewayEvent(event));

    // TODO: Remove a TODO item by id
    await deleteTodo(decodeJWTFromAPIGatewayEvent(event), userId);

    logger.info("Deleting To Do Item", {
      key: decodeJWTFromAPIGatewayEvent(event),
      userId: userId,
    });

    return {
      statusCode: 200,
      body: "Successfully delete to do item",
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
