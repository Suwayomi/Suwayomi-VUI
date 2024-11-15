/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * You may import it to create a `graphql()` tag function with `gql.tada`
 * by importing it and passing it to `initGraphQLTada<>()`.
 *
 * @example
 * ```
 * import { initGraphQLTada } from 'gql.tada';
 * import type { introspection } from './introspection';
 *
 * export const graphql = initGraphQLTada<{
 *   introspection: typeof introspection;
 *   scalars: {
 *     DateTime: string;
 *     Json: any;
 *   };
 * }>();
 * ```
 */
const introspection = {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": {
      "name": "Mutation"
    },
    "subscriptionType": {
      "name": "Subscription"
    },
    "types": [
      {
        "kind": "OBJECT",
        "name": "AboutServerPayload",
        "fields": [
          {
            "name": "buildTime",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "buildType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "discord",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "github",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "revision",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "version",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "AboutWebUI",
        "fields": [
          {
            "name": "channel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tag",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "BackupRestoreState",
        "enumValues": [
          {
            "name": "IDLE",
            "isDeprecated": false
          },
          {
            "name": "SUCCESS",
            "isDeprecated": false
          },
          {
            "name": "FAILURE",
            "isDeprecated": false
          },
          {
            "name": "RESTORING_CATEGORIES",
            "isDeprecated": false
          },
          {
            "name": "RESTORING_MANGA",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "BackupRestoreStatus",
        "fields": [
          {
            "name": "mangaProgress",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "BackupRestoreState"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalManga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "BindTrackInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "remoteId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            }
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "BindTrackPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackRecord",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackRecordType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Boolean"
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "BooleanFilterInput",
        "inputFields": [
          {
            "name": "distinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "distinctFromAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean"
                }
              }
            }
          },
          {
            "name": "distinctFromAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean"
                }
              }
            }
          },
          {
            "name": "equalTo",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "greaterThan",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "greaterThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "in",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean"
                }
              }
            }
          },
          {
            "name": "isNull",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThan",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "notDistinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "notEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "notEqualToAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean"
                }
              }
            }
          },
          {
            "name": "notEqualToAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean"
                }
              }
            }
          },
          {
            "name": "notIn",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Boolean"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CategoryConditionInput",
        "inputFields": [
          {
            "name": "default",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "order",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "CategoryEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CategoryFilterInput",
        "inputFields": [
          {
            "name": "and",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "CategoryFilterInput"
                }
              }
            }
          },
          {
            "name": "default",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "not",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "CategoryFilterInput"
            }
          },
          {
            "name": "or",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "CategoryFilterInput"
                }
              }
            }
          },
          {
            "name": "order",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "CategoryMetaType",
        "fields": [
          {
            "name": "category",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "categoryId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "MetaType"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CategoryMetaTypeInput",
        "inputFields": [
          {
            "name": "categoryId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "CategoryNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "CategoryEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "CategoryType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "CategoryOrderBy",
        "enumValues": [
          {
            "name": "ID",
            "isDeprecated": false
          },
          {
            "name": "NAME",
            "isDeprecated": false
          },
          {
            "name": "ORDER",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CategoryOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "CategoryOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "CategoryType",
        "fields": [
          {
            "name": "default",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "includeInDownload",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "IncludeOrExclude"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "includeInUpdate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "IncludeOrExclude"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "CategoryMetaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "order",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ChapterConditionInput",
        "inputFields": [
          {
            "name": "chapterNumber",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "fetchedAt",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "isBookmarked",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "isDownloaded",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "isRead",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lastPageRead",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "lastReadAt",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "pageCount",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "realUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "scanlator",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "sourceOrder",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "uploadDate",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "url",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ChapterEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ChapterFilterInput",
        "inputFields": [
          {
            "name": "and",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "ChapterFilterInput"
                }
              }
            }
          },
          {
            "name": "chapterNumber",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "FloatFilterInput"
            }
          },
          {
            "name": "fetchedAt",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "inLibrary",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "isBookmarked",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "isDownloaded",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "isRead",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "lastPageRead",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "lastReadAt",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "not",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "ChapterFilterInput"
            }
          },
          {
            "name": "or",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "ChapterFilterInput"
                }
              }
            }
          },
          {
            "name": "pageCount",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "realUrl",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "scanlator",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "sourceOrder",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "uploadDate",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "url",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ChapterMetaType",
        "fields": [
          {
            "name": "chapter",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "chapterId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "MetaType"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ChapterMetaTypeInput",
        "inputFields": [
          {
            "name": "chapterId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ChapterNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ChapterEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ChapterType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "ChapterOrderBy",
        "enumValues": [
          {
            "name": "ID",
            "isDeprecated": false
          },
          {
            "name": "SOURCE_ORDER",
            "isDeprecated": false
          },
          {
            "name": "NAME",
            "isDeprecated": false
          },
          {
            "name": "UPLOAD_DATE",
            "isDeprecated": false
          },
          {
            "name": "CHAPTER_NUMBER",
            "isDeprecated": false
          },
          {
            "name": "LAST_READ_AT",
            "isDeprecated": false
          },
          {
            "name": "FETCHED_AT",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ChapterOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ChapterOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ChapterType",
        "fields": [
          {
            "name": "chapterNumber",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Float"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "fetchedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isBookmarked",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isDownloaded",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isRead",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lastPageRead",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lastReadAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ChapterMetaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "realUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "scanlator",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "sourceOrder",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "uploadDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "url",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CheckBoxFilter",
        "fields": [
          {
            "name": "default",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CheckBoxPreference",
        "fields": [
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "default",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "summary",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "visible",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CheckForServerUpdatesPayload",
        "fields": [
          {
            "name": "channel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tag",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "url",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ClearCachedImagesInput",
        "inputFields": [
          {
            "name": "cachedPages",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "cachedThumbnails",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "downloadedThumbnails",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ClearCachedImagesPayload",
        "fields": [
          {
            "name": "cachedPages",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "cachedThumbnails",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadedThumbnails",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ClearDownloaderInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ClearDownloaderPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateBackupInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "includeCategories",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "includeChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "CreateBackupPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "url",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "CreateCategoryInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "default",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "includeInDownload",
            "type": {
              "kind": "ENUM",
              "name": "IncludeOrExclude"
            }
          },
          {
            "name": "includeInUpdate",
            "type": {
              "kind": "ENUM",
              "name": "IncludeOrExclude"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "order",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "CreateCategoryPayload",
        "fields": [
          {
            "name": "category",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Cursor"
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteCategoryInput",
        "inputFields": [
          {
            "name": "categoryId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteCategoryMetaInput",
        "inputFields": [
          {
            "name": "categoryId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DeleteCategoryMetaPayload",
        "fields": [
          {
            "name": "category",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "OBJECT",
              "name": "CategoryMetaType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DeleteCategoryPayload",
        "fields": [
          {
            "name": "category",
            "type": {
              "kind": "OBJECT",
              "name": "CategoryType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MangaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteChapterMetaInput",
        "inputFields": [
          {
            "name": "chapterId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DeleteChapterMetaPayload",
        "fields": [
          {
            "name": "chapter",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "OBJECT",
              "name": "ChapterMetaType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteDownloadedChapterInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DeleteDownloadedChapterPayload",
        "fields": [
          {
            "name": "chapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteDownloadedChaptersInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DeleteDownloadedChaptersPayload",
        "fields": [
          {
            "name": "chapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ChapterType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteGlobalMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DeleteGlobalMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "OBJECT",
              "name": "GlobalMetaType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteMangaMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DeleteMangaMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "OBJECT",
              "name": "MangaMetaType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DeleteSourceMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "sourceId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DeleteSourceMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "OBJECT",
              "name": "SourceMetaType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "source",
            "type": {
              "kind": "OBJECT",
              "name": "SourceType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DequeueChapterDownloadInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DequeueChapterDownloadPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DequeueChapterDownloadsInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DequeueChapterDownloadsPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DoubleFilterInput",
        "inputFields": [
          {
            "name": "distinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "distinctFromAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "distinctFromAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "equalTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "greaterThan",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "greaterThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "in",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "isNull",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThan",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "lessThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "notDistinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "notEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "notEqualToAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "notEqualToAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "notIn",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "DownloadChangedInput",
        "inputFields": [
          {
            "name": "maxUpdates",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "DownloadEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "DownloadNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "DownloadEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "DownloadType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "DownloadState",
        "enumValues": [
          {
            "name": "QUEUED",
            "isDeprecated": false
          },
          {
            "name": "DOWNLOADING",
            "isDeprecated": false
          },
          {
            "name": "FINISHED",
            "isDeprecated": false
          },
          {
            "name": "ERROR",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "DownloadStatus",
        "fields": [
          {
            "name": "queue",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "DownloadType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "DownloaderState"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DownloadType",
        "fields": [
          {
            "name": "chapter",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "position",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "progress",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Float"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "DownloadState"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tries",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "DownloadUpdate",
        "fields": [
          {
            "name": "download",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "DownloadUpdateType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "DownloadUpdateType",
        "enumValues": [
          {
            "name": "QUEUED",
            "isDeprecated": false
          },
          {
            "name": "DEQUEUED",
            "isDeprecated": false
          },
          {
            "name": "PROGRESS",
            "isDeprecated": false
          },
          {
            "name": "FINISHED",
            "isDeprecated": false
          },
          {
            "name": "ERROR",
            "isDeprecated": false
          },
          {
            "name": "POSITION",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "DownloadUpdates",
        "fields": [
          {
            "name": "initial",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "DownloadType"
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "omittedUpdates",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "DownloaderState"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updates",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "DownloadUpdate"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "DownloaderState",
        "enumValues": [
          {
            "name": "STARTED",
            "isDeprecated": false
          },
          {
            "name": "STOPPED",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INTERFACE",
        "name": "Edge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "UNION",
                "name": "Node"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [],
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "CategoryEdge"
          },
          {
            "kind": "OBJECT",
            "name": "ChapterEdge"
          },
          {
            "kind": "OBJECT",
            "name": "DownloadEdge"
          },
          {
            "kind": "OBJECT",
            "name": "ExtensionEdge"
          },
          {
            "kind": "OBJECT",
            "name": "MangaEdge"
          },
          {
            "kind": "OBJECT",
            "name": "MetaEdge"
          },
          {
            "kind": "OBJECT",
            "name": "SourceEdge"
          },
          {
            "kind": "OBJECT",
            "name": "TrackRecordEdge"
          },
          {
            "kind": "OBJECT",
            "name": "TrackerEdge"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "EditTextPreference",
        "fields": [
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "default",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "dialogMessage",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "dialogTitle",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "summary",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "text",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "visible",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "EnqueueChapterDownloadInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "EnqueueChapterDownloadPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "EnqueueChapterDownloadsInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "EnqueueChapterDownloadsPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ExtensionConditionInput",
        "inputFields": [
          {
            "name": "apkName",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "hasUpdate",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "iconUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "isInstalled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "isNsfw",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "isObsolete",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lang",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "pkgName",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "repo",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "versionCode",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "versionName",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ExtensionEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExtensionType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ExtensionFilterInput",
        "inputFields": [
          {
            "name": "and",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "ExtensionFilterInput"
                }
              }
            }
          },
          {
            "name": "apkName",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "hasUpdate",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "iconUrl",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "isInstalled",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "isNsfw",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "isObsolete",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "lang",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "not",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "ExtensionFilterInput"
            }
          },
          {
            "name": "or",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "ExtensionFilterInput"
                }
              }
            }
          },
          {
            "name": "pkgName",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "repo",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "versionCode",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "versionName",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ExtensionNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ExtensionEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ExtensionType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "ExtensionOrderBy",
        "enumValues": [
          {
            "name": "PKG_NAME",
            "isDeprecated": false
          },
          {
            "name": "NAME",
            "isDeprecated": false
          },
          {
            "name": "APK_NAME",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ExtensionOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "ExtensionOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ExtensionType",
        "fields": [
          {
            "name": "apkName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "hasUpdate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "iconUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isInstalled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isNsfw",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isObsolete",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lang",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pkgName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "repo",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "source",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SourceNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "versionCode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "versionName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FetchChapterPagesInput",
        "inputFields": [
          {
            "name": "chapterId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "FetchChapterPagesPayload",
        "fields": [
          {
            "name": "chapter",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pages",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FetchChaptersInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "FetchChaptersPayload",
        "fields": [
          {
            "name": "chapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ChapterType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FetchExtensionsInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "FetchExtensionsPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extensions",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ExtensionType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FetchMangaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "FetchMangaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FetchSourceMangaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "filters",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "FilterChangeInput"
                }
              }
            }
          },
          {
            "name": "page",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "query",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "source",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            }
          },
          {
            "name": "type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "FetchSourceMangaType"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "FetchSourceMangaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "hasNextPage",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MangaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "FetchSourceMangaType",
        "enumValues": [
          {
            "name": "SEARCH",
            "isDeprecated": false
          },
          {
            "name": "POPULAR",
            "isDeprecated": false
          },
          {
            "name": "LATEST",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FetchTrackInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "recordId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "FetchTrackPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackRecord",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackRecordType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "UNION",
        "name": "Filter",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "CheckBoxFilter"
          },
          {
            "kind": "OBJECT",
            "name": "GroupFilter"
          },
          {
            "kind": "OBJECT",
            "name": "HeaderFilter"
          },
          {
            "kind": "OBJECT",
            "name": "SelectFilter"
          },
          {
            "kind": "OBJECT",
            "name": "SeparatorFilter"
          },
          {
            "kind": "OBJECT",
            "name": "SortFilter"
          },
          {
            "kind": "OBJECT",
            "name": "TextFilter"
          },
          {
            "kind": "OBJECT",
            "name": "TriStateFilter"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FilterChangeInput",
        "inputFields": [
          {
            "name": "checkBoxState",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "groupChange",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "FilterChangeInput"
            }
          },
          {
            "name": "position",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "selectState",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "sortState",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "SortSelectionInput"
            }
          },
          {
            "name": "textState",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "triState",
            "type": {
              "kind": "ENUM",
              "name": "TriState"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "SCALAR",
        "name": "Float"
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "FloatFilterInput",
        "inputFields": [
          {
            "name": "distinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "distinctFromAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "distinctFromAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "equalTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "greaterThan",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "greaterThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "in",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "isNull",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThan",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "lessThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "notDistinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "notEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "notEqualToAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "notEqualToAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          },
          {
            "name": "notIn",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Float"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "GlobalMetaNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MetaEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "GlobalMetaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "GlobalMetaType",
        "fields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "MetaType"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "GlobalMetaTypeInput",
        "inputFields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "GroupFilter",
        "fields": [
          {
            "name": "filters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "UNION",
                    "name": "Filter"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "HeaderFilter",
        "fields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "IncludeOrExclude",
        "enumValues": [
          {
            "name": "EXCLUDE",
            "isDeprecated": false
          },
          {
            "name": "INCLUDE",
            "isDeprecated": false
          },
          {
            "name": "UNSET",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "InstallExternalExtensionInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "extensionFile",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Upload"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "InstallExternalExtensionPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extension",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExtensionType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Int"
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "IntFilterInput",
        "inputFields": [
          {
            "name": "distinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "distinctFromAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          },
          {
            "name": "distinctFromAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          },
          {
            "name": "equalTo",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "greaterThan",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "greaterThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "in",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          },
          {
            "name": "isNull",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThan",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "lessThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "notDistinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "notEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "notEqualToAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          },
          {
            "name": "notEqualToAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          },
          {
            "name": "notIn",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "LastUpdateTimestampPayload",
        "fields": [
          {
            "name": "timestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ListPreference",
        "fields": [
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "default",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "entries",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "entryValues",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "summary",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "visible",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "LoginTrackerCredentialsInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "password",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "username",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "LoginTrackerCredentialsPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isLoggedIn",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "LoginTrackerOAuthInput",
        "inputFields": [
          {
            "name": "callbackUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "LoginTrackerOAuthPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isLoggedIn",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "LogoutTrackerInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "LogoutTrackerPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isLoggedIn",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "LongFilterInput",
        "inputFields": [
          {
            "name": "distinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "distinctFromAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "LongString"
                }
              }
            }
          },
          {
            "name": "distinctFromAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "LongString"
                }
              }
            }
          },
          {
            "name": "equalTo",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "greaterThan",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "greaterThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "in",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "LongString"
                }
              }
            }
          },
          {
            "name": "isNull",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThan",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "lessThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "notDistinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "notEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "notEqualToAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "LongString"
                }
              }
            }
          },
          {
            "name": "notEqualToAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "LongString"
                }
              }
            }
          },
          {
            "name": "notIn",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "LongString"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "SCALAR",
        "name": "LongString"
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MangaConditionInput",
        "inputFields": [
          {
            "name": "artist",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "author",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "categoryIds",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          },
          {
            "name": "chaptersLastFetchedAt",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "description",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "genre",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "inLibrary",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "inLibraryAt",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "initialized",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lastFetchedAt",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "realUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "sourceId",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "status",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "thumbnailUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "title",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "url",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "MangaEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MangaFilterInput",
        "inputFields": [
          {
            "name": "and",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "MangaFilterInput"
                }
              }
            }
          },
          {
            "name": "artist",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "author",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "categoryId",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "chaptersLastFetchedAt",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "description",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "genre",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "inLibrary",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "inLibraryAt",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "initialized",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "lastFetchedAt",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "not",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "MangaFilterInput"
            }
          },
          {
            "name": "or",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "MangaFilterInput"
                }
              }
            }
          },
          {
            "name": "realUrl",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "sourceId",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "status",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "MangaStatusFilterInput"
            }
          },
          {
            "name": "thumbnailUrl",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "title",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "url",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "MangaMetaType",
        "fields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "MetaType"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MangaMetaTypeInput",
        "inputFields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "MangaNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MangaEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MangaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "MangaOrderBy",
        "enumValues": [
          {
            "name": "ID",
            "isDeprecated": false
          },
          {
            "name": "TITLE",
            "isDeprecated": false
          },
          {
            "name": "IN_LIBRARY_AT",
            "isDeprecated": false
          },
          {
            "name": "LAST_FETCHED_AT",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MangaOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "MangaOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "ENUM",
        "name": "MangaStatus",
        "enumValues": [
          {
            "name": "UNKNOWN",
            "isDeprecated": false
          },
          {
            "name": "ONGOING",
            "isDeprecated": false
          },
          {
            "name": "COMPLETED",
            "isDeprecated": false
          },
          {
            "name": "LICENSED",
            "isDeprecated": false
          },
          {
            "name": "PUBLISHING_FINISHED",
            "isDeprecated": false
          },
          {
            "name": "CANCELLED",
            "isDeprecated": false
          },
          {
            "name": "ON_HIATUS",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MangaStatusFilterInput",
        "inputFields": [
          {
            "name": "distinctFrom",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "distinctFromAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "ENUM",
                  "name": "MangaStatus"
                }
              }
            }
          },
          {
            "name": "distinctFromAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "ENUM",
                  "name": "MangaStatus"
                }
              }
            }
          },
          {
            "name": "equalTo",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "greaterThan",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "greaterThanOrEqualTo",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "in",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "ENUM",
                  "name": "MangaStatus"
                }
              }
            }
          },
          {
            "name": "isNull",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThan",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "lessThanOrEqualTo",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "notDistinctFrom",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "notEqualTo",
            "type": {
              "kind": "ENUM",
              "name": "MangaStatus"
            }
          },
          {
            "name": "notEqualToAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "ENUM",
                  "name": "MangaStatus"
                }
              }
            }
          },
          {
            "name": "notEqualToAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "ENUM",
                  "name": "MangaStatus"
                }
              }
            }
          },
          {
            "name": "notIn",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "ENUM",
                  "name": "MangaStatus"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "MangaType",
        "fields": [
          {
            "name": "age",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "artist",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "author",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "bookmarkCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "categories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "chapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "chaptersAge",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "chaptersLastFetchedAt",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "description",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "firstUnreadChapter",
            "type": {
              "kind": "OBJECT",
              "name": "ChapterType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "genre",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "hasDuplicateChapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "inLibrary",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "inLibraryAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "initialized",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lastFetchedAt",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lastReadChapter",
            "type": {
              "kind": "OBJECT",
              "name": "ChapterType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "latestFetchedChapter",
            "type": {
              "kind": "OBJECT",
              "name": "ChapterType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "latestReadChapter",
            "type": {
              "kind": "OBJECT",
              "name": "ChapterType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "latestUploadedChapter",
            "type": {
              "kind": "OBJECT",
              "name": "ChapterType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MangaMetaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "realUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "source",
            "type": {
              "kind": "OBJECT",
              "name": "SourceType"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "sourceId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "MangaStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "thumbnailUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "thumbnailUrlLastFetched",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackRecords",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackRecordNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "unreadCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateStrategy",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "UpdateStrategy"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "url",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MetaConditionInput",
        "inputFields": [
          {
            "name": "key",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "value",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "MetaEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "GlobalMetaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MetaFilterInput",
        "inputFields": [
          {
            "name": "and",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "MetaFilterInput"
                }
              }
            }
          },
          {
            "name": "key",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "not",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "MetaFilterInput"
            }
          },
          {
            "name": "or",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "MetaFilterInput"
                }
              }
            }
          },
          {
            "name": "value",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "ENUM",
        "name": "MetaOrderBy",
        "enumValues": [
          {
            "name": "KEY",
            "isDeprecated": false
          },
          {
            "name": "VALUE",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "MetaOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "MetaOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INTERFACE",
        "name": "MetaType",
        "fields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [],
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "CategoryMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "ChapterMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "GlobalMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "MangaMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "SourceMetaType"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "MultiSelectListPreference",
        "fields": [
          {
            "name": "currentValue",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "default",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "dialogMessage",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "dialogTitle",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "entries",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "entryValues",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "summary",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "visible",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Mutation",
        "fields": [
          {
            "name": "bindTrack",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "BindTrackPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "BindTrackInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "clearCachedImages",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ClearCachedImagesPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "ClearCachedImagesInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "clearDownloader",
            "type": {
              "kind": "OBJECT",
              "name": "ClearDownloaderPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "ClearDownloaderInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "createBackup",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CreateBackupPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "CreateBackupInput"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "createCategory",
            "type": {
              "kind": "OBJECT",
              "name": "CreateCategoryPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "CreateCategoryInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteCategory",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteCategoryPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteCategoryInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteCategoryMeta",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteCategoryMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteCategoryMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteChapterMeta",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteChapterMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteChapterMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteDownloadedChapter",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteDownloadedChapterPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteDownloadedChapterInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteDownloadedChapters",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteDownloadedChaptersPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteDownloadedChaptersInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteGlobalMeta",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteGlobalMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteGlobalMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteMangaMeta",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteMangaMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteMangaMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "deleteSourceMeta",
            "type": {
              "kind": "OBJECT",
              "name": "DeleteSourceMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DeleteSourceMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "dequeueChapterDownload",
            "type": {
              "kind": "OBJECT",
              "name": "DequeueChapterDownloadPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DequeueChapterDownloadInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "dequeueChapterDownloads",
            "type": {
              "kind": "OBJECT",
              "name": "DequeueChapterDownloadsPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DequeueChapterDownloadsInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "enqueueChapterDownload",
            "type": {
              "kind": "OBJECT",
              "name": "EnqueueChapterDownloadPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "EnqueueChapterDownloadInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "enqueueChapterDownloads",
            "type": {
              "kind": "OBJECT",
              "name": "EnqueueChapterDownloadsPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "EnqueueChapterDownloadsInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "fetchChapterPages",
            "type": {
              "kind": "OBJECT",
              "name": "FetchChapterPagesPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "FetchChapterPagesInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "fetchChapters",
            "type": {
              "kind": "OBJECT",
              "name": "FetchChaptersPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "FetchChaptersInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "fetchExtensions",
            "type": {
              "kind": "OBJECT",
              "name": "FetchExtensionsPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "FetchExtensionsInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "fetchManga",
            "type": {
              "kind": "OBJECT",
              "name": "FetchMangaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "FetchMangaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "fetchSourceManga",
            "type": {
              "kind": "OBJECT",
              "name": "FetchSourceMangaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "FetchSourceMangaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "fetchTrack",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "FetchTrackPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "FetchTrackInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "installExternalExtension",
            "type": {
              "kind": "OBJECT",
              "name": "InstallExternalExtensionPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "InstallExternalExtensionInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "loginTrackerCredentials",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "LoginTrackerCredentialsPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "LoginTrackerCredentialsInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "loginTrackerOAuth",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "LoginTrackerOAuthPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "LoginTrackerOAuthInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "logoutTracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "LogoutTrackerPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "LogoutTrackerInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "reorderChapterDownload",
            "type": {
              "kind": "OBJECT",
              "name": "ReorderChapterDownloadPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "ReorderChapterDownloadInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "resetSettings",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ResetSettingsPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "ResetSettingsInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "resetWebUIUpdateStatus",
            "type": {
              "kind": "OBJECT",
              "name": "WebUIUpdateStatus"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "restoreBackup",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "RestoreBackupPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "RestoreBackupInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "setCategoryMeta",
            "type": {
              "kind": "OBJECT",
              "name": "SetCategoryMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "SetCategoryMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "setChapterMeta",
            "type": {
              "kind": "OBJECT",
              "name": "SetChapterMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "SetChapterMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "setGlobalMeta",
            "type": {
              "kind": "OBJECT",
              "name": "SetGlobalMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "SetGlobalMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "setMangaMeta",
            "type": {
              "kind": "OBJECT",
              "name": "SetMangaMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "SetMangaMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "setSettings",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SetSettingsPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "SetSettingsInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "setSourceMeta",
            "type": {
              "kind": "OBJECT",
              "name": "SetSourceMetaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "SetSourceMetaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "startDownloader",
            "type": {
              "kind": "OBJECT",
              "name": "StartDownloaderPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "StartDownloaderInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "stopDownloader",
            "type": {
              "kind": "OBJECT",
              "name": "StopDownloaderPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "StopDownloaderInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "trackProgress",
            "type": {
              "kind": "OBJECT",
              "name": "TrackProgressPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "TrackProgressInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "unbindTrack",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UnbindTrackPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UnbindTrackInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateCategories",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateCategoriesPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateCategoriesInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateCategory",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateCategoryPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateCategoryInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateCategoryManga",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateCategoryMangaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateCategoryMangaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateCategoryOrder",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateCategoryOrderPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateCategoryOrderInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateChapter",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateChapterPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateChapterInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateChapters",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateChaptersPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateChaptersInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateExtension",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateExtensionPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateExtensionInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateExtensions",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateExtensionsPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateExtensionsInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateLibraryManga",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateLibraryMangaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateLibraryMangaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateManga",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateMangaPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateMangaInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateMangaCategories",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateMangaCategoriesPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateMangaCategoriesInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateMangas",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateMangasPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateMangasInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateMangasCategories",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateMangasCategoriesPayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateMangasCategoriesInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateSourcePreference",
            "type": {
              "kind": "OBJECT",
              "name": "UpdateSourcePreferencePayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateSourcePreferenceInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateStop",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStopPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateStopInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateTrack",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateTrackPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "UpdateTrackInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateWebUI",
            "type": {
              "kind": "OBJECT",
              "name": "WebUIUpdatePayload"
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "WebUIUpdateInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "UNION",
        "name": "Node",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "CategoryMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "CategoryType"
          },
          {
            "kind": "OBJECT",
            "name": "ChapterMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "ChapterType"
          },
          {
            "kind": "OBJECT",
            "name": "DownloadType"
          },
          {
            "kind": "OBJECT",
            "name": "DownloadUpdate"
          },
          {
            "kind": "OBJECT",
            "name": "ExtensionType"
          },
          {
            "kind": "OBJECT",
            "name": "GlobalMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "MangaMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "MangaType"
          },
          {
            "kind": "OBJECT",
            "name": "PartialSettingsType"
          },
          {
            "kind": "OBJECT",
            "name": "SettingsType"
          },
          {
            "kind": "OBJECT",
            "name": "SourceMetaType"
          },
          {
            "kind": "OBJECT",
            "name": "SourceType"
          },
          {
            "kind": "OBJECT",
            "name": "TrackRecordType"
          },
          {
            "kind": "OBJECT",
            "name": "TrackerType"
          }
        ]
      },
      {
        "kind": "INTERFACE",
        "name": "NodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INTERFACE",
                    "name": "Edge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "UNION",
                    "name": "Node"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [],
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "CategoryNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "ChapterNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "DownloadNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "ExtensionNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "GlobalMetaNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "MangaNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "SourceNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "TrackRecordNodeList"
          },
          {
            "kind": "OBJECT",
            "name": "TrackerNodeList"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "PageInfo",
        "fields": [
          {
            "name": "endCursor",
            "type": {
              "kind": "SCALAR",
              "name": "Cursor"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "hasNextPage",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "hasPreviousPage",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "startCursor",
            "type": {
              "kind": "SCALAR",
              "name": "Cursor"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "PartialSettingsType",
        "fields": [
          {
            "name": "autoDownloadAheadLimit",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": true
          },
          {
            "name": "autoDownloadIgnoreReUploads",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "autoDownloadNewChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "autoDownloadNewChaptersLimit",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupTTL",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupTime",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthPassword",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthUsername",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "debugLogsEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadAsCbz",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadsPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "electronPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeCompleted",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeEntryWithUnreadChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeNotStarted",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeUnreadChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extensionRepos",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrAsResponseFallback",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrSessionName",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrSessionTtl",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrTimeout",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "globalUpdateInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "gqlDebugLogsEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "initialOpenInBrowserEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "ip",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "localSourcePath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFileSize",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFiles",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFolderSize",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxSourcesInParallel",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "port",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyHost",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyPassword",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyPort",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyUsername",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyVersion",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "systemTrayEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateMangas",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIChannel",
            "type": {
              "kind": "ENUM",
              "name": "WebUIChannel"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIFlavor",
            "type": {
              "kind": "ENUM",
              "name": "WebUIFlavor"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIInterface",
            "type": {
              "kind": "ENUM",
              "name": "WebUIInterface"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIUpdateCheckInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Settings"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "PartialSettingsTypeInput",
        "inputFields": [
          {
            "name": "autoDownloadIgnoreReUploads",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "autoDownloadNewChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "autoDownloadNewChaptersLimit",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "backupInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "backupPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "backupTTL",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "backupTime",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "basicAuthEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "basicAuthPassword",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "basicAuthUsername",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "debugLogsEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "downloadAsCbz",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "downloadsPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "electronPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "excludeCompleted",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "excludeEntryWithUnreadChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "excludeNotStarted",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "excludeUnreadChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "extensionRepos",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "flareSolverrAsResponseFallback",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "flareSolverrEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "flareSolverrSessionName",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "flareSolverrSessionTtl",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "flareSolverrTimeout",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "flareSolverrUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "globalUpdateInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "gqlDebugLogsEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "initialOpenInBrowserEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "ip",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "localSourcePath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "maxLogFileSize",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "maxLogFiles",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "maxLogFolderSize",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "maxSourcesInParallel",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "port",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "socksProxyEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "socksProxyHost",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "socksProxyPassword",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "socksProxyPort",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "socksProxyUsername",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "socksProxyVersion",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "systemTrayEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "updateMangas",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "webUIChannel",
            "type": {
              "kind": "ENUM",
              "name": "WebUIChannel"
            }
          },
          {
            "name": "webUIFlavor",
            "type": {
              "kind": "ENUM",
              "name": "WebUIFlavor"
            }
          },
          {
            "name": "webUIInterface",
            "type": {
              "kind": "ENUM",
              "name": "WebUIInterface"
            }
          },
          {
            "name": "webUIUpdateCheckInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "UNION",
        "name": "Preference",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "CheckBoxPreference"
          },
          {
            "kind": "OBJECT",
            "name": "EditTextPreference"
          },
          {
            "kind": "OBJECT",
            "name": "ListPreference"
          },
          {
            "kind": "OBJECT",
            "name": "MultiSelectListPreference"
          },
          {
            "kind": "OBJECT",
            "name": "SwitchPreference"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "aboutServer",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AboutServerPayload"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "aboutWebUI",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AboutWebUI"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "categories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "CategoryConditionInput"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "CategoryFilterInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "CategoryOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "CategoryOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "category",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryType"
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "chapter",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "chapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "ChapterConditionInput"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "ChapterFilterInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "ChapterOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "ChapterOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "checkForServerUpdates",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "CheckForServerUpdatesPayload"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "checkForWebUIUpdate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "WebUIUpdateCheck"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extension",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExtensionType"
              }
            },
            "args": [
              {
                "name": "pkgName",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "extensions",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExtensionNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "ExtensionConditionInput"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "ExtensionFilterInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "ExtensionOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "ExtensionOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "getWebUIUpdateStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "WebUIUpdateStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lastUpdateTimestamp",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "LastUpdateTimestampPayload"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "mangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "MangaConditionInput"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "MangaFilterInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "MangaOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "MangaOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "GlobalMetaType"
              }
            },
            "args": [
              {
                "name": "key",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "metas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "GlobalMetaNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "MetaConditionInput"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "MetaFilterInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "MetaOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "MetaOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "restoreStatus",
            "type": {
              "kind": "OBJECT",
              "name": "BackupRestoreStatus"
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "searchTracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SearchTrackerPayload"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "SearchTrackerInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "settings",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SettingsType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "source",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SourceType"
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "LongString"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "sources",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SourceNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "SourceConditionInput"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "SourceFilterInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "SourceOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "SourceOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "trackRecord",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackRecordType"
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "trackRecords",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackRecordNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "TrackRecordConditionInput"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "TrackRecordFilterInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "TrackRecordOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "TrackRecordOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "tracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerType"
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "trackers",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerNodeList"
              }
            },
            "args": [
              {
                "name": "after",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "before",
                "type": {
                  "kind": "SCALAR",
                  "name": "Cursor"
                }
              },
              {
                "name": "condition",
                "type": {
                  "kind": "INPUT_OBJECT",
                  "name": "TrackerConditionInput"
                }
              },
              {
                "name": "first",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "last",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              },
              {
                "name": "order",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "NON_NULL",
                    "ofType": {
                      "kind": "INPUT_OBJECT",
                      "name": "TrackerOrderInput"
                    }
                  }
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "ENUM",
                  "name": "TrackerOrderBy"
                }
              },
              {
                "name": "orderByType",
                "type": {
                  "kind": "ENUM",
                  "name": "SortOrder"
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "validateBackup",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ValidateBackupResult"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "ValidateBackupInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ReorderChapterDownloadInput",
        "inputFields": [
          {
            "name": "chapterId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "to",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ReorderChapterDownloadPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ResetSettingsInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ResetSettingsPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "settings",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SettingsType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "RestoreBackupInput",
        "inputFields": [
          {
            "name": "backup",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Upload"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "RestoreBackupPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "status",
            "type": {
              "kind": "OBJECT",
              "name": "BackupRestoreStatus"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SearchTrackerInput",
        "inputFields": [
          {
            "name": "query",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SearchTrackerPayload",
        "fields": [
          {
            "name": "trackSearches",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TrackSearchType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "SelectFilter",
        "fields": [
          {
            "name": "default",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "values",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "SeparatorFilter",
        "fields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SetCategoryMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "CategoryMetaTypeInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SetCategoryMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryMetaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SetChapterMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "ChapterMetaTypeInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SetChapterMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterMetaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SetGlobalMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "GlobalMetaTypeInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SetGlobalMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "GlobalMetaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SetMangaMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "MangaMetaTypeInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SetMangaMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaMetaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SetSettingsInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "settings",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "PartialSettingsTypeInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SetSettingsPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "settings",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SettingsType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SetSourceMetaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "SourceMetaTypeInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SetSourceMetaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SourceMetaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INTERFACE",
        "name": "Settings",
        "fields": [
          {
            "name": "autoDownloadAheadLimit",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": true
          },
          {
            "name": "autoDownloadIgnoreReUploads",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "autoDownloadNewChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "autoDownloadNewChaptersLimit",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupTTL",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupTime",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthPassword",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthUsername",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "debugLogsEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadAsCbz",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadsPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "electronPath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeCompleted",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeEntryWithUnreadChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeNotStarted",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeUnreadChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extensionRepos",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrAsResponseFallback",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrSessionName",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrSessionTtl",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrTimeout",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "globalUpdateInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "gqlDebugLogsEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "initialOpenInBrowserEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "ip",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "localSourcePath",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFileSize",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFiles",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFolderSize",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxSourcesInParallel",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "port",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyHost",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyPassword",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyPort",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyUsername",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyVersion",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "systemTrayEnabled",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateMangas",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIChannel",
            "type": {
              "kind": "ENUM",
              "name": "WebUIChannel"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIFlavor",
            "type": {
              "kind": "ENUM",
              "name": "WebUIFlavor"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIInterface",
            "type": {
              "kind": "ENUM",
              "name": "WebUIInterface"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIUpdateCheckInterval",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [],
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "PartialSettingsType"
          },
          {
            "kind": "OBJECT",
            "name": "SettingsType"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "SettingsType",
        "fields": [
          {
            "name": "autoDownloadAheadLimit",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": true
          },
          {
            "name": "autoDownloadIgnoreReUploads",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "autoDownloadNewChapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "autoDownloadNewChaptersLimit",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupInterval",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupPath",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupTTL",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "backupTime",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthEnabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthPassword",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "basicAuthUsername",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "debugLogsEnabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadAsCbz",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadsPath",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "electronPath",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeCompleted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeEntryWithUnreadChapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeNotStarted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "excludeUnreadChapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extensionRepos",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrAsResponseFallback",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrEnabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrSessionName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrSessionTtl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrTimeout",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "flareSolverrUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "globalUpdateInterval",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Float"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "gqlDebugLogsEnabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "initialOpenInBrowserEnabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "ip",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "localSourcePath",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFileSize",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFiles",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxLogFolderSize",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "maxSourcesInParallel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "port",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyEnabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyHost",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyPassword",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyPort",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyUsername",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "socksProxyVersion",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "systemTrayEnabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateMangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIChannel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "WebUIChannel"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIFlavor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "WebUIFlavor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIInterface",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "WebUIInterface"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIUpdateCheckInterval",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Float"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Settings"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "SortFilter",
        "fields": [
          {
            "name": "default",
            "type": {
              "kind": "OBJECT",
              "name": "SortSelection"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "values",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "SortOrder",
        "enumValues": [
          {
            "name": "ASC",
            "isDeprecated": false
          },
          {
            "name": "DESC",
            "isDeprecated": false
          },
          {
            "name": "ASC_NULLS_FIRST",
            "isDeprecated": false
          },
          {
            "name": "DESC_NULLS_FIRST",
            "isDeprecated": false
          },
          {
            "name": "ASC_NULLS_LAST",
            "isDeprecated": false
          },
          {
            "name": "DESC_NULLS_LAST",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "SortSelection",
        "fields": [
          {
            "name": "ascending",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "index",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SortSelectionInput",
        "inputFields": [
          {
            "name": "ascending",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            }
          },
          {
            "name": "index",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SourceConditionInput",
        "inputFields": [
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "isNsfw",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lang",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SourceEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SourceType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SourceFilterInput",
        "inputFields": [
          {
            "name": "and",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "SourceFilterInput"
                }
              }
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "isNsfw",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "BooleanFilterInput"
            }
          },
          {
            "name": "lang",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "not",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "SourceFilterInput"
            }
          },
          {
            "name": "or",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "SourceFilterInput"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SourceMetaType",
        "fields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "source",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SourceType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "sourceId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "MetaType"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SourceMetaTypeInput",
        "inputFields": [
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "sourceId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            }
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SourceNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "SourceEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "SourceType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "SourceOrderBy",
        "enumValues": [
          {
            "name": "ID",
            "isDeprecated": false
          },
          {
            "name": "NAME",
            "isDeprecated": false
          },
          {
            "name": "LANG",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SourceOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "SourceOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "SourcePreferenceChangeInput",
        "inputFields": [
          {
            "name": "checkBoxState",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "editTextState",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "listState",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "multiSelectState",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "position",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "switchState",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "SourceType",
        "fields": [
          {
            "name": "displayName",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extension",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ExtensionType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "filters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "UNION",
                    "name": "Filter"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "iconUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isConfigurable",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isNsfw",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lang",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "meta",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "SourceMetaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "preferences",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "UNION",
                    "name": "Preference"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "supportsLatest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "StartDownloaderInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "StartDownloaderPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "StopDownloaderInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "StopDownloaderPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "downloadStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "String"
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "StringFilterInput",
        "inputFields": [
          {
            "name": "distinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "distinctFromAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "distinctFromAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "distinctFromInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "distinctFromInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "distinctFromInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "endsWith",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "endsWithAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "endsWithAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "endsWithInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "endsWithInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "endsWithInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "equalTo",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "greaterThan",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "greaterThanInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "greaterThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "greaterThanOrEqualToInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "in",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "inInsensitive",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "includes",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "includesAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "includesAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "includesInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "includesInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "includesInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "isNull",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lessThan",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "lessThanInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "lessThanOrEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "lessThanOrEqualToInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "like",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "likeAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "likeAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "likeInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "likeInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "likeInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notDistinctFrom",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notDistinctFromInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notEndsWith",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notEndsWithAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notEndsWithAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notEndsWithInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notEndsWithInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notEndsWithInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notEqualTo",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notEqualToAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notEqualToAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notIn",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notInInsensitive",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notIncludes",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notIncludesAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notIncludesAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notIncludesInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notIncludesInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notIncludesInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notLike",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notLikeAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notLikeAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notLikeInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notLikeInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notLikeInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notStartsWith",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notStartsWithAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notStartsWithAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notStartsWithInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "notStartsWithInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "notStartsWithInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "startsWith",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "startsWithAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "startsWithAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "startsWithInsensitive",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "startsWithInsensitiveAll",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          },
          {
            "name": "startsWithInsensitiveAny",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "String"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "Subscription",
        "fields": [
          {
            "name": "downloadChanged",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadStatus"
              }
            },
            "args": [],
            "isDeprecated": true
          },
          {
            "name": "downloadStatusChanged",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "DownloadUpdates"
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "INPUT_OBJECT",
                    "name": "DownloadChangedInput"
                  }
                }
              }
            ],
            "isDeprecated": false
          },
          {
            "name": "updateStatusChanged",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "webUIUpdateStatusChange",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "WebUIUpdateStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "SwitchPreference",
        "fields": [
          {
            "name": "currentValue",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "default",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "key",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "summary",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "visible",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TextFilter",
        "fields": [
          {
            "name": "default",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "TrackProgressInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "TrackProgressPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackRecords",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TrackRecordType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "TrackRecordConditionInput",
        "inputFields": [
          {
            "name": "finishDate",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "lastChapterRead",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "libraryId",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "remoteId",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "remoteUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "score",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "startDate",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "status",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "title",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "totalChapters",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "TrackRecordEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackRecordType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "TrackRecordFilterInput",
        "inputFields": [
          {
            "name": "and",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "TrackRecordFilterInput"
                }
              }
            }
          },
          {
            "name": "finishDate",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "lastChapterRead",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "DoubleFilterInput"
            }
          },
          {
            "name": "libraryId",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "not",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "TrackRecordFilterInput"
            }
          },
          {
            "name": "or",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "INPUT_OBJECT",
                  "name": "TrackRecordFilterInput"
                }
              }
            }
          },
          {
            "name": "remoteId",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "remoteUrl",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "score",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "DoubleFilterInput"
            }
          },
          {
            "name": "startDate",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "LongFilterInput"
            }
          },
          {
            "name": "status",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "title",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "StringFilterInput"
            }
          },
          {
            "name": "totalChapters",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "INPUT_OBJECT",
              "name": "IntFilterInput"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "TrackRecordNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TrackRecordEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TrackRecordType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "TrackRecordOrderBy",
        "enumValues": [
          {
            "name": "ID",
            "isDeprecated": false
          },
          {
            "name": "MANGA_ID",
            "isDeprecated": false
          },
          {
            "name": "TRACKER_ID",
            "isDeprecated": false
          },
          {
            "name": "REMOTE_ID",
            "isDeprecated": false
          },
          {
            "name": "TITLE",
            "isDeprecated": false
          },
          {
            "name": "LAST_CHAPTER_READ",
            "isDeprecated": false
          },
          {
            "name": "TOTAL_CHAPTERS",
            "isDeprecated": false
          },
          {
            "name": "SCORE",
            "isDeprecated": false
          },
          {
            "name": "START_DATE",
            "isDeprecated": false
          },
          {
            "name": "FINISH_DATE",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "TrackRecordOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "TrackRecordOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "TrackRecordType",
        "fields": [
          {
            "name": "displayScore",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "finishDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "lastChapterRead",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Float"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "libraryId",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "remoteId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "remoteUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "score",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Float"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "startDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalChapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TrackSearchType",
        "fields": [
          {
            "name": "coverUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "publishingStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "publishingType",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "remoteId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "startDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "summary",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalChapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tracker",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackerId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackingUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TrackStatusType",
        "fields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "TrackerConditionInput",
        "inputFields": [
          {
            "name": "icon",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          },
          {
            "name": "isLoggedIn",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "TrackerEdge",
        "fields": [
          {
            "name": "cursor",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Cursor"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "node",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackerType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "Edge"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "TrackerNodeList",
        "fields": [
          {
            "name": "edges",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TrackerEdge"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TrackerType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pageInfo",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PageInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "totalCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": [
          {
            "kind": "INTERFACE",
            "name": "NodeList"
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "TrackerOrderBy",
        "enumValues": [
          {
            "name": "ID",
            "isDeprecated": false
          },
          {
            "name": "NAME",
            "isDeprecated": false
          },
          {
            "name": "IS_LOGGED_IN",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "TrackerOrderInput",
        "inputFields": [
          {
            "name": "by",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "TrackerOrderBy"
              }
            }
          },
          {
            "name": "byType",
            "type": {
              "kind": "ENUM",
              "name": "SortOrder"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "TrackerType",
        "fields": [
          {
            "name": "authUrl",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "icon",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isLoggedIn",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isTokenExpired",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "scores",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "statuses",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TrackStatusType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "supportsTrackDeletion",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackRecords",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TrackRecordNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "TriState",
        "enumValues": [
          {
            "name": "IGNORE",
            "isDeprecated": false
          },
          {
            "name": "INCLUDE",
            "isDeprecated": false
          },
          {
            "name": "EXCLUDE",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "TriStateFilter",
        "fields": [
          {
            "name": "default",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "TriState"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UnbindTrackInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "deleteRemoteTrack",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "recordId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UnbindTrackPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackRecord",
            "type": {
              "kind": "OBJECT",
              "name": "TrackRecordType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateCategoriesInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateCategoryPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateCategoriesPayload",
        "fields": [
          {
            "name": "categories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "CategoryType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateCategoryInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateCategoryPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateCategoryMangaInput",
        "inputFields": [
          {
            "name": "categories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateCategoryMangaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateCategoryOrderInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "position",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateCategoryOrderPayload",
        "fields": [
          {
            "name": "categories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "CategoryType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateCategoryPatchInput",
        "inputFields": [
          {
            "name": "default",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "includeInDownload",
            "type": {
              "kind": "ENUM",
              "name": "IncludeOrExclude"
            }
          },
          {
            "name": "includeInUpdate",
            "type": {
              "kind": "ENUM",
              "name": "IncludeOrExclude"
            }
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateCategoryPayload",
        "fields": [
          {
            "name": "category",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateChapterInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateChapterPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateChapterPatchInput",
        "inputFields": [
          {
            "name": "isBookmarked",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "isRead",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "lastPageRead",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateChapterPayload",
        "fields": [
          {
            "name": "chapter",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "ChapterType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateChaptersInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateChapterPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateChaptersPayload",
        "fields": [
          {
            "name": "chapters",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ChapterType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateExtensionInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateExtensionPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateExtensionPatchInput",
        "inputFields": [
          {
            "name": "install",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "uninstall",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "update",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateExtensionPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extension",
            "type": {
              "kind": "OBJECT",
              "name": "ExtensionType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateExtensionsInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String"
                  }
                }
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateExtensionPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateExtensionsPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "extensions",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ExtensionType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateLibraryMangaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateLibraryMangaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateMangaCategoriesInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateMangaCategoriesPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateMangaCategoriesPatchInput",
        "inputFields": [
          {
            "name": "addToCategories",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          },
          {
            "name": "clearCategories",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          },
          {
            "name": "removeFromCategories",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Int"
                }
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateMangaCategoriesPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateMangaInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateMangaPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateMangaPatchInput",
        "inputFields": [
          {
            "name": "inLibrary",
            "type": {
              "kind": "SCALAR",
              "name": "Boolean"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateMangaPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "manga",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateMangasCategoriesInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateMangaCategoriesPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateMangasCategoriesPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MangaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateMangasInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "ids",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int"
                  }
                }
              }
            }
          },
          {
            "name": "patch",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "UpdateMangaPatchInput"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateMangasPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "mangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "MangaType"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateSourcePreferenceInput",
        "inputFields": [
          {
            "name": "change",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "INPUT_OBJECT",
                "name": "SourcePreferenceChangeInput"
              }
            }
          },
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "source",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateSourcePreferencePayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "preferences",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "UNION",
                    "name": "Preference"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "source",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SourceType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "UpdateState",
        "enumValues": [
          {
            "name": "IDLE",
            "isDeprecated": false
          },
          {
            "name": "DOWNLOADING",
            "isDeprecated": false
          },
          {
            "name": "FINISHED",
            "isDeprecated": false
          },
          {
            "name": "ERROR",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "UpdateStatus",
        "fields": [
          {
            "name": "completeJobs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatusType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "failedJobs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatusType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "isRunning",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "pendingJobs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatusType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "runningJobs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatusType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "skippedCategories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatusCategoryType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "skippedJobs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatusType"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updatingCategories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UpdateStatusCategoryType"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UpdateStatusCategoryType",
        "fields": [
          {
            "name": "categories",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CategoryNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UpdateStatusType",
        "fields": [
          {
            "name": "mangas",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MangaNodeList"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateStopInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateStopPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "UpdateStrategy",
        "enumValues": [
          {
            "name": "ALWAYS_UPDATE",
            "isDeprecated": false
          },
          {
            "name": "ONLY_FETCH_ONCE",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "UpdateTrackInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "finishDate",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "lastChapterRead",
            "type": {
              "kind": "SCALAR",
              "name": "Float"
            }
          },
          {
            "name": "recordId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            }
          },
          {
            "name": "scoreString",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          },
          {
            "name": "startDate",
            "type": {
              "kind": "SCALAR",
              "name": "LongString"
            }
          },
          {
            "name": "status",
            "type": {
              "kind": "SCALAR",
              "name": "Int"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "UpdateTrackPayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "trackRecord",
            "type": {
              "kind": "OBJECT",
              "name": "TrackRecordType"
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Upload"
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "ValidateBackupInput",
        "inputFields": [
          {
            "name": "backup",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Upload"
              }
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "ValidateBackupResult",
        "fields": [
          {
            "name": "missingSources",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ValidateBackupSource"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "missingTrackers",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ValidateBackupTracker"
                  }
                }
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ValidateBackupSource",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "LongString"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ValidateBackupTracker",
        "fields": [
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "ENUM",
        "name": "WebUIChannel",
        "enumValues": [
          {
            "name": "BUNDLED",
            "isDeprecated": false
          },
          {
            "name": "STABLE",
            "isDeprecated": false
          },
          {
            "name": "PREVIEW",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "WebUIFlavor",
        "enumValues": [
          {
            "name": "WEBUI",
            "isDeprecated": false
          },
          {
            "name": "VUI",
            "isDeprecated": false
          },
          {
            "name": "CUSTOM",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "ENUM",
        "name": "WebUIInterface",
        "enumValues": [
          {
            "name": "BROWSER",
            "isDeprecated": false
          },
          {
            "name": "ELECTRON",
            "isDeprecated": false
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "WebUIUpdateCheck",
        "fields": [
          {
            "name": "channel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tag",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateAvailable",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "WebUIUpdateInfo",
        "fields": [
          {
            "name": "channel",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "tag",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "String"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "INPUT_OBJECT",
        "name": "WebUIUpdateInput",
        "inputFields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            }
          }
        ],
        "isOneOf": false
      },
      {
        "kind": "OBJECT",
        "name": "WebUIUpdatePayload",
        "fields": [
          {
            "name": "clientMutationId",
            "type": {
              "kind": "SCALAR",
              "name": "String"
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "updateStatus",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "WebUIUpdateStatus"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "WebUIUpdateStatus",
        "fields": [
          {
            "name": "info",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "WebUIUpdateInfo"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "progress",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Int"
              }
            },
            "args": [],
            "isDeprecated": false
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "ENUM",
                "name": "UpdateState"
              }
            },
            "args": [],
            "isDeprecated": false
          }
        ],
        "interfaces": []
      }
    ],
    "directives": []
  }
} as const;

export { introspection };