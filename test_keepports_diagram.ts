import { documenter_factory } from "../src/colibri/documenter/factory";
import { HDL_LANG } from "../src/colibri/common/general";
import { Diagram } from "../src/colibri/documenter/diagram";
import * as fs from "fs";
import * as path from "path";

async function test_keepports_diagram() {
    const test_file = path.join(__dirname, "test_keepports_diagram.vhdl");
    const vhdl_code = fs.readFileSync(test_file, "utf8");
    
    console.log("Testing @keepports diagram functionality...");
    
    // Create documenter
    const documenter = documenter_factory(HDL_LANG.VHDL);
    
    // Parse the VHDL code
    const result = await documenter.get_documentation(vhdl_code, {
        language: HDL_LANG.VHDL,
        path: test_file,
        configuration: {
            enable_markdown: true,
            enable_comments: true
        }
    });
    
    console.log("Parsed entities:", result.length);
    
    if (result.length > 0) {
        const entity = result[0];
        console.log("Entity name:", entity.name);
        console.log("Number of ports:", entity.port.length);
        console.log("Virtual buses:", entity.virtual_bus);
        
        // Create diagram
        const diagram = new Diagram();
        const svg_content = diagram.get_entity_as_svg(entity);
        
        // Save diagram to file for visual inspection
        const output_file = path.join(__dirname, "keepports_diagram_test.svg");
        fs.writeFileSync(output_file, svg_content);
        console.log("Diagram saved to:", output_file);
        
        // Check virtual bus properties
        entity.virtual_bus.forEach((vbus, index) => {
            console.log(`Virtual bus ${index + 1}:`);
            console.log(`  Name: ${vbus.name}`);
            console.log(`  Description: ${vbus.description}`);
            console.log(`  Keepports: ${vbus.keepports}`);
            console.log(`  Ports: ${vbus.port_list.map(p => p.name).join(", ")}`);
        });
    }
}

test_keepports_diagram().catch(console.error);