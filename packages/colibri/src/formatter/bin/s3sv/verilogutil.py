# Class/function to process verilog file
import re, string, os
import pprint
import functools

# regular expression for signal/variable declaration:
#   start of line follow by 1 to 4 word,
#   an optionnal array size,
#   an optional list of words
#   the signal itself (not part of the regular expression)
re_bw    = r'[\w\*\(\)\/><\:\-\+`\$\s]+'
re_var   = r'^\s*(\w+\s+)?(\w+\s+)?([A-Za-z_][\w\:\.]*\s+)(\['+re_bw+r'\])?\s*([A-Za-z_][\w=,\s]*,\s*)?\b'
re_decl  = r'(?:^|,|(?:\w|\)|#)\s*\(|;)\s*(?:const\s+)?(\w+\s+)?(\w+\s+)?(\w+\s+)?([A-Za-z_][\w\:\.]*\b\s*)((?:\['+re_bw+r'\]\s*)*)((?:[A-Za-z_]\w*(?:\s*\[[^=\^\&\|,;]*?\]\s*)?(?:\=\s*[\w\.\:]+\s*)?,\s*)*)\b'
re_enum  = r'^\s*(typedef\s+)?(enum)\s+(\w+\s*)?(\['+re_bw+r'\])?\s*(\{[^\}]+\})\s*([A-Za-z_][\w=,\s]*,\s*)?\b'
re_union = r'^\s*(typedef\s+)?(struct|union|`\w+)\s+(packed\s+)?(signed|unsigned)?\s*(\{[\w,;\s`\[\:\]\/\*\+\-><\(\)\$]+\})\s*([A-Za-z_][\w=,\s]*,\s*)?\b'
re_tdp   = r'^\s*(typedef\s+)(\w+)\s*(#\s*\(.*?\))?\s*()\b'
re_inst  = r'^\s*(virtual)?(\s*)()(\w+)\s*(#\s*\([^;]+\))?\s*()\b'
re_param = r'^\s*parameter\b((?:\s*(?:\w+\s+)?(?:[A-Za-z_]\w+)\s*=\s*(?:[^,;]*)\s*,)*)(\s*(\w+\s+)?([A-Za-z_]\w+)\s*=\s*([^,;]*)\s*;)'

# Port direction list constant
port_dir = ['input', 'output','inout', 'ref']


def clean_comment(text):
    def replacer(match):
        s = match.group(0)
        # Handle special case of ( * ) to not mistake with (* *)
        if match.group(1)=='*' :
            return s
        if s.startswith('/') or s.startswith('('):
            return " " # note: a space and not an empty string
        else:
            return s

    pattern = re.compile(
        r'//.*?$|/\*.*?\*/|\(\s*(\*)\s*\)|\(\*.*?\*\)|"(?:\\.|[^\\"])*"',
        re.DOTALL | re.MULTILINE
    )
    # do we need trim whitespaces?
    # txt_clean = re.sub(pattern, replacer, text)
    # return re.sub(r'^\s*$', '', txt_clean, flags = re.MULTILINE)
    return re.sub(pattern, replacer, text)

