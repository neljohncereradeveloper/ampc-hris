const {
  pascalCase,
  camelCase,
  constantCase,
  kebabCase,
  snakeCase,
} = require('change-case');

module.exports = function (plop) {
  // Helpers
  plop.setHelper('pascal', (txt) => pascalCase(txt));
  plop.setHelper('camel', (txt) => camelCase(txt));
  plop.setHelper('constant', (txt) => constantCase(txt));
  plop.setHelper('kebab', (txt) => kebabCase(txt));
  plop.setHelper('snake', (txt) => snakeCase(txt));

  plop.setGenerator('ddd', {
    description: 'Generate full DDD model structure',
    prompts: [
      {
        type: 'input',
        name: 'feature',
        message: 'Feature name (e.g. user_management):',
      },
      { type: 'input', name: 'model', message: 'Model name (e.g. role):' },
    ],

    actions: [
      /**
       * =========================
       * DOMAIN LAYER
       * =========================
       */

      // Model
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/models/{{kebab model}}.model.ts',
        templateFile: 'plop-templates/domain/model.hbs',
      },

      // Constant
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/constants/{{kebab model}}.constant.ts',
        templateFile: 'plop-templates/domain/constant.hbs',
      },

      // Exception
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/exceptions/{{kebab model}}.exception.ts',
        templateFile: 'plop-templates/domain/exception.hbs',
      },

      // Repository Interface
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/repositories/{{kebab model}}.repository.ts',
        templateFile: 'plop-templates/domain/repository-interface.hbs',
      },

      /**
       * =========================
       * APPLICATION LAYER
       * =========================
       */

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use_cases/{{kebab model}}/create.use-case.ts',
        templateFile: 'plop-templates/application/create-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use_cases/{{kebab model}}/update.use-case.ts',
        templateFile: 'plop-templates/application/update-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use_cases/{{kebab model}}/archive.use-case.ts',
        templateFile: 'plop-templates/application/archive-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use_cases/{{kebab model}}/restore.use-case.ts',
        templateFile: 'plop-templates/application/restore-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use_cases/{{kebab model}}/get-paginated.use-case.ts',
        templateFile: 'plop-templates/application/get-paginated-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/commands/{{kebab model}}/create.command.ts',
        templateFile: 'plop-templates/application/create-command.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/commands/{{kebab model}}/update.command.ts',
        templateFile: 'plop-templates/application/update-command.hbs',
      },

      /**
       * =========================
       * INFRASTRUCTURE LAYER
       * =========================
       */

      {
        type: 'add',
        path: 'src/features/{{feature}}/infrastructure/database/entities/{{kebab model}}.entity.ts',
        templateFile: 'plop-templates/infrastructure/entity.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/infrastructure/database/repositories/{{kebab model}}.repository.impl.ts',
        templateFile: 'plop-templates/infrastructure/repository-impl.hbs',
      },

      /**
       * =========================
       * PRESENTATION LAYER
       * =========================
       */

      {
        type: 'add',
        path: 'src/features/{{feature}}/presentation/controllers/{{kebab model}}/{{kebab model}}.controller.ts',
        templateFile: 'plop-templates/presentation/controller.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/presentation/dto/{{kebab model}}/create-{{kebab model}}.dto.ts',
        templateFile: 'plop-templates/presentation/create-dto.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/presentation/dto/{{kebab model}}/update-{{kebab model}}.dto.ts',
        templateFile: 'plop-templates/presentation/update-dto.hbs',
      },
    ],
  });
};
