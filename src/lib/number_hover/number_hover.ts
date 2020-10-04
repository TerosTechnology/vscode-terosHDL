import * as vscode from 'vscode';

export function vhdl_hover(document, position, token) {
  let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\"]*/g);
  if (wordRange !== undefined) {
    let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
    if (/x"[0-9a-fA-F_]+"/g.test(leadingText)) {
      const regex = /x"([0-9a-fA-F_]+)"/g;
      let number = regex.exec(leadingText.replace('_', ''));
      if (number === null || number[1] === null) {
        return;
      }
      let x = parseInt(number[1], 16);
      let x1 = eval_signed_hex(number[1], x);
      if (x === x1) {
        return new vscode.Hover(leadingText + ' = ' + x);
      } else {
        return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned)  || ' + x1 + ' (signed)');
      }
    }
    else if (/[0-1_]+"/g.test(leadingText)) {
      const regex = /([0-1_]+)"/g;
      let number = regex.exec(leadingText.replace('_', ''));
      if (number === null || number[1] === null) {
        return;
      }
      let x = parseInt(number[0], 2);
      let x1 = eval_signed_bin(number[0], x);
      if (x === x1) {
        return new vscode.Hover('"' + leadingText + ' = ' + x);
      } else {
        return new vscode.Hover('"' + leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
      }
    }
  }
}

export function verilog_hover(document, position, token) {
  let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\']*/g);
  if (wordRange !== undefined) {
    let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
    if (/h[0-9a-fA-F_]+/g.test(leadingText)) {
      const regex = /h([0-9a-fA-F_]+)/g;
      let number = regex.exec(leadingText.replace('_', ''));
      if (number === null || number[1] === null) {
        return;
      }
      let x = parseInt(number[1], 16);
      let x1 = eval_signed_hex(number[1], x);
      if (x === x1) {
        return new vscode.Hover(leadingText + ' = ' + x);
      } else {
        return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
      }
    }
    else if (/b[0-1_]+/g.test(leadingText)) {
      const regex = /b([0-1_]+)/g;
      let number = regex.exec(leadingText.replace('_', ''));
      if (number === null || number[1] === null) {
        return;
      }
      let x = parseInt(number[1], 2);
      let x1 = eval_signed_bin(number[1], x);
      if (x === x1) {
        return new vscode.Hover(leadingText + ' = ' + x);
      } else {
        return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
      }
    }
    else if (/o[0-8_]+/g.test(leadingText)) {
      const regex = /o([0-7_]+)/g;
      let number = regex.exec(leadingText.replace('_', ''));
      if (number === null || number[1] === null) {
        return;
      }
      let x = parseInt(number[1], 8);
      let x1 = eval_signed_oct(number[1], x);
      if (x === x1) {
        return new vscode.Hover(leadingText + ' = ' + x);
      } else {
        return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
      }
    }
  }
}


function eval_signed_hex(number_s, int_number) {
  let pow_hex = Math.pow(16, number_s.length);
  let x1 = int_number;
  if (int_number >= pow_hex >> 1) {
    x1 = int_number - pow_hex;
  }
  return x1;
}

function eval_signed_bin(number_s, int_number) {
  let pow_bin = 1 << number_s.length - 1;
  let x1 = int_number;
  if (int_number >= pow_bin >> 1) {
    x1 = int_number - pow_bin;
  }
  return x1;
}

function eval_signed_oct(number_s, int_number) {
  let pow_oct = Math.pow(8, number_s.length);
  let x1 = int_number;
  if (int_number >= pow_oct >> 1) {
    x1 = int_number - pow_oct;
  }
  return x1;
}