# Extract declaration of var_name from a file
def get_type_info_file(fname,var_name):
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
def get_type_info(txt,var_name,search_decl=True):
    ti_not_found = {'decl':None,'type':None,'array':"",'bw':"", 'name':var_name, 'tag': '', 'value':None}
    txt = clean_comment(txt)
    m = re.search(r'(?s)'+re_enum+r'('+var_name+r')\b.*$', txt, flags=re.MULTILINE)
    # print('[get_type_info] var = {}'.format(var_name))
    # print('[get_type_info] text = {}'.format(txt))
    # print('[get_type_info] RE = {}'.format(re_enum+r'('+var_name+r')\b.*$'))
    if m:
        # print('[get_type_info] {} type is Enum'.format(var_name))
        return get_type_info_from_match(var_name,m,1,3,5,-1,'enum')[0]
    # Struct
    m = re.search(re_union+r'('+var_name+r')\b.*$', txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is struct'.format(var_name))
        return get_type_info_from_match(var_name,m,1,3,5,-1,'struct')[0]
    # Typedef
    m = re.search(re_tdp+r'('+var_name+r')\b\s*;.*$', txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is typedef'.format(var_name))
        return get_type_info_from_match(var_name,m,1,3,3,-1,'typedef')[0]
    #
    if not search_decl:
        return ti_not_found
    # Clocking block
    m = re.search(r'(?s)\b(clocking)\s+('+var_name+r')(.*?)endclocking\b',txt)
    if m :
        # print('[get_type_info] {} type is Clocking'.format(var_name))
        return get_clocking_info(var_name,m.group(3))
    # Signal declaration
    re_str = re_decl+r'('+var_name+r'\b\s*((?:\[[^=\^\&\|,;]*?\]\s*)*))(\s*=\s*(\'\{.+?\}|\{.+?\}|[^,;]+))?[^\.]*?($|,|;)'
    # print('[get_type_info] RE Decl = {}'.format(re_str))
    m = re.search(re_str, txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is a declaration'.format(var_name))
        return get_type_info_from_match(var_name,m,3,4,5,9,'decl')[0]
    # Instances
    m = re.search(re_inst+r'('+var_name+r')\b.*$', txt, flags=re.MULTILINE)
    if m:
        # print('[get_type_info] {} type is an instance'.format(var_name))
        return get_type_info_from_match(var_name,m,3,4,5,9,'inst')[0]
    return ti_not_found

# Extract the macro content from `define name macro_content
def get_macro(txt, name):
    txt = clean_comment(txt)
    m = re.search(r'(?s)^\s*`define\s+'+name+r'\b[ \t]*(?:\((.*?)\)[ \t]*)?(.*?)(?<!\\)\n',txt,re.MULTILINE)
    if not m:
        return ''
    # remove line return
    macro = m.groups()[1].replace('\\\n','')
    param_list = m.groups()[0]
    if param_list:
        param_list = param_list.replace('\\\n','')
    # remove escape character for string
    macro = macro.replace('`"','"')
    # TODO: Expand macro if there is some arguments
    return macro,param_list

# Extract all signal declaration
def get_all_type_info(txt,no_inst=False):
    # print('[get_all_type_info] \n'+txt)
    # Cleanup function contents since this can contains some signal declaration
    # print('[get_all_type_info] Cleanup functions/task')
    txt = re.sub(r'(?s)^[ \t]*(import|export)[ \t]*(\".*?\"[ \t]*)?(pure)?[ \t]*(?P<block>function|task)\b.*?;','',txt, flags=re.MULTILINE)
    txt = re.sub(r'(?s)^[ \t\w]*extern\b[^;]+;','',txt, flags=re.MULTILINE)
    txt = re.sub(r'(?s)^[ \t\w]*(?P<block>function|task)\b.*?\bend(?P=block)\b.*?$','',txt, flags=re.MULTILINE)
    # Cleanup constraint definition
    # print('[get_all_type_info] Cleanup constraint')
    # txt = re.sub(r'(?s)constraint\s+\w+\s*\{\s*(?:[^\{\}]+(?:\{[^\{\}]*\})?)*?\s*\}','',txt,  flags=re.MULTILINE)
    constraint = [(m.group('name'),m.start(),m.end()) for m in re.finditer(r'(?s)constraint\s+(?P<name>\w+)\s*\{',txt)]
    for name,start,end in reversed(constraint):
        cnt = 1
        pos = end+1
        while cnt > 0 and cnt < 64:
            m = re.search(r'{|}',txt[pos:])
            if not m:
                print('[SV] Error parsing constraint {}, unbalanced curly bracket !'.format(name))
                cnt = -1
            else:
                pos = pos + m.end()+1
                cnt = cnt + 1 if m.group(0)=='{' else cnt - 1
                if cnt > 64 :
                    print('[SV] Too many nested bracket in constraint {} !'.format(name))
                    cnt = -1
        # print('Constraint {} going from {} to {} (cnt={})'.format(name,start,pos,cnt))
        if pos>start and cnt==0:
            txt = txt[0:start]+txt[pos:]
    # print('[get_all_type_info] \n'+txt)
    # Suppose text has already been cleaned
    ti = []
    # Look all modports
    # print('[get_all_type_info] Look for modports')
    r = re.compile(r'(?s)modport\s+(\w+)\s*\((.*?)\);', flags=re.MULTILINE)
    modports = r.findall(txt)
    if modports:
        for modport in modports:
            ti.append({'decl':modport[1].replace('\n',''),'type':'','array':'','bw':'', 'name':modport[0], 'tag':'modport'})
        # remove modports before looking for I/O and field to avoid duplication of signals
        txt = r.sub('',txt)
    # Look for clocking block
    # print('[get_all_type_info] Look for clocking block')
    r = re.compile(r'(?s)(default\s+)?(clocking)\s+(\w+)(.*?)endclocking(\s*:\s*\w+)?', flags=re.MULTILINE)
    cbs = r.findall(txt)
    if cbs:
        for cb in cbs:
            ti.append(get_clocking_info(cb[2],cb[3]))
            # print('[get_all_type_info] Clocking: {}'.format(ti))
        # remove clocking block before looking for I/O and field to avoid duplication of signals
        txt = r.sub('',txt)
    # Look for enum declaration
    # print('[get_all_type_info] Look for enum declaration')
    r = re.compile(re_enum+r'(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*;',flags=re.MULTILINE)
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match('',m,1,3,5,-1,'enum')
        # print('[get_all_type_info] enum groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x['type']]
    # remove enum declaration since the content could be interpreted as signal declaration
    txt = r.sub('',txt)
    # Look for struct declaration
    # print('[get_all_type_info] Look for struct declaration')
    r = re.compile(re_union+r'(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*;',flags=re.MULTILINE)
    # print('[get_all_type_info] struct re="{0}"'.format(r.pattern))
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match('',m,1,3,5,-1,'struct')
        # print('[get_all_type_info] struct groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x['type']]
    # remove struct declaration since the content could be interpreted as signal declaration
    txt = r.sub('',txt)
    # Look for typedef declaration
    # print('[get_all_type_info] Look for typedef declaration')
    r = re.compile(re_tdp+r'(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*;',flags=re.MULTILINE)
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match('',m,1,3,3,-1,'typedef')
        # print('[get_all_type_info] typedef groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x['type']]
    # remove typedef declaration since the content could be interpreted as signal declaration
    txt = r.sub('',txt)
    # Look for signal declaration
    # print('[get_all_type_info] Look for signal declaration')
    # TODO: handle init value
    re_str = re_decl+r'(\w+\b(\s*\[[^=\^\&\|,;\[\]]*?\]\s*)*)\s*(?:\=\s*(\'\{.+\}|[^;,]+)\s*)?(?=;|,|\)\s*;)'
    # print('[get_all_type_info] decl re="{0}"'.format(re_str))
    r = re.compile(re_str,flags=re.MULTILINE)
    for m in r.finditer(txt):
        ti_tmp = get_type_info_from_match('',m,3,4,5,8,'decl')
        # print('[get_all_type_info] decl groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
        ti += [x for x in ti_tmp if x['type']]
    # Look for interface instantiation
    if not no_inst:
        # print('[get_all_type_info] Look for interface instantiation')
        re_str = re_inst+r'(\w+\b(\s*\[[^=\^\&\|,;]*?\]\s*)?)\s*\('
        r = re.compile(re_str,flags=re.MULTILINE)
        # print('[get_all_type_info] inst re="{0}"'.format(re_str))
        for m in r.finditer(txt):
            ti_tmp = get_type_info_from_match('',m,3,4,5,-1,'inst')
            # print('[get_all_type_info] inst groups=%s => ti=%s' %(str(m.groups()),str(ti_tmp)))
            ti += [x for x in ti_tmp if x['type']]
    # print('[get_all_type_info] {0}'.format(ti))
    # Look for non-ansi declaration where a signal is declared twice (I/O then reg/wire) and merge it into one declaration
    ti_dict = {}
    pop_list = []
    for (i,x) in enumerate(ti[:]) :
        if x['name'] in ti_dict:
            ti_index = ti_dict[x['name']][1]
            # print('[get_all_type_info] Duplicate found for %s => %s and %s' %(x['name'],ti_dict[x['name']],x))
            if ti[ti_index]['type'].split()[0] in port_dir:
                ti[ti_index]['decl'] = ti[ti_index]['decl'].replace(ti[ti_index]['type'],ti[ti_index]['type'].split()[0] + ' ' + x['type'])
                ti[ti_index]['type'] = x['type']
                pop_list.append(i)
        else :
            ti_dict[x['name']] = (x,i)
    for i in sorted(pop_list,reverse=True):
        ti.pop(i)
    # pprint.pprint(ti, width=200)
    return ti

# Get type info from a match object
def get_type_info_from_match(var_name,m,idx_type,idx_bw,idx_max,idx_val,tag):
    ti_not_found = {'decl':None,'type':None,'array':"",'bw':"", 'name':var_name, 'tag':tag, 'value':None}
    #return a tuple of None if not found
    if not m:
        return [ti_not_found]
    if not m.groups()[idx_type]:
        return [ti_not_found]
    line = m.group(0).strip()
    # print("[SV:get_type_info_from_match] varname={0} str='{7}' m={1} idx_type={2} idx_bw={3} idx_max={4},idx_val={5} tag={6}".format(var_name,m.groups(),idx_type,idx_bw,idx_max,idx_val,tag,line))
    # Extract the type itself: should be the mandatory word, except if is a sign qualifier
    t = str.rstrip(m.groups()[idx_type])
    # Remove potential false positive
    if t in ['begin', 'end', 'endcase', 'endspecify', 'else', 'posedge', 'negedge', 'timeunit', 'timeprecision','assign', 'disable', 'property', 'initial', 'assert', 'cover', 'always_comb'] or t.endswith('.'):
        return [ti_not_found]
    t = t.split('.')[0] # Handle interface with portmod (maybe add more checks)
    if t=="unsigned" or t=="signed": # TODO check if other cases might happen
        if m.groups()[2] is not None:
            t = str.rstrip(m.groups()[2]) + ' ' + t
        elif m.groups()[1] is not None:
            t = str.rstrip(m.groups()[1]) + ' ' + t
        elif m.groups()[0] is not None and not m.groups()[0].startswith('end'):
            t = str.rstrip(m.groups()[0]) + ' ' + t
    elif t=="const": # identifying a variable as simply const is typical of a struct/union : look for it
        m = re.search( re_union+var_name+r'.*$', line, flags=re.MULTILINE)
        if m is None:
            return [ti_not_found]
        t = m.groups()[1]
        idx_bw = 3
    # print("[SV:get_type_info_from_match] type={} Group => {}".format(t,str(m.groups())))
    value = None
    ft = ''
    bw = ''
    if var_name!='':
        signal_list = re.findall(r'('+var_name + r')\b\s*((?:\[(.*?)\]\s*)*)', m.groups()[idx_max+1], flags=re.MULTILINE)
        if idx_val > 0 and len(m.groups())>idx_val and m.groups()[idx_val]:
            value = str.rstrip(m.groups()[idx_val])
    else:
        signal_list = []
        re_str = r'(\w+)\b\s*((?:\[(.*)\]\s*)*)(?:\=\s*(\'\{.+?\}|[^;,]+)\s*)?,?'
        if m.groups()[idx_max]:
            signal_list = re.findall(re_str, m.groups()[idx_max], flags=re.MULTILINE)
            # print("[SV:get_type_info_from_match] idxmax => signal_list = " + str(signal_list))
        if m.groups()[idx_max+1]:
            s = m.groups()[idx_max+1]
            # print("[SV:get_type_info_from_match] idxmax+1 => s = " + str(s))
            if idx_val > 0 and len(m.groups())>idx_val and m.groups()[idx_val]:
                s += ' = ' + m.groups()[idx_val]
            signal_list += re.findall(re_str, s, flags=re.MULTILINE)
            # print("[SV:get_type_info_from_match] idxmax+1 => signal_list = " + str(signal_list))
    # remove reserved keyword that could end up in the list
    signal_list = [s for s in signal_list if s[0] not in ['if','case', 'casex', 'casez', 'for', 'foreach', 'generate', 'input', 'output', 'inout', 'return']]
    if not signal_list:
        return [ti_not_found]
    # print("[SV:get_type_info_from_match] signal_list = " + str(signal_list) + ' for line ' + line)
    #Concat the first 5 word if not None (basically all signal declaration until signal list)
    for i in range(0,idx_max):
        # print('[get_type_info_from_match] tag='+tag+ ' name='+str(signal_list)+ ' match (' + str(i) + ') = ' + str(m.groups()[i]).strip())
        if m.groups()[i] is not None:
            tmp = m.groups()[i].strip()
            if tmp:
                # Cleanup space in enum/struct declaration
                if i==4 and t in ['enum','struct']:
                    tmp = re.sub(r'\s+',' ',tmp,flags=re.MULTILINE)
                #Cleanup spaces in bitwidth
                if i==idx_bw:
                    tmp = re.sub(r'\s+','',tmp,flags=re.MULTILINE)
                    bw = tmp
                # regex can catch more than wanted, so filter based on a list
                if not tmp.startswith('end'):
                    ft += tmp + ' '
    if not ft.strip():
        return [ti_not_found]
    ti = []
    if t=='class' and len(signal_list)==1 :
        # For class try to create a valid complete class declaration by adding at least the endclass
        # If the declaration was on more than one line assume it was because of parameters, and close parenthesis
        l = line.strip()
        if not l.endswith(';'):
            if l.endswith(','):
                l = l[:-1]
            l+= ');'
        l+='\nendclass'
        ti.append(parse_class(l))
        if ti[0]:
            ti[0]['tag'] = 'decl'
        else:
            ti[0] = ti_not_found
    else :
        for signal in signal_list :
            # print("signal: " + str(signal) )
            fts = ft + signal[0]
            # Check if the variable is an array and the type of array (fixed, dynamic, queue, associative)
            at = ""
            if signal[1]!='':
                fts += signal[1].strip()
                if signal[1].count('[')>1:
                    at='multidimension'
                elif signal[2] =="":
                    at='dynamic'
                elif signal[2]=='$':
                    at='queue'
                elif signal[2]=='*':
                    at='associative'
                else:
                    ma= re.match(r'[A-Za-z_][\w]*$',signal[2])
                    if ma:
                        at='associative'
                    else:
                        at='fixed'
            if not value and len(signal)>=4:
                value = signal[3]
            d = {'decl':fts,'type':t,'array':at,'bw':bw, 'name':signal[0], 'tag':tag, 'value': value}
            if at:
                d['array_dim'] = signal[1].strip()
            ft0 = ft.split()[0]
            if ft0 in ['local','protected']:
                d['access'] = ft0
            # TODO: handle init value inside list
            # print("Array: " + str(m) + "=>" + str(at))
            ti.append(d)
    return ti

def get_clocking_info(name, content):
    ports = []
    for m_port in re.finditer(r'input\s+([^;]+);',content):
        ports+=[{'name':x.strip(),'type':'input'} for x in m_port.group(1).split(',')]
    for m_oport in re.finditer(r'output\s+([^;]+);',content):
        ports+=[{'name':x.strip(),'type':'output'} for x in m_port.group(1).split(',')]
    ti = {'decl':'clocking '+name,'type':'clocking','array':'','bw':'', 'name':name, 'tag':'clocking',
        'port':ports}
    # print('[get_clocking_info] {}'.format(ti))
    return ti

###############################################################################
# Parse a module for port/signal/instance/... information
def parse_module_file(fname,mname=r'\w+',inst_only=False,no_inst=False):
    # print("Parsing file " + fname + " for module " + mname)
    fdate = os.path.getmtime(fname)
    minfo = parse_module_file_cache(fname, mname, fdate,inst_only,no_inst)
    # print(parse_module_file_cache.cache_info())
    return minfo

@functools.lru_cache(maxsize=32)
def parse_module_file_cache(fname, mname, fdate,inst_only=False,no_inst=False):
    with open(fname) as f:
        flines = f.read()
        minfo = parse_module(flines, mname,inst_only,no_inst)
    return minfo

def parse_module(flines,mname=r'\w+',inst_only=False,no_inst=False):
    flines = clean_comment(flines)
    re_str = r"(?s)(?P<type>module|interface)\s+(?P<name>"+mname+r")(?P<import>\s+import\s+.*?;)?\s*(#\s*\((?P<param>.*?)\))?\s*(\((?P<port>.*?)\))?\s*;(?P<content>.*?)(?P<ending>endmodule|endinterface)"
    # print("[SV:parse_module] name={} -> re = {}".format(mname,re_str))
    # print("Parsing for module " + mname + ' in \n' + flines)
    m = re.search(re_str, flines, re.MULTILINE)
    if m is None:
        return None
    mname = m.group('name')
    txt = m.group(0)
    if inst_only:
        minfo = {'name': mname, 'param':[], 'port':[], 'inst':[], 'type':m.group('type'), 'signal' : []}
        re_str  = r'^[ \t]*(\w+)\s*(?:#\s*\([^;]+\))?\s*\b(\w+)\b(?:\s*\[[^=\^\&\|,;]*?\]\s*)?\s*\('
        li = re.findall(re_str,txt,flags=re.MULTILINE)
        for l in li:
            if l[0] not in ['module', 'class','interface', 'begin', 'end', 'endcase', 'endspecify', 'else', 'posedge', 'negedge', 'timeunit', 'timeprecision','assign', 'disable', 'property', 'initial', 'assert', 'cover','generate']:
                minfo['inst'].append({'type':l[0],'name':l[1]})
        return minfo
    # Extract list of param if any
    params_name = []
    params = extract_params(m)
    if params:
        params_name = [param['name'] for param in params]
    # Extract all type information inside the module : signal/port declaration, interface/module instantiation
    if m.group('param'):
        txt = txt.replace(m.group('param'),'')
    ati = []
    if m.group('port'):
        ati += get_all_type_info(m.group('port')+';')
    if m.group('content'):
        ati += get_all_type_info(m.group('content'))
    # print('[SV.parse_module] ati = ')
    # pprint.pprint(ati,width=200)
    # Extract port name
    ports = []
    ports_name = []
    if m.group('port'):
        s = m.group('port')
        ports_name = re.findall(r"(\w+)\s*(?=,|$|=|\[[^=\^\&\|,;]*?\]\s*(?=,|$|=))",s)
        # get type for each port
        ports = []
        ports = [ti for ti in ati if ti['name'] in ports_name]
    ports_name += params_name
    # Extract instances name
    inst = [ti for ti in ati if ti['type']!='module' and ti['type']!='interface' and ti['tag']=='inst']
    # Extract signal name
    signals = [ti for ti in ati if ti['type'] not in ['module','interface'] and ti['tag'] not in ['inst','modport','clocking'] and ti['name'] not in ports_name ]
    minfo = {'name': mname, 'param':params, 'port':ports, 'inst':inst, 'type':m.group('type'), 'signal' : signals}
    modports = [ti for ti in ati if ti['tag']=='modport']
    if modports:
        minfo['modport'] = modports
    clocking = [ti for ti in ati if ti['tag']=='clocking']
    if clocking:
        minfo['clocking'] = clocking
    # print('[SV.parse_module] minfo = ')
    # pprint.pprint(minfo,width=200)
    return minfo

# Extract params using a matching group already containg group for params and content
def extract_params(m):
    params = []
    param_type = ''
    pos = 0
    ## Parameter define in ANSI style
    r = re.compile(r"(parameter\s+)?(?P<decl>\b\w+\b\s*(\[[\w\:\-\+`\s]+\]\s*)?)?(?P<name>\w+)\s*=\s*(?P<value>[^,;\n]+)")
    if m.group('param'):
        s = clean_comment(m.group('param'))
        for mp in r.finditer(s):
            params.append(mp.groupdict())
            if not params[-1]['decl']:
                params[-1]['decl'] = param_type;
            else :
                params[-1]['decl'] = params[-1]['decl'].strip();
                param_type = params[-1]['decl']
            params[-1]['value'] = params[-1]['value'].strip()
            params[-1]['position'] = pos
            pos = pos + 1
    ## look for parameter defined inline
    if m.group('content'):
        s = clean_comment(m.group('content'))
        r_param_list = re.compile(re_param,flags=re.MULTILINE)
        for mpl in r_param_list.finditer(s):
            param_type = ''
            for mp in r.finditer(mpl.group(0)):
                params.append(mp.groupdict())
                if not params[-1]['decl']:
                    params[-1]['decl'] = param_type;
                else :
                    params[-1]['decl'] = params[-1]['decl'].strip();
                    param_type = params[-1]['decl']
                params[-1]['value'] = params[-1]['value'].strip()
                params[-1]['position'] = pos
                pos = pos + 1
    return params

# Parse a package for port information
def parse_package_file(fname,pname=r'\w+'):
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

def parse_package(flines,pname=r'\w+'):
    # print("Parsing for package " + pname + ' in \n' + flines)
    m = re.search(r"(?s)(?P<type>package)\s+(?P<name>"+pname+")\s*;\s*(?P<content>.+?)(?P<ending>endpackage)", flines, re.MULTILINE)
    if m is None:
        return None
    txt = clean_comment(m.group('content'))
    ti = get_all_function(txt)
    ti += get_all_type_info(txt,no_inst=True)
    # print(ti)
    return ti

def parse_function(flines,funcname):
    fi = get_all_function(flines,funcname)
    # print('Parse function {} in :\n{}'.format(flines,funcname))
    if not fi:
        return None
    else :
        # print(fi)
        return fi[0]

# Parse a class for function and members
def parse_class_file(fname,cname=r'\w+'):
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

def parse_class(flines,cname=r'\w+'):
    #print("Parsing for class " + cname + ' in \n' + flines)
    re_str = r"(?s)(?P<type>class)\s+(?P<name>"+cname+r")\s*(#\s*\((?P<param>.*?)\))?\s*(extends\s+(?P<extend>\w+(?:\s*#\(.*?\))?))?\s*;(?P<content>.*?)(?P<ending>endclass)"
    # print('[parse_class] regexp = {}'.format(re_str))
    re_class = re.compile(re_str, flags=re.MULTILINE)
    m = re_class.search(flines)
    if m is None:
        return None
    txt = clean_comment(m.group('content'))
    # print('[parse_class] Matched class in :\n'+txt)
    ci = {'type':'class', 'name': m.group('name'), 'extend': None if 'extend' not in m.groupdict() else m.group('extend'), 'function' : []}
    ci['decl'] = 'class {name} {param}{extend}'.format(\
        name=ci['name'],\
        param='' if not m.group('param') else '#({0}) '.format(m.group('param')),\
        extend='' if not ci['extend'] else 'extends {0}'.format(ci['extend']) )
    # print('[parse_class] Init ci:\n'+str(ci))
    ci['param'] = extract_params(m)
    # print('[parse_class] ci after params extract\n'+str(ci))
    # Extract all functions
    ci['function'] = get_all_function(txt)
    # print('[parse_class] ci after function extract\n'+str(ci))
    # Extract members
    ci['member'] = get_all_type_info(txt,no_inst=True)
    # print('[parse_class] Final ci:\n'+str(ci))
    return ci

def get_all_function(txt,funcname=r'\w+'):
    fil = [] # Function Info list
    names = []
    re_str = r'(?s)(extern)\s+(?:\b(protected|local)\s+)?(\b(?:virtual|static)\s+)?\b(function|task)\s+((?:\w+\s+)?(?:\w+\s+|\[[\d:]+\]\s+)?)\b('+funcname+r')\b\s*(\((.*?)\s*\))?\s*;()'
    fl = re.findall(re_str,txt,flags=re.MULTILINE)
    txt = re.sub(re_str,'',txt,flags=re.MULTILINE)
    re_str = r'(?s)^[ \t]*(import)\s+".*?"\s*()()(function)\s+((?:\w+\s+)?(?:\w+\s+|\[[\d:]+\]\s+)?)\b('+funcname+r')\b\s*(\((.*?)\s*\))?\s*;()'
    fl += re.findall(re_str,txt,flags=re.MULTILINE)
    txt = re.sub(re_str,'',txt,flags=re.MULTILINE)
    # txt = re.sub(r'\n([ \t]*\n)+','\n',txt,flags=re.MULTILINE)
    # print('Content after filter : \n' + txt)
    re_str = r'(?s)()(?:\b(protected|local)\s+)?(\bvirtual\s+)?\b(function|task)\s+((?:\w+\s+)?(?:\w+\s+|\[[\d:]+\]\s+)?)\b((?:\w+::)?'+funcname+r')\b\s*(\((.*?)\s*\))?\s*;(.*?)\bend\4\b'
    fl += re.findall(re_str,txt,flags=re.MULTILINE)
    for ( f_def, f_access, f_virtual, f_type, f_return,f_name,f_args_,f_args, f_content) in fl:
        # print('Parsing function {} {}'.format(f_name,f_args_))
        if f_name in names:
            continue
        else :
            names.append(f_name)
        # Arguments in declaration -> parse them
        if f_args:
            # print('Parsing type from arguments {}'.format(f_args))
            pi = get_all_type_info(f_args + ';')
        # Empty list of argument in declaration -> nothing to do
        elif f_args_:
            pi=[]
        # Non-Ansi style declaration -> search for arguments in the function body
        else:
            # print('Parsing type from content {}'.format(f_content))
            ti_all = get_all_type_info(f_content)
            pi = [x for x in ti_all if x['decl'].startswith(('input','output','inout','ref'))]
        f_decl = '{acc} {virt} {type} {ret} {name}'.format(acc=f_access, virt=f_virtual, type=f_type, ret=f_return,name=f_name)
        f_decl = re.sub(r'\s+',' ',f_decl.strip())
        d = {'name': f_name, 'type': f_type, 'port': pi, 'return': f_return, 'decl': f_decl, 'definition': f_def}
        if f_access:
            d['access'] = f_access
        if d['return'].startswith('automatic'):
            d['return'] = ' '.join(d['return'].split()[1:])
        fil.append(d)
    # print([x['name'] for x in fil])
    return fil

# Fill all entry of a case for enum or vector (limited to 8b)
# ti is the type infor return by get_type_info
def fill_case(ti,length=0):
    if not ti['type']:
        print('[fill_case] No type for signal ' + str(ti['name']))
        return (None,None)
    # print('[fill_case] ti = {0}'.format(ti))
    t = ti['type'].split()[0]
    s = '\n'
    if t == 'enum':
        # extract enum from the declaration
        m = re.search(r'\{(.*)\}', ti['decl'])
        if m :
            el = re.findall(r"(\w+).*?(,|$)",m.groups()[0])
            maxlen = max([len(x[0]) for x in el])
            if maxlen < 7:
                maxlen = 7
            for x in el:
                s += '\t' + x[0].ljust(maxlen) + ' : ;\n'
            s += '\tdefault'.ljust(maxlen+1) + ' : ;\nendcase'
            return (s,[x[0] for x in el])
    elif t in ['logic','bit','reg','wire','input','output']:
        m = re.search(r'\[\s*(\d+)\s*\:\s*(\d+)',ti['bw'])
        if m :
            # If no length was provided use the complete bitwidth
            if length>0:
                bw = length
            else :
                bw = int(m.groups()[0]) + 1 - int(m.groups()[1])
            if bw <=8 :
                for i in range(0,(1<<bw)):
                    s += '\t' + str(i).ljust(7) + ' : ;\n'
                s += '\tdefault : ;\nendcase'
                return (s,range(0,(1<<bw)))
    print('[fill_case] Type not supported: ' + str(t))
    return (None,None)


# Extract all enum values from the declaration
def get_enum_values(decl):
    m = re.search(r'\{(.*)\}', decl)
    if not m:
        return []
    return re.findall(r"(\w+).*?(?:,|$)",m.groups()[0])
