# babel-plugin-jsx-source-loc

[![CircleCI](https://circleci.com/gh/codemodsquad/babel-plugin-jsx-source-loc.svg?style=svg)](https://circleci.com/gh/codemodsquad/babel-plugin-jsx-source-loc)
[![Coverage Status](https://codecov.io/gh/codemodsquad/babel-plugin-jsx-source-loc/branch/master/graph/badge.svg)](https://codecov.io/gh/codemodsquad/babel-plugin-jsx-source-loc)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/babel-plugin-jsx-source-loc.svg)](https://badge.fury.io/js/babel-plugin-jsx-source-loc)

Adds a `data-source-loc` prop to every JSX element, so that you can quickly look up where an element was rendered
in the React Dev Tools. This is primarily intended for dev mode, not production.

# Example

### Input

```jsx
function MyComponent() {
  return (
    <div className="foo">
      <Alert variant="danger">
        {names.map(name => (
          <Card key={name}>{name}</Card>
        ))}
      </Alert>
    </div>
  )
}
```

### output

```jsx
function MyComponent() {
  return (
    <div className="foo" data-source-loc="src/MyComponent.js:3:4">
      <Alert variant="danger" data-source-loc="src/MyComponent.js:4:6">
        {names.map(name => (
          <Card key={name} data-source-loc="src/MyComponent.js:6:10">
            {name}
          </Card>
        ))}
      </Alert>
    </div>
  )
}
```

# Usage

```
npm i --save-dev babel-plugin-jsx-source-loc
```

And add `"babel-plugin-jsx-source-loc"` to your babel configuration.
