# lnt

Command line helper for installing eslint config files.

Tools like `standard` and `xo` are good, but eslint already does everything you need, and keeping linting in a separate npm module means that your editor wont be able to read `.eslintrc`, so no in-editor linting without another plugin. Using normal eslint files means your editor works already, and the use of shareable config files provides an ideal way to extend or override lint settings.

But so much typing to set up eslint! This module stops the typing.


## install

    $ npm install -g lnt


## example

Create default `.eslintignore` and `.eslintrc` files, and add eslint as part of the package.json `test` field

    $ lnt init

Default `.eslintignore`
```
**/*.min.js
**/bundle.js
coverage/**
node_modules/**
vendor/**
```

Default `.eslintrc`
```js
{
    "extends": []
}
```

Install an eslint shareable config -- save it as a dev dependency and add it to `.eslintrc`. Want to use `standard`? Just install the config, `eslint-config-standard`. 

    $ lnt install standard
    
or

    $ lnt i standard

Now `.eslintrc` looks like this
```js
{
    "extends": ["standard"]
}
```

And eslint knows what to do

```bash
$ eslint **/*.js  # lint my files
```
