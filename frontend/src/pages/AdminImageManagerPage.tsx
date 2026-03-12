import { useState, useCallback } from "react";
import { GripVertical, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageItem = { id: string; url: string; name?: string };

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export default function AdminImageManagerPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const newItems: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      newItems.push({
        id: generateId(),
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }
    setImages((prev) => [...prev, ...newItems]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setImages((prev) => {
      const next = [...prev];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  const handleDropZoneDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDropZoneActive(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDropZoneOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDropZoneActive(true);
  }, []);

  const handleDropZoneLeave = useCallback(() => {
    setIsDropZoneActive(false);
  }, []);

  const handleListDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleListDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== null && draggedIndex !== index) setDropTargetIndex(index);
  }, [draggedIndex]);

  const handleListDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      if (draggedIndex !== null) {
        moveImage(draggedIndex, toIndex);
      }
      setDraggedIndex(null);
      setDropTargetIndex(null);
    },
    [draggedIndex, moveImage]
  );

  const handleListDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">Image manager</h1>
      <p className="text-muted-foreground mb-8">
        Drag and drop images to upload. Drag items in the list to reorder.
      </p>

      {/* Drop zone: upload new images */}
      <div
        onDrop={handleDropZoneDrop}
        onDragOver={handleDropZoneOver}
        onDragLeave={handleDropZoneLeave}
        className={cn(
          "mb-10 rounded-xl border-2 border-dashed p-12 text-center transition-colors",
          isDropZoneActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 bg-muted/20 hover:border-muted-foreground/50"
        )}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm font-medium text-foreground mb-1">Drop images here</p>
        <p className="text-xs text-muted-foreground mb-4">or click to choose files</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="admin-image-upload"
          onChange={(e) => addFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("admin-image-upload")?.click()}
        >
          Choose files
        </Button>
      </div>

      {/* Reorderable list */}
      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images yet. Drop some above.</p>
      ) : (
        <ul className="space-y-2">
          {images.map((item, index) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => handleListDragStart(index)}
              onDragOver={(e) => handleListDragOver(e, index)}
              onDrop={(e) => handleListDrop(e, index)}
              onDragEnd={handleListDragEnd}
              className={cn(
                "flex items-center gap-4 rounded-lg border bg-card p-3 transition-shadow",
                draggedIndex === index && "opacity-50 shadow-lg",
                dropTargetIndex === index && "ring-2 ring-primary"
              )}
            >
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground shrink-0">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                <img
                  src={item.url}
                  alt={item.name ?? "Image"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.name ?? `Image ${index + 1}`}
                </p>
                <p className="truncate text-xs text-muted-foreground">{item.id}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeImage(item.id)}
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
