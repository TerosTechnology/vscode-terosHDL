// Test cases for the unordered list feature
import { convert_unordered_lists_to_markdown } from "../../src/colibri/documenter/utils";

describe('Unordered List Conversion Tests', () => {
    
    test('Basic asterisk list conversion', () => {
        const input = `This is a description with a list:
* First item
* Second item
* Third item
End of description.`;
        
        const expected = `This is a description with a list:

* First item
* Second item
* Third item

End of description.`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('Basic dash list conversion', () => {
        const input = `Configuration options:
- Option A
- Option B
- Option C`;
        
        const expected = `Configuration options:

* Option A
* Option B
* Option C`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('Mixed list markers should work', () => {
        const input = `Mixed list:
* Item with asterisk
- Item with dash
* Another asterisk item`;
        
        const expected = `Mixed list:

* Item with asterisk
* Item with dash
* Another asterisk item`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('Single item should not be converted to list', () => {
        const input = `Single item:
* Only one item
Regular text continues.`;
        
        const expected = `Single item:
* Only one item
Regular text continues.`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('Multi-line list items', () => {
        const input = `Complex list:
* First item with continuation
  on the next line
* Second item also spans
  multiple lines
* Third item`;
        
        const expected = `Complex list:

* First item with continuation on the next line
* Second item also spans multiple lines
* Third item`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('Empty lines should terminate list', () => {
        const input = `List with break:
* First item
* Second item

* This starts a new list
* Fourth item`;
        
        const expected = `List with break:

* First item
* Second item


* This starts a new list
* Fourth item`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('No conversion for non-list content', () => {
        const input = `Regular description without lists.
This is just normal text.
No special formatting here.`;
        
        const expected = `Regular description without lists.
This is just normal text.
No special formatting here.`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('Empty or null input', () => {
        expect(convert_unordered_lists_to_markdown("")).toBe("");
        expect(convert_unordered_lists_to_markdown(null as any)).toBe("");
        expect(convert_unordered_lists_to_markdown(undefined as any)).toBe("");
    });
    
    test('List at beginning of text', () => {
        const input = `* First item
* Second item
* Third item
Regular text follows.`;
        
        const expected = `* First item
* Second item
* Third item

Regular text follows.`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
    
    test('List at end of text', () => {
        const input = `Description text here.
Available options:
* Option 1
* Option 2
* Option 3`;
        
        const expected = `Description text here.
Available options:

* Option 1
* Option 2
* Option 3`;
        
        const result = convert_unordered_lists_to_markdown(input);
        expect(result).toBe(expected);
    });
});