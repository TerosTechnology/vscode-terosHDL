// Copyright (c) 2019 Rich J. Young

import {
    CompletionItem,
    CompletionItemKind,
    languages,
    Position,
    TextDocument,
    workspace
} from 'vscode';

const packages = {
    std: {
        detail: 'Standard Package',
        packages: [
            {
                label: 'standard',
                documentation:
                    'Package STANDARD predefines a number of types, subtypes, and functions. An implicit context clause naming this package is assumed to exist at the beginning of each design unit.'
            },
            {
                label: 'env',
                documentation:
                    'Package ENV contains declarations that provide a VHDL interface to the host environment.'
            },
            {
                label: 'textio',
                documentation:
                    'Package TEXTIO contains declarations of types and subprograms that support formatted I/O operations on text files.'
            }
        ]
    },
    ieee: {
        detail: 'IEEE Package',
        packages: [
            {
                label: 'std_logic_1164',
                documentation:
                    'Standard multivalue logic package.  This packages defines a standard for designers to use in describing the interconnection data types used in VHDL modeling.'
            },
            {
                label: 'numeric_std',
                documentation:
                    'This package defines numeric types and arithmetic functions for use with synthesis tools.'
            },
            {
                label: 'math_real',
                documentation:
                    'This package defines a standard for designers to use in describing VHDL models that make use of common REAL constants and common REAL elementary mathematical functions.'
            },
            {
                label: 'math_complex',
                documentation:
                    'This package defines a standard for designers to use in describing VHDL models that make use of common COMPLEX constants and common COMPLEX mathematical functions and operators.'
            },
            {
                label: 'float_pkg',
                documentation:
                    'This packages defines basic binary floating point arithmetic functions.'
            },
            {
                label: 'fixed_pkg',
                documentation:
                    'This packages defines basic binary fixed point arithmetic functions.'
            }
        ]
    }
};

export const VhdlStdPackageCompletionItemProvider = languages.registerCompletionItemProvider(
    { scheme: '*', language: 'vhdl' },
    {
        provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
            let linePrefix = document.lineAt(position).text.substr(0, position.character);
            for (const lib in packages) {
                if (packages.hasOwnProperty(lib)) {
                    const library = packages[lib];
                    if (linePrefix.toLowerCase().endsWith(lib + '.')) {
                        return library.packages.map(pkg => {
                            // let item = new CompletionItem(pkg.label.toUpperCase());
                            let item = new CompletionItem(pkg.label.toLocaleLowerCase());

                            item.kind = CompletionItemKind.Module;
                            item.detail = library.detail;
                            item.documentation = pkg.documentation;
                            // switch (conf.get('suggestPackageCase')) {
                            //     case 'upper':
                            //         item.insertText = pkg.label.toUpperCase() + '.all';
                            //         break;
                            //     case 'lower':
                            //         item.insertText = pkg.label.toLowerCase() + '.all';
                            //         break;
                            // }
                            item.insertText = pkg.label.toLowerCase() + '.all';
                            return item;
                        });
                    }
                }
            }
        }
    },
    '.'
);