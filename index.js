var fs = require('fs')
var iPkg = require('npm-install-package')
var cp = require('cp-file')
var xtend = require('xtend')
var getPkg = require('read-pkg-up')
var parallel = require('run-parallel')

function updatePkgTest (data, cb) {
    var pkg = data.pkg
    var testCmd = (pkg.scripts || {}).test || ''
    if (testCmd.indexOf('eslint **/*.js') > -1) return cb(null)
    if ((testCmd.indexOf('Error') > -1) || testCmd.length === 0) {
        // overwrite test cmd
        testCmd = 'eslint **/*.js'
    } else {
        // keep existing test cmd
        testCmd = 'eslint **/*.js && ' + test
    }
    pkg.scripts.test = testCmd
    writePkg(data.path, pkg).then(function () {
        cb(null)
    }).catch(function (err) {
        cb(err)
    })
}

function initDefaults (opts, cb) {
    cb = cb || function () {}
    opts = xtend({
        destDir: process.cwd(),
        sourceIgnore: __dirname + '/default/eslintignore',
        sourceRc: __dirname + '/default/eslintrc',
        pkgPath: process.cwd() + '/package.json'
    }, opts)

    Promise.all([
        cp(opts.sourceIgnore, opts.destDir + '/.eslintignore'),
        cp(opts.sourceRc, opts.destDir + '/.eslintrc')
    ])
    .then(getPkg)
    .then(function (data) {
        var tasks = [ updatePkgTest.bind(null, data) ]
        tasks = Object.keys(data.pkg.devDependencies).indexOf('eslint') > -1 ?
            tasks :
            tasks.concat(iPkg.bind(null, 'eslint', { saveDev: true }))

        parallel(tasks, function allDone (err) {
            cb(err)
        })
    }).catch(function (err) {
        cb(err)
    })
}

function installConfig (configName, opts, cb) {
    cb = cb || function () {}
    opts = xtend({
        rc: { extends: [] },
        destFile: process.cwd() + '/.eslintrc'
    }, opts)
    var pkg = 'eslint-config-' + configName
    iPkg(pkg, { saveDev: true }, function (err) {
        if (err) return cb(err)
        if (opts.rc.extends.indexOf(configName) > -1) return cb(null)
        opts.rc.extends.push(configName)
        fs.writeFile(opts.destFile, JSON.stringify(opts.rc, null, 2),
            function (err) {
                cb(err)
            }
        )
    })
}

module.exports = {
    install: installConfig,
    init: initDefaults
}
