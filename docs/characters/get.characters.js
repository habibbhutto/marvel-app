module.exports = {
  get: {
    tags: ['Marvel characters retrieval operations'],
    description: 'Get a character',
    operationId: 'character',
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: {
          $ref: '#/components/schemas/id',
        },
        required: true,
        description: 'A single character id',
      },
    ],
    responses: {
      200: {
        description: 'Successful server response',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Character',
            },
          },
        },
      },
      404: {
        description: 'Character not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
              example: {
                message: 'Not found',
              },
            },
          },
        },
      },
      500: {
        description: 'Server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
              example: {
                message: 'Internal server error',
              },
            },
          },
        },
      },
    },
  },
};
