const t = require('@babel/types')
const Path = require('path')

module.exports = function(api) {
  api.assertVersion(7)

  const DATA_SOURCE_LOCATION = 'data-source-loc'

  return {
    name: 'jsx-source-loc',
    visitor: {
      JSXOpeningElement: (path, state) => {
        const location = path.container.openingElement.loc
        if (!location) {
          // the element was generated and doesn't have location information
          return
        }

        const attributes = path.container.openingElement.attributes
        for (let i = 0; i < attributes.length; i++) {
          const name = attributes[i].name
          if (name && name === DATA_SOURCE_LOCATION) {
            // The attribute already exists
            return
          }
        }

        attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier(DATA_SOURCE_LOCATION),
            t.stringLiteral(
              Path.relative(state.cwd || '', state.filename || '') +
                ':' +
                location.start.line +
                ':' +
                location.start.column
            )
          )
        )
      },
    },
  }
}
