import API from '@brix/api';
import del from 'del';
import fs from 'fs-extra';
import { GraphQLArgument, GraphQLNamedType, GraphQLObjectType, GraphQLSchema, GraphQLUnionType } from 'graphql';
import path from 'path';

import { Field, FieldMap } from './testClient';


export type ArgDict = { [key: string]: GraphQLArgument };

/**
 * Generate all possible queries, mutations and subscriptions into .gql files
 * queries for a GraphQL schema.
 * @param dest Destination of the generated queries
 * @param depthLimit How deep to query for nested entity structures
 * @param includeDeprecatedFields Include fields that are deprecated in the queries
 */
export const generateQueries = async (
  dest: string = path.join(__dirname, '../queries'),
  depthLimit = 6,
  includeDeprecatedFields = false
) => {
  let schema: GraphQLSchema;

  /**
  * Compile arguments dictionary for a field
  * @param field current field object
  * @param duplicateArgCounts map for deduping argument name collisions
  * @param allArgsDict dictionary of all arguments
  */
  const getFieldArgsDict = (
    field: Field,
    duplicateArgCounts: { [key: string]: number },
    allArgsDict: ArgDict = {}
  ) => {
    return field.args.reduce((o, arg) => {
      if (arg.name in duplicateArgCounts) {
        const index = duplicateArgCounts[arg.name] + 1;
        duplicateArgCounts[arg.name] = index;
        o[`${arg.name}${index}`] = arg;

      } else if (allArgsDict[arg.name]) {
        duplicateArgCounts[arg.name] = 1;
        o[`${arg.name}1`] = arg;

      } else {
        o[arg.name] = arg;
      }
      return o;
    }, {} as ArgDict);
  };

  /**
  * Generate variables string
  * @param dict dictionary of arguments
  */
  const getArgsToVarsStr = (dict: ArgDict) => {
    return Object.entries(dict)
      .map(([varName, arg]) => `${arg.name}: $${varName}`)
      .join(', ');
  };

  /**
  * Generate types string
  * @param dict dictionary of arguments
  */
  const getVarsToTypesStr = (dict: ArgDict) => {
    return Object.entries(dict)
      .map(([varName, arg]) => `$${varName}: ${arg.type}`)
      .join(', ');
  };

  /**
  * Generate the query for the specified field
  * @param curName name of the current field
  * @param curParentType parent type of the current field
  * @param curParentName parent name of the current field
  * @param argumentsDict dictionary of arguments from all fields
  * @param duplicateArgCounts map for deduping argument name collisions
  * @param crossReferenceKeyList list of the cross reference
  * @param curDepth current depth of field
  */
  const generateQuery = (
    curName: string,
    curParentType: string,
    curParentName?: string,
    argumentsDict: ArgDict = {},
    duplicateArgCounts = {},
    crossReferenceKeyList: string[] = [], // [`${curParentName}To${curName}Key`]
    curDepth = 1
  ) => {

    const field = (schema.getType(curParentType) as GraphQLObjectType)
      .getFields()[curName];
    const curTypeName = field.type.inspect().replace(/[[\]!]/g, '');
    const curType = schema.getType(curTypeName) as GraphQLObjectType;
    let queryStr = '';
    let childQuery = '';


    if (curType.getFields) {
      const crossReferenceKey = `${curParentName}To${curName}Key`;
      if (curDepth > depthLimit) return { queryStr: '', argumentsDict };

      crossReferenceKeyList.push(crossReferenceKey);
      const childKeys = Object.keys(curType.getFields());

      childQuery = childKeys
        .filter(fieldName => {
          /* Exclude deprecated fields */
          const fieldSchema = (schema.getType(curType.toString()) as GraphQLObjectType)
            .getFields()[fieldName];
          return includeDeprecatedFields || !fieldSchema.isDeprecated;
        })
        .map(cur => generateQuery(
          cur,
          curType.toString(),
          curName,
          argumentsDict,
          duplicateArgCounts,
          crossReferenceKeyList,
          curDepth + 1
        ).queryStr)
        .filter(cur => cur)
        .join('\n');
    }


    if (!(curType.getFields && !childQuery)) {
      queryStr = `${'    '.repeat(curDepth)}${field.name}`;
      if (field.args.length > 0) {
        const dict = getFieldArgsDict(field, duplicateArgCounts, argumentsDict);
        Object.assign(argumentsDict, dict);
        queryStr += `(${getArgsToVarsStr(dict)})`;
      }
      if (childQuery) {
        queryStr += `{\n${childQuery}\n${'    '.repeat(curDepth)}}`;
      }
    }

    /* Union types */
    if (curType.astNode && (curType as GraphQLNamedType).astNode!.kind === 'UnionTypeDefinition') {
      const types = (curType as unknown as GraphQLUnionType).getTypes();
      if (types && types.length) {
        const indent = `${'    '.repeat(curDepth)}`;
        const fragIndent = `${'    '.repeat(curDepth + 1)}`;
        queryStr += '{\n';

        for (let i = 0, len = types.length; i < len; i++) {
          const valueTypeName = types[i];
          const valueType = schema.getType(valueTypeName.toString()) as GraphQLObjectType;
          const unionChildQuery = Object.keys(valueType!.getFields())
            .map(cur => generateQuery(
              cur,
              valueType.toString(),
              curName,
              argumentsDict,
              duplicateArgCounts,
              crossReferenceKeyList,
              curDepth + 2
            ).queryStr)
            .filter(cur => cur)
            .join('\n');

          queryStr += `${fragIndent}... on ${valueTypeName} {\n${unionChildQuery}\n${fragIndent}}\n`;

        }

        queryStr += `${indent}}`;

      }
    }


    return { queryStr, argumentsDict };
  };

  /**
  * Generate the query for the specified field
  * @param obj one of the root objects(Query, Mutation, Subscription)
  * @param description description of the current object
  */
  const generateFile = async (
    obj: FieldMap,
    description: 'Mutation' | 'Query' | 'Subscription'
  ) => {
    let indexJs = `const fs =  require('fs');\nconst path = require('path');\n\n`;
    let outputFolderName;

    switch (description) {
      case 'Mutation':
        outputFolderName = 'mutations';
        break;
      case 'Query':
        outputFolderName = 'queries';
        break;
      case 'Subscription':
        outputFolderName = 'subscriptions';
        break;
      default:
        console.log('[gqlg warning]:', 'description is required');
    }

    const writeFolder = path.join(dest, `./${outputFolderName}`);

    try {
      await fs.mkdirp(writeFolder);
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    await Promise.all(Object.keys(obj).map(async type => {
      const field = (schema.getType(description) as GraphQLObjectType).getFields()[type];
      /* Only process non-deprecated queries/mutations: */
      if (includeDeprecatedFields || !field.isDeprecated) {
        const queryResult = generateQuery(type, description);
        const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
        let query = queryResult.queryStr;
        query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
        await fs.writeFile(path.join(writeFolder, `./${type}.gql`), query);
        indexJs += `module.exports.${type} = fs.readFileSync(path.join(__dirname, '${type}.gql'), 'utf8');\n`;
      }
    }));

    await fs.writeFile(path.join(writeFolder, 'index.js'), indexJs);
    return `module.exports.${outputFolderName} = require('./${outputFolderName}');\n`;
  };


  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  await API.config.loadConfig(process.cwd());

  schema = await API.lib.schema.buildSchema();

  try {
    await del(dest);
    await fs.mkdirp(dest);
  } catch (e) { }


  let exportAll = '';
  const mutation = schema.getMutationType();
  const query = schema.getQueryType();
  const subscription = schema.getSubscriptionType();

  if (mutation) exportAll += await generateFile(mutation.getFields(), 'Mutation');
  if (query) exportAll += await generateFile(query.getFields(), 'Query');
  if (subscription) exportAll += await generateFile(subscription.getFields(), 'Subscription');


  await fs.writeFile(path.join(dest, 'index.js'), exportAll);
  await new Promise(res => setTimeout(res, 4000));
  return true;
};
