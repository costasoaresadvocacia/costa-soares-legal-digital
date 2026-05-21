import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useMemo, useRef } from "react";
import { adminUploadImage } from "@/lib/adminApi";
import { toast } from "@/hooks/use-toast";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const RichTextEditor = ({ value, onChange }: Props) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      toast({ title: "Enviando imagem..." });
      const url = await adminUploadImage(file);
      if (!url) {
        toast({ title: "Falha ao enviar imagem", variant: "destructive" });
        return;
      }
      const editor = quillRef.current?.getEditor();
      const range = editor?.getSelection(true);
      editor?.insertEmbed(range?.index || 0, "image", url, "user");
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image", "blockquote"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [],
  );

  return (
    <div className="bg-background rounded-md">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="text-foreground"
      />
    </div>
  );
};

export default RichTextEditor;
