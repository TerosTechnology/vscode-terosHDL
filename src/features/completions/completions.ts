import { VhdlAttributeCompletionItemProvider} from './attributes';
import { VhdlLibraryCompletionItemProvider} from './libraries';
import { VhdlStdPackageCompletionItemProvider} from './std_packages';
import * as Output_channel_lib from '../../lib/utils/output_channel';

import * as vscode from 'vscode';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Completions_manager {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, _output_channel: Output_channel_lib.Output_channel){
        context.subscriptions.push(VhdlAttributeCompletionItemProvider);
        context.subscriptions.push(VhdlLibraryCompletionItemProvider);
        context.subscriptions.push(VhdlStdPackageCompletionItemProvider);
    }
}