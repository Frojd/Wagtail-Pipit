var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

if (process.env.CI) {
    exec("npm run postbuild:ci", puts);
} else {
    exec("npm run postbuild:default", puts);
}
