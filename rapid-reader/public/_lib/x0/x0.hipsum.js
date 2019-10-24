/*!
 * Hipsum filler text generator.
 * Inspired by (and words taken from):
 * http://hipsum.co/
 *
 * Usage:
 *
 * // sentences only
 * x0.hipsum.sentence(); // generates 1 sentence with 9, 12, or 18 words
 * x0.hipsum.sentences(3); // generates 3 sentences with default words
 * x0.hipsum.sentences(4, [8, 12]); // generates 4 sentences with 8 or 12 words each
 *
 * // paragraphs
 * x0.hipsum.paragraph(); // generates 1 paragraph with 2, 3, or 5 sentences with 9, 12, or 18 words
 * x0.hipsum.paragraphs(); // generates 1, 2, or 3 paragraphs with 2, 3, or 5 sentences with 9, 12, or 18 words
 * x0.hipsum.paragraphs(3); // generates 3 paragraphs
 * x0.hipsum.paragraphs(2, 4); // generates 2 paragraphs with 4 sentences each
 * x0.hipsum.paragraphs(3, 5, [10, 15]); // generates 3 paragraphs with 5 sentences each, with 10 or 15 words per sentence
 * x0.hipsum.paragraphs(['foo','bar'], 1); // generates 1 paragraph with only 'foo' and 'bar' words
 *
 * // ids
 * x0.hipsum.id(); // generates 'safe' id string (starts with letter, contains only 'safe' characters)
 * x0.hipsum.id(3); // generates 'safe' id string using 3 words
 * x0.hipsum.id(1, 'foo', true); // id string with one word, the 'foo' prefix with the timestamp appended
 */

(function(){

    var undef;

    if (window.x0 === undef) {
        console.error('The required "x0.js" file is missing or not loaded.');
        return;
    }

    var x0 = window.x0;

    var hipsum = x0.getObject(x0.hipsum || {});

    var lingo =
            ('trust fund|street art|mustache|roof party|health|goth|selfies|next level|hashtag|' +
                'post-ironic|sriracha|banh mi|art party|paleo|flexitarian|tweet|street|art|scenester|' +
                'whatever|chillwave|tousled|tofu|raw|denim|cred|cold-pressed|migas|listicle|' +
                'crucifix|90s|farm-to-table|actually|craft beer|beard oil|' +
                'banjo|VHS|vinyl|8-bit|readymade|blog|locavore|pickled|skateboard|disrupt|' +
                'salvia|millenial|bitters|cassette|stumptown|butcher|lomo|single-origin|coffee|' +
                'master cleanse|yr mixtape|messenger bag|jean shorts|synth|retro|' +
                'narwhal|occupy|Austin|tote bag|pug|umami|viral|semiotics|small batch|gluten-free|' +
                'fingerstache|YOLO|ethical|DIY|typewriter|organic|mumblecore|fixie|vegan|four dollar toast|' +
                'keytar|meggings|cray-cray|polaroid|truffaut|flannel|hella|gastropub|food truck').split('|');

    var punc = ('. . . ? . . . ! . . . ? . . .').split(' '); // weight periods


    hipsum.Config = function(wordArray, paragraphCount, sentenceCount, wordCount){

        // set x0.hipsum.words = ['foo','bar','etc'] for global custom word array
        this.wordArray = wordArray || hipsum.words || hipsum.wordArray || lingo;

        this.paragraphCount = function(){
            return x0.randomFromArray([].concat(paragraphCount || [1, 2, 3]));
        };

        this.sentenceCount = function(){
            return x0.randomFromArray([].concat(sentenceCount || [2, 3, 5]));
        };

        this.wordCount = function(){
            return x0.randomFromArray([].concat(wordCount || [9, 12, 15]));
        };

    };

    // generate sentences (text only)
    hipsum.sentences = function(wordArray, sentenceCount, wordCount){

        var output = [],
            temp   = [],
            i      = -1,
            ii     = -1,
            config = {};

        if (arguments[0] instanceof hipsum.Config) {
            config = arguments[0];
        }
        else {
            if (!x0.isArray(wordArray)) {
                wordCount = sentenceCount;
                sentenceCount = wordArray;
                wordArray = null;
            }
            config = new hipsum.Config(wordArray, 1, sentenceCount, wordCount);
        }

        while (++i < config.sentenceCount()) {
            temp = [];
            ii = -1;
            while (++ii < config.wordCount()) {
                temp.push(x0.randomFromArray(config.wordArray));
            }
            output.push(x0.sentenceCase(temp.join(' ')) + x0.randomFromArray(punc) + ' ');
        }

        return output.join(' ').replace(/\s+$/, '');
    };

    // generate ONE sentence (text only),
    // optionally specifying word count
    hipsum.sentence = function(wordArray, wordCount){

        if (!x0.isArray(wordArray)) {
            wordCount = wordArray;
            wordArray = null;
        }

        var config = new hipsum.Config(wordArray, 1, 1, wordCount);

        return hipsum.sentences(config);
    };

    // generate Title Case Text,
    // optionally specifying word count
    hipsum.title = function(wordArray, wordCount){
        return x0.titleCase(hipsum.sentence.apply(this, arguments).slice(0, -1));
    };

    // generate string appropriate for use
    // in an HTML element id attribute:
    // starts with letter and has only
    // letters, numbers, and hyphens
    // optionally appending the time in ms
    hipsum.id = function(wordArray, wordCount, prefix, time){

        if (!x0.isArray(wordArray)) {
            time = prefix;
            prefix = wordCount;
            wordCount = wordArray;
            wordArray = null;
        }

        var config = new hipsum.Config(wordArray, 1, 1, wordCount || 2);

        var id = hipsum.sentences(config);

        if (prefix) {
            id = prefix + '-' + id;
        }

        if (time) {
            id += ('-' + Date.now());
        }

        return id.replace(/^[^A-Za-z]/, 'x-$&').// starts with other than a letter
        replace(/[^A-Za-z0-9]/g, '-').// remove non-alphanumeric
                 replace(/\-+/g, '-').// remove any multiple hyphens that were created
                 slice(0, -1).toLowerCase(); // remove punctuation and lowercaserize

    };

    // generate paragraphs (HTML with <p> tags)
    hipsum.paragraphs = function(wordArray, paragraphCount, sentenceCount, wordCount){

        if (!x0.isArray(wordArray)) {
            wordCount = sentenceCount;
            sentenceCount = paragraphCount;
            paragraphCount = wordArray;
            wordArray = null;
        }

        var config = new hipsum.Config(wordArray, paragraphCount, sentenceCount, wordCount);

        var output = '', i = -1;

        while (++i < config.paragraphCount()) {
            output += ('<p class="hipsum">' + hipsum.sentences(config) + '</p>');
        }

        return output;
    };

    // generate ONE paragraph (with <p></p>),
    // optionally specifying sentence and word count
    hipsum.paragraph = function(wordArray, sentenceCount, wordCount){

        if (!x0.isArray(wordArray)) {
            wordCount = sentenceCount;
            sentenceCount = wordArray;
            wordArray = null;
        }

        return hipsum.paragraphs(wordArray, 1, sentenceCount, wordCount);
    };


    hipsum.fromText = function(text, delim, paragraphCount, sentenceCount, wordCount){

        delim = x0.isNumber(delim) ? delim : /\s+/;

        return hipsum.paragraphs(text.split(delim), paragraphCount, sentenceCount, wordCount);

    };


    x0.hipsum = hipsum;


})();
