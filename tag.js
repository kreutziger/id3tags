var fs = require('fs');
var exec = require('child_process').exec, child;
var options = {};

function escapeItems(items, dir) {
    var i = 0;
    if (dir) {
        for (i = 0; i < items.length; i++) {
            items[i] = '"' + dir + '/' + items[i] + '"';
        }
    } else {
        for (i = 0; i < items.length; i++) {
            items[i] = '"' + items[i] + '"';
        }
    }
    return items;
}

function removeComments(lines) {
    var i = 0;
    var tmp = [];
    for (i = 0; i < lines.length; i++) {
        if (lines[i][0] !== '#') {
            tmp.push(lines[i]);
        }
    }
    return tmp;
}

process.argv.shift();
process.argv.shift();

var option;
while (option = process.argv.shift()) {
    switch (option) {
        case '-d':
            options.dir = process.argv.shift();
            break;
        case '-f':
            options.file = process.argv.shift();
            break;
        case '-n':
            options.dryrun = true;
            break;
        default:
            console.error('unrecognised option:', option);
    }
}

if (!options.file && !options.dir) {
    console.error('please pass a file and a directory');
}
fs.access(options.file, fs.R_OK, function(err) {
    if (err) {
      console.error('file with bands:', err);
    }
});

fs.access(options.dir, fs.R_OK, function(err) {
    if (err) {
      console.error('file with bands:', err);
    }
});

//#artist -a;album -A;song -t;genre -g;year -y;track -T
fs.readdir(options.dir, function(err, files) {
    if (err) {
        console.error('error while reading dir:', options.dir, err);
    }
    fs.readFile(options.file, {encoding: 'utf8', flag: 'r'},
            function(err, id3data) {
        if (err) {
            console.error('error while reading file:', options.file, err);
        }
        id3data = id3data.split('\n');
        id3data = removeComments(id3data);
        files = escapeItems(files, options.dir);
        var i;
        var length = id3data.length - 1;
        var cmdStr = '';
        var tags;
        for (i = 0; i < length; i++) {
            tags = id3data[i].split(';');
            tags = escapeItems(tags);
            cmdStr = ['id3v2', '-a', tags[0], '-A', tags[1], '-t', tags[2],
            '-g', tags[3], '-y', tags[4], '-T', tags[5], files[i]].join(' ');
            if (options.dryrun) {
                cmdStr = 'echo ' + cmdStr;
            }
            child = exec(cmdStr, function(err, stdout, stderr) {
                if (err) {
                    console.error('error while executing:', err, cmdStr);
                }
                if (stderr) {
                    console.error('stderr while executing:', stderr, cmdStr);
                }
                if (stdout) {
                    console.log(stdout);
                }
            });
        }
    });
});
