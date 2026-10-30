// Copyright 2024
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
//
// This file is part of TerosHDL
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import { findNetInSources, getNetsSourceInfo, makeBitIdsUnique, parseSrcLocation } from '../../src/colibri/yosys/utils';
import * as path_lib from 'path';

function get_netlist_fixture(): any {
    return {
        modules: {
            sub: {
                ports: {
                    clk: { direction: 'input', bits: [2] },
                    q: { direction: 'output', bits: [3, 4] }
                },
                netnames: {
                    clk: { bits: [2], attributes: { src: '/src/sub.v:2.16-2.19' } },
                    q: { bits: [3, 4], attributes: { src: '/src/sub.v:5.10-5.11' } },
                    '$0\\q[1:0]': { bits: [5, 6], attributes: { src: '/src/sub.v:8.1-8.20' } },
                    '$procmux$1_Y': { bits: [5, 6], attributes: {} },
                    '$auto$rtlil.cc:1:ReduceOr$1': { bits: [2], attributes: {} }
                },
                cells: {
                    dff: {
                        type: '$dff',
                        port_directions: { D: 'input', Q: 'output', CLK: 'input' },
                        connections: { D: [5, 6], Q: [3, 4], CLK: [2] }
                    },
                    mux: {
                        type: '$mux',
                        port_directions: { A: 'input', B: 'input', S: 'input', Y: 'output' },
                        connections: { A: [3, 4], B: [3], S: [2], Y: [5, 6] }
                    },
                    adder: {
                        type: '$add',
                        port_directions: { A: 'input', B: 'input', Y: 'output' },
                        connections: { A: [3, 4], B: ['1', '0'], Y: [7, 8] }
                    }
                }
            },
            top: {
                ports: {
                    clk: { direction: 'input', bits: [2] },
                    q: { direction: 'output', bits: [3, 4] }
                },
                netnames: {
                    clk: { bits: [2], attributes: { src: '/src/top.v:2.16-2.19' } },
                    q: { bits: [3, 4], attributes: { src: '/src/top.v:5.10-5.11' } }
                },
                cells: {
                    u0: {
                        type: 'sub',
                        port_directions: { clk: 'input', q: 'output' },
                        connections: { clk: [2], q: [3, 4] }
                    }
                }
            }
        }
    };
}

function collect_module_bits(module_i: any): any[] {
    const bits: any[] = [];
    const netnames = module_i.netnames || {};
    for (const net_name of Object.keys(netnames)) {
        bits.push(...(netnames[net_name].bits || []));
    }
    const ports = module_i.ports || {};
    for (const port_name of Object.keys(ports)) {
        bits.push(...(ports[port_name].bits || []));
    }
    const cells = module_i.cells || {};
    for (const cell_name of Object.keys(cells)) {
        const connections = cells[cell_name].connections || {};
        for (const port_name of Object.keys(connections)) {
            bits.push(...connections[port_name]);
        }
    }
    return bits;
}

