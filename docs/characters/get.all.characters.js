module.exports = {
  get: {
    tags: ['Marvel characters retrieval operations'],
    description: 'Get all characters',
    operationId: 'characters',
    parameters: [],
    responses: {
      200: {
        description: 'Successful server response',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Characters',
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
