import re as re
import os
import functools

# regular expression for signal/variable declaration:
#   start of line follow by 1 to 4 word,
#   an optionnal array size,
#   an optional list of words
#   the signal itself (not part of the regular expression)
re_bw = r"[\w\*\(\)\/><\:\-\+`\$\s]+"
re_var = (
    r"^\s*(\w+\s+)?(\w+\s+)?([A-Za-z_][\w\:\.]*\s+)(\["
    + re_bw
    + r"\])?\s*([A-Za-z_][\w=,\s]*,\s*)?\b"
)
re_decl = (
    r"(?:^|,|(?:\w|\)|#)\s*\(|;)\s*(?:const\s+)?(\w+\s+)?(\w+\s+)?(\w+\s+)?([A-Za-z_][\w\:\.]*\b\s*)((?:\["
    + re_bw
    + r"\]\s*)*)((?:[A-Za-z_]\w*(?:\s*\[[^=\^\&\|,;]*?\]\s*)?(?:\=\s*[\w\.\:]+\s*)?,\s*)*)\b"
)
re_enum = (
    r"^\s*(typedef\s+)?(enum)\s+(\w+\s*)?(\["
    + re_bw
    + r"\])?\s*(\{[^\}]+\})\s*([A-Za-z_][\w=,\s]*,\s*)?\b"
)
re_union = r"^\s*(typedef\s+)?(struct|union|`\w+)\s+(packed\s+)?(signed|unsigned)?\s*(\{[\w,;\s`\[\:\]\/\*\+\-><\(\)\$]+\})\s*([A-Za-z_][\w=,\s]*,\s*)?\b"
re_tdp = r"^\s*(typedef\s+)(\w+)\s*(#\s*\(.*?\))?\s*()\b"
re_inst = r"^\s*(virtual)?(\s*)()(\w+)\s*(#\s*\([^;]+\))?\s*()\b"
re_param = r"^\s*parameter\b((?:\s*(?:\w+\s+)?(?:[A-Za-z_]\w+)\s*=\s*(?:[^,;]*)\s*,)*)(\s*(\w+\s+)?([A-Za-z_]\w+)\s*=\s*([^,;]*)\s*;)"

# Port direction list constant
port_dir = ["input", "output", "inout", "ref"]


def clean_comment(text):
    def replacer(match):
        s = match.group(0)
        # Handle special case of ( * ) to not mistake with (* *)
        if match.group(1) == "*":
            return s
        if s.startswith("/") or s.startswith("("):
            return " "  # note: a space and not an empty string
        else:
            return s

    pattern = re.compile(
        r'//.*?$|/\*.*?\*/|\(\s*(\*)\s*\)|\(\*.*?\*\)|"(?:\\.|[^\\"])*"',
        re.DOTALL | re.MULTILINE,
    )
    # do we need trim whitespaces?
    # txt_clean = re.sub(pattern, replacer, text)
    # return re.sub(r'^\s*$', '', txt_clean, flags = re.MULTILINE)
    return re.sub(pattern, replacer, text)


# Extract declaration of var_name from a file
def get_type_info_file(fname, var_name):
    # print("Parsing file " + fname + " for variable " + var_name)
    fdate = os.path.getmtime(fname)
    ti = get_type_info_file_cache(fname, var_name, fdate)
    # print(get_type_info_file_cache.cache_info())
    return ti


@functools.lru_cache(maxsize=32)
def get_type_info_file_cache(fname, var_name, fdate):
    with open(fname) as f:
        flines = f.read()
        ti = get_type_info(flines, var_name)
    return ti


