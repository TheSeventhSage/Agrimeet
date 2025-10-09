import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";


export default function TestPage (){

    return <DropZone.Root allowedFileTypes={[".jpg", ".png", ".pdf"]}  maxFileSize={{ mb: 5 }} multiple={true}>
    <DropZone.Area className="rounded-lg border-2 border-dashed border-gray-300 p-8 h-70">
        <p className="text-center text-gray-600">Drop files here or click to browse</p>
    </DropZone.Area>

    <DropZone.FileList className="mt-4 space-y-2">
        {(ctx) => (
            <DropZone.FileItem
                key={ctx.fileState.id}
                fileState={ctx.fileState}
                className="flex items-center gap-4 rounded border p-3"
            >
                <DropZone.FileItemPreview className="h-12 w-12" />
                <DropZone.FileItemMetadata className="flex-1" />
                <DropZone.FileItemProgress className="w-20" />
                <DropZone.FileItemDelete className="text-red-500 hover:text-red-700">
                    ✕
                </DropZone.FileItemDelete>
            </DropZone.FileItem>
        )}
    </DropZone.FileList>
</DropZone.Root>
}