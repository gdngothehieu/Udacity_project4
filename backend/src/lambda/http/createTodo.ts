import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { createTodo } from "../../helpers/todo";
import { decodeJWTFromAPIGatewayEvent } from "../../auth/utils";
import * as uuid from "uuid";
import { parseUserId } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);

    // TODO: Implement creating a new TODO item
    const newToDo: CreateTodoRequest = JSON.parse(event.body);
    await createTodo(
      uuid.v4(),
      newToDo,
      parseUserId(decodeJWTFromAPIGatewayEvent(event))
    );

    logger.info("New To do Item Created", {
      key: uuid.v4(),
      userId: parseUserId(decodeJWTFromAPIGatewayEvent(event)),
    });

    return {
      statusCode: 200,
      body: "Successfully created new to do item",
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
