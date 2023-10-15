import {
  Language,
  StyleName,
} from "@lowcoder-ee/base/codeEditor/codeEditorTypes";
import { EditorState } from "@lowcoder-ee/base/codeEditor/codeMirror";

export interface OpenAIExtensionProps {
  language?: Language;
  value?: string;
  onChange?: (state: EditorState) => void;
  styleName?: StyleName;
  exposingData?: Record<string, any>;
}