# Extract the declaration of var_name from txt
def get_type_info(txt, var_name, search_decl=True):
    ti_not_found = {
        "decl": None,
        "type": None,
        "array": "",
        "bw": "",
        "name": var_name,
        "tag": "",
        "value": None,
    }
    txt = clean_comment(txt)
    m = re.search(
        r"(?s)" + re_enum + r"(" + var_name + r")\b.*$", txt, flags=re.MULTILINE
    )
    # print('[get_type_info] var = {}'.format(var_name))
    # print('[get_type_info] text = {}'.format(txt))
    # print('[get_type_info] RE = {}'.format(re_enum+r'('+var_name+r')\b.*$'))
    if m:
        # print('[get_type_info] {} type is Enum'.format(var_name))
        return get_type_info_from_match(var_name, m, 1, 3, 5, -1, "enum")[0]
    # Struct
    m = re.search(re_union + r"(" + var_name + r")\b.*$", txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is struct'.format(var_name))
        return get_type_info_from_match(var_name, m, 1, 3, 5, -1, "struct")[0]
    # Typedef
    m = re.search(re_tdp + r"(" + var_name + r")\b\s*;.*$", txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is typedef'.format(var_name))
        return get_type_info_from_match(var_name, m, 1, 3, 3, -1, "typedef")[0]
    #
    if not search_decl:
        return ti_not_found
    # Clocking block
    m = re.search(r"(?s)\b(clocking)\s+(" + var_name + r")(.*?)endclocking\b", txt)
    if m:
        # print('[get_type_info] {} type is Clocking'.format(var_name))
        return get_clocking_info(var_name, m.group(3))
    # Signal declaration
    re_str = (
        re_decl
        + r"("
        + var_name
        + r"\b\s*((?:\[[^=\^\&\|,;]*?\]\s*)*))(\s*=\s*(\'\{.+?\}|\{.+?\}|[^,;]+))?[^\.]*?($|,|;)"
    )
    # print('[get_type_info] RE Decl = {}'.format(re_str))
    m = re.search(re_str, txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is a declaration'.format(var_name))
        return get_type_info_from_match(var_name, m, 3, 4, 5, 9, "decl")[0]
    # Instances
    m = re.search(re_inst + r"(" + var_name + r")\b.*$", txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is an instance'.format(var_name))
        return get_type_info_from_match(var_name, m, 3, 4, 5, 9, "inst")[0]
    return ti_not_found


# Extract the macro content from `define name macro_content
def get_macro(txt, name):
    txt = clean_comment(txt)
    m = re.search(
        r"(?s)^\s*`define\s+" + name + r"\b[ \t]*(?:\((.*?)\)[ \t]*)?(.*?)(?<!\\)\n",
        txt,
        re.MULTILINE,
    )
    if not m:
        return ""
    # remove line return
    macro = m.groups()[1].replace("\\\n", "")
    param_list = m.groups()[0]
    if param_list:
        param_list = param_list.replace("\\\n", "")
    # remove escape character for string
    macro = macro.replace('`"', '"')
    # TODO: Expand macro if there is some arguments
    return macro, param_list


# Extract all signal declaration
def get_all_type_info(txt, no_inst=False):
    # print('[get_all_type_info] \n'+txt)
    # Cleanup function contents since this can contains some signal declaration
    # print('[get_all_type_info] Cleanup functions/task')
    txt = re.sub(
        r"(?s)^[ \t]*(import|export)[ \t]*(\".*?\"[ \t]*)?(pure)?[ \t]*(?P<block>function|task)\b.*?;",
        "",
        txt,
        flags=re.MULTILINE,
    )
    txt = re.sub(r"(?s)^[ \t\w]*extern\b[^;]+;", "", txt, flags=re.MULTILINE)
    txt = re.sub(
        r"(?s)^[ \t\w]*(?P<block>function|task)\b.*?\bend(?P=block)\b.*?$",
        "",
        txt,
        flags=re.MULTILINE,
    )
    # Cleanup constraint definition
    # print('[get_all_type_info] Cleanup constraint')
    # txt = re.sub(r'(?s)constraint\s+\w+\s*\{\s*(?:[^\{\}]+(?:\{[^\{\}]*\})?)*?\s*\}','',txt,  flags=re.MULTILINE)
    constraint = [
        (m.group("name"), m.start(), m.end())
        for m in re.finditer(r"(?s)constraint\s+(?P<name>\w+)\s*\{", txt)
    ]
    for name, start, end in reversed(constraint):
        cnt = 1
        pos = end + 1
        while cnt > 0 and cnt < 64:
            m = re.search(r"{|}", txt[pos:])
            if not m:
                print(
                    "[SV] Error parsing constraint {}, unbalanced curly bracket !".format(
                        name
                    )
                )
                cnt = -1
            else:
                pos = pos + m.end() + 1
                cnt = cnt + 1 if m.group(0) == "{" else cnt - 1
                if cnt > 64:
                    print(
                        "[SV] Too many nested bracket in constraint {} !".format(name)
                    )
                    cnt = -1
        # print('Constraint {} going from {} to {} (cnt={})'.format(name,start,pos,cnt))
        if pos > start and cnt == 0:
            txt = txt[0:start] + txt[pos:]
    # print('[get_all_type_info] \n'+txt)
    # Suppose text has already been cleaned
    ti = []
    # Look all modports
    # print('[get_all_type_info] Look for modports')
    r = re.compile(r"(?s)modport\s+(\w+)\s*\((.*?)\);", flags=re.MULTILINE)
    modports = r.findall(txt)
    if modports:
        for modport in modports:
            ti.append(
                {
                    "decl": modport[1].replace("\n", ""),
                    "type": "",
                    "array": "",
                    "bw": "",
                    "name": modport[0],
                    "tag": "modport",
                }
            )
        # remove modports before looking for I/O and field to avoid duplication of signals
        txt = r.sub("", txt)
    # Look for clocking block
    # print('[get_all_type_info] Look for clocking block')
    r = re.compile(
        r"(?s)(default\s+)?(clocking)\s+(\w+)(.*?)endclocking(\s*:\s*\w+)?",
        flags=re.MULTILINE,
    )
    cbs = r.findall(txt)
    if cbs:
        for cb in cbs:
            ti.append(get_clocking_info(cb[2], cb[3]))
            # print('[get_all_type_info] Clocking: {}'.format(ti))
        # remove clocking block before looking for I/O and field to avoid duplication of signals
        txt = r.sub("", txt)
    # Look for enum declaration
    # print('[get_all_type_info] Look for enum declaration')
    r = re.compile(
        re_enum + r"(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*;", flags=re.MULTILINE
    )
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match("", m, 1, 3, 5, -1, "enum")
        # print('[get_all_type_info] enum groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x["type"]]
    # remove enum declaration since the content could be interpreted as signal declaration
    txt = r.sub("", txt)
    # Look for struct declaration
    # print('[get_all_type_info] Look for struct declaration')
    r = re.compile(
        re_union + r"(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*;", flags=re.MULTILINE
    )
    # print('[get_all_type_info] struct re="{0}"'.format(r.pattern))
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match("", m, 1, 3, 5, -1, "struct")
        # print('[get_all_type_info] struct groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x["type"]]
    # remove struct declaration since the content could be interpreted as signal declaration
    txt = r.sub("", txt)
    # Look for typedef declaration
    # print('[get_all_type_info] Look for typedef declaration')
    r = re.compile(
        re_tdp + r"(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*;", flags=re.MULTILINE
    )
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match("", m, 1, 3, 3, -1, "typedef")
        # print('[get_all_type_info] typedef groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x["type"]]
    # remove typedef declaration since the content could be interpreted as signal declaration
    txt = r.sub("", txt)
    # Look for signal declaration
    # print('[get_all_type_info] Look for signal declaration')
    # TODO: handle init value
    re_str = (
        re_decl
        + r"(\w+\b(\s*\[[^=\^\&\|,;\[\]]*?\]\s*)*)\s*(?:\=\s*(\'\{.+\}|[^;,]+)\s*)?(?=;|,|\)\s*;)"
    )
    # print('[get_all_type_info] decl re="{0}"'.format(re_str))
    r = re.compile(re_str, flags=re.MULTILINE)
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match("", m, 3, 4, 5, 8, "decl")
        # print('[get_all_type_info] decl groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x["type"]]
    # Look for interface instantiation
    if not no_inst:
        # print('[get_all_type_info] Look for interface instantiation')
        re_str = re_inst + r"(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*\("
        r = re.compile(re_str, flags=re.MULTILINE)
        # print('[get_all_type_info] inst re="{0}"'.format(re_str))
        for m in r.finditer(txt):
            ti_tmp = get_type_info_from_match("", m, 3, 4, 5, -1, "inst")
            # print('[get_all_type_info] inst groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
            ti += [x for x in ti_tmp if x["type"]]
    # print('[get_all_type_info] {0}'.format(ti))
    # Look for non-ansi declaration where a signal is declared twice (I/O then reg/wire) and merge it into one declaration
    ti_dict = {}
    pop_list = []
    for i, x in enumerate(ti[:]):
        if x["name"] in ti_dict:
            ti_index = ti_dict[x["name"]][1]
            # print('[get_all_type_info] Duplicate found for %s => %s and %s' %(x['name'],ti_dict[x['name']],x))
            if ti[ti_index]["type"].split()[0] in port_dir:
                ti[ti_index]["decl"] = ti[ti_index]["decl"].replace(
                    ti[ti_index]["type"],
                    ti[ti_index]["type"].split()[0] + " " + x["type"],
                )
                ti[ti_index]["type"] = x["type"]
                pop_list.append(i)
        else:
            ti_dict[x["name"]] = (x, i)
    for i in sorted(pop_list, reverse=True):
        ti.pop(i)
    # pprint.pprint(ti, width=200)
    return ti


# Get type info from a match object
def get_type_info_from_match(var_name, m, idx_type, idx_bw, idx_max, idx_val, tag):
    ti_not_found = {
        "decl": None,
        "type": None,
        "array": "",
        "bw": "",
        "name": var_name,
        "tag": tag,
        "value": None,
    }
    # return a tuple of None if not found
    if not m:
        return [ti_not_found]
    if not m.groups()[idx_type]:
        return [ti_not_found]
    line = m.group(0).strip()
    # print("[SV:get_type_info_from_match] varname={0} str='{7}' m={1} idx_type={2} idx_bw={3} idx_max={4},idx_val={5} tag={6}".format(var_name,m.groups(),idx_type,idx_bw,idx_max,idx_val,tag,line))
    # Extract the type itself: should be the mandatory word, except if is a sign qualifier
    t = str.rstrip(m.groups()[idx_type])
    # Remove potential false positive
    if t in [
        "begin",
        "end",
        "endcase",
        "endspecify",
        "else",
        "posedge",
        "negedge",
        "timeunit",
        "timeprecision",
        "assign",
        "disable",
        "property",
        "initial",
        "assert",
        "cover",
        "always_comb",
    ] or t.endswith("."):
        return [ti_not_found]
    t = t.split(".")[0]  # Handle interface with portmod (maybe add more checks)
    if t == "unsigned" or t == "signed":  # TODO check if other cases might happen
        if m.groups()[2] is not None:
            t = str.rstrip(m.groups()[2]) + " " + t
        elif m.groups()[1] is not None:
            t = str.rstrip(m.groups()[1]) + " " + t
        elif m.groups()[0] is not None and not m.groups()[0].startswith("end"):
            t = str.rstrip(m.groups()[0]) + " " + t
    elif (
        t == "const"
    ):  # identifying a variable as simply const is typical of a struct/union : look for it
        m = re.search(re_union + var_name + r".*$", line, flags=re.MULTILINE)
        if m is None:
            return [ti_not_found]
        t = m.groups()[1]
        idx_bw = 3
    # print("[SV:get_type_info_from_match] type={} Group => {}".format(t,str(m.groups())))
    value = None
    ft = ""
    bw = ""
    if var_name != "":
        signal_list = re.findall(
            r"(" + var_name + r")\b\s*((?:\[(.*?)\]\s*)*)",
            m.groups()[idx_max + 1],
            flags=re.MULTILINE,
        )
        if idx_val > 0 and len(m.groups()) > idx_val and m.groups()[idx_val]:
            value = str.rstrip(m.groups()[idx_val])
    else:
        signal_list = []
        re_str = r"(\w+)\b\s*((?:\[(.*)\]\s*)*)(?:\=\s*(\'\{.+?\}|[^;,]+)\s*)?,?"
        if m.groups()[idx_max]:
            signal_list = re.findall(re_str, m.groups()[idx_max], flags=re.MULTILINE)
            # print("[SV:get_type_info_from_match] idxmax => signal_list = " + str(signal_list))
        if m.groups()[idx_max + 1]:
            s = m.groups()[idx_max + 1]
            # print("[SV:get_type_info_from_match] idxmax+1 => s = " + str(s))
            if idx_val > 0 and len(m.groups()) > idx_val and m.groups()[idx_val]:
                s += " = " + m.groups()[idx_val]
            signal_list += re.findall(re_str, s, flags=re.MULTILINE)
            # print("[SV:get_type_info_from_match] idxmax+1 => signal_list = " + str(signal_list))
    # remove reserved keyword that could end up in the list
    signal_list = [
        s
        for s in signal_list
        if s[0]
        not in [
            "if",
            "case",
            "casex",
            "casez",
            "for",
            "foreach",
            "generate",
            "input",
            "output",
            "inout",
            "return",
        ]
    ]
    if not signal_list:
        return [ti_not_found]
    # print("[SV:get_type_info_from_match] signal_list = " + str(signal_list) + ' for line ' + line)
    # Concat the first 5 word if not None (basically all signal declaration until signal list)
    for i in range(0, idx_max):
        # print('[get_type_info_from_match] tag='+tag+ ' name='+str(signal_list)+ ' match (' + str(i) + ') = ' + str(m.groups()[i]).strip())
        if m.groups()[i] is not None:
            tmp = m.groups()[i].strip()
            if tmp:
                # Cleanup space in enum/struct declaration
                if i == 4 and t in ["enum", "struct"]:
                    tmp = re.sub(r"\s+", " ", tmp, flags=re.MULTILINE)
                # Cleanup spaces in bitwidth
                if i == idx_bw:
                    tmp = re.sub(r"\s+", "", tmp, flags=re.MULTILINE)
                    bw = tmp
                # regex can catch more than wanted, so filter based on a list
                if not tmp.startswith("end"):
                    ft += tmp + " "
    if not ft.strip():
        return [ti_not_found]
    ti = []
    if t == "class" and len(signal_list) == 1:
        # For class try to create a valid complete class declaration by adding at least the endclass
        # If the declaration was on more than one line assume it was because of parameters, and close parenthesis
        l = line.strip()
        if not l.endswith(";"):
            if l.endswith(","):
                l = l[:-1]
            l += ");"
        l += "\nendclass"
        ti.append(parse_class(l))
        if ti[0]:
            ti[0]["tag"] = "decl"
        else:
            ti[0] = ti_not_found
    else:
        for signal in signal_list:
            # print("signal: " + str(signal) )
            fts = ft + signal[0]
            # Check if the variable is an array and the type of array (fixed, dynamic, queue, associative)
            at = ""
            if signal[1] != "":
                fts += signal[1].strip()
                if signal[1].count("[") > 1:
                    at = "multidimension"
                elif signal[2] == "":
                    at = "dynamic"
                elif signal[2] == "$":
                    at = "queue"
                elif signal[2] == "*":
                    at = "associative"
                else:
                    ma = re.match(r"[A-Za-z_][\w]*$", signal[2])
                    if ma:
                        at = "associative"
                    else:
                        at = "fixed"
            if not value and len(signal) >= 4:
                value = signal[3]
            d = {
                "decl": fts,
                "type": t,
                "array": at,
                "bw": bw,
                "name": signal[0],
                "tag": tag,
                "value": value,
            }
            if at:
                d["array_dim"] = signal[1].strip()
            ft0 = ft.split()[0]
            if ft0 in ["local", "protected"]:
                d["access"] = ft0
            # TODO: handle init value inside list
            # print("Array: " + str(m) + "=>" + str(at))
            ti.append(d)
    return ti


def get_clocking_info(name, content):
    ports = []
    for m_port in re.finditer(r"input\s+([^;]+);", content):
        ports += [
            {"name": x.strip(), "type": "input"} for x in m_port.group(1).split(",")
        ]
    for m_oport in re.finditer(r"output\s+([^;]+);", content):
        ports += [
            {"name": x.strip(), "type": "output"} for x in m_port.group(1).split(",")
        ]
    ti = {
        "decl": "clocking " + name,
        "type": "clocking",
        "array": "",
        "bw": "",
        "name": name,
        "tag": "clocking",
        "port": ports,
    }
    # print('[get_clocking_info] {}'.format(ti))
    return ti


###############################################################################
# Parse a module for port/signal/instance/... information
def parse_module_file(fname, mname=r"\w+", inst_only=False, no_inst=False):
    # print("Parsing file " + fname + " for module " + mname)
    fdate = os.path.getmtime(fname)
    minfo = parse_module_file_cache(fname, mname, fdate, inst_only, no_inst)
    # print(parse_module_file_cache.cache_info())
    return minfo


@functools.lru_cache(maxsize=32)
def parse_module_file_cache(fname, mname, fdate, inst_only=False, no_inst=False):
    with open(fname) as f:
        flines = f.read()
        minfo = parse_module(flines, mname, inst_only, no_inst)
    return minfo


def parse_module(flines, mname=r"\w+", inst_only=False, no_inst=False):
    flines = clean_comment(flines)
    re_str = (
        r"(?s)(?P<type>module|interface)\s+(?P<name>"
        + mname
        + r")(?P<import>\s+import\s+.*?;)?\s*(#\s*\((?P<param>.*?)\))?\s*(\((?P<port>.*?)\))?\s*;(?P<content>.*?)(?P<ending>endmodule|endinterface)"
    )
    # print("[SV:parse_module] name={} -> re = {}".format(mname,re_str))
    # print("Parsing for module " + mname + ' in \n' + flines)
    m = re.search(re_str, flines, re.MULTILINE)
    if m is None:
        return None
    mname = m.group("name")
    txt = m.group(0)
    if inst_only:
        minfo = {
            "name": mname,
            "param": [],
            "port": [],
            "inst": [],
            "type": m.group("type"),
            "signal": [],
        }
        re_str = r"^[ \t]*(\w+)\s*(?:#\s*\([^;]+\))?\s*\b(\w+)\b(?:\s*\[[^=\^\&\|,;]*?\]\s*)?\s*\("
        li = re.findall(re_str, txt, flags=re.MULTILINE)
        for l in li:
            if l[0] not in [
                "module",
                "class",
                "interface",
                "begin",
                "end",
                "endcase",
                "endspecify",
                "else",
                "posedge",
                "negedge",
                "timeunit",
                "timeprecision",
                "assign",
                "disable",
                "property",
                "initial",
                "assert",
                "cover",
                "generate",
            ]:
                minfo["inst"].append({"type": l[0], "name": l[1]})
        return minfo
    # Extract list of param if any
    params_name = []
    params = extract_params(m)
    if params:
        params_name = [param["name"] for param in params]
    # Extract all type information inside the module : signal/port declaration, interface/module instantiation
    if m.group("param"):
        txt = txt.replace(m.group("param"), "")
    ati = []
    if m.group("port"):
        ati += get_all_type_info(m.group("port") + ";")
    if m.group("content"):
        ati += get_all_type_info(m.group("content"))
    # print('[SV.parse_module] ati = ')
    # pprint.pprint(ati,width=200)
    # Extract port name
    ports = []
    ports_name = []
    if m.group("port"):
        s = m.group("port")
        ports_name = re.findall(r"(\w+)\s*(?=,|$|=|\[[^=\^\&\|,;]*?\]\s*(?=,|$|=))", s)
        # get type for each port
        ports = []
        ports = [ti for ti in ati if ti["name"] in ports_name]
    ports_name += params_name
    # Extract instances name
    inst = [
        ti
        for ti in ati
        if ti["type"] != "module" and ti["type"] != "interface" and ti["tag"] == "inst"
    ]
    # Extract signal name
    signals = [
        ti
        for ti in ati
        if ti["type"] not in ["module", "interface"]
        and ti["tag"] not in ["inst", "modport", "clocking"]
        and ti["name"] not in ports_name
    ]
    minfo = {
        "name": mname,
        "param": params,
        "port": ports,
        "inst": inst,
        "type": m.group("type"),
        "signal": signals,
    }
    modports = [ti for ti in ati if ti["tag"] == "modport"]
    if modports:
        minfo["modport"] = modports
    clocking = [ti for ti in ati if ti["tag"] == "clocking"]
    if clocking:
        minfo["clocking"] = clocking
    # print('[SV.parse_module] minfo = ')
    # pprint.pprint(minfo,width=200)
    return minfo


# Extract params using a matching group already containg group for params and content
def extract_params(m):
    params = []
    param_type = ""
    pos = 0
    ## Parameter define in ANSI style
    r = re.compile(
        r"(parameter\s+)?(?P<decl>\b\w+\b\s*(\[[\w\:\-\+`\s]+\]\s*)?)?(?P<name>\w+)\s*=\s*(?P<value>[^,;\n]+)"
    )
    if m.group("param"):
        s = clean_comment(m.group("param"))
        for mp in r.finditer(s):
            params.append(mp.groupdict())
            if not params[-1]["decl"]:
                params[-1]["decl"] = param_type
            else:
                params[-1]["decl"] = params[-1]["decl"].strip()
                param_type = params[-1]["decl"]
            params[-1]["value"] = params[-1]["value"].strip()
            params[-1]["position"] = pos
            pos = pos + 1
    ## look for parameter defined inline
    if m.group("content"):
        s = clean_comment(m.group("content"))
        r_param_list = re.compile(re_param, flags=re.MULTILINE)
        for mpl in r_param_list.finditer(s):
            param_type = ""
            for mp in r.finditer(mpl.group(0)):
                params.append(mp.groupdict())
                if not params[-1]["decl"]:
                    params[-1]["decl"] = param_type
                else:
                    params[-1]["decl"] = params[-1]["decl"].strip()
                    param_type = params[-1]["decl"]
                params[-1]["value"] = params[-1]["value"].strip()
                params[-1]["position"] = pos
                pos = pos + 1
    return params


# Parse a package for port information
def parse_package_file(fname, pname=r"\w+"):
    # print("Parsing file " + fname + " for package " + pname)
    fdate = os.path.getmtime(fname)
    minfo = parse_package_file_cache(fname, pname, fdate)
    # print(parse_package_file_cache.cache_info())
    return minfo


@functools.lru_cache(maxsize=32)
def parse_package_file_cache(fname, pname, fdate):
    with open(fname) as f:
        flines = f.read()
        minfo = parse_package(flines, pname)
    return minfo


def parse_package(flines, pname=r"\w+"):
    # print("Parsing for package " + pname + ' in \n' + flines)
    m = re.search(
        r"(?s)(?P<type>package)\s+(?P<name>"
        + pname
        + ")\s*;\s*(?P<content>.+?)(?P<ending>endpackage)",
        flines,
        re.MULTILINE,
    )
    if m is None:
        return None
    txt = clean_comment(m.group("content"))
    ti = get_all_function(txt)
    ti += get_all_type_info(txt, no_inst=True)
    # print(ti)
    return ti


def parse_function(flines, funcname):
    fi = get_all_function(flines, funcname)
    # print('Parse function {} in :\n{}'.format(flines,funcname))
    if not fi:
        return None
    else:
        # print(fi)
        return fi[0]


# Parse a class for function and members
def parse_class_file(fname, cname=r"\w+"):
    # print("Parsing file " + fname + " for module " + cname)
    fdate = os.path.getmtime(fname)
    info = parse_class_file_cache(fname, cname, fdate)
    # print(parse_class_file_cache.cache_info())
    return info


@functools.lru_cache(maxsize=32)
def parse_class_file_cache(fname, cname, fdate):
    with open(fname) as f:
        contents = f.read()
        flines = clean_comment(contents)
        info = parse_class(flines, cname)
    return info


def parse_class(flines, cname=r"\w+"):
    # print("Parsing for class " + cname + ' in \n' + flines)
    re_str = (
        r"(?s)(?P<type>class)\s+(?P<name>"
        + cname
        + r")\s*(#\s*\((?P<param>.*?)\))?\s*(extends\s+(?P<extend>\w+(?:\s*#\(.*?\))?))?\s*;(?P<content>.*?)(?P<ending>endclass)"
    )
    # print('[parse_class] regexp = {}'.format(re_str))
    re_class = re.compile(re_str, flags=re.MULTILINE)
    m = re_class.search(flines)
    if m is None:
        return None
    txt = clean_comment(m.group("content"))
    # print('[parse_class] Matched class in :\n'+txt)
    ci = {
        "type": "class",
        "name": m.group("name"),
        "extend": None if "extend" not in m.groupdict() else m.group("extend"),
        "function": [],
    }
    ci["decl"] = "class {name} {param}{extend}".format(
        name=ci["name"],
        param="" if not m.group("param") else "#({0}) ".format(m.group("param")),
        extend="" if not ci["extend"] else "extends {0}".format(ci["extend"]),
    )
    # print('[parse_class] Init ci:\n'+str(ci))
    ci["param"] = extract_params(m)
    # print('[parse_class] ci after params extract\n'+str(ci))
    # Extract all functions
    ci["function"] = get_all_function(txt)
    # print('[parse_class] ci after function extract\n'+str(ci))
    # Extract members
    ci["member"] = get_all_type_info(txt, no_inst=True)
    # print('[parse_class] Final ci:\n'+str(ci))
    return ci


def get_all_function(txt, funcname=r"\w+"):
    fil = []  # Function Info list
    names = []
    re_str = (
        r"(?s)(extern)\s+(?:\b(protected|local)\s+)?(\b(?:virtual|static)\s+)?\b(function|task)\s+((?:\w+\s+)?(?:\w+\s+|\[[\d:]+\]\s+)?)\b("
        + funcname
        + r")\b\s*(\((.*?)\s*\))?\s*;()"
    )
    fl = re.findall(re_str, txt, flags=re.MULTILINE)
    txt = re.sub(re_str, "", txt, flags=re.MULTILINE)
    re_str = (
        r'(?s)^[ \t]*(import)\s+".*?"\s*()()(function)\s+((?:\w+\s+)?(?:\w+\s+|\[[\d:]+\]\s+)?)\b('
        + funcname
        + r")\b\s*(\((.*?)\s*\))?\s*;()"
    )
    fl += re.findall(re_str, txt, flags=re.MULTILINE)
    txt = re.sub(re_str, "", txt, flags=re.MULTILINE)
    # txt = re.sub(r'\n([ \t]*\n)+','\n',txt,flags=re.MULTILINE)
    # print('Content after filter : \n' + txt)
    re_str = (
        r"(?s)()(?:\b(protected|local)\s+)?(\bvirtual\s+)?\b(function|task)\s+((?:\w+\s+)?(?:\w+\s+|\[[\d:]+\]\s+)?)\b((?:\w+::)?"
        + funcname
        + r")\b\s*(\((.*?)\s*\))?\s*;(.*?)\bend\4\b"
    )
    fl += re.findall(re_str, txt, flags=re.MULTILINE)
    for (
        f_def,
        f_access,
        f_virtual,
        f_type,
        f_return,
        f_name,
        f_args_,
        f_args,
        f_content,
    ) in fl:
        # print('Parsing function {} {}'.format(f_name,f_args_))
        if f_name in names:
            continue
        else:
            names.append(f_name)
        # Arguments in declaration -> parse them
        if f_args:
            # print('Parsing type from arguments {}'.format(f_args))
            pi = get_all_type_info(f_args + ";")
        # Empty list of argument in declaration -> nothing to do
        elif f_args_:
            pi = []
        # Non-Ansi style declaration -> search for arguments in the function body
        else:
            # print('Parsing type from content {}'.format(f_content))
            ti_all = get_all_type_info(f_content)
            pi = [
                x
                for x in ti_all
                if x["decl"].startswith(("input", "output", "inout", "ref"))
            ]
        f_decl = "{acc} {virt} {type} {ret} {name}".format(
            acc=f_access, virt=f_virtual, type=f_type, ret=f_return, name=f_name
        )
        f_decl = re.sub(r"\s+", " ", f_decl.strip())
        d = {
            "name": f_name,
            "type": f_type,
            "port": pi,
            "return": f_return,
            "decl": f_decl,
            "definition": f_def,
        }
        if f_access:
            d["access"] = f_access
        if d["return"].startswith("automatic"):
            d["return"] = " ".join(d["return"].split()[1:])
        fil.append(d)
    # print([x['name'] for x in fil])
    return fil


# Fill all entry of a case for enum or vector (limited to 8b)
# ti is the type infor return by get_type_info
def fill_case(ti, length=0):
    if not ti["type"]:
        print("[fill_case] No type for signal " + str(ti["name"]))
        return (None, None)
    # print('[fill_case] ti = {0}'.format(ti))
    t = ti["type"].split()[0]
    s = "\n"
    if t == "enum":
        # extract enum from the declaration
        m = re.search(r"\{(.*)\}", ti["decl"])
        if m:
            el = re.findall(r"(\w+).*?(,|$)", m.groups()[0])
            maxlen = max([len(x[0]) for x in el])
            if maxlen < 7:
                maxlen = 7
            for x in el:
                s += "\t" + x[0].ljust(maxlen) + " : ;\n"
            s += "\tdefault".ljust(maxlen + 1) + " : ;\nendcase"
            return (s, [x[0] for x in el])
    elif t in ["logic", "bit", "reg", "wire", "input", "output"]:
        m = re.search(r"\[\s*(\d+)\s*\:\s*(\d+)", ti["bw"])
        if m:
            # If no length was provided use the complete bitwidth
            if length > 0:
                bw = length
            else:
                bw = int(m.groups()[0]) + 1 - int(m.groups()[1])
            if bw <= 8:
                for i in range(0, (1 << bw)):
                    s += "\t" + str(i).ljust(7) + " : ;\n"
                s += "\tdefault : ;\nendcase"
                return (s, range(0, (1 << bw)))
    print("[fill_case] Type not supported: " + str(t))
    return (None, None)


# Extract all enum values from the declaration
def get_enum_values(decl):
    m = re.search(r"\{(.*)\}", decl)
    if not m:
        return []
    return re.findall(r"(\w+).*?(?:,|$)", m.groups()[0])


# Helper function
def split_on_comma(txt):
    l = []
    s = ""
    lvl = 0
    for c in txt:
        if c == "," and lvl == 0:
            l.append(s)
            s = ""
        else:
            s += c
            if c == "(":
                lvl += 1
            elif c == ")" and lvl > 0:
                lvl -= 1
    s = s.strip()
    if len(s) > 0:
        l.append(s)
    return l

class VerilogBeautifier:
    def __init__(
        self,
        nbSpace=3,
        useTab=False,
        oneBindPerLine=True,
        oneDeclPerLine=False,
        paramOneLine=True,
        indentSyle="1tbs",
        reindentOnly=False,
        stripEmptyLine=True,
        instAlignPort=True,
        ignoreTick=True,
        importSameLine=False,
        alignComma=True,
    ):
        self.settings = {
            "nbSpace": nbSpace,
            "useTab": useTab,
            "oneBindPerLine": oneBindPerLine,
            "oneDeclPerLine": oneDeclPerLine,
            "paramOneLine": paramOneLine,
            "indentSyle": indentSyle,
            "reindentOnly": reindentOnly,
            "stripEmptyLine": stripEmptyLine,
            "instAlignPort": instAlignPort,
            "importSameLine": importSameLine,
            "ignoreTick": ignoreTick,
            "alignComma": alignComma,
        }
        self.indentSpace = " " * nbSpace
        if useTab:
            self.indent = "\t"
        else:
            self.indent = self.indentSpace
        self.states = []
        self.state = ""
        self.re_decl = re.compile(
            r"^[ \t]*(?:(?P<param>localparam|parameter|local|protected)\s+)?(?P<scope>\w+\:\:)?(?P<type>[A-Za-z_]\w*)[ \t]+(?P<sign>signed\b|unsigned\b)?[ \t]*(?P<bw>(?:\[("
            + re_bw
            + r")\][ \t]*)*)[ \t]*(?P<name>[A-Za-z_]\w*)[ \t]*(?P<array>(?:\[("
            + re_bw
            + r")\][ \t]*)*)(=\s*(?P<init>[^;]+))?(?P<sig_list>,[\w, \t]*)?;[ \t]*(?P<comment>.*)"
        )
        self.re_inst = re.compile(
            r"(?s)^[ \t]*\b(?P<itype>\w+)\s*(#\s*\([^;]+\))?\s*\b(?P<iname>\w+)\s*\(",
            re.MULTILINE,
        )
        self.kw_block = [
            "module",
            "class",
            "interface",
            "program",
            "function",
            "task",
            "package",
            "case",
            "casex",
            "casez",
            "generate",
            "covergroup",
            "property",
            "sequence",
            "checker",
            "fork",
            "begin",
            "{",
            "(",
        ]
        if not ignoreTick:
            self.kw_block += ["`ifdef", "`ifndef", "`elsif", "`else"]

    def getIndentLevel(self, txt):
        line = txt[: txt.find("\n")]
        # Make sure there is no mix tab/space
        if self.settings["useTab"]:
            line = line.replace(self.indentSpace, "\t")
        else:
            line = line.replace("\t", self.indentSpace)
        cnt = len(line) - len(line.lstrip())
        if not self.settings["useTab"]:
            cnt = int(cnt / self.settings["nbSpace"])
        return cnt

    def stateUpdate(self, newState=None):
        if newState:
            self.states.append(newState)
        else:
            self.states.pop()
        # Get current state from the list
        if not self.states:
            self.state = ""
        else:
            self.state = self.states[-1]

    def isStateEnd(self, w):
        if self.state == "begin" and w == "end":
            return True
        if self.state == "covergroup" and w == "endgroup":
            return True
        if self.state == "fork" and w.startswith("join"):
            return True
        if self.state == "{" and w == "}":
            return True
        if self.state == "(" and w == ")":
            return True
        if self.state.startswith("`") and w in ["`elsif", "`else", "`endif"]:
            return True
        if self.state and w == "end" + self.state:
            return True
        return False

    def beautifyFile(self, codein):
        codeout = self.beautifyText(codein)
        return codeout

    def beautifyText(self, txt):
        # Variables
        self.states = []  # block indent list
        w_d = ["\n", "\n", "\n", "\n"]  # previous word
        line = ""  # current line
        block = ""  # block of text to align
        original_indent = ""
        self.block_state = ""
        block_handled = False
        block_ended = False
        txt_new = ""  # complete text beautified
        ilvl = self.getIndentLevel(txt)
        ilvl_prev = ilvl
        has_indent = ilvl != 0
        line_cnt = 1
        split = {}
        split_always = 0
        last_split = None  # last split that was pop
        split_else = False  # If next word is else this means the split continue
        self.always_state = ""
        # Split all text in word, special character, space and line return
        words = re.findall(r"`?\w+|[^\w\s]|[ \t]+|\n", txt, flags=re.MULTILINE)
        for w in words:
            state_end = self.isStateEnd(w)
            # Handle special case of if/else block in a split statement (like a case)
            if w == "else" and split_else:
                # print('[Beautify] Detected else in a split {0} at level {1} '.format(last_split,ilvl))
                split[ilvl] = last_split
            elif w.strip():
                split_else = False
            # Start of line ?
            if w_d[-1] == "\n":
                ilvl_prev = ilvl
                if not w.strip():
                    if w != "\n" and self.block_state in ["module"]:
                        block += w
                    has_indent = w != "\n"
                if state_end:
                    self.stateUpdate()
                    assert (
                        ilvl > 0
                    ), '[Beautify] Block end with already no indentation ! Line {line_cnt:4}: "{line:<150}" => state={state:<16} -- ilvl={ilvl}'.format(
                        line_cnt=line_cnt, line=line, state=self.state
                    )
                    ilvl -= 1
                # Handle end of self.block_state
                if (
                    self.block_state == "assign"
                    and w != "assign"
                    and not re.match(r"[\t ]+", w)
                ):
                    txt_new += self.alignAssign(block, 2)
                    block = ""
                    self.block_state = ""
                elif self.block_state == "decl" and w in [
                    "always",
                    "always_ff",
                    "always_comb",
                    "always_latch",
                    "constraint",
                    "assign",
                ]:
                    if self.settings["reindentOnly"]:
                        txt_new += block
                    else:
                        txt_new += self.alignDecl(block)
                    block = ""
                    self.block_state = ""
                if self.settings["ignoreTick"] and w in [
                    "`ifdef",
                    "`ifndef",
                    "`elsif",
                    "`else",
                    "`endif",
                ]:
                    self.stateUpdate("ignore_line")
                    line += original_indent
                elif not has_indent and self.state.startswith("`"):
                    has_indent = True
                # Insert indentation except for comment_block without initial indentation and module declaration
                if (
                    self.block_state not in ["module"]
                    and w.strip()
                    and (self.state not in ["comment_block", "attribute"] or has_indent)
                    and self.state != "ignore_line"
                ):
                    ilvl_tmp = ilvl + split_always
                    for i, x in split.items():
                        ilvl_tmp += x[0]
                    line = ilvl_tmp * self.indent
                    # print('[Beautify] line {line_cnt}: split={split} states={s} block={b} => ilvl = {it}={i}+{sa} : "{line}"'.format(line_cnt=line_cnt,split=split,it=ilvl_tmp,i=ilvl,sa=split_always,s=self.states, b=self.block_state,line=line))
            # Handle end of split
            if ilvl in split:
                if self.state not in [
                    "comment_line",
                    "ignore_line",
                    "comment_block",
                    "attribute",
                    "string",
                ] and (w in [";", "end", "endcase"] or line.strip().startswith("`")):
                    # print('[Beautify] End Split on line {line_cnt:4}: "{line:<140}" => state={block_state}.{state} -- ilvl={ilvl}'.format(line_cnt=line_cnt, line=line+w, state=self.state, block_state=self.block_state, ilvl=ilvl))
                    last_split = split.pop(ilvl, 0)
                    split_else = (w == "end") and (
                        ":" in last_split[1]
                    )  # detect only cases where the if/else is inside a case
            # Identify split statement
            if w == "\n":
                block_ended = False
                # Pop comment line
                if self.state in ["comment_line", "ignore_line"]:
                    self.stateUpdate()
                    if not self.block_state:
                        block_handled = True
                # if line:
                #     print('[Beautify] {line_cnt:4}: ilvl={ilvl} state={state} bs={bstate} as={astate} split={split}'.format(line_cnt=line_cnt, state=self.states, bstate=self.block_state, astate=self.always_state, ilvl=ilvl, split=split))
                #     print(line)
                # Search for split line requiring temporary increase of the indentation level
                if self.state not in [
                    "comment_block",
                    "attribute",
                    "{",
                ] and self.block_state not in ["module", "instance", "struct"]:
                    # Retrieve the complete last line without verilog comment
                    block_c = clean_comment(block)
                    idx_eol = block_c.rfind("\n")
                    last_line = line
                    if idx_eol > -1 and idx_eol < (len(block_c) - 2):
                        last_line = block_c[idx_eol + 1 :] + line
                    tmp = clean_comment(last_line).strip()
                    # print('block="{0}"" => eol={1} => last_line="{2}"'.format(block,idx_eol,last_line))
                    if tmp:
                        m = re.search(
                            r"(;|\{|\bend|\bendcase|\bendgenerate)$|^\}$|(begin(\s*\:\s*[\w\$]+)?)$|(case(?:x|z)?)\s*\(.*\)$|(`\w+)\s*(\(.*\))?$|^ *(`\w+)\b",
                            tmp,
                        )
                        # print('[Beautify] Testing for split: "{}" (ilvl={} prev={}) - split={} - state={}, block={}'.format(tmp,ilvl,ilvl_prev,split,self.state,self.block_state))
                        if not m:
                            if tmp.startswith("always"):
                                split_always = 1
                                # print('[Beautify] Always split on line {line_cnt:4} => state={block_state}.{state}: "{line:<140}"'.format(line_cnt=line_cnt, line=line, state=self.states, block_state=self.block_state, ilvl=ilvl))
                            elif ilvl == ilvl_prev and self.state != "(":
                                # elif (ilvl==ilvl_prev or tmp.startswith('end')) and self.state != '(' and (self.state != '' or self.block_state=='always') :
                                # print('[Beautify] confirming ...')
                                if ilvl not in split:
                                    if self.state == "case" and re.match(
                                        r"\s*\w+\s*,$", tmp
                                    ):
                                        # print('[Beautify] Multiple state case at ilvl {ilvl} on line {line_cnt:4} => state={block_state}.{state}: "{line:<140}"'.format(line_cnt=line_cnt, line=line, state=self.states, block_state=self.block_state, ilvl=ilvl))
                                        pass
                                    else:
                                        # print('[Beautify] First split at ilvl {ilvl} on line {line_cnt:4} => state={block_state}.{state}: "{line:<140}"'.format(line_cnt=line_cnt, line=tmp, state=self.states, block_state=self.block_state, ilvl=ilvl))
                                        split[ilvl] = [1, tmp]
                                # Exclude the @(event) cases
                                elif not split[ilvl][1].strip().startswith("@"):
                                    # Exclude the assign cases
                                    m = re.match(
                                        r"^\s*(assign\s+)?\w+\s*(<?=)\s*(.*)",
                                        split[ilvl][1],
                                    )
                                    # Exclude the param list
                                    if not m:
                                        m = re.match(
                                            r"^\s*(localparam|parameter)\b",
                                            split[ilvl][1],
                                        )
                                    if not m:
                                        # print('[Beautify] Incrementing split at ilvl {ilvl} on line {line_cnt:4} => state={block_state}.{state}: "{line:<140}" ({split})'.format(line_cnt=line_cnt, line=line, state=self.states, block_state=self.block_state, ilvl=ilvl, split=split))
                                        split[ilvl][0] += 1
                if self.block_state == "decl" and not self.re_decl.match(line.strip()):
                    if self.settings["reindentOnly"]:
                        txt_new += block
                    else:
                        txt_new += self.alignDecl(block)
                    block = ""
                    self.block_state = ""
                # print('[Beautify] {line_cnt:4}: "{line:<140}" => state={block_state}.{state} -- ilvl={ilvl} (split={split}'.format(line_cnt=line_cnt, line=line, state=self.state, block_state=self.block_state, ilvl=ilvl, split=split))
                block += line.rstrip() + "\n"
                line = ""
                original_indent = ""
                has_indent = False
                line_cnt += 1
            # Original indentation
            elif w_d[-1] == "\n" and not w.strip():
                original_indent += w
            # elif not w_d[-1]=='\n' or w.strip():
            else:
                if (
                    self.state
                    not in [
                        "comment_line",
                        "ignore_line",
                        "comment_block",
                        "attribute",
                        "string",
                    ]
                    and self.settings["indentSyle"] == "gnu"
                ):
                    if w == "begin" and line.strip() != "":
                        ilvl_tmp = ilvl + split_always + 1
                        for i, x in split.items():
                            ilvl_tmp += x[0]
                        if ilvl not in split:
                            tmp = clean_comment(line).strip()
                            # print('[Beautify] Adding split at ilvl {ilvl} on line {line_cnt:4} => state={block_state}.{state}: "{line:<140}"'.format(line_cnt=line_cnt, line=line, state=self.state, block_state=self.block_state, ilvl=ilvl))
                            split[ilvl] = [1, tmp]
                        else:
                            split[ilvl][0] += 1
                        line += "\n" + ilvl_tmp * self.indent
                    elif w == "else" and w_d[-1] != "\n" and w_d[-2] == "end":
                        ilvl_tmp = ilvl + split_always
                        for i, x in split.items():
                            ilvl_tmp += x[0]
                        line += "\n" + ilvl_tmp * self.indent
                # Insert line return after a block ended if this is not a comment
                if block_ended and w.strip() and (w != "/" or w_d[-1] != "/"):
                    line = line.rstrip() + "\n"
                    block_ended = False
                line += w
                if self.state not in [
                    "comment_line",
                    "ignore_line",
                    "comment_block",
                    "attribute",
                    "string",
                ]:
                    # print('State={0}.{1} -- Testing "{2}"'.format(self.state,self.block_state,block+line))
                    action = self.processWord(w, w_d, state_end, block + line)
                    if action.startswith("incr_ilvl"):
                        ilvl += 1
                        if action == "incr_ilvl_flush":
                            txt_new += block
                            block = line
                            line = ""
            # Check that a module block get the whole port declaration
            if self.block_state == "module" and w == ";":
                tmp = clean_comment(block + line).strip()
                m = re.search(r";\s*\(", tmp, flags=re.MULTILINE)
                m2 = re.search(r"\bimport\b", tmp, flags=re.MULTILINE)
                mod_import = m2 and not m
            else:
                mod_import = False
            # Handle the self.block_state and call appropriate alignement function
            if (
                w == ";"
                and self.state
                not in [
                    "comment_line",
                    "ignore_line",
                    "comment_block",
                    "attribute",
                    "string",
                    "(",
                ]
                and not mod_import
            ):
                if self.block_state in [
                    "text",
                    "decl",
                    "struct_assign",
                ] and self.re_decl.match(line.strip()):
                    self.block_state = "decl"
                    # print('Setting Block state to decl on line "{0}"'.format(line))
                elif self.block_state in [
                    "module",
                    "instance",
                    "text",
                    "package",
                    "decl",
                ] or (
                    self.block_state in ["struct", "struct_assign", "enum"]
                    and self.state != "{"
                ):
                    if self.block_state == "module":
                        block_tmp = self.alignModulePort(block + line, ilvl - 1)
                        line = ""
                        block_ended = True
                    elif self.settings["reindentOnly"]:
                        block_tmp = block + line
                        line = ""
                    elif self.block_state == "instance":
                        block_tmp = self.alignInstance(block + line, ilvl)
                        line = ""
                    elif self.block_state == "struct":
                        block_tmp = self.alignDecl(block + line)
                        line = ""
                    elif self.block_state == "struct_assign":
                        block_tmp = self.alignAssign(block + line, 1)
                        line = ""
                    elif self.block_state == "enum":
                        block_tmp = self.alignAssign(block + line, 4)
                        line = ""
                    elif self.block_state == "decl":
                        block_tmp = self.alignDecl(block)
                    else:
                        block_tmp = block + line
                        line = ""
                    if not block_tmp:
                        print(
                            '[Beautify: ERROR] Unable to extract a {0} from "{1}"'.format(
                                self.block_state, block
                            )
                        )
                    else:
                        block = block_tmp
                    self.block_state = ""
                    block_handled = True
            # Handle the end of self.state
            if state_end:
                # Check if this was not already handled
                # print('[Beautify] state {0}.{1} end on word {2}, ilvl={3}'.format(self.states,self.block_state,w,ilvl))
                if self.block_state == "generate":
                    block_tmp = block
                    if not self.settings["reindentOnly"]:
                        for m in self.re_inst.finditer(block[9:]):
                            if (
                                m
                                and m.group("itype") not in ["else", "begin", "end"]
                                and m.group("iname") not in ["if", "for", "foreach"]
                            ):
                                inst_start = 9 + m.start()
                                inst_end = block.find(";", inst_start) + 1
                                if inst_end > inst_start:
                                    inst_block = block[inst_start:inst_end]
                                    inst_ilvl = self.getIndentLevel(inst_block)
                                    inst_block_aligned = self.alignInstance(
                                        inst_block, inst_ilvl
                                    )
                                    block_tmp = block_tmp.replace(
                                        inst_block, inst_block_aligned
                                    )
                                    # print('[Beautify] Align block inst in generate : ilvl={0} \n{1}'.format(inst_ilvl,inst_block))
                    block = block_tmp
                    block_handled = True
                elif w in [
                    "endtask",
                    "endfunction",
                    "endsequence",
                    "endproperty",
                    "endclass",
                ]:
                    if self.settings["reindentOnly"]:
                        block = block + line
                    else:
                        block = self.alignAssign(block + line, 1)
                    line = ""
                    block_handled = True
                if w_d[-1] != "\n":
                    self.stateUpdate()
                    assert (
                        ilvl > 0
                    ), '[Beautify] Block end with already no indentation ! Line {line_cnt:4}: "{line:<150}" => state={state:<16} '.format(
                        line_cnt=line_cnt, line=line, state=self.state
                    )
                    ilvl -= 1
                    # Handle end of split
                    if ilvl in split and w in ["end", "endcase"]:
                        # print('[Beautify] End Split on line {line_cnt:4}: "{line:<140}" => state={block_state}.{state} -- ilvl={ilvl}'.format(line_cnt=line_cnt, line=line+w, state=self.state, block_state=self.block_state, ilvl=ilvl))
                        last_split = split.pop(ilvl, 0)
                        split_else = (w == "end") and (
                            ":" in last_split[1]
                        )  # detect only cases where the if/else is inside a case
            # Comment: do not try to recognise words, just end of the comment
            elif self.state == "comment_block":
                if w_d[-1] == "*" and w == "/":
                    self.stateUpdate()
                    block += line
                    line = ""
                    # print('End of block, restting line')
                    if not self.block_state:
                        block_handled = True
            elif self.state == "attribute":
                if w_d[-1] == "*" and w == ")":
                    if ilvl > 0:
                        ilvl -= 1
                    self.stateUpdate()
                    block += line
                    line = ""
                    # print('End of attribute, resetting line : {}'.format(block))
                    if not self.block_state:
                        block_handled = True
            elif self.state == "string":
                if w == '"':
                    self.stateUpdate()
                    block += line
                    line = ""
                    if not self.block_state:
                        block_handled = True
            # Identify start of comments/string
            elif self.state not in ["comment_line", "ignore_line", "attribute"]:
                if w_d[-1] == "/":
                    if w == "/":
                        self.stateUpdate("comment_line")
                        block_ended = False
                    elif w == "*":
                        self.stateUpdate("comment_block")
                        block_ended = False
                    if line.strip() in ["//", "/*"] and not has_indent:
                        line = line.strip()
                    # print('[Beautify] state={block_state:<16}.{state:<16} -- ilvl={ilvl} -- {line_cnt:4}: "{line}" '.format(line_cnt=line_cnt, line=line, state=self.state, block_state=self.block_state, ilvl=ilvl))
                elif w_d[-1] == "(" and w == "*":
                    if len(self.states) > 0 and self.states[-1] == "(":
                        self.states.pop()
                    self.stateUpdate("attribute")
                    block_ended = False
                    # print('[Beautify] state={block_state:<16}.{state:<16} - {states} -- ilvl={ilvl} -- {line_cnt:4}: "{line}" '.format(line_cnt=line_cnt, line=line, state=self.state, states=self.states, block_state=self.block_state, ilvl=ilvl))
                elif w == '"':
                    self.stateUpdate("string")
            # Handle always block_state
            if self.block_state == "always" and (
                not self.state or self.state in ["module", "interface"]
            ):
                tmp = clean_comment(block + line).strip()
                m = re.match(
                    r"(?s)^\s*always\w*\s+(@\s*(\*|\([^\)]*\)))?\s*begin",
                    tmp,
                    flags=re.MULTILINE,
                )
                if (m and w == "end") or (
                    self.always_state in ["else", ""] and w in ["end", ";"]
                ):
                    if self.settings["reindentOnly"]:
                        block += line
                    else:
                        block = self.alignAssign(block + line, 7)
                    line = ""
                    block_handled = True
                    self.always_state = ""
                    split_always = 0
                    # print('[Beautify] End of always block at line {0}: \n{1}'.format(line_cnt,block))
                elif not m:
                    if w == "else":
                        # print('[Beautify] Inside else part of always at line {0}'.format(line_cnt))
                        self.always_state = "else"
                    # handle case of always if() ...; without else
                    elif self.always_state == "expect_else" and w.strip() and w != "/":
                        block = block + line
                        last_sc = block.rfind(";") + 1
                        last_end = block.rfind("end") + 3
                        if last_end < last_sc:
                            last_end = last_sc
                        line = block[last_end:]
                        block = block[:last_end]
                        # remove extra indent when the always end block is discovered too late
                        if split_always == 1:
                            line = re.sub(
                                r"^" + self.indent, "", line, flags=re.MULTILINE
                            )
                            # print('[Beautify] End of always block at line {0}, extracting {1}'.format(line_cnt,line))
                            self.block_state = ""
                            action = self.processWord(w, w_d, state_end, line)
                            if action.startswith("incr_ilvl"):
                                ilvl += 1
                                if action == "incr_ilvl_flush":
                                    txt_new += block
                                    block = line
                                    line = ""
                        if not self.settings["reindentOnly"]:
                            block = self.alignAssign(block, 7)
                        # print('[Beautify] End of always block at line {0} with word {1}: \n{2}'.format(line_cnt,w,block))
                        if not w.startswith("always"):
                            self.always_state = ""
                        txt_new += block
                        block = ""
                        split_always = 0
                    elif w == "if":
                        self.always_state = "if"
                        # print('[Beautify] Inside if part of always at line {0}'.format(line_cnt))
                    elif self.always_state == "if" and w in ["end", ";"]:
                        # print('[Beautify] End of if part=> next word has to be an else'.format(line_cnt))
                        self.always_state = "expect_else"
            # Add block to the text
            if block_handled:
                # print('[Beautify] state={block_state}.{state} Block handled:\n"{block}" '.format(state=self.state, block_state=self.block_state, block=block))
                txt_new += block
                block = ""
                self.block_state = ""
                block_handled = False
            # Keep previous words
            if w.strip() or w_d[-1] != "\n":
                w_d[-4] = w_d[-3]
                w_d[-3] = w_d[-2]
                w_d[-2] = w_d[-1]
                w_d[-1] = w
        # Check that there is no reminding stuff todo:
        block = block + line
        # print('[Beautify] state={block_state}.{state}\n{block} '.format(state=self.state, block_state=self.block_state, block=block))
        if self.block_state in [
            "module",
            "instance",
            "text",
            "package",
            "decl",
            "assign",
        ] or (
            self.block_state in ["struct", "struct_assign", "enum"]
            and self.state != "{"
        ):
            if self.block_state == "module":
                block_tmp = self.alignModulePort(block, ilvl - 1)
            elif self.settings["reindentOnly"]:
                block_tmp = block
            elif self.block_state == "instance":
                block_tmp = self.alignInstance(block, ilvl)
            elif self.block_state == "struct":
                block_tmp = self.alignDecl(block)
            elif self.block_state == "assign":
                block_tmp = self.alignAssign(block, 2)
            elif self.block_state == "struct_assign":
                block_tmp = self.alignAssign(block, 1)
            elif self.block_state == "decl":
                block_tmp = self.alignDecl(block)
            else:
                block_tmp = block
            if not block_tmp:
                print(
                    '[Beautify: ERROR] Unable to extract a {0} from "{1}"'.format(
                        self.block_state, block
                    )
                )
            else:
                block = block_tmp
        txt_new += block
        return txt_new

    def processWord(self, w, w_prev, state_end, txt):
        if w in self.kw_block:
            # Handle case where this is an external declaration (meaning no block following)
            if (
                w_prev[-2] in ["extern", "cover", "assert", "pure"]
                or (w_prev[-4] in ["extern", "pure"] and w_prev[-2] == "virtual")
                or w_prev[-2] == '"'
            ):
                return ""
            if w in ["function", "task"] and w_prev[-2] in ["import", "export"]:
                return ""
            if w.startswith("case"):
                self.stateUpdate("case")
            else:
                self.stateUpdate(w)
            # print('Block {0} detected in "{1}". Prev= "{2}" => state = {3}'.format(w,txt,w_prev,self.states))
            if w in [
                "module",
                "package",
                "generate",
                "function",
                "task",
                "property",
                "sequence",
                "checker",
            ]:
                self.block_state = w
                return "incr_ilvl_flush"
            else:
                return "incr_ilvl"
        # Identify self.block_state
        if not self.block_state:
            if w in ["assign"]:
                self.block_state = w
            elif w.startswith("always"):
                self.block_state = "always"
                self.always_state = ""
                # print('Start of always block')
            elif w_prev[-1] == "\n" and w != "/" and not state_end:
                # print('Start of text block with "{0}"'.format(w))
                self.block_state = "text"
        elif self.block_state == "text":
            tmp = clean_comment(txt).strip()
            m = self.re_inst.match(tmp)
            if (
                m
                and m.group("itype") not in ["else", "begin", "end", "assert", "cover"]
                and m.group("iname") not in ["if", "for", "foreach"]
            ):
                self.block_state = "instance"
            elif re.match(
                r"\s*\b(typedef\s+)?(struct|union)\b", tmp, flags=re.MULTILINE
            ):
                self.block_state = "struct"
            elif re.match(r"\s*\b(typedef\s+)?(enum)\b", tmp, flags=re.MULTILINE):
                self.block_state = "enum"
            elif re.match(r"(?s)^.*=\s*'\{", tmp, flags=re.MULTILINE):
                # print('Matching struct assign on "{0}"'.format(txt))
                self.block_state = "struct_assign"
        # print('Test "{0}" => {1}.{2}.{3}'.format((txt).strip(),self.states,self.block_state,self.always_state))
        return ""

    # Align ANSI style port declara3ion of a module
    def alignModulePort(self, txt, ilvl):
        # Extract parameter and ports
        m = re.search(
            r"(?s)(?P<module>^[ \t]*module)\s*(?P<mname>\w+)(?P<import>\s+import\s+.*?;)?\s*(?P<paramsfull>#\s*\(\s*(?P<params>.*?)\s*\))?\s*(\(\s*(?P<ports>.*)\s*\))?\s*;$",
            txt,
            flags=re.MULTILINE,
        )
        if not m:
            return ""
        txt_new = self.indent * (ilvl) + "module " + m.group("mname").strip()
        # Add optional import declaration
        if m.group("import"):
            imports = m.group("import").strip().split("\n")
            if len(imports) == 1 and self.settings["importSameLine"]:
                txt_new += " {} ".format(imports[0].strip())
            else:
                txt_new += "\n"
                for i in imports:
                    txt_new += "{0}{1}\n".format(self.indent * (ilvl + 1), i.strip())
        # Add optional parameter declaration
        if m.group("params"):
            param_txt = m.group("params").strip()
            # param_txt = re.sub(r'(^|,)\s*parameter','',param_txt) # remove multiple parameter declaration
            # re_param_str = r'^[ \t]*(?:(?P<parameter>parameter|localparam)\s+)?(?P<type>[\w\:]+\b)?[ \t]*(?P<sign>signed|unsigned\b)?[ \t]*(?P<bw>(?:\['+re_bw+r'\][ \t]*)*)[ \t]*(?P<param>\w+)\b\s*=\s*(?P<value>[\w\:`\'\+\-\*\/\(\)\" \$\.]+)\s*(?P<sep>,)?[ \t]*(?P<list>(?:[\w\:]+[ \t]+)?\w+[ \t]*=[ \t]*[\w\.\:`\'\+\-\*\/\(\)\"\$]+(,)?[ \t]*)*(?P<comment>.*?$)'
            re_param_str = (
                r"^[ \t]*(?:(?P<parameter>parameter|localparam)\s+)?(?P<type>[\w\:]+\b)?[ \t]*(?P<sign>signed|unsigned\b)?[ \t]*(?P<bw>(?:\["
                + re_bw
                + r"\][ \t]*)*)[ \t]*(?P<param>\w+)\b\s*=\s*(?P<value>[^\n]*?)(?P<comment>$|//.*?$)"
            )
            re_param = re.compile(re_param_str, flags=re.MULTILINE)
            decl = re_param.findall(param_txt)
            # print('Decl : {}'.format(decl))
            len_bw_a = []
            if not decl:
                # No recognisable parameter: will simply indent line
                len_kw = 0
                len_type = 0
                len_sign = 0
                len_param = 0
                len_value = 0
                len_comment = 0
                has_param = False
                last_param = "parameter"
            else:
                values = [clean_comment(split_on_comma(x[5])[0]).strip() for x in decl]
                # print(values)
                len_kw = max([len(x[0]) for x in decl])
                len_type = max(
                    [len(x[1]) for x in decl if x not in ["signed", "unsigned"]]
                )
                len_sign = max([len(x[2]) for x in decl])
                len_param = max([len(x[4]) for x in decl])
                len_value = max([len(x) for x in values])
                # len_value = max([len(clean_comment(x[5]).strip()) for x in decl])
                len_comment = max([len(x[-1]) for x in decl])
                has_param_list = [x[0] for x in decl if x[0] != ""]
                has_param_all = len(has_param_list) == len(decl)
                has_param = len(has_param_list) > 0
                last_param = (
                    "parameter" if len(has_param_list) == 0 else has_param_list[0]
                )
                # Get bitwidth length, if any
                port_bw_l = [
                    re.findall(r"\[(.+?)\]", re.sub(r"\s*", "", x[3])) for x in decl
                ]
                if len(port_bw_l) > 0:
                    for x in port_bw_l:
                        for i, y in enumerate(x):
                            if i >= len(len_bw_a):
                                len_bw_a.append(len(y))
                            elif len_bw_a[i] < len(y):
                                len_bw_a[i] = len(y)
            # get total length of bitwidth, adding all internal length and adding 2 for each dimmension for the brackets
            len_bw = sum(len_bw_a) + 2 * len(len_bw_a)

            if m.group("import"):
                txt_new += self.indent * (ilvl) + "#("
            else:
                txt_new += " #("
            # add only one parameter statement if there is at least one but not on all line
            if has_param and not has_param_all:
                txt_new += "parameter"

            # print('[sv.beautifier.param] len_type = {}, len_sign = {}, len_bw = {}, len_param = {}, len_value = {}, len_comment = {}, has_param_all = {}, has_param = {}, '.format(len_type,len_sign,len_bw,len_param,len_value,len_comment,has_param_all,has_param))

            # If not on one line align parameter together, otherwise keep as is
            if "\n" in param_txt or not self.settings["paramOneLine"]:
                txt_new += "\n"
                lines = param_txt.splitlines()
                for i, line in enumerate(lines):
                    l = line.strip()
                    # ignore the first line with parameter keyword only since it has already been added
                    if i == 0 and l == last_param:
                        continue
                    l_new = self.indent * (ilvl + 1)
                    m_param = re_param.search(l)
                    if not m_param or self.settings["reindentOnly"]:
                        l_new += l
                    else:
                        # print('[sv.beautifier.param] Line = {} -> {}'.format(line,m_param.groups()))
                        if m_param.group("parameter"):
                            last_param = m_param.group("parameter")
                        # print('params = {0}'.format(m_param.groups()))
                        if has_param_all:
                            l_new += last_param.ljust(len_kw + 1)
                        if len_type > 0:
                            if m_param.group("type"):
                                if m_param.group("type") not in ["signed", "unsigned"]:
                                    l_new += m_param.group("type").ljust(len_type + 1)
                                else:
                                    l_new += "".ljust(len_type + 1) + m_param.group(
                                        "type"
                                    ).ljust(len_sign + 1)
                            else:
                                l_new += "".ljust(len_type + 1)
                        if len_sign > 0:
                            if m_param.group("sign"):
                                l_new += m_param.group("sign").ljust(len_sign + 1)
                            else:
                                l_new += "".ljust(len_sign + 1)
                        if len_bw > 0:
                            s = ""
                            if m_param.group("bw"):
                                bw_a = re.findall(
                                    r"\[(.+?)\]",
                                    re.sub(r"\s*", "", m_param.group("bw")),
                                )
                                for i, bw in enumerate(bw_a):
                                    s += "[" + bw.rjust(len_bw_a[i]) + "]"
                            l_new += s.ljust(len_bw + 1)
                        l_new += m_param.group("param").ljust(len_param)

                        values = [
                            clean_comment(x).strip()
                            for x in split_on_comma(m_param.group("value"))
                        ]
                        v = clean_comment(m_param.group("value")).strip()
                        has_sep = v.endswith(",")
                        # vp = m_param.group('value').strip()
                        # v = clean_comment(vp).strip()
                        # c = '' if len(vp)<=len(v) else vp[len(v):].strip() + ' '
                        l_new += " = " + values[0].ljust(len_value)
                        if self.settings["alignComma"]:
                            if (has_sep and i != (len(lines) - 1)) or len(values) > 1:
                                l_new += ","
                            else:
                                l_new += " "
                        else:
                            l_tmp = l_new.rstrip()
                            nb_pad = len(l_new) - len(l_tmp)
                            if i != (len(lines) - 1) or len(values) > 1:
                                sep = ","
                            else:
                                sep = " "
                            l_new = l_tmp + sep + " " * nb_pad
                        # TODO: in case of list try to do something: option to split line by line? align in column if multiple list present ?
                        if len(values) > 1:
                            for j, x in enumerate(values[1:]):
                                l_new += " " + x
                                if has_sep and (
                                    i != (len(lines) - 1) or j != (len(values) - 2)
                                ):
                                    sep = ","
                                else:
                                    sep = " "
                        if m_param.group("comment"):
                            l_new += " " + m_param.group("comment")
                        # if m_param.group('comment') or c:
                        #     l_new += ' ' + c + m_param.group('comment')
                    if not self.settings["stripEmptyLine"] or l_new.strip() != "":
                        txt_new += l_new.rstrip() + "\n"  # + self.indent*(ilvl)
            else:
                if has_param and not has_param_all:
                    txt_new += " "
                txt_new += param_txt
                # print('len Comment = ' + str(len_comment)+ ': ' + str([x[9] for x in decl])+ '"')
                if len_comment > 0:
                    txt_new += "\n" + self.indent * (ilvl)
            txt_new += ")"
            #
        # Handle special case of no ports
        if not m.group("ports"):
            if not self.settings["reindentOnly"]:
                txt_new += " ()"
            return txt_new + ";"
        # Add port list declaration
        if txt_new[-1] != "\n":
            txt_new += " "
        txt_new += "(\n"
        # Port declaration: direction type? signess? buswidth? list ,? comment?
        re_str = (
            r"^[ \t]*(?P<dir>[\w\.]+)[ \t]+(?P<var>var|ref\b)?[ \t]*(?P<type>[\w\:]+\b)?[ \t]*(?P<sign>signed|unsigned\b)?[ \t]*(?P<bw>(?:\["
            + re_bw
            + r"\][ \t]*)*)[ \t]*(?P<ports>(?P<port1>\w+)[\w, \t\[\]\*\-\+\$\(\)\'\:)]*)[ \t]*(?P<comment>.*)"
        )
        # print(re_str)
        # handle case of multiple input/output declared on same line
        # TODO : use a function to split text in code/comment and apply substitution only on the code part
        txt_port = re.sub(
            r"[ \t]*,[ \t]*(input|output|inout)\b[ \t]+", r",\n\1 ", m.group("ports")
        )
        decl = re.findall(re_str, txt_port, flags=re.MULTILINE)
        # Extract max length of the different field for vertical alignement
        port_dir_l = [x[0] for x in decl if x[0] in port_dir]
        port_if_l = [x[0] for x in decl if x[0] not in port_dir]
        # Get Direction length, if any
        len_dir = 0
        if port_dir_l:
            len_dir = max([len(x) for x in port_dir_l])
        # Get IF length, if any
        len_if = 0
        if port_if_l:
            len_if = max([len(x) for x in port_if_l])
        # Get Var length, if any
        len_var = 0
        for x in decl:
            if x[1] != "":
                len_var = 3
        # Get bitwidth length, if any
        port_bw_l = [re.findall(r"\[(.+?)\]", re.sub(r"\s*", "", x[4])) for x in decl]
        len_bw_a = []
        if len(port_bw_l) > 0:
            for x in port_bw_l:
                for i, y in enumerate(x):
                    if i >= len(len_bw_a):
                        len_bw_a.append(len(y))
                    elif len_bw_a[i] < len(y):
                        len_bw_a[i] = len(y)
        # get total length of bitwidth, adding all internal length and adding 2 for each dimmension for the brackets
        len_bw = sum(len_bw_a) + 2 * len(len_bw_a)
        # Get port length (ignore list, just align on the first port of the list if nay)
        max_port_len = 0
        port_l = []
        for x in decl:
            s = x[5].strip()
            if s[-1] == ",":
                s = s[:-1].strip()
            if "," in s:
                s = x[6]
            port_l.append(s)
        max_port_len = max([len(x) for x in port_l])
        len_sign = 0
        len_type = 0
        len_type_user = 0
        for x in decl:
            if (
                x[3] == ""
                and x[4] == ""
                and x[2] not in ["logic", "wire", "reg", "signed", "unsigned"]
            ):
                if len_type_user < len(x[2]):
                    len_type_user = len(x[2])
            else:
                if len_type < len(x[2]) and x[2] not in ["signed", "unsigned"]:
                    len_type = len(x[2])
            if x[2] in ["signed", "unsigned"] and len_sign < len(x[2]):
                len_sign = len(x[2])
            elif x[3] in ["signed", "unsigned"] and len_sign < len(x[3]):
                len_sign = len(x[3])
        len_type_full = len_type
        if len_var > 0 or len_bw > 0 or len_sign > 0:
            if len_type > 0:
                len_type_full += 1
            if len_var > 0:
                len_type_full += 4
            if len_bw > 0:
                len_type_full += len_bw
            if len_sign > 0:
                len_type_full += 1 + len_sign
        max_len = len_type_full
        if len_type_user < len_type_full:
            len_type_user = len_type_full
        else:
            max_len = len_type_user
        # Adjust IF length compare to the other
        if len_if < max_len + len_dir + 1:
            len_if = max_len + len_dir + 1
        else:
            max_len = len_if - len_dir - 1
        if len_type_user < max_len:
            len_type_user = max_len
        if len_var > 0:
            len_type_user -= len_var + 1
        # print('Len:  dir=' + str(len_dir) + ' if=' + str(len_if) + ' type=' + str(len_type) + ' sign=' + str(len_sign) + ' bw=' + str(len_bw) + ' type_user=' + str(len_type_user) + ' port=' + str(max_port_len) + ' max_len=' + str(max_len) + ' len_type_full=' + str(len_type_full))
        # Rewrite block line by line with padding for alignment
        lines = txt_port.splitlines()

        for i, line in enumerate(lines):
            # Remove leading and trailing space.
            l = line.strip()
            # ignore empty line at the begining and the end of the connection
            if self.settings["ignoreTick"] and l.startswith("`"):
                txt_new += line + "\n"
            elif (
                i != (len(lines) - 1)
                and i != 0
                and (not self.settings["stripEmptyLine"] or l != "")
            ) or l != "":
                m_port = re.search(re_str, l)
                l_new = self.indent * (ilvl + 1)
                if self.settings["reindentOnly"]:
                    l_new += l
                elif m_port:
                    # For standard i/o
                    if m_port.group("dir") in port_dir:
                        l_new += m_port.group("dir").ljust(len_dir)
                        if len_var > 0:
                            if m_port.group("var"):
                                l_new += " " + m_port.group("var")
                            else:
                                l_new += " ".ljust(len_var + 1)
                        # Align userdefined type differently from the standard type
                        if (
                            m_port.group("sign")
                            or m_port.group("bw")
                            or m_port.group("type")
                            in ["logic", "wire", "reg", "signed", "unsigned"]
                        ):
                            if len_type > 0:
                                if m_port.group("type"):
                                    if m_port.group("type") not in [
                                        "signed",
                                        "unsigned",
                                    ]:
                                        l_new += " " + m_port.group("type").ljust(
                                            len_type
                                        )
                                    else:
                                        l_new += (
                                            "".ljust(len_type + 1)
                                            + " "
                                            + m_port.group("type").ljust(len_sign)
                                        )
                                else:
                                    l_new += "".ljust(len_type + 1)
                                # add sign space it exists at least for one port
                                if len_sign > 0:
                                    if m_port.group("sign"):
                                        l_new += " " + m_port.group("sign").ljust(
                                            len_sign
                                        )
                                    elif m_port.group("type") not in [
                                        "signed",
                                        "unsigned",
                                    ]:
                                        l_new += "".ljust(len_sign + 1)
                            elif len_sign > 0:
                                if m_port.group("type") in ["signed", "unsigned"]:
                                    l_new += " " + m_port.group("type").ljust(len_sign)
                                elif m_port.group("sign"):
                                    l_new += " " + m_port.group("sign").ljust(len_sign)
                                else:
                                    l_new += "".ljust(len_sign + 1)
                            # Add bus width if it exists at least for one port
                            if len_bw > 1:
                                s = ""
                                if m_port.group("bw"):
                                    s = " "
                                    bw_a = re.findall(
                                        r"\[(.+?)\]",
                                        re.sub(r"\s*", "", m_port.group("bw")),
                                    )
                                    for i, bw in enumerate(bw_a):
                                        s += "[" + bw.rjust(len_bw_a[i]) + "]"
                                l_new += s.ljust(len_bw + 1)
                            if max_len > len_type_full:
                                l_new += "".ljust(max_len - len_type_full)
                        elif m_port.group("type"):
                            l_new += " " + m_port.group("type").ljust(len_type_user)
                        elif len_type_user > 0:
                            l_new += " ".ljust(len_type_user + 1)
                    # For interface
                    else:
                        l_new += m_port.group("dir").ljust(len_if)
                    # Add port list: space every port in the list by just on space
                    s = re.sub(r"\s*,\s*", ", ", m_port.group("ports").rstrip())
                    l_new += " "
                    if s.endswith(", "):
                        nb_pad = 0
                        if self.settings["alignComma"]:
                            l_new += s[:-2].ljust(max_port_len)
                        else:
                            l_new += s[:-2]
                            nb_pad = max_port_len - len(s[:-2])
                        # Only add comma if not last line (allow to remove extra comma)
                        if i != (len(lines) - 1):
                            l_new += ","
                        if nb_pad > 0:
                            l_new += " " * nb_pad
                    else:
                        l_new += s.ljust(max_port_len) + " "
                    # Add comment
                    if m_port.group("comment"):
                        l_new += " " + m_port.group("comment")
                else:  # No port declaration ? recopy line with just the basic indentation level
                    # Look for a simple comment line and check its indentation: if too large, align with port comment position
                    m_comment = re.search(r"\s*//.*", l)
                    if m_comment:
                        ilvl_comment = self.getIndentLevel(line)
                        if ilvl_comment > (ilvl + 2):
                            l_new += "".rjust(len_if + 1 + max_port_len + 2) + l
                        else:
                            l_new += l
                    else:
                        l_new += l
                # Remove trailing spaces/tabs and add the end of line
                txt_new += l_new.rstrip(" \t") + "\n"
        txt_new += self.indent * (ilvl) + ");"
        return txt_new

    # Alignement for various assign (field, case, blocking, non blocking)
    def alignAssign(self, txt, mask_op):
        # TODO handle array
        re_str_l = []
        # case/structure : "word: statement"
        if mask_op & 1:
            re_str_l.append(
                r"^[ \t]*(?P<scope>\w+\:\:)?(?P<name>[\w`\'\"\.\?]+)[ \t]*(\[(?P<bitslice>.*?)\])?\s*(?P<op>\:(?!\:))\s*(?P<statement>.*)$"
            )
        # Continous assignement: "assign word = statement"
        if mask_op & 2:
            re_str_l.append(
                r"^[ \t]*(?P<scope>assign)\s+(?P<name>[\w`\'\"\.]+)[ \t]*(\[(?P<bitslice>.*?)\])?\s*(?P<op>=)\s*(?P<statement>.*)$"
            )
        # Assignement : "word <= statement"
        if mask_op & 4:
            re_str_l.append(
                r"^[ \t]*(?P<scope>)(?P<name>[\w`\'\"\.]+)[ \t]*(\[(?P<bitslice>.*?)\])?\s*(?P<op>(<)?=)\s*(?P<statement>.*)$"
            )
        txt_new = txt
        for i, re_str in enumerate(re_str_l):
            lines = txt_new.splitlines()
            lines_match = []
            matched = False
            ilvl = -1
            ilvl_prev = -1
            max_len = {}
            max_len_idx = -1
            # Two possible method: either align on the indent level globally,
            # or break the text in block of same indent level
            # First method is prefered for structure assignment (TBD for complex stuct with more than 2 level ...)
            if (
                (mask_op & 1)
                and (i == 0)
                and txt.strip().endswith(";")
                and not txt.strip().startswith("always")
            ):
                ilvl_glob = True
                # print("[Beautifier] alignAssign with ilvl_glob True for :\n" + txt)
            else:
                ilvl_glob = False
            # Process each line to identify a signal declaration,
            # save the match information in an array, and process the max length for a block of text with same indent level
            for l in lines:
                l = l
                m = re.search(re_str, l)
                ilvl_prev = ilvl
                ilvl = self.getIndentLevel(l)
                if ilvl_glob:
                    max_len_idx = ilvl
                elif ilvl != ilvl_prev:
                    max_len_idx += 1
                if max_len_idx not in max_len:
                    max_len[max_len_idx] = 0
                len_c = 0
                if m:
                    matched = True
                    len_c = len(m.group("name"))
                    if m.group("scope"):
                        len_c += len(m.group("scope"))
                        if m.group("scope") == "assign":
                            len_c += 1
                    if m.group("bitslice"):
                        len_c += len(re.sub(r"\s", "", m.group("bitslice"))) + 2
                    if len_c > max_len[max_len_idx]:
                        max_len[max_len_idx] = len_c
                lines_match.append((l, m, ilvl, max_len_idx))
            # If no match return text as is
            if matched:
                txt_new = ""
                # Update alignement of each line
                for idx, (line, m, ilvl, len_idx) in enumerate(lines_match):
                    if m:
                        l = ""
                        if m.group("scope"):
                            l += m.group("scope")
                            if m.group("scope") == "assign":
                                l += " "
                        l += m.group("name")
                        if m.group("bitslice"):
                            l += "[" + re.sub(r"\s", "", m.group("bitslice")) + "]"
                        l = (
                            self.indent * ilvl
                            + l.ljust(max_len[len_idx])
                            + " "
                            + m.group("op")
                            + " "
                            + m.group("statement")
                        )
                    else:
                        l = line
                    txt_new += l.rstrip() + "\n"
                if txt[-1] != "\n":
                    txt_new = txt_new[:-1]
        return txt_new

    # Alignement for module instance
    def alignInstance(self, txt, ilvl):
        # Check if parameterized module
        m = re.search(
            r"(?s)(?P<emptyline>\n*)(?P<mtype>^[ \t]*(bind\s+[\w\.]+\s+)?\w+)\s*(?P<paramsfull>#\s*\((?P<params>.*)\s*\))?\s*(?P<mname>\w+)\s*\(\s*(?P<ports>.*)\s*\)\s*;(?P<comment>.*)$",
            txt,
            flags=re.MULTILINE,
        )
        if not m:
            return ""
        # Add module type
        txt_new = m.group("emptyline") + self.indent * (ilvl) + m.group("mtype").strip()
        # Add parameter binding : if already on one line simply remove extra space, otherwise apply standard alignement
        if m.group("params"):
            txt_new += " #("
            if ("\n" in m.group("params").strip()) or not self.settings["paramOneLine"]:
                txt_new += (
                    "\n"
                    + self.alignInstanceBinding(m.group("params"), ilvl + 1)
                    + self.indent * (ilvl)
                )
            else:
                p = m.group("params").strip()
                p = re.sub(r"\s+", "", p)
                p = re.sub(r"\),", r"), ", p)
                txt_new += p
            txt_new += ")"
        # Add module name
        txt_new += " " + m.group("mname") + " ("
        # Add ports binding
        if m.group("ports"):
            # if port binding starts with a .* let it on the same line
            if (
                not m.group("ports").startswith(".*")
                and "\n" in m.group("ports").rstrip()
            ):
                txt_new += "\n"
            if "\n" in m.group("ports").strip():
                txt_new += self.alignInstanceBinding(m.group("ports"), ilvl + 1)
                txt_new += self.indent * (ilvl)
            else:
                p = m.group("ports").strip()
                p = re.sub(r"\s+", "", p)
                p = re.sub(r"\),", r"), ", p)
                txt_new += p
        txt_new += ");"
        # Add end
        if m.group("comment"):
            txt_new += " " + m.group("comment")
        return txt_new

    def alignInstanceBinding(self, txt, ilvl):
        was_split = False
        # insert line if needed to get one binding per line
        if self.settings["oneBindPerLine"]:
            txt = re.sub(r"\)[ \t]*,[ \t]*\.", "), \n.", txt, flags=re.MULTILINE)
        # Parse bindings to find length of port and signals
        re_str_bind_port = r"^[ \t]*(?P<lcomma>,)?[ \t]*\.\s*(?P<port>\w+)\s*\(\s*"
        re_str_bind_sig = (
            r"(?P<signal>.*?)\s*\)\s*(?P<comma>,)?\s*(?P<comment>\/\/.*?|\/\*.*?)?$"
        )
        re_str_bind_implicit = (
            r"^[ \t]*(?P<lcomma>,)?[ \t]*\.\s*(?P<port>\w+)\s*(,|\/\/.*?|\Z)"
        )
        binds = re.findall(re_str_bind_port + re_str_bind_sig, txt, flags=re.MULTILINE)
        max_port_len = 0
        max_sig_len = 0
        ports_len = [len(x[1]) for x in binds]
        sigs_len = [len(x[2].strip()) for x in binds]
        ports_impl = None
        binds_impl = re.findall(re_str_bind_implicit, txt, flags=re.MULTILINE)
        if binds_impl:
            ports_impl = [x[1] for x in binds_impl]
        if ports_len and self.settings["instAlignPort"]:
            max_port_len = max(ports_len)
            if binds_impl:
                ports_impl_len = [len(x[1]) for x in binds_impl]
                max_port_len_impl = max(ports_impl_len)
                if max_port_len_impl > max_port_len:
                    max_port_len = max_port_len_impl
        if sigs_len and self.settings["instAlignPort"]:
            max_sig_len = max(sigs_len)
        # TODO: if the .* is at the beginning make sure it is not follow by another binding
        lines = txt.strip().splitlines()
        txt_new = ""
        # for each line apply alignment
        for i, line in enumerate(lines):
            # Remove leading and trailing space. add end of line
            l = line.strip()
            # ignore empty line at the begining and the end of the connection
            if (i != (len(lines) - 1) and i != 0) or l != "":
                # Look for a binding
                m = re.search(r"^" + re_str_bind_port + re_str_bind_sig, l)
                is_split = False
                # No complete binding : look for just the beginning then
                if not m:
                    m = re.search(
                        re_str_bind_port
                        + r"(?P<signal>.*?)\s*(?P<comma>)(?P<comment>)$",
                        l,
                    )
                    if m:
                        is_split = True
                        # print('Detected split at Line ' + str(i) + ' : ' + l)
                    # Look for an implicit port
                    elif ports_impl:
                        m = re.search(
                            r"^[ \t]*\.\s*(?P<port>\w+)\s*(?P<comma>,)?(?P<comment>\/\/.*?|\/\*.*?)?",
                            l,
                        )
                        if m:
                            if m.group("port") not in ports_impl:
                                m = None  # False alert
                if m:
                    # print('Line ' + str(i) + '/' + str(len(lines)) + ' : ' + str(m.groups()) + ' => split = ' + str(is_split))
                    txt_new += self.indent * (ilvl)
                    txt_new += "." + m.group("port").ljust(max_port_len)
                    if "signal" in m.groupdict():
                        txt_new += "(" + m.group("signal").strip().ljust(max_sig_len)
                    elif max_sig_len > 0 and i != (len(lines) - 1):
                        txt_new += "".ljust(
                            max_sig_len + 2
                        )  # 2 is for the parenthesis ()
                    if not is_split:
                        if "signal" in m.groupdict():
                            txt_new += ")"
                        if i != (len(lines) - 1):  # Add comma for all lines except last
                            txt_new += ","
                    if "comment" in m.groupdict() and m.group("comment"):
                        if txt_new[-1] != ",":
                            txt_new += " "
                        txt_new += " " + m.group("comment")
                else:  # No port binding ? recopy line with just the basic indentation level
                    txt_new += self.indent * ilvl
                    # Handle case of binding split on multiple line : try to align the end of the binding
                    if was_split:
                        txt_new += "".ljust(
                            max_port_len + 2
                        )  # 2 = take into account the . and the (
                        m = re.search(re_str_bind_sig, l)
                        if m:
                            if m.group("signal"):
                                txt_new += (
                                    m.group("signal").strip().ljust(max_sig_len) + ")"
                                )
                            else:
                                txt_new += "".strip().ljust(max_sig_len) + ")"
                            if m.group("comma") and i != (len(lines) - 1):
                                txt_new += ", "
                            else:
                                txt_new += "  "
                            if m.group("comment"):
                                txt_new += m.group("comment")
                        else:
                            txt_new += l
                    else:
                        txt_new += l
                was_split = is_split
                txt_new += "\n"
        return txt_new

    # Alignement for signal declaration : [scope::]type [signed|unsigned] [bitwidth] signal list
    def alignDecl(self, txt):
        lines = txt.splitlines()
        lines_match = []
        len_max = {}
        one_decl_per_line = self.settings["oneDeclPerLine"]
        # Process each line to identify a signal declaration, save the match information in an array, and process the max length for each field
        for l in lines:
            m = self.re_decl.search(l)
            if m:
                # print('[alignDecl] {0} => {1}'.format(l,m.groups()))
                ilvl = self.getIndentLevel(l)
                if ilvl not in len_max:
                    len_max[ilvl] = {
                        "param": 0,
                        "scope": 0,
                        "type": 0,
                        "type_full": 0,
                        "type_user": 0,
                        "type_user_pa": 0,
                        "sign": 0,
                        "bw": [],
                        "name": 0,
                        "array": [],
                        "array_sum": 0,
                        "bw_sum": 0,
                        "sig_list": 0,
                        "comment": 0,
                        "init": 0,
                    }
                len_full = 0
                len_ba = {"bw": 0, "array": 0}
                for k, g in m.groupdict().items():
                    if g:
                        w = g.strip()
                        # extract all bitwidth, to get each length individually
                        if k in ["array", "bw"]:
                            port_bw_l = re.findall(r"\[(.+?)\]", re.sub(r"\s*", "", w))
                            for i, y in enumerate(port_bw_l):
                                len_ba[k] += len(y) + 2
                                if i >= len(len_max[ilvl][k]):
                                    len_max[ilvl][k].append(len(y))
                                elif len_max[ilvl][k][i] < len(y):
                                    len_max[ilvl][k][i] = len(y)
                        #
                        elif k == "type":
                            len_full = len(w)
                            if w not in [
                                "logic",
                                "wire",
                                "reg",
                                "bit",
                                "int",
                                "integer",
                            ]:
                                t = "type_user_pa" if m.group("bw") else "type_user"
                            else:
                                t = "type"
                            if len_full > len_max[ilvl][t]:
                                len_max[ilvl][t] = len_full
                        # Get max length for each possible element of the regexp
                        elif len(w) > len_max[ilvl][k]:
                            len_max[ilvl][k] = len(w)
                        if k == "sig_list" and one_decl_per_line:
                            for s in w.split(","):
                                if len(s.strip()) > len_max[ilvl]["name"]:
                                    len_max[ilvl]["name"] = len(s.strip())
                #
                if len_full > 0:
                    if m.group("sign"):
                        len_full += 1 + len(m.group("sign").strip())
                    if len_ba["bw"] != 0:
                        len_full += 1 + len_ba["bw"]
                    # if m.group('bw') :
                    #     len_full += 1 + len(m.group('bw').strip())
                    if t != "type" and m.group("scope"):
                        len_full += len(m.group("scope").strip())
                    if len_full > len_max[ilvl]["type_full"]:
                        len_max[ilvl]["type_full"] = len_full
            else:
                ilvl = 0
            lines_match.append((l, m, ilvl))

        # Get total length for array
        for k, x in len_max.items():
            x["array_sum"] = 0
            x["bw_sum"] = 0
            for y in x["array"]:
                x["array_sum"] += 2 + y
            for y in x["bw"]:
                x["bw_sum"] += 2 + y
            if x["type_user_pa"] > x["type"]:
                x["type"] = x["type_user_pa"]
        # print('[sv.beautifier.decl] len_max = {}'.format(len_max))
        # Update alignement of each line
        txt_new = ""
        for line, m, ilvl in lines_match:
            if m:
                # print('[sv.beautifier.decl] Line = {} -> {}'.format(line,m.groups()))
                l = self.indent * ilvl
                is_usertype = m.group("type") not in [
                    "logic",
                    "wire",
                    "reg",
                    "bit",
                    "int",
                    "integer",
                ]
                len_type_full = len_max[ilvl]["type_full"] + 1
                len_type = len_max[ilvl]["type"] + 1
                t = ""
                # Add localparam/parameter. Adjust align length if not present on this line but present on other line
                if m.group("param"):
                    t += (m.group("param")).ljust(len_max[ilvl]["param"] + 1)
                    len_type_full += len_max[ilvl]["param"] + 1
                elif len_max[ilvl]["param"] != 0:
                    len_type += len_max[ilvl]["param"] + 1
                # Add Scope+type
                if is_usertype:
                    if m.group("scope"):
                        t += m.group("scope") + m.group("type")
                    else:
                        t += m.group("type")
                    if m.group("bw"):
                        t = t.ljust(len_type)
                        s = ""
                        bw_a = re.findall(
                            r"\[(.+?)\]", re.sub(r"\s*", "", m.group("bw"))
                        )
                        for i, bw in enumerate(bw_a):
                            s += "[" + bw.rjust(len_max[ilvl]["bw"][i]) + "]"
                        t += s.ljust(len_max[ilvl]["bw_sum"] + 1)
                else:
                    t += m.group("type").ljust(len_type)
                    # Align with signess only if it exist in at least one of the line
                    if len_max[ilvl]["sign"] > 0:
                        if m.group("sign"):
                            t += m.group("sign").ljust(len_max[ilvl]["sign"] + 1)
                        else:
                            t += "".ljust(len_max[ilvl]["sign"] + 1)
                    # Align with width only if it exist in at least one of the line
                    if len_max[ilvl]["bw_sum"] > 0:
                        s = ""
                        if m.group("bw"):
                            bw_a = re.findall(
                                r"\[(.+?)\]", re.sub(r"\s*", "", m.group("bw"))
                            )
                            for i, bw in enumerate(bw_a):
                                s += "[" + bw.rjust(len_max[ilvl]["bw"][i]) + "]"
                        t += s.ljust(len_max[ilvl]["bw_sum"] + 1)
                l += t.ljust(len_type_full)
                d = l  # save signal declaration before signal name in case it needs to be repeated for a signal list
                # list of signals : do not align with the end of lign
                if m.group("sig_list"):
                    l += m.group("name")
                    # No alignement for array/init in case of signal list
                    if m.group("array"):
                        l += (
                            re.sub(r"\s*", "", m.group("array")).rjust(
                                len_max[ilvl]["array_sum"]
                            )
                            + "]"
                        )
                    if m.group("init"):
                        l += " = " + m.group("init").strip().ljust(
                            len_max[ilvl]["init"]
                        )
                    if one_decl_per_line:
                        for s in m.group("sig_list").split(","):
                            if s != "":
                                if self.settings["alignComma"]:
                                    l += (
                                        ";\n"
                                        + d
                                        + s.strip().ljust(len_max[ilvl]["name"])
                                    )
                                else:
                                    l += ";\n" + d + s.strip()
                    else:
                        l += m.group("sig_list").strip()
                else:
                    l += m.group("name").ljust(len_max[ilvl]["name"])
                    # Align array definition
                    if len_max[ilvl]["array_sum"] > 0:
                        s = ""
                        if m.group("array"):
                            bw_a = re.findall(
                                r"\[(.+?)\]", re.sub(r"\s*", "", m.group("array"))
                            )
                            for i, bw in enumerate(bw_a):
                                s += "[" + bw.rjust(len_max[ilvl]["array"][i]) + "]"
                        l += s.ljust(len_max[ilvl]["array_sum"])
                    # Align init value (if available)
                    if len_max[ilvl]["init"] > 0:
                        if m.group("init"):
                            l += " = " + m.group("init").strip().ljust(
                                len_max[ilvl]["init"]
                            )
                        else:
                            l += "".rjust(len_max[ilvl]["init"] + 3)
                if self.settings["alignComma"]:
                    l += ";"
                else:
                    l_tmp = l.rstrip()
                    nb_pad = len(l) - len(l_tmp)
                    l = l_tmp + ";" + " " * nb_pad
                if m.group("comment"):
                    l += " " + m.group("comment").strip()
            else:  # Not a declaration ? don't touch
                l = line
            txt_new += l + "\n"
        if txt[-1] != "\n":
            txt_new = txt_new[:-1]
        return txt_new

try:
    beautifier = VerilogBeautifier(
        nbSpace=indentation_size,
        useTab=use_tabs,
        oneBindPerLine=one_bind_per_line,
        oneDeclPerLine=one_declaration_per_line,
    )
except Exception as e:
    beautifier = VerilogBeautifier(
        nbSpace=4,
        useTab=False,
        oneBindPerLine=False,
        oneDeclPerLine=False,
    )
    codein = "asdf"

codeout = beautifier.beautifyFile(codein)
codeout
