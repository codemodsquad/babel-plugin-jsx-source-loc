const { it } = require('mocha')
const { expect } = require('chai')
const prettier = require('prettier')
const babel = require('@babel/core')
const plugin = require('..')

function format(code) {
  return prettier.format(code, { parser: 'babel' }).replace(/\n{2,}/gm, '\n')
}

it('works', async () => {
  const input = `
    function MyComponent() {
      return (
        <div className="foo">
          <Alert variant="danger">
            {names.map(name =>
              <Card key={name}>
                {name}
              </Card>
            )}
          </Alert>
        </div>
      )
    } 
  `

  const transformed = (await babel.transformAsync(input, {
    plugins: ['@babel/plugin-syntax-jsx', plugin],
    filename: 'test/index.js',
  })).code

  expect(format(transformed)).to.equal(
    format(`
      function MyComponent() {
        return (
          <div className="foo" data-source-loc="test/index.js:4:8">
            <Alert variant="danger" data-source-loc="test/index.js:5:10">
              {names.map(name =>
                <Card key={name} data-source-loc="test/index.js:7:14">
                  {name}
                </Card>
              )}
            </Alert>
          </div>
        )
      } 
    `)
  )
})
