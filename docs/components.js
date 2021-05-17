module.exports = {
  components: {
    schemas: {
      id: {
        type: 'number',
        description: 'An ID of a character',
        example: '1009146',
      },
      Character: {
        type: 'object',
        properties: {
          id: {
            $ref: '#/components/schemas/id',
          },
          name: {
            type: 'string',
            description: 'Name of the character',
            example: 'Abomination (Emil Blonsky)',
          },
          description: {
            type: 'string',
            description: 'The description of the character',
            example: 'Formerly known as Emil Blonsky, a spy...',
          },
        },
      },
      Characters: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/id',
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
      },
    },
  },
};
