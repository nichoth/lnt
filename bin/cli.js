#!/usr/bin/env node
var lnt = require('../')
var cli = require('meow')(`
    Use
        $ lnt [command]

    Commands
        init                 Create .eslint and .eslintignore files
        install <config>     Install an eslint config

    Examples
        $ lnt init
        $ lnt install standard
    `, {}
)

try {
    var cmds = {
        i: 'install',
    }
    var cmd = cmds[cli.input[0]] || cli.input[0]
    var args = cli.input.slice(1)
    lnt[cmd].apply(null, args.concat([cli.flags, err => {
        if (err) console.log('Uh oh: ', err)
    }]))
} catch (err) {
    cli.showHelp()
}

