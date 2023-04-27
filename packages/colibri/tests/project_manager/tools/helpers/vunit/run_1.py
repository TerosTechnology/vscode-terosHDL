# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2014-2020, Lars Asplund lars.anders.asplund@gmail.com

"""
Run
---

Demonstrates the VUnit run library.
"""

from pathlib import Path
from vunit import VUnit

ROOT = Path(__file__).parent

vu = VUnit.from_argv()
lib = vu.add_library("lib")
lib.add_source_files(ROOT / "tb_with_test_cases.vhd")
lib.add_source_files(ROOT / "test_control.vhd")

vu.main()