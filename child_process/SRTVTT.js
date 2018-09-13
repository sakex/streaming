const read = require('fs').readFile;
const write = require('fs').writeFile;
const open = require('./open.js');

const convertSrtCue = caption => {
  // remove all html tags for security reasons
  //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');

  var cue = '';
  var s = caption.split(/\n/);
  while (s.length > 3) {
    s[2] += `\n${s.pop()}`;
  }

  var line = 0;

  // detect identifier
  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
    cue += `${s[0]}\n`;
    line += 1;
  }

  // get time strings
  if (s[line].match(/\d+:\d+:\d+/)) {
    // convert time string
    var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
    if (m) {
      cue += `${m[1]}:${m[2]}:${m[3]}.${m[4]} --> ${
        m[5]}:${m[6]}:${m[7]}.${m[8]}\n`;
      line += 1;
    } else {
      // Unrecognized timestring
      return '';
    }
  } else {
    // file format error or comment lines
    return '';
  }

  // get cue text
  if (s[line]) {
    cue += `${s[line]}\n\n`;
  }

  return cue;
};

const srt2webvtt = data => {
  // remove dos newlines
  var srt = data.replace(/\r+/g, '');
  // trim white space start and end
  srt = srt.replace(/^\s+|\s+$/g, '');

  // get cues
  var cuelist = srt.split('\n\n');
  var result = '';

  if (cuelist.length > 0) {
    result += 'WEBVTT\n\n';
    for (const i of cuelist) {
      result += convertSrtCue(i);
    }
  }
  return result;
};

if (process.argv.length < 3) {
  throw new Error(`Usage: node ${process.argv[1]} FILENAME`);
}

(() => {
  let webvtt = '';
  const file = process.argv[2];
  let out = file;

  if (process.argv[3]) {
    out = process.argv[3];
  }

  const openPromise = open(out, 'w');

  read(file, 'utf8', async (_err, data) => {
    webvtt = srt2webvtt(data);
    await openPromise;
    write(out, webvtt, err => {
      if (err) throw err;
    });
  });

})();

