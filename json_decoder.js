var open_brace = {
    'python': '{',
    'matlab': 'struct(',
    'r': 'list('
};

var close_brace = {
    'python': '}',
    'matlab': ')',
    'r': ')'
};

var key_left = {
    'python': '"',
    'matlab': "'",
    'r': '' 
};

var key_right = {
    'python': '"',
    'matlab': "'",
    'r': '' 
};

var kv_seperator = {
    'python': ': ',
    'matlab': ', ',
    'r': ' = '
};

var quoties = {
    'python': '"',
    'matlab': "'",
    'r': '"'
};

var True = {
    'python': 'True',
    'matlab': 'true',
    'r': 'TRUE'  
};

var False = {
    'python': 'False',
    'matlab': 'false',
    'r': 'FALSE'  
};

var NAN = {
    'python': 'None',
    'matlab': 'NaN',
    'r': 'NaN'
};

var Null = {
    'python': 'None',
    'matlab': 'NaN',
    'r': 'Null'
};

var open_str_array = {
    'python': '[',
    'matlab': '{ {',
    'r': 'c('
};

var close_str_array = {
    'python': ']',
    'matlab': '} }',
    'r': ')'
};

var open_obj_array = {
    'python': '[',
    'matlab': '{',
    'r': 'list('
};

var close_obj_array = {
    'python': ']',
    'matlab': '}',
    'r': ')'
};


var prettyprint = true;

var eol = {
    python: '',
    matlab: '...',
    r: ''
};

String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
};

var whatis = Object.prototype.toString;

var level = 0;

function object_decoder(obj,lang){
    var n = Object.keys(obj).length;
    var pp = prettyprint && n > 1;
    level += 1;
    var str = open_brace[lang]+( pp ? eol[lang]+'\n' : '');
    for(var i in obj){
        str += (pp ? '\t'.repeat(level) : '')+
                key_left[lang]+i+key_right[lang]+kv_seperator[lang]+
                JSON_decoder(obj[i], lang)+', '+
                (pp ? eol[lang]+'\n' : '');
    }
    level -= 1;
    str = str.substr(0, str.length-(2 + (pp ? eol[lang]+'\n' : '').length)) +
        (pp ? eol[lang]+'\n'+'\t'.repeat(level) : '') +
        close_brace[lang];
    return str;
}

function array_decoder(arr,lang){
    var str = '';
    if(arr.length>0){
        // this'll break for mixies
        if(whatis.call(arr[0]) === '[object Number]'){
            str += '[';
        } else if(whatis.call(arr[0]) === '[object String]') {
            str += open_str_array[lang];
        } else{
            str += open_obj_array[lang];
        }
    } 
    for(var i in arr){
        str += JSON_decoder(arr[i], lang) + ', ';
    }

    if(arr.length>0){
        str = str.substr(0, str.length-2);
        if(whatis.call(arr[0]) === '[object Number]'){
            str += ']';
        } else if(whatis.call(arr[0]) === '[object String]') {
            str += close_str_array[lang];
        } else{
            str += close_obj_array[lang];
        }
    } else{
        str = open_obj_array[lang] + close_obj_array[lang];
    }

    return str;
}

function JSON_decoder(val, lang){
    /*
    Convert JSON objects to their Python, MATLAB, Perl, ... equivalents
    */

    var dec = ''; // decoded object
    if(whatis.call(val) === '[object Object]'){
        dec = object_decoder(val, lang);
    } else if(whatis.call(val) === '[object Array]'){
        dec = array_decoder(val, lang);
    } else if(whatis.call(val) === '[object String]'){
        dec = quoties[lang]+val+quoties[lang];
    } else if(whatis.call(val) === '[object Boolean]'){
        if(val === false){
            dec += False[lang];
        } else {
            dec += True[lang];
        }
    } else if(whatis.call(val) === '[object Number]'){
        if(isNaN(val)){
            dec += NAN[lang];
        } else{
            dec = String(val);
        }
    } else if(whatis.call(val) === '[object Null]'){
        dec = Null[lang];
    }
    return dec;
}

data = [{
        name: 'trace 1',
        x: [1,2,3], 
        y: [4,5,6], 
        text: ['this', 'that', 'the other', 'thing'], 
        marker: {color: 'blue'}, 
        line: {color: ['orange', 'red', 'pink']}
    },
    {'x': [1,2,3,4],
     'y': [10,11,12,13],
     'marker':{
        'size': [12, 22, 32, 42],
        'color': ['hsl(0,100,40)', 'hsl(33,100,40)', 'hsl(66,100,40)', 'hsl(99,100,40)'],
        'opacity':[0.60, 0.70, 0.80, 0.90]
     },
     'mode': 'markers'
     },
     {'x': [1,2,3,4],
     'y': [11,12,13,14],
     'marker':{
        'color': 'rgb(31, 119, 180)',
        'size': 18,
        'symbol': ['circle', 'square', 'diamond', 'cross']
     },
     'mode': 'markers'
     },
     {'x': [1,2,3,4],
     'y': [12,13,14,15],
     'marker':{
        'size': 18,
        'line':{
            'color': ['rgb(120,120,120)', 'rgb(120,120,120)', 'red', 'rgb(120,120,120)'],
            'width': [2, 2, 6, 2]
        }
     },
     'mode': 'markers'
     }
];

layout = {'title': 'test', 
        'xaxis': {'range': [0, 10], 'title': 'xaxis title'},
        'yaxis': {'title': 'yaxis title'}};


console.log(JSON_decoder(data, 'python'));
console.log(JSON_decoder(data, 'matlab'));
