var gulp = require('gulp');
var debug = require('gulp-debug');
var gutil = require('gulp-util');
var ts = require("gulp-typescript");
var path = require('path');
var shell = require('shelljs');
var minimist = require('minimist');
var semver = require('semver');
var fs = require('fs');
var del = require('del');
var merge = require('merge-stream');
var cp = require('child_process');

var _buildRoot = path.join(__dirname, '_build');
var _packagesRoot = path.join(__dirname, '_packages');

function errorHandler(err) {
    process.exit(1);
}

gulp.task('default', ['build']);

gulp.task('build', ['clean', 'compile'], function () {
    var extension = gulp.src(['README.md', 'LICENSE.txt', 'images/**/*', '!images/**/*.pdn', 'vss-extension.json'], { base: '.' })
        .pipe(debug({title: 'extension:'}))
        .pipe(gulp.dest(_buildRoot));
    var task = gulp.src(['retain-release/**/*', '!retain-release/**/*.ts'], { base: '.' })
        .pipe(debug({title: 'task:'}))
        .pipe(gulp.dest(_buildRoot));

    getExternalModules();
    
    return merge(extension, task);
});

gulp.task('clean', function() {
   return del([_buildRoot]);
});

gulp.task('compile', ['clean'], function() {
    var taskPath = path.join(__dirname, 'retain-release', '*.ts');
    var tsConfigPath = path.join(__dirname, 'tsconfig.json');

    return gulp.src([taskPath], { base: './retain-release' })
        .pipe(ts.createProject(tsConfigPath)())
        .on('error', errorHandler)
        .pipe(gulp.dest(path.join(_buildRoot, 'retain-release')));
});

gulp.task('package', ['build'], function() {
    shell.exec('tfx extension create --root "' + _buildRoot + '" --output-path "' + _packagesRoot +'"')
});

getExternalModules = function() {
    // copy package.json without dev dependencies
    var libPath = path.join(_buildRoot, 'retain-release');

    var pkg = require('./package.json');
    delete pkg.devDependencies;

    fs.writeFileSync(path.join(libPath, 'package.json'), JSON.stringify(pkg, null, 4));

    // install modules
    var npmPath = shell.which('npm');

    shell.pushd(libPath);
    {
        var cmdline = '"' + npmPath + '" install';
        var res = cp.execSync(cmdline);
        gutil.log(res.toString());

        shell.popd();
    }

    fs.unlinkSync(path.join(libPath, 'package.json'));
}