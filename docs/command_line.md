# Command line

## Installation

- From the code:

```
npm install
npm run compile
```

- With the installers: https://github.com/TerosTechnology/colibri2/releases

## Formatter

- Arguments:

```
carlos@carlos-pc:~/repo/colibri2 ./bin/run teroshdl:formatter --help
Format HDL files.

USAGE
  $ teroshdl teroshdl:formatter -i <value> --formatter standalone_vhdl|istyle|s3sv|verible [--mode only-check|format] [--python-path <value>] [--formatter-arguments <value>] [-s] [-v]

FLAGS
  -i, --input=<value>            (required) Path CSV with a list of files or glob pattern. E.g: --input "/mypath/*.vhd"
  -s, --silent                   Silent mode
  -v, --verbose                  Verbose mode
  --formatter=<option>           (required) [default: standalone_vhdl] Formatter name
                                 <options: standalone_vhdl|istyle|s3sv|verible>
  --formatter-arguments=<value>  Arguments passed to the formatter.
  --mode=<option>                [default: only-check] Opeation mode. Format and save the formatted code or only check
                                 <options: only-check|format>
  --python-path=<value>          Python path. Empty to use the system path.

DESCRIPTION
  Check errors in HDL files.
```

- Example:

```
./bin/run teroshdl:formatter --input ./tests/command/template/helpers/sample_0.vhd --mode only-check
```

## Linter

```
Check errors in HDL files.

USAGE
  $ teroshdl teroshdl:linter -i <value> --linter ghdl|icarus|modelsim|svling|verilbe|verilator|vsg|xvhdl|xvlog [--html <value>] [--html-detailed <value>] [--junit
    <value>] [--json-format <value>] [--compact <value>] [--linter-path <value>] [--linter-arguments <value>] [-s] [-v]

FLAGS
  -i, --input=<value>         (required) Path CSV with a list of files or glob pattern. E.g: --input "/mypath/*.vhd"
  -s, --silent                Silent mode
  -v, --verbose               Verbose mode
  --compact=<value>           Compact report path. E.g: report.txt
  --html=<value>              HTML report path. E.g: report.html
  --html-detailed=<value>     HTML detailed report path. E.g: report.html
  --json-format=<value>       JSON report path. E.g: report.xml
  --junit=<value>             JUnit report path. E.g: report.xml
  --linter=<option>           (required) [default: ghdl] Linter name
                              <options: ghdl|icarus|modelsim|svling|verilbe|verilator|vsg|xvhdl|xvlog>
  --linter-arguments=<value>  Arguments passed to the linter.
  --linter-path=<value>       Directory to the location where tool binary is located. Empty to use the system path.

DESCRIPTION
  Check errors in HDL files.
```

- Example:

```
./bin/run teroshdl:linter --input "./tests/command/linter/helpers/*.vhd" --junit report.xml --html report.html --html-detailed report-detailed.html --compact report.txt
```

### Output format: Compact

```
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_0.vhd: line 13, col 18, Error - ':' is expected instead of ';' (':' is expected instead of ';')
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_0.vhd: line 13, col 18, Error - type mark expected in a subtype indication (type mark expected in a subtype indication)
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_0.vhd: line 18, col 0, Error - '<=' is expected instead of 'end' ('<=' is expected instead of 'end')
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_0.vhd: line 18, col 0, Error - primary expression expected (primary expression expected)
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_0.vhd: line 16, col 19, Error - ';' expected at end of signal assignment (';' expected at end of signal assignment)
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_0.vhd: line 16, col 19, Error - (found: 'end') ((found: 'end'))
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_1.vhd: line 23, col 18, Error - no declaration for "sstd_logic" (no declaration for "sstd_logic")
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_1.vhd: line 33, col 44, Error - no declaration for "insput2" (no declaration for "insput2")
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_1.vhd: line 34, col 32, Error - can't associate 'wire' with signal interface "x" (can't associate 'wire' with signal interface "x")
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_1.vhd: line 34, col 32, Error - (type of 'wire' is std_logic) ((type of 'wire' is std_logic))
/home/teroshdl/repo/colibri2/tests/command/linter/helpers/sample_1.vhd: line 23, col 12, Error - (type of signal interface "x" is an erroneous type) ((type of signal interface "x" is an erroneous type))

11 problems
```

### Output format: HTML

