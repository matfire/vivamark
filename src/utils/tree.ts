import { exists, readDir, stat } from "@tauri-apps/plugin-fs";

export interface FileTreeNode {
	name: string;
	path: string;
	isDirectory: boolean;
	children?: FileTreeNode[];
	size?: number;
	lastModified?: Date;
}

export interface FileTreeOptions {
	includeFiles?: boolean;
	maxDepth?: number;
	includeHidden?: boolean;
	sortBy?: "name" | "size" | "modified";
	sortOrder?: "asc" | "desc";
}

export class FileTreeGenerator {
	private options: Required<FileTreeOptions>;

	constructor(options: FileTreeOptions = {}) {
		this.options = {
			includeFiles: options.includeFiles ?? true,
			maxDepth: options.maxDepth ?? -1,
			includeHidden: options.includeHidden ?? false,
			sortBy: options.sortBy ?? "name",
			sortOrder: options.sortOrder ?? "asc",
		};
	}

	/**
	 * Generate a file tree from the given path
	 */
	async generateFileTree(path: string): Promise<FileTreeNode | null> {
		try {
			// Check if path exists
			if (!(await exists(path))) {
				throw new Error(`Path does not exist: ${path}`);
			}

			// Get stats for the root path
			const rootStats = await stat(path);

			if (!rootStats.isDirectory) {
				throw new Error(`Path is not a directory: ${path}`);
			}

			// Create root node
			const rootNode: FileTreeNode = {
				name: this.getBaseName(path),
				path: path,
				isDirectory: true,
				lastModified: rootStats.mtime ?? undefined,
				children: [],
			};

			// Recursively build the tree
			await this.buildTreeRecursive(rootNode, 0);

			return rootNode;
		} catch (error) {
			console.error("Error generating file tree:", error);
			return null;
		}
	}

	/**
	 * Recursively build the file tree
	 */
	private async buildTreeRecursive(
		node: FileTreeNode,
		currentDepth: number,
	): Promise<void> {
		// Check depth limit
		if (this.options.maxDepth !== -1 && currentDepth >= this.options.maxDepth) {
			return;
		}

		try {
			// Read directory contents
			const entries = await readDir(node.path);
			const children: FileTreeNode[] = [];

			for (const entry of entries) {
				// Skip hidden files/directories if not included
				if (!this.options.includeHidden && entry.name.startsWith(".")) {
					continue;
				}

				const fullPath = this.joinPath(node.path, entry.name);

				try {
					const entryStats = await stat(fullPath);

					// Skip files if not included
					if (!entryStats.isDirectory && !this.options.includeFiles) {
						continue;
					}

					const childNode: FileTreeNode = {
						name: entry.name,
						path: fullPath,
						isDirectory: entryStats.isDirectory,
						size: entryStats.isFile ? entryStats.size : undefined,
						lastModified: entryStats.mtime ?? undefined,
					};

					// Recursively process subdirectories
					if (entryStats.isDirectory) {
						childNode.children = [];
						await this.buildTreeRecursive(childNode, currentDepth + 1);
					}

					children.push(childNode);
				} catch (error) {
					console.warn(`Error processing entry ${fullPath}:`, error);
					// Continue with other entries
				}
			}

			// Sort children based on options
			node.children = this.sortNodes(children);
		} catch (error) {
			console.error(`Error reading directory ${node.path}:`, error);
		}
	}

	/**
	 * Sort nodes based on the specified criteria
	 */
	private sortNodes(nodes: FileTreeNode[]): FileTreeNode[] {
		return nodes.sort((a, b) => {
			// Directories first
			if (a.isDirectory && !b.isDirectory) return -1;
			if (!a.isDirectory && b.isDirectory) return 1;

			let comparison = 0;

			switch (this.options.sortBy) {
				case "name":
					comparison = a.name.localeCompare(b.name);
					break;
				case "size": {
					const sizeA = a.size ?? 0;
					const sizeB = b.size ?? 0;
					comparison = sizeA - sizeB;
					break;
				}
				case "modified": {
					const timeA = a.lastModified?.getTime() ?? 0;
					const timeB = b.lastModified?.getTime() ?? 0;
					comparison = timeA - timeB;
					break;
				}
			}

			return this.options.sortOrder === "desc" ? -comparison : comparison;
		});
	}

	/**
	 * Get the base name from a path
	 */
	private getBaseName(path: string): string {
		return path.split(/[/\\]/).pop() || path;
	}

	/**
	 * Join path components
	 */
	private joinPath(base: string, name: string): string {
		const separator = base.includes("/") ? "/" : "\\";
		return base.endsWith(separator) ? base + name : base + separator + name;
	}
}
