# More tests

## Parser

-   Diferentes versiones de puertos ANSI y no ANSI.
-   State machines.
-   Interfaces en entity y package.
-   Test over_comment and inline_comment

## Documenter

-   Documenter section test fsm
-   Documenter section test custom section
-   En documenter revisar todos el svg_path
-   Test completos del documenter con casos de prueba

# Bugs


## Linter

-   Modelsim linter falla con path con espacio

## Project manager

-   Project manager no acepta nombres con espacio?

# Features

## Parser

-   Itroducir un estado de error en hdl_element

# Templates

-   En las templates cuando falla el parser todo continua y se genera una template vacía.
-   Custom indent en templates dependiendo del lenguaje.
-   Default value para generics con Verilog.

# VSCode

-   Project examples como submodulo
-   Borrar las carpetas de out de los tests
-   Revisar todos los paths para ficheros para windows
-   Comprobar que hay log cuando hay acciones en vscode.
-   Repasar:

```
    "activationEvents": [
        "*",
https://code.visualstudio.com/api/references/activation-events#Start-up
```


# Project manager

-   E (A) y el (M) fallan

(node:157849) [DEP0147] DeprecationWarning: In future versions of Node.js, fs.rmdir(path, { recursive: true }) will be removed. Use fs.rm(path, { recursive: true }) instead
