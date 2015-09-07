var fs = require('fs');
var options = {};

process.argv.shift();
process.argv.shift();

var option;
while (option = process.argv.shift()) {
    switch (option) {
        case '-a':
            options.artist = process.argv.shift();
            break;
        case '-A':
            options.album = process.argv.shift();
            break;
        case '-f':
            options.file = process.argv.shift();
            break;
        case '-g':
            options.genre = process.argv.shift();
            break;
        case '-s':
            options.songs = process.argv.shift();
            break;
        case '-y':
            options.year = process.argv.shift();
            break;
        default:
            console.error('unrecognised option:', option);
    }
}

if (!options.artist && !options.album && !options.genre && !options.year) {
    console.log('please -a artist -A album -g genre -s songs -y year');
}

var i = 0;

if (!options.file) {
    options.file = 'bands';
}

var content = '#artist -a;album -A;song -t;genre -g;year -y;track -T\n';

for (i = 0; i < options.songs; i++) {
    content += [options.artist, options.album, ' ', options.genre, options.year,
        i + 1].join(';');
    content += '\n';
}

fs.writeFile(options.file, content, {encoding: 'utf8', flag: 'w'},
        function(err) {
    if (err) {
        console.error(err);
    }
});
