export type FileTreeType = 'file' | 'folder';
export type FileTreeCollapsableStatus = 'open' | 'closed';

export type FileTreeFile = {
    type: 'file';
    name: string;
}

export type FileTreeFolder = {
    type: 'folder';
    name: string;
    status: FileTreeCollapsableStatus
    children: FileTreeElement[];
}

export type FileTreeElement = FileTreeFile | FileTreeFolder;

export type FileTreeSection = {
    name: string;
    status: FileTreeCollapsableStatus;
    children: FileTreeElement[];
}

export type FileTree = FileTreeSection[];

export const FolderSeparatorChar = '/';

export const fileTreeSample: FileTree = [
    {
        name: 'src',
        status: 'open',
        children: [
            {
                type: 'folder',
                name: 'components',
                status: 'open',
                children: [
                    {
                        type: 'folder',
                        name: 'file-tree',
                        status: 'open',
                        children: [
                            {
                                type: 'file',
                                name: 'file-tree.ts'
                            },
                            {
                                type: 'file',
                                name: 'file-tree.css'
                            },
                            {
                                type: 'file',
                                name: 'file-tree.html'
                            }
                        ]
                    }
                ]
            },
            {
                type: 'folder',
                name: 'services',
                status: 'open',
                children: [
                    {
                        type: 'folder',
                        name: 'file-tree',
                        status: 'open',
                        children: [
                            {
                                type: 'file',
                                name: 'file-tree.service.xlsx'
                            }
                        ]
                    }
                ]
            }
        ]
    }
];