describe('Yosys utils', () => {

    describe('parseSrcLocation', () => {
        it('parses a full Yosys src attribute', () => {
            expect(parseSrcLocation('/src/sub.v:2.16-2.19')).toEqual({ file: '/src/sub.v', line: 2 });
        });

        it('parses a src attribute without the second line', () => {
            expect(parseSrcLocation('/src/sub.v:12.5')).toEqual({ file: '/src/sub.v', line: 12 });
        });

        it('parses a src attribute without columns', () => {
            expect(parseSrcLocation('file.vhd:7')).toEqual({ file: 'file.vhd', line: 7 });
        });

        it('parses a Windows path', () => {
            expect(parseSrcLocation('C:\\src\\file.v:3.1-3.9')).toEqual({ file: 'C:\\src\\file.v', line: 3 });
        });

        it('returns line 0 when there is no line information', () => {
            expect(parseSrcLocation('')).toEqual({ file: '', line: 0 });
            expect(parseSrcLocation('file.v')).toEqual({ file: 'file.v', line: 0 });
        });
    });

    describe('makeBitIdsUnique', () => {
        it('makes the bit ids unique across the modules', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);

            // the bit ids of a module can repeat inside the module (netnames,
            // ports and connections), but the bit ids of different modules must
            // not overlap
            let total_unique = 0;
            const all_unique = new Set<number>();
            for (const module_name of Object.keys(netlist.modules)) {
                const number_bits = collect_module_bits(netlist.modules[module_name])
                    .filter((bit) => typeof bit === 'number');
                const module_unique = new Set<number>(number_bits);
                total_unique += module_unique.size;
                for (const bit of module_unique) {
                    all_unique.add(bit);
                }
            }
            expect(all_unique.size).toBe(total_unique);
        });

        it('shifts the bits of every module by the same base', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);

            // sub keeps its bit ids (first module), top is shifted by
            // max_bit(sub) + num_constants(sub) + 1 = 8 + 2 + 1 = 11
            expect(netlist.modules.top.netnames.clk.bits).toEqual([13]);
            expect(netlist.modules.top.netnames.q.bits).toEqual([14, 15]);
            expect(netlist.modules.top.ports.clk.bits).toEqual([13]);
            expect(netlist.modules.top.cells.u0.connections.clk).toEqual([13]);
            expect(netlist.modules.top.cells.u0.connections.q).toEqual([14, 15]);

            expect(netlist.modules.sub.netnames.clk.bits).toEqual([2]);
            expect(netlist.modules.sub.cells.mux.connections.B).toEqual([3]);
        });

        it('does not modify the constant bits', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);
            expect(netlist.modules.sub.cells.adder.connections.B).toEqual(['1', '0']);
        });

        it('keeps the bit ids of different modules in disjoint ranges', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);

            const sub_bits = collect_module_bits(netlist.modules.sub)
                .filter((bit) => typeof bit === 'number');
            const top_bits = collect_module_bits(netlist.modules.top)
                .filter((bit) => typeof bit === 'number');
            const sub_max = Math.max(...sub_bits);
            const top_min = Math.min(...top_bits);
            // netlistsvg creates new bit ids for the constant bits starting at
            // max_bit + 1: the ranges must not overlap
            expect(top_min).toBeGreaterThan(sub_max + 2);
        });
    });

    describe('getNetsSourceInfo', () => {
        it('gets the source location of the nets indexed by their bit ids', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);
            const nets_info = getNetsSourceInfo(netlist);

            expect(nets_info['2']).toEqual({ name: 'clk', file: '/src/sub.v', line: 2 });
            expect(nets_info['3,4']).toEqual({ name: 'q', file: '/src/sub.v', line: 5 });
            expect(nets_info['13']).toEqual({ name: 'clk', file: '/src/top.v', line: 2 });
            expect(nets_info['14,15']).toEqual({ name: 'q', file: '/src/top.v', line: 5 });
        });

        it('prefers the real netname when several netnames share the same bits', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);
            const nets_info = getNetsSourceInfo(netlist);

            // 'clk' (real name) wins over '$auto$rtlil.cc:1:ReduceOr$1'
            // (auto-generated name)
            expect(nets_info['2'].name).toBe('clk');
        });

        it('cleans the name of the nets renamed by a Yosys pass', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);
            const nets_info = getNetsSourceInfo(netlist);

            // '$0\\q[1:0]' is a real name ('$procmux$1_Y' is auto-generated and
            // filtered out) and the '$0\\' prefix is removed
            expect(nets_info['5,6']).toEqual({ name: 'q[1:0]', file: '/src/sub.v', line: 8 });
        });

        it('does not register the nets with only auto-generated names', () => {
            const netlist = get_netlist_fixture();
            // the adder output only has an auto-generated name (even with src
            // information): it must not be labeled
            netlist.modules.sub.netnames['$add$/home/user/proj/mylib/sub.v:12$2_Y'] =
                { bits: [7, 8], attributes: { src: '/src/sub.v:12.18-12.27' } };
            netlist.modules.sub.netnames['$auto$rtlil.cc:10:Add$3'] =
                { bits: [9], attributes: {} };
            netlist.modules.sub.cells.mux.connections.S = [9];
            makeBitIdsUnique(netlist);
            const nets_info = getNetsSourceInfo(netlist);

            expect(nets_info['7,8']).toBeUndefined();
            expect(nets_info['9']).toBeUndefined();
        });

        it('registers the bus slices of the connections as parts of the net', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);
            const nets_info = getNetsSourceInfo(netlist);

            // the mux B port is connected to bit 0 of 'q' ([3, 4])
            expect(nets_info['3']).toEqual({ name: 'q[0]', file: '/src/sub.v', line: 5 });
        });

        it('registers the multi-bit bus slices with the bit range', () => {
            const netlist = get_netlist_fixture();
            netlist.modules.sub.netnames.wide = { bits: [10, 11, 12, 13], attributes: { src: '/src/sub.v:9.5-9.8' } };
            netlist.modules.sub.cells.mux.connections.B = [11, 12];
            makeBitIdsUnique(netlist);
            const nets_info = getNetsSourceInfo(netlist);

            // bits [11, 12] are bits [2:1] of 'wide' ([10, 11, 12, 13])
            expect(nets_info['11,12']).toEqual({ name: 'wide[2:1]', file: '/src/sub.v', line: 9 });
        });

        it('does not register the nets without a matching netname', () => {
            const netlist = get_netlist_fixture();
            makeBitIdsUnique(netlist);
            const nets_info = getNetsSourceInfo(netlist);

            // the constant connection of the adder ('1', '0') has no netname
            expect(nets_info['1,0']).toBeUndefined();
        });
    });

    describe('findNetInSources', () => {
        const verilog_dir = path_lib.join(__dirname, '..', 'yosys', 'helpers', 'verilog');
        const vhdl_dir = path_lib.join(__dirname, '..', 'yosys', 'helpers', 'vhdl');
        const verilog_logic = path_lib.join(verilog_dir, 'mylib', 'counter_logic.v');
        const verilog_top = path_lib.join(verilog_dir, 'counter_top.v');
        const vhdl_logic = path_lib.join(vhdl_dir, 'mylib', 'counter_logic.vhd');
        const vhdl_top = path_lib.join(vhdl_dir, 'counter_top.vhd');

        it('finds a Verilog net declaration', () => {
            expect(findNetInSources('count', [verilog_logic, verilog_top]))
                .toEqual({ file: verilog_logic, line: 5 });
            expect(findNetInSources('clk', [verilog_logic, verilog_top]))
                .toEqual({ file: verilog_logic, line: 2 });
        });

        it('finds a Verilog net declaration of the top module', () => {
            expect(findNetInSources('count_out', [verilog_logic, verilog_top]))
                .toEqual({ file: verilog_top, line: 5 });
        });

        it('finds a VHDL net declaration', () => {
            expect(findNetInSources('count', [vhdl_logic, vhdl_top]))
                .toEqual({ file: vhdl_logic, line: 10 });
            expect(findNetInSources('r0_count', [vhdl_logic, vhdl_top]))
                .toEqual({ file: vhdl_logic, line: 15 });
            expect(findNetInSources('internal_count', [vhdl_logic, vhdl_top]))
                .toEqual({ file: vhdl_top, line: 17 });
        });

        it('finds a net declared with a bit range in the name', () => {
            expect(findNetInSources('count[7:0]', [verilog_logic, verilog_top]))
                .toEqual({ file: verilog_logic, line: 5 });
        });

        it('does not find a net that is not in the sources', () => {
            expect(findNetInSources('nonexistent_net', [verilog_logic, verilog_top]))
                .toBeUndefined();
            expect(findNetInSources('', [verilog_logic])).toBeUndefined();
            expect(findNetInSources('count', [])).toBeUndefined();
            expect(findNetInSources('count', [path_lib.join(verilog_dir, 'missing.v')]))
                .toBeUndefined();
        });
    });
});
