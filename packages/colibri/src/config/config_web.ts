/* eslint-disable max-len */
// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

export const WEB_CONFIG = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{css_0}}" rel="stylesheet">
    <link href="{{css_1}}" rel="stylesheet">
    <script src="{{js_0}}"></script>

<style>


        /* Move down content because we have a fixed navbar that is 50px tall */
        body {
            padding-top: 20px;
            padding-left: 10px;
            padding-right: 10px;
        }

        .sidebar {
            position: fixed;
            top: 0px;
            bottom: 0;
            left: 0;
            z-index: 1000;
            display: block;
            padding: 20px;
            overflow-x: hidden;
            overflow-y: auto;
            /* Scrollable contents if viewport is shorter than content. */
            width: 270px;
        }

        .main {
            padding-left: 290px;
        }

        .main .page-header {
            margin-top: 0;
        }

        .bd-placeholder-img {
            font-size: 1.125rem;
            text-anchor: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }

        @media (min-width: 768px) {
            .bd-placeholder-img-lg {
                font-size: 3.5rem;
            }
        }

        .b-example-divider {
            height: 3rem;
            background-color: rgba(0, 0, 0, .1);
            border: solid rgba(0, 0, 0, .15);
            border-width: 1px 0;
            box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
        }

        .b-example-vr {
            flex-shrink: 0;
            width: 1.5rem;
            height: 100vh;
        }

        .bi {
            vertical-align: -.125em;
            fill: currentColor;
        }

        .nav-scroller {
            position: relative;
            z-index: 2;
            height: 2.75rem;
            overflow-y: hidden;
        }

        .nav-scroller .nav {
            display: flex;
            flex-wrap: nowrap;
            padding-bottom: 1rem;
            margin-top: -1px;
            overflow-x: auto;
            text-align: center;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
        }

        html,
        body {
            height: 100%;
            overflow-y: hidden;
        }

        .card {
            height: 100%;
        }

</style>
</head>
<body>
    <div class="container-fluid h-100">
        <div class="row h-100">

        <div class="flex-shrink-0 p-3 bg-white overflow-auto sidebar">
            <a href="/" class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                
<svg class="bi pe-none me-2" width="40" height="30" viewBox="0 0 54.463092 43.762592">
  <defs
     id="defs2" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0"
     inkscape:pageopacity="0"
     inkscape:pageshadow="2"
     inkscape:zoom="1.4142136"
     inkscape:cx="95.379217"
     inkscape:cy="75.795012"
     inkscape:document-units="mm"
     inkscape:current-layer="layer1"
     showgrid="false"
     fit-margin-top="0"
     fit-margin-left="0"
     fit-margin-right="0"
     fit-margin-bottom="0"
     inkscape:window-width="1853"
     inkscape:window-height="1019"
     inkscape:window-x="67"
     inkscape:window-y="33"
     inkscape:window-maximized="1"
     inkscape:pagecheckerboard="false">
    <inkscape:grid
       type="xygrid"
       id="grid225"
       originx="144.3368"
       originy="16.902247" />
  </sodipodi:namedview>
  <metadata
     id="metadata5">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Capa 1"
     inkscape:groupmode="layer"
     id="layer1"
     transform="translate(98.991305,-81.967747)">
    <g
       id="g4024"
       transform="translate(-189.94604,14.565045)">
      <path
         style="fill:#cf1f1f;stroke-width:0.08466666"
         d="m 109.16607,111.15252 c -2.76202,-0.17762 -5.25248,-0.82708 -7.57766,-1.97612 -5.245982,-2.5924 -9.018108,-7.42985 -10.235132,-13.125739 -0.395046,-1.848886 -0.39976,-2.004655 -0.398436,-13.165666 0.0015,-12.486355 -0.0148,-10.965476 0.114981,-10.741517 0.705588,1.217633 1.72246,2.142913 3.042571,2.768522 1.197997,0.567739 2.736724,0.921535 4.004681,0.920787 1.330863,-7.62e-4 1.206124,0.03949 2.164005,-0.698769 1.82744,-1.408446 2.22148,-1.694689 2.982,-2.166197 4.21457,-2.612945 10.70159,-4.519946 17.79866,-5.232301 4.42109,-0.443758 9.29491,-0.443758 13.716,0 3.59587,0.360929 7.28788,1.07816 10.4775,2.03542 0.38198,0.114638 0.0704,0.20242 -0.71967,0.20273 -5.52998,0.0022 -10.88534,4.253247 -13.4418,10.670087 -0.9712,2.437758 -1.60995,5.585167 -1.60609,7.913904 0.002,1.118977 -0.25376,5.033654 -0.34277,5.249333 -0.0384,0.09313 -0.0942,0.416984 -0.12381,0.719667 -0.0869,0.886517 -0.44396,2.412891 -0.84623,3.617292 -1.34535,4.027947 -4.00775,7.480757 -7.62113,9.883657 -2.31449,1.53915 -5.51581,2.70217 -8.255,2.99901 -0.97406,0.10555 -2.49715,0.16676 -3.13267,0.1259 z m 3.56356,-6.96115 c 1.54585,-0.35865 2.87771,-0.91409 4.09878,-1.70936 2.81848,-1.83565 4.69254,-4.581507 5.42956,-7.955349 0.22481,-1.029132 0.22481,-3.796868 0,-4.826 -1.0902,-4.990548 -4.71468,-8.615033 -9.70523,-9.705226 -1.02913,-0.224815 -3.79687,-0.224815 -4.826,0 -4.93013,1.076995 -8.537953,4.634462 -9.6632,9.528332 -0.216431,0.941293 -0.303503,3.14629 -0.16519,4.183272 0.730491,5.476784 4.971,9.787681 10.46339,10.637081 0.86867,0.13434 3.53193,0.0412 4.36789,-0.15275 z m -3.30956,-8.404459 c -1.45204,-0.238267 -2.63214,-1.444232 -2.86951,-2.932417 -0.36868,-2.311319 1.67295,-4.354024 3.99135,-3.993459 2.78398,0.432975 3.94879,3.820271 2.01633,5.863562 -0.82072,0.867793 -1.96435,1.254925 -3.13817,1.062314 z"
         id="path4028"
         inkscape:connector-curvature="0" />
      <path
         style="fill:#4e4e4e;stroke-width:0.08466666"
         d="m 109.16607,111.15252 c -2.76202,-0.17762 -5.25248,-0.82708 -7.57766,-1.97612 -5.245982,-2.5924 -9.018108,-7.42985 -10.235132,-13.125739 -0.395046,-1.848886 -0.39976,-2.004655 -0.398436,-13.165666 0.0015,-12.486355 -0.0148,-10.965476 0.114981,-10.741517 0.705588,1.217633 1.72246,2.142913 3.042571,2.768522 1.197997,0.567739 2.736724,0.921535 4.004681,0.920787 1.330863,-7.62e-4 1.206124,0.03949 2.164005,-0.698769 1.82744,-1.408446 2.22148,-1.694689 2.982,-2.166197 4.21457,-2.612945 10.70159,-4.519946 17.79866,-5.232301 4.42109,-0.443758 9.29491,-0.443758 13.716,0 3.59587,0.360929 7.28788,1.07816 10.4775,2.03542 0.38198,0.114638 0.0704,0.20242 -0.71967,0.20273 -5.52998,0.0022 -10.88534,4.253247 -13.4418,10.670087 -0.9712,2.437758 -1.60995,5.585167 -1.60609,7.913904 0.002,1.118977 -0.25376,5.033654 -0.34277,5.249333 -0.0384,0.09313 -0.0942,0.416984 -0.12381,0.719667 -0.0869,0.886517 -0.44396,2.412891 -0.84623,3.617292 -1.34535,4.027947 -4.00775,7.480757 -7.62113,9.883657 -2.31449,1.53915 -5.51581,2.70217 -8.255,2.99901 -0.97406,0.10555 -2.49715,0.16676 -3.13267,0.1259 z m 3.56356,-6.96115 c 1.54585,-0.35865 2.87771,-0.91409 4.09878,-1.70936 2.81848,-1.83565 4.69254,-4.581507 5.42956,-7.955349 0.22481,-1.029132 0.22481,-3.796868 0,-4.826 -1.0902,-4.990548 -4.71468,-8.615033 -9.70523,-9.705226 -1.02913,-0.224815 -3.79687,-0.224815 -4.826,0 -4.93013,1.076995 -8.537953,4.634462 -9.6632,9.528332 -0.216431,0.941293 -0.303503,3.14629 -0.16519,4.183272 0.730491,5.476784 4.971,9.787681 10.46339,10.637081 0.86867,0.13434 3.53193,0.0412 4.36789,-0.15275 z"
         id="path4026"
         inkscape:connector-curvature="0" />
    </g>
  </g>
</svg>

                <div class="fs-5 fw-semibold sidebar-heading">Configuration</div>
            </a>
            <ul class="list-unstyled ps-0">
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#General" aria-expanded="false">
                        General
                    </button>
                    <div class="collapse" id="General">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-general-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                        </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#Documentation" aria-expanded="false">
                        Documentation
                    </button>
                    <div class="collapse" id="Documentation">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-documentation-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                        </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#Editor" aria-expanded="false">
                        Editor
                    </button>
                    <div class="collapse" id="Editor">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-editor-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                        </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#Formatter" aria-expanded="false">
                        Formatter
                    </button>
                    <div class="collapse" id="Formatter">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-formatter-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                            <li><a id="btn-formatter-istyle" href="#" class="link-dark d-inline-flex text-decoration-none rounded">iStyle</a></li>
                            <li><a id="btn-formatter-s3sv" href="#" class="link-dark d-inline-flex text-decoration-none rounded">s3sv</a></li>
                            <li><a id="btn-formatter-verible" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Verible</a></li>
                            <li><a id="btn-formatter-standalone" href="#" class="link-dark d-inline-flex text-decoration-none rounded">VHDL standalone</a></li>
                            <li><a id="btn-formatter-svg" href="#" class="link-dark d-inline-flex text-decoration-none rounded">VHDL VSG</a></li>
                        </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#Linter-settings" aria-expanded="false">
                        Linter settings
                    </button>
                    <div class="collapse" id="Linter-settings">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-linter-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                            <li><a id="btn-linter-ghdl" href="#" class="link-dark d-inline-flex text-decoration-none rounded">GHDL linter</a></li>
                            <li><a id="btn-linter-icarus" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Icarus linter</a></li>
                            <li><a id="btn-linter-modelsim" href="#" class="link-dark d-inline-flex text-decoration-none rounded">ModelSim linter</a></li>
                            <li><a id="btn-linter-verible" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Verible linter</a></li>
                            <li><a id="btn-linter-verilator" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Verilator linter</a></li>
                            <li><a id="btn-linter-vivado" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Vivado linter</a></li>
                            <li><a id="btn-linter-vsg" href="#" class="link-dark d-inline-flex text-decoration-none rounded">VSG linter</a></li>
                        </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#Schematic-viewer" aria-expanded="false">
                        Schematic viewer
                    </button>
                    <div class="collapse" id="Schematic-viewer">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-schematic-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                        </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#Templates" aria-expanded="false">
                        Templates
                    </button>
                    <div class="collapse" id="Templates">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-templates-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                        </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                        data-bs-toggle="collapse" data-bs-target="#Tools" aria-expanded="false">
                        Tools
                    </button>
                    <div class="collapse" id="Tools">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a id="btn-tools-general" href="#" class="link-dark d-inline-flex text-decoration-none rounded">General</a></li>
                            <li><a id="btn-tools-osvvm" href="#" class="link-dark d-inline-flex text-decoration-none rounded">OSVVM</a></li>
                            <li><a id="btn-tools-ascenlint" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Ascenlint</a></li>
                            <li><a id="btn-tools-cocotb" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Cocotb</a></li>
                            <li><a id="btn-tools-diamond" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Diamond</a></li>
                            <li><a id="btn-tools-ghdl" href="#" class="link-dark d-inline-flex text-decoration-none rounded">GHDL</a></li>
                            <li><a id="btn-tools-icarus" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Icarus</a></li>
                            <li><a id="btn-tools-icestorm" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Icestorm</a></li>
                            <li><a id="btn-tools-ise" href="#" class="link-dark d-inline-flex text-decoration-none rounded">ISE</a></li>
                            <li><a id="btn-tools-isem" href="#" class="link-dark d-inline-flex text-decoration-none rounded">ISIM</a></li>
                            <li><a id="btn-tools-modelsim" href="#" class="link-dark d-inline-flex text-decoration-none rounded">ModelSim</a></li>
                            <li><a id="btn-tools-morty" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Morty</a></li>
                            <li><a id="btn-tools-quartus" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Quartus</a></li>
                            <li><a id="btn-tools-radiant" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Radiant</a></li>
                            <li><a id="btn-tools-rivierapro" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Rivierapro</a></li>
                            <li><a id="btn-tools-siliconcompiler" href="#" class="link-dark d-inline-flex text-decoration-none rounded">SiliconCompiler</a></li>
                            <li><a id="btn-tools-spyglass" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Spyglass</a></li>
                            <li><a id="btn-tools-symbiyosys" href="#" class="link-dark d-inline-flex text-decoration-none rounded">SymbiYosys</a></li>
                            <li><a id="btn-tools-symbiflow" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Symbiflow</a></li>
                            <li><a id="btn-tools-trellis" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Trellis</a></li>
                            <li><a id="btn-tools-vcs" href="#" class="link-dark d-inline-flex text-decoration-none rounded">VCS</a></li>
                            <li><a id="btn-tools-verible" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Verible</a></li>
                            <li><a id="btn-tools-verilator" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Verilator</a></li>
                            <li><a id="btn-tools-vivado" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Vivado</a></li>
                            <li><a id="btn-tools-vunit" href="#" class="link-dark d-inline-flex text-decoration-none rounded">VUnit</a></li>
                            <li><a id="btn-tools-xcelium" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Xcelium</a></li>
                            <li><a id="btn-tools-xsim" href="#" class="link-dark d-inline-flex text-decoration-none rounded">XSIM</a></li>
                            <li><a id="btn-tools-yosys" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Yosys</a></li>
                            <li><a id="btn-tools-openfpga" href="#" class="link-dark d-inline-flex text-decoration-none rounded">OpenFPGA</a></li>
                            <li><a id="btn-tools-activehdl" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Active-HDL</a></li>
                            <li><a id="btn-tools-nvc" href="#" class="link-dark d-inline-flex text-decoration-none rounded">NVC</a></li>
                            <li><a id="btn-tools-questa" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Questa Advanced Simulator</a></li>
                            <li><a id="btn-tools-raptor" href="#" class="link-dark d-inline-flex text-decoration-none rounded">Raptor Design Suite</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>