You can see an example of the linter report here [here](https://terostechnology.github.io/colibri2/example_report_linter_html.html)

### Output format: HTML detailed

You can see an example of the linter report here [here](https://terostechnology.github.io/colibri2/example_report_linter_html_detailed.html)

### Output format: JUnit

```
<?xml version="1.0" encoding="utf-8"?>
<testsuites>
<testsuite package="GHDL" time="0" tests="6" errors="6" name="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0.vhd">
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0"><failure message="&apos;:&apos; is expected instead of &apos;;&apos;"><![CDATA[line 13, col 18, Error - &apos;:&apos; is expected instead of &apos;;&apos; (':' is expected instead of ';')]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0"><failure message="type mark expected in a subtype indication"><![CDATA[line 13, col 18, Error - type mark expected in a subtype indication (type mark expected in a subtype indication)]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0"><failure message="&apos;&lt;=&apos; is expected instead of &apos;end&apos;"><![CDATA[line 18, col 0, Error - &apos;&lt;=&apos; is expected instead of &apos;end&apos; ('<=' is expected instead of 'end')]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0"><failure message="primary expression expected"><![CDATA[line 18, col 0, Error - primary expression expected (primary expression expected)]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0"><failure message="&apos;;&apos; expected at end of signal assignment"><![CDATA[line 16, col 19, Error - &apos;;&apos; expected at end of signal assignment (';' expected at end of signal assignment)]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0"><failure message="(found: &apos;end&apos;)"><![CDATA[line 16, col 19, Error - (found: &apos;end&apos;) ((found: 'end'))]]></failure></testcase>
</testsuite>
<testsuite package="GHDL" time="0" tests="5" errors="5" name="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_1.vhd">
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_1"><failure message="no declaration for &quot;sstd_logic&quot;"><![CDATA[line 23, col 18, Error - no declaration for &quot;sstd_logic&quot; (no declaration for "sstd_logic")]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_1"><failure message="no declaration for &quot;insput2&quot;"><![CDATA[line 33, col 44, Error - no declaration for &quot;insput2&quot; (no declaration for "insput2")]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_1"><failure message="can&apos;t associate &apos;wire&apos; with signal interface &quot;x&quot;"><![CDATA[line 34, col 32, Error - can&apos;t associate &apos;wire&apos; with signal interface &quot;x&quot; (can't associate 'wire' with signal interface "x")]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_1"><failure message="(type of &apos;wire&apos; is std_logic)"><![CDATA[line 34, col 32, Error - (type of &apos;wire&apos; is std_logic) ((type of 'wire' is std_logic))]]></failure></testcase>
<testcase time="0" name="GHDL" classname="/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_1"><failure message="(type of signal interface &quot;x&quot; is an erroneous type)"><![CDATA[line 23, col 12, Error - (type of signal interface &quot;x&quot; is an erroneous type) ((type of signal interface "x" is an erroneous type))]]></failure></testcase>
</testsuite>
</testsuites>
```

## Templates

```
carlos@carlos-pc:~/repo/colibri ./bin/run teroshdl:template --help
Generate HDL template from a file.

USAGE
  $ teroshdl teroshdl:template [-i <value>] [-o <value>] [-m
    cocotb|testbench|vunit_testbench|instance|signal|mix_instance|mix_testbench|mix_vunit_testbench|testbench|vunit_testbench|component|instance|signal|mix_instance|mix_testbench|mix_vunit_t
    estbench] [--indent <value>] [--header <value>] [--clock ifelse|inline] [--instance oneline|separate] [-s]

FLAGS
  -i, --input=<value>   HDL (VHDL, Verilog or SV) input file
  -m, --mode=<option>   [default: instance] Template mode
                        <options: cocotb|testbench|vunit_testbench|instance|signal|mix_instance|mix_testbench|mix_vunit_testbench|testbench|vunit_testbench|component|instance|signal|mix_inst
                        ance|mix_testbench|mix_vunit_testbench>
  -o, --output=<value>  [default: template] Output file path. E.g: template.sv
  -s, --show_modes      Show modes description
  --clock=<option>      [default: inline] Clock generation style. With if/else or in one line
                        <options: ifelse|inline>
  --header=<value>      File path with the template header (as company license). It will be inserted at be beginning
  --indent=<value>      [default:   ] Indent
  --instance=<option>   [default: oneline] Instance style for VHDL. Only with entity or with entity + component
                        <options: oneline|separate>

DESCRIPTION
  Generate HDL template from a fil
```

- Example:

```
./bin/run teroshdl:template --input ./tests/command/template/helpers/sample_0.vhd --mode testbench --output template.vhd
```