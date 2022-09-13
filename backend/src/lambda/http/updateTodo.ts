import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { updateTodo } from "../../helpers/todo";
import { decodeJWTFromAPIGatewayEvent } from "../../auth/utils";
import { parseUserId } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);

    const todoId = event.pathParameters.todoId;

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    await updateTodo(
      todoId,
      JSON.parse(event.body),
      parseUserId(decodeJWTFromAPIGatewayEvent(event))
    );

    logger.info("Updated To do", {
      key: todoId,
      userId: parseUserId(decodeJWTFromAPIGatewayEvent(event)),
    });
    return {
      statusCode: 200,
      body: JSON.stringify(true),
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