<div class="col-sm-12 main h-100">
    <div class="card h-100" id="general-general">
      <div class="card-header">
        <h1 class="card-title">General: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="general-general-logging">
                <label class="form-check-label" for="general-general-logging">
                  Enable show TerosHDL console with each message.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="general-general-pypath" class="form-label">Python3 binary path (e.g.: /usr/bin/python3). Empty if you want to use the system path. <strong>Install teroshdl. E.g: pip3 install teroshdl</strong></label>
              <input class="form-control" id="general-general-pypath" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="general-general-go_to_definition_vhdl">
                <label class="form-check-label" for="general-general-go_to_definition_vhdl">
                  Activate go to definition feature for VHDL (you need to restart VSCode).
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="general-general-go_to_definition_verilog">
                <label class="form-check-label" for="general-general-go_to_definition_verilog">
                  Activate go to definition feature for Verilog/SV (you need to restart VSCode).
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="general-general-developer_mode">
                <label class="form-check-label" for="general-general-developer_mode">
                  Developer mode: be careful!!
                </label>
              </div>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="documentation-general">
      <div class="card-header">
        <h1 class="card-title">Documentation: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="documentation-general-language" class="form-label">Documentation language:</label>
              <select class="form-select" aria-label="Documentation language:" id="documentation-general-language">
                      <option value='english'>English</option>
                      <option value='russian'>Russian</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-symbol_vhdl" class="form-label">Special VHDL symbol at the begin of the comment to extract documentation. Example: <code>--! Code comment</code></label>
              <input class="form-control" id="documentation-general-symbol_vhdl" rows="3"  value="!"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-symbol_verilog" class="form-label">Special Verilog symbol at the begin of the comment to extract documentation. Example: <code>//! Code comment</code></label>
              <input class="form-control" id="documentation-general-symbol_verilog" rows="3"  value="!"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="documentation-general-dependency_graph">
                <label class="form-check-label" for="documentation-general-dependency_graph">
                  Include dependency graph:
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="documentation-general-self_contained">
                <label class="form-check-label" for="documentation-general-self_contained">
                  HTML documentation self contained:
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="documentation-general-fsm">
                <label class="form-check-label" for="documentation-general-fsm">
                  Include FSM:
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-ports" class="form-label">Include ports:</label>
              <select class="form-select" aria-label="Include ports:" id="documentation-general-ports">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-generics" class="form-label">Include generics:</label>
              <select class="form-select" aria-label="Include generics:" id="documentation-general-generics">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-instantiations" class="form-label">Include instantiations:</label>
              <select class="form-select" aria-label="Include instantiations:" id="documentation-general-instantiations">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-signals" class="form-label">Include signals:</label>
              <select class="form-select" aria-label="Include signals:" id="documentation-general-signals">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-constants" class="form-label">Include consants:</label>
              <select class="form-select" aria-label="Include consants:" id="documentation-general-constants">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-types" class="form-label">Include types:</label>
              <select class="form-select" aria-label="Include types:" id="documentation-general-types">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-process" class="form-label">Include always/processes:</label>
              <select class="form-select" aria-label="Include always/processes:" id="documentation-general-process">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-functions" class="form-label">Include functions:</label>
              <select class="form-select" aria-label="Include functions:" id="documentation-general-functions">
                      <option value='all'>All</option>
                      <option value='only_commented'>Only commented</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="documentation-general-magic_config_path" class="form-label">Magic config file path</label>
              <input class="form-control" id="documentation-general-magic_config_path" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="editor-general">
      <div class="card-header">
        <h1 class="card-title">Editor: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="editor-general-stutter_comment_shortcuts">
                <label class="form-check-label" for="editor-general-stutter_comment_shortcuts">
                  Stutter mode: an enter keypress at the end of a line that contains a non-empty comment will continue the comment on the next line. This can be cancelled by pressing enter again. You must also set <code>"editor.formatOnType": true"</code>
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="editor-general-stutter_block_width" class="form-label">Width of block comment elements inserted by stutter completions</label>
              <input type='number' class="form-control" id="editor-general-stutter_block_width" rows="3"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="editor-general-stutter_max_width" class="form-label">Max width of block comment elements inserted by stutter completions. Set to zero to disable.</label>
              <input type='number' class="form-control" id="editor-general-stutter_max_width" rows="3"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="editor-general-stutter_delimiters">
                <label class="form-check-label" for="editor-general-stutter_delimiters">
                  Stutter mode: enable Delimiter Shortcuts
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="editor-general-stutter_bracket_shortcuts">
                <label class="form-check-label" for="editor-general-stutter_bracket_shortcuts">
                  Stutter mode: enable Bracket Shortcuts
                </label>
              </div>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="formatter-general">
      <div class="card-header">
        <h1 class="card-title">Formatter: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="formatter-general-formatter_verilog" class="form-label">Verilog/SV formatter:</label>
              <select class="form-select" aria-label="Verilog/SV formatter:" id="formatter-general-formatter_verilog">
                      <option value='istyle'>iStyle</option>
                      <option value='s3sv'>s3sv</option>
                      <option value='verible'>Verible</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-general-formatter_vhdl" class="form-label">VHDL formatter:</label>
              <select class="form-select" aria-label="VHDL formatter:" id="formatter-general-formatter_vhdl">
                      <option value='standalone'>Standalone</option>
                      <option value='vsg'>VSG</option>
              </select>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="formatter-istyle">
      <div class="card-header">
        <h1 class="card-title">Formatter: iStyle</h1>
        <h6 class="card-subtitle mb-2 text-muted">Verilog/SV iStyle formatter</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="formatter-istyle-style" class="form-label">Predefined Styling options.</label>
              <select class="form-select" aria-label="Predefined Styling options." id="formatter-istyle-style">
                      <option value='ansi'>ANSI</option>
                      <option value='kr'>Kernighan&Ritchie</option>
                      <option value='gnu'>GNU</option>
                      <option value='indent_only'>Indent only</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-istyle-indentation_size" class="form-label">Indentation size in number of characters.</label>
              <input type='number' class="form-control" id="formatter-istyle-indentation_size" rows="3"></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="formatter-s3sv">
      <div class="card-header">
        <h1 class="card-title">Formatter: s3sv</h1>
        <h6 class="card-subtitle mb-2 text-muted">Verilog/SV S3SV formatter</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-s3sv-one_bind_per_line">
                <label class="form-check-label" for="formatter-s3sv-one_bind_per_line">
                  Force one binding per line in instanciations statements.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-s3sv-one_declaration_per_line">
                <label class="form-check-label" for="formatter-s3sv-one_declaration_per_line">
                  Force one declaration per line.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-s3sv-use_tabs">
                <label class="form-check-label" for="formatter-s3sv-use_tabs">
                  Use tabs instead of spaces for indentation.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-s3sv-indentation_size" class="form-label">Indentation size in number of characters.</label>
              <input type='number' class="form-control" id="formatter-s3sv-indentation_size" rows="3"></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="formatter-verible">
      <div class="card-header">
        <h1 class="card-title">Formatter: Verible</h1>
        <h6 class="card-subtitle mb-2 text-muted">Verilog/SV Verible formatter</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="formatter-verible-format_args" class="form-label">Extra command line arguments passed to the Verible tool</label>
              <input class="form-control" id="formatter-verible-format_args" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="formatter-standalone">
      <div class="card-header">
        <h1 class="card-title">Formatter: VHDL standalone</h1>
        <h6 class="card-subtitle mb-2 text-muted">VHDL standalone formatter</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="formatter-standalone-keyword_case" class="form-label">Keyword case. e.g. begin, case, when </label>
              <select class="form-select" aria-label="Keyword case. e.g. begin, case, when " id="formatter-standalone-keyword_case">
                      <option value='lowercase'>LowerCase</option>
                      <option value='uppercase'>UpperCase</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-standalone-name_case" class="form-label">Type name case. e.g. boolean, natural, string </label>
              <select class="form-select" aria-label="Type name case. e.g. boolean, natural, string " id="formatter-standalone-name_case">
                      <option value='lowercase'>LowerCase</option>
                      <option value='uppercase'>UpperCase</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-standalone-indentation" class="form-label">Indentation.</label>
              <input class="form-control" id="formatter-standalone-indentation" rows="3"  value="  "></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-standalone-align_port_generic">
                <label class="form-check-label" for="formatter-standalone-align_port_generic">
                  Align signs in ports and generics.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-standalone-align_comment">
                <label class="form-check-label" for="formatter-standalone-align_comment">
                  Align comments.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-standalone-remove_comments">
                <label class="form-check-label" for="formatter-standalone-remove_comments">
                  Remove comments.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-standalone-remove_reports">
                <label class="form-check-label" for="formatter-standalone-remove_reports">
                  Remove reports.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="formatter-standalone-check_alias">
                <label class="form-check-label" for="formatter-standalone-check_alias">
                  All long names will be replaced by ALIAS names.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-standalone-new_line_after_then" class="form-label">New line after THEN.</label>
              <select class="form-select" aria-label="New line after THEN." id="formatter-standalone-new_line_after_then">
                      <option value='new_line'>New line</option>
                      <option value='no_new_line'>No new line</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-standalone-new_line_after_semicolon" class="form-label">New line after semicolon ';'.</label>
              <select class="form-select" aria-label="New line after semicolon ';'." id="formatter-standalone-new_line_after_semicolon">
                      <option value='new_line'>New line</option>
                      <option value='no_new_line'>No new line</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-standalone-new_line_after_else" class="form-label">New line after ELSE.</label>
              <select class="form-select" aria-label="New line after ELSE." id="formatter-standalone-new_line_after_else">
                      <option value='new_line'>New line</option>
                      <option value='no_new_line'>No new line</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-standalone-new_line_after_port" class="form-label">New line after PORT | PORT MAP.</label>
              <select class="form-select" aria-label="New line after PORT | PORT MAP." id="formatter-standalone-new_line_after_port">
                      <option value='new_line'>New line</option>
                      <option value='no_new_line'>No new line</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-standalone-new_line_after_generic" class="form-label">New line after GENERIC.</label>
              <select class="form-select" aria-label="New line after GENERIC." id="formatter-standalone-new_line_after_generic">
                      <option value='new_line'>New line</option>
                      <option value='no_new_line'>No new line</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="formatter-svg">
      <div class="card-header">
        <h1 class="card-title">Formatter: VHDL VSG</h1>
        <h6 class="card-subtitle mb-2 text-muted">VHDL Style Guide. Analyzes VHDL files for style guide violations.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="formatter-svg-configuration" class="form-label">JSON or YAML configuration file.</label>
              <input class="form-control" id="formatter-svg-configuration" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-svg-core_number" class="form-label">Number of parallel jobs to use, default is the number of cpu cores.</label>
              <input type='number' class="form-control" id="formatter-svg-core_number" rows="3"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="formatter-svg-aditional_arguments" class="form-label">Additional arguments to pass to the VSG command.</label>
              <input class="form-control" id="formatter-svg-aditional_arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-general">
      <div class="card-header">
        <h1 class="card-title">Linter settings: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-general-linter_vhdl" class="form-label">VHDL linter: disable VHDL-LS needs restart VSCode.</label>
              <select class="form-select" aria-label="VHDL linter: disable VHDL-LS needs restart VSCode." id="linter-general-linter_vhdl">
                      <option value='disabled'>Disabled</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='modelsim'>Modelsim</option>
                      <option value='vivado'>Vivado (xvhdl)</option>
                      <option value='none'>VHDL-LS</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="linter-general-linter_verilog" class="form-label">Verilog/SV linter:</label>
              <select class="form-select" aria-label="Verilog/SV linter:" id="linter-general-linter_verilog">
                      <option value='disabled'>Disabled</option>
                      <option value='icarus'>Icarus</option>
                      <option value='modelsim'>Modelsim</option>
                      <option value='verilator'>Verilator</option>
                      <option value='vivado'>Vivado (xvlog)</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="linter-general-lstyle_verilog" class="form-label">Verilog/SV style checker:</label>
              <select class="form-select" aria-label="Verilog/SV style checker:" id="linter-general-lstyle_verilog">
                      <option value='verible'>Verible</option>
                      <option value='disabled'>Disabled</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="linter-general-lstyle_vhdl" class="form-label">VHDL style checker:</label>
              <select class="form-select" aria-label="VHDL style checker:" id="linter-general-lstyle_vhdl">
                      <option value='vsg'>VSG</option>
                      <option value='disabled'>Disabled</option>
              </select>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-ghdl">
      <div class="card-header">
        <h1 class="card-title">Linter settings: GHDL linter</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-ghdl-arguments" class="form-label">Arguments.</label>
              <input class="form-control" id="linter-ghdl-arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-icarus">
      <div class="card-header">
        <h1 class="card-title">Linter settings: Icarus linter</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-icarus-arguments" class="form-label">Arguments.</label>
              <input class="form-control" id="linter-icarus-arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-modelsim">
      <div class="card-header">
        <h1 class="card-title">Linter settings: ModelSim linter</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-modelsim-vhdl_arguments" class="form-label">VHDL linter arguments.</label>
              <input class="form-control" id="linter-modelsim-vhdl_arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="linter-modelsim-verilog_arguments" class="form-label">Verilog linter arguments.</label>
              <input class="form-control" id="linter-modelsim-verilog_arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-verible">
      <div class="card-header">
        <h1 class="card-title">Linter settings: Verible linter</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-verible-arguments" class="form-label">Arguments.</label>
              <input class="form-control" id="linter-verible-arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-verilator">
      <div class="card-header">
        <h1 class="card-title">Linter settings: Verilator linter</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-verilator-arguments" class="form-label">Arguments.</label>
              <input class="form-control" id="linter-verilator-arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-vivado">
      <div class="card-header">
        <h1 class="card-title">Linter settings: Vivado linter</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-vivado-vhdl_arguments" class="form-label">VHDL linter arguments.</label>
              <input class="form-control" id="linter-vivado-vhdl_arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="linter-vivado-verilog_arguments" class="form-label">Verilog linter arguments.</label>
              <input class="form-control" id="linter-vivado-verilog_arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="linter-vsg">
      <div class="card-header">
        <h1 class="card-title">Linter settings: VSG linter</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="linter-vsg-arguments" class="form-label">JSON or YAML configuration file.</label>
              <input class="form-control" id="linter-vsg-arguments" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="schematic-general">
      <div class="card-header">
        <h1 class="card-title">Schematic viewer: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="schematic-general-backend" class="form-label">Select the backend:</label>
              <select class="form-select" aria-label="Select the backend:" id="schematic-general-backend">
                      <option value='yowasp'>YoWASP</option>
                      <option value='yosys'>Yosys</option>
                      <option value='yosys_ghdl'>GHDL + Yosys</option>
                      <option value='yosys_ghdl_module'>GHDL (module) + Yosys</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="schematic-general-extra" class="form-label">Extra options passed before to run yowasp-yosys. Eg: conda activate base & </label>
              <input class="form-control" id="schematic-general-extra" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="schematic-general-args" class="form-label">Arguments passed to Yosys</label>
              <input class="form-control" id="schematic-general-args" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="templates-general">
      <div class="card-header">
        <h1 class="card-title">Templates: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="templates-general-header_file_path" class="form-label">File path with your configurable header. E.g. your company license. It will be inserted at the beginning of the template</label>
              <input class="form-control" id="templates-general-header_file_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="templates-general-indent" class="form-label">Indent</label>
              <input class="form-control" id="templates-general-indent" rows="3"  value="  "></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="templates-general-clock_generation_style" class="form-label">Clock generation style:</label>
              <select class="form-select" aria-label="Clock generation style:" id="templates-general-clock_generation_style">
                      <option value='inline'>Inline</option>
                      <option value='ifelse'>if/else</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="templates-general-instance_style" class="form-label">Instantiation style:</label>
              <select class="form-select" aria-label="Instantiation style:" id="templates-general-instance_style">
                      <option value='inline'>Inline</option>
                      <option value='separate'>Separate</option>
              </select>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-general">
      <div class="card-header">
        <h1 class="card-title">Tools: General</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-general-select_tool" class="form-label">Select a tool, framework, simulator...</label>
              <select class="form-select" aria-label="Select a tool, framework, simulator..." id="tools-general-select_tool">
                      <option value='osvvm'>OSVVM</option>
                      <option value='vunit'>VUnit</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='cocotb'>cocotb</option>
                      <option value='icarus'>Icarus</option>
                      <option value='icestorm'>Icestorm</option>
                      <option value='ise'>ISE</option>
                      <option value='isim'>ISIM</option>
                      <option value='modelsim'>ModelSim</option>
                      <option value='openfpga'>OpenFPGA</option>
                      <option value='quartus'>Quartus</option>
                      <option value='rivierapro'>Riviera-PRO</option>
                      <option value='spyglass'>SpyGlass</option>
                      <option value='trellis'>Trellis</option>
                      <option value='vcs'>VCS</option>
                      <option value='verilator'>Verilator</option>
                      <option value='vivado'>Vivado</option>
                      <option value='xcelium'>Xcelium</option>
                      <option value='xsim'>XSIM</option>
                      <option value='raptor'>Raptor Design Suite</option>
                      <option value='radiant'>Radiant</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-general-gtkwave_installation_path" class="form-label">GTKWave installation directory.</label>
              <input class="form-control" id="tools-general-gtkwave_installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-general-execution_mode" class="form-label">Select the execution mode.</label>
              <select class="form-select" aria-label="Select the execution mode." id="tools-general-execution_mode">
                      <option value='gui'>GUI</option>
                      <option value='cmd'>Command line</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-general-waveform_viewer" class="form-label">Select the waveform viewer. For GTKWave you need to install it.</label>
              <select class="form-select" aria-label="Select the waveform viewer. For GTKWave you need to install it." id="tools-general-waveform_viewer">
                      <option value='tool'>Tool GUI</option>
                      <option value='gtkwave'>GTKWave</option>
              </select>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-osvvm">
      <div class="card-header">
        <h1 class="card-title">Tools: OSVVM</h1>
        <h6 class="card-subtitle mb-2 text-muted">OSVVM is an advanced verification methodology that defines a VHDL verification framework, verification utility library, verification component library, and a scripting flow that simplifies your FPGA or ASIC verification project from start to finish. Using these libraries you can create a simple, readable, and powerful testbench that is suitable for either a simple FPGA block or a complex ASIC.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-osvvm-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-osvvm-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-osvvm-tclsh_binary" class="form-label">tclsh binary path. E.g: /usr/bin/tclsh8.6</label>
              <input class="form-control" id="tools-osvvm-tclsh_binary" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-osvvm-simulator_name" class="form-label">Selects which simulator to use.</label>
              <select class="form-select" aria-label="Selects which simulator to use." id="tools-osvvm-simulator_name">
                      <option value='activehdl'>Aldec Active-HDL</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='nvc'>NVC</option>
                      <option value='rivierapro'>Aldec Riviera-PRO</option>
                      <option value='questa'>Mentor/Siemens EDA Questa</option>
                      <option value='modelsim'>Mentor/Siemens EDA ModelSim</option>
                      <option value='vcs'>VCS</option>
                      <option value='xsim'>XSIM</option>
                      <option value='xcelium'>Xcelium</option>
              </select>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-ascenlint">
      <div class="card-header">
        <h1 class="card-title">Tools: Ascenlint</h1>
        <h6 class="card-subtitle mb-2 text-muted">Ascent Lint performs static source code analysis on HDL code and checks for common coding errors or coding style violations.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-ascenlint-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-ascenlint-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-ascenlint-ascentlint_options" class="form-label">Additional run options for ascentlint.</label>
              <input class="form-control" id="tools-ascenlint-ascentlint_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-cocotb">
      <div class="card-header">
        <h1 class="card-title">Tools: Cocotb</h1>
        <h6 class="card-subtitle mb-2 text-muted"></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-cocotb-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-cocotb-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-cocotb-simulator_name" class="form-label">Selects which simulator Makefile to use. Attempts to include a simulator specific makefile from cocotb/share/makefiles/simulators/makefile.$(SIM)</label>
              <select class="form-select" aria-label="Selects which simulator Makefile to use. Attempts to include a simulator specific makefile from cocotb/share/makefiles/simulators/makefile.$(SIM)" id="tools-cocotb-simulator_name">
                      <option value='icarus'>icarus</option>
                      <option value='verilator'>Verilator</option>
                      <option value='vcs'>Synopsys VCS</option>
                      <option value='riviera'>Aldec Riviera-PRO</option>
                      <option value='activehdl'>Aldec Active-HDL</option>
                      <option value='questa'>Mentor/Siemens EDA Questa</option>
                      <option value='modelsim'>Mentor/Siemens EDA ModelSim</option>
                      <option value='ius'>Cadence Incisive</option>
                      <option value='xcelium'>Cadence Xcelium</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='cvc'>Tachyon DA CVC</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-cocotb-compile_args" class="form-label">Any arguments or flags to pass to the compile stage of the simulation.</label>
              <input class="form-control" id="tools-cocotb-compile_args" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-cocotb-run_args" class="form-label">Any argument to be passed to the “first” invocation of a simulator that runs via a TCL script. One motivating usage is to pass -noautoldlibpath to Questa to prevent it from loading the out-of-date libraries it ships with. Used by Aldec Riviera-PRO and Mentor Graphics Questa simulator.</label>
              <input class="form-control" id="tools-cocotb-run_args" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-cocotb-plusargs" class="form-label">They are options that are starting with a plus (+) sign. They are passed to the simulator and are also available within cocotb as cocotb.plusargs. In the simulator, they can be read by the Verilog/SystemVerilog system functions $test$plusargs and $value$plusargs. The special plusargs +ntb_random_seed and +seed, if present, are evaluated to set the random seed value if RANDOM_SEED is not set. If both +ntb_random_seed and +seed are set, +ntb_random_seed is used.</label>
              <input class="form-control" id="tools-cocotb-plusargs" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-diamond">
      <div class="card-header">
        <h1 class="card-title">Tools: Diamond</h1>
        <h6 class="card-subtitle mb-2 text-muted">Backend for Lattice Diamond.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-diamond-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-diamond-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-diamond-part" class="form-label">FPGA part number (e.g. LFE5U-45F-6BG381C).</label>
              <input class="form-control" id="tools-diamond-part" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-ghdl">
      <div class="card-header">
        <h1 class="card-title">Tools: GHDL</h1>
        <h6 class="card-subtitle mb-2 text-muted">GHDL is an open source VHDL simulator, which fully supports IEEE 1076-1987, IEEE 1076-1993, IEE 1076-2002 and partially the 1076-2008 version of VHDL.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-ghdl-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-ghdl-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-ghdl-waveform" class="form-label">Waveform output format:</label>
              <select class="form-select" aria-label="Waveform output format:" id="tools-ghdl-waveform">
                      <option value='vcd'>VCD</option>
                      <option value='ghw'>GHW</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-ghdl-analyze_options" class="form-label">analyze options. Extra options used for the GHDL analyze stage (ghdl -a).</label>
              <input class="form-control" id="tools-ghdl-analyze_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-ghdl-run_options" class="form-label">Run options. Extra options used when running GHDL simulations (ghdl -r).</label>
              <input class="form-control" id="tools-ghdl-run_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-icarus">
      <div class="card-header">
        <h1 class="card-title">Tools: Icarus</h1>
        <h6 class="card-subtitle mb-2 text-muted">Icarus Verilog is a Verilog simulation and synthesis tool. It operates as a compiler, compiling source code written in Verilog (IEEE-1364) into some target format.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-icarus-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-icarus-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-icarus-timescale" class="form-label">Default timescale.</label>
              <input class="form-control" id="tools-icarus-timescale" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-icarus-iverilog_options" class="form-label">Additional options for iverilog.</label>
              <input class="form-control" id="tools-icarus-iverilog_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-icestorm">
      <div class="card-header">
        <h1 class="card-title">Tools: Icestorm</h1>
        <h6 class="card-subtitle mb-2 text-muted">Open source toolchain for Lattice iCE40 FPGAs. Uses yosys for synthesis and arachne-pnr or nextpnr for Place & Route.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-icestorm-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-icestorm-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-icestorm-pnr" class="form-label">Select P&R tool. Valid values are arachne and next. Default is arachne.</label>
              <select class="form-select" aria-label="Select P&R tool. Valid values are arachne and next. Default is arachne." id="tools-icestorm-pnr">
                      <option value='arachne'>Arachne-pnr</option>
                      <option value='next'>nextpnr</option>
                      <option value='none'>Only perform synthesis</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-icestorm-arch" class="form-label">Target architecture.</label>
              <select class="form-select" aria-label="Target architecture." id="tools-icestorm-arch">
                      <option value='xilinx'>Xilinx</option>
                      <option value='ice40'>ICE40</option>
                      <option value='ecp5'>ECP5</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-icestorm-output_format" class="form-label">Output file format.</label>
              <select class="form-select" aria-label="Output file format." id="tools-icestorm-output_format">
                      <option value='json'>JSON</option>
                      <option value='edif'>EDIF</option>
                      <option value='blif'>BLIF</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-icestorm-yosys_as_subtool">
                <label class="form-check-label" for="tools-icestorm-yosys_as_subtool">
                  Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-icestorm-makefile_name" class="form-label">Generated makefile name, defaults to $name.mk</label>
              <input class="form-control" id="tools-icestorm-makefile_name" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-icestorm-arachne_pnr_options" class="form-label">Options for ArachnePNR Place & Route.</label>
              <input class="form-control" id="tools-icestorm-arachne_pnr_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-icestorm-nextpnr_options" class="form-label">Options for NextPNR Place & Route.</label>
              <input class="form-control" id="tools-icestorm-nextpnr_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-icestorm-yosys_synth_options" class="form-label">Additional options for the synth_ice40 command.</label>
              <input class="form-control" id="tools-icestorm-yosys_synth_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-ise">
      <div class="card-header">
        <h1 class="card-title">Tools: ISE</h1>
        <h6 class="card-subtitle mb-2 text-muted">Xilinx ISE Design Suite.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-ise-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-ise-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-ise-family" class="form-label">FPGA family (e.g. spartan6).</label>
              <input class="form-control" id="tools-ise-family" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-ise-device" class="form-label">FPGA device (e.g. xc6slx45).</label>
              <input class="form-control" id="tools-ise-device" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-ise-package" class="form-label">FPGA package (e.g. csg324).</label>
              <input class="form-control" id="tools-ise-package" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-ise-speed" class="form-label">FPGA speed grade (e.g. -2).</label>
              <input class="form-control" id="tools-ise-speed" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-isem">
      <div class="card-header">
        <h1 class="card-title">Tools: ISIM</h1>
        <h6 class="card-subtitle mb-2 text-muted">Xilinx ISim simulator from ISE design suite.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-isem-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-isem-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-isem-fuse_options" class="form-label">Additional options for compilation with FUSE.</label>
              <input class="form-control" id="tools-isem-fuse_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-isem-isim_options" class="form-label">Additional run options for ISim.</label>
              <input class="form-control" id="tools-isem-isim_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-modelsim">
      <div class="card-header">
        <h1 class="card-title">Tools: ModelSim</h1>
        <h6 class="card-subtitle mb-2 text-muted">ModelSim simulator from Mentor Graphics.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-modelsim-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-modelsim-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-modelsim-vcom_options" class="form-label">Additional options for compilation with vcom.</label>
              <input class="form-control" id="tools-modelsim-vcom_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-modelsim-vlog_options" class="form-label">Additional options for compilation with vlog.</label>
              <input class="form-control" id="tools-modelsim-vlog_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-modelsim-vsim_options" class="form-label">Additional run options for vsim.</label>
              <input class="form-control" id="tools-modelsim-vsim_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-morty">
      <div class="card-header">
        <h1 class="card-title">Tools: Morty</h1>
        <h6 class="card-subtitle mb-2 text-muted">Run the (System-) Verilog pickle tool called morty.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-morty-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-morty-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-morty-morty_options" class="form-label">Run-time options passed to morty..</label>
              <input class="form-control" id="tools-morty-morty_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-quartus">
      <div class="card-header">
        <h1 class="card-title">Tools: Quartus</h1>
        <h6 class="card-subtitle mb-2 text-muted">The Quartus backend supports Intel Quartus Std and Pro editions to build systems and program the FPGA.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-quartus-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-quartus-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-quartus-family" class="form-label">FPGA family (e.g. Cyclone V).</label>
              <input class="form-control" id="tools-quartus-family" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-quartus-device" class="form-label">FPGA device (e.g. 5CSXFC6D6F31C8ES).</label>
              <input class="form-control" id="tools-quartus-device" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-quartus-cable" class="form-label">Specifies the FPGA’s JTAG programming cable. Use the tool jtagconfig to determine the available cables.</label>
              <input class="form-control" id="tools-quartus-cable" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-quartus-board_device_index" class="form-label">Specifies the FPGA’s device number in the JTAG chain. The device index specifies the device where the flash programmer looks for the Nios® II JTAG debug module. JTAG devices are numbered relative to the JTAG chain, starting at 1. Use the tool jtagconfig to determine the index.</label>
              <input class="form-control" id="tools-quartus-board_device_index" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-quartus-pnr" class="form-label">P&R tool. one (to just run synthesis).</label>
              <select class="form-select" aria-label="P&R tool. one (to just run synthesis)." id="tools-quartus-pnr">
                      <option value='default'>Default</option>
                      <option value='dse'>Run Design Space Explorer</option>
                      <option value='none'>Run synthesis</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-quartus-dse_options" class="form-label">Command-line options for Design Space Explorer.</label>
              <input class="form-control" id="tools-quartus-dse_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-quartus-quartus_options" class="form-label">Extra command-line options for Quartus.</label>
              <input class="form-control" id="tools-quartus-quartus_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-radiant">
      <div class="card-header">
        <h1 class="card-title">Tools: Radiant</h1>
        <h6 class="card-subtitle mb-2 text-muted">Backend for Lattice Radiant.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-radiant-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-radiant-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-radiant-part" class="form-label">FPGA part number (e.g. LIFCL-40-9BG400C).</label>
              <input class="form-control" id="tools-radiant-part" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-rivierapro">
      <div class="card-header">
        <h1 class="card-title">Tools: Rivierapro</h1>
        <h6 class="card-subtitle mb-2 text-muted">Riviera Pro simulator from Aldec.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-rivierapro-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-rivierapro-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-rivierapro-compilation_mode" class="form-label">Common or separate compilation, sep - for separate compilation, common - for common compilation.</label>
              <input class="form-control" id="tools-rivierapro-compilation_mode" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-rivierapro-vlog_options" class="form-label">Additional options for compilation with vlog.</label>
              <input class="form-control" id="tools-rivierapro-vlog_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-rivierapro-vsim_options" class="form-label">Additional run options for vsim.</label>
              <input class="form-control" id="tools-rivierapro-vsim_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-siliconcompiler">
      <div class="card-header">
        <h1 class="card-title">Tools: SiliconCompiler</h1>
        <h6 class="card-subtitle mb-2 text-muted">SiliconCompiler is an open source compiler framework that automates translation from source code to silicon. Check the project documentation: <a href="https://docs.siliconcompiler.com/en/latest/">https://docs.siliconcompiler.com/en/latest/</a></h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-siliconcompiler-installation_path" class="form-label"></label>
              <input class="form-control" id="tools-siliconcompiler-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-siliconcompiler-target" class="form-label">Compilation target separated by a single underscore, specified as '<process>_<edaflow>' for ASIC compilation and '<partname>_<edaflow>'' for FPGA compilation. The process, edaflow, partname fields must be alphanumeric and cannot contain underscores. E.g: asicflow_freepdk45</label>
              <input class="form-control" id="tools-siliconcompiler-target" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-siliconcompiler-server_enable">
                <label class="form-check-label" for="tools-siliconcompiler-server_enable">
                  Enable remote server.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-siliconcompiler-server_address" class="form-label">Remote server address (e.g: https://server.siliconcompiler.com):</label>
              <input class="form-control" id="tools-siliconcompiler-server_address" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-siliconcompiler-server_username" class="form-label">Remote server user:</label>
              <input class="form-control" id="tools-siliconcompiler-server_username" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-siliconcompiler-server_password" class="form-label">Remote server password:</label>
              <input class="form-control" id="tools-siliconcompiler-server_password" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-spyglass">
      <div class="card-header">
        <h1 class="card-title">Tools: Spyglass</h1>
        <h6 class="card-subtitle mb-2 text-muted">Synopsys (formerly Atrenta) Spyglass Backend. Spyglass performs static source code analysis on HDL code and checks for common coding errors or coding style violations.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-spyglass-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-spyglass-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-spyglass-methodology" class="form-label"></label>
              <input class="form-control" id="tools-spyglass-methodology" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-spyglass-goals" class="form-label"></label>
              <input class="form-control" id="tools-spyglass-goals" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-spyglass-spyglass_options" class="form-label"></label>
              <input class="form-control" id="tools-spyglass-spyglass_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-spyglass-rule_parameters" class="form-label"></label>
              <input class="form-control" id="tools-spyglass-rule_parameters" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-symbiyosys">
      <div class="card-header">
        <h1 class="card-title">Tools: SymbiYosys</h1>
        <h6 class="card-subtitle mb-2 text-muted">SymbiYosys formal verification wrapper for Yosys.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-symbiyosys-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-symbiyosys-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-symbiyosys-tasknames" class="form-label">A list of the .sby file’s tasks to run. Passed on the sby command line..</label>
              <input class="form-control" id="tools-symbiyosys-tasknames" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-symbiflow">
      <div class="card-header">
        <h1 class="card-title">Tools: Symbiflow</h1>
        <h6 class="card-subtitle mb-2 text-muted">VHDL Style Guide. Analyzes VHDL files for style guide violations.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-symbiflow-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-symbiflow-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-symbiflow-package" class="form-label">FPGA chip package (e.g. clg400-1).</label>
              <input class="form-control" id="tools-symbiflow-package" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-symbiflow-part" class="form-label">FPGA part type (e.g. xc7a50t).</label>
              <input class="form-control" id="tools-symbiflow-part" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-symbiflow-vendor" class="form-label">Target architecture. Currently only “xilinx” is supported.</label>
              <input class="form-control" id="tools-symbiflow-vendor" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-symbiflow-pnr" class="form-label">Place and Route tool. Currently only “vpr” is supported.</label>
              <select class="form-select" aria-label="Place and Route tool. Currently only “vpr” is supported." id="tools-symbiflow-pnr">
                      <option value='vpr'>VPR</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-symbiflow-vpr_options" class="form-label">Additional vpr tool options. If not used, default options for the tool will be used.</label>
              <input class="form-control" id="tools-symbiflow-vpr_options" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-symbiflow-environment_script" class="form-label">Optional bash script that will be sourced before each build step..</label>
              <input class="form-control" id="tools-symbiflow-environment_script" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-trellis">
      <div class="card-header">
        <h1 class="card-title">Tools: Trellis</h1>
        <h6 class="card-subtitle mb-2 text-muted">Project Trellis enables a fully open-source flow for ECP5 FPGAs using Yosys for Verilog synthesis and nextpnr for place and route.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-trellis-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-trellis-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-trellis-arch" class="form-label">Target architecture.</label>
              <select class="form-select" aria-label="Target architecture." id="tools-trellis-arch">
                      <option value='xilinx'>Xilinx</option>
                      <option value='ice40'>ICE40</option>
                      <option value='ecp5'>ECP5</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-trellis-output_format" class="form-label">Output file format.</label>
              <select class="form-select" aria-label="Output file format." id="tools-trellis-output_format">
                      <option value='json'>JSON</option>
                      <option value='edif'>EDIF</option>
                      <option value='blif'>BLIF</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-trellis-yosys_as_subtool">
                <label class="form-check-label" for="tools-trellis-yosys_as_subtool">
                  Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-trellis-makefile_name" class="form-label">Generated makefile name, defaults to $name.mk</label>
              <input class="form-control" id="tools-trellis-makefile_name" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-trellis-script_name" class="form-label">Generated tcl script filename, defaults to $name.mk</label>
              <input class="form-control" id="tools-trellis-script_name" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-trellis-nextpnr_options" class="form-label">Options for NextPNR Place & Route.</label>
              <input class="form-control" id="tools-trellis-nextpnr_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-trellis-yosys_synth_options" class="form-label">Additional options for the synth_ice40 command.</label>
              <input class="form-control" id="tools-trellis-yosys_synth_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-vcs">
      <div class="card-header">
        <h1 class="card-title">Tools: VCS</h1>
        <h6 class="card-subtitle mb-2 text-muted">Synopsys VCS Backend</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-vcs-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-vcs-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vcs-vcs_options" class="form-label">Compile time options passed to vcs</label>
              <input class="form-control" id="tools-vcs-vcs_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-vcs-run_options" class="form-label">Runtime options passed to the simulation</label>
              <input class="form-control" id="tools-vcs-run_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-verible">
      <div class="card-header">
        <h1 class="card-title">Tools: Verible</h1>
        <h6 class="card-subtitle mb-2 text-muted">Verible.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-verible-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-verible-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-verilator">
      <div class="card-header">
        <h1 class="card-title">Tools: Verilator</h1>
        <h6 class="card-subtitle mb-2 text-muted">Verilator."</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-verilator-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-verilator-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-verilator-mode" class="form-label">Select compilation mode. Legal values are cc for C++ testbenches, sc for SystemC testbenches or lint-only to only perform linting on the Verilog code.</label>
              <select class="form-select" aria-label="Select compilation mode. Legal values are cc for C++ testbenches, sc for SystemC testbenches or lint-only to only perform linting on the Verilog code." id="tools-verilator-mode">
                      <option value='cc'>cc</option>
                      <option value='sc'>sc</option>
                      <option value='lint-only'>lint-only</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-verilator-libs" class="form-label">Extra libraries for the verilated model to link against.</label>
              <input class="form-control" id="tools-verilator-libs" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-verilator-verilator_options" class="form-label">Additional options for verilator.</label>
              <input class="form-control" id="tools-verilator-verilator_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-verilator-make_options" class="form-label">Additional arguments passed to make when compiling the simulation. This is commonly used to set OPT/OPT_FAST/OPT_SLOW.</label>
              <input class="form-control" id="tools-verilator-make_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-verilator-run_options" class="form-label">Additional arguments directly passed to the verilated model.</label>
              <input class="form-control" id="tools-verilator-run_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-vivado">
      <div class="card-header">
        <h1 class="card-title">Tools: Vivado</h1>
        <h6 class="card-subtitle mb-2 text-muted">The Vivado backend executes Xilinx Vivado to build systems and program the FPGA.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-vivado-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-vivado-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vivado-part" class="form-label">Part. Device identifier. e.g. xc7a35tcsg324-1.</label>
              <input class="form-control" id="tools-vivado-part" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vivado-synth" class="form-label">Synthesis tool. Allowed values are vivado (default) and yosys..</label>
              <input class="form-control" id="tools-vivado-synth" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vivado-pnr" class="form-label">Choose only synthesis or place and route and bitstream generation:</label>
              <select class="form-select" aria-label="Choose only synthesis or place and route and bitstream generation:" id="tools-vivado-pnr">
                      <option value='vivado'>Place and route</option>
                      <option value='none'>Only synthesis</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vivado-jtag_freq" class="form-label">The frequency for jtag communication.</label>
              <input type='number' class="form-control" id="tools-vivado-jtag_freq" rows="3"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vivado-hw_target" class="form-label">Board identifier (e.g. */xilinx_tcf/Digilent/123456789123A.</label>
              <input class="form-control" id="tools-vivado-hw_target" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-vunit">
      <div class="card-header">
        <h1 class="card-title">Tools: VUnit</h1>
        <h6 class="card-subtitle mb-2 text-muted">VUnit testing framework.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-vunit-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-vunit-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vunit-simulator_name" class="form-label">VUnit simulator:</label>
              <select class="form-select" aria-label="VUnit simulator:" id="tools-vunit-simulator_name">
                      <option value='rivierapro'>Aldec Riviera-PRO</option>
                      <option value='activehdl'>Aldec Active-HDL</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='modelsim'>Mentor Graphics ModelSim/Questa</option>
                      <option value='xsim'>XSIM (Not supported in official VUnit)</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vunit-runpy_mode" class="form-label">runpy mode:</label>
              <select class="form-select" aria-label="runpy mode:" id="tools-vunit-runpy_mode">
                      <option value='standalone'>Standalone</option>
                      <option value='creation'>Creation</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-vunit-extra_options" class="form-label">VUnit options. Extra options for the VUnit test runner.</label>
              <input class="form-control" id="tools-vunit-extra_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-vunit-enable_array_util_lib">
                <label class="form-check-label" for="tools-vunit-enable_array_util_lib">
                  Enable array util library in non standalone mode.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-vunit-enable_com_lib">
                <label class="form-check-label" for="tools-vunit-enable_com_lib">
                  Enable com library in non standalone mode.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-vunit-enable_json4vhdl_lib">
                <label class="form-check-label" for="tools-vunit-enable_json4vhdl_lib">
                  Enable json4vhdl library in non standalone mode.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-vunit-enable_osvvm_lib">
                <label class="form-check-label" for="tools-vunit-enable_osvvm_lib">
                  Enable OSVVM library in non standalone mode.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-vunit-enable_random_lib">
                <label class="form-check-label" for="tools-vunit-enable_random_lib">
                  Enable random library in non standalone mode.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-vunit-enable_verification_components_lib">
                <label class="form-check-label" for="tools-vunit-enable_verification_components_lib">
                  Enable verification components library in non standalone mode.
                </label>
              </div>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-xcelium">
      <div class="card-header">
        <h1 class="card-title">Tools: Xcelium</h1>
        <h6 class="card-subtitle mb-2 text-muted">Xcelium simulator from Cadence Design Systems.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-xcelium-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-xcelium-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-xcelium-xmvhdl_options" class="form-label">Additional options for compilation with xmvhdl.</label>
              <input class="form-control" id="tools-xcelium-xmvhdl_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-xcelium-xmvlog_options" class="form-label">Additional options for compilation with xmvlog.</label>
              <input class="form-control" id="tools-xcelium-xmvlog_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-xcelium-xmsim_options" class="form-label">Additional run options for xmsim.</label>
              <input class="form-control" id="tools-xcelium-xmsim_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-xcelium-xrun_options" class="form-label">Additional run options for xrun.</label>
              <input class="form-control" id="tools-xcelium-xrun_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-xsim">
      <div class="card-header">
        <h1 class="card-title">Tools: XSIM</h1>
        <h6 class="card-subtitle mb-2 text-muted">XSim simulator from the Xilinx Vivado suite.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-xsim-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-xsim-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-xsim-xelab_options" class="form-label">Additional options for compilation with xelab.</label>
              <input class="form-control" id="tools-xsim-xelab_options" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <label for="tools-xsim-xsim_options" class="form-label">Additional run options for XSim.</label>
              <input class="form-control" id="tools-xsim-xsim_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-yosys">
      <div class="card-header">
        <h1 class="card-title">Tools: Yosys</h1>
        <h6 class="card-subtitle mb-2 text-muted">Open source synthesis tool targeting many different FPGAs.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-yosys-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-yosys-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-yosys-arch" class="form-label">Target architecture.</label>
              <select class="form-select" aria-label="Target architecture." id="tools-yosys-arch">
                      <option value='xilinx'>Xilinx</option>
                      <option value='ice40'>ICE40</option>
                      <option value='ecp5'>ECP5</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-yosys-output_format" class="form-label">Output file format.</label>
              <select class="form-select" aria-label="Output file format." id="tools-yosys-output_format">
                      <option value='json'>JSON</option>
                      <option value='edif'>EDIF</option>
                      <option value='blif'>BLIF</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-yosys-yosys_as_subtool">
                <label class="form-check-label" for="tools-yosys-yosys_as_subtool">
                  Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-yosys-makefile_name" class="form-label">Generated makefile name, defaults to $name.mk</label>
              <input class="form-control" id="tools-yosys-makefile_name" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-yosys-script_name" class="form-label">Generated tcl script filename, defaults to $name.mk</label>
              <input class="form-control" id="tools-yosys-script_name" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-yosys-yosys_synth_options" class="form-label">Additional options for the synth_ice40 command.</label>
              <input class="form-control" id="tools-yosys-yosys_synth_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-openfpga">
      <div class="card-header">
        <h1 class="card-title">Tools: OpenFPGA</h1>
        <h6 class="card-subtitle mb-2 text-muted">The award-winning OpenFPGA framework is the first open-source FPGA IP generator with silicon proofs supporting highly-customizable FPGA architectures.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-openfpga-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-openfpga-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-openfpga-arch" class="form-label">Target architecture.</label>
              <select class="form-select" aria-label="Target architecture." id="tools-openfpga-arch">
                      <option value='xilinx'>Xilinx</option>
                      <option value='ice40'>ICE40</option>
                      <option value='ecp5'>ECP5</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-openfpga-output_format" class="form-label">Output file format.</label>
              <select class="form-select" aria-label="Output file format." id="tools-openfpga-output_format">
                      <option value='json'>JSON</option>
                      <option value='edif'>EDIF</option>
                      <option value='blif'>BLIF</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-openfpga-yosys_as_subtool">
                <label class="form-check-label" for="tools-openfpga-yosys_as_subtool">
                  Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-openfpga-makefile_name" class="form-label">Generated makefile name, defaults to $name.mk</label>
              <input class="form-control" id="tools-openfpga-makefile_name" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-openfpga-script_name" class="form-label">Generated tcl script filename, defaults to $name.mk</label>
              <input class="form-control" id="tools-openfpga-script_name" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-openfpga-yosys_synth_options" class="form-label">Additional options for the synth_ice40 command.</label>
              <input class="form-control" id="tools-openfpga-yosys_synth_options" rows="3"></input>
            </div>
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-activehdl">
      <div class="card-header">
        <h1 class="card-title">Tools: Active-HDL</h1>
        <h6 class="card-subtitle mb-2 text-muted">Active-HDL™ is a Windows based, integrated FPGA Design Creation and Simulation solution for team-based environments.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-activehdl-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-activehdl-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-nvc">
      <div class="card-header">
        <h1 class="card-title">Tools: NVC</h1>
        <h6 class="card-subtitle mb-2 text-muted">NVC is a VHDL compiler and simulator. NVC supports almost all of VHDL-2002 and it has been successfully used to simulate several real-world designs.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-nvc-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-nvc-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-questa">
      <div class="card-header">
        <h1 class="card-title">Tools: Questa Advanced Simulator</h1>
        <h6 class="card-subtitle mb-2 text-muted">The Questa advanced simulator is the core simulation and debug engine of the Questa verification solution.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-questa-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-questa-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
    <div class="card h-100" id="tools-raptor">
      <div class="card-header">
        <h1 class="card-title">Tools: Raptor Design Suite</h1>
        <h6 class="card-subtitle mb-2 text-muted">Raptor Design Suite.</h6>
      </div>
      <div class="card-body overflow-auto">
      
          
          
            <div class="mb-3">
              <label for="tools-raptor-installation_path" class="form-label">Installation path:</label>
              <input class="form-control" id="tools-raptor-installation_path" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-target_device" class="form-label">Target device</label>
              <input class="form-control" id="tools-raptor-target_device" rows="3"  value="1GE100"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-vhdl_version" class="form-label">VHDL version</label>
              <select class="form-select" aria-label="VHDL version" id="tools-raptor-vhdl_version">
                      <option value='VHDL_1987'>1987</option>
                      <option value='VHDL_1993'>1993</option>
                      <option value='VHDL_2000'>2000</option>
                      <option value='VHDL_2008'>2008</option>
                      <option value='VHDL_2019'>2019</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-verilog_version" class="form-label">Verilog version</label>
              <select class="form-select" aria-label="Verilog version" id="tools-raptor-verilog_version">
                      <option value='V_1995'>1995</option>
                      <option value='V_2001'>2001</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-sv_version" class="form-label">SV version</label>
              <select class="form-select" aria-label="SV version" id="tools-raptor-sv_version">
                      <option value='SV_2005'>2005</option>
                      <option value='SV_2009'>2009</option>
                      <option value='SV_2012'>2012</option>
                      <option value='SV_2017'>2017</option>
              </select>
            </div>
          
          
          
          
            <hr class="hr hr-blurry" />
            <h4 class="card-subtitle text-muted">Synthesis</h4>
            <hr class="hr hr-blurry" />
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-optimization" class="form-label">Optimization</label>
              <select class="form-select" aria-label="Optimization" id="tools-raptor-optimization">
                      <option value='area'>Area</option>
                      <option value='delay'>Delay</option>
                      <option value='mixed'>Mixed</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-effort" class="form-label">Effort</label>
              <select class="form-select" aria-label="Effort" id="tools-raptor-effort">
                      <option value='high'>High</option>
                      <option value='medium'>Medium</option>
                      <option value='low'>Low</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-fsm_encoding" class="form-label">FSM encoding</label>
              <select class="form-select" aria-label="FSM encoding" id="tools-raptor-fsm_encoding">
                      <option value='binary'>Binary</option>
                      <option value='onehot'>One Hot</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-carry" class="form-label">Carry</label>
              <select class="form-select" aria-label="Carry" id="tools-raptor-carry">
                      <option value='auto'>Auto</option>
                      <option value='all'>All</option>
                      <option value='none'>None</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-pnr_netlist_language" class="form-label">Pnr netlist language</label>
              <select class="form-select" aria-label="Pnr netlist language" id="tools-raptor-pnr_netlist_language">
                      <option value='blif'>Blif</option>
                      <option value='edif'>edif</option>
                      <option value='verilog'>Verilog</option>
                      <option value='vhdl'>VHDL</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-dsp_limit" class="form-label">DSP limit</label>
              <input type='number' class="form-control" id="tools-raptor-dsp_limit" rows="3"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-block_ram_limit" class="form-label">Block RAM limit</label>
              <input type='number' class="form-control" id="tools-raptor-block_ram_limit" rows="3"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-raptor-fast_synthesis">
                <label class="form-check-label" for="tools-raptor-fast_synthesis">
                  Fast Synthesis
                </label>
              </div>
            </div>
          
          
          
          
            <hr class="hr hr-blurry" />
            <h4 class="card-subtitle text-muted">Simulation</h4>
            <hr class="hr hr-blurry" />
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-top_level" class="form-label">Simulation top level path:</label>
              <input class="form-control" id="tools-raptor-top_level" rows="3"  value=""></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-sim_source_list" class="form-label">Other simulation sources (comma separed):</label>
              <input class="form-control" id="tools-raptor-sim_source_list" rows="3"></input>
            </div>
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-raptor-simulate_rtl">
                <label class="form-check-label" for="tools-raptor-simulate_rtl">
                  Simulate RTL
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-waveform_rtl" class="form-label">RTL waveform simulation</label>
              <input class="form-control" id="tools-raptor-waveform_rtl" rows="3"  value="syn_tb_rtl.fst"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-simulator_rtl" class="form-label">RTL Simulator</label>
              <select class="form-select" aria-label="RTL Simulator" id="tools-raptor-simulator_rtl">
                      <option value='verilator'>Verilator</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='icarus'>Icarus</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-simulation_options_rtl" class="form-label">Simulation options</label>
              <input class="form-control" id="tools-raptor-simulation_options_rtl" rows="3"  value="--stop-time=1000ns"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-raptor-simulate_gate">
                <label class="form-check-label" for="tools-raptor-simulate_gate">
                  Simulate Gate
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-waveform_gate" class="form-label">Gate waveform simulation</label>
              <input class="form-control" id="tools-raptor-waveform_gate" rows="3"  value="syn_tb_gate.fst"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-simulator_gate" class="form-label">Gate Simulator</label>
              <select class="form-select" aria-label="Gate Simulator" id="tools-raptor-simulator_gate">
                      <option value='verilator'>Verilator</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='icarus'>Icarus</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-simulation_options_gate" class="form-label">Simulation options</label>
              <input class="form-control" id="tools-raptor-simulation_options_gate" rows="3"  value="--stop-time=1000ns"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="tools-raptor-simulate_pnr">
                <label class="form-check-label" for="tools-raptor-simulate_pnr">
                  Simulate PNR
                </label>
              </div>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-waveform_pnr" class="form-label">PNR waveform simulation</label>
              <input class="form-control" id="tools-raptor-waveform_pnr" rows="3"  value="sim_pnr.fst"></input>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-simulator_pnr" class="form-label">PNR Simulator</label>
              <select class="form-select" aria-label="PNR Simulator" id="tools-raptor-simulator_pnr">
                      <option value='verilator'>Verilator</option>
                      <option value='ghdl'>GHDL</option>
                      <option value='icarus'>Icarus</option>
              </select>
            </div>
          
          
          
          
            <div class="mb-3">
              <label for="tools-raptor-simulation_options_pnr" class="form-label">Simulation options</label>
              <input class="form-control" id="tools-raptor-simulation_options_pnr" rows="3"  value="--stop-time=1000ns"></input>
            </div>
          
          
          
          
      </div>
      
      <div class="card-footer">
        <button type="button_cancel" class="btn btn-m btn-block btn-primary btn-danger" onclick="close_panel(event)">Close</button>
        <button type="button_apply" class="btn btn-m btn-block btn-primary btn btn-success" onclick="send_config(event)">Apply</button>
        <button type="button_apply_close" class="btn btn-m btn-block btn-primary" onclick="send_config_and_close(event)">Apply and close</button>
      </div>
  </div>
