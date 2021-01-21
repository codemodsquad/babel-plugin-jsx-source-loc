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

it(`ignores React.Fragment from import * as React from 'react'`, async () => {
  const input = `
    import * as React from 'react'
    function MyComponent() {
      return (
        <React.Fragment>
          <Alert variant="danger">
            {names.map(name =>
              <Card key={name}>
                {name}
              </Card>
            )}
          </Alert>
        </React.Fragment>
      )
    } 
  `

  const transformed = (await babel.transformAsync(input, {
    plugins: ['@babel/plugin-syntax-jsx', plugin],
    filename: 'test/index.js',
  })).code

  expect(format(transformed)).to.equal(
    format(`
      import * as React from 'react'
      function MyComponent() {
        return (
          <React.Fragment>
            <Alert variant="danger" data-source-loc="test/index.js:6:10">
              {names.map(name =>
                <Card key={name} data-source-loc="test/index.js:8:14">
                  {name}
                </Card>
              )}
            </Alert>
          </React.Fragment>
        )
      } 
    `)
  )
})

it(`ignores React.Fragment from import React from 'react'`, async () => {
  const input = `
    import React from 'react'
    function MyComponent() {
      return (
        <React.Fragment>
          <Alert variant="danger">
            {names.map(name =>
              <Card key={name}>
                {name}
              </Card>
            )}
          </Alert>
        </React.Fragment>
      )
    } 
  `

  const transformed = (await babel.transformAsync(input, {
    plugins: ['@babel/plugin-syntax-jsx', plugin],
    filename: 'test/index.js',
  })).code

  expect(format(transformed)).to.equal(
    format(`
      import React from 'react'
      function MyComponent() {
        return (
          <React.Fragment>
            <Alert variant="danger" data-source-loc="test/index.js:6:10">
              {names.map(name =>
                <Card key={name} data-source-loc="test/index.js:8:14">
                  {name}
                </Card>
              )}
            </Alert>
          </React.Fragment>
        )
      } 
    `)
  )
})

it(`ignores Fragment from import { Fragment } from 'react'`, async () => {
  const input = `
    import React, {Fragment} from 'react'
    function MyComponent() {
      return (
        <Fragment>
          <Alert variant="danger">
            {names.map(name =>
              <Card key={name}>
                {name}
              </Card>
            )}
          </Alert>
        </Fragment>
      )
    } 
  `

  const transformed = (await babel.transformAsync(input, {
    plugins: ['@babel/plugin-syntax-jsx', plugin],
    filename: 'test/index.js',
  })).code

  expect(format(transformed)).to.equal(
    format(`
      import React, {Fragment} from 'react'
      function MyComponent() {
        return (
          <Fragment>
            <Alert variant="danger" data-source-loc="test/index.js:6:10">
              {names.map(name =>
                <Card key={name} data-source-loc="test/index.js:8:14">
                  {name}
                </Card>
              )}
            </Alert>
          </Fragment>
        )
      } 
    `)
  )
})

it(`ignores React.Fragment from const React = require('react')`, async () => {
  const input = `
    const React = require('react')
    function MyComponent() {
      return (
        <React.Fragment>
          <Alert variant="danger">
            {names.map(name =>
              <Card key={name}>
                {name}
              </Card>
            )}
          </Alert>
        </React.Fragment>
      )
    } 
  `

  const transformed = (await babel.transformAsync(input, {
    plugins: ['@babel/plugin-syntax-jsx', plugin],
    filename: 'test/index.js',
  })).code

  expect(format(transformed)).to.equal(
    format(`
      const React = require('react')
      function MyComponent() {
        return (
          <React.Fragment>
            <Alert variant="danger" data-source-loc="test/index.js:6:10">
              {names.map(name =>
                <Card key={name} data-source-loc="test/index.js:8:14">
                  {name}
                </Card>
              )}
            </Alert>
          </React.Fragment>
        )
      } 
    `)
  )
})

it(`ignores Fragment from const {Fragment} = require('react')`, async () => {
  const input = `
    const {Fragment} = require('react')
    function MyComponent() {
      return (
        <Fragment>
          <Alert variant="danger">
            {names.map(name =>
              <Card key={name}>
                {name}
              </Card>
            )}
          </Alert>
        </Fragment>
      )
    } 
  `

  const transformed = (await babel.transformAsync(input, {
    plugins: ['@babel/plugin-syntax-jsx', plugin],
    filename: 'test/index.js',
  })).code

  expect(format(transformed)).to.equal(
    format(`
      const {Fragment} = require('react')
      function MyComponent() {
        return (
          <Fragment>
            <Alert variant="danger" data-source-loc="test/index.js:6:10">
              {names.map(name =>
                <Card key={name} data-source-loc="test/index.js:8:14">
                  {name}
                </Card>
              )}
            </Alert>
          </Fragment>
        )
      } 
    `)
  )
})
