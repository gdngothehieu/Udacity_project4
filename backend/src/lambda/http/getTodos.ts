import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { getAllTodosForUser } from "../../helpers/todo";
import { decodeJWTFromAPIGatewayEvent } from "../../auth/utils";
import { parseUserId } from "../../auth/utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);
    // TODO: Get all TODO items for a current user
    const userId = parseUserId(decodeJWTFromAPIGatewayEvent(event));

    const todos = await getAllTodosForUser(userId);

    if (todos.count !== 0) {
      return {
        statusCode: 200,
        body: "Users has a lot to dos",
      };
    }

    return {
      statusCode: 404,
      body: "No to do items",
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
