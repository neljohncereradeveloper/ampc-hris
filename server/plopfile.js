const {
  pascalCase,
  camelCase,
  constantCase,
  kebabCase,
  snakeCase,
} = require('change-case');
const pluralize = require('pluralize');

module.exports = function (plop) {
  // Helpers
  plop.setHelper('pascal', (txt) => pascalCase(txt));
  plop.setHelper('camel', (txt) => camelCase(txt));
  plop.setHelper('constant', (txt) => constantCase(txt));
  plop.setHelper('kebab', (txt) => kebabCase(txt));
  plop.setHelper('snake', (txt) => snakeCase(txt));
  plop.setHelper('plural', (text) => pluralize(text));

  plop.setGenerator('ddd', {
    description: 'Generate full DDD model structure',
    prompts: [
      {
        type: 'input',
        name: 'feature',
        message: 'Feature name (e.g. user_management):',
      },
      { type: 'input', name: 'model', message: 'Model name (e.g. role):' },
      // {
      //   type: 'input',
      //   name: 'feature-upper',
      //   message: 'Feature all uppercase snake (e.g. SHARED_DOMAIN):',
      // },
    ],

    actions: [
      /**
       * =========================
       * DOMAIN LAYER
       * =========================
       */
      // Add Tokens Constant
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/constants/tokens.constants.ts',
        skipIfExists: true,
        template: `export const {{constant (snake feature)}}_TOKENS = {
            } as const;
            `,
      },
      // Modify Tokens Constant
      {
        type: 'modify',
        path: 'src/features/{{feature}}/domain/constants/tokens.constants.ts',
        pattern: /(export const .*_TOKENS = \{[\s\S]*?)(\}\s+as const;)/,
        template: `$1  {{constant model}}: '{{pascal model}}Repository',\n$2`,
      },
      // Add Database Models Constant
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/constants/database.constants.ts',
        skipIfExists: true,
        template: `export const {{constant (snake feature)}}_DATABASE_MODELS = {
        } as const;
        `,
      },
      // Modify Database Models Constant
      {
        type: 'modify',
        path: 'src/features/{{feature}}/domain/constants/database.constants.ts',
        pattern:
          /(export const .*_DATABASE_MODELS = \{[\s\S]*?)(\}\s+as const;)/,
        template: `$1  {{constant (plural model)}}: '{{kebab (plural model)}}',\n$2`,
      },

      // Model
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/models/{{kebab model}}.model.ts',
        templateFile: 'plop-templates/domain/model.hbs',
      },

      // Index Models
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/models/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/domain/models-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{feature}}/domain/models/index.ts',
        pattern: /(\/\/ PLOP-APPEND-MODELS)/g,
        template: "export * from './{{kebab model}}.model';\n$1",
      },

      // Constant
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/constants/{{kebab model}}.constants.ts',
        templateFile: 'plop-templates/domain/constant.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/constants/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/domain/constant-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{feature}}/domain/constants/index.ts',
        pattern: /(\/\/ PLOP-APPEND-CONSTANTS)/g,
        template: "export * from './{{kebab model}}.constants';\n$1",
      },

      // Exception
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/exceptions/{{kebab model}}.exception.ts',
        templateFile: 'plop-templates/domain/exception.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/exceptions/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/domain/exception-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{feature}}/domain/exceptions/index.ts',
        pattern: /(\/\/ PLOP-APPEND-EXCEPTIONS)/g,
        template: "export * from './{{kebab model}}.exception';\n$1",
      },

      // Repository Interface
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/repositories/{{kebab model}}.repository.ts',
        templateFile: 'plop-templates/domain/repository-interface.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/repositories/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/domain/repository-interface-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{feature}}/domain/repositories/index.ts',
        pattern: /(\/\/ PLOP-APPEND-REPOSITORIES)/g,
        template: "export * from './{{kebab model}}.repository';\n$1",
      },

      // Index Domain
      {
        type: 'add',
        path: 'src/features/{{feature}}/domain/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/domain/index.hbs',
      },

      /**
       * =========================
       * APPLICATION LAYER
       * =========================
       */

      // Index Commands
      {
        type: 'add',
        path: 'src/features/{{feature}}/application/commands/{{kebab model}}/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/application/command-index.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use-cases/{{kebab model}}/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/application/use-case-index.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use-cases/{{kebab model}}/create.use-case.ts',
        templateFile: 'plop-templates/application/create-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use-cases/{{kebab model}}/update.use-case.ts',
        templateFile: 'plop-templates/application/update-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use-cases/{{kebab model}}/archive.use-case.ts',
        templateFile: 'plop-templates/application/archive-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use-cases/{{kebab model}}/restore.use-case.ts',
        templateFile: 'plop-templates/application/restore-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use-cases/{{kebab model}}/get-paginated.use-case.ts',
        templateFile: 'plop-templates/application/get-paginated-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/use-cases/{{kebab model}}/combobox.use-case.ts',
        templateFile: 'plop-templates/application/combobox-use-case.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/commands/{{kebab model}}/create-{{kebab model}}.command.ts',
        templateFile: 'plop-templates/application/create-command.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/application/commands/{{kebab model}}/update-{{kebab model}}.command.ts',
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
        path: 'src/features/{{feature}}/infrastructure/database/entities/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/infrastructure/entity-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{feature}}/infrastructure/database/entities/index.ts',
        pattern: /(\/\/ PLOP-APPEND-ENTITIES)/g,
        template: "export * from './{{kebab model}}.entity';\n$1",
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/infrastructure/database/repositories/{{kebab model}}.repository.impl.ts',
        templateFile: 'plop-templates/infrastructure/repository-impl.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{feature}}/infrastructure/database/repositories/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/infrastructure/repository-impl-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{feature}}/infrastructure/database/repositories/index.ts',
        pattern: /(\/\/ PLOP-APPEND-REPOSITORIES)/g,
        template: "export * from './{{kebab model}}.repository.impl';\n$1",
      },

      {
        type: 'add',
        path: 'src/features/{{kebab feature}}/infrastructure/database/entities/{{kebab feature}}.entities.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/infrastructure/entities-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{kebab feature}}/infrastructure/database/entities/{{kebab feature}}.entities.ts',
        pattern: /(\/\/ PLOP-APPEND-IMPORTS)/g,
        template:
          "import { {{pascal model}}Entity } from './{{kebab model}}.entity';\n$1",
      },
      {
        type: 'modify',
        path: 'src/features/{{kebab feature}}/infrastructure/database/entities/{{kebab feature}}.entities.ts',
        pattern: /(\/\/ PLOP-APPEND-ARRAY)/g,
        template: '  {{pascal model}}Entity,\n  $1',
      },

      /**
       * =========================
       * PRESENTATION LAYER
       * =========================
       */

      {
        type: 'add',
        path: 'src/features/{{feature}}/presentation/controllers/{{kebab model}}/index.ts',
        skipIfExists: true,
        templateFile: 'plop-templates/presentation/controller-index.hbs',
      },
      {
        type: 'modify',
        path: 'src/features/{{feature}}/presentation/controllers/{{kebab model}}/index.ts',
        pattern: /(\/\/ PLOP-APPEND-CONTROLLERS)/g,
        template: "export * from './{{kebab model}}.controller';\n$1",
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/presentation/controllers/{{kebab model}}/{{kebab model}}.controller.ts',
        templateFile: 'plop-templates/presentation/controller.hbs',
      },

      {
        type: 'add',
        path: 'src/features/{{feature}}/presentation/dto/{{kebab model}}/index.ts',
        templateFile: 'plop-templates/presentation/dto-index.hbs',
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
