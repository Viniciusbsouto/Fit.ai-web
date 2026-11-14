import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  // rc: {
  //   output: {
  //     target: "lib/api/rc-generated/index.ts",
  //     client: "react-query",
  //     override: {
  //       mutator: {
  //         path: "./lib/api/axios-instance.ts",
  //         name: "customInstance",
  //       },
  //     },
  //   },
  //   input: {
  //     target: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
  //     filters: {
  //       mode: "exclude",
  //       tags: ["default"],
  //     },
  //   },
  // },
  fetch: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
      override: {
        transformer: (schema) => {
          // Better Auth uses its own client; its wildcard is not a named path parameter.
          delete schema.paths?.["/api/auth/{*}"];

          // Keep the names used by the frontend when Swagger omits operationId.
          const operations = [
            ["/home/{date}", "get", "getHomeData"],
            ["/me/", "get", "getUserTrainData"],
            ["/workout-plans/{workoutPlanId}", "get", "getWorkoutPlan"],
            [
              "/workout-plans/{workoutPlanId}/days/{workoutDayId}",
              "get",
              "getWorkoutDay",
            ],
            [
              "/workout-plans/{workoutPlanId}/days/{workoutDayId}/sessions",
              "post",
              "startWorkoutSession",
            ],
            [
              "/workout-plans/{workoutPlanId}/days/{workoutDayId}/sessions/{sessionId}",
              "patch",
              "updateWorkoutSession",
            ],
          ] as const;

          for (const [path, method, operationId] of operations) {
            const operation = schema.paths?.[path]?.[method];
            if (operation && !operation.operationId) {
              operation.operationId = operationId;
            }
          }
          return schema;
        },
      },
    },
    output: {
      target: "./app/_lib/api/fetch-generated/index.ts",
      client: "fetch",
      prettier: true,
      override: {
        mutator: {
          path: "./app/_lib/fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