</div>

        </div>
    </div>


<script>
    
  function enable_tab(tp0, tp1){
    const complete = tp0 + "-" + tp1;
  if ("general" == tp0 && "general" == tp1){
    document.getElementById("general-general").classList.remove('d-none');
  }
  else{
    document.getElementById("general-general").classList.remove('d-none');
    document.getElementById("general-general").classList.add('d-none');
  }
  if ("documentation" == tp0 && "general" == tp1){
    document.getElementById("documentation-general").classList.remove('d-none');
  }
  else{
    document.getElementById("documentation-general").classList.remove('d-none');
    document.getElementById("documentation-general").classList.add('d-none');
  }
  if ("editor" == tp0 && "general" == tp1){
    document.getElementById("editor-general").classList.remove('d-none');
  }
  else{
    document.getElementById("editor-general").classList.remove('d-none');
    document.getElementById("editor-general").classList.add('d-none');
  }
  if ("formatter" == tp0 && "general" == tp1){
    document.getElementById("formatter-general").classList.remove('d-none');
  }
  else{
    document.getElementById("formatter-general").classList.remove('d-none');
    document.getElementById("formatter-general").classList.add('d-none');
  }
  if ("formatter" == tp0 && "istyle" == tp1){
    document.getElementById("formatter-istyle").classList.remove('d-none');
  }
  else{
    document.getElementById("formatter-istyle").classList.remove('d-none');
    document.getElementById("formatter-istyle").classList.add('d-none');
  }
  if ("formatter" == tp0 && "s3sv" == tp1){
    document.getElementById("formatter-s3sv").classList.remove('d-none');
  }
  else{
    document.getElementById("formatter-s3sv").classList.remove('d-none');
    document.getElementById("formatter-s3sv").classList.add('d-none');
  }
  if ("formatter" == tp0 && "verible" == tp1){
    document.getElementById("formatter-verible").classList.remove('d-none');
  }
  else{
    document.getElementById("formatter-verible").classList.remove('d-none');
    document.getElementById("formatter-verible").classList.add('d-none');
  }
  if ("formatter" == tp0 && "standalone" == tp1){
    document.getElementById("formatter-standalone").classList.remove('d-none');
  }
  else{
    document.getElementById("formatter-standalone").classList.remove('d-none');
    document.getElementById("formatter-standalone").classList.add('d-none');
  }
  if ("formatter" == tp0 && "svg" == tp1){
    document.getElementById("formatter-svg").classList.remove('d-none');
  }
  else{
    document.getElementById("formatter-svg").classList.remove('d-none');
    document.getElementById("formatter-svg").classList.add('d-none');
  }
  if ("linter" == tp0 && "general" == tp1){
    document.getElementById("linter-general").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-general").classList.remove('d-none');
    document.getElementById("linter-general").classList.add('d-none');
  }
  if ("linter" == tp0 && "ghdl" == tp1){
    document.getElementById("linter-ghdl").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-ghdl").classList.remove('d-none');
    document.getElementById("linter-ghdl").classList.add('d-none');
  }
  if ("linter" == tp0 && "icarus" == tp1){
    document.getElementById("linter-icarus").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-icarus").classList.remove('d-none');
    document.getElementById("linter-icarus").classList.add('d-none');
  }
  if ("linter" == tp0 && "modelsim" == tp1){
    document.getElementById("linter-modelsim").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-modelsim").classList.remove('d-none');
    document.getElementById("linter-modelsim").classList.add('d-none');
  }
  if ("linter" == tp0 && "verible" == tp1){
    document.getElementById("linter-verible").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-verible").classList.remove('d-none');
    document.getElementById("linter-verible").classList.add('d-none');
  }
  if ("linter" == tp0 && "verilator" == tp1){
    document.getElementById("linter-verilator").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-verilator").classList.remove('d-none');
    document.getElementById("linter-verilator").classList.add('d-none');
  }
  if ("linter" == tp0 && "vivado" == tp1){
    document.getElementById("linter-vivado").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-vivado").classList.remove('d-none');
    document.getElementById("linter-vivado").classList.add('d-none');
  }
  if ("linter" == tp0 && "vsg" == tp1){
    document.getElementById("linter-vsg").classList.remove('d-none');
  }
  else{
    document.getElementById("linter-vsg").classList.remove('d-none');
    document.getElementById("linter-vsg").classList.add('d-none');
  }
  if ("schematic" == tp0 && "general" == tp1){
    document.getElementById("schematic-general").classList.remove('d-none');
  }
  else{
    document.getElementById("schematic-general").classList.remove('d-none');
    document.getElementById("schematic-general").classList.add('d-none');
  }
  if ("templates" == tp0 && "general" == tp1){
    document.getElementById("templates-general").classList.remove('d-none');
  }
  else{
    document.getElementById("templates-general").classList.remove('d-none');
    document.getElementById("templates-general").classList.add('d-none');
  }
  if ("tools" == tp0 && "general" == tp1){
    document.getElementById("tools-general").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-general").classList.remove('d-none');
    document.getElementById("tools-general").classList.add('d-none');
  }
  if ("tools" == tp0 && "osvvm" == tp1){
    document.getElementById("tools-osvvm").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-osvvm").classList.remove('d-none');
    document.getElementById("tools-osvvm").classList.add('d-none');
  }
  if ("tools" == tp0 && "ascenlint" == tp1){
    document.getElementById("tools-ascenlint").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-ascenlint").classList.remove('d-none');
    document.getElementById("tools-ascenlint").classList.add('d-none');
  }
  if ("tools" == tp0 && "cocotb" == tp1){
    document.getElementById("tools-cocotb").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-cocotb").classList.remove('d-none');
    document.getElementById("tools-cocotb").classList.add('d-none');
  }
  if ("tools" == tp0 && "diamond" == tp1){
    document.getElementById("tools-diamond").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-diamond").classList.remove('d-none');
    document.getElementById("tools-diamond").classList.add('d-none');
  }
  if ("tools" == tp0 && "ghdl" == tp1){
    document.getElementById("tools-ghdl").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-ghdl").classList.remove('d-none');
    document.getElementById("tools-ghdl").classList.add('d-none');
  }
  if ("tools" == tp0 && "icarus" == tp1){
    document.getElementById("tools-icarus").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-icarus").classList.remove('d-none');
    document.getElementById("tools-icarus").classList.add('d-none');
  }
  if ("tools" == tp0 && "icestorm" == tp1){
    document.getElementById("tools-icestorm").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-icestorm").classList.remove('d-none');
    document.getElementById("tools-icestorm").classList.add('d-none');
  }
  if ("tools" == tp0 && "ise" == tp1){
    document.getElementById("tools-ise").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-ise").classList.remove('d-none');
    document.getElementById("tools-ise").classList.add('d-none');
  }
  if ("tools" == tp0 && "isem" == tp1){
    document.getElementById("tools-isem").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-isem").classList.remove('d-none');
    document.getElementById("tools-isem").classList.add('d-none');
  }
  if ("tools" == tp0 && "modelsim" == tp1){
    document.getElementById("tools-modelsim").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-modelsim").classList.remove('d-none');
    document.getElementById("tools-modelsim").classList.add('d-none');
  }
  if ("tools" == tp0 && "morty" == tp1){
    document.getElementById("tools-morty").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-morty").classList.remove('d-none');
    document.getElementById("tools-morty").classList.add('d-none');
  }
  if ("tools" == tp0 && "quartus" == tp1){
    document.getElementById("tools-quartus").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-quartus").classList.remove('d-none');
    document.getElementById("tools-quartus").classList.add('d-none');
  }
  if ("tools" == tp0 && "radiant" == tp1){
    document.getElementById("tools-radiant").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-radiant").classList.remove('d-none');
    document.getElementById("tools-radiant").classList.add('d-none');
  }
  if ("tools" == tp0 && "rivierapro" == tp1){
    document.getElementById("tools-rivierapro").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-rivierapro").classList.remove('d-none');
    document.getElementById("tools-rivierapro").classList.add('d-none');
  }
  if ("tools" == tp0 && "siliconcompiler" == tp1){
    document.getElementById("tools-siliconcompiler").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-siliconcompiler").classList.remove('d-none');
    document.getElementById("tools-siliconcompiler").classList.add('d-none');
  }
  if ("tools" == tp0 && "spyglass" == tp1){
    document.getElementById("tools-spyglass").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-spyglass").classList.remove('d-none');
    document.getElementById("tools-spyglass").classList.add('d-none');
  }
  if ("tools" == tp0 && "symbiyosys" == tp1){
    document.getElementById("tools-symbiyosys").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-symbiyosys").classList.remove('d-none');
    document.getElementById("tools-symbiyosys").classList.add('d-none');
  }
  if ("tools" == tp0 && "symbiflow" == tp1){
    document.getElementById("tools-symbiflow").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-symbiflow").classList.remove('d-none');
    document.getElementById("tools-symbiflow").classList.add('d-none');
  }
  if ("tools" == tp0 && "trellis" == tp1){
    document.getElementById("tools-trellis").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-trellis").classList.remove('d-none');
    document.getElementById("tools-trellis").classList.add('d-none');
  }
  if ("tools" == tp0 && "vcs" == tp1){
    document.getElementById("tools-vcs").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-vcs").classList.remove('d-none');
    document.getElementById("tools-vcs").classList.add('d-none');
  }
  if ("tools" == tp0 && "verible" == tp1){
    document.getElementById("tools-verible").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-verible").classList.remove('d-none');
    document.getElementById("tools-verible").classList.add('d-none');
  }
  if ("tools" == tp0 && "verilator" == tp1){
    document.getElementById("tools-verilator").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-verilator").classList.remove('d-none');
    document.getElementById("tools-verilator").classList.add('d-none');
  }
  if ("tools" == tp0 && "vivado" == tp1){
    document.getElementById("tools-vivado").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-vivado").classList.remove('d-none');
    document.getElementById("tools-vivado").classList.add('d-none');
  }
  if ("tools" == tp0 && "vunit" == tp1){
    document.getElementById("tools-vunit").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-vunit").classList.remove('d-none');
    document.getElementById("tools-vunit").classList.add('d-none');
  }
  if ("tools" == tp0 && "xcelium" == tp1){
    document.getElementById("tools-xcelium").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-xcelium").classList.remove('d-none');
    document.getElementById("tools-xcelium").classList.add('d-none');
  }
  if ("tools" == tp0 && "xsim" == tp1){
    document.getElementById("tools-xsim").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-xsim").classList.remove('d-none');
    document.getElementById("tools-xsim").classList.add('d-none');
  }
  if ("tools" == tp0 && "yosys" == tp1){
    document.getElementById("tools-yosys").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-yosys").classList.remove('d-none');
    document.getElementById("tools-yosys").classList.add('d-none');
  }
  if ("tools" == tp0 && "openfpga" == tp1){
    document.getElementById("tools-openfpga").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-openfpga").classList.remove('d-none');
    document.getElementById("tools-openfpga").classList.add('d-none');
  }
  if ("tools" == tp0 && "activehdl" == tp1){
    document.getElementById("tools-activehdl").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-activehdl").classList.remove('d-none');
    document.getElementById("tools-activehdl").classList.add('d-none');
  }
  if ("tools" == tp0 && "nvc" == tp1){
    document.getElementById("tools-nvc").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-nvc").classList.remove('d-none');
    document.getElementById("tools-nvc").classList.add('d-none');
  }
  if ("tools" == tp0 && "questa" == tp1){
    document.getElementById("tools-questa").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-questa").classList.remove('d-none');
    document.getElementById("tools-questa").classList.add('d-none');
  }
  if ("tools" == tp0 && "raptor" == tp1){
    document.getElementById("tools-raptor").classList.remove('d-none');
  }
  else{
    document.getElementById("tools-raptor").classList.remove('d-none');
    document.getElementById("tools-raptor").classList.add('d-none');
  }
  }

  enable_tab('general', 'general');

  document.getElementById("btn-general-general").addEventListener("click", function() {
    enable_tab("general","general")
  });

  document.getElementById("btn-documentation-general").addEventListener("click", function() {
    enable_tab("documentation","general")
  });

  document.getElementById("btn-editor-general").addEventListener("click", function() {
    enable_tab("editor","general")
  });

  document.getElementById("btn-formatter-general").addEventListener("click", function() {
    enable_tab("formatter","general")
  });

  document.getElementById("btn-formatter-istyle").addEventListener("click", function() {
    enable_tab("formatter","istyle")
  });

  document.getElementById("btn-formatter-s3sv").addEventListener("click", function() {
    enable_tab("formatter","s3sv")
  });

  document.getElementById("btn-formatter-verible").addEventListener("click", function() {
    enable_tab("formatter","verible")
  });

  document.getElementById("btn-formatter-standalone").addEventListener("click", function() {
    enable_tab("formatter","standalone")
  });

  document.getElementById("btn-formatter-svg").addEventListener("click", function() {
    enable_tab("formatter","svg")
  });

  document.getElementById("btn-linter-general").addEventListener("click", function() {
    enable_tab("linter","general")
  });

  document.getElementById("btn-linter-ghdl").addEventListener("click", function() {
    enable_tab("linter","ghdl")
  });

  document.getElementById("btn-linter-icarus").addEventListener("click", function() {
    enable_tab("linter","icarus")
  });

  document.getElementById("btn-linter-modelsim").addEventListener("click", function() {
    enable_tab("linter","modelsim")
  });

  document.getElementById("btn-linter-verible").addEventListener("click", function() {
    enable_tab("linter","verible")
  });

  document.getElementById("btn-linter-verilator").addEventListener("click", function() {
    enable_tab("linter","verilator")
  });

  document.getElementById("btn-linter-vivado").addEventListener("click", function() {
    enable_tab("linter","vivado")
  });

  document.getElementById("btn-linter-vsg").addEventListener("click", function() {
    enable_tab("linter","vsg")
  });

  document.getElementById("btn-schematic-general").addEventListener("click", function() {
    enable_tab("schematic","general")
  });

  document.getElementById("btn-templates-general").addEventListener("click", function() {
    enable_tab("templates","general")
  });

  document.getElementById("btn-tools-general").addEventListener("click", function() {
    enable_tab("tools","general")
  });

  document.getElementById("btn-tools-osvvm").addEventListener("click", function() {
    enable_tab("tools","osvvm")
  });

  document.getElementById("btn-tools-ascenlint").addEventListener("click", function() {
    enable_tab("tools","ascenlint")
  });

  document.getElementById("btn-tools-cocotb").addEventListener("click", function() {
    enable_tab("tools","cocotb")
  });

  document.getElementById("btn-tools-diamond").addEventListener("click", function() {
    enable_tab("tools","diamond")
  });

  document.getElementById("btn-tools-ghdl").addEventListener("click", function() {
    enable_tab("tools","ghdl")
  });

  document.getElementById("btn-tools-icarus").addEventListener("click", function() {
    enable_tab("tools","icarus")
  });

  document.getElementById("btn-tools-icestorm").addEventListener("click", function() {
    enable_tab("tools","icestorm")
  });

  document.getElementById("btn-tools-ise").addEventListener("click", function() {
    enable_tab("tools","ise")
  });

  document.getElementById("btn-tools-isem").addEventListener("click", function() {
    enable_tab("tools","isem")
  });

  document.getElementById("btn-tools-modelsim").addEventListener("click", function() {
    enable_tab("tools","modelsim")
  });

  document.getElementById("btn-tools-morty").addEventListener("click", function() {
    enable_tab("tools","morty")
  });

  document.getElementById("btn-tools-quartus").addEventListener("click", function() {
    enable_tab("tools","quartus")
  });

  document.getElementById("btn-tools-radiant").addEventListener("click", function() {
    enable_tab("tools","radiant")
  });

  document.getElementById("btn-tools-rivierapro").addEventListener("click", function() {
    enable_tab("tools","rivierapro")
  });

  document.getElementById("btn-tools-siliconcompiler").addEventListener("click", function() {
    enable_tab("tools","siliconcompiler")
  });

  document.getElementById("btn-tools-spyglass").addEventListener("click", function() {
    enable_tab("tools","spyglass")
  });

  document.getElementById("btn-tools-symbiyosys").addEventListener("click", function() {
    enable_tab("tools","symbiyosys")
  });

  document.getElementById("btn-tools-symbiflow").addEventListener("click", function() {
    enable_tab("tools","symbiflow")
  });

  document.getElementById("btn-tools-trellis").addEventListener("click", function() {
    enable_tab("tools","trellis")
  });

  document.getElementById("btn-tools-vcs").addEventListener("click", function() {
    enable_tab("tools","vcs")
  });

  document.getElementById("btn-tools-verible").addEventListener("click", function() {
    enable_tab("tools","verible")
  });

  document.getElementById("btn-tools-verilator").addEventListener("click", function() {
    enable_tab("tools","verilator")
  });

  document.getElementById("btn-tools-vivado").addEventListener("click", function() {
    enable_tab("tools","vivado")
  });

  document.getElementById("btn-tools-vunit").addEventListener("click", function() {
    enable_tab("tools","vunit")
  });

  document.getElementById("btn-tools-xcelium").addEventListener("click", function() {
    enable_tab("tools","xcelium")
  });

  document.getElementById("btn-tools-xsim").addEventListener("click", function() {
    enable_tab("tools","xsim")
  });

  document.getElementById("btn-tools-yosys").addEventListener("click", function() {
    enable_tab("tools","yosys")
  });

  document.getElementById("btn-tools-openfpga").addEventListener("click", function() {
    enable_tab("tools","openfpga")
  });

  document.getElementById("btn-tools-activehdl").addEventListener("click", function() {
    enable_tab("tools","activehdl")
  });

  document.getElementById("btn-tools-nvc").addEventListener("click", function() {
    enable_tab("tools","nvc")
  });

  document.getElementById("btn-tools-questa").addEventListener("click", function() {
    enable_tab("tools","questa")
  });

  document.getElementById("btn-tools-raptor").addEventListener("click", function() {
    enable_tab("tools","raptor")
  });

  /* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - 
  This allows the user to have multiple dropdowns without any conflict */
  var dropdown = document.getElementsByClassName("dropdown-btn");
  var i;

  for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "block";
      }
    });
  }
  
  const vscode = acquireVsCodeApi();

  function send_config_and_close(){
    const config = get_config();

    vscode.postMessage({
        command: 'set_config_and_close',
        config : config
    });
  }

  function send_config(){
    const config = get_config();

    vscode.postMessage({
        command: 'set_config',
        config : config
    });
  }

  function close_panel(){
    vscode.postMessage({
        command: 'close'
    });
  }

  function export_config(){
    vscode.postMessage({
        command: 'export'
    });
  }

  function load_config(){
    vscode.postMessage({
        command: 'load'
    });
  }

  window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
          case 'set_config':
              set_config(message.config);
              break;
      }
  });

  function get_config(){
    const config = {};
    let element_value;
    config["general"] = {}
    config["general"]["general"] = {}
    element_value = document.getElementById("general-general-logging").checked;
    config["general"]["general"]["logging"] = element_value
    element_value = document.getElementById("general-general-pypath").value;
    config["general"]["general"]["pypath"] = element_value
    element_value = document.getElementById("general-general-go_to_definition_vhdl").checked;
    config["general"]["general"]["go_to_definition_vhdl"] = element_value
    element_value = document.getElementById("general-general-go_to_definition_verilog").checked;
    config["general"]["general"]["go_to_definition_verilog"] = element_value
    element_value = document.getElementById("general-general-developer_mode").checked;
    config["general"]["general"]["developer_mode"] = element_value
    config["documentation"] = {}
    config["documentation"]["general"] = {}
    element_value = document.getElementById("documentation-general-language").value;
    config["documentation"]["general"]["language"] = element_value
    element_value = document.getElementById("documentation-general-symbol_vhdl").value;
    config["documentation"]["general"]["symbol_vhdl"] = element_value
    element_value = document.getElementById("documentation-general-symbol_verilog").value;
    config["documentation"]["general"]["symbol_verilog"] = element_value
    element_value = document.getElementById("documentation-general-dependency_graph").checked;
    config["documentation"]["general"]["dependency_graph"] = element_value
    element_value = document.getElementById("documentation-general-self_contained").checked;
    config["documentation"]["general"]["self_contained"] = element_value
    element_value = document.getElementById("documentation-general-fsm").checked;
    config["documentation"]["general"]["fsm"] = element_value
    element_value = document.getElementById("documentation-general-ports").value;
    config["documentation"]["general"]["ports"] = element_value
    element_value = document.getElementById("documentation-general-generics").value;
    config["documentation"]["general"]["generics"] = element_value
    element_value = document.getElementById("documentation-general-instantiations").value;
    config["documentation"]["general"]["instantiations"] = element_value
    element_value = document.getElementById("documentation-general-signals").value;
    config["documentation"]["general"]["signals"] = element_value
    element_value = document.getElementById("documentation-general-constants").value;
    config["documentation"]["general"]["constants"] = element_value
    element_value = document.getElementById("documentation-general-types").value;
    config["documentation"]["general"]["types"] = element_value
    element_value = document.getElementById("documentation-general-process").value;
    config["documentation"]["general"]["process"] = element_value
    element_value = document.getElementById("documentation-general-functions").value;
    config["documentation"]["general"]["functions"] = element_value
    element_value = document.getElementById("documentation-general-magic_config_path").value;
    config["documentation"]["general"]["magic_config_path"] = element_value
    config["editor"] = {}
    config["editor"]["general"] = {}
    element_value = document.getElementById("editor-general-stutter_comment_shortcuts").checked;
    config["editor"]["general"]["stutter_comment_shortcuts"] = element_value
    element_value = parseInt(document.getElementById("editor-general-stutter_block_width").value, 10);
    config["editor"]["general"]["stutter_block_width"] = element_value
    element_value = parseInt(document.getElementById("editor-general-stutter_max_width").value, 10);
    config["editor"]["general"]["stutter_max_width"] = element_value
    element_value = document.getElementById("editor-general-stutter_delimiters").checked;
    config["editor"]["general"]["stutter_delimiters"] = element_value
    element_value = document.getElementById("editor-general-stutter_bracket_shortcuts").checked;
    config["editor"]["general"]["stutter_bracket_shortcuts"] = element_value
    config["formatter"] = {}
    config["formatter"]["general"] = {}
    element_value = document.getElementById("formatter-general-formatter_verilog").value;
    config["formatter"]["general"]["formatter_verilog"] = element_value
    element_value = document.getElementById("formatter-general-formatter_vhdl").value;
    config["formatter"]["general"]["formatter_vhdl"] = element_value
    config["formatter"]["istyle"] = {}
    element_value = document.getElementById("formatter-istyle-style").value;
    config["formatter"]["istyle"]["style"] = element_value
    element_value = parseInt(document.getElementById("formatter-istyle-indentation_size").value, 10);
    config["formatter"]["istyle"]["indentation_size"] = element_value
    config["formatter"]["s3sv"] = {}
    element_value = document.getElementById("formatter-s3sv-one_bind_per_line").checked;
    config["formatter"]["s3sv"]["one_bind_per_line"] = element_value
    element_value = document.getElementById("formatter-s3sv-one_declaration_per_line").checked;
    config["formatter"]["s3sv"]["one_declaration_per_line"] = element_value
    element_value = document.getElementById("formatter-s3sv-use_tabs").checked;
    config["formatter"]["s3sv"]["use_tabs"] = element_value
    element_value = parseInt(document.getElementById("formatter-s3sv-indentation_size").value, 10);
    config["formatter"]["s3sv"]["indentation_size"] = element_value
    config["formatter"]["verible"] = {}
    element_value = document.getElementById("formatter-verible-format_args").value;
    config["formatter"]["verible"]["format_args"] = element_value
    config["formatter"]["standalone"] = {}
    element_value = document.getElementById("formatter-standalone-keyword_case").value;
    config["formatter"]["standalone"]["keyword_case"] = element_value
    element_value = document.getElementById("formatter-standalone-name_case").value;
    config["formatter"]["standalone"]["name_case"] = element_value
    element_value = document.getElementById("formatter-standalone-indentation").value;
    config["formatter"]["standalone"]["indentation"] = element_value
    element_value = document.getElementById("formatter-standalone-align_port_generic").checked;
    config["formatter"]["standalone"]["align_port_generic"] = element_value
    element_value = document.getElementById("formatter-standalone-align_comment").checked;
    config["formatter"]["standalone"]["align_comment"] = element_value
    element_value = document.getElementById("formatter-standalone-remove_comments").checked;
    config["formatter"]["standalone"]["remove_comments"] = element_value
    element_value = document.getElementById("formatter-standalone-remove_reports").checked;
    config["formatter"]["standalone"]["remove_reports"] = element_value
    element_value = document.getElementById("formatter-standalone-check_alias").checked;
    config["formatter"]["standalone"]["check_alias"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_then").value;
    config["formatter"]["standalone"]["new_line_after_then"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_semicolon").value;
    config["formatter"]["standalone"]["new_line_after_semicolon"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_else").value;
    config["formatter"]["standalone"]["new_line_after_else"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_port").value;
    config["formatter"]["standalone"]["new_line_after_port"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_generic").value;
    config["formatter"]["standalone"]["new_line_after_generic"] = element_value
    config["formatter"]["svg"] = {}
    element_value = document.getElementById("formatter-svg-configuration").value;
    config["formatter"]["svg"]["configuration"] = element_value
    element_value = parseInt(document.getElementById("formatter-svg-core_number").value, 10);
    config["formatter"]["svg"]["core_number"] = element_value
    element_value = document.getElementById("formatter-svg-aditional_arguments").value;
    config["formatter"]["svg"]["aditional_arguments"] = element_value
    config["linter"] = {}
    config["linter"]["general"] = {}
    element_value = document.getElementById("linter-general-linter_vhdl").value;
    config["linter"]["general"]["linter_vhdl"] = element_value
    element_value = document.getElementById("linter-general-linter_verilog").value;
    config["linter"]["general"]["linter_verilog"] = element_value
    element_value = document.getElementById("linter-general-lstyle_verilog").value;
    config["linter"]["general"]["lstyle_verilog"] = element_value
    element_value = document.getElementById("linter-general-lstyle_vhdl").value;
    config["linter"]["general"]["lstyle_vhdl"] = element_value
    config["linter"]["ghdl"] = {}
    element_value = document.getElementById("linter-ghdl-arguments").value;
    config["linter"]["ghdl"]["arguments"] = element_value
    config["linter"]["icarus"] = {}
    element_value = document.getElementById("linter-icarus-arguments").value;
    config["linter"]["icarus"]["arguments"] = element_value
    config["linter"]["modelsim"] = {}
    element_value = document.getElementById("linter-modelsim-vhdl_arguments").value;
    config["linter"]["modelsim"]["vhdl_arguments"] = element_value
    element_value = document.getElementById("linter-modelsim-verilog_arguments").value;
    config["linter"]["modelsim"]["verilog_arguments"] = element_value
    config["linter"]["verible"] = {}
    element_value = document.getElementById("linter-verible-arguments").value;
    config["linter"]["verible"]["arguments"] = element_value
    config["linter"]["verilator"] = {}
    element_value = document.getElementById("linter-verilator-arguments").value;
    config["linter"]["verilator"]["arguments"] = element_value
    config["linter"]["vivado"] = {}
    element_value = document.getElementById("linter-vivado-vhdl_arguments").value;
    config["linter"]["vivado"]["vhdl_arguments"] = element_value
    element_value = document.getElementById("linter-vivado-verilog_arguments").value;
    config["linter"]["vivado"]["verilog_arguments"] = element_value
    config["linter"]["vsg"] = {}
    element_value = document.getElementById("linter-vsg-arguments").value;
    config["linter"]["vsg"]["arguments"] = element_value
    config["schematic"] = {}
    config["schematic"]["general"] = {}
    element_value = document.getElementById("schematic-general-backend").value;
    config["schematic"]["general"]["backend"] = element_value
    element_value = document.getElementById("schematic-general-extra").value;
    config["schematic"]["general"]["extra"] = element_value
    element_value = document.getElementById("schematic-general-args").value;
    config["schematic"]["general"]["args"] = element_value
    config["templates"] = {}
    config["templates"]["general"] = {}
    element_value = document.getElementById("templates-general-header_file_path").value;
    config["templates"]["general"]["header_file_path"] = element_value
    element_value = document.getElementById("templates-general-indent").value;
    config["templates"]["general"]["indent"] = element_value
    element_value = document.getElementById("templates-general-clock_generation_style").value;
    config["templates"]["general"]["clock_generation_style"] = element_value
    element_value = document.getElementById("templates-general-instance_style").value;
    config["templates"]["general"]["instance_style"] = element_value
    config["tools"] = {}
    config["tools"]["general"] = {}
    element_value = document.getElementById("tools-general-select_tool").value;
    config["tools"]["general"]["select_tool"] = element_value
    element_value = document.getElementById("tools-general-gtkwave_installation_path").value;
    config["tools"]["general"]["gtkwave_installation_path"] = element_value
    element_value = document.getElementById("tools-general-execution_mode").value;
    config["tools"]["general"]["execution_mode"] = element_value
    element_value = document.getElementById("tools-general-waveform_viewer").value;
    config["tools"]["general"]["waveform_viewer"] = element_value
    config["tools"]["osvvm"] = {}
    element_value = document.getElementById("tools-osvvm-installation_path").value;
    config["tools"]["osvvm"]["installation_path"] = element_value
    element_value = document.getElementById("tools-osvvm-tclsh_binary").value;
    config["tools"]["osvvm"]["tclsh_binary"] = element_value
    element_value = document.getElementById("tools-osvvm-simulator_name").value;
    config["tools"]["osvvm"]["simulator_name"] = element_value
    config["tools"]["ascenlint"] = {}
    element_value = document.getElementById("tools-ascenlint-installation_path").value;
    config["tools"]["ascenlint"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ascenlint-ascentlint_options").value.split(',');
    config["tools"]["ascenlint"]["ascentlint_options"] = element_value
    config["tools"]["cocotb"] = {}
    element_value = document.getElementById("tools-cocotb-installation_path").value;
    config["tools"]["cocotb"]["installation_path"] = element_value
    element_value = document.getElementById("tools-cocotb-simulator_name").value;
    config["tools"]["cocotb"]["simulator_name"] = element_value
    element_value = document.getElementById("tools-cocotb-compile_args").value;
    config["tools"]["cocotb"]["compile_args"] = element_value
    element_value = document.getElementById("tools-cocotb-run_args").value;
    config["tools"]["cocotb"]["run_args"] = element_value
    element_value = document.getElementById("tools-cocotb-plusargs").value;
    config["tools"]["cocotb"]["plusargs"] = element_value
    config["tools"]["diamond"] = {}
    element_value = document.getElementById("tools-diamond-installation_path").value;
    config["tools"]["diamond"]["installation_path"] = element_value
    element_value = document.getElementById("tools-diamond-part").value;
    config["tools"]["diamond"]["part"] = element_value
    config["tools"]["ghdl"] = {}
    element_value = document.getElementById("tools-ghdl-installation_path").value;
    config["tools"]["ghdl"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ghdl-waveform").value;
    config["tools"]["ghdl"]["waveform"] = element_value
    element_value = document.getElementById("tools-ghdl-analyze_options").value.split(',');
    config["tools"]["ghdl"]["analyze_options"] = element_value
    element_value = document.getElementById("tools-ghdl-run_options").value.split(',');
    config["tools"]["ghdl"]["run_options"] = element_value
    config["tools"]["icarus"] = {}
    element_value = document.getElementById("tools-icarus-installation_path").value;
    config["tools"]["icarus"]["installation_path"] = element_value
    element_value = document.getElementById("tools-icarus-timescale").value;
    config["tools"]["icarus"]["timescale"] = element_value
    element_value = document.getElementById("tools-icarus-iverilog_options").value.split(',');
    config["tools"]["icarus"]["iverilog_options"] = element_value
    config["tools"]["icestorm"] = {}
    element_value = document.getElementById("tools-icestorm-installation_path").value;
    config["tools"]["icestorm"]["installation_path"] = element_value
    element_value = document.getElementById("tools-icestorm-pnr").value;
    config["tools"]["icestorm"]["pnr"] = element_value
    element_value = document.getElementById("tools-icestorm-arch").value;
    config["tools"]["icestorm"]["arch"] = element_value
    element_value = document.getElementById("tools-icestorm-output_format").value;
    config["tools"]["icestorm"]["output_format"] = element_value
    element_value = document.getElementById("tools-icestorm-yosys_as_subtool").checked;
    config["tools"]["icestorm"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-icestorm-makefile_name").value;
    config["tools"]["icestorm"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-icestorm-arachne_pnr_options").value.split(',');
    config["tools"]["icestorm"]["arachne_pnr_options"] = element_value
    element_value = document.getElementById("tools-icestorm-nextpnr_options").value.split(',');
    config["tools"]["icestorm"]["nextpnr_options"] = element_value
    element_value = document.getElementById("tools-icestorm-yosys_synth_options").value.split(',');
    config["tools"]["icestorm"]["yosys_synth_options"] = element_value
    config["tools"]["ise"] = {}
    element_value = document.getElementById("tools-ise-installation_path").value;
    config["tools"]["ise"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ise-family").value;
    config["tools"]["ise"]["family"] = element_value
    element_value = document.getElementById("tools-ise-device").value;
    config["tools"]["ise"]["device"] = element_value
    element_value = document.getElementById("tools-ise-package").value;
    config["tools"]["ise"]["package"] = element_value
    element_value = document.getElementById("tools-ise-speed").value;
    config["tools"]["ise"]["speed"] = element_value
    config["tools"]["isem"] = {}
    element_value = document.getElementById("tools-isem-installation_path").value;
    config["tools"]["isem"]["installation_path"] = element_value
    element_value = document.getElementById("tools-isem-fuse_options").value.split(',');
    config["tools"]["isem"]["fuse_options"] = element_value
    element_value = document.getElementById("tools-isem-isim_options").value.split(',');
    config["tools"]["isem"]["isim_options"] = element_value
    config["tools"]["modelsim"] = {}
    element_value = document.getElementById("tools-modelsim-installation_path").value;
    config["tools"]["modelsim"]["installation_path"] = element_value
    element_value = document.getElementById("tools-modelsim-vcom_options").value.split(',');
    config["tools"]["modelsim"]["vcom_options"] = element_value
    element_value = document.getElementById("tools-modelsim-vlog_options").value.split(',');
    config["tools"]["modelsim"]["vlog_options"] = element_value
    element_value = document.getElementById("tools-modelsim-vsim_options").value.split(',');
    config["tools"]["modelsim"]["vsim_options"] = element_value
    config["tools"]["morty"] = {}
    element_value = document.getElementById("tools-morty-installation_path").value;
    config["tools"]["morty"]["installation_path"] = element_value
    element_value = document.getElementById("tools-morty-morty_options").value.split(',');
    config["tools"]["morty"]["morty_options"] = element_value
    config["tools"]["quartus"] = {}
    element_value = document.getElementById("tools-quartus-installation_path").value;
    config["tools"]["quartus"]["installation_path"] = element_value
    element_value = document.getElementById("tools-quartus-family").value;
    config["tools"]["quartus"]["family"] = element_value
    element_value = document.getElementById("tools-quartus-device").value;
    config["tools"]["quartus"]["device"] = element_value
    element_value = document.getElementById("tools-quartus-cable").value;
    config["tools"]["quartus"]["cable"] = element_value
    element_value = document.getElementById("tools-quartus-board_device_index").value;
    config["tools"]["quartus"]["board_device_index"] = element_value
    element_value = document.getElementById("tools-quartus-pnr").value;
    config["tools"]["quartus"]["pnr"] = element_value
    element_value = document.getElementById("tools-quartus-dse_options").value.split(',');
    config["tools"]["quartus"]["dse_options"] = element_value
    element_value = document.getElementById("tools-quartus-quartus_options").value.split(',');
    config["tools"]["quartus"]["quartus_options"] = element_value
    config["tools"]["radiant"] = {}
    element_value = document.getElementById("tools-radiant-installation_path").value;
    config["tools"]["radiant"]["installation_path"] = element_value
    element_value = document.getElementById("tools-radiant-part").value;
    config["tools"]["radiant"]["part"] = element_value
    config["tools"]["rivierapro"] = {}
    element_value = document.getElementById("tools-rivierapro-installation_path").value;
    config["tools"]["rivierapro"]["installation_path"] = element_value
    element_value = document.getElementById("tools-rivierapro-compilation_mode").value;
    config["tools"]["rivierapro"]["compilation_mode"] = element_value
    element_value = document.getElementById("tools-rivierapro-vlog_options").value.split(',');
    config["tools"]["rivierapro"]["vlog_options"] = element_value
    element_value = document.getElementById("tools-rivierapro-vsim_options").value.split(',');
    config["tools"]["rivierapro"]["vsim_options"] = element_value
    config["tools"]["siliconcompiler"] = {}
    element_value = document.getElementById("tools-siliconcompiler-installation_path").value;
    config["tools"]["siliconcompiler"]["installation_path"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-target").value;
    config["tools"]["siliconcompiler"]["target"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_enable").checked;
    config["tools"]["siliconcompiler"]["server_enable"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_address").value;
    config["tools"]["siliconcompiler"]["server_address"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_username").value;
    config["tools"]["siliconcompiler"]["server_username"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_password").value;
    config["tools"]["siliconcompiler"]["server_password"] = element_value
    config["tools"]["spyglass"] = {}
    element_value = document.getElementById("tools-spyglass-installation_path").value;
    config["tools"]["spyglass"]["installation_path"] = element_value
    element_value = document.getElementById("tools-spyglass-methodology").value;
    config["tools"]["spyglass"]["methodology"] = element_value
    element_value = document.getElementById("tools-spyglass-goals").value.split(',');
    config["tools"]["spyglass"]["goals"] = element_value
    element_value = document.getElementById("tools-spyglass-spyglass_options").value.split(',');
    config["tools"]["spyglass"]["spyglass_options"] = element_value
    element_value = document.getElementById("tools-spyglass-rule_parameters").value.split(',');
    config["tools"]["spyglass"]["rule_parameters"] = element_value
    config["tools"]["symbiyosys"] = {}
    element_value = document.getElementById("tools-symbiyosys-installation_path").value;
    config["tools"]["symbiyosys"]["installation_path"] = element_value
    element_value = document.getElementById("tools-symbiyosys-tasknames").value.split(',');
    config["tools"]["symbiyosys"]["tasknames"] = element_value
    config["tools"]["symbiflow"] = {}
    element_value = document.getElementById("tools-symbiflow-installation_path").value;
    config["tools"]["symbiflow"]["installation_path"] = element_value
    element_value = document.getElementById("tools-symbiflow-package").value;
    config["tools"]["symbiflow"]["package"] = element_value
    element_value = document.getElementById("tools-symbiflow-part").value;
    config["tools"]["symbiflow"]["part"] = element_value
    element_value = document.getElementById("tools-symbiflow-vendor").value;
    config["tools"]["symbiflow"]["vendor"] = element_value
    element_value = document.getElementById("tools-symbiflow-pnr").value;
    config["tools"]["symbiflow"]["pnr"] = element_value
    element_value = document.getElementById("tools-symbiflow-vpr_options").value;
    config["tools"]["symbiflow"]["vpr_options"] = element_value
    element_value = document.getElementById("tools-symbiflow-environment_script").value;
    config["tools"]["symbiflow"]["environment_script"] = element_value
    config["tools"]["trellis"] = {}
    element_value = document.getElementById("tools-trellis-installation_path").value;
    config["tools"]["trellis"]["installation_path"] = element_value
    element_value = document.getElementById("tools-trellis-arch").value;
    config["tools"]["trellis"]["arch"] = element_value
    element_value = document.getElementById("tools-trellis-output_format").value;
    config["tools"]["trellis"]["output_format"] = element_value
    element_value = document.getElementById("tools-trellis-yosys_as_subtool").checked;
    config["tools"]["trellis"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-trellis-makefile_name").value;
    config["tools"]["trellis"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-trellis-script_name").value;
    config["tools"]["trellis"]["script_name"] = element_value
    element_value = document.getElementById("tools-trellis-nextpnr_options").value.split(',');
    config["tools"]["trellis"]["nextpnr_options"] = element_value
    element_value = document.getElementById("tools-trellis-yosys_synth_options").value.split(',');
    config["tools"]["trellis"]["yosys_synth_options"] = element_value
    config["tools"]["vcs"] = {}
    element_value = document.getElementById("tools-vcs-installation_path").value;
    config["tools"]["vcs"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vcs-vcs_options").value.split(',');
    config["tools"]["vcs"]["vcs_options"] = element_value
    element_value = document.getElementById("tools-vcs-run_options").value.split(',');
    config["tools"]["vcs"]["run_options"] = element_value
    config["tools"]["verible"] = {}
    element_value = document.getElementById("tools-verible-installation_path").value;
    config["tools"]["verible"]["installation_path"] = element_value
    config["tools"]["verilator"] = {}
    element_value = document.getElementById("tools-verilator-installation_path").value;
    config["tools"]["verilator"]["installation_path"] = element_value
    element_value = document.getElementById("tools-verilator-mode").value;
    config["tools"]["verilator"]["mode"] = element_value
    element_value = document.getElementById("tools-verilator-libs").value.split(',');
    config["tools"]["verilator"]["libs"] = element_value
    element_value = document.getElementById("tools-verilator-verilator_options").value.split(',');
    config["tools"]["verilator"]["verilator_options"] = element_value
    element_value = document.getElementById("tools-verilator-make_options").value.split(',');
    config["tools"]["verilator"]["make_options"] = element_value
    element_value = document.getElementById("tools-verilator-run_options").value.split(',');
    config["tools"]["verilator"]["run_options"] = element_value
    config["tools"]["vivado"] = {}
    element_value = document.getElementById("tools-vivado-installation_path").value;
    config["tools"]["vivado"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vivado-part").value;
    config["tools"]["vivado"]["part"] = element_value
    element_value = document.getElementById("tools-vivado-synth").value;
    config["tools"]["vivado"]["synth"] = element_value
    element_value = document.getElementById("tools-vivado-pnr").value;
    config["tools"]["vivado"]["pnr"] = element_value
    element_value = parseInt(document.getElementById("tools-vivado-jtag_freq").value, 10);
    config["tools"]["vivado"]["jtag_freq"] = element_value
    element_value = document.getElementById("tools-vivado-hw_target").value;
    config["tools"]["vivado"]["hw_target"] = element_value
    config["tools"]["vunit"] = {}
    element_value = document.getElementById("tools-vunit-installation_path").value;
    config["tools"]["vunit"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vunit-simulator_name").value;
    config["tools"]["vunit"]["simulator_name"] = element_value
    element_value = document.getElementById("tools-vunit-runpy_mode").value;
    config["tools"]["vunit"]["runpy_mode"] = element_value
    element_value = document.getElementById("tools-vunit-extra_options").value.split(',');
    config["tools"]["vunit"]["extra_options"] = element_value
    element_value = document.getElementById("tools-vunit-enable_array_util_lib").checked;
    config["tools"]["vunit"]["enable_array_util_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_com_lib").checked;
    config["tools"]["vunit"]["enable_com_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_json4vhdl_lib").checked;
    config["tools"]["vunit"]["enable_json4vhdl_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_osvvm_lib").checked;
    config["tools"]["vunit"]["enable_osvvm_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_random_lib").checked;
    config["tools"]["vunit"]["enable_random_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_verification_components_lib").checked;
    config["tools"]["vunit"]["enable_verification_components_lib"] = element_value
    config["tools"]["xcelium"] = {}
    element_value = document.getElementById("tools-xcelium-installation_path").value;
    config["tools"]["xcelium"]["installation_path"] = element_value
    element_value = document.getElementById("tools-xcelium-xmvhdl_options").value.split(',');
    config["tools"]["xcelium"]["xmvhdl_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xmvlog_options").value.split(',');
    config["tools"]["xcelium"]["xmvlog_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xmsim_options").value.split(',');
    config["tools"]["xcelium"]["xmsim_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xrun_options").value.split(',');
    config["tools"]["xcelium"]["xrun_options"] = element_value
    config["tools"]["xsim"] = {}
    element_value = document.getElementById("tools-xsim-installation_path").value;
    config["tools"]["xsim"]["installation_path"] = element_value
    element_value = document.getElementById("tools-xsim-xelab_options").value.split(',');
    config["tools"]["xsim"]["xelab_options"] = element_value
    element_value = document.getElementById("tools-xsim-xsim_options").value.split(',');
    config["tools"]["xsim"]["xsim_options"] = element_value
    config["tools"]["yosys"] = {}
    element_value = document.getElementById("tools-yosys-installation_path").value;
    config["tools"]["yosys"]["installation_path"] = element_value
    element_value = document.getElementById("tools-yosys-arch").value;
    config["tools"]["yosys"]["arch"] = element_value
    element_value = document.getElementById("tools-yosys-output_format").value;
    config["tools"]["yosys"]["output_format"] = element_value
    element_value = document.getElementById("tools-yosys-yosys_as_subtool").checked;
    config["tools"]["yosys"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-yosys-makefile_name").value;
    config["tools"]["yosys"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-yosys-script_name").value;
    config["tools"]["yosys"]["script_name"] = element_value
    element_value = document.getElementById("tools-yosys-yosys_synth_options").value.split(',');
    config["tools"]["yosys"]["yosys_synth_options"] = element_value
    config["tools"]["openfpga"] = {}
    element_value = document.getElementById("tools-openfpga-installation_path").value;
    config["tools"]["openfpga"]["installation_path"] = element_value
    element_value = document.getElementById("tools-openfpga-arch").value;
    config["tools"]["openfpga"]["arch"] = element_value
    element_value = document.getElementById("tools-openfpga-output_format").value;
    config["tools"]["openfpga"]["output_format"] = element_value
    element_value = document.getElementById("tools-openfpga-yosys_as_subtool").checked;
    config["tools"]["openfpga"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-openfpga-makefile_name").value;
    config["tools"]["openfpga"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-openfpga-script_name").value;
    config["tools"]["openfpga"]["script_name"] = element_value
    element_value = document.getElementById("tools-openfpga-yosys_synth_options").value.split(',');
    config["tools"]["openfpga"]["yosys_synth_options"] = element_value
    config["tools"]["activehdl"] = {}
    element_value = document.getElementById("tools-activehdl-installation_path").value;
    config["tools"]["activehdl"]["installation_path"] = element_value
    config["tools"]["nvc"] = {}
    element_value = document.getElementById("tools-nvc-installation_path").value;
    config["tools"]["nvc"]["installation_path"] = element_value
    config["tools"]["questa"] = {}
    element_value = document.getElementById("tools-questa-installation_path").value;
    config["tools"]["questa"]["installation_path"] = element_value
    config["tools"]["raptor"] = {}
    element_value = document.getElementById("tools-raptor-installation_path").value;
    config["tools"]["raptor"]["installation_path"] = element_value
    element_value = document.getElementById("tools-raptor-target_device").value;
    config["tools"]["raptor"]["target_device"] = element_value
    element_value = document.getElementById("tools-raptor-vhdl_version").value;
    config["tools"]["raptor"]["vhdl_version"] = element_value
    element_value = document.getElementById("tools-raptor-verilog_version").value;
    config["tools"]["raptor"]["verilog_version"] = element_value
    element_value = document.getElementById("tools-raptor-sv_version").value;
    config["tools"]["raptor"]["sv_version"] = element_value
    config["tools"]["raptor"]["div_0"] = element_value
    element_value = document.getElementById("tools-raptor-optimization").value;
    config["tools"]["raptor"]["optimization"] = element_value
    element_value = document.getElementById("tools-raptor-effort").value;
    config["tools"]["raptor"]["effort"] = element_value
    element_value = document.getElementById("tools-raptor-fsm_encoding").value;
    config["tools"]["raptor"]["fsm_encoding"] = element_value
    element_value = document.getElementById("tools-raptor-carry").value;
    config["tools"]["raptor"]["carry"] = element_value
    element_value = document.getElementById("tools-raptor-pnr_netlist_language").value;
    config["tools"]["raptor"]["pnr_netlist_language"] = element_value
    element_value = parseInt(document.getElementById("tools-raptor-dsp_limit").value, 10);
    config["tools"]["raptor"]["dsp_limit"] = element_value
    element_value = parseInt(document.getElementById("tools-raptor-block_ram_limit").value, 10);
    config["tools"]["raptor"]["block_ram_limit"] = element_value
    element_value = document.getElementById("tools-raptor-fast_synthesis").checked;
    config["tools"]["raptor"]["fast_synthesis"] = element_value
    config["tools"]["raptor"]["div_1"] = element_value
    element_value = document.getElementById("tools-raptor-top_level").value;
    config["tools"]["raptor"]["top_level"] = element_value
    element_value = document.getElementById("tools-raptor-sim_source_list").value.split(',');
    config["tools"]["raptor"]["sim_source_list"] = element_value
    element_value = document.getElementById("tools-raptor-simulate_rtl").checked;
    config["tools"]["raptor"]["simulate_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-waveform_rtl").value;
    config["tools"]["raptor"]["waveform_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-simulator_rtl").value;
    config["tools"]["raptor"]["simulator_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-simulation_options_rtl").value;
    config["tools"]["raptor"]["simulation_options_rtl"] = element_value
    element_value = document.getElementById("tools-raptor-simulate_gate").checked;
    config["tools"]["raptor"]["simulate_gate"] = element_value
    element_value = document.getElementById("tools-raptor-waveform_gate").value;
    config["tools"]["raptor"]["waveform_gate"] = element_value
    element_value = document.getElementById("tools-raptor-simulator_gate").value;
    config["tools"]["raptor"]["simulator_gate"] = element_value
    element_value = document.getElementById("tools-raptor-simulation_options_gate").value;
    config["tools"]["raptor"]["simulation_options_gate"] = element_value
    element_value = document.getElementById("tools-raptor-simulate_pnr").checked;
    config["tools"]["raptor"]["simulate_pnr"] = element_value
    element_value = document.getElementById("tools-raptor-waveform_pnr").value;
    config["tools"]["raptor"]["waveform_pnr"] = element_value
    element_value = document.getElementById("tools-raptor-simulator_pnr").value;
    config["tools"]["raptor"]["simulator_pnr"] = element_value
    element_value = document.getElementById("tools-raptor-simulation_options_pnr").value;
    config["tools"]["raptor"]["simulation_options_pnr"] = element_value
    return config;
  }

  function set_config(config){
    document.getElementById("general-general-logging").checked = config["general"]["general"]["logging"];
    document.getElementById("general-general-pypath").value = config["general"]["general"]["pypath"];
    document.getElementById("general-general-go_to_definition_vhdl").checked = config["general"]["general"]["go_to_definition_vhdl"];
    document.getElementById("general-general-go_to_definition_verilog").checked = config["general"]["general"]["go_to_definition_verilog"];
    document.getElementById("general-general-developer_mode").checked = config["general"]["general"]["developer_mode"];
    document.getElementById("documentation-general-language").value = config["documentation"]["general"]["language"];
    document.getElementById("documentation-general-symbol_vhdl").value = config["documentation"]["general"]["symbol_vhdl"];
    document.getElementById("documentation-general-symbol_verilog").value = config["documentation"]["general"]["symbol_verilog"];
    document.getElementById("documentation-general-dependency_graph").checked = config["documentation"]["general"]["dependency_graph"];
    document.getElementById("documentation-general-self_contained").checked = config["documentation"]["general"]["self_contained"];
    document.getElementById("documentation-general-fsm").checked = config["documentation"]["general"]["fsm"];
    document.getElementById("documentation-general-ports").value = config["documentation"]["general"]["ports"];
    document.getElementById("documentation-general-generics").value = config["documentation"]["general"]["generics"];
    document.getElementById("documentation-general-instantiations").value = config["documentation"]["general"]["instantiations"];
    document.getElementById("documentation-general-signals").value = config["documentation"]["general"]["signals"];
    document.getElementById("documentation-general-constants").value = config["documentation"]["general"]["constants"];
    document.getElementById("documentation-general-types").value = config["documentation"]["general"]["types"];
    document.getElementById("documentation-general-process").value = config["documentation"]["general"]["process"];
    document.getElementById("documentation-general-functions").value = config["documentation"]["general"]["functions"];
    document.getElementById("documentation-general-magic_config_path").value = config["documentation"]["general"]["magic_config_path"];
    document.getElementById("editor-general-stutter_comment_shortcuts").checked = config["editor"]["general"]["stutter_comment_shortcuts"];
    document.getElementById("editor-general-stutter_block_width").value = config["editor"]["general"]["stutter_block_width"];
    document.getElementById("editor-general-stutter_max_width").value = config["editor"]["general"]["stutter_max_width"];
    document.getElementById("editor-general-stutter_delimiters").checked = config["editor"]["general"]["stutter_delimiters"];
    document.getElementById("editor-general-stutter_bracket_shortcuts").checked = config["editor"]["general"]["stutter_bracket_shortcuts"];
    document.getElementById("formatter-general-formatter_verilog").value = config["formatter"]["general"]["formatter_verilog"];
    document.getElementById("formatter-general-formatter_vhdl").value = config["formatter"]["general"]["formatter_vhdl"];
    document.getElementById("formatter-istyle-style").value = config["formatter"]["istyle"]["style"];
    document.getElementById("formatter-istyle-indentation_size").value = config["formatter"]["istyle"]["indentation_size"];
    document.getElementById("formatter-s3sv-one_bind_per_line").checked = config["formatter"]["s3sv"]["one_bind_per_line"];
    document.getElementById("formatter-s3sv-one_declaration_per_line").checked = config["formatter"]["s3sv"]["one_declaration_per_line"];
    document.getElementById("formatter-s3sv-use_tabs").checked = config["formatter"]["s3sv"]["use_tabs"];
    document.getElementById("formatter-s3sv-indentation_size").value = config["formatter"]["s3sv"]["indentation_size"];
    document.getElementById("formatter-verible-format_args").value = config["formatter"]["verible"]["format_args"];
    document.getElementById("formatter-standalone-keyword_case").value = config["formatter"]["standalone"]["keyword_case"];
    document.getElementById("formatter-standalone-name_case").value = config["formatter"]["standalone"]["name_case"];
    document.getElementById("formatter-standalone-indentation").value = config["formatter"]["standalone"]["indentation"];
    document.getElementById("formatter-standalone-align_port_generic").checked = config["formatter"]["standalone"]["align_port_generic"];
    document.getElementById("formatter-standalone-align_comment").checked = config["formatter"]["standalone"]["align_comment"];
    document.getElementById("formatter-standalone-remove_comments").checked = config["formatter"]["standalone"]["remove_comments"];
    document.getElementById("formatter-standalone-remove_reports").checked = config["formatter"]["standalone"]["remove_reports"];
    document.getElementById("formatter-standalone-check_alias").checked = config["formatter"]["standalone"]["check_alias"];
    document.getElementById("formatter-standalone-new_line_after_then").value = config["formatter"]["standalone"]["new_line_after_then"];
    document.getElementById("formatter-standalone-new_line_after_semicolon").value = config["formatter"]["standalone"]["new_line_after_semicolon"];
    document.getElementById("formatter-standalone-new_line_after_else").value = config["formatter"]["standalone"]["new_line_after_else"];
    document.getElementById("formatter-standalone-new_line_after_port").value = config["formatter"]["standalone"]["new_line_after_port"];
    document.getElementById("formatter-standalone-new_line_after_generic").value = config["formatter"]["standalone"]["new_line_after_generic"];
    document.getElementById("formatter-svg-configuration").value = config["formatter"]["svg"]["configuration"];
    document.getElementById("formatter-svg-core_number").value = config["formatter"]["svg"]["core_number"];
    document.getElementById("formatter-svg-aditional_arguments").value = config["formatter"]["svg"]["aditional_arguments"];
    document.getElementById("linter-general-linter_vhdl").value = config["linter"]["general"]["linter_vhdl"];
    document.getElementById("linter-general-linter_verilog").value = config["linter"]["general"]["linter_verilog"];
    document.getElementById("linter-general-lstyle_verilog").value = config["linter"]["general"]["lstyle_verilog"];
    document.getElementById("linter-general-lstyle_vhdl").value = config["linter"]["general"]["lstyle_vhdl"];
    document.getElementById("linter-ghdl-arguments").value = config["linter"]["ghdl"]["arguments"];
    document.getElementById("linter-icarus-arguments").value = config["linter"]["icarus"]["arguments"];
    document.getElementById("linter-modelsim-vhdl_arguments").value = config["linter"]["modelsim"]["vhdl_arguments"];
    document.getElementById("linter-modelsim-verilog_arguments").value = config["linter"]["modelsim"]["verilog_arguments"];
    document.getElementById("linter-verible-arguments").value = config["linter"]["verible"]["arguments"];
    document.getElementById("linter-verilator-arguments").value = config["linter"]["verilator"]["arguments"];
    document.getElementById("linter-vivado-vhdl_arguments").value = config["linter"]["vivado"]["vhdl_arguments"];
    document.getElementById("linter-vivado-verilog_arguments").value = config["linter"]["vivado"]["verilog_arguments"];
    document.getElementById("linter-vsg-arguments").value = config["linter"]["vsg"]["arguments"];
    document.getElementById("schematic-general-backend").value = config["schematic"]["general"]["backend"];
    document.getElementById("schematic-general-extra").value = config["schematic"]["general"]["extra"];
    document.getElementById("schematic-general-args").value = config["schematic"]["general"]["args"];
    document.getElementById("templates-general-header_file_path").value = config["templates"]["general"]["header_file_path"];
    document.getElementById("templates-general-indent").value = config["templates"]["general"]["indent"];
    document.getElementById("templates-general-clock_generation_style").value = config["templates"]["general"]["clock_generation_style"];
    document.getElementById("templates-general-instance_style").value = config["templates"]["general"]["instance_style"];
    document.getElementById("tools-general-select_tool").value = config["tools"]["general"]["select_tool"];
    document.getElementById("tools-general-gtkwave_installation_path").value = config["tools"]["general"]["gtkwave_installation_path"];
    document.getElementById("tools-general-execution_mode").value = config["tools"]["general"]["execution_mode"];
    document.getElementById("tools-general-waveform_viewer").value = config["tools"]["general"]["waveform_viewer"];
    document.getElementById("tools-osvvm-installation_path").value = config["tools"]["osvvm"]["installation_path"];
    document.getElementById("tools-osvvm-tclsh_binary").value = config["tools"]["osvvm"]["tclsh_binary"];
    document.getElementById("tools-osvvm-simulator_name").value = config["tools"]["osvvm"]["simulator_name"];
    document.getElementById("tools-ascenlint-installation_path").value = config["tools"]["ascenlint"]["installation_path"];
    element_value = document.getElementById("tools-ascenlint-ascentlint_options").value = String(config["tools"]["ascenlint"]["ascentlint_options"]);
    document.getElementById("tools-cocotb-installation_path").value = config["tools"]["cocotb"]["installation_path"];
    document.getElementById("tools-cocotb-simulator_name").value = config["tools"]["cocotb"]["simulator_name"];
    document.getElementById("tools-cocotb-compile_args").value = config["tools"]["cocotb"]["compile_args"];
    document.getElementById("tools-cocotb-run_args").value = config["tools"]["cocotb"]["run_args"];
    document.getElementById("tools-cocotb-plusargs").value = config["tools"]["cocotb"]["plusargs"];
    document.getElementById("tools-diamond-installation_path").value = config["tools"]["diamond"]["installation_path"];
    document.getElementById("tools-diamond-part").value = config["tools"]["diamond"]["part"];
    document.getElementById("tools-ghdl-installation_path").value = config["tools"]["ghdl"]["installation_path"];
    document.getElementById("tools-ghdl-waveform").value = config["tools"]["ghdl"]["waveform"];
    element_value = document.getElementById("tools-ghdl-analyze_options").value = String(config["tools"]["ghdl"]["analyze_options"]);
    element_value = document.getElementById("tools-ghdl-run_options").value = String(config["tools"]["ghdl"]["run_options"]);
    document.getElementById("tools-icarus-installation_path").value = config["tools"]["icarus"]["installation_path"];
    document.getElementById("tools-icarus-timescale").value = config["tools"]["icarus"]["timescale"];
    element_value = document.getElementById("tools-icarus-iverilog_options").value = String(config["tools"]["icarus"]["iverilog_options"]);
    document.getElementById("tools-icestorm-installation_path").value = config["tools"]["icestorm"]["installation_path"];
    document.getElementById("tools-icestorm-pnr").value = config["tools"]["icestorm"]["pnr"];
    document.getElementById("tools-icestorm-arch").value = config["tools"]["icestorm"]["arch"];
    document.getElementById("tools-icestorm-output_format").value = config["tools"]["icestorm"]["output_format"];
    document.getElementById("tools-icestorm-yosys_as_subtool").checked = config["tools"]["icestorm"]["yosys_as_subtool"];
    document.getElementById("tools-icestorm-makefile_name").value = config["tools"]["icestorm"]["makefile_name"];
    element_value = document.getElementById("tools-icestorm-arachne_pnr_options").value = String(config["tools"]["icestorm"]["arachne_pnr_options"]);
    element_value = document.getElementById("tools-icestorm-nextpnr_options").value = String(config["tools"]["icestorm"]["nextpnr_options"]);
    element_value = document.getElementById("tools-icestorm-yosys_synth_options").value = String(config["tools"]["icestorm"]["yosys_synth_options"]);
    document.getElementById("tools-ise-installation_path").value = config["tools"]["ise"]["installation_path"];
    document.getElementById("tools-ise-family").value = config["tools"]["ise"]["family"];
    document.getElementById("tools-ise-device").value = config["tools"]["ise"]["device"];
    document.getElementById("tools-ise-package").value = config["tools"]["ise"]["package"];
    document.getElementById("tools-ise-speed").value = config["tools"]["ise"]["speed"];
    document.getElementById("tools-isem-installation_path").value = config["tools"]["isem"]["installation_path"];
    element_value = document.getElementById("tools-isem-fuse_options").value = String(config["tools"]["isem"]["fuse_options"]);
    element_value = document.getElementById("tools-isem-isim_options").value = String(config["tools"]["isem"]["isim_options"]);
    document.getElementById("tools-modelsim-installation_path").value = config["tools"]["modelsim"]["installation_path"];
    element_value = document.getElementById("tools-modelsim-vcom_options").value = String(config["tools"]["modelsim"]["vcom_options"]);
    element_value = document.getElementById("tools-modelsim-vlog_options").value = String(config["tools"]["modelsim"]["vlog_options"]);
    element_value = document.getElementById("tools-modelsim-vsim_options").value = String(config["tools"]["modelsim"]["vsim_options"]);
    document.getElementById("tools-morty-installation_path").value = config["tools"]["morty"]["installation_path"];
    element_value = document.getElementById("tools-morty-morty_options").value = String(config["tools"]["morty"]["morty_options"]);
    document.getElementById("tools-quartus-installation_path").value = config["tools"]["quartus"]["installation_path"];
    document.getElementById("tools-quartus-family").value = config["tools"]["quartus"]["family"];
    document.getElementById("tools-quartus-device").value = config["tools"]["quartus"]["device"];
    document.getElementById("tools-quartus-cable").value = config["tools"]["quartus"]["cable"];
    document.getElementById("tools-quartus-board_device_index").value = config["tools"]["quartus"]["board_device_index"];
    document.getElementById("tools-quartus-pnr").value = config["tools"]["quartus"]["pnr"];
    element_value = document.getElementById("tools-quartus-dse_options").value = String(config["tools"]["quartus"]["dse_options"]);
    element_value = document.getElementById("tools-quartus-quartus_options").value = String(config["tools"]["quartus"]["quartus_options"]);
    document.getElementById("tools-radiant-installation_path").value = config["tools"]["radiant"]["installation_path"];
    document.getElementById("tools-radiant-part").value = config["tools"]["radiant"]["part"];
    document.getElementById("tools-rivierapro-installation_path").value = config["tools"]["rivierapro"]["installation_path"];
    document.getElementById("tools-rivierapro-compilation_mode").value = config["tools"]["rivierapro"]["compilation_mode"];
    element_value = document.getElementById("tools-rivierapro-vlog_options").value = String(config["tools"]["rivierapro"]["vlog_options"]);
    element_value = document.getElementById("tools-rivierapro-vsim_options").value = String(config["tools"]["rivierapro"]["vsim_options"]);
    document.getElementById("tools-siliconcompiler-installation_path").value = config["tools"]["siliconcompiler"]["installation_path"];
    document.getElementById("tools-siliconcompiler-target").value = config["tools"]["siliconcompiler"]["target"];
    document.getElementById("tools-siliconcompiler-server_enable").checked = config["tools"]["siliconcompiler"]["server_enable"];
    document.getElementById("tools-siliconcompiler-server_address").value = config["tools"]["siliconcompiler"]["server_address"];
    document.getElementById("tools-siliconcompiler-server_username").value = config["tools"]["siliconcompiler"]["server_username"];
    document.getElementById("tools-siliconcompiler-server_password").value = config["tools"]["siliconcompiler"]["server_password"];
    document.getElementById("tools-spyglass-installation_path").value = config["tools"]["spyglass"]["installation_path"];
    document.getElementById("tools-spyglass-methodology").value = config["tools"]["spyglass"]["methodology"];
    element_value = document.getElementById("tools-spyglass-goals").value = String(config["tools"]["spyglass"]["goals"]);
    element_value = document.getElementById("tools-spyglass-spyglass_options").value = String(config["tools"]["spyglass"]["spyglass_options"]);
    element_value = document.getElementById("tools-spyglass-rule_parameters").value = String(config["tools"]["spyglass"]["rule_parameters"]);
    document.getElementById("tools-symbiyosys-installation_path").value = config["tools"]["symbiyosys"]["installation_path"];
    element_value = document.getElementById("tools-symbiyosys-tasknames").value = String(config["tools"]["symbiyosys"]["tasknames"]);
    document.getElementById("tools-symbiflow-installation_path").value = config["tools"]["symbiflow"]["installation_path"];
    document.getElementById("tools-symbiflow-package").value = config["tools"]["symbiflow"]["package"];
    document.getElementById("tools-symbiflow-part").value = config["tools"]["symbiflow"]["part"];
    document.getElementById("tools-symbiflow-vendor").value = config["tools"]["symbiflow"]["vendor"];
    document.getElementById("tools-symbiflow-pnr").value = config["tools"]["symbiflow"]["pnr"];
    document.getElementById("tools-symbiflow-vpr_options").value = config["tools"]["symbiflow"]["vpr_options"];
    document.getElementById("tools-symbiflow-environment_script").value = config["tools"]["symbiflow"]["environment_script"];
    document.getElementById("tools-trellis-installation_path").value = config["tools"]["trellis"]["installation_path"];
    document.getElementById("tools-trellis-arch").value = config["tools"]["trellis"]["arch"];
    document.getElementById("tools-trellis-output_format").value = config["tools"]["trellis"]["output_format"];
    document.getElementById("tools-trellis-yosys_as_subtool").checked = config["tools"]["trellis"]["yosys_as_subtool"];
    document.getElementById("tools-trellis-makefile_name").value = config["tools"]["trellis"]["makefile_name"];
    document.getElementById("tools-trellis-script_name").value = config["tools"]["trellis"]["script_name"];
    element_value = document.getElementById("tools-trellis-nextpnr_options").value = String(config["tools"]["trellis"]["nextpnr_options"]);
    element_value = document.getElementById("tools-trellis-yosys_synth_options").value = String(config["tools"]["trellis"]["yosys_synth_options"]);
    document.getElementById("tools-vcs-installation_path").value = config["tools"]["vcs"]["installation_path"];
    element_value = document.getElementById("tools-vcs-vcs_options").value = String(config["tools"]["vcs"]["vcs_options"]);
    element_value = document.getElementById("tools-vcs-run_options").value = String(config["tools"]["vcs"]["run_options"]);
    document.getElementById("tools-verible-installation_path").value = config["tools"]["verible"]["installation_path"];
    document.getElementById("tools-verilator-installation_path").value = config["tools"]["verilator"]["installation_path"];
    document.getElementById("tools-verilator-mode").value = config["tools"]["verilator"]["mode"];
    element_value = document.getElementById("tools-verilator-libs").value = String(config["tools"]["verilator"]["libs"]);
    element_value = document.getElementById("tools-verilator-verilator_options").value = String(config["tools"]["verilator"]["verilator_options"]);
    element_value = document.getElementById("tools-verilator-make_options").value = String(config["tools"]["verilator"]["make_options"]);
    element_value = document.getElementById("tools-verilator-run_options").value = String(config["tools"]["verilator"]["run_options"]);
    document.getElementById("tools-vivado-installation_path").value = config["tools"]["vivado"]["installation_path"];
    document.getElementById("tools-vivado-part").value = config["tools"]["vivado"]["part"];
    document.getElementById("tools-vivado-synth").value = config["tools"]["vivado"]["synth"];
    document.getElementById("tools-vivado-pnr").value = config["tools"]["vivado"]["pnr"];
    document.getElementById("tools-vivado-jtag_freq").value = config["tools"]["vivado"]["jtag_freq"];
    document.getElementById("tools-vivado-hw_target").value = config["tools"]["vivado"]["hw_target"];
    document.getElementById("tools-vunit-installation_path").value = config["tools"]["vunit"]["installation_path"];
    document.getElementById("tools-vunit-simulator_name").value = config["tools"]["vunit"]["simulator_name"];
    document.getElementById("tools-vunit-runpy_mode").value = config["tools"]["vunit"]["runpy_mode"];
    element_value = document.getElementById("tools-vunit-extra_options").value = String(config["tools"]["vunit"]["extra_options"]);
    document.getElementById("tools-vunit-enable_array_util_lib").checked = config["tools"]["vunit"]["enable_array_util_lib"];
    document.getElementById("tools-vunit-enable_com_lib").checked = config["tools"]["vunit"]["enable_com_lib"];
    document.getElementById("tools-vunit-enable_json4vhdl_lib").checked = config["tools"]["vunit"]["enable_json4vhdl_lib"];
    document.getElementById("tools-vunit-enable_osvvm_lib").checked = config["tools"]["vunit"]["enable_osvvm_lib"];
    document.getElementById("tools-vunit-enable_random_lib").checked = config["tools"]["vunit"]["enable_random_lib"];
    document.getElementById("tools-vunit-enable_verification_components_lib").checked = config["tools"]["vunit"]["enable_verification_components_lib"];
    document.getElementById("tools-xcelium-installation_path").value = config["tools"]["xcelium"]["installation_path"];
    element_value = document.getElementById("tools-xcelium-xmvhdl_options").value = String(config["tools"]["xcelium"]["xmvhdl_options"]);
    element_value = document.getElementById("tools-xcelium-xmvlog_options").value = String(config["tools"]["xcelium"]["xmvlog_options"]);
    element_value = document.getElementById("tools-xcelium-xmsim_options").value = String(config["tools"]["xcelium"]["xmsim_options"]);
    element_value = document.getElementById("tools-xcelium-xrun_options").value = String(config["tools"]["xcelium"]["xrun_options"]);
    document.getElementById("tools-xsim-installation_path").value = config["tools"]["xsim"]["installation_path"];
    element_value = document.getElementById("tools-xsim-xelab_options").value = String(config["tools"]["xsim"]["xelab_options"]);
    element_value = document.getElementById("tools-xsim-xsim_options").value = String(config["tools"]["xsim"]["xsim_options"]);
    document.getElementById("tools-yosys-installation_path").value = config["tools"]["yosys"]["installation_path"];
    document.getElementById("tools-yosys-arch").value = config["tools"]["yosys"]["arch"];
    document.getElementById("tools-yosys-output_format").value = config["tools"]["yosys"]["output_format"];
    document.getElementById("tools-yosys-yosys_as_subtool").checked = config["tools"]["yosys"]["yosys_as_subtool"];
    document.getElementById("tools-yosys-makefile_name").value = config["tools"]["yosys"]["makefile_name"];
    document.getElementById("tools-yosys-script_name").value = config["tools"]["yosys"]["script_name"];
    element_value = document.getElementById("tools-yosys-yosys_synth_options").value = String(config["tools"]["yosys"]["yosys_synth_options"]);
    document.getElementById("tools-openfpga-installation_path").value = config["tools"]["openfpga"]["installation_path"];
    document.getElementById("tools-openfpga-arch").value = config["tools"]["openfpga"]["arch"];
    document.getElementById("tools-openfpga-output_format").value = config["tools"]["openfpga"]["output_format"];
    document.getElementById("tools-openfpga-yosys_as_subtool").checked = config["tools"]["openfpga"]["yosys_as_subtool"];
    document.getElementById("tools-openfpga-makefile_name").value = config["tools"]["openfpga"]["makefile_name"];
    document.getElementById("tools-openfpga-script_name").value = config["tools"]["openfpga"]["script_name"];
    element_value = document.getElementById("tools-openfpga-yosys_synth_options").value = String(config["tools"]["openfpga"]["yosys_synth_options"]);
    document.getElementById("tools-activehdl-installation_path").value = config["tools"]["activehdl"]["installation_path"];
    document.getElementById("tools-nvc-installation_path").value = config["tools"]["nvc"]["installation_path"];
    document.getElementById("tools-questa-installation_path").value = config["tools"]["questa"]["installation_path"];
    document.getElementById("tools-raptor-installation_path").value = config["tools"]["raptor"]["installation_path"];
    document.getElementById("tools-raptor-target_device").value = config["tools"]["raptor"]["target_device"];
    document.getElementById("tools-raptor-vhdl_version").value = config["tools"]["raptor"]["vhdl_version"];
    document.getElementById("tools-raptor-verilog_version").value = config["tools"]["raptor"]["verilog_version"];
    document.getElementById("tools-raptor-sv_version").value = config["tools"]["raptor"]["sv_version"];
    document.getElementById("tools-raptor-optimization").value = config["tools"]["raptor"]["optimization"];
    document.getElementById("tools-raptor-effort").value = config["tools"]["raptor"]["effort"];
    document.getElementById("tools-raptor-fsm_encoding").value = config["tools"]["raptor"]["fsm_encoding"];
    document.getElementById("tools-raptor-carry").value = config["tools"]["raptor"]["carry"];
    document.getElementById("tools-raptor-pnr_netlist_language").value = config["tools"]["raptor"]["pnr_netlist_language"];
    document.getElementById("tools-raptor-dsp_limit").value = config["tools"]["raptor"]["dsp_limit"];
    document.getElementById("tools-raptor-block_ram_limit").value = config["tools"]["raptor"]["block_ram_limit"];
    document.getElementById("tools-raptor-fast_synthesis").checked = config["tools"]["raptor"]["fast_synthesis"];
    document.getElementById("tools-raptor-top_level").value = config["tools"]["raptor"]["top_level"];
    element_value = document.getElementById("tools-raptor-sim_source_list").value = String(config["tools"]["raptor"]["sim_source_list"]);
    document.getElementById("tools-raptor-simulate_rtl").checked = config["tools"]["raptor"]["simulate_rtl"];
    document.getElementById("tools-raptor-waveform_rtl").value = config["tools"]["raptor"]["waveform_rtl"];
    document.getElementById("tools-raptor-simulator_rtl").value = config["tools"]["raptor"]["simulator_rtl"];
    document.getElementById("tools-raptor-simulation_options_rtl").value = config["tools"]["raptor"]["simulation_options_rtl"];
    document.getElementById("tools-raptor-simulate_gate").checked = config["tools"]["raptor"]["simulate_gate"];
    document.getElementById("tools-raptor-waveform_gate").value = config["tools"]["raptor"]["waveform_gate"];
    document.getElementById("tools-raptor-simulator_gate").value = config["tools"]["raptor"]["simulator_gate"];
    document.getElementById("tools-raptor-simulation_options_gate").value = config["tools"]["raptor"]["simulation_options_gate"];
    document.getElementById("tools-raptor-simulate_pnr").checked = config["tools"]["raptor"]["simulate_pnr"];
    document.getElementById("tools-raptor-waveform_pnr").value = config["tools"]["raptor"]["waveform_pnr"];
    document.getElementById("tools-raptor-simulator_pnr").value = config["tools"]["raptor"]["simulator_pnr"];
    document.getElementById("tools-raptor-simulation_options_pnr").value = config["tools"]["raptor"]["simulation_options_pnr"];
  }

  function open_submenu_icon(x) {
    x.classList.toggle("change");
  }
</script>
</body>
</html>
`;