const {
  pascalCase,
  camelCase,
  constantCase,
  kebabCase,
  snakeCase,
} = require('change-case');
const pluralize = require('pluralize');
const fs = require('fs');
const path = require('path');

module.exports = function (plop) {
  // Helpers
  plop.setHelper('pascal', (txt) => pascalCase(txt));
  plop.setHelper('camel', (txt) => camelCase(txt));
  plop.setHelper('constant', (txt) => constantCase(txt));
  plop.setHelper('kebab', (txt) => kebabCase(txt));
  plop.setHelper('snake', (txt) => snakeCase(txt));
  plop.setHelper('plural', (text) => pluralize(text));

  // Custom action: modify only if uniqueMarker is not already in the file
  plop.setActionType('modifyUnique', (answers, config) => {
    const filePath = path.resolve(
      plop.getDestBasePath(),
      config.path
        .replace(/\{\{feature\}\}/g, answers.feature)
        .replace(/\{\{kebab feature\}\}/g, kebabCase(answers.feature)),
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(config.uniqueMarker)) {
      return `SKIPPED (already exists): ${config.uniqueMarker}`;
    }

    content = content.replace(config.pattern, config.template);
    fs.writeFileSync(filePath, content, 'utf8');

    return `Modified: ${filePath}`;
  });

  plop.setGenerator('ddd', {
    description: 'Generate full DDD model structure',
    prompts: [
      {
        type: 'input',
        name: 'feature',
        message: 'Feature name (e.g. user_management):',
      },
      {
        type: 'input',
        name: 'models',
        message: 'Model names, comma-separated (e.g. role, permission, user):',
      },
    ],

    actions(data) {
      const models = data.models
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      const actions = [];

      // ── Feature-level files (created once, skipped if exist) ──────────────

      actions.push(
        // Domain
        {
          type: 'add',
          path: 'src/features/{{feature}}/domain/constants/tokens.constants.ts',
          skipIfExists: true,
          template: `export const {{constant (snake feature)}}_TOKENS = {\n} as const;\n`,
        },
        {
          type: 'add',
          path: 'src/features/{{feature}}/domain/constants/database.constants.ts',
          skipIfExists: true,
          template: `export const {{constant (snake feature)}}_DATABASE_MODELS = {\n} as const;\n`,
        },
        {
          type: 'add',
          path: 'src/features/{{feature}}/domain/models/index.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/domain/models-index.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{feature}}/domain/constants/index.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/domain/constant-index.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{feature}}/domain/exceptions/index.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/domain/exception-index.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{feature}}/domain/repositories/index.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/domain/repository-interface-index.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{feature}}/domain/index.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/domain/index.hbs',
        },

        // Infrastructure
        {
          type: 'add',
          path: 'src/features/{{feature}}/infrastructure/database/entities/index.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/infrastructure/entity-index.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{feature}}/infrastructure/database/repositories/index.ts',
          skipIfExists: true,
          templateFile:
            'plop-templates/infrastructure/repository-impl-index.hbs',
        },
        {
          type: 'add',
          path: 'src/features/{{kebab feature}}/infrastructure/database/entities/{{kebab feature}}.entities.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/infrastructure/entities-index.hbs',
        },

        // Presentation
        {
          type: 'add',
          path: 'src/features/{{feature}}/presentation/controllers/index.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/presentation/controller-index.hbs',
        },

        // Module
        {
          type: 'add',
          path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
          skipIfExists: true,
          templateFile: 'plop-templates/module/feature.module.hbs',
        },
      );

      // ── Per-model actions ─────────────────────────────────────────────────

      for (const model of models) {
        const modelData = { ...data, model };
        const a = (action) => ({ ...action, data: modelData });

        actions.push(
          // ── Domain ────────────────────────────────────────────────────────

          // tokens.constants.ts
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/domain/constants/tokens.constants.ts',
            uniqueMarker: `${constantCase(model)}: '${pascalCase(model)}Repository'`,
            pattern: /(export const .*_TOKENS = \{[\s\S]*?)(\}\s+as const;)/,
            template: `$1  ${constantCase(model)}: '${pascalCase(model)}Repository',\n$2`,
          }),

          // database.constants.ts
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/domain/constants/database.constants.ts',
            uniqueMarker: `${constantCase(pluralize(model))}: '${kebabCase(pluralize(model))}'`,
            pattern:
              /(export const .*_DATABASE_MODELS = \{[\s\S]*?)(\}\s+as const;)/,
            template: `$1  ${constantCase(pluralize(model))}: '${snakeCase(pluralize(model))}',\n$2`,
          }),

          // model file
          a({
            type: 'add',
            path: `src/features/{{feature}}/domain/models/${kebabCase(model)}.model.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/domain/model.hbs',
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/domain/models/index.ts',
            uniqueMarker: `from './${kebabCase(model)}.model'`,
            pattern: /(\/\/ PLOP-APPEND-MODELS)/g,
            template: `export * from './${kebabCase(model)}.model';\n$1`,
          }),

          // constant file
          a({
            type: 'add',
            path: `src/features/{{feature}}/domain/constants/${kebabCase(model)}.constants.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/domain/constant.hbs',
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/domain/constants/index.ts',
            uniqueMarker: `from './${kebabCase(model)}.constants'`,
            pattern: /(\/\/ PLOP-APPEND-CONSTANTS)/g,
            template: `export * from './${kebabCase(model)}.constants';\n$1`,
          }),

          // exception file
          a({
            type: 'add',
            path: `src/features/{{feature}}/domain/exceptions/${kebabCase(model)}.exception.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/domain/exception.hbs',
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/domain/exceptions/index.ts',
            uniqueMarker: `from './${kebabCase(model)}.exception'`,
            pattern: /(\/\/ PLOP-APPEND-EXCEPTIONS)/g,
            template: `export * from './${kebabCase(model)}.exception';\n$1`,
          }),

          // repository interface
          a({
            type: 'add',
            path: `src/features/{{feature}}/domain/repositories/${kebabCase(model)}.repository.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/domain/repository-interface.hbs',
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/domain/repositories/index.ts',
            uniqueMarker: `from './${kebabCase(model)}.repository'`,
            pattern: /(\/\/ PLOP-APPEND-REPOSITORIES)/g,
            template: `export * from './${kebabCase(model)}.repository';\n$1`,
          }),

          // ── Application ───────────────────────────────────────────────────

          // commands
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/commands/${kebabCase(model)}/index.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/command-index.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/commands/${kebabCase(model)}/create-${kebabCase(model)}.command.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/create-command.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/commands/${kebabCase(model)}/update-${kebabCase(model)}.command.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/update-command.hbs',
          }),

          // use cases
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/use-cases/${kebabCase(model)}/index.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/use-case-index.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/use-cases/${kebabCase(model)}/create.use-case.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/create-use-case.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/use-cases/${kebabCase(model)}/update.use-case.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/update-use-case.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/use-cases/${kebabCase(model)}/archive.use-case.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/archive-use-case.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/use-cases/${kebabCase(model)}/restore.use-case.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/restore-use-case.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/use-cases/${kebabCase(model)}/get-paginated.use-case.ts`,
            skipIfExists: true,
            templateFile:
              'plop-templates/application/get-paginated-use-case.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/application/use-cases/${kebabCase(model)}/combobox.use-case.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/application/combobox-use-case.hbs',
          }),

          // ── Infrastructure ────────────────────────────────────────────────

          // entity
          a({
            type: 'add',
            path: `src/features/{{feature}}/infrastructure/database/entities/${kebabCase(model)}.entity.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/infrastructure/entity.hbs',
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/infrastructure/database/entities/index.ts',
            uniqueMarker: `from './${kebabCase(model)}.entity'`,
            pattern: /(\/\/ PLOP-APPEND-ENTITIES)/g,
            template: `export * from './${kebabCase(model)}.entity';\n$1`,
          }),

          // repository impl
          a({
            type: 'add',
            path: `src/features/{{feature}}/infrastructure/database/repositories/${kebabCase(model)}.repository.impl.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/infrastructure/repository-impl.hbs',
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/infrastructure/database/repositories/index.ts',
            uniqueMarker: `from './${kebabCase(model)}.repository.impl'`,
            pattern: /(\/\/ PLOP-APPEND-REPOSITORIES)/g,
            template: `export * from './${kebabCase(model)}.repository.impl';\n$1`,
          }),

          // feature entities barrel
          a({
            type: 'modifyUnique',
            path: `src/features/${kebabCase(data.feature)}/infrastructure/database/entities/${kebabCase(data.feature)}.entities.ts`,
            uniqueMarker: `{ ${pascalCase(model)}Entity }`,
            pattern: /(\/\/ PLOP-APPEND-IMPORTS)/g,
            template: `import { ${pascalCase(model)}Entity } from './${kebabCase(model)}.entity';\n$1`,
          }),
          a({
            type: 'modifyUnique',
            path: `src/features/${kebabCase(data.feature)}/infrastructure/database/entities/${kebabCase(data.feature)}.entities.ts`,
            uniqueMarker: `${pascalCase(model)}Entity,`,
            pattern: /(\/\/ PLOP-APPEND-ARRAY)/g,
            template: `  ${pascalCase(model)}Entity,\n  $1`,
          }),

          // ── Presentation ──────────────────────────────────────────────────

          // controller
          a({
            type: 'add',
            path: `src/features/{{feature}}/presentation/controllers/${kebabCase(model)}.controller.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/presentation/controller.hbs',
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/presentation/controllers/index.ts',
            uniqueMarker: `from './${kebabCase(model)}.controller'`,
            pattern: /(\/\/ PLOP-APPEND-CONTROLLERS)/g,
            template: `export * from './${kebabCase(model)}.controller';\n$1`,
          }),

          // DTOs
          a({
            type: 'add',
            path: `src/features/{{feature}}/presentation/dto/${kebabCase(model)}/index.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/presentation/dto-index.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/presentation/dto/${kebabCase(model)}/create-${kebabCase(model)}.dto.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/presentation/create-dto.hbs',
          }),
          a({
            type: 'add',
            path: `src/features/{{feature}}/presentation/dto/${kebabCase(model)}/update-${kebabCase(model)}.dto.ts`,
            skipIfExists: true,
            templateFile: 'plop-templates/presentation/update-dto.hbs',
          }),

          // ── Module ────────────────────────────────────────────────────────

          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
            uniqueMarker: `* as ${pascalCase(model)}UseCases from './application/use-cases/${kebabCase(model)}'`,
            pattern: /(\/\/ PLOP-IMPORT-USECASES)/g,
            template: `import * as ${pascalCase(model)}UseCases from './application/use-cases/${kebabCase(model)}';\n$1`,
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
            uniqueMarker: `${camelCase(model)}UseCaseList`,
            pattern: /(\/\/ PLOP-DECLARE-USECASE-LISTS)/g,
            template: `
      const ${camelCase(model)}UseCaseList = [
        ${pascalCase(model)}UseCases.Create${pascalCase(model)}UseCase,
        ${pascalCase(model)}UseCases.Update${pascalCase(model)}UseCase,
        ${pascalCase(model)}UseCases.Archive${pascalCase(model)}UseCase,
        ${pascalCase(model)}UseCases.Restore${pascalCase(model)}UseCase,
        ${pascalCase(model)}UseCases.GetPaginated${pascalCase(model)}UseCase,
        ${pascalCase(model)}UseCases.Combobox${pascalCase(model)}UseCase,
      ];
      
      $1`,
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
            uniqueMarker: `${pascalCase(data.feature)}Controllers.${pascalCase(model)}Controller`,
            pattern: /(\/\/ PLOP-CONTROLLERS)/g,
            template: `${pascalCase(data.feature)}Controllers.${pascalCase(model)}Controller,\n$1`,
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
            uniqueMarker: `${constantCase(snakeCase(data.feature))}_TOKENS.${constantCase(model)},`,
            pattern: /(\/\/ PLOP-PROVIDERS)/g,
            template: `
          {
            provide: ${constantCase(snakeCase(data.feature))}_TOKENS.${constantCase(model)},
            useClass: ${pascalCase(data.feature)}Repositories.${pascalCase(model)}RepositoryImpl,
          },
          $1`,
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
            uniqueMarker: `...${camelCase(model)}UseCaseList, // providers`,
            pattern: /(\/\/ PLOP-USECASE-SPREAD)/g,
            template: `...${camelCase(model)}UseCaseList, // providers\n$1`,
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
            uniqueMarker: `${constantCase(snakeCase(data.feature))}_TOKENS.${constantCase(model)}, // exports`,
            pattern: /(\/\/ PLOP-EXPORTS)/g,
            template: `${constantCase(snakeCase(data.feature))}_TOKENS.${constantCase(model)}, // exports\n    $1`,
          }),
          a({
            type: 'modifyUnique',
            path: 'src/features/{{feature}}/{{kebab feature}}.module.ts',
            uniqueMarker: `...${camelCase(model)}UseCaseList, // export-spread`,
            pattern: /(\/\/ PLOP-EXPORT-USECASE-SPREAD)/g,
            template: `...${camelCase(model)}UseCaseList, // export-spread\n$1`,
          }),
        );
      }

      return actions;
    },
  });
};
