import * as vscode from 'vscode';

type t_numeric_record = Record<string, unknown>;
type t_critical_segment = {
	label: string;
	delay: number | undefined;
};
type t_critical_path = {
	from: string;
	to: string;
	segments: t_critical_segment[];
};
type t_parsed_report = {
	utilization?: t_numeric_record;
	fmax?: t_numeric_record;
	criticalPaths: t_critical_path[];
};

function escapeHtml(value: unknown): string {
	return String(value).replace(/[&<>"']/g, character => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	}[character] as string));
}

function isRecord(value: unknown): value is t_numeric_record {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseCriticalPaths(value: unknown): t_critical_path[] {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.flatMap((pathValue): t_critical_path[] => {
		if (!isRecord(pathValue)) {
			return [];
		}
		const rawSegments = Array.isArray(pathValue.path)
			? pathValue.path
			: Array.isArray(pathValue.segments) ? pathValue.segments : [];
		const segments = rawSegments.flatMap((segment): t_critical_segment[] => {
			if (!isRecord(segment)) {
				return [];
			}
			const delay = typeof segment.delay === 'number' && Number.isFinite(segment.delay)
				? segment.delay
				: undefined;
			const label = [segment.type, segment.name, segment.from, segment.to, segment.net]
				.filter((part): part is string => typeof part === 'string' && part.trim() !== '')
				.join(' · ');
			if (!label && delay === undefined) {
				return [];
			}
			return [{ label: label || 'Segment', delay }];
		});
		if (segments.length === 0) {
			return [];
		}
		return [{
			from: typeof pathValue.from === 'string' ? pathValue.from : '—',
			to: typeof pathValue.to === 'string' ? pathValue.to : '—',
			segments
		}];
	});
}

function parseReport(reportJson: string): t_parsed_report {
	const report: unknown = JSON.parse(reportJson);
	if (!isRecord(report)) {
		throw new Error('The nextpnr report must contain a JSON object.');
	}
	const utilization = isRecord(report.utilisation)
		? report.utilisation
		: isRecord(report.utilization) ? report.utilization : undefined;
	const fmax = isRecord(report.fmax) ? report.fmax : undefined;
	return {
		utilization,
		fmax,
		criticalPaths: parseCriticalPaths(report.critical_paths)
	};
}

function renderUtilization(report: t_parsed_report): string {
	if (!report.utilization) {
		return '<p class="notice">Utilization data is not available in this report.</p>';
	}
	const rows = Object.entries(report.utilization).flatMap(([cellType, rawValue]) => {
		if (!isRecord(rawValue) || typeof rawValue.used !== 'number' ||
			!Number.isFinite(rawValue.used) || typeof rawValue.available !== 'number' ||
			!Number.isFinite(rawValue.available)) {
			return [];
		}
		const percent = rawValue.available > 0 ? Math.max(0, rawValue.used / rawValue.available * 100) : undefined;
		const percentLabel = percent === undefined ? '—' : `${percent.toFixed(1)}%`;
		const barWidth = percent === undefined ? 0 : Math.min(percent, 100);
		return [`<tr><td>${escapeHtml(cellType)}</td><td class="numeric">${rawValue.used}</td>
			<td class="numeric">${rawValue.available}</td><td class="usage">
			<span>${percentLabel}</span><div class="bar"><span style="width:${barWidth.toFixed(1)}%"></span></div></td></tr>`];
	}).join('');
	return rows
		? `<table><thead><tr><th>Cell type</th><th>Used</th><th>Available</th><th>Usage</th></tr></thead><tbody>${rows}</tbody></table>`
		: '<p class="notice">No valid utilization entries were found in this report.</p>';
}

function renderTiming(report: t_parsed_report): string {
	if (!report.fmax) {
		return '<p class="notice">Timing data is not available in this report.</p>';
	}
	const rows = Object.entries(report.fmax).flatMap(([clock, rawValue]) => {
		if (!isRecord(rawValue) || typeof rawValue.achieved !== 'number' ||
			!Number.isFinite(rawValue.achieved) || typeof rawValue.constraint !== 'number' ||
			!Number.isFinite(rawValue.constraint)) {
			return [];
		}
		const meetsConstraint = rawValue.achieved >= rawValue.constraint;
		return [`<tr class="${meetsConstraint ? 'timing-pass' : 'timing-fail'}">
			<td>${escapeHtml(clock)}</td><td class="numeric">${rawValue.achieved.toFixed(2)} MHz</td>
			<td class="numeric">${rawValue.constraint.toFixed(2)} MHz</td>
			<td>${meetsConstraint ? 'Sí' : 'No'}</td></tr>`];
	}).join('');
	return rows
		? `<table><thead><tr><th>Clock</th><th>Achieved Fmax</th><th>Constraint</th><th>Meets constraint</th></tr></thead><tbody>${rows}</tbody></table>`
		: '<p class="notice">No valid timing entries were found in this report.</p>';
}

function renderCriticalPaths(paths: t_critical_path[]): string {
	if (paths.length === 0) {
		return '';
	}
	const rows = paths.flatMap((criticalPath, pathIndex) => criticalPath.segments.map((segment, segmentIndex) => `
		<tr><td>${pathIndex + 1}</td><td>${segmentIndex + 1}</td>
		<td>${escapeHtml(criticalPath.from)}</td><td>${escapeHtml(criticalPath.to)}</td>
		<td>${escapeHtml(segment.label)}</td><td class="numeric">${segment.delay === undefined
			? '—' : `${segment.delay.toFixed(3)} ns`}</td></tr>`)).join('');
	return `<section><h2>Critical paths</h2><table><thead><tr><th>Path</th><th>Segment</th>
		<th>From</th><th>To</th><th>Segment details</th><th>Delay</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

/** Display available nextpnr utilization, timing and critical-path report sections. */
export function showNextpnrReportWebview(
	reportJsonContent: string,
	context: vscode.ExtensionContext
): void {
	let report: t_parsed_report;
	try {
		report = parseReport(reportJsonContent);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage(`Unable to display nextpnr report: ${message}`);
		return;
	}

	const panel = vscode.window.createWebviewPanel(
		'nextpnrReport',
		'nextpnr Utilization & Timing',
		vscode.ViewColumn.One,
		{ enableScripts: false, retainContextWhenHidden: true, localResourceRoots: [context.extensionUri] }
	);
	panel.webview.html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>nextpnr Report</title><style>
body{margin:0;padding:20px;color:var(--vscode-editor-foreground);background:var(--vscode-editor-background);font-family:var(--vscode-font-family);font-size:var(--vscode-font-size)}
.container{max-width:1200px;margin:0 auto}h1,h2{color:var(--vscode-foreground)}section{margin:0 0 30px}
table{width:100%;border-collapse:collapse;margin:12px 0 28px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--vscode-panel-border)}
th{background:var(--vscode-editor-inactiveSelectionBackground);font-weight:600}tr:hover{background:var(--vscode-list-hoverBackground)}
.numeric{text-align:right;font-family:var(--vscode-editor-font-family)}.usage{min-width:140px}.usage>span{display:inline-block;min-width:52px}
.bar{display:inline-block;width:min(140px,60%);height:8px;margin-left:8px;background:var(--vscode-input-background);vertical-align:middle}
.bar span{display:block;height:100%;background:var(--vscode-charts-blue)}.timing-fail{color:var(--vscode-errorForeground);background:var(--vscode-inputValidation-errorBackground)}
.timing-pass td:last-child{color:var(--vscode-testing-iconPassed)}.notice{padding:10px 12px;color:var(--vscode-descriptionForeground);background:var(--vscode-editor-inactiveSelectionBackground);border-left:3px solid var(--vscode-editorWarning-foreground)}
</style></head><body><main class="container"><h1>nextpnr Utilization &amp; Timing</h1>
<section><h2>Utilization</h2>${renderUtilization(report)}</section>
<section><h2>Timing</h2>${renderTiming(report)}</section>
${renderCriticalPaths(report.criticalPaths)}
</main>
</body></html>`;
}