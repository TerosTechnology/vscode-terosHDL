(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
console.log("entra")


var code = `
module addbit (
    a      , // first input
    b      , // Second input
    ci     , // Carry input
    sum    , // sum output
    co       // carry output
    );
    //Input declaration
    input a;
    input b;
    input ci;
    //Ouput declaration
    output sum;
    output co;
    //Port Data types
    wire  a;
    wire  b;
    wire  ci;
    wire  sum;
    wire  co;
    //Code starts here
    assign {co,sum} = a + b + ci;
    
    endmodule // End of Module addbit

`;

var code2 = `
//-----------------------------------------------------
// This is simple adder Program
// Design Name : adder_implicit
// File Name   : adder_implicit.v
// Function    : This program shows how implicit
//               port connection are done
// Coder       : Deepak Kumar Tala
//-----------------------------------------------------
module adder_implicit (
result        , // Output of the adder
carry         , // Carry output of adder
r1            , // first input
r2            , // second input
ci              // carry input
);

// Input Port Declarations       
input    [3:0]   r1         ;
input    [3:0]   r2         ;
input            ci         ;

// Output Port Declarations
output   [3:0]  result      ;
output          carry       ;

// Port Wires
wire     [3:0]    r1        ;
wire     [3:0]    r2        ;
wire              ci        ;
wire     [3:0]    result    ;
wire              carry     ;

// Internal variables
wire              c1        ;
wire              c2        ;
wire              c3        ;

// Code Starts Here
addbit u0 (
r1[0]           ,
r2[0]           ,
ci              ,
result[0]       ,
c1
);

addbit u1 (
r1[1]          ,
r2[1]          ,
c1             ,
result[1]      ,
c2
);

addbit u2 (
r1[2]          ,
r2[2]          ,
c2             ,
result[2]      ,
c3
);

addbit u3 (
r1[3]          ,
r2[3]          ,
c3             ,
result[3]      ,
carry
); 

endmodule // End Of Module adder  

`;


// needed for YosysJS.dot_to_svg() and YosysJS.dot_into_svg()
YosysJS.load_viz();







var ys = YosysJS.create('', on_ys_ready);
ys.logprint = true;


function handle_run_errors(logmsg, errmsg) {
    if (errmsg != "") {
        window.alert(errmsg);
        document.getElementById('popup').style.visibility = 'hidden';
    }
}


function on_ys_ready() {
    // Print all Yosys output messages to the iframe
    ys.verbose = false;

    // Print all Yosys output messages to the JavaScript console
    ys.logprint = true;

    // Echo back commands
    ys.echo = false;
    console.log("pasa1")

    var textarea = document.querySelector('textarea');
    console.log("pasa4")
    // console.log(code);

    ys.write_file('code.v', code);
    ys.run('read_verilog code.v');
    // ys.write_file('code2.v', code2);
    // ys.run('read_verilog code2.v');
    ys.run('prep -top adder_implicit');

    // ys.run('synth -run coarse; synth -run fine;');


    ys.write_file("code.v", code);
    ys.run('design -reset; read_verilog code.v; show -stretch', handle_run_errors);

    console.log("pasa3")
}





// var superagent = require('superagent');
// var json5 = require('json5');
// var netlistSvg = require('../built');
// var up3down5 = require('../test/digital/up3down5.json');

// var skins = ['lib/default.svg', 'lib/analog.svg'];

// var textarea = document.querySelector('textarea');
// var skinSelect = document.querySelector('#skinSelect');
// var renderButton = document.querySelector('#renderButton');
// var formatButton = document.querySelector('#formatButton');
// var svgArea = document.querySelector('#svgArea');

// textarea.value = json5.stringify(up3down5, null, 4);

// skins.forEach(function (skinPath, i) {
//     superagent.get(skinPath).end(function (err, r) {
//         var option = document.createElement('option');
//         option.selected = i === 0;
//         option.value = r.text;
//         option.text = skinPath;
//         skinSelect.append(option);
//     });
// });

// function render() {
//     var netlist = json5.parse(textarea.value);
//     netlistSvg.render(skinSelect.value, netlist, function (e, svg) {
//         svgArea.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
//     });
// }

// function format() {
//     var netlist = json5.parse(textarea.value);
//     textarea.value = json5.stringify(netlist, null, 4);
// }

// renderButton.onclick = render;
// formatButton.onclick = format;





},{}]},{},[1]);
